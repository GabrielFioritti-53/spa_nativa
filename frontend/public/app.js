// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Global variables
let usuarios = [];
let usuarioEditandoId = null;

// Cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    // Botones del menú
    document.getElementById('btn-lista').onclick = mostrarLista;
    document.getElementById('btn-crear').onclick = mostrarFormulario;
    
    // Event listeners para el formulario
    document.getElementById('form-usuario').onsubmit = guardarUsuario;
    document.getElementById('btn-cancelar').onclick = mostrarLista;
    
    // Mostrar lista al inicio
    mostrarLista();
});

// Función para hacer peticiones a la API
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            // Intentar obtener el mensaje de error del servidor
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                // Si no se puede parsear el JSON, usar el mensaje por defecto
            }
            
            const error = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // No mostrar el error aquí, dejarlo para las funciones que llaman
        throw error;
    }
}

// Mostrar mensajes de error
function mostrarError(mensaje) {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${mensaje}</p>
            <button onclick="cargarUsuarios()" class="boton">Retry</button>
        </div>
    `;
}

// Mostrar mensaje de carga
function mostrarCargando() {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <p>Loading users from API...</p>
        </div>
    `;
}

// Mostrar lista de usuarios
function mostrarLista() {
    document.getElementById('vista-formulario').style.display = 'none';
    document.getElementById('vista-lista').style.display = 'block';
    usuarioEditandoId = null;
    cargarUsuarios();
}

// Mostrar formulario para crear
function mostrarFormulario() {
    document.getElementById('vista-lista').style.display = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
    document.getElementById('titulo-formulario').textContent = 'Crear Usuario';
    document.getElementById('form-usuario').reset();
    usuarioEditandoId = null;
}

// Cargar usuarios desde la API
async function cargarUsuarios() {
    mostrarCargando();
    
    try {
        usuarios = await fetchAPI('/usuarios');
        
        const lista = document.getElementById('lista-usuarios');
        
        if (usuarios.length === 0) {
            lista.innerHTML = `
                <div class="empty-message">
                    <h3>No users found</h3>
                    <p>Click "Crear Usuario" to add the first user.</p>
                </div>
            `;
            return;
        }
        
        lista.innerHTML = '';
        usuarios.forEach(usuario => {
            lista.innerHTML += `
                <div class="usuario" data-id="${usuario.id}">
                    <div class="info-usuario">
                        <h3>${usuario.nombre}</h3>
                        <p>ID: ${usuario.id}</p>
                        <p>Email: ${usuario.email}</p>
                    </div>
                    <div class="botones-usuario">
                        <button class="boton editar" onclick="editar(${usuario.id})">Modificar</button>
                        <button class="boton eliminar" onclick="eliminar(${usuario.id})">Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        // Add success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <p>✅ Cargados ${usuarios.length} usuarios desde la API</p>
        `;
        lista.insertBefore(successDiv, lista.firstChild);
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Editar usuario
function editar(id) {
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario) {
        mostrarError('User not found');
        return;
    }
    
    document.getElementById('vista-lista').style.display = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
    document.getElementById('titulo-formulario').textContent = 'Editar Usuario';
    
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('email').value = usuario.email;
    
    // Guardar el ID del usuario que editamos
    usuarioEditandoId = id;
}

// Eliminar usuario
async function eliminar(id) {
    const usuario = usuarios.find(u => u.id === id);
    const nombreUsuario = usuario ? usuario.nombre : 'el usuario';
    
    if (!confirm(`¿Estás seguro de que deseas eliminar a ${nombreUsuario}?`)) {
        return;
    }
    
    console.log(`Intentando eliminar usuario con ID: ${id}`);
    
    try {
        // Usar la API real para eliminar el usuario
        const response = await fetchAPI(`/usuarios/${id}`, { 
            method: 'DELETE' 
        });
        
        console.log('Usuario eliminado exitosamente:', response);
        
        // Mostrar mensaje de éxito con el nombre del usuario eliminado
        mostrarMensajeExito(`Usuario "${response.usuarioEliminado.nombre}" eliminado correctamente`);
        
        // Recargar la lista desde la API para mostrar los cambios
        cargarUsuarios();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        mostrarError('Error al eliminar el usuario: ' + error.message);
    }
}

// Guardar usuario (crear o editar)
async function guardarUsuario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!nombre || !email) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }
    
    // Disable form while saving
    const form = document.getElementById('form-usuario');
    const saveButton = form.querySelector('button[type="submit"]');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Guardando...';
    saveButton.disabled = true;
    
    try {
        if (usuarioEditandoId) {
            // Editar usuario existente usando la API
            const response = await fetchAPI(`/usuarios/${usuarioEditandoId}`, {
                method: 'PUT',
                body: JSON.stringify({ nombre, email })
            });
            
            mostrarMensajeExito(`Usuario "${nombre}" actualizado correctamente`);
            
        } else {
            // Crear nuevo usuario usando la API
            const response = await fetchAPI('/usuarios', {
                method: 'POST',
                body: JSON.stringify({ nombre, email })
            });
            
            mostrarMensajeExito(`Usuario "${nombre}" creado correctamente con ID: ${response.id}`);
        }
        
        // Recargar la lista desde la API para mostrar los cambios
        mostrarLista();
        
    } catch (error) {
        console.error('Error saving user:', error);
        mostrarError('Error al guardar el usuario: ' + error.message);
    } finally {
        // Re-enable form
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    }
}

// Mostrar mensaje de éxito
function mostrarMensajeExito(mensaje) {
    const lista = document.getElementById('lista-usuarios');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-temp';
    successDiv.innerHTML = `<p>✅ ${mensaje}</p>`;
    
    // Insert at the top
    lista.insertBefore(successDiv, lista.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Function to refresh data from API
async function refrescarDatos() {
    await cargarUsuarios();
}
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        mostrarError(`Error connecting to API: ${error.message}`);
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
    if (!confirm(' Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }
    
    try {
        // For now, we'll just filter locally since the API doesn't have DELETE endpoint
        // In a real scenario, you would make a DELETE request to /usuarios/:id
        usuarios = usuarios.filter(u => u.id !== id);
        
        // Update the UI immediately
        const userElement = document.querySelector(`[data-id="${id}"]`);
        if (userElement) {
            userElement.remove();
        }
        
        // Show success message
        mostrarMensajeExito('Usuario eliminado con éxito (solo local)');
        
        // Note: In a real API, you would do:
        // await fetchAPI(`/usuarios/${id}`, { method: 'DELETE' });
        // Then reload the list: cargarUsuarios();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        mostrarError('Error deleting user');
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
    
    // Disable form while saving
    const form = document.getElementById('form-usuario');
    const saveButton = form.querySelector('button[type="submit"]');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;
    
    try {
        if (usuarioEditandoId) {
            // Edit existing user (local only for now)
            const usuario = usuarios.find(u => u.id === usuarioEditandoId);
            if (usuario) {
                usuario.nombre = nombre;
                usuario.email = email;
                mostrarMensajeExito('Usuario actualizado con éxito (solo local)');
            }
            
            // Note: In a real API, you would do:
            // await fetchAPI(`/usuarios/${usuarioEditandoId}`, {
            //     method: 'PUT',
            //     body: JSON.stringify({ nombre, email })
            // });
            
        } else {
            // Create new user (local only for now)
            const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
            const nuevoUsuario = { id: nuevoId, nombre, email };
            usuarios.push(nuevoUsuario);
            mostrarMensajeExito('Usuario creado con éxito (solo local)');
            
            // Note: In a real API, you would do:
            // const nuevoUsuario = await fetchAPI('/usuarios', {
            //     method: 'POST',
            //     body: JSON.stringify({ nombre, email })
            // });
        }
        
        mostrarLista();
        
    } catch (error) {
        console.error('Error saving user:', error);
        mostrarError('Error saving user');
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
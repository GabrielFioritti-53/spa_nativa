// Cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    // Botones del menú
    document.getElementById('btn-lista').onclick = mostrarLista;
    document.getElementById('btn-crear').onclick = mostrarFormulario;
    
    // el resto de botones
    document.getElementById('btn-guardar').onclick = cargarUsuarios;
    document.getElementById('form-usuario').onsubmit = guardarUsuario;
    document.getElementById('btn-cancelar').onclick = mostrarLista;
    
    // Mostrar lista al inicio
    mostrarLista();
});

// Mostrar lista de usuarios
function mostrarLista() {
    document.getElementById('vista-formulario').style.display = 'none';
    document.getElementById('vista-lista').style.display = 'block';
    cargarUsuarios();
}

// Mostrar formulario para crear
function mostrarFormulario() {
    document.getElementById('vista-lista').style.display = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
    document.getElementById('titulo-formulario').textContent = 'Crear Usuario';
    document.getElementById('form-usuario').reset();
}

// Cargar usuarios en la lista
function cargarUsuarios() {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = '';
    usuarios.forEach(usuario => {
        lista.innerHTML += `
            <div class="usuario">
                <div class="info-usuario">
                    <h3>${usuario.nombre}</h3>
                    <p>Email: ${usuario.email}</p>
                </div>
                <div class="botones-usuario">
                    <button class="boton editar" onclick="editar(${usuario.id})">Modificar</button>
                    <button class="boton eliminar" onclick="eliminar(${usuario.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
}

// Editar usuario
function editar(id) {
    const usuario = usuarios.find(u => u.id === id);
    
    document.getElementById('vista-lista').style.display = 'none';
    document.getElementById('vista-formulario').style.display = 'block';
    document.getElementById('titulo-formulario').textContent = 'Editar Usuario';
    
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('email').value = usuario.email;
    
    // Guardar el ID del usuario que editamos
    window.usuarioEditandoId = id;
}

// Eliminar usuario
function eliminar(id) {
    usuarios = usuarios.filter(u => u.id !== id);
    cargarUsuarios();
}

// Guardar usuario (crear o editar)
function guardarUsuario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    
    if (window.usuarioEditandoId) {
        // Editar usuario existente
        const usuario = usuarios.find(u => u.id === window.usuarioEditandoId);
        usuario.nombre = nombre;
        usuario.email = email;
        window.usuarioEditandoId = null;
    } else {
        // Crear nuevo usuario
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        usuarios.push({ id: nuevoId, nombre, email});
    }
    
    mostrarLista();
}
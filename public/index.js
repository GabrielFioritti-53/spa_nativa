async function obtenerUsuarios() {
  const res = await fetch("http://localhost:3000/usuarios");
  return res.json();
}

async function listarUsuarios() {
  const listaUsuarios = document.getElementById("listarUsuarios");
  const usuarios = await obtenerUsuarios();
  listaUsuarios.innerHTML = usuarios
    .map(
      (u) =>
        `<li>
        ${u.nombre} ${u.apellido}
      </li>`
    )
    .join("");
}

/* Aqui debe haber un archivo fastify con las rutas del front y fuera otro con lo que se pida */
async function crearUsuario(event) {
  event.preventDefault();
  const miForm = document.getElementById("miForm");
  const nombre = miForm.elements["nombre"].value.trim();
  const apellido = miForm.elements["apellido"].value.trim();

  await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido }),
  });

  miForm.reset();
  listarUsuarios();
}

listarUsuarios();
document.getElementById("miForm").addEventListener("submit", crearUsuario);

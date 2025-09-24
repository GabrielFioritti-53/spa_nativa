export let usuarios = [
    { id: 1, nombre: "Paula", apellido: "Tomas", email: "paulatomas@gmail.com" },
    { id: 2, nombre: "Benja", apellido: "Fioritti", email: "gfioritti@gmail.com" }
];

export default async function routes(fastify, options) {


fastify.get("/usuarios", async () => usuarios);


fastify.get("/usuarios/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        reply.code(404).send({ error: "Usuario no encontrado" });
    }
    return usuario;
});

fastify.post("/usuarios", async (request, reply) => {
    const nuevo = { id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1, ...request.body };
    usuarios.push(nuevo);
    return nuevo;
});


fastify.put("/usuarios/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
        reply.code(404).send({ error: "Usuario no encontrado" });
    }
    usuarios[index] = { id, ...request.body };
    return usuarios[index];
});

fastify.delete("/usuarios/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return reply.code(404).send({ error: "Usuario no encontrado" });
    usuarios.splice(index, 1);
    return { message: "Usuario eliminado" };
});

}

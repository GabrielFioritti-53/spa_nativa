import { usuarios } from "../server.js";

export default async function usuarioRoutes(fastify) {
  // Ruta GET - Obtener todos los usuarios
  fastify.get(
    "/usuarios",
    {
      schema: {
        tags: ["Usuarios"],
        summary: "Obtener todos los usuarios",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                nombre: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      // Aquí va la lógica de tu ruta
      return usuarios;
    }
  );

  // Ruta POST - Crear nuevo usuario
  fastify.post(
    "/usuarios",
    {
      schema: {
        tags: ["Usuarios"],
        summary: "Crear un nuevo usuario",
        body: {
          type: "object",
          required: ["nombre", "email"],
          properties: {
            nombre: { type: "string" },
            email: { type: "string", format: "email" },
            edad: { type: "number" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              mensaje: { type: "string" },
              id: { type: "number" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const { nombre, email, edad } = request.body;

      // Lógica para crear usuario
      const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        email,
        edad,
      };

      usuarios.push(nuevoUsuario);

      reply.code(201);
      return { mensaje: "Usuario creado", id: nuevoUsuario.id };
    }
  );
}

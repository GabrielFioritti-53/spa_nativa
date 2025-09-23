import { usuarios } from "../server.js";

export default async function usuarioRoutes(fastify) {
  // GET - Obtener todos los usuarios
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
      return usuarios;
    }
  );

  // GET - Obtener un usuario por ID
  fastify.get(
    "/usuarios/:id",
    {
      schema: {
        tags: ["Usuarios"],
        summary: "Obtener un usuario por ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              nombre: { type: "string" },
              email: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params;
      const usuario = usuarios.find((u) => u.id === parseInt(id));

      if (!usuario) {
        reply.code(404);
        return { error: "Usuario no encontrado" };
      }

      return usuario;
    }
  );

  // POST - Crear nuevo usuario
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
      const { nombre, email } = request.body;

      const nuevoUsuario = {
        id:
          usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
        nombre,
        email,
      };

      usuarios.push(nuevoUsuario);
      reply.code(201);
      return { mensaje: "Usuario creado", id: nuevoUsuario.id };
    }
  );

  // PUT - Actualizar usuario existente
  fastify.put(
    "/usuarios/:id",
    {
      schema: {
        tags: ["Usuarios"],
        summary: "Actualizar un usuario existente",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        body: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              mensaje: { type: "string" },
              usuario: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  nombre: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params;
      const { nombre, email } = request.body;

      const usuarioIndex = usuarios.findIndex((u) => u.id === parseInt(id));

      if (usuarioIndex === -1) {
        reply.code(404);
        return { error: "Usuario no encontrado" };
      }

      // Actualizar solo los campos proporcionados
      if (nombre) usuarios[usuarioIndex].nombre = nombre;
      if (email) usuarios[usuarioIndex].email = email;

      return {
        mensaje: "Usuario actualizado",
        usuario: usuarios[usuarioIndex],
      };
    }
  );

  // DELETE - Eliminar usuario
  fastify.delete(
    "/usuarios/:id",
    {
      schema: {
        tags: ["Usuarios"],
        summary: "Eliminar un usuario",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              mensaje: { type: "string" },
              usuarioEliminado: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  nombre: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params;
      const usuarioIndex = usuarios.findIndex((u) => u.id === parseInt(id));

      if (usuarioIndex === -1) {
        reply.code(404);
        return { error: "Usuario no encontrado" };
      }

      const usuarioEliminado = usuarios.splice(usuarioIndex, 1)[0];

      return {
        mensaje: "Usuario eliminado",
        usuarioEliminado,
      };
    }
  );
}

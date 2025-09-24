import Fastify from "fastify";
import swagger from "./plugins/swagger.js";
import usuarioRoutes from "./routes/routes.js";

/* Api Rest */

export const usuarios = [
  {
    id: 1,
    nombre: "Paula",
    email: "paula.tomas@email.com",
  },
  {
    id: 2,
    nombre: "Pepe",
    email: "pepe.sanchez@email.com",
  },
  {
    id: 3,
    nombre: "Juan",
    email: "juan.perez@email.com",
  },
];

const fastify = Fastify({
  logger: true,
});

// Enable CORS for frontend connection
fastify.register(import('@fastify/cors'), {
  origin: ['http://localhost:4000', 'http://127.0.0.1:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

fastify.register(swagger);
fastify.register(usuarioRoutes);

try {
  await fastify.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

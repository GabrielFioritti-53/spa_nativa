import Fastify from "fastify";
import swagger from "./plugins/swagger.js";
import usuarioRoutes from "./routes/routes.js";

/* Api Rest */

export const usuarios = [
  { nombre: "Paula", apellido: "Tomas" },
  { nombre: "Pepe", apellido: "Sanchez" },
  { nombre: "Juan", apellido: "Perez" },
];

const fastify = Fastify({
  logger: true,
});

fastify.register(swagger);

fastify.register(usuarioRoutes);

try {
  await fastify.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

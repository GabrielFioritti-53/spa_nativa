import Fastify from "fastify";
import swagger from "./plugins/swagger.js";
import autoLoad from "@fastify/autoload";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fastify.register(autoLoad, {
  dir: join(__dirname, "routes"),
});

try {
  await fastify.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

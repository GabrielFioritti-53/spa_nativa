import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { dirname, join } from "path";
import swagger from "./plugins/swagger.js";
/* Api Rest */

export const usuarios = [
  { nombre: "Paula", apellido: "Tomas" },
  { nombre: "Pepe", apellido: "Sanchez" },
  { nombre: "Juan", apellido: "Perez" },
];

const fastify = Fastify({
  logger: true,
});

const rutaPublic = join(dirname(process.argv[1]), "public");

fastify.register(swagger);
fastify.register(fastifyStatic, {
  root: rutaPublic,
  prefix: "/",
});

fastify.get("/usuarios", async function (req, res) {
  res.sendFile("text/html");
  return usuarios;
});

fastify.post("/usuarios", async function (req, res) {});

try {
  await fastify.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

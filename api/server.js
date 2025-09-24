import Fastify from "fastify";
import cors from '@fastify/cors'
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import AutoLoad from "@fastify/autoload";

/* Api Rest */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: 'http://localhost:4000',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});

// Rutas después
await fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
});


try {
  await fastify.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
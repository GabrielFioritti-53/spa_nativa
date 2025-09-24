import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from 'url';
import path from 'path';

const fastify = Fastify({ logger: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/',
});

fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

const start = async () => {
    try {
        await fastify.listen({ port: 4000});
        console.log('Frontend ejecutándose en http://localhost:4000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
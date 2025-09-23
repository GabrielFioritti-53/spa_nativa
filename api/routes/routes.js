export default async function usuarioRoutes(fastify) {
  fastify.get("/usuarios", async function (req, res) {
    res.sendFile("text/html");
    return usuarios;
  });

  fastify.post("/usuarios", async function (req, res) {});
}

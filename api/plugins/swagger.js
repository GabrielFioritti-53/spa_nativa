import swagger from "@fastify/swagger";
import swaggerui from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "API Server-Type",
        description: "API REST con Fastify, JavaScript y Swagger",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
    },
  });

  // Registrar Swagger UI
  await fastify.register(swaggerui, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});

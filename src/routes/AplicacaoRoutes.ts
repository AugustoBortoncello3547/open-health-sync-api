import type { FastifyInstance } from "fastify";

export async function aplicacaoRoutes(app: FastifyInstance) {
  app.get("/", () => {
    return "Hello World";
  });
}

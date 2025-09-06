import { buildApp } from "./app.js";
import { AmbienteApiEnum } from "./enums/ambiente-api-enum.js";

async function start() {
  try {
    const app = await buildApp();

    const port = Number(process.env.PORT) || 3333;
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({
      port,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : host,
    });

    console.log(`🚀 HTTP Server is running on http://${host}:${port}`);
    console.log(`📚 Swagger docs available at http://${host}:${port}/docs`);
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

const isLocalEnvironment = process.env.AMBIENTE === AmbienteApiEnum.LOCAL;
if (isLocalEnvironment) {
  start();
}

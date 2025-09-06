import { buildApp } from "../src/index.js";

export default async function handler(req: any, res: any) {
  try {
    const app = await buildApp();
    await app.ready();

    return app.server.emit("request", req, res);
  } catch (error) {
    console.error("Error in Vercel handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

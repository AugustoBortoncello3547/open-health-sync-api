import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildApp } from "./app.js";

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Inicializa a aplicação apenas uma vez (cache)
    if (!app) {
      app = await buildApp();
      await app.ready();
    }

    await app
      .inject({
        method: req.method,
        url: req.url,
        headers: req.headers,
        payload: req.body,
      })
      .then((response: any) => {
        res.status(response.statusCode);

        // Define os headers
        Object.keys(response.headers).forEach((key) => {
          res.setHeader(key, response.headers[key]);
        });

        res.send(response.payload);
      });
  } catch (error) {
    console.error("Erro no handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

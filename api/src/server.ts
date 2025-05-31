import filesRouter from "./files";

require('module-alias/register');
import express, {Express} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {json, urlencoded} from "body-parser";
import {NextFunction, Request, Response} from "express";

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', " https://aa17-195-113-187-136.ngrok-free.app"];

export const createServer = (): Express => {
  const app = express();

  app
    .disable("x-powered-by")
    .use(json())
    .use(urlencoded({extended: true}))
    .use(cookieParser(process.env.JWT_SECRET))
    .use(
      cors({
        origin: allowedOrigins,
        credentials: true, // Permet d'envoyer les cookies avec les requêtes cross-origin
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Méthodes HTTP autorisées
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // En-têtes autorisés
      })
    )
    .use("/files", filesRouter)
    .use((err: unknown, req: Request, res: Response, next: NextFunction) => {
      res.status(500).send("Something went wrong");
    });

  return app;
};

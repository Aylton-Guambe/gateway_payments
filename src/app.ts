import express from "express";
import cors from "cors";
import helmet from "helmet";
import { registerRoutes } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  registerRoutes(app);

  return app;
}

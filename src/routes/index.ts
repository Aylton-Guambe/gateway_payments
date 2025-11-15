import type { Express } from "express";
import healthRoutes from "./health.routes";
import paymentsRoutes from "./payments.routes";

export function registerRoutes(app: Express) {
  app.use("/health", healthRoutes);
  app.use("/payments", paymentsRoutes);
}

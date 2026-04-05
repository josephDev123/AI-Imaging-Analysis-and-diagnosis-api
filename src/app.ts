import express from "express";
import type { IConfig } from "./config.js";
import { HealthRouter } from "./features/health/routes.js";
import { MedImagingRouter } from "./features/medlmagingAnalysis/routes.js";
import cors from "cors";

export async function App(config: IConfig) {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/api", HealthRouter(config));
  app.use("/api/med-imaging", MedImagingRouter(config));
  return app;
}

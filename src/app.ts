import express from "express";
import type { IConfig } from "./config.js";
import { HealthRouter } from "./features/health/routes.js";
import { MedImagingRouter } from "./features/medlmagingAnalysis/routes.js";
import cors from "cors";
import { GlobalErrorMiddleware } from "./middlewares/GlobalErrorMiddleware.js";
import type { Logger } from "pino";
import { ratelimiter } from "./lib/rateLimiter.js";

export async function App(config: IConfig, logger: Logger) {
  let windowMs = 5 * 60 * 1000;
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(GlobalErrorMiddleware(logger));

  app.use("/api", HealthRouter(config));
  app.use(
    "/api/med-imaging",
    ratelimiter({
      windowMs: windowMs,
      limit: 4,
      standardHeaders: "draft-8",
      legacyHeaders: true,
    }),
    MedImagingRouter(config),
  );
  return app;
}

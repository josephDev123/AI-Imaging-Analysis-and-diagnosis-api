import { Router, type Request, type Response } from "express";
import type { IConfig } from "../config.js";

export function HealthRouter(config: IConfig) {
  const router = Router();

  router.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "healthy" });
  });

  return router;
}

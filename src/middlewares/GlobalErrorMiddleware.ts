import type { NextFunction, Request, Response } from "express";
import { GlobalErrorHandler } from "../lib/shared/GlobalErrorHandler.js";
import type { Logger } from "pino";

export function GlobalErrorMiddleware(logger: Logger) {
  return (err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.warn(
      { error: err },
      err instanceof Error ? err.message : "Unknown error",
    );
    if (err instanceof GlobalErrorHandler) {
      if (err.operational) {
        logger.warn({ error: err }, err.message);
        res.status(err.statusCode).json({
          name: err.name,
          message: err.message,
        });
        return;
      } else {
        logger.error({ error: err }, "Non-operational error");
        res.status(err.statusCode).json({
          name: err.name,
          message: "Something went wrong",
        });
        return;
      }
    }

    if (err instanceof Error) {
      logger.error({ error: err }, "Unexpected error");
      res.status(500).json({
        name: err.name,
        message: "Internal Server Error",
      });
      return;
    }

    logger.fatal({ error: err }, "Unknown error");
    res.status(500).json({
      name: "UnknownError",
      message: "Internal Server Error",
    });
    return;
  };
}

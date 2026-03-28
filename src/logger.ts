import pino from "pino";
import type { LoggerConfig } from "./config.js";

export function createLogger(options: LoggerConfig) {
  return pino({
    level: options.level,
    ...(options.pretty
      ? {
          transport: {
            target: "pino-pretty",
            options: { destination: 1 },
          },
        }
      : {
          transport: {
            target: "pino/file",
            options: { destination: "./logs", append: false },
          },
        }),
  });
}

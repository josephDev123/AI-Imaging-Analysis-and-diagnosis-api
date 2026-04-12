import z from "zod";
import dotenv from "dotenv";

export const configSchema = z.object({
  port: z.coerce.number().default(4000),
  logger: z.object({
    level: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),
    pretty: z.coerce.boolean().default(false),
  }),
  OPENAI_API_KEY: z.string().min(5),
  REDIS_URL: z.string().min(5),
  REDIS_HOST: z.string().min(5),
  REDIS_PORT: z.coerce.number().min(5),
  REDIS_PASSWORD: z.string().min(5),
});

export type IConfig = z.infer<typeof configSchema>;
export type LoggerConfig = z.output<typeof configSchema.shape.logger>;

export type ILevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

export function loadConfig() {
  dotenv.config();
  const envConfig: IConfig = {
    port: Number(process.env.PORT) || 4000,
    logger: {
      level: (process.env.LOG_LEVEL as ILevel) || "info",
      pretty: process.env.LOG_PRETTY === "true",
    },
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    REDIS_URL: process.env.REDIS_URL!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
  };

  const config = configSchema.parse(envConfig);
  return config;
}

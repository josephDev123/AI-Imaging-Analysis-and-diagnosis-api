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
  // HF_TOKEN: z.string().min(5),
  // REDIS_URL: z.string().min(5),
  REDIS_HOST: z.string().min(5),
  REDIS_PORT: z.coerce.number().min(5),
  REDIS_PASSWORD: z.string().min(5),
  // LANGSMITH_PROJECT: z.string().min(5),
  LANGSMITH_TRACING: z.coerce.boolean(),
  // LANGSMITH_API_KEY: z.string().min(5),
  GOOGLE_API_KEY: z.string().min(5),
  // LANGSMITH_WORKSPACE_ID: z.string().min(5),
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
    // HF_TOKEN: process.env.HF_TOKEN!,
    // REDIS_URL: process.env.REDIS_URL!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: Number(process.env.REDIS_PORT!),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
    // LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY as string,
    // LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT as string,
    LANGSMITH_TRACING: Boolean(process.env.LANGSMITH_TRACING),
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY as string,
    // LANGSMITH_WORKSPACE_ID: process.env.LANGSMITH_WORKSPACE_ID as string,
  };

  const config = configSchema.parse(envConfig);
  // console.log("config", config);
  return config;
}

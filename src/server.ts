import type { Logger } from "pino";
import { App } from "./app.js";
import { loadConfig } from "./config.js";
import { createLogger } from "./logger.js";

(async function startServer() {
  let config;
  try {
    config = loadConfig();
    // console.log("Configuration loaded:", config);
  } catch (error) {
    console.log("Error loading configuration:", error);
    process.exit(1);
  }

  let logger: Logger;
  try {
    logger = createLogger(config.logger);
    logger.info("Logger initialized");
  } catch (error) {
    console.log("Error initializing logger:", error);
  }

  try {
    const app = await App(config);
    app.listen(config.port, () => {
      logger.info({ port: config.port }, `Server is running on ${config.port}`);
    });
  } catch (error) {
    console.log({ error }, "Error starting server:");
    process.exit(1);
  }
})();

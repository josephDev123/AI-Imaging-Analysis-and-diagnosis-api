import { Worker } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

const worker = new Worker(
  "mail",
  async (job) => {
    console.log("Processing job:", job.data);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
  },
);

worker.on("ready", () => {
  console.log("Worker is ready");
});

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed: ${job?.id}`, err);
});

worker.on("error", (err) => {
  console.log("Worker error:", err);
});

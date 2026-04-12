import { Queue } from "bullmq";

export async function QueueConnect(
  host: string,
  port: number,
  password: string,
) {
  try {
    const InitQueue = new Queue("mail", {
      connection: {
        host,
        password,
        port,
        // username:"",
        maxRetriesPerRequest: 1,
      },
    });
    console.log("Queue connected");
    return InitQueue;
  } catch (error) {
    console.log("bullmq error", error);
    throw error;
  }
}

import { Queue } from "bullmq";
const connectionString = "";

export const BullQueue = new Queue("mail");

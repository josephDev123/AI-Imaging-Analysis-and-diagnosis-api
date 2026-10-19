import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
dotenv.config();

// export const model = new ChatOpenAI({
//   model: "Qwen/Qwen2.5-VL-7B-Instruct:featherless-ai",
//   apiKey: process.env.HF_TOKEN!,
//   configuration: {
//     baseURL: "https://router.huggingface.co/v1",
//   },
//   temperature: 0.2,
//   maxTokens: 1000,
// });

import { initChatModel } from "langchain";

// export async function model() {
export const model = await initChatModel("gemini-3.5-flash-lite", {
  modelProvider: "google-genai",
  // apiKey: process.env.GOOGLE_API_KEY,
});
//   return model;
// }

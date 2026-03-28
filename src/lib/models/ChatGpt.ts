import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: "openai/gpt-4.1",
  apiKey: process.env.OPENAI_API_KEY!,
  configuration: {
    baseURL: "https://models.github.ai/inference",
  },
  temperature: 0.2,
  maxTokens: 1000,
});

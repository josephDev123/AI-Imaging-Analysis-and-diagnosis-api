import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { getMedicalReferenceCitationLink } from "./tools/getMedicalReferenceCitationLink.js";
import { prompt } from "./prompt.js";
import { MedicalImagingReportSchema } from "./schema/responseFormat.js";
import { type ChatOpenAI, type ChatOpenAICallOptions } from "@langchain/openai";
import crypto from "node:crypto";
import { medicalWaveformGuard } from "./langchain_middlewares/CustomIsMedicalImaging.js";
import { GlobalErrorHandler } from "../../lib/shared/GlobalErrorHandler.js";
import type { Queue } from "bullmq";

export class MedImagingService {
  constructor(
    private readonly model: ChatOpenAI<ChatOpenAICallOptions>,
    private readonly MailQueue: Queue,
  ) {}

  async create(upload: Express.Multer.File) {
    const threadId = crypto.randomUUID();
    const fileBuffer = upload.buffer;

    // Convert to Base64
    const imageBase64 = fileBuffer.toString("base64");

    // Build a data URI for the agent

    const ext = upload.mimetype.split("/")[1];
    const imageDataUri = `data:image/${ext};base64,${imageBase64}`;
    try {
      const agent = createAgent({
        tools: [getMedicalReferenceCitationLink],
        middleware: [medicalWaveformGuard],
        model: this.model,
        checkpointer: new MemorySaver(),
        systemPrompt: prompt,
        responseFormat: MedicalImagingReportSchema,
      });

      const result = await agent.invoke(
        {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this medical image and generate the diagnostic report.",
                },
                { type: "image_url", image_url: { url: imageDataUri } },
              ],
            },
          ],
        },
        {
          configurable: {
            thread_id: threadId,
          },
          context: { email: "" },
        },
      );

      // console.log("message", result.messages);
      await this.MailQueue.add("medicalResult", result.structuredResponse);

      return result.structuredResponse;
    } catch (error) {
      if (error instanceof GlobalErrorHandler) {
        throw error;
      }

      if (error instanceof Error) {
        throw new GlobalErrorHandler(error.name, error.message, 500, false);
      }

      throw new GlobalErrorHandler(
        "Unknown",
        "Something went wrong",
        500,
        false,
      );
    }
  }
}

import { createMiddleware, AIMessage } from "langchain";
import { z } from "zod";
// import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "../../../lib/models/ChatGpt.js";
import { REJECTED_RESPONSE } from "../data/RejectedResponse.js";

const ImageValidationSchema = z.object({
  isValidWaveform: z
    .boolean()
    .describe(
      "True ONLY if this is a clear medical diagnostic imaging (ECG/EKG tracing, EEG, X-rays, MRIs, etc.) showing squiggly lines/waves on a grid with labels like Lead I, II, V1-V6, time/voltage scales. False for photos,  text, memes, etc.",
    ),
  detectedType: z.enum([
    "ECG",
    "EEG",
    "other_waveform",
    "medical_imaging",
    "non_medical",
    "other_medical",
  ]),
  reason: z.string().describe("One-sentence explanation."),
});

type ImageValidation = z.infer<typeof ImageValidationSchema>;

// Helper: Convert Buffer to message content with image
// function createImageMessage(
//   imageBuffer: Buffer,
//   mimeType: string = "image/jpeg",
// ): HumanMessage {
//   const base64 = imageBuffer.toString("base64");
//   return new HumanMessage({
//     content: [
//       {
//         type: "text",
//         text: "Is this a valid medical waveform diagnostic image?",
//       },
//       {
//         type: "image_url",
//         image_url: { url: `data:${mimeType};base64,${base64}` },
//       },
//     ],
//   });
// }

export const medicalWaveformGuard = createMiddleware({
  name: "MedicalWaveformGuard",
  beforeAgent: {
    canJumpTo: ["end"],

    hook: async (state) => {
      const messages = state.messages || [];
      const firstMessage = messages[0];

      let imagePart: any = null;

      // ✅ Extract image properly
      if (Array.isArray(firstMessage?.content)) {
        imagePart = firstMessage.content.find(
          (part: any) => part.type === "image_url",
        );
      }

      if (!imagePart) {
        return {
          //   messages: [
          //     new AIMessage(
          //       "❌ No image found. Please upload a medical waveform image.",
          //     ),
          //   ],
          structuredResponse: REJECTED_RESPONSE,
          jumpTo: "end",
        };
      }

      try {
        const parser = StructuredOutputParser.fromZodSchema(
          ImageValidationSchema,
        );

        const validation = await model.withStructuredOutput(parser).invoke([
          new SystemMessage(
            `You are a strict gatekeeper. Only allow ECG/EKG waveform graphs, X-rays, MRIs, medical imaging  that are not text-based heavy etc. Reject everything else.`,
          ),
          new HumanMessage({
            content: [
              { type: "text", text: "Validate this image." },
              imagePart,
            ],
          }),
        ]);

        if (!validation.isValidWaveform) {
          return {
            // messages: [
            //   new AIMessage(
            //     `❌ Only ECG/EEG waveform images are allowed.\n\nReason: ${validation.reason}`,
            //   ),
            // ],
            structuredResponse: REJECTED_RESPONSE,
            jumpTo: "end",
          };
        }

        // ✅ allow flow to continue
        return state;
      } catch (error) {
        console.error("Validation error:", error);

        return {
          //   messages: [
          //     new AIMessage(
          //       "❌ Image validation failed. Please upload a valid waveform.",
          //     ),
          //   ],
          structuredResponse: REJECTED_RESPONSE,
          jumpTo: "end",
        };
      }
    },
  },
});

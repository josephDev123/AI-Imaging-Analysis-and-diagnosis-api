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
          structuredResponse: REJECTED_RESPONSE,
          jumpTo: "end",
        };
      }

      try {
        const validation = await model
          // .withStructuredOutput(parser)
          .withStructuredOutput(ImageValidationSchema)
          .invoke([
            new SystemMessage(
              `
  "You are an image classifier. Determine if this image appears to be a medical imaging (like ECG, X-ray, MRI, or waveform-like data) or not. Do not provide medical advice."          
            // "Allow any medical imaging including ECG, X-ray, MRI, or waveform-like data. Only reject clearly non-medical images like memes or selfies."
            `,
            ),
            new HumanMessage({
              content: [
                { type: "text", text: "Validate this image." },
                imagePart,
              ],
            }),
          ]);
        console.log("Validation result:", validation);
        if (!validation.isValidWaveform) {
          return {
            structuredResponse: REJECTED_RESPONSE,
            jumpTo: "end",
          };
        }

        console.log("result", validation);

        // ✅ allow flow to continue
        return state;
      } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as any).code === "content_filter"
        ) {
          return state;
        }

        return {
          structuredResponse: REJECTED_RESPONSE,
          jumpTo: "end",
        };
      }
    },
  },
});

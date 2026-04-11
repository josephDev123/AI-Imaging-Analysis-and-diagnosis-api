import type z from "zod";
import type { MedicalImagingReportSchema } from "../schema/responseFormat.js";

export const REJECTED_RESPONSE: z.infer<typeof MedicalImagingReportSchema> = {
  observations: [],
  detailedDescription:
    "The provided image is not a valid medical imaging diagnostic image. No analysis performed.",

  abnormalAreas: [],

  rankedDiagnoses: [],

  differentialDiagnoses: [],

  severity: {
    level: "Normal",
    justification: "Invalid input type - not a medical image.",
    urgent: false,
  },

  patientExplanation:
    "The uploaded image is not a valid medical imaging (such as ECG, EEG, MRI, X-RAY etc), so no medical interpretation could be made.",

  firstPrinciplesBreakdown: {
    normalFunction: "Not applicable due to invalid input.",
    whatChanged: "No valid medical data detected.",
    whyItMatters: "Accurate diagnosis requires proper medical imaging data.",
    howImagingShowsThis:
      "The image does not match expected medical Imaging characteristics.",
  },
};

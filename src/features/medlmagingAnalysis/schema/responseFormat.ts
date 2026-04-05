import { z } from "zod";

export const MedicalImagingReportSchema = z.object({
  observations: z.array(z.string()),

  detailedDescription: z.string(),

  abnormalAreas: z.array(
    z.object({
      location: z.string(),
      description: z.string(),
      extent: z.string(),
      abnormalityReason: z.string(),
    }),
  ),

  rankedDiagnoses: z.array(
    z.object({
      condition: z.string(),
      likelihood: z.enum(["High", "Moderate", "Low"]),
      rationale: z.string(),
      supportingFindings: z.array(z.string()),
      contradictingFindings: z.array(z.string()).nullable(),
      references: z.array(z.string()),
    }),
  ),

  differentialDiagnoses: z.array(
    z.object({
      condition: z.string(),
      distinguishingTest: z.string(),
      reasoning: z.string(),
    }),
  ),

  severity: z.object({
    level: z.enum(["Normal", "Mild", "Moderate", "Severe", "Critical"]),
    justification: z.string(),
    urgent: z.boolean(),
  }),

  patientExplanation: z.string(),

  firstPrinciplesBreakdown: z.object({
    normalFunction: z.string(),
    whatChanged: z.string(),
    whyItMatters: z.string(),
    howImagingShowsThis: z.string(),
  }),
});

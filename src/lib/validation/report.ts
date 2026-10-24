import { z } from "zod";

export const ClinicalReportSchema = z.object({
  mainReasonForVisit: z.string().default("Not reported"),
  symptoms: z.array(z.string()).default([]),
  timeline: z
    .object({
      onset: z.string().default("Not reported"),
      duration: z.string().default("Not reported"),
      progression: z.string().default("Not reported"),
      frequency: z.string().default("Not reported"),
    })
    .default({}),
  location: z.string().default("Not reported"),
  severity: z.string().default("Not reported"),
  pain: z
    .object({
      present: z.boolean().default(false),
      rating: z.number().nullable().default(null),
      character: z.array(z.string()).default([]),
      pattern: z.string().default("Not reported"),
    })
    .default({}),
  associatedSymptoms: z.array(z.string()).default([]),
  aggravatingFactors: z.array(z.string()).default([]),
  relievingFactors: z.array(z.string()).default([]),
  previousEpisodes: z.string().default("Not reported"),
  treatmentsTried: z.array(z.string()).default([]),
  medicalHistory: z.array(z.string()).default([]),
  surgeriesOrHospitalizations: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  priorConsultations: z.string().default("Not reported"),
  dailyImpact: z.string().default("Not reported"),
  patientConcern: z.string().default("Not reported"),
  consultationGoal: z.string().default("Not reported"),
  clinicianAttentionItems: z.array(z.string()).default([]),
  doctorFollowUpQuestions: z.array(z.string()).default([]),
  informationNotClarified: z.array(z.string()).default([]),
  additionalNotes: z.string().default("Not reported"),
  mandatoryNotice: z
    .string()
    .default(
      "AI-generated pre-visit summary based on patient-reported information. It has not been independently verified and is not a diagnosis. The clinician must review the information directly with the patient."
    ),
});

export type ClinicalReport = z.infer<typeof ClinicalReportSchema>;

export const AdaptiveQuestionResponseSchema = z.object({
  needsFollowUp: z.boolean(),
  question: z.string().optional().default(""),
  reasonCategory: z
    .enum([
      "symptom_characteristics",
      "timeline",
      "severity",
      "associated_symptoms",
      "previous_episode",
      "functional_impact",
      "relevant_history",
      "no_follow_up",
    ])
    .optional()
    .default("no_follow_up"),
});

export type AdaptiveQuestionResponse = z.infer<typeof AdaptiveQuestionResponseSchema>;

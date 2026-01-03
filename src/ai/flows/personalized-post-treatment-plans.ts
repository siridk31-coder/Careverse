'use server';

/**
 * @fileOverview Generates personalized post-treatment care plans for patients.
 *
 * - generatePostTreatmentPlan - A function that generates a personalized post-treatment care plan.
 * - PostTreatmentPlanInput - The input type for the generatePostTreatmentPlan function.
 * - PostTreatmentPlanOutput - The return type for the generatePostTreatmentPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PostTreatmentPlanInputSchema = z.object({
  patientUid: z.string().describe('The unique identifier of the patient.'),
  languagePref: z.string().describe('The preferred language of the patient.'),
  healthRecord: z.string().describe('The patient health record as a string.'),
});
export type PostTreatmentPlanInput = z.infer<typeof PostTreatmentPlanInputSchema>;

const PostTreatmentPlanOutputSchema = z.object({
  carePlan: z.string().describe('The personalized post-treatment care plan.'),
});
export type PostTreatmentPlanOutput = z.infer<typeof PostTreatmentPlanOutputSchema>;

export async function generatePostTreatmentPlan(
  input: PostTreatmentPlanInput
): Promise<PostTreatmentPlanOutput> {
  return generatePostTreatmentPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postTreatmentPlanPrompt',
  input: {schema: PostTreatmentPlanInputSchema},
  output: {schema: PostTreatmentPlanOutputSchema},
  prompt: `You are a healthcare expert tasked with creating personalized post-treatment care plans for patients.

  Based on the patient's health record and preferred language, generate a comprehensive and easy-to-understand care plan.

  Patient Health Record: {{{healthRecord}}}
  Preferred Language: {{{languagePref}}}

  Care Plan:`,
});

const generatePostTreatmentPlanFlow = ai.defineFlow(
  {
    name: 'generatePostTreatmentPlanFlow',
    inputSchema: PostTreatmentPlanInputSchema,
    outputSchema: PostTreatmentPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


'use server';
/**
 * @fileOverview A Genkit flow for calculating medical consultation fees.
 *
 * This flow estimates consultation fees based on the patient's diagnosis and
 * any applicable government medical schemes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateFeesInputSchema = z.object({
  diagnosis: z.string().describe("The patient's medical diagnosis."),
  scheme: z.string().describe("The government medical scheme the patient is enrolled in."),
});
export type CalculateFeesInput = z.infer<typeof CalculateFeesInputSchema>;

const CalculateFeesOutputSchema = z.object({
  estimatedFee: z.number().describe('The estimated consultation fee in Indian Rupees (INR).'),
  reasoning: z.string().describe('An explanation of how the fee was calculated, considering the diagnosis and scheme.'),
});
export type CalculateFeesOutput = z.infer<typeof CalculateFeesOutputSchema>;

export async function calculateFees(input: CalculateFeesInput): Promise<CalculateFeesOutput> {
  return calculateFeesFlow(input);
}

const calculateFeesFlow = ai.defineFlow(
  {
    name: 'calculateFeesFlow',
    inputSchema: CalculateFeesInputSchema,
    outputSchema: CalculateFeesOutputSchema,
  },
  async ({ diagnosis, scheme }) => {

    const prompt = `
      You are a medical billing expert in an Indian hospital.
      Your task is to estimate the consultation fee for a patient.
      
      Base consultation fees:
      - Standard consultation: 500 INR
      - Specialist consultation (Cardiology, Neurology, etc.): 800 INR
      - Geriatrics/Complex case (like Alzheimer's): 1200 INR

      Government Scheme Adjustments:
      - Ayushman Bharat PM-JAY: 100% coverage for consultation. Fee is 0.
      - CGHS: 50% co-pay for specialist consultations. Base fee is halved.
      - Rashtriya Swasthya Bima Yojana (RSBY): Covers up to 30,000 INR total, but consultation is a 100 INR flat fee.
      - Janani Shishu Suraksha Karyakram & related maternity schemes: 100% coverage for related consultations. Fee is 0.
      - Senior Citizen schemes often provide a 20% discount on the final fee if not fully covered by another primary scheme.
      - Other schemes: Assume a standard 10% discount on the consultation fee unless specified.

      Patient details:
      - Diagnosis: "${diagnosis}"
      - Applied Scheme: "${scheme}"

      Calculate the final estimated fee and provide a brief, one-sentence reasoning for the calculation. For example: "The fee is 0 because PM-JAY provides full coverage." or "The fee is 600 INR after a 20% senior citizen discount on the complex case consultation."
    `;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
          schema: CalculateFeesOutputSchema
      }
    });

    if (!llmResponse.output) {
      throw new Error("Unable to generate a response from the AI model.");
    }
    
    return llmResponse.output;
  }
);


'use server';
/**
 * @fileOverview A Genkit flow for finding relevant Indian government medical schemes.
 *
 * This file defines a Genkit flow that uses a tool to search a local data source
 * for government medical schemes based on a patient's diagnosis.
 *
 * - findMedicalSchemes - The main function to call the flow.
 * - FindMedicalSchemesInput - The Zod schema for the flow's input.
 * - FindMedicalSchemesOutput - The Zod schema for the flow's output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { medicalSchemes } from '@/lib/data/medical-schemes';

const FindMedicalSchemesInputSchema = z.object({
  diagnosis: z.string().describe("The patient's medical diagnosis."),
  patientInfo: z.object({
      age: z.number(),
      gender: z.string(),
      // In a real app, more detailed info would be required.
  }).describe("Basic patient information for eligibility checks."),
});
export type FindMedicalSchemesInput = z.infer<typeof FindMedicalSchemesInputSchema>;

const SchemeSchema = z.object({
    name: z.string(),
    description: z.string(),
    eligibility: z.string(),
    link: z.string().url(),
});

const FindMedicalSchemesOutputSchema = z.object({
  eligibleSchemes: z.array(SchemeSchema).describe('A list of government medical schemes the patient might be eligible for.'),
  reasoning: z.string().describe('An explanation of why these schemes were chosen based on the diagnosis.'),
});
export type FindMedicalSchemesOutput = z.infer<typeof FindMedicalSchemesOutputSchema>;


/**
 * A tool that searches for medical schemes based on keywords.
 * In a real application, this could be a database or an external API call.
 */
const searchSchemesTool = ai.defineTool(
  {
    name: 'searchSchemes',
    description: 'Searches for Indian government medical schemes based on a query.',
    inputSchema: z.object({
      query: z.string().describe('Keywords related to a medical diagnosis (e.g., "cancer", "maternity", "heart disease").'),
    }),
    outputSchema: z.array(SchemeSchema),
  },
  async ({ query }) => {
    const lowerCaseQuery = query.toLowerCase();
    // Simple keyword matching for demonstration.
    return medicalSchemes.filter(scheme => 
        scheme.name.toLowerCase().includes(lowerCaseQuery) ||
        scheme.description.toLowerCase().includes(lowerCaseQuery) ||
        scheme.eligibility.toLowerCase().includes(lowerCaseQuery)
    );
  }
);


export async function findMedicalSchemes(input: FindMedicalSchemesInput): Promise<FindMedicalSchemesOutput> {
  return findMedicalSchemesFlow(input);
}


const findMedicalSchemesFlow = ai.defineFlow(
  {
    name: 'findMedicalSchemesFlow',
    inputSchema: FindMedicalSchemesInputSchema,
    outputSchema: FindMedicalSchemesOutputSchema,
  },
  async (input) => {
    // MOCK: Directly call the tool to bypass AI rate limits during development.
    const toolResult = await searchSchemesTool.run({ query: input.diagnosis });

    return {
      eligibleSchemes: toolResult.result || [],
      reasoning: `Schemes were directly searched based on the diagnosis: "${input.diagnosis}". (This is a mock response to avoid rate limits).`
    };
  }
);

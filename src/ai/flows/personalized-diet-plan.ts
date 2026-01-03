
'use server';
/**
 * @fileOverview Generates personalized diet plans for patients.
 *
 * - generateDietPlan - A function that generates a personalized diet plan.
 * - DietPlanInput - The input type for the generateDietPlan function.
 * - DietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DietPlanInputSchema = z.object({
  diagnosis: z.string().describe('The medical diagnosis of the patient (e.g., "Hypertension", "Type 2 Diabetes").'),
  language: z.string().describe('The preferred language for the diet plan (e.g., "Hindi", "English", "Tamil").'),
  region: z.string().describe('The regional cuisine preference (e.g., "North Indian", "South Indian", "Bengali").')
});
export type DietPlanInput = z.infer<typeof DietPlanInputSchema>;

const MealSchema = z.object({
    time: z.string().describe("Time of the meal (e.g., '8:00 AM')"),
    options: z.array(z.string()).describe("List of food options for the meal."),
});

const DietPlanOutputSchema = z.object({
  plan: z.object({
    breakfast: MealSchema,
    lunch: MealSchema,
    snacks: MealSchema,
    dinner: MealSchema,
  }),
  generalAdvice: z.array(z.string()).describe("A list of general dietary advice and tips."),
  language: z.string().describe("The language the plan was generated in."),
});
export type DietPlanOutput = z.infer<typeof DietPlanOutputSchema>;


export async function generateDietPlan(input: DietPlanInput): Promise<DietPlanOutput> {
  return generateDietPlanFlow(input);
}


const prompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: { schema: DietPlanInputSchema },
  output: { schema: DietPlanOutputSchema },
  prompt: `You are an expert nutritionist specializing in Indian cuisine.
  
  Create a one-day dietary plan for a patient diagnosed with "{{diagnosis}}".
  The plan should be tailored for a "{{region}}" regional preference.
  The entire output, including meal names and descriptions, must be in the "{{language}}" language.

  Provide 2-3 options for each meal.
  
  Generate the diet plan now.`,
});


const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: DietPlanInputSchema,
    outputSchema: DietPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

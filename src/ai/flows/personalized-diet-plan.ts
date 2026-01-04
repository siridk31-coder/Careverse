
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
  region: z.string().describe('The regional cuisine preference (e.g., "North Indian", "South Indian", "Bengali").'),
  dietaryPreference: z.enum(["vegetarian", "non-vegetarian", "jain"]).describe("The patient's dietary preference."),
  allergies: z.string().optional().describe("A list of comma-separated allergies the patient has (e.g., 'peanuts, dairy').")
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
  // return generateDietPlanFlow(input);

  // MOCKED RESPONSE to avoid rate-limiting during development
  console.log("Returning mocked diet plan to avoid rate limit.");
  return new Promise(resolve => setTimeout(() => {
    if (input.language === 'Hindi') {
       resolve({
        plan: {
          breakfast: { time: 'सुबह 8:00 बजे', options: ['मॉक पोहा सब्जियों के साथ', 'मॉक ओट्स उपमा'] },
          lunch: { time: 'दोपहर 1:00 बजे', options: ['मॉक रोटी दाल और सब्जी के साथ', 'मॉक ब्राउन राइस सांभर के साथ'] },
          snacks: { time: 'शाम 4:00 बजे', options: ['मॉक ఫ్రూట్ సలాడ్', 'मॉक स्प्राउट चाट'] },
          dinner: { time: 'रात 8:00 बजे', options: ['मॉक vegetable खिचड़ी', 'मॉक पनीर टिक्का (कम वसा वाला)'] },
        },
        generalAdvice: [
          'यह एक नकली प्रतिक्रिया है।',
          'खूब पानी पिएं।',
          'मीठे पेय سے پرہیز کریں۔',
          'प्रसंस्कृत खाद्य पदार्थों को सीमित करें।',
        ],
        language: input.language,
      });
    } else {
      resolve({
        plan: {
          breakfast: { time: '8:00 AM', options: ['Mock Poha with vegetables', 'Mock Oats Upma'] },
          lunch: { time: '1:00 PM', options: ['Mock Roti with Dal and Sabzi', 'Mock Brown Rice with Sambar'] },
          snacks: { time: '4:00 PM', options: ['Mock Fruit Salad', 'Mock Sprout Chaat'] },
          dinner: { time: '8:00 PM', options: ['Mock Vegetable Khichdi', 'Mock Paneer Tikka (low-fat)'] },
        },
        generalAdvice: [
          'This is a mocked response.',
          'Drink plenty of water.',
          'Avoid sugary drinks.',
          'Limit processed foods.',
        ],
        language: input.language,
      });
    }
  }, 1500));
}


const prompt = ai.definePrompt({
  name: 'dietPlanPrompt',
  input: { schema: DietPlanInputSchema },
  output: { schema: DietPlanOutputSchema },
  prompt: `You are an expert nutritionist specializing in Indian cuisine.
  
  Create a one-day dietary plan for a patient diagnosed with "{{diagnosis}}".
  The plan must be strictly "{{dietaryPreference}}".
  {{#if allergies}}
  The patient is allergic to the following: {{allergies}}. You must not include any of these ingredients in the plan.
  {{/if}}

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

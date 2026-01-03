'use server';
/**
 * @fileOverview Summarizes a voice note recorded during an appointment.
 *
 * - summarizeVoiceNote - A function that summarizes a voice note.
 * - SummarizeVoiceNoteInput - The input type for the summarizeVoiceNote function.
 * - SummarizeVoiceNoteOutput - The return type for the summarizeVoiceNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVoiceNoteInputSchema = z.object({
  voiceNoteUrl: z.string().describe('URL of the voice note to summarize.'),
});
export type SummarizeVoiceNoteInput = z.infer<typeof SummarizeVoiceNoteInputSchema>;

const SummarizeVoiceNoteOutputSchema = z.object({
  summary: z.string().describe('Summary of the voice note.'),
});
export type SummarizeVoiceNoteOutput = z.infer<typeof SummarizeVoiceNoteOutputSchema>;

export async function summarizeVoiceNote(input: SummarizeVoiceNoteInput): Promise<SummarizeVoiceNoteOutput> {
  return summarizeVoiceNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVoiceNotePrompt',
  input: {schema: SummarizeVoiceNoteInputSchema},
  output: {schema: SummarizeVoiceNoteOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing voice notes from healthcare appointments.

  Please provide a concise and accurate summary of the key topics discussed in the voice note.
  Voice Note URL: {{{voiceNoteUrl}}}
  Summary: `,
});

const summarizeVoiceNoteFlow = ai.defineFlow(
  {
    name: 'summarizeVoiceNoteFlow',
    inputSchema: SummarizeVoiceNoteInputSchema,
    outputSchema: SummarizeVoiceNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

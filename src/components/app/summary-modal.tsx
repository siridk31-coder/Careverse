'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { summarizeVoiceNote, SummarizeVoiceNoteInput } from '@/ai/flows/summarize-voice-note';
import { Loader2, Mic, FileAudio } from 'lucide-react';
import type { Appointment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function SummaryModal({ appointment }: { appointment: Appointment }) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');
    try {
      const input: SummarizeVoiceNoteInput = {
        voiceNoteUrl: appointment.voice_note_url || '',
      };
      // In a real app, you would pass the input to the AI flow.
      // For this prototype, we'll simulate the response.
      if (input.voiceNoteUrl) {
         // const result = await summarizeVoiceNote(input);
         // setSummary(result.summary);
         
         // Mocked response for prototype
         setTimeout(() => {
            setSummary(`The patient discussed feeling occasional chest tightness, especially after light exercise. Dr. Carter reviewed the recent EKG results, which were normal. The doctor advised continuing with the prescribed Lisinopril and Amlodipine, and emphasized the importance of monitoring blood pressure at home. A follow-up was scheduled in one month to check on progress.`);
            setIsLoading(false);
         }, 1500);
      } else {
        throw new Error("No voice note URL provided.");
      }
      
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate the summary. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Mic className="mr-2 h-4 w-4" /> View Summary</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Voice Note Summary</DialogTitle>
          <DialogDescription>
            An AI-generated summary of the voice note recorded during your appointment on {new Date(appointment.date).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating summary...</p>
            </div>
          )}
          {summary && <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>}
          {!isLoading && !summary && (
            <div className="text-center p-4 space-y-4">
                <FileAudio className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Click below to generate a summary of the appointment audio.</p>
                <Button onClick={handleGenerateSummary}>Generate Summary</Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="secondary">Close</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

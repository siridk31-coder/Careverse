
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDietPlan, DietPlanInput, DietPlanOutput } from '@/ai/flows/personalized-diet-plan';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type DietPlanGeneratorProps = {
  diagnosis: string;
  language: string;
};

const indianRegions = ["North Indian", "South Indian", "East Indian", "West Indian", "Bengali", "Gujarati", "Punjabi"];

export default function DietPlanGenerator({ diagnosis, language }: DietPlanGeneratorProps) {
  const [dietPlan, setDietPlan] = useState<DietPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState('North Indian');
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (!diagnosis) {
         toast({
            variant: 'destructive',
            title: 'No Diagnosis Found',
            description: 'Cannot generate a diet plan without a medical diagnosis.',
         });
         return;
    }

    setIsLoading(true);
    setDietPlan(null);
    try {
      const input: DietPlanInput = {
        diagnosis,
        language,
        region,
      };
      
      const result = await generateDietPlan(input);
      setDietPlan(result);

    } catch (error) {
      console.error('Failed to generate diet plan:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate the diet plan. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const renderMeal = (mealName: string, meal: DietPlanOutput['plan']['breakfast']) => (
    <AccordionItem value={mealName.toLowerCase()}>
        <AccordionTrigger className="text-lg font-semibold">{mealName} ({meal.time})</AccordionTrigger>
        <AccordionContent>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                {meal.options.map((option, index) => <li key={index}>{option}</li>)}
            </ul>
        </AccordionContent>
    </AccordionItem>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">AI-Powered Diet Plan</CardTitle>
        <CardDescription>
            Generate a personalized diet plan for your diagnosis ({diagnosis}) with regional Indian cuisine options.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select Region</label>
                <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                        {indianRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="self-end">
                <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                    </>
                ) : (
                    <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Diet Plan
                    </>
                )}
                </Button>
            </div>
        </div>

        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-pulse">
                <p className="text-muted-foreground">The AI nutritionist is crafting your plan...</p>
            </div>
        )}

        {dietPlan && (
          <div className="pt-4">
            <h3 className="font-bold text-lg mb-2">Your Personalized Diet Plan ({dietPlan.language})</h3>
            <Accordion type="single" collapsible className="w-full" defaultValue="breakfast">
                {renderMeal("Breakfast", dietPlan.plan.breakfast)}
                {renderMeal("Lunch", dietPlan.plan.lunch)}
                {renderMeal("Snacks", dietPlan.plan.snacks)}
                {renderMeal("Dinner", dietPlan.plan.dinner)}
            </Accordion>
            
            <div className="mt-6">
                <h4 className="font-bold text-md mb-2">General Advice:</h4>
                <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
                    {dietPlan.generalAdvice.map((advice, index) => <li key={index}>{advice}</li>)}
                </ul>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

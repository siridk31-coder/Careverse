
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { findMedicalSchemes, FindMedicalSchemesInput, FindMedicalSchemesOutput } from '@/ai/flows/find-medical-schemes';
import type { Patient } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

type SchemeFinderProps = {
  diagnosis: string;
  patient: Patient;
};

export default function SchemeFinder({ diagnosis, patient }: SchemeFinderProps) {
  const [schemes, setSchemes] = useState<FindMedicalSchemesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFindSchemes = async () => {
    if (!diagnosis) {
        toast({
           variant: 'destructive',
           title: 'No Diagnosis Found',
           description: 'Cannot find schemes without a medical diagnosis.',
        });
        return;
    }

    setIsLoading(true);
    setSchemes(null);
    try {
      const input: FindMedicalSchemesInput = {
        diagnosis,
        patientInfo: {
            age: patient.age,
            gender: patient.gender,
        }
      };
      
      const result = await findMedicalSchemes(input);
      setSchemes(result);

    } catch (error) {
      console.error('Failed to find schemes:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find medical schemes. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Government Scheme Finder</CardTitle>
        <CardDescription>
            Find relevant Indian government medical schemes based on your diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleFindSchemes} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching for schemes...
            </>
          ) : (
             <>
              <Search className="mr-2 h-4 w-4" />
              Find Eligible Schemes
            </>
          )}
        </Button>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-pulse">
                <p className="text-muted-foreground">AI is checking for relevant schemes based on {diagnosis}...</p>
            </div>
        )}

        {schemes && (
            <div className="pt-4 space-y-4">
                 <div>
                    <h3 className="font-bold text-lg mb-2">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground italic">"{schemes.reasoning}"</p>
                 </div>
                 
                 <Accordion type="single" collapsible className="w-full" defaultValue={schemes.eligibleSchemes[0]?.name}>
                    {schemes.eligibleSchemes.map((scheme) => (
                        <AccordionItem value={scheme.name} key={scheme.name}>
                            <AccordionTrigger className="text-lg font-semibold">{scheme.name}</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <p className="text-muted-foreground">{scheme.description}</p>
                                <div>
                                    <h5 className="font-semibold mb-1">Eligibility</h5>
                                    <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                                </div>
                                <Button asChild variant="link" className="p-0 h-auto">
                                    <Link href={scheme.link} target="_blank" rel="noopener noreferrer">
                                        Learn More & Apply
                                    </Link>
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>

                 {schemes.eligibleSchemes.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No specific schemes found for '{diagnosis}'. You may still be eligible for general health programs.</p>
                 )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}


'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateFees, CalculateFeesInput, CalculateFeesOutput } from '@/ai/flows/calculate-fees';
import { Loader2, IndianRupee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { medicalSchemes } from '@/lib/data/medical-schemes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeeCalculator() {
  const [result, setResult] = useState<CalculateFeesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("Alzheimer's Disease");
  const [scheme, setScheme] = useState(medicalSchemes[0].name);
  const { toast } = useToast();

  const handleCalculateFees = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const input: CalculateFeesInput = {
        diagnosis,
        scheme,
      };
      
      const response = await calculateFees(input);
      setResult(response);

    } catch (error) {
      console.error('Failed to calculate fees:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not calculate fees. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Consultation Fee Calculator</CardTitle>
        <CardDescription>
            Calculate estimated fees based on diagnosis and applied government schemes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Input id="diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="scheme">Government Scheme</Label>
            <Select value={scheme} onValueChange={setScheme}>
                <SelectTrigger id="scheme">
                    <SelectValue placeholder="Select a scheme" />
                </SelectTrigger>
                <SelectContent>
                    {medicalSchemes.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        
        <Button onClick={handleCalculateFees} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
             <>
              <IndianRupee className="mr-2 h-4 w-4" />
              Calculate Fees
            </>
          )}
        </Button>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-pulse">
                <p className="text-muted-foreground">AI is calculating the estimated fee...</p>
            </div>
        )}

        {result && (
            <div className="pt-4 space-y-4">
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <IndianRupee className="h-6 w-6 mr-2"/> {result.estimatedFee.toLocaleString()}
                        </CardTitle>
                        <CardDescription>Estimated Consultation Fee</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm italic">"{result.reasoning}"</p>
                    </CardContent>
                </Card>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePostTreatmentPlan } from '@/ai/flows/personalized-post-treatment-plans';
import type { DigitalHealthRecord, Patient } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CarePlanGeneratorProps = {
  record: DigitalHealthRecord;
  patient: Patient;
};

export default function CarePlanGenerator({ record, patient }: CarePlanGeneratorProps) {
  const [carePlan, setCarePlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setCarePlan('');
    try {
      const healthRecordString = `
        Diagnosis: ${record.diagnosis}
        Notes: ${record.notes}
        Prescriptions: ${record.prescriptions.map(p => `${p.name} (${p.dosage}, ${p.frequency})`).join(', ')}
      `;

      // const result = await generatePostTreatmentPlan({
      //   patientUid: patient.uid,
      //   languagePref: patient.language_pref,
      //   healthRecord: healthRecordString,
      // });
      // setCarePlan(result.carePlan);

      // Mocked response for prototype
      setTimeout(() => {
        let plan = '';
        if (patient.language_pref === 'Spanish') {
          plan = `Plan de Cuidados Post-Tratamiento para la Hipertensión:\n\n1.  **Medicación:** Tome Lisinopril (10mg) y Amlodipino (5mg) una vez al día, como se le indicó. No omita dosis.\n2.  **Dieta:** Reduzca la ingesta de sal. Coma más frutas, verduras y granos integrales.\n3.  **Actividad:** Realice al menos 30 minutos de caminata ligera la mayoría de los días de la semana.\n4.  **Monitoreo:** Revise su presión arterial en casa regularmente y anote las lecturas.\n5.  **Seguimiento:** Asista a su cita de seguimiento en un mes.`;
        } else {
          plan = `Post-Treatment Care Plan for Hypertension:\n\n1.  **Medication:** Take Lisinopril (10mg) and Amlodipine (5mg) once daily as prescribed. Do not miss doses.\n2.  **Diet:** Reduce salt intake. Eat more fruits, vegetables, and whole grains.\n3.  **Activity:** Engage in at least 30 minutes of light walking most days of the week.\n4.  **Monitoring:** Check your blood pressure at home regularly and keep a log of the readings.\n5.  **Follow-up:** Attend your follow-up appointment in one month.`;
        }
        setCarePlan(plan);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to generate care plan:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate the care plan. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="font-headline text-lg">AI-Powered Post-Treatment Plan</CardTitle>
        <CardDescription>Generate a personalized care plan for the patient in their preferred language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {carePlan && (
          <div className="p-4 border rounded-md bg-white">
            <h4 className="font-bold mb-2">Personalized Care Plan ({patient.language_pref})</h4>
            <p className="text-sm whitespace-pre-wrap">{carePlan}</p>
          </div>
        )}
        <Button onClick={handleGeneratePlan} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
             <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Care Plan
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

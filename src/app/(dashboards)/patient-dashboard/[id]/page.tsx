
import { appointments, patients, healthRecords } from "@/lib/mock-data";
import { Patient } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { User, Languages, FileText } from "lucide-react";
import Link from "next/link";
import VoiceCommandButton from "@/components/app/voice-command-button";
import PatientPortalTabs from "@/components/app/patient-portal-tabs";

export default function PatientDashboard({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.uid === params.id) as Patient;
  const patientAppointments = appointments.filter(
    (a) => a.patient_uid === params.id
  );
  // Find the most recent health record for the latest diagnosis
  const patientHealthRecords = healthRecords
    .filter(r => r.patient_uid === params.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const latestRecord = patientHealthRecords[0];

  const avatar = PlaceHolderImages.find(p => p.id === patient.avatarId);

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            {avatar && <AvatarImage src={avatar.imageUrl} alt={patient.name} />}
            <AvatarFallback className="text-3xl">{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold font-headline">{patient.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{patient.age} years old, {patient.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span>Prefers {patient.language_pref}</span>
              </div>
            </div>
            {patient.current_schemes.length > 0 && (
                <div className="pt-2">
                    <Badge variant="secondary">{patient.current_schemes[0]}</Badge>
                </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-center">
             <VoiceCommandButton />
             <Button variant="outline" asChild>
                <Link href="#">
                    <FileText className="mr-2 h-4 w-4" /> View Full Profile
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <PatientPortalTabs 
        patient={patient}
        appointments={patientAppointments}
        diagnosis={latestRecord?.diagnosis}
      />
    </div>
  );
}

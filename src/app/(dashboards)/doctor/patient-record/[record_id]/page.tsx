
import { healthRecords, patients } from "@/lib/mock-data";
import { DigitalHealthRecord, Patient } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Languages, User, Frown } from "lucide-react";
import HealthRecordTabs from "@/components/app/health-record-tabs";

export default function PatientRecordPage({ params }: { params: { record_id: string } }) {
  const record = healthRecords.find(r => r.record_id === params.record_id);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <Frown className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4 font-headline">Record Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The health record you are looking for does not exist.
        </p>
      </div>
    );
  }

  const patient = patients.find(p => p.uid === record.patient_uid) as Patient;
  const avatar = PlaceHolderImages.find(p => p.id === patient.avatarId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-lg">
         <Avatar className="h-24 w-24 border-4 border-primary/20">
            {avatar && <AvatarImage src={avatar.imageUrl} alt={patient.name} />}
            <AvatarFallback className="text-3xl">{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 text-center sm:text-left">
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
          </div>
      </div>
      
      <HealthRecordTabs record={record} patient={patient} />
    </div>
  );
}

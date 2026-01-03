'use client';

import Link from "next/link";
import { Appointment } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, FileText, Hospital, Stethoscope } from "lucide-react";
import SummaryModal from "./summary-modal";
import { useEffect, useState } from "react";

type AppointmentCardProps = {
  appointment: Appointment;
  isUpcoming?: boolean;
};

export default function AppointmentCard({ appointment, isUpcoming = false }: AppointmentCardProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    const appointmentDate = new Date(appointment.date);
    setFormattedDate(appointmentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setFormattedTime(appointmentDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
  }, [appointment.date]);


  return (
    <Card className={`transition-all hover:shadow-md ${isUpcoming ? 'border-primary border-2' : ''}`}>
      <CardContent className="p-4 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h3 className="text-lg font-bold font-headline">{appointment.specialty}</h3>
            <Badge variant={appointment.status === 'Completed' ? 'secondary' : 'default'}>{appointment.status}</Badge>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hospital className="h-4 w-4" />
              <span>{appointment.hospital_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              <span>{appointment.doctor_name}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start sm:items-end gap-2">
          <Button asChild>
            <Link href={`/doctor/patient-record/${appointment.record_id}`}>
              <FileText className="mr-2 h-4 w-4"/> View Health Record
            </Link>
          </Button>
          {appointment.voice_note_url && (
            <SummaryModal appointment={appointment} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

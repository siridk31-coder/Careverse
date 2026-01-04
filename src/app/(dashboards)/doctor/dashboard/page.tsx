
'use client';

import { useState } from "react";
import { appointments as initialAppointments, patients } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Check, X } from "lucide-react";
import PatientsTable from "@/components/app/patients-table";
import AppointmentCard from "@/components/app/appointment-card";
import FeeCalculator from "@/components/app/fee-calculator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Appointment } from "@/lib/types";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { toast } = useToast();

  const handleUpdateAppointment = (appointmentId: string, status: "Completed" | "Cancelled") => {
    setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, status } : app
    ));
    toast({
        title: `Appointment ${status}`,
        description: `The appointment has been marked as ${status.toLowerCase()}.`
    });
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Doctor's Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Carter</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                    <div key={app.id} className="space-y-2">
                        <AppointmentCard appointment={app} userType="doctor" />
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => handleUpdateAppointment(app.id, 'Completed')}>
                                <Check className="mr-2 h-4 w-4" /> Mark as Completed
                            </Button>
                             <Button size="sm" variant="destructive" onClick={() => handleUpdateAppointment(app.id, 'Cancelled')}>
                                <X className="mr-2 h-4 w-4" /> Cancel Appointment
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
        <div className="lg:col-span-3">
          <FeeCalculator />
        </div>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="font-headline">Current Patient Queue</CardTitle>
          </CardHeader>
          <CardContent>
              <PatientsTable patients={patients} />
          </CardContent>
      </Card>

    </div>
  );
}

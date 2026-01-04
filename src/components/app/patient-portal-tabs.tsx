
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, Patient } from "@/lib/types";
import { BookUser, HandPlatter, Stethoscope, CalendarPlus } from "lucide-react";
import AppointmentCard from "./appointment-card";
import DietPlanGenerator from "./diet-plan-generator";
import SchemeFinder from "./scheme-finder";
import AppointmentBooking from "./appointment-booking";

type PatientPortalTabsProps = {
    patient: Patient;
    appointments: Appointment[];
    diagnosis: string | undefined;
}

export default function PatientPortalTabs({ patient, appointments, diagnosis }: PatientPortalTabsProps) {

    const upcomingAppointment = appointments.find(a => a.status === 'Scheduled');
    const pastAppointments = appointments.filter(a => a.status !== 'Scheduled');

    return (
        <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments"><Stethoscope className="mr-2 h-4 w-4" />Appointments</TabsTrigger>
                <TabsTrigger value="health-hub"><HandPlatter className="mr-2 h-4 w-4" />Health & Schemes</TabsTrigger>
                <TabsTrigger value="booking"><CalendarPlus className="mr-2 h-4 w-4" />Book Appointment</TabsTrigger>
            </TabsList>
            <TabsContent value="appointments">
                <div className="space-y-6">
                    {upcomingAppointment && (
                        <div>
                            <h2 className="text-2xl font-headline font-bold mb-4">Upcoming Appointment</h2>
                            <AppointmentCard appointment={upcomingAppointment} isUpcoming={true} userType="patient" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-headline font-bold mb-4">Past Appointments</h2>
                        {pastAppointments.length > 0 ? (
                             <div className="space-y-4">
                                {pastAppointments.map(app => (
                                    <AppointmentCard key={app.id} appointment={app} userType="patient" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <BookUser className="mx-auto h-12 w-12"/>
                                <p className="mt-4">No past appointments found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="health-hub">
                <div className="space-y-8">
                   <DietPlanGenerator diagnosis={diagnosis || ''} language={patient.language_pref} />
                   <SchemeFinder diagnosis={diagnosis || ''} patient={patient} />
                </div>
            </TabsContent>
            <TabsContent value="booking">
                <AppointmentBooking />
            </TabsContent>
        </Tabs>
    )
}

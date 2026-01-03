
import { appointments, patients } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import PatientsTable from "@/components/app/patients-table";
import AppointmentCard from "@/components/app/appointment-card";
import FeeCalculator from "@/components/app/fee-calculator";

export default function DoctorDashboard() {
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
                    <AppointmentCard key={app.id} appointment={app} />
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

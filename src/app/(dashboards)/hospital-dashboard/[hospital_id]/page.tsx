import { hospitalOperations, patients } from "@/lib/mock-data";
import { HospitalOperation, Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Clock, Pill, User, Users, Waves } from "lucide-react";
import MetricCard from "@/components/app/metric-card";
import PatientsTable from "@/components/app/patients-table";
import { Progress } from "@/components/ui/progress";

export default function HospitalDashboard({ params }: { params: { hospital_id: string } }) {
  const hospital = hospitalOperations.find(h => h.hospital_id === params.hospital_id) as HospitalOperation;
  
  const opdStatusColors = {
    'Light': 'text-green-500',
    'Normal': 'text-yellow-500',
    'Crowded': 'text-red-500',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{hospital.name}</h1>
        <p className="text-muted-foreground">Real-time Operations Dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
            title="OPD Status"
            value={hospital.opd_status}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            valueClassName={opdStatusColors[hospital.opd_status]}
        />
        <MetricCard
            title="Avg. Wait Time"
            value="35 mins"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
            title="Emergency Cases"
            value={hospital.emergency_cases.length.toString()}
            icon={<Waves className="h-4 w-4 text-muted-foreground" />}
            valueClassName="text-red-500"
        />
         <MetricCard
            title="Doctors on Duty"
            value={`${hospital.doctor_availability.reduce((sum, d) => sum + d.available, 0)} / ${hospital.doctor_availability.reduce((sum, d) => sum + d.total, 0)}`}
            icon={<User className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Current OPD Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <PatientsTable patients={patients} />
            </CardContent>
        </Card>
        <div className="lg:col-span-3 grid grid-cols-1 gap-4 auto-rows-min">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Medicine Stock Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(hospital.live_medicine_stock).map(([name, stock]) => {
                        const percentage = (stock.quantity / (stock.low_stock_threshold * 5)) * 100; // Assuming max is 5x threshold
                        return (
                            <div key={name}>
                                <div className="flex justify-between mb-1 text-sm">
                                    <span className="font-medium">{name}</span>
                                    <span className="text-muted-foreground">{stock.quantity} units</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Doctor Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {hospital.doctor_availability.map((dept) => (
                        <div key={dept.specialty}>
                            <div className="flex justify-between mb-1 text-sm">
                                <span className="font-medium">{dept.specialty}</span>
                                <span className="text-muted-foreground">{dept.available} / {dept.total}</span>
                            </div>
                            <Progress value={(dept.available / dept.total) * 100} className="h-2" />
                        </div>
                     ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

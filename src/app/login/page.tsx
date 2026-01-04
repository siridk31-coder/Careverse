'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowRight, UserPlus, Stethoscope } from 'lucide-react';
import Logo from '@/components/app/logo';
import LoginCard from '@/components/app/login-card';
import { patients, doctors } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PatientLoginForm() {
  const [patientId, setPatientId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const validPatientIds = patients.map(p => p.uid);
      if (validPatientIds.includes(patientId.toLowerCase())) {
        router.push(`/patient-dashboard/${patientId.toLowerCase()}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Patient ID',
          description: 'Please enter a valid ID or create a new profile.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-id">Patient ID</Label>
            <Input
              id="patient-id"
              placeholder="e.g., p1"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Go to Patient Dashboard'} <ArrowRight className="ml-2"/>
          </Button>
        </form>
        
         <div className="text-center">
            <Button variant="link" asChild>
                <Link href="/new-patient">
                    <UserPlus className="mr-2"/> Create New Patient Profile
                </Link>
            </Button>
        </div>
      </div>
  )
}

function StaffLoginForm() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const validDoctorIds = doctors.map(d => d.uid);

      if (validDoctorIds.includes(staffId.toLowerCase()) && password === 'password') {
        toast({
          title: 'Login Successful',
          description: "Redirecting to the Doctor's dashboard.",
        });
        router.push(`/doctor/dashboard`);
      } else if (staffId.toLowerCase() === 'hospital1' && password === 'password') {
        toast({
          title: 'Login Successful',
          description: "Redirecting to the Hospital Operations dashboard.",
        });
        router.push(`/hospital-dashboard/hosp1`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Credentials',
          description: 'Please check your Staff ID and password.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
     <div className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staff-id">Staff ID</Label>
            <Input
              id="staff-id"
              placeholder="e.g., d1 or hospital1"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Login'}
          </Button>
        </form>
         <div className="text-center">
            <Button variant="link" asChild>
                <Link href="/new-doctor">
                    <Stethoscope className="mr-2"/> Create New Doctor Profile
                </Link>
            </Button>
        </div>
         <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Hint: use 'password' for any staff login.
            </p>
        </div>
      </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <LoginCard
        title="CareVerse Portal Login"
        description="Select your role to sign in."
      >
        <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="staff">Doctor/Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="patient" className="pt-4">
                <PatientLoginForm />
            </TabsContent>
            <TabsContent value="staff" className="pt-4">
                <StaffLoginForm />
            </TabsContent>
        </Tabs>
      </LoginCard>
    </div>
  );
}

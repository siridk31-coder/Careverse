
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/app/logo';
import LoginCard from '@/components/app/login-card';
import Link from 'next/link';
import { doctors } from '@/lib/mock-data';
import type { Doctor } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const specialties = [
    "Cardiology", "Neurology", "Orthopedics", "Geriatrics", "Pediatrics", "Oncology", "General Practice"
];

export default function NewDoctorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const specialty = formData.get('specialty') as string;
    
    // Simulate API call to create a new doctor
    setTimeout(() => {
      // In a real app, this logic would be on the server.
      const newDoctorId = `d${doctors.length + 1}`;
      
      const newDoctor: Doctor = {
        uid: newDoctorId,
        name: `Dr. ${name}`,
        specialty,
      };

      // This "appends to the CSV" by adding to the mock data array.
      doctors.push(newDoctor);

      toast({
        title: 'Doctor Profile Created!',
        description: `Your new Doctor ID is: ${newDoctorId}. You can now log in with the password 'password'.`,
        duration: 9000,
      });

      router.push('/login');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      <LoginCard
        title="Create New Doctor Profile"
        description="Fill in your details to get registered on the platform."
      >
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Jane Doe" required />
          </div>
           <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select required name="specialty">
                <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                    {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Profile...' : 'Create My Profile'}
          </Button>
        </form>
         <div className="mt-6 text-center">
            <Button variant="link" asChild>
                <Link href="/login">
                    Back to Login
                </Link>
            </Button>
        </div>
      </LoginCard>
    </div>
  );
}

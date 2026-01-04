
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Logo from '@/components/app/logo';
import LoginCard from '@/components/app/login-card';
import Link from 'next/link';
import { patients } from '@/lib/mock-data';
import type { Patient } from '@/lib/types';

// List of 22 official languages of India
const indianLanguages = [
  "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", 
  "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", 
  "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", 
  "Telugu", "Urdu", "English"
];


export default function NewPatientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string, 10);
    const gender = formData.get('gender') as Patient['gender'];
    const language_pref = formData.get('language') as Patient['language_pref'];
    
    // Simulate API call to create a new patient
    setTimeout(() => {
      // In a real app, this logic would be on the server.
      const newPatientId = `p${patients.length + 1}`;
      
      const newPatient: Patient = {
        uid: newPatientId,
        name,
        age,
        gender,
        language_pref,
        biometric_id: `bio-new-${newPatientId}`,
        literacy_level: 'High', // Default value
        current_schemes: [],
        avatarId: `patient-avatar-${(patients.length % 2) + 1}` // cycle avatars
      };

      // This is where we "append to the CSV" by adding to the mock data array.
      // NOTE: This only persists for the current session in a prototype.
      patients.push(newPatient);

      toast({
        title: 'Profile Created!',
        description: `Your new Patient ID is: ${newPatientId}. You can now log in.`,
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
        title="Create New Patient Profile"
        description="Fill in your details to get started."
      >
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Suresh" required defaultValue="Suresh" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" placeholder="e.g., 62" required defaultValue="62" />
            </div>
          </div>
           <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select required name="gender" defaultValue="Male">
                <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select required name="language" defaultValue="Hindi">
                <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    {indianLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
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

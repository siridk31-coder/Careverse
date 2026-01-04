
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { findHospitals, FindHospitalsInput, FindHospitalsOutput } from '@/ai/flows/find-hospitals';
import { Loader2, Search, MapPin, Calendar, LocateFixed, Navigation, Pill, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MapDisplay from './map-display';
import Link from 'next/link';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

const equipmentList = ["MRI", "Radiotherapy", "PET Scan"];

export default function AppointmentBooking() {
  const [hospitals, setHospitals] = useState<FindHospitalsOutput['hospitals'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGovernmentOnly, setIsGovernmentOnly] = useState(true);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<FindHospitalsOutput['hospitals'][0] | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState('Idle');
  const { toast } = useToast();

  const getLocation = () => {
    setLocationStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('Location found!');
        toast({ title: 'Location Found', description: 'Your current location will be used to find hospitals.' });
      },
      () => {
        setLocationStatus('Could not get location. Using default.');
        setUserLocation({ lat: 12.9716, lng: 77.5946 }); // Fallback to Bangalore
        toast({ variant: 'destructive', title: 'Location Error', description: 'Could not get your location. Using a default location in Bangalore.' });
      }
    );
  };


  const handleFindHospitals = async () => {
    if (!userLocation) {
        toast({
            variant: 'destructive',
            title: 'Location Required',
            description: 'Please find your location first before searching for hospitals.',
        });
        return;
    }
    
    setIsLoading(true);
    setHospitals(null);
    setSelectedHospital(null);
    try {
      const input: FindHospitalsInput = {
        isGovernment: isGovernmentOnly,
        requiredEquipment: requiredEquipment as any,
        userLocation: userLocation
      };
      
      const result = await findHospitals(input);
      setHospitals(result.hospitals);

    } catch (error) {
      console.error('Failed to find hospitals:', error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find hospitals. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleEquipmentChange = (equipment: string) => {
    setRequiredEquipment(prev => 
        prev.includes(equipment) ? prev.filter(e => e !== equipment) : [...prev, equipment]
    );
  }

  const handleBookAppointment = () => {
    setIsBooking(true);
    // This simulates adding the appointment to a database.
    // In this prototype, we're adding it to the mock data file.
    setTimeout(() => {
        toast({
            title: "Appointment Booked (Prototype)",
            description: `Your appointment at ${selectedHospital?.name} has been added to the mock data.`,
        })
        setIsBooking(false);
        setSelectedHospital(null);
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Find Hospitals & Book Appointment</CardTitle>
        <CardDescription>
            Use your location to search for nearby hospitals based on your needs and book an appointment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg space-y-4">
            <h4 className="font-semibold">Search Filters</h4>
            <div className='flex flex-col sm:flex-row gap-4'>
                 <Button onClick={getLocation} variant="outline" className="w-full sm:w-auto">
                    <LocateFixed className="mr-2 h-4 w-4" /> {userLocation ? 'Update Location' : 'Use My Location'}
                </Button>
                <div className='flex items-center text-sm text-muted-foreground pt-2'>
                    {locationStatus !== 'Idle' && <p>{locationStatus}</p>}
                </div>
            </div>
           
            <div className="flex items-center space-x-2">
                <Checkbox id="govt-only" checked={isGovernmentOnly} onCheckedChange={(checked) => setIsGovernmentOnly(checked as boolean)} />
                <Label htmlFor="govt-only">Show Government Hospitals Only</Label>
            </div>
            <div>
                <Label>Required Special Equipment</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                    {equipmentList.map(eq => (
                         <div key={eq} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`eq-${eq}`} 
                                checked={requiredEquipment.includes(eq)} 
                                onCheckedChange={() => handleEquipmentChange(eq)}
                            />
                            <Label htmlFor={`eq-${eq}`}>{eq}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <Button onClick={handleFindHospitals} disabled={isLoading || !userLocation} className="w-full sm:w-auto">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</>
          ) : (
            <><Search className="mr-2 h-4 w-4" />Find Hospitals</>
          )}
        </Button>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-pulse">
                <p className="text-muted-foreground">Finding hospitals near you...</p>
            </div>
        )}

        {hospitals && !selectedHospital && (
            <div className="pt-4 space-y-4">
                <h3 className="font-bold text-lg">Found {hospitals.length} matching hospitals:</h3>
                 {hospitals.length > 0 ? (
                    <div className="space-y-4">
                      {userLocation && <MapDisplay userLocation={userLocation} hospitals={hospitals} />}
                      <div className="grid md:grid-cols-2 gap-4">
                          {hospitals.map((hospital) => {
                             const totalDoctorsAvailable = hospital.doctor_availability.reduce((sum, d) => sum + d.available, 0);
                             const totalDoctors = hospital.doctor_availability.reduce((sum, d) => sum + d.total, 0);

                             return (
                              <Card key={hospital.hospital_id} className="flex flex-col">
                                  <CardHeader>
                                      <CardTitle className="font-headline text-lg">{hospital.name}</CardTitle>
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        <Badge variant={hospital.isGovernment ? "secondary" : "outline"}>{hospital.isGovernment ? "Government" : "Private"}</Badge>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-4 w-4"/> {hospital.distanceKm.toFixed(2)} km away
                                        </p>
                                      </div>
                                  </CardHeader>
                                  <CardContent className="flex-grow space-y-4">
                                      <div>
                                        <Label className="text-xs flex items-center gap-2 mb-1"><Users className="h-4 w-4"/> Doctor Availability</Label>
                                        <Progress value={(totalDoctorsAvailable / totalDoctors) * 100} className="h-2" />
                                        <p className="text-xs text-muted-foreground mt-1">{totalDoctorsAvailable} / {totalDoctors} doctors available</p>
                                      </div>

                                      <div>
                                        <Label className="text-xs flex items-center gap-2 mb-1"><Pill className="h-4 w-4"/> Medicine Stock</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(hospital.live_medicine_stock).slice(0, 3).map(([name, stock]) => {
                                                const isLow = stock.quantity < stock.low_stock_threshold;
                                                return <Badge key={name} variant={isLow ? 'destructive' : 'outline'} className="font-normal">{name}</Badge>
                                            })}
                                        </div>
                                      </div>

                                      <p className="text-sm">
                                          <span className="font-semibold">Equipment:</span> {hospital.special_equipment.join(', ') || 'Standard'}
                                      </p>
                                  </CardContent>
                                  <div className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
                                       <Button onClick={() => setSelectedHospital(hospital)} className="w-full">Book Appointment</Button>
                                       <Button asChild variant="outline" className="w-full">
                                          <Link href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`} target="_blank" rel="noopener noreferrer">
                                              <Navigation className="mr-2 h-4 w-4" />
                                              Get Directions
                                          </Link>
                                       </Button>
                                  </div>
                              </Card>
                          )})}
                      </div>
                    </div>
                 ) : (
                    <p className="text-muted-foreground text-center py-4">No hospitals found matching your criteria.</p>
                 )}
            </div>
        )}

        {selectedHospital && (
            <div className="pt-4 space-y-4">
                 <h3 className="font-bold text-lg">Book Appointment at {selectedHospital.name}</h3>
                 <div className='space-y-4 p-4 border rounded-lg'>
                    <div className='space-y-2'>
                        <Label htmlFor='patient-name'>Patient Name</Label>
                        <Input id='patient-name' defaultValue="Gayathri" />
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor='appointment-date'>Preferred Date</Label>
                        <Input id='appointment-date' type='date' defaultValue="2024-09-10" />
                    </div>
                     <div className='space-y-2'>
                        <Label>Specialty</Label>
                        <Select defaultValue="cardiology">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedHospital.doctor_availability.map(dept => (
                                    <SelectItem key={dept.specialty} value={dept.specialty.toLowerCase()} disabled={dept.available === 0}>
                                        {dept.specialty} ({dept.available}/{dept.total} available)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleBookAppointment} disabled={isBooking} className="w-full">
                            {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                            Confirm Booking
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedHospital(null)} className="w-full">Cancel</Button>
                    </div>
                 </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}

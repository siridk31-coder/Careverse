
'use client';

import Image from 'next/image';
import { MapPin, User } from 'lucide-react';
import type { HospitalOperation } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type MapDisplayProps = {
  userLocation: { lat: number; lng: number };
  hospitals: (Pick<HospitalOperation, 'name' | 'location' | 'hospital_id'> & {distanceKm: number})[];
};

// These are arbitrary values to create a bounding box for the map simulation
const MAP_BOUNDS = {
  minLat: 12.8,
  maxLat: 13.1,
  minLng: 77.5,
  maxLng: 77.7,
};

const getRelativePosition = (lat: number, lng: number) => {
  const top = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  const left = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  return { top: `${top}%`, left: `${left}%` };
};

export default function MapDisplay({ userLocation, hospitals }: MapDisplayProps) {
    const mapImage = 'https://images.unsplash.com/photo-1593328221005-75893a4049d5?q=80&w=1080&auto=format&fit=crop';
    const userPos = getRelativePosition(userLocation.lat, userLocation.lng);

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden relative border bg-muted">
       <Image 
        src={mapImage}
        alt="Map of the area"
        fill
        className="object-cover opacity-30"
       />

        {/* User Marker */}
        <div 
            className="absolute -translate-x-1/2 -translate-y-full transform" 
            style={{ top: userPos.top, left: userPos.left }}
            title="Your Location"
        >
            <User className="h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
        </div>

       {/* Hospital Markers */}
        {hospitals.map((hospital, index) => {
            const pos = getRelativePosition(hospital.location.lat, hospital.location.lng);
            return (
                 <div 
                    key={hospital.hospital_id} 
                    className="absolute -translate-x-1/2 -translate-y-full transform flex flex-col items-center"
                    style={{ top: pos.top, left: pos.left }}
                >
                    <div className="relative" title={hospital.name}>
                        <MapPin className="h-8 w-8 text-red-500" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold" style={{ top: '40%'}}>
                            {index + 1}
                        </span>
                    </div>
                    <div className="mt-1 text-xs font-bold bg-black/50 text-white px-2 py-1 rounded-md whitespace-nowrap">
                        {hospital.name}
                    </div>
                </div>
            )
        })}

    </div>
  );
}

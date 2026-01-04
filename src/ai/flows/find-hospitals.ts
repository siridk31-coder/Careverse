
'use server';
/**
 * @fileOverview A Genkit flow for finding nearby hospitals.
 *
 * This file defines a Genkit flow that uses a tool to search a local data source
 * for hospitals based on location and equipment needs.
 *
 * - findHospitals - The main function to call the flow.
 * - FindHospitalsInput - The Zod schema for the flow's input.
 * - FindHospitalsOutput - The Zod schema for the flow's output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { hospitalOperations } from '@/lib/mock-data';
import type { HospitalOperation } from '@/lib/types';


// Helper function to calculate distance (Haversine formula)
function getDistance(loc1: {lat: number, lng: number}, loc2: {lat: number, lng: number}) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const FindHospitalsInputSchema = z.object({
  userLocation: z.object({
      lat: z.number(),
      lng: z.number()
  }).describe("User's current latitude and longitude."),
  isGovernment: z.boolean().optional().describe("Filter for government hospitals."),
  requiredEquipment: z.array(z.enum(["MRI", "Radiotherapy", "PET Scan"])).optional().describe("List of required special equipment."),
});
export type FindHospitalsInput = z.infer<typeof FindHospitalsInputSchema>;


const HospitalSchema = z.object({
    hospital_id: z.string(),
    name: z.string(),
    isGovernment: z.boolean(),
    special_equipment: z.array(z.string()),
    distanceKm: z.number(),
    location: z.object({ lat: z.number(), lng: z.number() }),
    doctor_availability: z.array(z.object({
        specialty: z.string(),
        available: z.number(),
        total: z.number(),
    })),
    live_medicine_stock: z.record(z.string(), z.object({
        quantity: z.number(),
        low_stock_threshold: z.number(),
    })),
});

const FindHospitalsOutputSchema = z.object({
  hospitals: z.array(HospitalSchema).describe('A list of hospitals matching the criteria, sorted by distance.'),
});
export type FindHospitalsOutput = z.infer<typeof FindHospitalsOutputSchema>;


/**
 * A tool that searches for hospitals based on filters.
 * In a real application, this would query a database.
 */
const searchHospitalsTool = ai.defineTool(
  {
    name: 'searchHospitals',
    description: 'Searches for hospitals based on location, type, and available equipment.',
    inputSchema: FindHospitalsInputSchema,
    outputSchema: z.array(z.object({
        hospital_id: z.string(),
        name: z.string(),
        isGovernment: z.boolean(),
        special_equipment: z.array(z.string()),
        location: z.object({ lat: z.number(), lng: z.number() }),
        doctor_availability: z.array(z.object({
            specialty: z.string(),
            available: z.number(),
            total: z.number(),
        })),
        live_medicine_stock: z.record(z.string(), z.object({
            quantity: z.number(),
            low_stock_threshold: z.number(),
        })),
    })),
  },
  async ({ isGovernment, requiredEquipment }) => {
    let results: HospitalOperation[] = hospitalOperations;
    
    if (isGovernment !== undefined) {
        results = results.filter(h => h.isGovernment === isGovernment);
    }

    if (requiredEquipment && requiredEquipment.length > 0) {
        results = results.filter(h => 
            requiredEquipment.every(eq => h.special_equipment.includes(eq as any))
        );
    }
    
    return results.map(h => ({
        hospital_id: h.hospital_id,
        name: h.name,
        isGovernment: h.isGovernment,
        special_equipment: h.special_equipment,
        location: h.location,
        doctor_availability: h.doctor_availability,
        live_medicine_stock: h.live_medicine_stock,
    }));
  }
);


export async function findHospitals(input: FindHospitalsInput): Promise<FindHospitalsOutput> {
  return findHospitalsFlow(input);
}


const findHospitalsFlow = ai.defineFlow(
  {
    name: 'findHospitalsFlow',
    inputSchema: FindHospitalsInputSchema,
    outputSchema: FindHospitalsOutputSchema,
  },
  async (input) => {
    const { isGovernment, requiredEquipment, userLocation } = input;
    
    // Directly call the tool to get a deterministic list of hospitals.
    const toolOutput = await searchHospitalsTool.run({
      userLocation,
      isGovernment,
      requiredEquipment
    });

    const filteredHospitals = toolOutput.result || [];

    // If the tool returns nothing, return an empty array.
    if (!Array.isArray(filteredHospitals)) {
        return { hospitals: [] };
    }
    
    // Calculate distance for each hospital and sort the results.
    const hospitalsWithDistance = filteredHospitals.map(hospital => ({
        ...hospital,
        distanceKm: getDistance(userLocation, hospital.location),
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    return { hospitals: hospitalsWithDistance };
  }
);

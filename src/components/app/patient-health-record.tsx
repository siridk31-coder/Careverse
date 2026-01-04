'use client';

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DigitalHealthRecord } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { FileText, Pill, Scan } from "lucide-react";

type PatientHealthRecordProps = {
  record: DigitalHealthRecord;
};

export default function PatientHealthRecord({ record }: PatientHealthRecordProps) {
  const scans = record.scan_ids.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{record.diagnosis}</CardTitle>
                <CardDescription>
                Recorded by {record.doctor.name} ({record.doctor.specialty}) on {new Date(record.timestamp).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="multiple" defaultValue={['notes', 'prescriptions']} className="w-full space-y-4">
            <AccordionItem value="notes">
                <AccordionTrigger className="p-4 bg-card rounded-lg text-lg font-semibold flex items-center">
                    <FileText className="mr-3" /> Doctor's Notes
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2">
                     <Card>
                        <CardContent className="pt-6">
                            <p className="prose prose-sm max-w-none text-foreground">{record.notes}</p>
                        </CardContent>
                     </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="prescriptions">
                <AccordionTrigger className="p-4 bg-card rounded-lg text-lg font-semibold flex items-center">
                    <Pill className="mr-3" /> Prescriptions
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2">
                     <Card>
                        <CardContent className="pt-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Medicine</TableHead>
                                    <TableHead>Dosage</TableHead>
                                    <TableHead>Frequency</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {record.prescriptions.map((p, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.dosage}</TableCell>
                                        <TableCell>{p.frequency}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                     </Card>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="scans">
                <AccordionTrigger className="p-4 bg-card rounded-lg text-lg font-semibold flex items-center">
                    <Scan className="mr-3" /> Scans & Reports
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-2">
                    <Card>
                        <CardContent className="pt-6">
                            {scans.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {scans.map(scan => scan && (
                                        <div key={scan.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border">
                                            <Image 
                                                src={scan.imageUrl}
                                                alt={scan.description}
                                                fill
                                                className="object-cover"
                                                data-ai-hint={scan.imageHint}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No scans available for this record.</p>
                            )}
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}

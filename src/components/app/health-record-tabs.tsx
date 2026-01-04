

'use client';

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DigitalHealthRecord, Patient } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import CarePlanGenerator from "./care-plan-generator";
import { FileText, Pill, Scan, Edit, Save, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HealthRecordTabsProps = {
  record: DigitalHealthRecord;
  patient: Patient;
};

export default function HealthRecordTabs({ record: initialRecord, patient }: HealthRecordTabsProps) {
  const [record, setRecord] = useState(initialRecord);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(record.notes);
  const [isEditingPrescriptions, setIsEditingPrescriptions] = useState(false);
  const [prescriptions, setPrescriptions] = useState(record.prescriptions);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(record.timestamp).toLocaleDateString());
  }, [record.timestamp]);


  const scans = record.scan_ids.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  const handleSaveNotes = () => {
    setRecord({...record, notes});
    setIsEditingNotes(false);
    // In a real app, this would be an API call to save the data.
  };

  const handleSavePrescriptions = () => {
    setRecord({...record, prescriptions});
    setIsEditingPrescriptions(false);
  };
  
  const handlePrescriptionChange = (index: number, field: string, value: string) => {
    const newPrescriptions = [...prescriptions];
    newPrescriptions[index] = { ...newPrescriptions[index], [field]: value };
    setPrescriptions(newPrescriptions);
  };

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { name: '', dosage: '', frequency: '' }]);
  };

  const handleRemovePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
  };

  return (
    <Tabs defaultValue="diagnosis" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="diagnosis"><FileText className="mr-2 h-4 w-4" />Diagnosis & Notes</TabsTrigger>
        <TabsTrigger value="prescriptions"><Pill className="mr-2 h-4 w-4" />Prescriptions</TabsTrigger>
        <TabsTrigger value="scans"><Scan className="mr-2 h-4 w-4" />Scans & Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="diagnosis">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{record.diagnosis}</CardTitle>
            <CardDescription>
              Recorded by {record.doctor.name} ({record.doctor.specialty}) on {formattedDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none text-foreground">
                {isEditingNotes ? (
                    <Textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[150px]"
                    />
                ) : (
                    <p>{record.notes}</p>
                )}
            </div>
             <div className="flex justify-end gap-2">
                {isEditingNotes ? (
                    <Button onClick={handleSaveNotes}><Save className="mr-2 h-4 w-4" /> Save Notes</Button>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditingNotes(true)}><Edit className="mr-2 h-4 w-4" /> Edit Notes</Button>
                )}
            </div>
            <CarePlanGenerator record={record} patient={patient} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="prescriptions">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Medication Plan</CardTitle>
            <CardDescription>Prescribed by {record.doctor.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  {isEditingPrescriptions && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                        {isEditingPrescriptions ? <Input value={p.name} onChange={(e) => handlePrescriptionChange(i, 'name', e.target.value)} /> : p.name}
                    </TableCell>
                    <TableCell>
                        {isEditingPrescriptions ? <Input value={p.dosage} onChange={(e) => handlePrescriptionChange(i, 'dosage', e.target.value)} /> : p.dosage}
                    </TableCell>
                    <TableCell>
                        {isEditingPrescriptions ? <Input value={p.frequency} onChange={(e) => handlePrescriptionChange(i, 'frequency', e.target.value)} /> : p.frequency}
                    </TableCell>
                    {isEditingPrescriptions && (
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemovePrescription(i)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {isEditingPrescriptions && (
                <Button variant="outline" size="sm" className="mt-4" onClick={handleAddPrescription}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Medicine
                </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
             {isEditingPrescriptions ? (
                <Button onClick={handleSavePrescriptions}><Save className="mr-2 h-4 w-4" /> Save Prescriptions</Button>
             ) : (
                <Button variant="outline" onClick={() => setIsEditingPrescriptions(true)}><Edit className="mr-2 h-4 w-4" /> Edit Prescriptions</Button>
             )}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="scans">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Medical Scans</CardTitle>
            <CardDescription>Attached reports and scans for this record.</CardDescription>
          </CardHeader>
          <CardContent>
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
      </TabsContent>
    </Tabs>
  );
}

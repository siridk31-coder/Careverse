import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient } from "@/lib/types";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

type PatientsTableProps = {
  patients: Patient[];
};

export default function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead className="hidden sm:table-cell">Age</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => {
          const avatar = PlaceHolderImages.find(p => p.id === patient.avatarId);
          return (
            <TableRow key={patient.uid}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {avatar && <AvatarImage src={avatar.imageUrl} alt={patient.name} />}
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{patient.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{patient.age}</TableCell>
              <TableCell>
                <Badge variant="outline">Waiting</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/doctor/patient-record/rec${patient.uid === 'p1' ? '1' : '3'}`}>
                    View Record <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

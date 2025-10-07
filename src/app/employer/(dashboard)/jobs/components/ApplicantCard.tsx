
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle2, Mail, Clock } from "lucide-react";
import Link from 'next/link';
import { EmployerJobApplication } from '../hooks/useJobApplicants';

interface ApplicantCardProps {
  application: EmployerJobApplication;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return `hace ${Math.floor(seconds)} segundos`;
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'postulado':
      return 'default';
    case 'en revisión':
      return 'secondary';
    case 'entrevista':
      return 'outline';
    case 'rechazado':
      return 'destructive';
    case 'contratado':
      return 'default';
    default:
      return 'outline';
  }
};

export default function ApplicantCard({ application }: ApplicantCardProps) {
  const { applicant, status, created_at } = application;
console.log(applicant)
  return (
    <Link href={`/employer/applicants/${applicant.profile_id}/`} className="block">
      <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 rounded-lg h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center">
              {applicant.profile_picture ? (
                <img src={applicant.profile_picture} alt={applicant.first_name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserCircle2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="flex-grow">
              <CardTitle className="text-lg">{applicant.first_name} {applicant.last_name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-4 w-4" /> {applicant.email}
              </p>
            </div>
            <Badge variant={getStatusVariant(status)} className="capitalize">{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="flex items-center justify-end text-xs text-muted-foreground mt-4">
            <Clock className="h-3 w-3 mr-1" />
            Postulado {timeAgo(created_at)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

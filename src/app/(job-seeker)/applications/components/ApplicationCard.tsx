
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, Mail, Briefcase, CalendarCheck, CalendarPlus } from "lucide-react";
import { JobApplication, InterviewDetails } from '../hooks/useMyApplications';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useDownloadICS } from '@/app/hooks/useDownloadICS';

interface ApplicationCardProps {
  application: JobApplication;
  onRespondToInterview: (interview: InterviewDetails) => void;
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

export default function ApplicationCard({ application, onRespondToInterview }: ApplicationCardProps) {
  const { job_post, status, created_at, interview } = application;
  const { download } = useDownloadICS();

  return (
    <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 rounded-lg h-full flex flex-col">
      <Link href={`/jobs/${job_post.id}`} className="block flex-grow">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src={job_post.employer.logo_url || "/company_placeholder.png"} alt={job_post.employer.company_name} className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-semibold text-primary">{job_post.employer.company_name}</p>
              <CardTitle className="text-lg leading-tight">{job_post.title}</CardTitle>
            </div>
            <Badge variant={getStatusVariant(status)} className="capitalize">{status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{job_post.employer.industry || "Industria no especificada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{job_post.employer.email}</span>
            </div>
          </div>
          <div className="flex items-center justify-end text-xs text-muted-foreground mt-4">
            <Clock className="h-3 w-3 mr-1" />
            Postulado {timeAgo(created_at)}
          </div>
        </CardContent>
      </Link>
      {status === 'Entrevista' && interview && (
        <div className="p-4 border-t space-y-2">
          {interview.candidate_response_status === 'Pendiente' ? (
            <Button
              onClick={() => onRespondToInterview({
                id: interview.id,
                scheduled_at: interview.scheduled_at,
                format: interview.format,
                notes: interview.notes,
                candidate_response_status: interview.candidate_response_status,
                requested_accommodations: interview.requested_accommodations,
                job_post_title: job_post.title,
                employer_name: job_post.employer.company_name,
              })}
              className="w-full bg-accent hover:bg-accent/80 cursor-pointer"
            >
              <CalendarCheck className="mr-2 h-4 w-4" /> Responder Entrevista
            </Button>
          ) : (
            <Button className="w-full bg-accent hover:bg-accent/80 cursor-pointer" onClick={() => download(interview.id)}>
              <CalendarPlus className="mr-2 h-4 w-4" /> Añadir al Calendario
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}


'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, Mail, Briefcase } from "lucide-react";
import { JobApplication } from '../hooks/useMyApplications';
import Link from 'next/link';

interface ApplicationCardProps {
  application: JobApplication;
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
    case 'rechazado':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { job_post, status, created_at } = application;

  return (
    <Link href={`/jobs/${job_post.id}`} className="block">
      <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 rounded-lg h-full flex flex-col">
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
      </Card>
    </Link>
  );
}

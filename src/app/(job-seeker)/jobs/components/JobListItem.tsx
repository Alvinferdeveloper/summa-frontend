
'use client';

import { Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Employer {
  company_name: string;
  logo_url: string;
  industry: string;
  email:string
}

export interface Job {
  ID: number;
  title: string;
  location: string;
  work_model: string;
  created_at: string;
  employer: Employer;
  accessibility_features: string;
  description: string;
  responsibilities: string;
  requirements: string;
  contract_type: string;
}

interface JobListItemProps {
  job: Job;
  isActive: boolean;
  onClick: () => void;
}

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  console.log(dateString, "dateString")
  if (interval > 1) return Math.floor(interval) + " años";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " días";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos";
  return Math.floor(seconds) + " segundos";
};

export default function JobListItem({ job, isActive, onClick }: JobListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
          {job.employer.logo_url ? (
            <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-contain rounded-md" />
          ) : (
            <Building2 className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-grow">
          <p className="text-sm font-semibold text-blue-600">{job.employer.company_name}</p>
          <h3 className="font-bold text-lg">{job.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{job.work_model}</Badge>
          </div>
        </div>
        <div className="flex-shrink-0 text-xs text-muted-foreground">
          {timeAgo(job.created_at)}
        </div>
      </div>
    </div>
  );
}

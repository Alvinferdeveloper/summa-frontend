
'use client';

import { Home } from "lucide-react";
interface Employer {
  company_name: string;
  logo_url: string;
  industry: string;
  email: string
}

export interface Job {
  id: number;
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
    <button
      onClick={onClick}
      className={`w-[95%] text-left text-2xl p-5 rounded-lg mb-2 border transition-all bg-white hover:shadow-md relative ${isActive ? "border-primary bg-primary/5 shadow-sm" : "border-red-900"
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Se precisa Urgente</span>
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">Empleo destacado</span>
        </div>
      </div>

      <h3 className="font-bold text-xl text-foreground mb-2 leading-tight">{job.title}</h3>

      <p className="text-base text-muted-foreground mb-2 font-medium">{job.employer.company_name}</p>

      <p className="text-lg text-muted-foreground mb-3">{job.location}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-primary">
          <Home className="h-4 w-4" />
          <span className="font-medium">Remoto</span>
        </div>

        <span className="text-xs text-muted-foreground">Hace {timeAgo(job.created_at)} días</span>
      </div>
    </button>
  );
}

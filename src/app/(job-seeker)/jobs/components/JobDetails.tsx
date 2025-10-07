
'use client';

import { useState } from 'react';
import { Job } from './JobListItem';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, MapPin, Briefcase, Zap } from "lucide-react";
import ApplyModal from './ApplyModal';

interface JobDetailsProps {
  job: Job | null;
}

export default function JobDetails({ job }: JobDetailsProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  if (!job) {
    return (
      <div className="hidden lg:flex h-full items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-muted-foreground">Selecciona un empleo para ver los detalles</p>
      </div>
    );
  }

  const accessibilityFeatures = job.accessibility_features ? JSON.parse(job.accessibility_features) : [];

  return (
    <>
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={job} />
      <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <ScrollArea className="h-full p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
              {job.employer.logo_url ? (
                <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <Building2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <p className="text-lg text-muted-foreground">{job.employer.company_name}</p>
            </div>
          </div>

          <Button onClick={() => setIsApplyModalOpen(true)} className="w-full h-12 text-lg mb-6">Postular Ahora</Button>

          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</div>
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {job.contract_type}</div>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="font-bold">Descripción del Puesto</h3>
            <p>{job.description}</p>

            <h3 className="font-bold">Responsabilidades</h3>
            <p>{job.responsibilities}</p>

            <h3 className="font-bold">Requisitos</h3>
            <p>{job.requirements}</p>
          </div>

          {accessibilityFeatures.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold flex items-center gap-2 mb-3"><Zap className="h-5 w-5 text-primary" /> Características de Accesibilidad</h3>
              <div className="flex flex-wrap gap-2">
                {accessibilityFeatures.map((feature: string) => (
                  <Badge key={feature} variant="outline">{feature}</Badge>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}

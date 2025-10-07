
'use client';

import { useJobApplicants } from '../../hooks/useJobApplicants';
import ApplicantCard from '../../components/ApplicantCard';
import { Loader2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';


export default function JobApplicantsPage() {
  const { jobId } =  useParams() as { jobId: string };
  const { data: applicants, isLoading, error } = useJobApplicants(jobId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar los postulantes: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Postulantes para el Empleo #{jobId}</h1>
        <Link href="/employer/dashboard">
          <Button variant="outline">Volver al Dashboard</Button>
        </Link>
      </div>

      {applicants && applicants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((app) => (
            <ApplicantCard key={app.ID} application={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Briefcase className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Aún no hay postulantes para este empleo.</h3>
          <p>Comparte tu oferta para atraer más talento.</p>
        </div>
      )}
    </div>
  );
}

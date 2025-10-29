"use client"
import { useState } from 'react';
import { useMyApplications, InterviewDetails } from './hooks/useMyApplications';
import ApplicationCard from './components/ApplicationCard';
import RespondToInterviewModal from './components/RespondToInterviewModal';
import { Loader2, Heart } from 'lucide-react';

export default function ApplicationsPage() {
  const { data: applications, status, error } = useMyApplications();

  const [isRespondModalOpen, setIsRespondModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<InterviewDetails | null>(null);

  const handleRespondToInterview = (interview: InterviewDetails) => {
    setSelectedInterview(interview);
    setIsRespondModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <RespondToInterviewModal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModal(false)}
        interview={selectedInterview}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-8">Mis Postulaciones</h1>

      {status === 'pending' ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : status === 'error' ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : applications && applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              onRespondToInterview={handleRespondToInterview}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No has postulado a ningún empleo todavía.</h3>
          <p>¡Los empleos a los que postules aparecerán aquí!</p>
        </div>
      )}
    </div>
  );
}

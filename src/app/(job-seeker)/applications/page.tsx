'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationList from './components/ApplicationList';
import RespondToInterviewModal from './components/RespondToInterviewModal';
import { InterviewDetails } from './hooks/useMyApplications';

const tabs = [
  { value: 'Todas', label: 'Todas' },
  { value: 'Postulado', label: 'Postulado' },
  { value: 'Entrevista', label: 'Entrevista' },
  { value: 'Aceptado', label: 'Aceptado' },
  { value: 'Rechazado', label: 'Rechazado' },
];

export default function ApplicationsPage() {
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<InterviewDetails | null>(null);

  const handleRespondToInterview = (interview: InterviewDetails) => {
    setSelectedInterview(interview);
    setIsRespondModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-2">
      <RespondToInterviewModal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        interview={selectedInterview}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-8">Mis Postulaciones</h1>

      <Tabs defaultValue="Todas" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-primary/80">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className='cursor-pointer'>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <ApplicationList
              status={tab.value}
              onRespondToInterview={handleRespondToInterview}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ScheduleInterviewPayload {
  job_application_id: number;
  scheduled_at: string;
  format: string;
  notes?: string;
}

const scheduleInterview = async (data: ScheduleInterviewPayload) => {
  const response = await api.post('/v1/interviews', data);
  return response.data;
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ScheduleInterviewPayload>({
    mutationFn: scheduleInterview,
    onSuccess: () => {
      toast.success("Entrevista Agendada Exitosamente");
      queryClient.invalidateQueries({ queryKey: ['jobApplicants']});
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (error: any) => {
      toast.error("Error al Agendar Entrevista", { description: error.response?.data?.error });
    },
  });
};

interface RespondToInterviewPayload {
  interviewId: number;
  status: 'Aceptada' | 'Rechazada';
  requested_accommodations?: string;
}

const respondToInterview = async ({ interviewId, ...data }: RespondToInterviewPayload) => {
  const response = await api.put(`/v1/interviews/${interviewId}/respond`, data);
  return response.data;
};

export const useRespondToInterview = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, RespondToInterviewPayload>({
    mutationFn: respondToInterview,
    onSuccess: () => {
      toast.success("Respuesta Enviada");
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (error: any) => {
      toast.error("Error al Enviar Respuesta", { description: error.response?.data?.error });
    },
  });
};

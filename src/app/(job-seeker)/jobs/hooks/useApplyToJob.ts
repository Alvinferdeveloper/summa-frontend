
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ApplyToJobPayload {
  jobId: number;
  cover_letter?: string;
}

const applyToJob = async ({ jobId, cover_letter }: ApplyToJobPayload) => {
  const response = await api.post(`/v1/jobs/${jobId}/apply`, { cover_letter });
  return response.data;
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, ApplyToJobPayload>({
    mutationFn: applyToJob,
    onSuccess: () => {
      toast.success("¡Postulación Exitosa!", {
        description: "Tu postulación ha sido enviada. ¡Mucha suerte!",
      });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: (error: any) => {
      toast.error("Error en la Postulación", {
        description: error.response?.data?.error || "No se pudo enviar tu postulación. Inténtalo de nuevo.",
      });
    },
  });
};

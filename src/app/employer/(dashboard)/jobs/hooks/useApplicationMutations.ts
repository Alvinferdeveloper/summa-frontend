
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UpdateStatusPayload {
  applicationId: number;
  status: string;
}

const updateApplicationStatus = async ({ applicationId, status }: UpdateStatusPayload) => {
  const response = await api.put(`/v1/applications/${applicationId}/status`, { status });
  return response.data;
};

export const useUpdateApplicationStatus = (jobId: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateStatusPayload>({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      toast.success("Estado de la postulación actualizado.", {
        description: `El estado ahora es: ${data.application.status}`,
      });
      // Invalidar la query de los postulantes para este empleo para que se actualice la lista
      queryClient.invalidateQueries({ queryKey: ['jobApplicants', jobId] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar el estado.", {
        description: error.response?.data?.error || "No se pudo completar la acción.",
      });
    },
  });
};

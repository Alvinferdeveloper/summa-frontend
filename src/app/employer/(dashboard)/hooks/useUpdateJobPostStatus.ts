'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UpdateStatusPayload {
  jobId: string;
  status: 'open' | 'closed';
}

const updateJobPostStatus = async ({ jobId, status }: UpdateStatusPayload) => {
  const response = await api.patch(`/v1/jobs/${jobId}/status`, { status });
  return response.data;
};

export const useUpdateJobPostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJobPostStatus,
    onSuccess: () => {
      toast.success("Estado de la oferta actualizado con éxito.");
      queryClient.invalidateQueries({ queryKey: ['employerJobPosts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "No se pudo actualizar el estado de la oferta.");
    },
  });
};

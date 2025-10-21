'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import type { JobPostSchema } from '../create/page';

const updateJobPost = async ({ id, data }: { id: string; data: JobPostSchema }) => {
  const response = await api.put(`/v1/jobs/${id}`, data);
  return response.data;
};

export const useUpdateJobPost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JobPostSchema) => updateJobPost({ id, data }),
    onSuccess: () => {
      toast.success("Oferta de empleo actualizada con éxito.");
      queryClient.invalidateQueries({ queryKey: ['jobPost', id] });
      queryClient.invalidateQueries({ queryKey: ['employerJobPosts'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "No se pudo actualizar la oferta de empleo.");
    },
  });
};

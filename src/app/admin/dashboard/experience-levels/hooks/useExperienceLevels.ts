
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface ExperienceLevel {
  id: number;
  name: string;
}

const fetchExperienceLevels = async (): Promise<ExperienceLevel[]> => {
  const { data } = await api.get('/v1/admin/experience-levels');
  return data;
};

export const useAdminExperienceLevels = () => {
  return useQuery<ExperienceLevel[], Error>({
    queryKey: ['adminExperienceLevels'],
    queryFn: fetchExperienceLevels,
  });
};

type ExperienceLevelPayload = Omit<ExperienceLevel, 'id'>;

const createExperienceLevel = async (newData: ExperienceLevelPayload) => {
  const { data } = await api.post('/v1/admin/experience-levels', newData);
  return data;
};

const updateExperienceLevel = async ({ id, ...updateData }: ExperienceLevel) => {
  const { data } = await api.put(`/v1/admin/experience-levels/${id}`, updateData);
  return data;
};

const deleteExperienceLevel = async (id: number) => {
  await api.delete(`/v1/admin/experience-levels/${id}`);
};

export const useCreateExperienceLevel = () => {
  const queryClient = useQueryClient();
  return useMutation<ExperienceLevel, Error, ExperienceLevelPayload>({
    mutationFn: createExperienceLevel,
    onSuccess: () => {
      toast.success("Nivel de Experiencia Creado");
      queryClient.invalidateQueries({ queryKey: ['adminExperienceLevels'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateExperienceLevel = () => {
  const queryClient = useQueryClient();
  return useMutation<ExperienceLevel, Error, ExperienceLevel>({
    mutationFn: updateExperienceLevel,
    onSuccess: () => {
      toast.success("Nivel de Experiencia Actualizado");
      queryClient.invalidateQueries({ queryKey: ['adminExperienceLevels'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteExperienceLevel = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteExperienceLevel,
    onSuccess: () => {
      toast.success("Nivel de Experiencia Eliminado");
      queryClient.invalidateQueries({ queryKey: ['adminExperienceLevels'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};

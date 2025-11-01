
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface WorkModel {
  id: number;
  name: string;
}

const fetchWorkModels = async (): Promise<WorkModel[]> => {
  const { data } = await api.get('/v1/admin/work-models');
  return data;
};

export const useAdminWorkModels = () => {
  return useQuery<WorkModel[], Error>({
    queryKey: ['adminWorkModels'],
    queryFn: fetchWorkModels,
  });
};

type WorkModelPayload = Omit<WorkModel, 'id'>;

const createWorkModel = async (newData: WorkModelPayload) => {
  const { data } = await api.post('/v1/admin/work-models', newData);
  return data;
};

const updateWorkModel = async ({ id, ...updateData }: WorkModel) => {
  const { data } = await api.put(`/v1/admin/work-models/${id}`, updateData);
  return data;
};

const deleteWorkModel = async (id: number) => {
  await api.delete(`/v1/admin/work-models/${id}`);
};

export const useCreateWorkModel = () => {
  const queryClient = useQueryClient();
  return useMutation<WorkModel, Error, WorkModelPayload>({
    mutationFn: createWorkModel,
    onSuccess: () => {
      toast.success("Modelo de Trabajo Creado");
      queryClient.invalidateQueries({ queryKey: ['adminWorkModels'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateWorkModel = () => {
  const queryClient = useQueryClient();
  return useMutation<WorkModel, Error, WorkModel>({
    mutationFn: updateWorkModel,
    onSuccess: () => {
      toast.success("Modelo de Trabajo Actualizado");
      queryClient.invalidateQueries({ queryKey: ['adminWorkModels'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteWorkModel = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteWorkModel,
    onSuccess: () => {
      toast.success("Modelo de Trabajo Eliminado");
      queryClient.invalidateQueries({ queryKey: ['adminWorkModels'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};

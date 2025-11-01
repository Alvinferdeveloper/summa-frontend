'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface DisabilityType {
  id: number;
  name: string;
  description: string;
}

const fetchDisabilityTypes = async (): Promise<DisabilityType[]> => {
  const { data } = await api.get('/v1/admin/disability-types');
  return data;
};

export const useAdminDisabilityTypes = () => {
  return useQuery<DisabilityType[], Error>({
    queryKey: ['adminDisabilityTypes'],
    queryFn: fetchDisabilityTypes,
  });
};

type CreateDisabilityTypePayload = {
  name: string;
  description?: string;
};

const createDisabilityType = async (newData: CreateDisabilityTypePayload) => {
  const { data } = await api.post('/v1/admin/disability-types', newData);
  return data;
};

const updateDisabilityType = async ({ id, ...updateData }: DisabilityType) => {
  const { data } = await api.put(`/v1/admin/disability-types/${id}`, updateData);
  return data;
};

const deleteDisabilityType = async (id: number) => {
  await api.delete(`/v1/admin/disability-types/${id}`);
};

export const useCreateDisabilityType = () => {
  const queryClient = useQueryClient();
  return useMutation<DisabilityType, Error, CreateDisabilityTypePayload>({
    mutationFn: createDisabilityType,
    onSuccess: () => {
      toast.success("Tipo de Discapacidad Creado");
      queryClient.invalidateQueries({ queryKey: ['adminDisabilityTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateDisabilityType = () => {
  const queryClient = useQueryClient();
  return useMutation<DisabilityType, Error, DisabilityType>({
    mutationFn: updateDisabilityType,
    onSuccess: () => {
      toast.success("Tipo de Discapacidad Actualizado");
      queryClient.invalidateQueries({ queryKey: ['adminDisabilityTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteDisabilityType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteDisabilityType,
    onSuccess: () => {
      toast.success("Tipo de Discapacidad Eliminado");
      queryClient.invalidateQueries({ queryKey: ['adminDisabilityTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};

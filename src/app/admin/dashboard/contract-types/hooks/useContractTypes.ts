
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface ContractType {
  id: number;
  name: string;
}

// --- Fetch ---
const fetchContractTypes = async (): Promise<ContractType[]> => {
  const { data } = await api.get('/v1/admin/contract-types');
  return data;
};

export const useAdminContractTypes = () => {
  return useQuery<ContractType[], Error>({
    queryKey: ['adminContractTypes'],
    queryFn: fetchContractTypes,
  });
};

// --- Mutations ---
type ContractTypePayload = Omit<ContractType, 'id'>;

const createContractType = async (newData: ContractTypePayload) => {
  const { data } = await api.post('/v1/admin/contract-types', newData);
  return data;
};

const updateContractType = async ({ id, ...updateData }: ContractType) => {
  const { data } = await api.put(`/v1/admin/contract-types/${id}`, updateData);
  return data;
};

const deleteContractType = async (id: number) => {
  await api.delete(`/v1/admin/contract-types/${id}`);
};

export const useCreateContractType = () => {
  const queryClient = useQueryClient();
  return useMutation<ContractType, Error, ContractTypePayload>({
    mutationFn: createContractType,
    onSuccess: () => {
      toast.success("Tipo de Contrato Creado");
      queryClient.invalidateQueries({ queryKey: ['adminContractTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateContractType = () => {
  const queryClient = useQueryClient();
  return useMutation<ContractType, Error, ContractType>({
    mutationFn: updateContractType,
    onSuccess: () => {
      toast.success("Tipo de Contrato Actualizado");
      queryClient.invalidateQueries({ queryKey: ['adminContractTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteContractType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteContractType,
    onSuccess: () => {
      toast.success("Tipo de Contrato Eliminado");
      queryClient.invalidateQueries({ queryKey: ['adminContractTypes'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};

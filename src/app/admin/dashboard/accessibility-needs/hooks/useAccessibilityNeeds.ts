
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface AccessibilityNeed {
  id: number;
  name: string;
  category: string;
}

const fetchAccessibilityNeeds = async (): Promise<AccessibilityNeed[]> => {
  const { data } = await api.get('/v1/admin/accessibility-needs');
  return data;
};

export const useAdminAccessibilityNeeds = () => {
  return useQuery<AccessibilityNeed[], Error>({
    queryKey: ['adminAccessibilityNeeds'],
    queryFn: fetchAccessibilityNeeds,
  });
};

type AccessibilityNeedPayload = Omit<AccessibilityNeed, 'id'>;

const createAccessibilityNeed = async (newData: AccessibilityNeedPayload) => {
  const { data } = await api.post('/v1/admin/accessibility-needs', newData);
  return data;
};

const updateAccessibilityNeed = async ({ id, ...updateData }: AccessibilityNeed) => {
  const { data } = await api.put(`/v1/admin/accessibility-needs/${id}`, updateData);
  return data;
};

const deleteAccessibilityNeed = async (id: number) => {
  await api.delete(`/v1/admin/accessibility-needs/${id}`);
};

export const useCreateAccessibilityNeed = () => {
  const queryClient = useQueryClient();
  return useMutation<AccessibilityNeed, Error, AccessibilityNeedPayload>({
    mutationFn: createAccessibilityNeed,
    onSuccess: () => {
      toast.success("Necesidad de Accesibilidad Creada");
      queryClient.invalidateQueries({ queryKey: ['adminAccessibilityNeeds'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateAccessibilityNeed = () => {
  const queryClient = useQueryClient();
  return useMutation<AccessibilityNeed, Error, AccessibilityNeed>({
    mutationFn: updateAccessibilityNeed,
    onSuccess: () => {
      toast.success("Necesidad de Accesibilidad Actualizada");
      queryClient.invalidateQueries({ queryKey: ['adminAccessibilityNeeds'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteAccessibilityNeed = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteAccessibilityNeed,
    onSuccess: () => {
      toast.success("Necesidad de Accesibilidad Eliminada");
      queryClient.invalidateQueries({ queryKey: ['adminAccessibilityNeeds'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};


'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Category {
  id: number;
  name: string;
}

// --- Fetch ---
const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/v1/admin/categories');
  return data;
};

export const useAdminCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['adminCategories'],
    queryFn: fetchCategories,
  });
};

// --- Mutations ---
type CategoryPayload = Omit<Category, 'id'>;

const createCategory = async (newData: CategoryPayload) => {
  const { data } = await api.post('/v1/admin/categories', newData);
  return data;
};

const updateCategory = async ({ id, ...updateData }: Category) => {
  const { data } = await api.put(`/v1/admin/categories/${id}`, updateData);
  return data;
};

const deleteCategory = async (id: number) => {
  await api.delete(`/v1/admin/categories/${id}`);
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CategoryPayload>({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Categoría Creada");
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
    onError: (error: any) => {
      toast.error("Error al crear", { description: error.response?.data?.error });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, Category>({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Categoría Actualizada");
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar", { description: error.response?.data?.error });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Categoría Eliminada");
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar", { description: error.response?.data?.error });
    },
  });
};

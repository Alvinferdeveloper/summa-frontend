
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface EmployerProfileData {
  ID: number;
  company_name: string;
  email: string;
  website: string;
  phone_number: string;
  country: string;
  dedication: string;
  foundation_date: string;
  industry: string;
  size: string;
  description: string;
  address: string;
  logo_url: string;
}

const fetchMyEmployerProfile = async (): Promise<EmployerProfileData> => {
  const { data } = await api.get('/v1/employer/me');
  return data;
};

export const useMyEmployerProfile = () => {
  return useQuery<EmployerProfileData, Error>({
    queryKey: ['myEmployerProfile'],
    queryFn: fetchMyEmployerProfile,
  });
};

const updateMyEmployerProfile = async (data: Partial<EmployerProfileData>) => {
  const { data: response } = await api.put('/v1/employer/me', data);
  return response;
};

export const useUpdateEmployerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyEmployerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmployerProfile'] });
      toast.success("Perfil actualizado exitosamente.");
    },
    onError: (error: any) => {
      toast.error("Error al actualizar el perfil.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });
};

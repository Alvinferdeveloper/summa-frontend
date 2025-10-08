import { ExperienceFormValues } from "../components/ExperienceList";
import api from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const updateExperienceFn = async ({ id, data }: { id: number, data: ExperienceFormValues }) => {
    const response = await api.put(`/v1/profile/experiences/${id}`, {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    });
    return response.data;
  };
  
  export const useUpdateExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({ 
      mutationFn: updateExperienceFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        toast.success("Experiencia actualizada.");
      },
      onError: (error: any) => {
        toast.error("Error al actualizar experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
      },
    });
  };
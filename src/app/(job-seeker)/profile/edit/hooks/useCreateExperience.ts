import { ExperienceFormValues } from "../components/ExperienceList";
import api from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const createExperienceFn = async (data: ExperienceFormValues) => {
    const response = await api.post('/v1/profile/experiences', {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    });
    return response.data;
  };
  
  export const useCreateExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({ 
      mutationFn: createExperienceFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        toast.success("Experiencia añadida.");
      },
      onError: (error: any) => {
        toast.error("Error al añadir experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
      },
    });
  };
  
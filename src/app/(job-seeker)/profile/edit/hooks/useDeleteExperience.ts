import api from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const deleteExperienceFn = async (id: number) => {
    const response = await api.delete(`/v1/profile/experiences/${id}`);
    return response.data;
  };
  
  export const useDeleteExperience = () => {
    const queryClient = useQueryClient();
    return useMutation({ 
      mutationFn: deleteExperienceFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        toast.success("Experiencia eliminada.");
      },
      onError: (error: any) => {
        toast.error("Error al eliminar experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
      },
    });
  };
  
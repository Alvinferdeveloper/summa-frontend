import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { PersonalInfoFormValues } from '../components/PersonalInfoForm';

export const useUpdatePersonalInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: PersonalInfoFormValues) => {
            await api.put('/v1/profile/personal-info', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Información personal actualizada.", { description: "Tus cambios han sido guardados." });
        },
        onError: (error: any) => {
            toast.error("Error al actualizar la información personal.", { description: error.response?.data?.error || "Ha ocurrido un error." });
        },
    });
};
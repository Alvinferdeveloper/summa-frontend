import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { SkillsFormValues } from '../components/SkillsList';

export const useUpdateSkills = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SkillsFormValues) => {
            await api.put('/v1/profile/skills', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Habilidades actualizadas.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Error al actualizar habilidades.");
        },
    });
};
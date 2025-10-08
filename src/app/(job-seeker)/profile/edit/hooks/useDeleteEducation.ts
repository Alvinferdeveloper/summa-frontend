import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteEducation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/v1/profile/educations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Formación eliminada.");
        },
        onError: (error: any) => {
            toast.error("Error al eliminar la formación.", { description: error.response?.data?.error || "Ha ocurrido un error." });
        },
    });
}
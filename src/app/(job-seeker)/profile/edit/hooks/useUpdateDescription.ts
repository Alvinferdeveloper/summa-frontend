import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { DescriptionFormValues } from "../components/DescriptionForm";

export const useUpdateDescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: DescriptionFormValues) => {
            await api.put('/v1/profile/description', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Descripción actualizada.", { description: "Tus cambios han sido guardados." });
        },
        onError: (error: any) => {
            toast.error("Error al actualizar la descripción.", { description: error.response?.data?.error || "Ha ocurrido un error." });
        },
    });
};

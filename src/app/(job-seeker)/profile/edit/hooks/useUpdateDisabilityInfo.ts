import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { DisabilityInfoFormValues } from "../components/DisabilityInfoForm";
import { toast } from "sonner";

export const useUpdateDisabilityInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: DisabilityInfoFormValues) => {
            await api.put('/v1/profile/disability-info', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Información de discapacidad actualizada.", { description: "Tus cambios han sido guardados." });
        },
        onError: (error: any) => {
            toast.error("Error al actualizar la información de discapacidad.", { description: error.response?.data?.error || "Ha ocurrido un error." });
        },
    });
}
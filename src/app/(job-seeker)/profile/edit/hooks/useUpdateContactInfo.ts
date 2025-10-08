import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ContactInfoFormValues } from "../components/ContactInfoForm";

export const useUpdateContactInfo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ContactInfoFormValues) => {
            await api.put('/v1/profile/contact-info', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
            toast.success("Información de contacto actualizada.", { description: "Tus cambios han sido guardados." });
        },
        onError: (error: any) => {
            toast.error("Error al actualizar la información de contacto.", { description: error.response?.data?.error || "Ha ocurrido un error." });
        },
    });
};
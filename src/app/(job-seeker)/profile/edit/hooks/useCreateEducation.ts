import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { CreateEducationPayload } from "../components/EducationForm";

const createEducation = async (data: CreateEducationPayload) => {
    const response = await api.post('/v1/profile/educations', {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
    });
    return response.data;
};

export const useCreateEducation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEducation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile'] });
        }
    });
}



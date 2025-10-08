import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const createNewUniversity = async (data: { suggested_name: string; country?: string; website?: string }) => {
    const response = await api.post('/v1/university-suggestions', data);
    return response.data;
};

export const useCreateNewUniversity = () => {
    const mutation = useMutation({
        mutationFn: createNewUniversity,
    });

    return mutation;
};
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createNewEmployer = async (data: { company_name: string; website?: string }) => {
    const response = await api.post('/v1/new-employers', data);
    return response.data;
};

export const useCreateNewEmployer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNewEmployer,
    });
};
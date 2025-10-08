import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDisabilityTypes = () => {
    const { data: disabilityTypesData } = useQuery({
        queryKey: ['disabilityTypes'],
        queryFn: async () => {
            const { data } = await api.get('/v1/disability-types');
            return data;
        },
    });

    return {
        disabilityTypesData
    }
}

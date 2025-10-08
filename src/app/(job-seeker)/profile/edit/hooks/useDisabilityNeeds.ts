import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDisabilityNeeds = () => {
    const { data: accessibilityNeedsData } = useQuery({
        queryKey: ['accessibilityNeeds'],
        queryFn: async () => {
            const { data } = await api.get('/v1/accessibility-needs');
            return data;
        },
    });

    return {
        accessibilityNeedsData
    }
}
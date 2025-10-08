import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UniversityOption } from '../components/UniversityCombobox';

export const useSearchUniversities = (query: string) => {
    return useQuery<UniversityOption[], Error>({
        queryKey: ['universities', query],
        queryFn: async () => {
            const { data } = await api.get(`/v1/universities/search?q=${query}`);
            return data;
        },
        enabled: query.length > 1,
    });
};

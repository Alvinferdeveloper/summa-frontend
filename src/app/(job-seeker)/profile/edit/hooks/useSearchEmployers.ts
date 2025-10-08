import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { EmployerOption } from "../components/EmployerCombobox";

export const useSearchEmployers = (query: string) => {
    return useQuery<EmployerOption[], Error>({
      queryKey: ['employers', query],
      queryFn: async () => {
        const { data } = await api.get(`/v1/employers/search?q=${query}`);
        return data;
      },
      enabled: query.length > 1,
    });
  };
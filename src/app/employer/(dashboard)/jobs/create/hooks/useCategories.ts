
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Category {
  id: number;
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/v1/categories');
  return data;
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
};

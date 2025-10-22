'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SkillOption {
  id: number;
  name: string;
}

const fetchSkills = async (): Promise<SkillOption[]> => {
  const { data } = await api.get<SkillOption[]>('/v1/skills'); 
  return data;
};

export const useSkills = () => {
  return useQuery<SkillOption[], Error>({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  });
};

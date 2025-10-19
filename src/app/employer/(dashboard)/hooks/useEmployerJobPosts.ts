
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface EmployerJobPostsResponse {
  id: number;
  created_at: string;
  title: string;
  location: string;
  status: string;
  work_model: string;
  contract_type: string;
  applicant_count: number; 
}

const fetchEmployerJobPosts = async (): Promise<EmployerJobPostsResponse[]> => {
  const { data } = await api.get('/v1/employer/jobs');
  return data;
};

export const useEmployerJobPosts = () => {
  return useQuery<EmployerJobPostsResponse[], Error>({
    queryKey: ['employerJobPosts'],
    queryFn: fetchEmployerJobPosts,
  });
};

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture_url: string;
  country: string;
  city: string;
  address: string;
  linked_in: string;
  banner_url: string;
  resume_url?: string;
  description?: string;
  detailed_accommodations?: string;
}

interface TalentPoolApiResponse {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
}

const fetchTalentPool = async (page: number, limit: number, filters: Record<string, string>): Promise<TalentPoolApiResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const { data } = await api.get<TalentPoolApiResponse>(`/v1/talent-pool/candidates?${params.toString()}`);
  return data;
};

export const useTalentPool = (page: number, limit: number, filters: Record<string, string>) => {
  return useQuery<TalentPoolApiResponse, Error>({
    queryKey: ['talentPool', page, filters],
    queryFn: () => fetchTalentPool(page, limit, filters),
  });
};

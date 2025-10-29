
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem';

export interface InterviewDetails {
  id: number;
  scheduled_at: string;
  format: string;
  notes?: string;
  candidate_response_status: string;
  requested_accommodations?: string;
  job_post_title: string; 
  employer_name: string;
}

export interface JobApplication {
  id: number;
  status: string;
  job_post: Job;
  created_at: string;
  interview?: InterviewDetails;
}

export interface ApplicationsApiResponse {
  data: JobApplication[];
  total: number;
  page: number;
  limit: number;
}

const fetchMyApplications = async (status: string, page: number, limit: number): Promise<ApplicationsApiResponse> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    limit: limit.toString(),
  });
  const { data } = await api.get<ApplicationsApiResponse>(`/v1/applications?${params.toString()}`);
  return data;
};

export const useMyApplications = (status: string, page: number, limit: number) => {
  return useQuery<ApplicationsApiResponse, Error>({
    queryKey: ['myApplications', status, page, limit],
    queryFn: () => fetchMyApplications(status, page, limit),
  });
};

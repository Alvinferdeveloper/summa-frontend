
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem'; // Reutilizamos la interfaz Job

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

const fetchMyApplications = async (): Promise<JobApplication[]> => {
  const { data } = await api.get('/v1/applications');
  return data;
};

export const useMyApplications = () => {
  return useQuery<JobApplication[], Error>({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications,
  });
};

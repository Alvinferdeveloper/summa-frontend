
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem';

interface ApplicantProfile {
  profile_id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
}

export interface EmployerJobApplication {
  id: number;
  created_at: string;
  status: string;
  cover_letter: string;
  resume_url_at_application: string;
  applicant: ApplicantProfile;
  job_post: Job;
}

const fetchJobApplicants = async (jobId: string): Promise<EmployerJobApplication[]> => {
  const { data } = await api.get(`/v1/jobs/${jobId}/applicants`);
  return data;
};

export const useJobApplicants = (jobId: string) => {
  return useQuery<EmployerJobApplication[], Error>({
    queryKey: ['jobApplicants', jobId],
    queryFn: () => fetchJobApplicants(jobId),
    enabled: !!jobId,
  });
};

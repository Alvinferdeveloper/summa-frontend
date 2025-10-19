
'use client';

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { JobApplication } from "../types"; 

interface ApplicantsApiResponse {
  data: JobApplication[];
  total: number;
  page: number;
  limit: number;
}

const fetchJobApplicants = async (jobId: string, page: number, limit: number): Promise<ApplicantsApiResponse> => {
  const { data } = await api.get<ApplicantsApiResponse>(
    `/v1/jobs/${jobId}/applicants?page=${page}&limit=${limit}`
  );
  return data;
};

export const useJobApplicants = (jobId: string, page: number = 1, limit: number = 10) => {
  return useQuery<ApplicantsApiResponse, Error>({
    queryKey: ["jobApplicants", jobId, page, limit],
    queryFn: () => fetchJobApplicants(jobId, page, limit),
    enabled: !!jobId, // Only run the query if a jobId is provided
  });
};

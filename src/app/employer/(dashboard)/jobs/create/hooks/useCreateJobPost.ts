
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { JobPostSchema } from '../page';

interface JobPostResponse {
  message: string;
  jobPost: any;
}

const createJobPost = async (data: JobPostSchema): Promise<JobPostResponse> => {
  const response = await api.post<JobPostResponse>('v1/jobs', data);
  return response.data;
};

export const useCreateJobPost = () => {
  return useMutation<JobPostResponse, Error, JobPostSchema>({
    mutationFn: createJobPost,
  });
};

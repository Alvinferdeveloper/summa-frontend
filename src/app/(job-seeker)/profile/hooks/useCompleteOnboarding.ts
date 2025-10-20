
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

interface OnboardingData {
  first_name: string;
  last_name: string;
  disability_type_ids: number[];
}

const completeOnboarding = async (data: OnboardingData) => {
  const response = await apiClient.put('/v1/profile', data);
  return response.data;
};

export const useCompleteOnboarding = () => {
   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    }
  });
};

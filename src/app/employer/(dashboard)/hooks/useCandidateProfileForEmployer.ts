
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProfileData } from '@/app/(job-seeker)/profile/hooks/useMyProfile'; // Reutilizamos la interfaz ProfileData

const fetchCandidateProfileForEmployer = async (profileId: string): Promise<ProfileData> => {
  const { data } = await api.get(`/v1/applicants/${profileId}/profile`);
  return data;
};

export const useCandidateProfileForEmployer = (profileId: string) => {
  return useQuery<ProfileData, Error>({
    queryKey: ['candidateProfile', profileId],
    queryFn: () => fetchCandidateProfileForEmployer(profileId),
    enabled: !!profileId, // Solo ejecutar la query si profileId está disponible
  });
};


import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface Employer {
  ID: number;
  company_name: string;
  logo_url: string;
}

export interface Experience {
  ID: number;
  job_title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  employer: Employer;
  new_employer: Employer;
}

export interface University {
  ID: number;
  name: string;
  address: string;
}

export interface Education {
  ID: number;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  university: University;
}

export interface Skill {
  ID: number;
  name: string;
}

interface DisabilityType {
  ID: number;
  name: string;
  description: string;
}

interface AccessibilityNeed {
  ID: number;
  name: string;
  category: string;
}

export interface ProfileData {
  ID: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  address?: string;
  linked_in?: string;
  resume_url?: string;
  description?: string;
  onboarding_completed: boolean;
  disability_info_consent: boolean;
  detailed_accommodations?: string;
  
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  disability_types: DisabilityType[];
  accessibility_needs: AccessibilityNeed[];
}

const fetchMyProfile = async (): Promise<ProfileData> => {
  const { data } = await api.get('/v1/profile/me');
  return data;
};

export const useMyProfile = () => {
  return useQuery<ProfileData, Error>({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

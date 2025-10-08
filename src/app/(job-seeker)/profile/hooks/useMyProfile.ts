
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// DTOs que coinciden con la respuesta del backend

interface UserSummary {
  email: string;
}

interface EmployerSummary {
  id: number;
  company_name: string;
  logo_url: string;
}

interface NewEmployerSummary {
  id: number;
  company_name: string;
}

export interface Experience {
  id: number;
  job_title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  employer: EmployerSummary | null;
  new_employer: NewEmployerSummary | null;
}

interface UniversitySummary {
  id: number;
  name: string;
}

interface UniversitySuggestionSummary {
  id: number;
  suggested_name: string;
}

export interface Education {
  id: number;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  university: UniversitySummary | null;
  university_suggestion: UniversitySuggestionSummary | null;
}

export interface Skill {
  id: number;
  name: string;
}

interface DisabilityType {
  id: number;
  name: string;
}

interface AccessibilityNeed {
  id: number;
  name: string;
}

export interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  phone_number?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  address?: string;
  linked_in?: string;
  resume_url?: string;
  description?: string;
  disability_info_consent: boolean;
  detailed_accommodations?: string;
  user: UserSummary;
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


'use client';

import { useQueries } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
  active_jobs: number;
  total_applicants: number;
  new_applicants_7d: number;
}

export interface PipelineStep {
  status: string;
  count: number;
}

export interface SkillInsight {
  name: string;
  count: number;
}

export interface DisabilityInsight {
  name: string;
  count: number;
}

export interface LocationInsight {
  location: string;
  count: number;
  latitude: number;
  longitude: number;
}


const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/v1/employer/dashboard/stats');
  return data;
};

const fetchPipeline = async (): Promise<PipelineStep[]> => {
  const { data } = await api.get('/v1/employer/dashboard/pipeline');
  return data;
};

const fetchSkillInsights = async (): Promise<SkillInsight[]> => {
  const { data } = await api.get('/v1/employer/dashboard/candidate-insights/skills');
  return data;
};

const fetchDisabilityInsights = async (): Promise<DisabilityInsight[]> => {
  const { data } = await api.get('/v1/employer/dashboard/candidate-insights/disabilities');
  return data;
};

const fetchApplicantLocations = async (): Promise<LocationInsight[]> => {
  const { data } = await api.get('/v1/employer/dashboard/candidate-insights/locations');
  return data;
};

export const useEmployerDashboard = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['dashboardStats'],
        queryFn: fetchDashboardStats,
      },
      {
        queryKey: ['dashboardPipeline'],
        queryFn: fetchPipeline,
      },
      {
        queryKey: ['dashboardSkillInsights'],
        queryFn: fetchSkillInsights,
      },
      {
        queryKey: ['dashboardDisabilityInsights'],
        queryFn: fetchDisabilityInsights,
      },
      {
        queryKey: ['dashboardApplicantLocations'],
        queryFn: fetchApplicantLocations,
      },
    ],
  });

  const isLoading = results.some(query => query.isLoading);
  const isError = results.some(query => query.isError);
  const error = results.find(query => query.error)?.error;

  return {
    stats: results[0].data as DashboardStats | undefined,
    pipeline: results[1].data as PipelineStep[] | undefined,
    skillInsights: results[2].data as SkillInsight[] | undefined,
    disabilityInsights: results[3].data as DisabilityInsight[] | undefined,
    applicantLocations: results[4].data as LocationInsight[] | undefined,
    isLoading,
    isError,
    error,
  };
};

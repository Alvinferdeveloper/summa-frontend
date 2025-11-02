
// src/lib/server-job-search.ts
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem'; // Asegúrate de que esta ruta sea correcta
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

interface SearchFilters {
  q?: string; // Palabras clave/rol
  is_urgent?: boolean;
  category_id?: number; // Esperamos ID numérico del tool
  work_schedule_id?: number;
  contract_type_id?: number;
  salary?: number;
  experience_level_id?: number;
  work_model_id?: number;
  disability_type_id?: number;
  page?: number;
  limit?: number; // Añadido para consistencia con el backend
}

interface JobsApiResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  next_page: boolean;
}

export async function searchJobsOnServer(filters: SearchFilters): Promise<JobsApiResponse> {
  const GO_BACKEND_URL = process.env.GO_BACKEND_URL || 'http://localhost:8080';
  const API_ENDPOINT = `${GO_BACKEND_URL}/api/v1/jobs`;
  const session = await getServerSession(authOptions)

  const params = new URLSearchParams();

  params.append('page', (filters.page || 1).toString());
  params.append('limit', (filters.limit || 10).toString());

  if (filters.is_urgent !== undefined) params.append('is_urgent', filters.is_urgent ? 'true' : 'false');
  if (filters.category_id) params.append('category_id', filters.category_id.toString());
  if (filters.work_schedule_id) params.append('work_schedule_id', filters.work_schedule_id.toString());
  if (filters.contract_type_id) params.append('contract_type_id', filters.contract_type_id.toString());
  if (filters.salary) params.append('salary', filters.salary.toString());
  if (filters.experience_level_id) params.append('experience_level_id', filters.experience_level_id.toString());
  if (filters.work_model_id) params.append('work_model_id', filters.work_model_id.toString());
  if (filters.disability_type_id) params.append('disability_type_id', filters.disability_type_id.toString());

  try {
    const response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en el backend de Go: ${response.status} - ${errorText}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching jobs from Go backend:", error);
    throw error;
  }
}

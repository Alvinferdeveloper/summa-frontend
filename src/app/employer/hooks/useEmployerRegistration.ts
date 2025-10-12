import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { EmployerRegisterSchema } from '../register/validation';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/lib/api';

interface EmployerRegistrationPayload {
  values: Omit<EmployerRegisterSchema, 'logo'>;
  logo: File | null;
}

interface EmployerRegistrationResponse {
  message: string;
}

const registerEmployer = async ({ values, logo }: EmployerRegistrationPayload): Promise<EmployerRegistrationResponse> => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (key === 'logo') return;
    if (value) {
      formData.append(key, value);
    }
  });
  if (logo) {
    formData.append("logo", logo);
  }
  const response = await api.post<EmployerRegistrationResponse>('/v1/employer/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useEmployerRegistration = () => {
  return useMutation<EmployerRegistrationResponse, AxiosError<ApiErrorResponse>, EmployerRegistrationPayload>({
    mutationFn: registerEmployer,
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.data.error) {
        error.message = error.response?.data.error;
        return;
      }
      error.message = "Error al registrar la empresa";
    },
  });
};

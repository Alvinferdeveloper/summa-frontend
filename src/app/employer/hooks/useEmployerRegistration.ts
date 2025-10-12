
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { EmployerRegisterSchema } from '../register/validation';

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
  return useMutation<EmployerRegistrationResponse, Error, EmployerRegistrationPayload>({
    mutationFn: registerEmployer,
  });
};

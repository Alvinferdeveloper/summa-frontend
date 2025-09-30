
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface EmployerRegistrationData {
  company_name: string;
  email: string;
  password: string;
}

interface EmployerRegistrationResponse {
  message: string;
}

const registerEmployer = async (data: EmployerRegistrationData): Promise<EmployerRegistrationResponse> => {
  const response = await api.post<EmployerRegistrationResponse>('api/v1/employer/register', data);
  return response.data;
};

export const useEmployerRegistration = () => {
  return useMutation<EmployerRegistrationResponse, Error, EmployerRegistrationData>({
    mutationFn: registerEmployer,
  });
};

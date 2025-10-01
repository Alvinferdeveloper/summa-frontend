
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import type { EmployerRegisterSchema } from '../register/validation';

interface EmployerRegistrationResponse {
  message: string;
}

const registerEmployer = async (data: EmployerRegisterSchema): Promise<EmployerRegistrationResponse> => {
  const response = await api.post<EmployerRegistrationResponse>('v1/employer/register', data);
  return response.data;
};

export const useEmployerRegistration = () => {
  return useMutation<EmployerRegistrationResponse, Error, EmployerRegisterSchema>({
    mutationFn: registerEmployer,
  });
};

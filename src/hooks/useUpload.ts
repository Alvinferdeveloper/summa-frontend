
'use client';

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

interface UploadPayload {
  file: File;
  endpoint: string;
  paramName: string; // El nombre del campo en el multipart/form-data (ej: "logo", "picture")
}

const uploadFile = async ({ file, endpoint, paramName }: UploadPayload) => {
  const formData = new FormData();
  formData.append(paramName, file);

  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const useUpload = () => {
  return useMutation<any, Error, UploadPayload>({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      toast.success("Archivo subido exitosamente", { description: data.message });
    },
    onError: (error: any) => {
      toast.error("Error al subir el archivo", { description: error.response?.data?.error || "No se pudo completar la subida." });
    },
  });
};

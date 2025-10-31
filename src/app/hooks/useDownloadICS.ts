
'use client';

import api from '@/lib/api';
import { toast } from 'sonner';

export const useDownloadICS = () => {
  const download = async (interviewId: number) => {
    try {
      const response = await api.get(`/v1/interviews/${interviewId}/download-ics`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'interview.ics');
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error: any) {
      toast.error("Error al descargar el archivo del calendario", {
        description: error.response?.data?.error || error.message,
      });
    }
  };

  return { download };
};

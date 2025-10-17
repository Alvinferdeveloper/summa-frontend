
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CVUploadProps {
  resumeUrl: string | null | undefined;
}

export default function CVUpload({ resumeUrl }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return api.post('/v1/profile/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast('Tu CV se ha subido correctamente.');
      setFile(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'No se pudo subir el CV.');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    const formData = new FormData();
    formData.append('cv', fileToUpload);
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        {resumeUrl ? (
          <div className="flex items-center gap-4">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Ver Currículum
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('cv-upload-input')?.click()}
              disabled={mutation.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              {mutation.isPending ? 'Actualizando...' : 'Actualizar CV'}
            </Button>
            <Button size="sm" variant="destructive" disabled>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => document.getElementById('cv-upload-input')?.click()}
            disabled={mutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            {mutation.isPending ? 'Subiendo...' : 'Subir CV'}
          </Button>
        )}
        <input
          id="cv-upload-input"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
        {mutation.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlusCircle, Edit, Trash2 } from "lucide-react";
import { ProfileData } from '../../hooks/useMyProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import EducationForm from './EducationForm';

interface EducationListProps {
  profile: ProfileData;
}

export default function EducationList({ profile }: EducationListProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/v1/profile/educations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Formación eliminada.");
    },
    onError: (error: any) => {
      toast.error("Error al eliminar la formación.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta formación?")) {
      deleteEducationMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Educación
        </CardTitle>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <EducationForm onSuccess={() => setIsAdding(false)} />
        )}
        {profile.educations && profile.educations.length > 0 ? (
          profile.educations.map((edu) => (
            <div key={edu.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.university?.name || edu.university_suggestion?.suggested_name|| 'Universidad no especificada'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => alert('Funcionalidad de editar pendiente.')}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(edu.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          !isAdding && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Aún no tienes formación académica registrada.</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

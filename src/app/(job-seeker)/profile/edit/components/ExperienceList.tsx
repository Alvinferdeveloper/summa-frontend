
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle, Edit, Trash2 } from "lucide-react";
import { ProfileData } from '../../hooks/useMyProfile';
import { useDeleteExperience } from '../hooks/useDeleteExperience';
import ExperienceForm from './ExperienceForm';
import { z } from 'zod';

export const experienceSchema = z.object({
  job_title: z.string().min(1, "El título del puesto es requerido."),
  description: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  employer_id: z.number().optional(),
  new_employer_id: z.number().optional(),
});
export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceListProps {
  profile: ProfileData;
}

export default function ExperienceList({ profile }: ExperienceListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { mutate: deleteExperience } = useDeleteExperience();

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      deleteExperience(id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experiencia Laboral
        </CardTitle>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <ExperienceForm onSuccess={() => setIsAdding(false)} />
        )}
        {profile.experiences && profile.experiences.length > 0 ? (
          profile.experiences.map((exp) => (
            <div key={exp.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-semibold">{exp.job_title}</h3>
                <p className="text-sm text-muted-foreground">{exp.employer?.company_name || exp.new_employer?.company_name || 'Empleador no especificado'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => alert('Funcionalidad de editar pendiente.')}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(exp.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          !isAdding && (
            <div className="text-center py-4 text-muted-foreground">
              <p>Aún no tienes experiencia laboral registrada.</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

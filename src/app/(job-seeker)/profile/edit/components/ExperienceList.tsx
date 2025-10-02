
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle, Edit, Trash2, Loader2, Save } from "lucide-react";
import { ProfileData } from '../../hooks/useMyProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

const experienceSchema = z.object({
  job_title: z.string().min(1, "El título del puesto es requerido."),
  description: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  employer_id: z.number().optional(),
  new_employer_id: z.number().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceListProps {
  profile: ProfileData;
}

export default function ExperienceList({ profile }: ExperienceListProps) {
  const queryClient = useQueryClient();
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      job_title: '',
      description: '',
      start_date: '',
      end_date: '',
      employer_id: undefined,
      new_employer_id: undefined,
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: async (data: ExperienceFormValues) => {
      console.log(data);
      await api.post('/v1/profile/experiences', {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Experiencia añadida.", { description: "Tu experiencia ha sido registrada." });
      form.reset();
      setEditingExperienceId(null);
    },
    onError: (error: any) => {
      toast.error("Error al añadir experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async (data: ExperienceFormValues) => {
      await api.put(`/v1/profile/experiences/${editingExperienceId}`, {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Experiencia actualizada.", { description: "Tu experiencia ha sido modificada." });
      form.reset();
      setEditingExperienceId(null);
    },
    onError: (error: any) => {
      toast.error("Error al actualizar experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/v1/profile/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Experiencia eliminada.", { description: "La experiencia ha sido eliminada." });
    },
    onError: (error: any) => {
      toast.error("Error al eliminar experiencia.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  const handleEdit = (exp: ProfileData['experiences'][0]) => {
    setEditingExperienceId(exp.ID);
    form.reset({
      job_title: exp.job_title,
      description: exp.description,
      start_date: exp.start_date.split('T')[0],
      end_date: exp.end_date ? exp.end_date.split('T')[0] : '',
      employer_id: exp.employer.ID || undefined,
      new_employer_id: exp.new_employer.ID || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      deleteExperienceMutation.mutate(id);
    }
  };

  function onSubmit(values: ExperienceFormValues) {
    if (editingExperienceId) {
      updateExperienceMutation.mutate(values);
    } else {
      createExperienceMutation.mutate(values);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experiencia Laboral
        </CardTitle>
        <Button onClick={() => setEditingExperienceId(0)} size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" /> Añadir
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.experiences && profile.experiences.length > 0 ? (
          profile.experiences.map((exp) => (
            <div key={exp.ID} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-semibold">{exp.job_title}</h3>
                <p className="text-sm text-muted-foreground">{exp.employer?.company_name || 'Empleador Sugerido'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(exp)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(exp.ID)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Por el momento no tienes experiencia laboral registrada.</p>
            <p>¡Añade tu primera experiencia!</p>
          </div>
        )}

        {(editingExperienceId !== null) && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">{editingExperienceId === 0 ? "Añadir Nueva Experiencia" : "Editar Experiencia"}</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del Puesto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Fin (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Aquí iría la lógica para seleccionar empleador existente o sugerir uno nuevo */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingExperienceId(null)}>Cancelar</Button>
                  <Button type="submit" disabled={createExperienceMutation.isPending || updateExperienceMutation.isPending}>
                    {(createExperienceMutation.isPending || updateExperienceMutation.isPending) ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Guardar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

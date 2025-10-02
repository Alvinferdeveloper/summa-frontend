
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlusCircle, Edit, Trash2, Loader2, Save } from "lucide-react";
import { ProfileData } from '../../hooks/useMyProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

const educationSchema = z.object({
  degree: z.string().min(1, "El título es requerido."),
  field_of_study: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  university_id: z.number().optional(), // Si se selecciona una universidad existente
  university_suggestion_id: z.number().optional(), // Si se selecciona una universidad sugerida
});

type EducationFormValues = z.infer<typeof educationSchema>;

interface EducationListProps {
  profile: ProfileData;
}

export default function EducationList({ profile }: EducationListProps) {
  const queryClient = useQueryClient();
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      university_id: undefined,
      university_suggestion_id: undefined,
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: async (data: EducationFormValues) => {
      await api.post('/v1/profile/educations', {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast("Educación añadida.");
      form.reset();
      setEditingEducationId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al añadir educación.");
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: async (data: EducationFormValues) => {
      await api.put(`/v1/profile/educations/${editingEducationId}`, {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast("Educación actualizada.");
      form.reset();
      setEditingEducationId(null);
    },
    onError: (error: any) => {
      toast(error.response?.data?.error || "Error al actualizar educación.");
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/v1/profile/educations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast("Educación eliminada.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Error al eliminar educación.");
    },
  });

  const handleEdit = (edu: ProfileData['educations'][0]) => {
    setEditingEducationId(edu.ID);
    form.reset({
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      start_date: edu.start_date.split('T')[0],
      end_date: edu.end_date ? edu.end_date.split('T')[0] : '',
      university_id: edu.university.ID || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta educación?")) {
      deleteEducationMutation.mutate(id);
    }
  };

  function onSubmit(values: EducationFormValues) {
    if (editingEducationId) {
      updateEducationMutation.mutate(values);
    } else {
      createEducationMutation.mutate(values);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Educación
        </CardTitle>
        <Button onClick={() => setEditingEducationId(0)} size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" /> Añadir
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.educations && profile.educations.length > 0 ? (
          profile.educations.map((edu) => (
            <div key={edu.ID} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">{edu.university?.name || 'Universidad Sugerida'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(edu)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(edu.ID)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Por el momento no tienes educación registrada.</p>
            <p>¡Añade tu formación académica!</p>
          </div>
        )}

        {(editingEducationId !== null) && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">{editingEducationId === 0 ? "Añadir Nueva Educación" : "Editar Educación"}</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título/Grado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="field_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campo de Estudio</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                {/* Aquí iría la lógica para seleccionar universidad existente o sugerir una nueva */}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingEducationId(null)}>Cancelar</Button>
                  <Button type="submit" disabled={createEducationMutation.isPending || updateEducationMutation.isPending}>
                    {(createEducationMutation.isPending || updateEducationMutation.isPending) ? (
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

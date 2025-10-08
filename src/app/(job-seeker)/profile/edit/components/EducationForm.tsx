
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

import { UniversityCombobox, UniversityOption } from './UniversityCombobox';
import AddNewUniversityModal from './AddNewUniversityModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Esquema actualizado para incluir un campo virtual para la universidad
const educationSchema = z.object({
  degree: z.string().min(3, "El título es requerido."),
  field_of_study: z.string().min(3, "El campo de estudio es requerido."),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  university: z
    .object({
      id: z.number(),
      name: z.string(),
      isNew: z.boolean().optional(),
    })
    .nullable(),
});
type EducationSchema = z.infer<typeof educationSchema>;

interface CreateEducationPayload {
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  university_id?: number;
  university_suggestion_id?: number;
}

const createEducation = async (data: CreateEducationPayload) => {
  console.log(data);
  const response = await api.post('/v1/profile/educations',{
    ...data,
    start_date: new Date(data.start_date).toISOString(),
    end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
  });
  return response.data;
};

interface EducationFormProps {
  onSuccess: () => void;
}

export default function EducationForm({ onSuccess }: EducationFormProps) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: { degree: '', field_of_study: '', start_date: '', end_date: '', university: null },
  });

  const mutation = useMutation({ 
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      onSuccess();
    }
  });

  const handleNewUniversitySuccess = (newUniversity: { id: number; name: string }) => {
    form.setValue('university', { ...newUniversity, isNew: true });
    form.clearErrors('university');
  };

  function onSubmit(values: EducationSchema) {
    if (!values.university) {
      form.setError("university", { type: "manual", message: "Por favor, selecciona o añade una universidad." });
      return;
    }

    const payload: CreateEducationPayload = {
      degree: values.degree,
      field_of_study: values.field_of_study,
      start_date: values.start_date,
      end_date: values.end_date,
    };

    if (values.university.isNew) {
      payload.university_suggestion_id = values.university.id;
    } else {
      payload.university_id = values.university.id;
    }
    mutation.mutate(payload);
  }

  return (
    <>
      <AddNewUniversityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleNewUniversitySuccess} 
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Añadir Formación Académica</h2>
          <FormField
            control={form.control}
            name="university"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Universidad</FormLabel>
                <UniversityCombobox 
                  selectedUniversity={field.value}
                  onSelect={(university) => {
                    field.onChange(university);
                    form.clearErrors('university');
                  }}
                  onAddNew={() => setIsModalOpen(true)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl><Input placeholder="Ej: Ingeniería de Software" {...field} /></FormControl>
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
                <FormControl><Input placeholder="Ej: Ciencias de la Computación" {...field} /></FormControl>
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
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Fin (o en blanco)</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onSuccess}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Guardar Formación'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

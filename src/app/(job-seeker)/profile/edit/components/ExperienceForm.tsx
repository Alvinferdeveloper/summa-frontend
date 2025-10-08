
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateExperience } from '../hooks/useCreateExperience';

import { EmployerCombobox, EmployerOption } from './EmployerCombobox';
import AddNewEmployerModal from './AddNewEmployerModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const experienceSchema = z.object({
  job_title: z.string().min(3, "El título del puesto es requerido."),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  description: z.string().optional(),
});
type ExperienceSchema = z.infer<typeof experienceSchema>;

interface CreateExperiencePayload {
  job_title: string;
  start_date: string;
  end_date?: string;
  description?: string;
  employer_id?: number;
  new_employer_id?: number;
}

interface ExperienceFormProps {
  onSuccess: () => void;
}

export default function ExperienceForm({ onSuccess }: ExperienceFormProps) {
  const [selectedEmployer, setSelectedEmployer] = useState<EmployerOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { job_title: '', start_date: '', end_date: '', description: '' },
  });

  const { mutate, isPending } = useCreateExperience();

  const handleNewEmployerSuccess = (newEmployer: { id: number; company_name: string }) => {
    setSelectedEmployer({ ...newEmployer, isNew: true });
  };

  function onSubmit(values: ExperienceSchema) {
    if (!selectedEmployer) {
      alert("Por favor, selecciona o añade una empresa.");
      return;
    }

    const payload: CreateExperiencePayload = { ...values };
    if (selectedEmployer.isNew) {
      payload.new_employer_id = selectedEmployer.id;
    }
    else {
      payload.employer_id = selectedEmployer.id;
    }
    mutate(payload, { onSuccess });
  }

  return (
    <>
      <AddNewEmployerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleNewEmployerSuccess}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Añadir Nueva Experiencia</h2>
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <EmployerCombobox
              selectedEmployer={selectedEmployer}
              onSelect={setSelectedEmployer}
              onAddNew={() => setIsModalOpen(true)}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Puesto</FormLabel>
                <FormControl><Input placeholder="Ej: Desarrollador Frontend" {...field} /></FormControl>
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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl><Textarea placeholder="Describe tus responsabilidades..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onSuccess}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Experiencia'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

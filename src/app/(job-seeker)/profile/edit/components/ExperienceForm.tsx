'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateExperience } from '../hooks/useCreateExperience';

import { EmployerCombobox, EmployerOption } from './EmployerCombobox';
import AddNewEmployerModal from './AddNewEmployerModal';
import AiRewriteModal from '@/app/(job-seeker)/cv-builder/components/AiRewriteModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles } from 'lucide-react';

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
  const [isNewEmployerModalOpen, setIsNewEmployerModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const form = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { job_title: '', start_date: '', end_date: '', description: '' },
  });

  const { mutate, isPending } = useCreateExperience();

  const handleNewEmployerSuccess = (newEmployer: { id: number; company_name: string }) => {
    setSelectedEmployer({ ...newEmployer, isNew: true });
  };

  const handleAiRewriteConfirm = (newText: string) => {
    form.setValue('description', newText);
    setIsAiModalOpen(false);
  };

  function onSubmit(values: ExperienceSchema) {
    if (!selectedEmployer) {
      alert("Por favor, selecciona o añade una empresa.");
      return;
    }

    const payload: CreateExperiencePayload = { ...values };
    if (selectedEmployer.isNew) {
      payload.new_employer_id = selectedEmployer.id;
    } else {
      payload.employer_id = selectedEmployer.id;
    }
    mutate(payload, { onSuccess });
  }

  return (
    <>
      <AddNewEmployerModal
        isOpen={isNewEmployerModalOpen}
        onClose={() => setIsNewEmployerModalOpen(false)}
        onSuccess={handleNewEmployerSuccess}
      />
      <AiRewriteModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onConfirm={handleAiRewriteConfirm}
        title="Reescribir Descripción de Experiencia"
        description="Describe de forma sencilla tus tareas y logros en este puesto, y la IA los convertirá en una descripción profesional."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-sm">
          <h2 className="text-xl font-semibold">Añadir Nueva Experiencia</h2>
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <EmployerCombobox
              selectedEmployer={selectedEmployer}
              onSelect={setSelectedEmployer}
              onAddNew={() => setIsNewEmployerModalOpen(true)}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="job_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título del Puesto</FormLabel>
                <FormControl><Input placeholder="Ej: Desarrollador Frontend" {...field} className="border-primary" /></FormControl>
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
                  <FormControl><Input type="date" {...field} className="border-primary" /></FormControl>
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
                  <FormControl><Input type="date" {...field} className="border-primary" /></FormControl>
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
                <div className="flex justify-between items-center">
                  <FormLabel>Descripción</FormLabel>
                  <Button type="button" size="sm" onClick={() => setIsAiModalOpen(true)} className='bg-accent hover:bg-accent/80 cursor-pointer'>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Ayúdame a escribir
                  </Button>
                </div>
                <FormControl><Textarea rows={4} placeholder="Describe tus responsabilidades y logros..." {...field} className="border-primary" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" className='bg-accent hover:bg-accent/80 cursor-pointer' onClick={onSuccess}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Experiencia'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
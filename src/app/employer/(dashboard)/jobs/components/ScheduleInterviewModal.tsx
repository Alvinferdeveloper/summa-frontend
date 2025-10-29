
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useScheduleInterview } from '@/app/hooks/useInterviewMutations';
import { Loader2 } from 'lucide-react';

const scheduleInterviewSchema = z.object({
  scheduled_at_date: z.string().min(1, "La fecha es requerida."),
  scheduled_at_time: z.string().min(1, "La hora es requerida."),
  format: z.enum(["Virtual", "Presencial", "Telefónica"], { message: "El formato es requerido." }),
  notes: z.string().optional(),
});

type ScheduleInterviewFormValues = z.infer<typeof scheduleInterviewSchema>;

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobApplicationId: number;
  applicantName: string;
  jobTitle: string;
}

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  jobApplicationId,
  applicantName,
  jobTitle,
}: ScheduleInterviewModalProps) {
  const { mutate, isPending } = useScheduleInterview();

  const form = useForm<ScheduleInterviewFormValues>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      scheduled_at_date: '',
      scheduled_at_time: '',
      format: undefined,
      notes: '',
    },
  });

  function onSubmit(values: ScheduleInterviewFormValues) {
    const scheduledAt = new Date(`${values.scheduled_at_date}T${values.scheduled_at_time}:00`);
    mutate({
      job_application_id: jobApplicationId,
      scheduled_at: scheduledAt.toISOString(),
      format: values.format,
      notes: values.notes,
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Entrevista con {applicantName}</DialogTitle>
          <DialogDescription>
            Estás agendando una entrevista para el puesto de {jobTitle}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduled_at_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduled_at_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el formato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Telefónica">Telefónica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Añade cualquier nota relevante..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Agendar Entrevista
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

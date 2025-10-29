
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRespondToInterview } from '@/app/hooks/useInterviewMutations';
import { Loader2 } from 'lucide-react';
import { InterviewDetails } from '../hooks/useMyApplications';

const respondToInterviewSchema = z.object({
  status: z.enum(["Aceptada", "Rechazada"], { message: "Debes seleccionar una respuesta." }),
  requested_accommodations: z.string().optional(),
});

type RespondToInterviewFormValues = z.infer<typeof respondToInterviewSchema>;

interface RespondToInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: InterviewDetails | null;
}

export default function RespondToInterviewModal({
  isOpen,
  onClose,
  interview,
}: RespondToInterviewModalProps) {
  const { mutate, isPending } = useRespondToInterview();

  const form = useForm<RespondToInterviewFormValues>({
    resolver: zodResolver(respondToInterviewSchema),
    defaultValues: {
      status: undefined,
      requested_accommodations: '',
    },
  });

  function onSubmit(values: RespondToInterviewFormValues) {
    if (!interview) return;
    mutate({
      interviewId: interview.id,
      status: values.status,
      requested_accommodations: values.requested_accommodations,
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (!interview) return null;

  const formattedDate = new Date(interview.scheduled_at).toLocaleString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Responder a Entrevista</DialogTitle>
          <DialogDescription>
            Has sido invitado a una entrevista para el puesto de <strong>{interview.job_post_title}</strong> en <strong>{interview.employer_name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p><strong>Fecha y Hora:</strong> {formattedDate}</p>
          <p><strong>Formato:</strong> {interview.format}</p>
          {interview.notes && <p><strong>Notas del Empleador:</strong> {interview.notes}</p>}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu Respuesta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu respuesta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Aceptada">Aceptar Entrevista</SelectItem>
                        <SelectItem value="Rechazada">Rechazar Entrevista</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requested_accommodations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adaptaciones Solicitadas (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Ej: Necesito un intérprete de lengua de señas, o 15 minutos extra..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Enviar Respuesta
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

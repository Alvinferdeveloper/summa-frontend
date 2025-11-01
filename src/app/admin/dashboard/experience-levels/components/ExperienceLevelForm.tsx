
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import { ExperienceLevel } from '../hooks/useExperienceLevels';

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
});

type FormValues = z.infer<typeof formSchema>;

interface ExperienceLevelFormProps {
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
  defaultValues?: Partial<ExperienceLevel>;
}

export default function ExperienceLevelForm({ onSubmit, isPending, defaultValues }: ExperienceLevelFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Senior" {...field} className='border-primary' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full cursor-pointer">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Guardar
        </Button>
      </form>
    </Form>
  );
}

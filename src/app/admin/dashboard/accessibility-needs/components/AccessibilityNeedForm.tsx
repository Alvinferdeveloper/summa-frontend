
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from 'lucide-react';
import { AccessibilityNeed } from '../hooks/useAccessibilityNeeds';

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  category: z.string().min(1, "La categoría es requerida."),
});

type FormValues = z.infer<typeof formSchema>;

interface AccessibilityNeedFormProps {
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
  defaultValues?: Partial<AccessibilityNeed>;
}

export default function AccessibilityNeedForm({ onSubmit, isPending, defaultValues }: AccessibilityNeedFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      category: defaultValues?.category || '',
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
                <Input placeholder="Ej: Rampas de acceso" {...field} className='border-primary' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Entorno Físico" {...field} className='border-primary' />
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

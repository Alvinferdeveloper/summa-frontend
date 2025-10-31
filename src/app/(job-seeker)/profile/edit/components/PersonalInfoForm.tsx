
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useUpdatePersonalInfo } from '../hooks/useUpdatePersonalInfo';
import { Loader2, Save } from 'lucide-react';

const personalInfoSchema = z.object({
  first_name: z.string().min(1, "El nombre es requerido."),
  last_name: z.string().min(1, "El apellido es requerido."),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  profile: ProfileData;
  onSave?: () => void; // Prop opcional para el callback
}

export default function PersonalInfoForm({ profile, onSave }: PersonalInfoFormProps) {
  const updatePersonalInfoMutation = useUpdatePersonalInfo();
  const form = useForm<z.input<typeof personalInfoSchema>, z.output<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
    },
  });


  function onSubmit(values: PersonalInfoFormValues) {
    updatePersonalInfoMutation.mutate(values, {
      onSuccess: () => {
        if (onSave) {
          onSave();
        }
      }
    });
  }

  return (
    <Card className='rounded-sm'>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} className='border-primary' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu apellido" {...field} className='border-primary' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='cursor-pointer' disabled={updatePersonalInfoMutation.isPending}>
              {updatePersonalInfoMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

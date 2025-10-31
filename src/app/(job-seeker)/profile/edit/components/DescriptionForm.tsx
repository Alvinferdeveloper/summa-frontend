
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useUpdateDescription } from '../hooks/useUpdateDescription';
import { Loader2, Save } from 'lucide-react';

const descriptionSchema = z.object({
  description: z.string().optional(),
});

export type DescriptionFormValues = z.infer<typeof descriptionSchema>;

interface DescriptionFormProps {
  profile: ProfileData;
  onSave?: () => void;
}

export default function DescriptionForm({ profile, onSave }: DescriptionFormProps) {
  const updateDescriptionMutation = useUpdateDescription();
  
  const form = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: profile.description || '',
    },
  });

  function onSubmit(values: DescriptionFormValues) {
    updateDescriptionMutation.mutate(values, {
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
        <CardTitle>Sobre Mí</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Personal</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Cuéntanos sobre ti, tus aspiraciones y lo que te hace único..." {...field} className='border-primary' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='cursor-pointer' disabled={updateDescriptionMutation.isPending}>
              {updateDescriptionMutation.isPending ? (
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

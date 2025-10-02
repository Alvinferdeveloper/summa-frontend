
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const descriptionSchema = z.object({
  description: z.string().optional(),
});

type DescriptionFormValues = z.infer<typeof descriptionSchema>;

interface DescriptionFormProps {
  profile: ProfileData;
}

export default function DescriptionForm({ profile }: DescriptionFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: profile.description || '',
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async (data: DescriptionFormValues) => {
      await api.put('/v1/profile/description', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Descripción actualizada.", { description: "Tus cambios han sido guardados." });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar la descripción.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  function onSubmit(values: DescriptionFormValues) {
    updateDescriptionMutation.mutate(values);
  }

  return (
    <Card>
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
                    <Textarea rows={5} placeholder="Cuéntanos sobre ti, tus aspiraciones y lo que te hace único..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateDescriptionMutation.isPending}>
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

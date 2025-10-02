
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const contactInfoSchema = z.object({
  phone_number: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  linked_in: z.string().url("Debe ser una URL válida").or(z.literal('')).optional(),
  resume_url: z.string().url("Debe ser una URL válida").or(z.literal('')).optional(),
  profile_picture: z.string().url("Debe ser una URL válida").or(z.literal('')).optional(),
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoFormProps {
  profile: ProfileData;
}

export default function ContactInfoForm({ profile }: ContactInfoFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      phone_number: profile.phone_number || '',
      city: profile.city || '',
      country: profile.country || '',
      address: profile.address || '',
      linked_in: profile.linked_in || '',
      resume_url: profile.resume_url || '',
      profile_picture: profile.profile_picture || '',
    },
  });

  const updateContactInfoMutation = useMutation({
    mutationFn: async (data: ContactInfoFormValues) => {
      await api.put('/v1/profile/contact-info', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Información de contacto actualizada.", { description: "Tus cambios han sido guardados." });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar la información de contacto.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  function onSubmit(values: ContactInfoFormValues) {
    updateContactInfoMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Contacto</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: +505 8888-8888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Managua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Nicaragua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 123 Calle Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linked_in"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil de LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/tuperfil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resume_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Currículum</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tuweb.com/curriculum.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Foto de Perfil</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/tu_foto.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateContactInfoMutation.isPending}>
              {updateContactInfoMutation.isPending ? (
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

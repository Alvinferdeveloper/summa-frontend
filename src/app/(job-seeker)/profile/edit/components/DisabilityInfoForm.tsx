
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const disabilityInfoSchema = z.object({
  disability_info_consent: z.boolean(),
  detailed_accommodations: z.string().optional(),
  disability_type_ids: z.array(z.number()).optional(),
  accessibility_need_ids: z.array(z.number()).optional(),
});

type DisabilityInfoFormValues = z.infer<typeof disabilityInfoSchema>;

interface DisabilityInfoFormProps {
  profile: ProfileData;
}

export default function DisabilityInfoForm({ profile }: DisabilityInfoFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.input<typeof disabilityInfoSchema>, z.output<typeof disabilityInfoSchema>>({
    resolver: zodResolver(disabilityInfoSchema),
    defaultValues: {
      disability_info_consent: profile.disability_info_consent,
      detailed_accommodations: profile.detailed_accommodations || '',
      disability_type_ids: profile.disability_types?.map(dt => dt.ID) || [],
      accessibility_need_ids: profile.accessibility_needs?.map(an => an.ID) || [],
    },
  });

  const { data: disabilityTypesData } = useQuery({
    queryKey: ['disabilityTypes'],
    queryFn: async () => {
      const { data } = await api.get('/v1/disability-types');
      return data;
    },
  });

  const { data: accessibilityNeedsData } = useQuery({
    queryKey: ['accessibilityNeeds'],
    queryFn: async () => {
      const { data } = await api.get('/v1/accessibility-needs');
      return data;
    },
  });

  const updateDisabilityInfoMutation = useMutation({
    mutationFn: async (data: DisabilityInfoFormValues) => {
      await api.put('/v1/profile/disability-info', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success("Información de discapacidad actualizada.", { description: "Tus cambios han sido guardados." });
    },
    onError: (error: any) => {
      toast.error("Error al actualizar la información de discapacidad.", { description: error.response?.data?.error || "Ha ocurrido un error." });
    },
  });

  function onSubmit(values: DisabilityInfoFormValues) {
    updateDisabilityInfoMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Discapacidad y Accesibilidad</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="disability_info_consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Consentimiento para compartir información de discapacidad</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Al marcar esta casilla, aceptas que tu información de discapacidad sea visible para los empleadores.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailed_accommodations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adaptaciones Detalladas</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Describe cualquier adaptación específica que necesites..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Disability Types */}
            <h3 className="text-lg font-semibold mt-6">Tipos de Discapacidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disabilityTypesData?.map((dt: any) => (
                <FormField
                  key={dt.ID}
                  control={form.control}
                  name="disability_type_ids"
                  render={({ field }) => {
                    return (
                      <FormItem key={dt.ID} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(dt.ID)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), dt.ID])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== dt.ID
                                  )
                                );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {dt.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />

            {/* Accessibility Needs */}
            <h3 className="text-lg font-semibold mt-6">Necesidades de Accesibilidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accessibilityNeedsData?.map((an: any) => (
                <FormField
                  key={an.ID}
                  control={form.control}
                  name="accessibility_need_ids"
                  render={({ field }) => {
                    return (
                      <FormItem key={an.ID} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(an.ID)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), an.ID])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== an.ID
                                  )
                                );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {an.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />

            <Button type="submit" disabled={updateDisabilityInfoMutation.isPending}>
              {updateDisabilityInfoMutation.isPending ? (
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

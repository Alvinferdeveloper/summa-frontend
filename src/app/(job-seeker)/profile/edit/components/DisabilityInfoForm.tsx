
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useDisabilityNeeds } from '../hooks/useDisabilityNeeds';
import { useDisabilityTypes } from '../hooks/useDisabilityTypes';
import { useUpdateDisabilityInfo } from '../hooks/useUpdateDisabilityInfo';

const disabilityInfoSchema = z.object({
  disability_info_consent: z.boolean(),
  detailed_accommodations: z.string().optional(),
  disability_type_ids: z.array(z.number()).optional(),
  accessibility_need_ids: z.array(z.number()).optional(),
});

export type DisabilityInfoFormValues = z.infer<typeof disabilityInfoSchema>;

interface DisabilityInfoFormProps {
  profile: ProfileData;
  onSave?: () => void;
}

export default function DisabilityInfoForm({ profile, onSave }: DisabilityInfoFormProps) {
  const { accessibilityNeedsData } = useDisabilityNeeds();
  const { disabilityTypesData } = useDisabilityTypes();
  const updateDisabilityInfoMutation = useUpdateDisabilityInfo();

  const form = useForm<z.input<typeof disabilityInfoSchema>, z.output<typeof disabilityInfoSchema>>({
    resolver: zodResolver(disabilityInfoSchema),
    defaultValues: {
      disability_info_consent: profile.disability_info_consent,
      detailed_accommodations: profile.detailed_accommodations || '',
      disability_type_ids: profile.disability_types?.map(dt => dt.id) || [],
      accessibility_need_ids: profile.accessibility_needs?.map(an => an.id) || [],
    },
  });


  function onSubmit(values: DisabilityInfoFormValues) {
    updateDisabilityInfoMutation.mutate(values, {
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
                      className='border-primary'
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
                    <Textarea 
                    rows={3} 
                    placeholder="Describe cualquier adaptación específica que necesites..." {...field}
                    className='border-primary'
                    />
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
                  key={dt.id}
                  control={form.control}
                  name="disability_type_ids"
                  render={({ field }) => {
                    return (
                      <FormItem key={dt.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(dt.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), dt.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== dt.id
                                  )
                                );
                            }}
                            className='border-primary'
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
                  key={an.id}
                  control={form.control}
                  name="accessibility_need_ids"
                  render={({ field }) => {
                    return (
                      <FormItem key={an.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(an.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), an.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== an.id
                                  )
                                );
                            }}
                            className='border-primary'
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

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProfileData } from '../../hooks/useMyProfile';
import { useUpdateDescription } from '../hooks/useUpdateDescription';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { useCvAssistant } from '@/app/(job-seeker)/cv-builder/hooks/useCvAssistant';
import { useEffect, useState } from 'react';

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
  const { result, setResult, runAssistant, isLoading: isAssistantLoading } = useCvAssistant();
  const [informalText, setInformalText] = useState('');

  const form = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: profile.description || '',
    },
  });

  useEffect(() => {
    if (result && !isAssistantLoading) {
      form.setValue('description', result);
      setResult('');
    }
  }, [result, isAssistantLoading, form, setResult]);

  const handleGenerateWithAI = () => {
    const { id, ...relevantProfileData } = profile;
    runAssistant({
      task: 'generate-summary',
      context: {
        profileData: relevantProfileData,
        informalText: informalText,
      },
    });
  };

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
        <div className="space-y-4 mb-6 p-4 border bg-muted/40 rounded-lg">
          <label>¿Necesitas inspiración?</label>
          <CardDescription>Escribe algunas ideas sobre ti en el campo de abajo y deja que nuestra IA cree un resumen profesional para ti.</CardDescription>
          <Textarea
            placeholder="Ej: Soy bueno con las computadoras, me gusta resolver problemas y aprender cosas nuevas. Busco un lugar donde pueda crecer."
            className='border-primary'
            value={informalText}
            onChange={(e) => setInformalText(e.target.value)}
            rows={3}
          />
          <Button type="button" onClick={handleGenerateWithAI} disabled={isAssistantLoading || !informalText} className='cursor-pointer'>
            {isAssistantLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generar con IA
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu Resumen Profesional</FormLabel>
                  <FormControl>
                    <Textarea rows={7} placeholder="Un resumen profesional y atractivo sobre ti..." {...field} className='border-primary' />
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
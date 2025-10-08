
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, PlusCircle, Loader2, Save } from "lucide-react";
import { ProfileData } from '../../hooks/useMyProfile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUpdateSkills } from '../hooks/useUpdateSkills';

const skillsSchema = z.object({
  skill_names: z.array(z.string().min(1, "El nombre de la habilidad no puede estar vacío.")).min(1, "Debes añadir al menos una habilidad."),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;

interface SkillsListProps {
  profile: ProfileData;
}

export default function SkillsList({ profile }: SkillsListProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateSkillsMutation = useUpdateSkills();

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skill_names: profile.skills?.map(s => s.name) || [],
    },
  });


  function onSubmit(values: SkillsFormValues) {
    updateSkillsMutation.mutate(values, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Habilidades
        </CardTitle>
        <Button onClick={() => setIsEditing(true)} size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" /> Editar
        </Button>
      </CardHeader>
      <CardContent>
        {(!profile.skills || profile.skills.length === 0) ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Por el momento no tienes habilidades registradas.</p>
            <p>¡Añade tus habilidades para que los empleadores te encuentren!</p>
            <Button onClick={() => setIsEditing(true)} variant="link" className="mt-2"><PlusCircle className="h-4 w-4 mr-2" /> Añadir Habilidades</Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
            ))}
          </div>
        )}

        {isEditing && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Editar Habilidades</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="skill_names"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombres de Habilidades (separadas por coma)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value?.join(', ')}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(s => s !== ''))}
                          placeholder="Ej: Go, React, PostgreSQL"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  <Button type="submit" disabled={updateSkillsMutation.isPending}>
                    {updateSkillsMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Guardar
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

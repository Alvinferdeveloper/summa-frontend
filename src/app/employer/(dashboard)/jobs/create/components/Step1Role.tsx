'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { JobPostSchema } from '../page';
import { useCategories } from '../hooks/useCategories';
import { useContractTypes } from '@/app/(job-seeker)/jobs/hooks/useContractTypes';
import { useExperienceLevels } from '@/app/(job-seeker)/jobs/hooks/useExperienceLevels';
import { useWorkSchedules } from '../hooks/useWorkSchedules';
import { useWorkModels } from '../hooks/useWorkModels';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface Step1RoleProps {
  nextStep: () => void;
}

export default function Step1Role({ nextStep }: Step1RoleProps) {
  const form = useFormContext<JobPostSchema>();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: contractTypes, isLoading: isLoadingContractTypes } = useContractTypes();
  const { data: experienceLevels, isLoading: isLoadingExperienceLevels } = useExperienceLevels();
  const { data: workSchedules, isLoading: isLoadingWorkSchedules } = useWorkSchedules();
  const { data: workModels, isLoading: isLoadingWorkModels } = useWorkModels();

  const LocationPickerMap = useMemo(() => dynamic(() => import('./LocationPickerMap'), { ssr: false }), []);

  const handleNext = async () => {
    const isValid = await form.trigger([
      "title",
      "location",
      "workModelId",
      "contractTypeId",
      "workScheduleId",
      "experienceLevelId",
      "category_id"
    ]);
    if (isValid) {
      nextStep();
    }
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Información Básica del Puesto</h2>
        <p className="text-muted-foreground">Comencemos con los detalles fundamentales de la oferta de empleo.</p>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Puesto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ingeniero de Software Frontend" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación (Texto)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ciudad de México, Remoto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Selecciona la Ubicación en el Mapa</FormLabel>
          <p className="text-sm text-muted-foreground mb-2">Haz clic en el mapa para establecer la ubicación exacta.</p>
          <LocationPickerMap 
            position={form.watch('latitude') && form.watch('longitude') ? [form.watch('latitude')!, form.watch('longitude')!] : null}
            onLocationSelect={(lat, lng) => {
              form.setValue('latitude', lat);
              form.setValue('longitude', lng);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="workModelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo de Trabajo</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingWorkModels ? "Cargando..." : "Selecciona un modelo"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workModels?.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workScheduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jornada Laboral</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingWorkSchedules ? "Cargando..." : "Selecciona una jornada"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workSchedules?.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id.toString()}>{schedule.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Contrato</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingContractTypes ? "Cargando..." : "Selecciona un tipo de contrato"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contractTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Experiencia</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingExperienceLevels ? "Cargando..." : "Selecciona un nivel de experiencia"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels?.map((level) => (
                      <SelectItem key={level.id} value={level.id.toString()}>{level.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCategories ? "Cargando..." : "Selecciona una categoría"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salario (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: $1000 - $1500 USD, A convenir" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_urgent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    ¿Es una vacante urgente?
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Marcar esto destacará tu oferta de empleo.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end mt-8">
          <Button onClick={handleNext}>Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
}
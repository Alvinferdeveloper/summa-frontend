
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

interface Step1RoleProps {
  nextStep: () => void;
}

export default function Step1Role({ nextStep }: Step1RoleProps) {
  const form = useFormContext<JobPostSchema>();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  console.log(categories, "categories")

  const handleNext = async () => {
    const isValid = await form.trigger(["title", "location", "workModel", "contractType", "workSchedule", "experienceLevel", "category_id"]);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Ciudad de México, Remoto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo de Trabajo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un modelo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Presencial">Presencial</SelectItem>
                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                    <SelectItem value="Remoto">Remoto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workSchedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jornada Laboral</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una jornada" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tiempo completo">Tiempo completo</SelectItem>
                    <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
                    <SelectItem value="Beca/Practicas">Beca/Prácticas</SelectItem>
                    <SelectItem value="Por horas">Por horas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contractType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Contrato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de contrato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Indefinido">Indefinido</SelectItem>
                    <SelectItem value="Determinado">Determinado</SelectItem>
                    <SelectItem value="Obra o labor">Obra o labor</SelectItem>
                    <SelectItem value="Aprendizaje">Aprendizaje</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel de Experiencia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel de experiencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sin experiencia">Sin experiencia</SelectItem>
                    <SelectItem value="1 año">1 año</SelectItem>
                    <SelectItem value="2 años">2 años</SelectItem>
                    <SelectItem value="3-4 años">3-4 años</SelectItem>
                    <SelectItem value="5-10 años">5-10 años</SelectItem>
                    <SelectItem value="Más de 10 años">Más de 10 años</SelectItem>
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

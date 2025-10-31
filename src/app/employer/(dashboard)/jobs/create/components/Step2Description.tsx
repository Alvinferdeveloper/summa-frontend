
'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { JobPostSchema } from '../page';

interface Step2DescriptionProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2Description({ nextStep, prevStep }: Step2DescriptionProps) {
  const form = useFormContext<JobPostSchema>();

  const handleNext = async () => {
    const isValid = await form.trigger(["description", "responsibilities", "requirements"]);
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
        <h2 className="text-2xl font-bold">Descripción del Puesto</h2>
        <p className="text-muted-foreground">Detalla las responsabilidades, requisitos y qué hace especial a este puesto.</p>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción General</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Describe el propósito general del puesto, el equipo y la cultura de la empresa." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsabilidades Clave</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Enumera las tareas y responsabilidades diarias del puesto." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requisitos y Habilidades</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Especifica las habilidades, experiencia y cualificaciones necesarias." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} className='bg-accent hover:bg-accent/80 cursor-pointer'>Anterior</Button>
          <Button onClick={handleNext} className='cursor-pointer'>Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
}

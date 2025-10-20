'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { JobPostSchema } from '../page';
import { useAccessibilityNeeds } from '../hooks/useAccessibilityNeeds';
import { useDisabilityTypes } from '../hooks/useDisabilityTypes';
import CheckboxGroup from '@/app/employer/register/components/CheckboxGroup';

interface Step3AccessibilityProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Accessibility({ nextStep, prevStep }: Step3AccessibilityProps) {
  const form = useFormContext<JobPostSchema>();
  const { data: accessibilityNeeds = [], isLoading: isLoadingAccessibilityNeeds } = useAccessibilityNeeds();
  const { data: disabilityTypes = [], isLoading: isLoadingDisabilityTypes } = useDisabilityTypes();

  const handleNext = async () => {
    const isValid = await form.trigger(["accessibilityNeedIds", "disabilityTypeIds"]);
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
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Características de Accesibilidad</h2>
          <p className="text-muted-foreground">Selecciona las adaptaciones y características de accesibilidad que ofreces para este puesto.</p>

          {isLoadingAccessibilityNeeds ? (
            <p className="mt-4">Cargando opciones de accesibilidad...</p>
          ) : (
            <div className="mt-4">
              <CheckboxGroup
                control={form.control}
                name="accessibilityNeedIds"
                options={accessibilityNeeds}
                label="Adaptaciones Disponibles"
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mt-8">Tipos de Discapacidad Relevantes</h2>
          <p className="text-muted-foreground">Selecciona los tipos de discapacidad para los que esta oferta podría ser especialmente adecuada.</p>

          {isLoadingDisabilityTypes ? (
            <p className="mt-4">Cargando tipos de discapacidad...</p>
          ) : (
            <div className="mt-4">
              <CheckboxGroup
                control={form.control}
                name="disabilityTypeIds"
                options={disabilityTypes}
                label="Tipos de Discapacidad"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline" type="button">Anterior</Button>
          <Button onClick={handleNext} type="button">Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
}

import { useFormContext } from 'react-hook-form';
import { useAccessibilityNeeds } from '../hooks/useAccessibilityNeeds';
import CheckboxGroup from '@/app/employer/register/components/CheckboxGroup';
import { JobPostSchema } from '../page';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Step3AccessibilityProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Accessibility({ nextStep, prevStep }: Step3AccessibilityProps) {
  const form = useFormContext<JobPostSchema>();
  const { data: accessibilityNeeds = [], isLoading: isLoadingAccessibilityNeeds } = useAccessibilityNeeds();

  const handleNext = async () => {
    const isValid = await form.trigger(["accessibilityNeedIds"]);
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
        <h2 className="text-2xl font-bold">Características de Accesibilidad</h2>
        <p className="text-muted-foreground">Selecciona las adaptaciones y características de accesibilidad que ofreces para este puesto.</p>

        {isLoadingAccessibilityNeeds ? (
          <p>Cargando opciones de accesibilidad...</p>
        ) : (
          <CheckboxGroup
            control={form.control}
            name="accessibilityNeedIds"
            options={accessibilityNeeds.map(an => ({ id: an.id.toString(), name: an.name }))}
            label="Adaptaciones Disponibles"
          />
        )}

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline" type="button">Anterior</Button>
          <Button onClick={handleNext} type="button">Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
}

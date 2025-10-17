
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { JobPostSchema } from '../page';

const accessibilityOptions = [
  { id: "ramps", label: "Rampas de acceso" },
  { id: "screen_reader", label: "Software lector de pantalla" },
  { id: "flexible_hours", label: "Horarios flexibles" },
  { id: "sign_language", label: "Intérprete de lengua de señas" },
  { id: "accessible_restrooms", label: "Baños accesibles" },
];

interface Step3AccessibilityProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step3Accessibility({ nextStep, prevStep }: Step3AccessibilityProps) {
  const form = useFormContext<JobPostSchema>();
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

        <FormField
          control={form.control}
          name="accessibilityFeatures"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Adaptaciones Disponibles</FormLabel>
              </div>
              <div className="space-y-3">
                {accessibilityOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="accessibilityFeatures"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                            className='border-primary'
                              checked={field.value?.includes(item.label)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item.label])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.label
                                    )
                                  );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline">Anterior</Button>
          <Button onClick={nextStep}>Siguiente</Button>
        </div>
      </div>
    </motion.div>
  );
}


'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPostSchema } from '../page';
import { useCategories } from '../hooks/useCategories';

interface Step4ReviewProps {
  prevStep: () => void;
  isPending: boolean;
}

export default function Step4Review({ prevStep, isPending }: Step4ReviewProps) {
  const { getValues } = useFormContext<JobPostSchema>();
  const values = getValues();
  const { data: categories } = useCategories();
  const categoryName = categories?.find(c => c.id === values.category_id)?.name;

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Revisar y Publicar</h2>
        <p className="text-muted-foreground">Asegúrate de que todo esté correcto antes de publicar la oferta de empleo.</p>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{values.title}</CardTitle>
              {values.is_urgent && <Badge variant="destructive">Urgente</Badge>}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="default">{values.location}</Badge>
              <Badge variant="default">{values.workModel}</Badge>
              <Badge variant="default">{values.workSchedule}</Badge>
              <Badge variant="default">{values.contractType}</Badge>
              <Badge variant="default">{values.experienceLevel}</Badge>
              {categoryName && <Badge variant="default">{categoryName}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {values.salary && (
              <div>
                <h3 className="font-semibold mb-2">Salario</h3>
                <p className="text-sm text-muted-foreground">{values.salary}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground">{values.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Responsabilidades</h3>
              <p className="text-sm text-muted-foreground">{values.responsibilities}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Requisitos</h3>
              <p className="text-sm text-muted-foreground">{values.requirements}</p>
            </div>
            {values.accessibilityFeatures && values.accessibilityFeatures.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Características de Accesibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {values.accessibilityFeatures.map(feature => (
                    <Badge key={feature} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} variant="outline" type="button">Anterior</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Publicando..." : "Publicar Empleo"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

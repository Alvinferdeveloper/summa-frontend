'use client';

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobPostSchema } from '../page';
import { useCategories } from '../hooks/useCategories';
import { useContractTypes } from '@/app/(job-seeker)/jobs/hooks/useContractTypes';
import { useExperienceLevels } from '@/app/(job-seeker)/jobs/hooks/useExperienceLevels';
import { useWorkSchedules } from '../hooks/useWorkSchedules';
import { useWorkModels } from '../hooks/useWorkModels';
import { useAccessibilityNeeds } from '../hooks/useAccessibilityNeeds';
import { useDisabilityTypes } from '../hooks/useDisabilityTypes';

interface Step4ReviewProps {
  prevStep: () => void;
  isPending: boolean;
}

export default function Step4Review({ prevStep, isPending }: Step4ReviewProps) {
  const { getValues } = useFormContext<JobPostSchema>();
  const values = getValues();

  const { data: categories } = useCategories();
  const { data: contractTypes } = useContractTypes();
  const { data: experienceLevels } = useExperienceLevels();
  const { data: workSchedules } = useWorkSchedules();
  const { data: workModels } = useWorkModels();
  const { data: accessibilityNeeds } = useAccessibilityNeeds();
  const { data: disabilityTypes } = useDisabilityTypes();

  const categoryName = categories?.find(c => c.id === values.category_id)?.name;
  const contractTypeName = contractTypes?.find(c => c.id === values.contractTypeId)?.name;
  const experienceLevelName = experienceLevels?.find(e => e.id === values.experienceLevelId)?.name;
  const workScheduleName = workSchedules?.find(w => w.id === values.workScheduleId)?.name;
  const workModelName = workModels?.find(w => w.id === values.workModelId)?.name;

  const selectedAccessibilityNeeds = values.accessibilityNeedIds?.map(id =>
    accessibilityNeeds?.find(an => an.id === id)?.name
  ).filter(Boolean);

  const selectedDisabilityTypes = values.disabilityTypeIds?.map(id =>
    disabilityTypes?.find(dt => dt.id === id)?.name
  ).filter(Boolean);

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
              {workModelName && <Badge variant="default">{workModelName}</Badge>}
              {workScheduleName && <Badge variant="default">{workScheduleName}</Badge>}
              {contractTypeName && <Badge variant="default">{contractTypeName}</Badge>}
              {experienceLevelName && <Badge variant="default">{experienceLevelName}</Badge>}
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
            {selectedAccessibilityNeeds && selectedAccessibilityNeeds.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Características de Accesibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAccessibilityNeeds.map(feature => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium border-chart-5/30 bg-chart-5/5 text-foreground hover:bg-chart-5/10 transition-colors"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedDisabilityTypes && selectedDisabilityTypes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tipos de Discapacidad Relevantes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDisabilityTypes.map(type => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium border-chart-2/30 bg-chart-2/5 text-foreground hover:bg-chart-2/10 transition-colors"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button onClick={prevStep} className='bg-accent hover:bg-accent/80 cursor-pointer' type="button">Anterior</Button>
          <Button type="submit" disabled={isPending} className='cursor-pointer'>
            {isPending ? "Publicando..." : "Publicar Empleo"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
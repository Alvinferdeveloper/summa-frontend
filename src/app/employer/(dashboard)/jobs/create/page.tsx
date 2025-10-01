
'use client';

import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Step1Role from './components/Step1Role';
import Step2Description from './components/Step2Description';
import Step3Accessibility from './components/Step3Accessibility';
import Step4Review from './components/Step4Review';
import { useCreateJobPost } from './hooks/useCreateJobPost';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const jobPostSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  location: z.string().min(3, "La ubicación es requerida."),
  workModel: z.string().min(1, "El modelo de trabajo es requerido."),
  contractType: z.string().min(1, "El tipo de contrato es requerido."),
  description: z.string().min(50, "La descripción debe tener al menos 50 caracteres."),
  responsibilities: z.string().min(50, "Las responsabilidades deben tener al menos 50 caracteres."),
  requirements: z.string().min(50, "Los requisitos deben tener al menos 50 caracteres."),
  accessibilityFeatures: z.array(z.string()).optional(),
});

export type JobPostSchema = z.infer<typeof jobPostSchema>;

const steps = [
  { id: 1, name: 'El Rol' },
  { id: 2, name: 'Descripción' },
  { id: 3, name: 'Accesibilidad' },
  { id: 4, name: 'Revisar y Publicar' },
];

export default function CreateJobPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { mutate, isPending, isSuccess, error } = useCreateJobPost();

  const form = useForm<JobPostSchema>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      location: '',
      workModel: '',
      contractType: '',
      description: '',
      responsibilities: '',
      requirements: '',
      accessibilityFeatures: [],
    },
  });

  const nextStep = () => setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  function onSubmit(data: JobPostSchema) {
    mutate(data);
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-green-600">¡Empleo Publicado!</h2>
        <p className="text-muted-foreground mt-2">Tu oferta de empleo ha sido publicada exitosamente.</p>
        <Link href="/employer/dashboard" className="mt-6 inline-block">
          <Button>Volver al Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Stepper */}
      <div className="mb-8">
        <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
          {steps.map((step, index) => (
            <li key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep > step.id ? 'bg-green-500 text-white' : currentStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-600'}`}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className={`ml-2 hidden sm:block ${currentStep >= step.id ? 'font-semibold' : ''}`}>{step.name}</span>
              {index < steps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-2"></div>}
            </li>
          ))}
        </ol>
      </div>

      {/* Form Content */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && <Step1Role nextStep={nextStep} />}
              {currentStep === 2 && <Step2Description nextStep={nextStep} prevStep={prevStep} />}
              {currentStep === 3 && <Step3Accessibility nextStep={nextStep} prevStep={prevStep} />}
              {currentStep === 4 && <Step4Review prevStep={prevStep} isPending={isPending} />}
            </AnimatePresence>
            {error && <p className="text-red-500 text-sm mt-4">Error al publicar el empleo: {error.message}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
}

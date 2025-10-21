import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Step1Role from '../../create/components/Step1Role';
import Step2Description from '../../create/components/Step2Description';
import Step3Accessibility from '../../create/components/Step3Accessibility';
import Step4Review from '../../create/components/Step4Review';
import { useUpdateJobPost } from '../../hooks/useUpdateJobPost';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';
import z from 'zod';

const jobPostSchema = z.object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
    location: z.string().min(3, "La ubicación es requerida."),
    is_urgent: z.boolean().default(false),
    workModelId: z.number({ message: "Debes seleccionar un modelo de trabajo." }),
    workScheduleId: z.number({ message: "Debes seleccionar una jornada." }),
    contractTypeId: z.number({ message: "Debes seleccionar un tipo de contrato." }),
    experienceLevelId: z.number({ message: "Debes seleccionar un nivel de experiencia." }),
    salary: z.string().optional(),
    category_id: z.number({ message: "La categoría es requerida." }),
    description: z.string().min(50, "La descripción debe tener al menos 50 caracteres."),
    responsibilities: z.string().min(50, "Las responsabilidades deben tener al menos 50 caracteres."),
    requirements: z.string().min(50, "Los requisitos deben tener al menos 50 caracteres."),
    accessibilityNeedIds: z.array(z.number()).optional(),
    disabilityTypeIds: z.array(z.number()).optional(),
});

export type JobPostSchema = z.input<typeof jobPostSchema>;

const steps = [
    { id: 1, name: 'El Rol' },
    { id: 2, name: 'Descripción' },
    { id: 3, name: 'Accesibilidad' },
    { id: 4, name: 'Revisar y Publicar' },
];


export default function EditJobForm({ jobPost }: { jobPost: any }) {
    const [currentStep, setCurrentStep] = useState(1);
    const { mutate, isPending, isSuccess, error } = useUpdateJobPost(jobPost.id.toString());

    const form = useForm<JobPostSchema>({
        resolver: zodResolver(jobPostSchema),
        defaultValues: {
            title: jobPost.title || '',
            location: jobPost.location || '',
            is_urgent: jobPost.is_urgent || false,
            workModelId: jobPost.work_model?.id,
            workScheduleId: jobPost.work_schedule?.id,
            contractTypeId: jobPost.contract_type?.id,
            experienceLevelId: jobPost.experience_level?.id,
            salary: jobPost.salary || '',
            category_id: jobPost.category?.id,
            description: jobPost.description || '',
            responsibilities: jobPost.responsibilities || '',
            requirements: jobPost.requirements || '',
            accessibilityNeedIds: jobPost.accessibility_needs?.map((an: any) => an.id) || [],
            disabilityTypeIds: jobPost.disability_types?.map((dt: any) => dt.id) || [],
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
                <h2 className="text-2xl font-bold text-green-600">¡Empleo Actualizado!</h2>
                <p className="text-muted-foreground mt-2">Tu oferta de empleo ha sido actualizada exitosamente.</p>
                <Link href="/employer/dashboard/jobs" className="mt-6 inline-block">
                    <Button>Volver a Mis Ofertas</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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

            <div className="bg-white p-8 rounded-sm shadow-lg border border-gray-200">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && <Step1Role nextStep={nextStep} />}
                            {currentStep === 2 && <Step2Description nextStep={nextStep} prevStep={prevStep} />}
                            {currentStep === 3 && <Step3Accessibility nextStep={nextStep} prevStep={prevStep} />}
                            {currentStep === 4 && <Step4Review prevStep={prevStep} isPending={isPending} />}
                        </AnimatePresence>
                        {error && <p className="text-red-500 text-sm mt-4">Error al actualizar el empleo: {error.message}</p>}
                    </form>
                </Form>
            </div>
        </div>
    );
}

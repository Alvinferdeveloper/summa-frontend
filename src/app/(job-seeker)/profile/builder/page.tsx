
'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMyProfile } from '../hooks/useMyProfile';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PersonalInfoForm from '../edit/components/PersonalInfoForm';
import ExperienceList from '../edit/components/ExperienceList';
import EducationList from '../edit/components/EducationList';
import SkillsList from '../edit/components/SkillsList';
import DisabilityInfoForm from '../edit/components/DisabilityInfoForm';
import CVPreview from './components/CVPreview';

const steps = [
  { id: 1, name: 'Información Personal' },
  { id: 2, name: 'Experiencia' },
  { id: 3, name: 'Educación' },
  { id: 4, name: 'Habilidades' },
  { id: 5, name: 'Accesibilidad' },
  { id: 6, name: 'Revisar y Generar CV' },
];

export default function ProfileBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: profile, status } = useMyProfile();

  const nextStep = () => setCurrentStep((prev) => (prev < steps.length ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  if (status === 'pending' || !profile) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
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

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <AnimatePresence mode="wait">
          {currentStep === 1 && <PersonalInfoForm profile={profile} onSave={nextStep} />}
          {currentStep === 2 && <ExperienceList profile={profile} />}
          {currentStep === 3 && <EducationList profile={profile} />}
          {currentStep === 4 && <SkillsList profile={profile} />}
          {currentStep === 5 && <DisabilityInfoForm profile={profile} onSave={nextStep} />}
          {currentStep === 6 && <CVPreview profile={profile} prevStep={prevStep} />}
        </AnimatePresence>

        {/* Navigation (Only for sections that do not have their own save/next button) */}
        {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
          <div className="flex justify-between mt-8">
            <Button onClick={prevStep} variant="outline">Anterior</Button>
            <Button onClick={nextStep}>Siguiente</Button>
          </div>
        )}
      </div>
    </div>
  );
}

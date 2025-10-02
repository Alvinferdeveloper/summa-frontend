
'use client';

import PersonalInfoForm from './components/PersonalInfoForm';
import ContactInfoForm from './components/ContactInfoForm';
import DescriptionForm from './components/DescriptionForm';
import DisabilityInfoForm from './components/DisabilityInfoForm';
import ExperienceList from './components/ExperienceList';
import EducationList from './components/EducationList';
import SkillsList from './components/SkillsList';
import { useMyProfile } from '../hooks/useMyProfile';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfileEditPage() {
  const { data: profile, status, error } = useMyProfile();
  const [activeTab, setActiveTab] = useState("personal-info");

  if (status === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'error') {
    return <div className="text-center text-red-500">Error al cargar el perfil: {error?.message}</div>;
  }

  if (!profile) {
    return <div className="text-center text-muted-foreground">No se encontró el perfil.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Editar Perfil</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="personal-info">Personal</TabsTrigger>
          <TabsTrigger value="contact-info">Contacto</TabsTrigger>
          <TabsTrigger value="description">Sobre Mí</TabsTrigger>
          <TabsTrigger value="disability-info">Discapacidad</TabsTrigger>
          <TabsTrigger value="experiences">Experiencia</TabsTrigger>
          <TabsTrigger value="education">Educación</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info">
          <PersonalInfoForm profile={profile} />
        </TabsContent>
        <TabsContent value="contact-info">
          <ContactInfoForm profile={profile} />
        </TabsContent>
        <TabsContent value="description">
          <DescriptionForm profile={profile} />
        </TabsContent>
        <TabsContent value="disability-info">
          <DisabilityInfoForm profile={profile} />
        </TabsContent>
        <TabsContent value="experiences">
          <ExperienceList profile={profile} />
        </TabsContent>
        <TabsContent value="education">
          <EducationList profile={profile} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsList profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
import { Loader2, User, Mail, BookOpen, Briefcase, Award, Users, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export default function ProfileEditPage() {
  const { data: profile, status, error } = useMyProfile();
  const [activeTab, setActiveTab] = useState("personal-info");
  const session = useSession()

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
    <div className="min-h-screen bg-background">
      {/* Header con gradiente */}
      <div className="relative w-3/4 mx-auto bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50 border-b rounded-2xl shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar y info principal */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={session.data?.user?.image || '/placeholder.svg'} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-semibold">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">
                  {profile.first_name || 'Nombre'} {profile.last_name || 'Apellido'}
                </h1>
                <Badge variant="default" className="font-medium">
                  Perfil Activo
                </Badge>
              </div>
              <p className="text-secondary text-lg">
                Profesional en búsqueda de oportunidades
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {session.data?.user?.email || 'email@ejemplo.com'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Editar Información del Perfil</h2>
          <p className="text-muted-foreground">
            Mantén tu información actualizada para que los empleadores puedan conocerte mejor
          </p>
        </div>

        <Card className="shadow-medium rounded-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-2 bg-primary/80 p-1 ">
                <TabsTrigger value="personal-info" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer">
                  <User className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="contact-info" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id='contact'>
                  <Mail className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Contacto</span>
                </TabsTrigger>
                <TabsTrigger value="description" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id='about'>
                  <BookOpen className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sobre Mí</span>
                </TabsTrigger>
                <TabsTrigger value="disability-info" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id="disability-types">
                  <Users className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Discapacidad</span>
                </TabsTrigger>
                <TabsTrigger value="experiences" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id="experience">
                  <Briefcase className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Experiencia</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id="education">
                  <Award className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Educación</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-background data-[state=active]:shadow-sm cursor-pointer" id="skills">
                  <CheckCircle2 className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Habilidades</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal-info" className="mt-0">
                  <PersonalInfoForm profile={profile} />
                </TabsContent>
                <TabsContent value="contact-info" className="mt-0">
                  <ContactInfoForm profile={profile} />
                </TabsContent>
                <TabsContent value="description" className="mt-0">
                  <DescriptionForm profile={profile} />
                </TabsContent>
                <TabsContent value="disability-info" className="mt-0">
                  <DisabilityInfoForm profile={profile} />
                </TabsContent>
                <TabsContent value="experiences" className="mt-0">
                  <ExperienceList profile={profile} />
                </TabsContent>
                <TabsContent value="education" className="mt-0">
                  <EducationList profile={profile} />
                </TabsContent>
                <TabsContent value="skills" className="mt-0">
                  <SkillsList profile={profile} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
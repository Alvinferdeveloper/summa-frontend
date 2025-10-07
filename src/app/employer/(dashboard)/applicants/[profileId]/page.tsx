
'use client';

import { useCandidateProfileForEmployer } from '../hooks/useCandidateProfileForEmployer';
import { Loader2, UserCircle2, Phone, MapPin, Globe, Linkedin, FileText, Accessibility, Heart, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: { profileId: string };
}

export default function CandidateProfileForEmployerPage({ params }: PageProps) {
  const { profileId } = params;
  const { data: profile, isLoading, error } = useCandidateProfileForEmployer(profileId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-center text-destructive font-medium">Error al cargar el perfil del candidato: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12 text-muted-foreground">Perfil no encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="h-48 sm:h-60 flex justify-center rounded-md rounded-tr-lg border-b border-border">
          {/* Placeholder for cover image */}
          <div className="w-full sm:w-5/6 h-full object-cover rounded-tr-lg rounded-tl-lg bg-gray-200 flex items-center justify-center text-muted-foreground">Imagen de Portada</div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-background border-4 border-background shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-card flex items-center justify-center ring-4 ring-background border-4 border-background shadow-xl">
                  <UserCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-base text-muted-foreground">{profile.email}</p>
              </div>

              <Link href="/employer/dashboard">
                <Button variant="outline" className="font-medium border-2 hover:bg-accent/5 hover:border-primary bg-transparent">
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        {/* Contact Info Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.phone_number || profile.address || profile.city || profile.linked_in || profile.resume_url ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile.phone_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.phone_number}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.address}</span>
                  </div>
                )}
                {profile.city && profile.country && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                )}
                {profile.linked_in && (
                  <div className="flex items-center gap-3 text-sm">
                    <Linkedin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={profile.linked_in}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Ver LinkedIn
                    </a>
                  </div>
                )}
                {profile.resume_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Ver Currículum
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no ha proporcionado información de contacto adicional.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Me Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Sobre el Candidato</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.description ? (
              <p className="text-foreground leading-relaxed text-pretty">{profile.description}</p>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no ha escrito una descripción sobre sí mismo.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disability Types Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Accessibility className="h-5 w-5 text-primary" />
              Tipos de Discapacidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.disability_types && profile.disability_types.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.disability_types.map((dt) => (
                  <Badge key={dt.ID} variant="secondary" className="px-3 py-1 text-sm font-normal">{dt.name}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no ha especificado sus tipos de discapacidad.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accessibility Needs Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Necesidades de Accesibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.accessibility_needs && profile.accessibility_needs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.accessibility_needs.map((an) => (
                  <Badge key={an.ID} variant="secondary" className="px-3 py-1 text-sm font-normal">{an.name}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no ha especificado sus necesidades de accesibilidad.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Experience Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Briefcase className="h-5 w-5" />
              Experiencia Laboral
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.experiences && profile.experiences.length > 0 ? (
              <div className="space-y-4">
                {profile.experiences.map((exp) => (
                  <div key={exp.ID} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{exp.job_title}</h4>
                      <p className="text-sm text-muted-foreground">{exp.employer?.company_name || exp.new_employer?.company_name || 'Empleador no especificado'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Actual'}</p>
                      {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no tiene experiencia laboral registrada.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <GraduationCap className="h-5 w-5" />
              Educación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.educations && profile.educations.length > 0 ? (
              <div className="space-y-4">
                {profile.educations.map((edu) => (
                  <div key={edu.ID} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{edu.degree} en {edu.field_of_study}</h4>
                      <p className="text-sm text-muted-foreground">{edu.university?.name || edu.university_suggestion?.suggested_name || 'Universidad no especificada'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Actual'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no tiene formación académica registrada.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Sparkles className="h-5 w-5" />
              Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.ID} variant="secondary" className="px-3 py-1 text-sm font-normal">{skill.name}</Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <p>El candidato no tiene habilidades registradas.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

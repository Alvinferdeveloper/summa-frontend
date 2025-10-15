
"use client"
import { useCandidateProfileForEmployer } from '../hooks/useCandidateProfileForEmployer';
import {
  Loader2,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  FileText,
  Accessibility,
  Heart,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import { useParams } from 'next/navigation';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CandidateProfileForEmployerPage() {
  const params = useParams();
  const { profileId } = params as { profileId: string };
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
          <img
            src={profile.banner_url || "/banner_placeholder.png"}
            alt="Profile Banner"
            className="w-full sm:w-5/6 h-full object-cover rounded-tr-lg rounded-tl-lg" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <img
                src={profile.profile_picture_url || "/profile_placeholder.png"}
                alt="Profile"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-background border-4 border-background shadow-xl"
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
                  {profile.first_name} {profile.last_name}
                </h1>
                {/*<p className="text-base text-muted-foreground">{profile.user.email}</p>*/}
              </div>

              <Link href="/employer/jobs">
                <Button variant="outline" className="font-medium border-2 hover:bg-accent/5 hover:border-primary bg-transparent">
                  Volver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.phone_number || profile?.address || profile?.city || profile?.linked_in || profile?.resume_url ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {profile?.phone_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.phone_number}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.address}</span>
                  </div>
                )}
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                )}
                {profile?.linked_in && (
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
                {profile?.resume_url && (
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
              <p className="text-center py-4 text-muted-foreground">Sin información de contacto.</p>
            )}
          </CardContent>
        </Card>

        {/* About Me Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Sobre Mí</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.description ? (
              <p className="text-foreground leading-relaxed text-pretty">{profile.description}</p>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Sin descripción.</p>
            )}
          </CardContent>
        </Card>

        {/* Disability Types Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Accessibility className="h-5 w-5 text-primary" />
              Tipos de Discapacidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.disability_types && profile.disability_types.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.disability_types.map((dt) => (
                  <Badge key={dt.id} variant="default" className="px-3 py-1 text-sm font-normal">{dt.name}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Sin tipos de discapacidad.</p>
            )}
          </CardContent>
        </Card>

        {/* Accessibility Needs Section */}
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Necesidades de Accesibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.accessibility_needs && profile.accessibility_needs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.accessibility_needs.map((an) => (
                  <Badge key={an.id} variant="default" className="px-3 py-1 text-sm font-normal">{an.name}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Sin necesidades de accesibilidad.</p>
            )}
          </CardContent>
        </Card>
        <ExperienceSection experiences={profile.experiences} />
        <EducationSection educations={profile.educations} />
        <SkillsSection skills={profile.skills} />
      </div>
    </div>
  );
}

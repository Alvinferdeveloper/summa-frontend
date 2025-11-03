'use client';

import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import SkillsSection from "./components/SkillsSection";
import { useSession } from "next-auth/react";
import { useMyProfile } from "./hooks/useMyProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CVUpload from "./components/CVUpload";
import Link from "next/link";
import {
  Loader2,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  FileText,
  Accessibility,
  Heart,
  PlusCircle,
  Mail,
} from "lucide-react";
import OnboardingForm from "./components/OnboardingForm";
import { Badge } from "@/components/ui/badge";
import ImageEdit from './components/ImageEdit';

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession();
  const { data: profile, status: profileStatus, error } = useMyProfile();

  if (sessionStatus === "loading" || profileStatus === "pending") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (session && !session.onboardingCompleted) {
    return <OnboardingForm />;
  }

  if (profileStatus === "error") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-center text-destructive font-medium">Error al cargar el perfil: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        <ImageEdit
          imageUrl={profile?.banner_url || '/banner_placeholder.png'}
          endpoint="/v1/profile/banner"
          paramName="banner"
          queryToInvalidate="myProfile"
          title="Banner del Perfil"
          className="w-full"
        >
          <div className="h-60 md:h-80 relative flex justify-center border-b border-border">
            <img
              src={profile?.banner_url || "/banner_placeholder.png"}
              alt="Profile Banner"
              className="w-full h-full object-cover rounded-2xl shadow-md" />
          </div>
        </ImageEdit>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <ImageEdit
                imageUrl={profile?.profile_picture_url || session?.user?.image || '/profile_placeholder.png'}
                endpoint="/v1/profile/picture"
                paramName="picture"
                queryToInvalidate="myProfile"
                title="Foto de Perfil"
              >
                <img
                  src={profile?.profile_picture_url || session?.user?.image || '/profile_placeholder.png'}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-background border-4 border-background shadow-xl"
                />
              </ImageEdit>

              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-base text-muted-foreground">{session?.user?.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/profile/edit" className="sm:pb-2">
                  <Button
                    className="font-medium hover:bg-accent/80 bg-accent cursor-pointer w-full sm:w-auto"
                  >
                    Editar Perfil
                  </Button>
                </Link>
                <Link href="/profile/builder" className="sm:pb-2">
                  <Button
                    className="font-medium hover:bg-accent/80 bg-accent cursor-pointer w-full sm:w-auto"
                  >
                    Construir CV
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-8">
        <section aria-labelledby="contact-info-heading">
          <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
            <CardHeader>
              <h2 id="contact-info-heading" className="text-xl font-semibold text-foreground">Información de Contacto</h2>
            </CardHeader>
            <CardContent>
              <CVUpload resumeUrl={profile?.resume_url} />
              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                {profile?.phone_number && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.phone_number}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{profile.email}</span>
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
              </div>
              <Link href="/profile/edit#contact" aria-label="Añadir Información de Contacto" className="inline-flex mx-auto items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4">
                <PlusCircle className="h-4 w-4" />
                Añadir Información de Contacto
              </Link>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="about-me-heading">
          <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
            <CardHeader>
              <h2 id="about-me-heading" className="text-xl font-semibold text-foreground">Sobre Mí</h2>
            </CardHeader>
            <CardContent>
              {profile?.description ? (
                <p className="text-foreground leading-relaxed text-pretty">{profile.description}</p>
              ) : (
                <p className="text-center py-4 text-muted-foreground">Aún no has escrito una descripción sobre ti.</p>
              )}
              <Link href="/profile/edit#about" aria-label="Añadir Descripción" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4">
                <PlusCircle className="h-4 w-4" />
                Añadir Descripción
              </Link>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="disability-types-heading">
          <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
            <CardHeader>
              <h2 id="disability-types-heading" className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <Accessibility className="h-5 w-5 text-primary" />
                Tipos de Discapacidad
              </h2>
            </CardHeader>
            <CardContent>
              {profile?.disability_types && profile.disability_types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.disability_types.map((dt) => (
                    <Badge key={dt.id} variant="default" className="px-3 py-1 text-sm font-normal">{dt.name}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No has especificado tus tipos de discapacidad.</p>
              )}
              <Link href="/profile/edit#disability-types" aria-label="Añadir Tipos de Discapacidad" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4">
                <PlusCircle className="h-4 w-4" />
                Añadir Tipos de Discapacidad
              </Link>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="accessibility-needs-heading">
          <Card className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-sm">
            <CardHeader>
              <h2 id="accessibility-needs-heading" className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <Heart className="h-5 w-5 text-primary" />
                Necesidades de Accesibilidad
              </h2>
            </CardHeader>
            <CardContent>
              {profile?.accessibility_needs && profile.accessibility_needs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.accessibility_needs.map((an) => (
                    <Badge key={an.id} variant="default" className="px-3 py-1 text-sm font-normal">{an.name}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No has especificado tus necesidades de accesibilidad.</p>
              )}
              <Link href="/profile/edit#disability-types" aria-label="Añadir Necesidades de Accesibilidad" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-4">
                <PlusCircle className="h-4 w-4" />
                Añadir Necesidades
              </Link>
            </CardContent>
          </Card>
        </section>

        <ExperienceSection experiences={profile?.experiences} />
        <EducationSection educations={profile?.educations} />
        <SkillsSection skills={profile?.skills} />
      </div>
    </div>
  );
}
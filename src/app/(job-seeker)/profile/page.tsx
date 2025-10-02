"use client"
import ExperienceSection from "./components/ExperienceSection"
import EducationSection from "./components/EducationSection"
import SkillsSection from "./components/SkillsSection"
import { useSession } from "next-auth/react"
import { useMyProfile } from "./hooks/useMyProfile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Loader2,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  FileText,
  Accessibility,
  Heart,
  UserCircle2,
  PlusCircle,
} from "lucide-react"
import OnboardingForm from "./components/OnboardingForm"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession()
  const { data: profile, status: profileStatus, error } = useMyProfile();
 
  if (sessionStatus === "loading" || profileStatus === "pending") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (session && !session.onboardingCompleted) {
    return <OnboardingForm />
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
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="h-48 sm:h-60 flex justify-center rounded-md rounded-tr-lg border-b border-border">
          <img
            src="https://media.licdn.com/dms/image/v2/D5616AQFdem9Vr7zxyQ/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1732840373751?e=1762387200&v=beta&t=QAJr3O7gKxFVEk5k9ZyofGKFtkTApG20T-do9qc2sFI" width={350} height={1400} alt="Profile"
            className="w-full sm:w-5/6 h-full object-cover rounded-tr-lg rounded-tl-lg" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {profile?.profile_picture || session?.user?.image ? (
                <img
                  src={profile?.profile_picture || session?.user?.image || "/placeholder.svg"}
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
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-base text-muted-foreground">{session?.user?.email}</p>
              </div>

              <Link href="/profile/edit" className="sm:pb-2">
                <Button
                  variant="outline"
                  className="font-medium border-2 hover:bg-accent/5 hover:border-primary bg-transparent"
                >
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-4">
        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
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
              <div className="text-center py-8">
                <Phone className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm mb-3">
                  No tienes información de contacto adicional registrada.
                </p>
                <Link href="/profile/edit#contact">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Información
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Sobre Mí</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.description ? (
              <p className="text-foreground leading-relaxed text-pretty">{profile.description}</p>
            ) : (
              <div className="text-center py-8">
                <UserCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm mb-3">Aún no has escrito una descripción sobre ti.</p>
                <Link href="/profile/edit#about">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Descripción
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Accessibility className="h-5 w-5 text-primary" />
              Tipos de Discapacidad
            </CardTitle>
            <Link href="/profile/edit#disability-types">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {profile?.disability_types && profile.disability_types.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.disability_types.map((dt) => (
                  <Badge
                    key={dt.ID}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-normal bg-secondary text-secondary-foreground border border-border"
                  >
                    {dt.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Accessibility className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm mb-1">No has especificado tus tipos de discapacidad.</p>
                <p className="text-xs text-muted-foreground/70 mb-3">
                  Esta información es opcional y nos ayuda a mejorar el matching.
                </p>
                <Link href="/profile/edit#disability-types">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Necesidades de Accesibilidad
            </CardTitle>
            <Link href="/profile/edit#accessibility-needs">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {profile?.accessibility_needs && profile.accessibility_needs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.accessibility_needs.map((an) => (
                  <Badge
                    key={an.ID}
                    variant="secondary"
                    className="px-3 py-1 text-sm font-normal bg-secondary text-secondary-foreground border border-border"
                  >
                    {an.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground text-sm mb-1">
                  No has especificado tus necesidades de accesibilidad.
                </p>
                <p className="text-xs text-muted-foreground/70 mb-3">
                  ¡Ayúdanos a encontrar empleos que se adapten a ti!
                </p>
                <Link href="/profile/edit#accessibility-needs">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <ExperienceSection experiences={profile?.experiences} />
        <EducationSection educations={profile?.educations} />
        <SkillsSection skills={profile?.skills} />
      </div>
    </div>
  )
}

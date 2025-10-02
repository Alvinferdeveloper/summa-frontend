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
  Mail,
} from "lucide-react"
import OnboardingForm from "./components/OnboardingForm"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { data: session, status: sessionStatus } = useSession()
  const { data: profile, status: profileStatus, error } = useMyProfile()

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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-start gap-6 w-full sm:w-auto">
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-primary/20 shadow-xl border-2 border-background"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-4 ring-primary/20 shadow-xl border-2 border-background">
                    <UserCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-primary/60" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance mb-2">
                    {profile?.first_name} {profile?.last_name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm sm:text-base truncate">{session?.user?.email}</p>
                  </div>
                </div>
              </div>
              <Link href="/profile/edit" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto font-medium hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent border-2"
                >
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-xl font-semibold">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {profile?.phone_number || profile?.address || profile?.city || profile?.linked_in || profile?.resume_url ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile?.phone_number && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{profile.phone_number}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{profile.address}</span>
                  </div>
                )}
                {profile?.city && profile?.country && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {profile.city}, {profile.country}
                    </span>
                  </div>
                )}
                {profile?.linked_in && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Linkedin className="h-4 w-4 text-primary" />
                    </div>
                    <a
                      href={profile.linked_in}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      Ver LinkedIn
                    </a>
                  </div>
                )}
                {profile?.resume_url && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors underline-offset-4 hover:underline"
                    >
                      Ver Currículum
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4 text-balance">
                  No tienes información de contacto adicional registrada.
                </p>
                <Link href="/profile/edit#contact">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Información de Contacto
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-xl font-semibold">Sobre Mí</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {profile?.description ? (
              <p className="text-muted-foreground leading-relaxed text-pretty">{profile.description}</p>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4 text-balance">Aún no has escrito una descripción sobre ti.</p>
                <Link href="/profile/edit#about">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Descripción
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-accent/30">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/20">
                <Accessibility className="h-5 w-5 text-accent" />
              </div>
              Tipos de Discapacidad
            </CardTitle>
            <Link href="/profile/edit#disability-types">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-accent/10 hover:text-accent">
                <PlusCircle className="h-4 w-4" /> Añadir
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            {profile?.DisabilityTypes && profile.DisabilityTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.DisabilityTypes.map((dt) => (
                  <Badge
                    key={dt.ID}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors border-2 border-accent/30"
                  >
                    {dt.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Accessibility className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2 font-medium text-balance">
                  No has especificado tus tipos de discapacidad.
                </p>
                <p className="text-sm text-muted-foreground/80 mb-4 text-balance">
                  Esta información es opcional y nos ayuda a mejorar el matching.
                </p>
                <Link href="/profile/edit#disability-types">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Tipos de Discapacidad
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              Necesidades de Accesibilidad
            </CardTitle>
            <Link href="/profile/edit#accessibility-needs">
              <Button variant="ghost" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary">
                <PlusCircle className="h-4 w-4" /> Añadir
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            {profile?.AccessibilityNeeds && profile.AccessibilityNeeds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.AccessibilityNeeds.map((an) => (
                  <Badge
                    key={an.ID}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-2 border-primary/30"
                  >
                    {an.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-2 font-medium text-balance">
                  No has especificado tus necesidades de accesibilidad.
                </p>
                <p className="text-sm text-muted-foreground/80 mb-4 text-balance">
                  ¡Ayúdanos a encontrar empleos que se adapten a ti!
                </p>
                <Link href="/profile/edit#accessibility-needs">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <PlusCircle className="h-4 w-4" />
                    Añadir Necesidades de Accesibilidad
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <ExperienceSection experiences={profile?.Experiences} />
        <EducationSection educations={profile?.Educations} />
        <SkillsSection skills={profile?.Skills} />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useMyEmployerProfile } from "./hooks/useEmployerProfile"
import { Loader2, Building2, Mail, Phone, Globe, Calendar, Users, MapPin, Workflow, Pencil } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import EditEmployerProfileModal from "./components/EditEmployerProfileModal"

export default function EmployerProfilePage() {
  const { data: profile, isLoading, error } = useMyEmployerProfile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  console.log(profile)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md p-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-semibold text-lg">Error al cargar el perfil</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="max-w-md p-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No se encontró el perfil</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <EditEmployerProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 bg-primary rounded-sm" />
          <div className="max-w-5xl mx-auto px-6 py-12 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur" />
                  <div className="relative w-24 h-24 rounded-xl bg-background shadow-lg flex items-center justify-center overflow-hidden border-2 border-primary/10">
                    <img
                      src={profile.logo_url || "/company_placeholder.png"}
                      alt={profile.company_name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-balance mb-2">{profile.company_name}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="font-medium bg-accent">
                        {profile.industry}
                      </Badge>
                      <Badge className="font-normal bg-primary">
                        {profile.size} empleados
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-2xl leading-relaxed">
                    {profile.description ||
                      "Empresa líder en su sector, comprometida con la excelencia y la innovación."}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditModalOpen(true)}
                size="lg"
                className="gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  Información de Contacto
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <p className="text-sm font-medium truncate">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                          <p className="text-sm font-medium">{profile.phone_number}</p>
                        </div>
                      </div>
                    </div>

                    {profile.website && (
                      <div className="group">
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground mb-1">Sitio Web</p>
                            <p className="text-sm font-medium truncate">{profile.website}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                          <p className="text-sm font-medium">
                            {profile.address}, {profile.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Workflow className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Dedicación</p>
                          <p className="text-sm font-medium">{profile.dedication}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  Datos
                </h2>
                <div className="space-y-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile.size}</p>
                    <p className="text-xs text-muted-foreground mt-1">Empleados</p>
                  </div>

                  {profile.foundation_date && (
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border border-primary/10">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-lg font-semibold">{new Date(profile.foundation_date).getFullYear()}</p>
                      <p className="text-xs text-muted-foreground mt-1">Año de Fundación</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{profile.industry}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {profile.description && (
            <Card className="mt-6 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-4">Acerca de Nosotros</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{profile.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

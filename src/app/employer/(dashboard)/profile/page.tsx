"use client"

import { useState } from "react"
import { useMyEmployerProfile } from "./hooks/useEmployerProfile"
import { Loader2, Building2, Mail, Phone, Globe, Calendar, Users, MapPin, Workflow } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditEmployerProfileModal from "./components/EditEmployerProfileModal"

export default function EmployerProfilePage() {
  const { data: profile, isLoading, error } = useMyEmployerProfile()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  console.log(profile)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">Error al cargar el perfil</p>
          <p className="text-xs text-gray-400">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-sm text-gray-400">No se encontró el perfil</p>
      </div>
    )
  }

  return (
    <>
      <EditEmployerProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile} />
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12 bg-card rounded-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-2xl font-light tracking-tight text-gray-900">Perfil de la Empresa</h1>
            <p className="text-sm text-gray-400">Información general de tu organización</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsEditModalOpen(true)}
            className="text-sm font-normal hover:bg-primary border-2 border-primary cursor-pointer"
          >
            Editar
          </Button>
        </div>

        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0 pb-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={profile.logo_url || "/company_placeholder.png"}
                  alt={profile.company_name}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <div className="space-y-1 flex-1">
                <CardTitle className="text-xl font-medium tracking-tight text-gray-900">
                  {profile.company_name}
                </CardTitle>
                <p className="text-sm text-gray-500">{profile.industry}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-0 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.email}</span>
              </div>

              <div className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.phone_number}</span>
              </div>

              <div className="flex items-center gap-3 group">
                <Globe className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.website}</span>
              </div>

              <div className="flex items-center gap-3 group">
                <MapPin className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">
                  {profile.address}, {profile.country}
                </span>
              </div>

              <div className="flex items-center gap-3 group">
                <Calendar className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">
                  Fundada en {new Date(profile.foundation_date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3 group">
                <Users className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.size} empleados</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Building2 className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.industry}</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Workflow className="h-4 w-4 group-hover:text-gray-400 transition-colors" />
                <span className="text-sm text-gray-600">{profile.dedication}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-900 tracking-tight">Descripción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

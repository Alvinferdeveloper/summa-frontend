"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, PlusCircle, Pencil, X, MapPin, Calendar } from "lucide-react"
import type { ProfileData } from "../../hooks/useMyProfile"
import EducationForm from "./EducationForm"
import { useDeleteEducation } from "../hooks/useDeleteEducation"

interface EducationListProps {
  profile: ProfileData
}

export default function EducationList({ profile }: EducationListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const deleteEducationMutation = useDeleteEducation()

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta formación?")) {
      deleteEducationMutation.mutate(id)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Presente"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
  }

  return (
    <Card className="rounded-lg border-border/40 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          Educación
        </CardTitle>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="gap-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Añadir formación
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <div className="mb-4 p-4 border border-dashed rounded-lg bg-muted/30">
            <EducationForm onSuccess={() => setIsAdding(false)} />
          </div>
        )}
        {profile.educations && profile.educations.length > 0 ? (
          <div className="space-y-3">
            {profile.educations.map((edu) => (
              <div
                key={edu.id}
                className="group relative flex gap-4 p-4 border border-border/50 rounded-xl bg-card hover:bg-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300"
              >
                {/* Logo de la universidad */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border/50 flex items-center justify-center">
                    <img
                      src={edu.university?.logo_url || "/university_placeholder.png"}
                      alt={edu.university?.name || "Universidad"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Información de la educación */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{edu.degree}</h3>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    {edu.university?.name || edu.university_suggestion?.suggested_name || "Universidad no especificada"}
                  </p>

                  {/* Campo de estudio */}
                  {edu.field_of_study && (
                    <p className="text-sm text-muted-foreground mb-2 italic">{edu.field_of_study}</p>
                  )}

                  {/* Fechas y ubicación */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                      </span>
                    </div>
                    {edu.university?.address && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{edu.university.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción - aparecen en hover */}
                <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => alert("Funcionalidad de editar pendiente.")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(edu.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isAdding && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-1">Sin formación académica</p>
              <p className="text-sm text-muted-foreground/70">Añade tu educación para completar tu perfil</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}

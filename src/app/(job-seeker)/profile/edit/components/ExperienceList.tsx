"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, PlusCircle, Pencil, X, Calendar, Building2 } from "lucide-react"
import type { ProfileData } from "../../hooks/useMyProfile"
import { useDeleteExperience } from "../hooks/useDeleteExperience"
import ExperienceForm from "./ExperienceForm"
import { z } from "zod"

export const experienceSchema = z.object({
  job_title: z.string().min(1, "El título del puesto es requerido."),
  description: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es requerida."),
  end_date: z.string().optional(),
  employer_id: z.number().optional(),
  new_employer_id: z.number().optional(),
})
export type ExperienceFormValues = z.infer<typeof experienceSchema>

interface ExperienceListProps {
  profile: ProfileData
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Presente"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

export default function ExperienceList({ profile }: ExperienceListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { mutate: deleteExperience } = useDeleteExperience()

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      deleteExperience(id)
    }
  }

  return (
    <Card className="rounded-lg border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          Experiencia Laboral
        </CardTitle>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm" className="gap-2 rounded-full cursor-pointer">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && <ExperienceForm onSuccess={() => setIsAdding(false)} />}
        {profile.experiences && profile.experiences.length > 0
          ? profile.experiences.map((exp) => (
            <div
              key={exp.id}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-4 p-5">
                <div className="flex-shrink-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted ring-1 ring-border/50">
                    <img
                      src={exp.employer?.logo_url || "/company_placeholder.png"}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">{exp.job_title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {exp.employer?.company_name ||
                            exp.new_employer?.company_name ||
                            "Empleador no especificado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {exp.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => alert("Funcionalidad de editar pendiente.")}
                        className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Editar experiencia"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Eliminar experiencia"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))
          : !isAdding && (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">Aún no tienes experiencia laboral registrada.</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Haz clic en "Añadir" para comenzar</p>
            </div>
          )}
      </CardContent>
    </Card>
  )
}

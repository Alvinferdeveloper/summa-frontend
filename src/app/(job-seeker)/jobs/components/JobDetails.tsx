"use client"

import { useState } from "react"
import type { Job } from "./JobListItem"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Building2, MapPin, Briefcase, Zap, Clock, FileText, CheckCircle2, Monitor, Calendar } from "lucide-react"
import ApplyModal from "./ApplyModal"

interface JobDetailsProps {
  job: Job | null,
  isAppliable?: boolean
}

export default function JobDetails({ job, isAppliable = true }: JobDetailsProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  if (!job) {
    return (
      <div className="hidden lg:flex h-full items-center justify-center bg-gradient-to-br from-muted/30 via-muted/10 to-transparent rounded-lg">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center shadow-sm">
            <Briefcase className="w-10 h-10 text-primary/60" />
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-semibold">Selecciona un empleo</p>
            <p className="text-muted-foreground text-sm max-w-[250px]">
              Elige una oferta de la lista para ver todos los detalles
            </p>
          </div>
        </div>
      </div>
    )
  }

  const accessibilityFeatures = job.accessibility_features ? JSON.parse(job.accessibility_features) : []

  return (
    <>
      {isAppliable && <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={job} />}
      <div className="h-full bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <ScrollArea className="h-full">
          {/* Header Section */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border p-6 lg:p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="flex items-start gap-5 mb-6">
              <div className="w-24 h-24 flex-shrink-0 bg-background border-2 border-border rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={job.employer.logo_url || "/company_placeholder.png"}
                  alt={job.employer.company_name}
                  className="w-full h-full object-contain rounded-2xl p-3"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 text-balance leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-primary" />
                  <p className="text-lg text-foreground font-semibold">{job.employer.company_name}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </Badge>
                  <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {job.contract_type}
                  </Badge>
                  {job.work_model && (
                    <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                      <Monitor className="h-3.5 w-3.5" />
                      {job.work_model}
                    </Badge>
                  )}
                  {job.work_schedule && (
                    <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {job.work_schedule}
                    </Badge>
                  )}
                  {job.experience_level && (
                    <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                      <Monitor className="h-3.5 w-3.5" />
                      {job.experience_level}
                    </Badge>
                  )}
                  {job.category.name && (
                    <Badge variant="default" className="px-3 py-1.5 text-sm font-medium gap-1.5">
                      <Monitor className="h-3.5 w-3.5" />
                      {job.category.name}
                    </Badge>
                  )}

                </div>
                <p className="text-lg text-muted-foreground mt-4">{job.location}</p>
                <p className="text-sm text-green-500">{job.salary}</p>
              </div>
            </div>

            {isAppliable && (
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                size="sm"
                disabled={job.has_applied}
                className="w-auto rounded-2xl px-6 h-12 text-md font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {job.has_applied ? "Postulado" : "Postularme"}
              </Button>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Job Description */}
            <Card className="p-6 border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Descripción del Puesto</h2>
                  <p className="text-sm text-muted-foreground">Conoce más sobre esta oportunidad</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed pl-13">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </Card>

            {/* Responsibilities */}
            <Card className="p-6 border-l-4 border-l-chart-2 bg-gradient-to-br from-chart-2/5 to-transparent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Responsabilidades</h2>
                  <p className="text-sm text-muted-foreground">Lo que harás en este rol</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed pl-13">
                <p className="whitespace-pre-line">{job.responsibilities}</p>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6 border-l-4 border-l-chart-4 bg-gradient-to-br from-chart-4/5 to-transparent">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Requisitos</h2>
                  <p className="text-sm text-muted-foreground">Lo que necesitas para aplicar</p>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed pl-13">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </Card>

            {/* Accessibility Features */}
            {accessibilityFeatures.length > 0 && (
              <Card className="p-6 border-l-4 border-l-chart-5 bg-gradient-to-br from-chart-5/5 to-transparent">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-chart-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Características de Accesibilidad</h2>
                    <p className="text-sm text-muted-foreground">Beneficios y adaptaciones disponibles</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-13">
                  {accessibilityFeatures.map((feature: string) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium border-chart-5/30 bg-chart-5/5 text-foreground hover:bg-chart-5/10 transition-colors"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Bottom CTA */}
            <div className="pt-4">
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                size="sm"
                className="w-auto px-6 h-9 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Postular a este empleo
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

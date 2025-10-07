"use client"

import { useState } from "react"
import type { Job } from "./JobListItem"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, MapPin, Briefcase, Zap } from "lucide-react"
import ApplyModal from "./ApplyModal"

interface JobDetailsProps {
  job: Job | null
}

export default function JobDetails({ job }: JobDetailsProps) {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  if (!job) {
    return (
      <div className="hidden lg:flex h-full items-center justify-center bg-muted/30 rounded-lg">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">Selecciona un empleo para ver los detalles</p>
        </div>
      </div>
    )
  }

  const accessibilityFeatures = job.accessibility_features ? JSON.parse(job.accessibility_features) : []

  return (
    <>
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} job={job} />
      <div className="h-full bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <ScrollArea className="h-full">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 flex-shrink-0 bg-background border border-border rounded-xl flex items-center justify-center shadow-sm">
                {job.employer.logo_url ? (
                  <img
                    src={job.employer.logo_url || "/placeholder.svg"}
                    alt={job.employer.company_name}
                    className="w-full h-full object-contain rounded-xl p-2"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2 text-balance leading-tight">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground font-medium mb-3">{job.employer.company_name}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    <span>{job.contract_type}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsApplyModalOpen(true)}
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Postular a este empleo
            </Button>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 space-y-8">
            {/* Job Description */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">Descripción del Puesto</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Responsibilities */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">Responsabilidades</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-line">{job.responsibilities}</p>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">Requisitos</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </section>

            {/* Accessibility Features */}
            {accessibilityFeatures.length > 0 && (
              <>
                <div className="border-t border-border" />
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Características de Accesibilidad
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {accessibilityFeatures.map((feature: string) => (
                      <Badge key={feature} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Bottom CTA */}
            <div className="pt-4">
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
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

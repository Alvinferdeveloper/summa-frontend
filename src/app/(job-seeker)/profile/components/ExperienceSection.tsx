"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, PlusCircle, MapPin } from "lucide-react"
import Link from "next/link"
import type { Experience } from "../hooks/useMyProfile"

interface ExperienceSectionProps {
  experiences?: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          Experiencia Laboral
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">No hay experiencia laboral registrada</p>
            <p className="text-sm text-muted-foreground">
              Añade tu primera experiencia para destacar tu trayectoria profesional
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-12 group">
                {/* Timeline line */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-border/30" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-4 top-2 w-5 h-5 bg-primary rounded-full border-4 border-background shadow-sm group-hover:scale-110 transition-transform duration-200" />

                {/* Content card */}
                <div className="bg-card border hover:bg-primary/5 border-border/50 rounded-lg p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
                        <img
                          src={exp.employer?.logo_url || "/company_placeholder.png"}
                          alt={exp.employer?.company_name || "Company logo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground leading-tight">{exp.job_title}</h3>
                          <p className="font-medium text-base text-muted-foreground mt-0.5">
                            {exp.employer?.company_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          {new Date(exp.start_date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}
                          {" - "}
                          {exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })
                            : "Presente"}
                        </span>
                        {exp.employer?.address && (
                          <>
                            <span className="text-border">•</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {exp.employer.address}
                            </span>
                          </>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href="/profile/edit#experience"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 mt-6 px-4 py-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200 group"
        >
          <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          Añadir Experiencia Laboral
        </Link>
      </CardContent>
    </Card>
  )
}


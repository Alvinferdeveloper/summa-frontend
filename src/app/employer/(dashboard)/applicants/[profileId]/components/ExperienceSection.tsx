
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin } from "lucide-react";
import type { Experience } from "@/app/(job-seeker)/profile/hooks/useMyProfile";

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          Experiencia Laboral
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {!experiences || experiences.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">El candidato no tiene experiencia laboral registrada.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-12 group">
                {index !== experiences.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-border/30" />
                )}
                <div className="absolute left-4 top-2 w-5 h-5 bg-primary rounded-full border-4 border-background shadow-sm" />
                <div className="bg-card border border-border/50 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
                        <img
                          src={exp.employer?.logo_url || "/company_placeholder.png"}
                          alt={exp.employer?.company_name || "Company logo"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground leading-tight">{exp.job_title}</h3>
                      <p className="font-medium text-base text-muted-foreground mt-0.5">
                        {exp.employer?.company_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          {new Date(exp.start_date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString("es-ES", { month: "short", year: "numeric" }) : "Presente"}
                        </span>
                        {exp.employer?.address && (
                          <>
                            <span className="text-border">•</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {exp.employer.address}</span>
                          </>
                        )}
                      </div>
                      {exp.description && <p className="text-sm text-muted-foreground leading-relaxed mt-3">{exp.description}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

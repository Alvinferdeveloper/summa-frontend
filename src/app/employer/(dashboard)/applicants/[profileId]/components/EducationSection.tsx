
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import type { Education } from "@/app/(job-seeker)/profile/hooks/useMyProfile";

interface EducationSectionProps {
  educations?: Education[];
}

export default function EducationSection({ educations }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  };

  return (
    <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          Educación
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {!educations || educations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <p className="text-foreground/90 mb-2 font-semibold text-lg text-balance">
              El candidato no ha añadido información educativa.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div key={edu.id} className="relative pl-8 pb-6">
                {index !== educations.length - 1 && (
                  <div className="absolute left-0 top-2 w-px h-full bg-border/50" />
                )}
                <div className="absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/70 border-2 border-background shadow-md" />
                <div className="p-6 border border-border/60 rounded-xl">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-border/60 bg-white flex items-center justify-center">
                        <img
                          src={edu.university?.logo_url || "/university_placeholder.png"}
                          alt={`${edu.university?.name} logo`}
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground mb-1.5 text-balance leading-tight">{edu.degree}</h3>
                      {edu.field_of_study && <p className="text-sm font-medium text-primary/80 mb-2 capitalize">{edu.field_of_study}</p>}
                      <p className="text-base font-semibold text-foreground/90">{edu.university?.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Presente"}</div>
                        {edu.university?.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {edu.university.address}</div>}
                      </div>
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

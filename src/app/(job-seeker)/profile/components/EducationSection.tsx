
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlusCircle, Calendar, MapPin } from "lucide-react";
import Link from 'next/link';
import { Education } from '../hooks/useMyProfile';

interface EducationSectionProps {
  educations?: Education[];
}

export default function EducationSection({ educations }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
  }
  return (
    <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-accent/30">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/20">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          Educación
        </CardTitle>
        <Link href="/profile/edit#education">
          <Button variant="ghost" size="sm" className="gap-1 hover:bg-accent/10 hover:text-accent">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {educations && educations.length > 0 ? (
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div
                key={edu.ID}
                className={`relative pl-6 pb-6 ${index !== educations.length - 1 ? "border-l-2 border-border/40" : ""
                  }`}
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background shadow-sm" />

                <div className="bg-accent/5 rounded-lg p-5 border border-accent/20 hover:border-accent/40 hover:bg-accent/10 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 text-balance">{edu.degree}</h3>
                      {edu.field_of_study && <p className="text-sm text-muted-foreground mb-2">{edu.field_of_study}</p>}
                      <p className="text-base font-medium text-accent">{edu.university.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(edu.start_date)} -{" "}
                        {edu.end_date ? formatDate(edu.end_date) : "N/A"}
                      </span>
                    </div>
                    {edu.university.address && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{edu.university.address}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-2 font-medium text-balance">
              No has añadido información educativa aún.
            </p>
            <p className="text-sm text-muted-foreground/80 mb-4 text-balance">
              Añade tu formación académica para completar tu perfil.
            </p>
            <Link href="/profile/edit#education">
              <Button variant="outline" className="gap-2 bg-transparent">
                <PlusCircle className="h-4 w-4" />
                Añadir Educación
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

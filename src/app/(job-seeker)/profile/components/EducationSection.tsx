"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, PlusCircle, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import type { Education } from "../hooks/useMyProfile"
import Image from "next/image"

interface EducationSectionProps {
  educations?: Education[]
}

export default function EducationSection({ educations }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
  }
 
  return (
    <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-accent/30 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-gradient-to-r from-accent/5 via-accent/3 to-transparent">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border border-accent/20 shadow-sm">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          Educación
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {educations && educations.length > 0 ? (
          <div className="space-y-6">
            {educations.map((edu, index) => (
              <div
                key={edu.id}
                className={`relative pl-8 pb-6 ${
                  index !== educations.length - 1
                    ? "border-l-2 border-gradient-to-b from-accent/40 via-accent/20 to-transparent"
                    : ""
                }`}
              >
                <div className="absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-accent to-accent/70 border-2 border-background shadow-md transition-transform duration-200 hover:scale-125" />

                <div className="group bg-gradient-to-br from-card via-card to-accent/5 rounded-xl p-6 border border-border/60 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {edu.university?.logo_url && (
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-border/60 group-hover:border-accent/40 transition-all duration-300 shadow-sm group-hover:shadow-md bg-white">
                          <img
                            src={edu.university.logo_url || "/placeholder.svg"}
                            alt={`${edu.university.name} logo`}
                            className="object-contain p-2"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-foreground mb-1.5 text-balance leading-tight group-hover:text-accent transition-colors duration-200">
                          {edu.degree}
                        </h3>
                        {edu.field_of_study && (
                          <p className="text-sm font-medium text-accent/80 mb-2 capitalize">{edu.field_of_study}</p>
                        )}
                        <p className="text-base font-semibold text-foreground/90">{edu.university?.name}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10">
                          <Calendar className="h-4 w-4 text-accent" />
                          <span className="font-medium">
                            {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : "Presente"}
                          </span>
                        </div>
                        {edu.university?.address && (
                          <div className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/10">
                            <MapPin className="h-4 w-4 text-accent" />
                            <span className="font-medium">{edu.university.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-2 border-accent/20 shadow-sm">
              <GraduationCap className="h-10 w-10 text-accent" />
            </div>
            <p className="text-foreground/90 mb-2 font-semibold text-lg text-balance">
              No has añadido información educativa aún.
            </p>
            <p className="text-sm text-muted-foreground mb-6 text-balance max-w-md mx-auto">
              Añade tu formación académica para completar tu perfil.
            </p>
            <Link href="/profile/edit#education">
              <Button
                variant="outline"
                className="gap-2 bg-transparent hover:bg-accent/10 border-accent/30 hover:border-accent"
              >
                <PlusCircle className="h-4 w-4" />
                Añadir Educación
              </Button>
            </Link>
          </div>
        )}
        {educations && educations.length > 0 && (
          <Link
            href="/profile/edit#education"
            className="inline-flex mx-auto items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors mt-6 group"
          >
            <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Añadir Educación
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

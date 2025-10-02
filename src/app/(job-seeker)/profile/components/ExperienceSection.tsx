
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { Experience } from '../hooks/useMyProfile';

interface ExperienceSectionProps {
  experiences?: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experiencia Laboral
        </CardTitle>
        <Link href="/profile/edit#experience">
          <Button variant="outline" size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {(!experiences || experiences.length === 0) ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Por el momento no tienes experiencia laboral registrada.</p>
            <p>¡Añade tu primera experiencia para destacar!</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.ID} className="relative pl-6 border-l-2 border-gray-200">
              <div className="absolute -left-2 top-1 w-4 h-4 bg-primary rounded-full"></div>
              <p className="text-sm text-muted-foreground">
                {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Presente'}
              </p>
              <h3 className="font-bold text-lg">{exp.job_title}</h3>
              <p className="font-semibold text-md text-gray-700">{exp.employer.company_name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

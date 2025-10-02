
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, PlusCircle } from "lucide-react";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Skill } from '../hooks/useMyProfile';

interface SkillsSectionProps {
  skills?: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Habilidades
        </CardTitle>
        <Link href="/profile/edit#skills">
          <Button variant="outline" size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" /> Añadir
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {(!skills || skills.length === 0) ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Por el momento no tienes habilidades registradas.</p>
            <p>¡Añade tus habilidades para que los empleadores te encuentren!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.ID} variant="secondary">{skill.name}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

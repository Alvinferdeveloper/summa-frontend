
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Skill } from "@/app/(job-seeker)/profile/hooks/useMyProfile";

interface SkillsSectionProps {
  skills?: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Card className="border-2 border-border/60 shadow-md hover:shadow-lg transition-all duration-300 hover:border-accent/30 rounded-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Habilidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!skills || skills.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>El candidato no ha registrado habilidades.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="default">{skill.name}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

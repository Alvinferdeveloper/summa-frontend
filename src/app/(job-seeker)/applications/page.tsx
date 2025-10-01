
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Mis Postulaciones</h1>
      <Card>
        <CardHeader>
          <CardTitle>Empleos a los que has postulado</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-12">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <p>Aún no has postulado a ningún empleo.</p>
          <p>¡Los empleos a los que postules aparecerán aquí!</p>
        </CardContent>
      </Card>
    </div>
  );
}

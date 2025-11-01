
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Building2, CheckCircle, Loader2 } from 'lucide-react';

// Este es un placeholder. En el futuro, usaríamos un hook para obtener datos reales del backend.
const adminStats = [
  { title: "Total Usuarios", value: "1,234", icon: Users },
  { title: "Total Empleadores", value: "123", icon: Building2 },
  { title: "Empleos Publicados", value: "567", icon: Briefcase },
  { title: "Postulaciones", value: "8,910", icon: CheckCircle },
];

export default function AdminDashboardPage() {
  // En el futuro, aquí usaríamos un hook de React Query para obtener los datos reales
  const isLoading = false; // Placeholder

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aquí se pueden añadir más gráficos o tablas de resumen */}
    </div>
  );
}

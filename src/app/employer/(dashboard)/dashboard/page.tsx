'use client';

import DisabilityChart from './components/DisabilityChart';
import { useEmployerDashboard } from './hooks/useEmployerDashboard';
import PipelineChart from './components/PipelineChart';
import SkillInsightsChart from './components/SkillInsightsChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Bell, PlusCircle, Loader2 } from "lucide-react";
import Link from 'next/link';

export default function EmployerDashboardPage() {
  const { stats, pipeline, skillInsights, disabilityInsights, isLoading, error } = useEmployerDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar el dashboard: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo,</h1>
          <p className="text-lg text-muted-foreground">
            Aquí tienes un resumen de tu actividad en la plataforma.
          </p>
        </div>
        <Link href="/employer/jobs/create">
          <Button className="flex items-center gap-2 h-11 text-base">
            <PlusCircle className="h-5 w-5" />
            Publicar un Empleo
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleos Activos</CardTitle>
            <Briefcase className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.active_jobs ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones Totales</CardTitle>
            <Users className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.total_applicants ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Postulantes (7d)</CardTitle>
            <Bell className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.new_applicants_7d ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {pipeline && <PipelineChart data={pipeline} />}
        {skillInsights && <SkillInsightsChart data={skillInsights} />}
      </div>

      {/* Disability Insights Chart */}
      {disabilityInsights && disabilityInsights.length > 0 && (
        <div className="mt-6">
          <DisabilityChart data={disabilityInsights} />
        </div>
      )}
    </div>
  );
}

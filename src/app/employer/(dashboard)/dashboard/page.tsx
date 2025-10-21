
'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Bell, PlusCircle, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useEmployerJobPosts } from '../hooks/useEmployerJobPosts';

const stats = [
  { title: "Empleos Activos", value: "5", icon: <Briefcase className="h-6 w-6 text-primary" /> },
  { title: "Nuevos Candidatos", value: "12", icon: <Users className="h-6 w-6 text-green-500" /> },
  { title: "Notificaciones", value: "3", icon: <Bell className="h-6 w-6 text-yellow-500" /> },
];

export default function EmployerDashboardPage() {
  const { data: session } = useSession();
  const { data: jobPosts, isLoading, error } = useEmployerJobPosts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error al cargar tus empleos: {error.message}</div>;
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
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +2.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tus Publicaciones de Empleo */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tus Publicaciones de Empleo</h2>
        {jobPosts && jobPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobPosts.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{job.location} - {job.work_model.name}</p>
                </CardHeader>
                <CardContent className="flex justify-end">
                  <Link href={`/employer/jobs/${job.id}/applicants`}>
                    <Button variant="outline" size="sm">
                      Ver Postulantes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>Aún no has publicado ningún empleo.</p>
              <Link href="/employer/jobs/create" className="mt-4 inline-block">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" /> Publicar tu primer empleo
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

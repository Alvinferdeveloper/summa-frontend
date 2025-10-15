'use client';

import { useState, useEffect } from "react";
import { useEmployerJobPosts } from "../hooks/useEmployerJobPosts";
import { useJobApplicants } from "./hooks/useJobApplicants";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Users, Briefcase, FileText, Clock, MoreHorizontal, Check, X, Eye } from "lucide-react";
import Link from "next/link";
import EmployerJobListItem from "./components/EmployerJobListItem";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUpdateApplicationStatus } from "./hooks/useApplicationMutations";

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return `hace ${Math.floor(seconds)} segundos`;
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case 'aceptado': return 'default';
    case 'en revisión': return 'outline';
    case 'rechazado': return 'destructive';
    default: return 'outline';
  }
};

export default function MyJobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { data: jobPosts, isLoading: isLoadingJobs, error: jobsError } = useEmployerJobPosts();
  const { data: applicants, isLoading: isLoadingApplicants, error: applicantsError } = useJobApplicants(selectedJobId!);
  const { mutate: updateStatus } = useUpdateApplicationStatus(selectedJobId!);

  useEffect(() => {
    if (!selectedJobId && jobPosts && jobPosts.length > 0) {
      setSelectedJobId(jobPosts[0].id.toString());
    }
  }, [jobPosts, selectedJobId]);

  const selectedJob = jobPosts?.find((job) => job.id.toString() === selectedJobId);

  const handleStatusChange = (applicationId: number, status: string) => {
    updateStatus({ applicationId, status });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Ofertas</h1>
              <p className="text-muted-foreground">Administra tus publicaciones y revisa los postulantes</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-blue-50 rounded-lg px-4 py-3 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{jobPosts?.length || 0}</p>
                    <p className="text-xs text-blue-600/70">Ofertas activas</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-3 border border-green-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{applicants?.length || 0}</p>
                    <p className="text-xs text-green-600/70">Postulantes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
          <div className="lg:col-span-1 h-[calc(100vh-18rem)] bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">Mis Ofertas de Empleo</CardTitle>
                  <p className="text-xs text-gray-600">Selecciona una oferta para ver sus postulantes</p>
                </div>
                <div className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  {jobPosts?.length || 0}
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              {isLoadingJobs ? (
                <div className="flex flex-col justify-center items-center h-full py-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50"></div>
                    <Loader2 className="relative h-12 w-12 animate-spin text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-4 font-medium">Cargando ofertas...</p>
                </div>
              ) : jobsError ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6">
                  <div className="bg-red-50 rounded-full p-4 mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-600 font-semibold text-base mb-1">Error al cargar ofertas</p>
                  <p className="text-sm text-gray-600 text-center">Por favor, intenta recargar la página</p>
                </div>
              ) : jobPosts && jobPosts.length > 0 ? (
                <div className="p-2">
                  {jobPosts.map((job) => (
                    <EmployerJobListItem
                      key={job.id}
                      job={job}
                      isActive={selectedJobId === job.id.toString()}
                      onClick={() => setSelectedJobId(job.id.toString())}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-900 text-base mb-2">No tienes ofertas publicadas</p>
                  <p className="text-sm text-gray-600 max-w-xs">
                    Comienza publicando tu primera oferta de empleo para recibir postulaciones
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="lg:col-span-2 bg-white h-[calc(100vh-18rem)] border border-gray-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-100 py-4 px-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl font-semibold text-gray-900">Postulantes</CardTitle>
                    <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {applicants?.length || 0}
                    </div>
                  </div>
                  {selectedJob ? (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">{selectedJob.title}</p>
                      <p className="text-xs text-muted-foreground">Revisa y gestiona las aplicaciones recibidas</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Selecciona una oferta para ver los postulantes</p>
                  )}
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              {isLoadingApplicants ? (
                <div className="flex flex-col justify-center items-center h-full py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-muted-foreground">Cargando postulantes...</p>
                </div>
              ) : applicantsError ? (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-red-600 font-medium mb-1">Error al cargar postulantes</p>
                  <p className="text-sm text-muted-foreground">Por favor, intenta nuevamente</p>
                </div>
              ) : applicants && applicants.length > 0 ? (
                <div className="px-4 space-y-2">
                  {applicants.map((app) => (
                    <div
                      key={app.id}
                      className="group relative flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                    >
                      <Link
                        href={`/employer/applicants/${app.applicant.profile_id}`}
                        className="flex items-center gap-4 flex-grow cursor-pointer"
                      >
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                          <img
                            src={app.applicant.profile_picture || "/profile_placeholder.png"}
                            alt={app.applicant.first_name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-base">
                            {app.applicant.first_name} {app.applicant.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{app.applicant.email}</p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusVariant(app.status)} className="capitalize font-medium px-3 py-1 text-xs">
                          {app.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(app.id, "Aceptado")}
                              className="cursor-pointer"
                            >
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              <span className="font-medium">Aceptar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(app.id, "Rechazado")}
                              className="cursor-pointer"
                            >
                              <X className="mr-2 h-4 w-4 text-red-600" />
                              <span className="font-medium">Rechazar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(app.id, "En revisión")}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-600" />
                              <span className="font-medium">En revisión</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5 shadow-inner">
                    <Users className="h-12 w-12 text-blue-400" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2 text-lg">No hay postulantes todavía</p>
                  <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                    Cuando alguien aplique a esta oferta de empleo, aparecerá aquí para que puedas revisar su perfil y
                    gestionar su aplicación
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
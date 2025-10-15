"use client"

import { useState, useEffect } from "react"
import { useEmployerJobPosts } from "../hooks/useEmployerJobPosts"
import { useJobApplicants } from "./hooks/useJobApplicants"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Users, Briefcase, FileText, Clock } from "lucide-react"
import Link from "next/link"
import EmployerJobListItem from "./components/EmployerJobListItem"

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


export default function MyJobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const { data: jobPosts, isLoading: isLoadingJobs, error: jobsError } = useEmployerJobPosts()
  const { data: applicants, isLoading: isLoadingApplicants, error: applicantsError } = useJobApplicants(selectedJobId!)

  useEffect(() => {
    if (!selectedJobId && jobPosts && jobPosts.length > 0) {
      setSelectedJobId(jobPosts[0].id.toString())
    }
  }, [jobPosts, selectedJobId])

  const selectedJob = jobPosts?.find((job) => job.id.toString() === selectedJobId)

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
          {/* Columna Izquierda: Lista de Empleos */}
          <div className="lg:col-span-1 h-[calc(100vh-18rem)] bg-white border py-2 border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Mis Ofertas</CardTitle>
                <div className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {jobPosts?.length || 0}
                </div>
              </div>
            </CardHeader>
            <ScrollArea className="flex-1">
              {isLoadingJobs ? (
                <div className="flex flex-col justify-center items-center h-full py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-muted-foreground">Cargando ofertas...</p>
                </div>
              ) : jobsError ? (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">Error al cargar ofertas</p>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    Por favor, intenta de nuevo más tarde
                  </p>
                </div>
              ) : jobPosts && jobPosts.length > 0 ? (
                <div>
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
                <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-900 mb-1">No tienes ofertas publicadas</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Crea tu primera oferta de empleo para comenzar a recibir postulantes
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Columna Derecha: Lista de Postulantes */}
          <div className="lg:col-span-2 bg-white h-[calc(100vh-18rem)] border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-gray-100 py-2 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Postulantes</CardTitle>
                  {selectedJob && <p className="text-sm text-muted-foreground mt-1">{selectedJob.title}</p>}
                </div>
                <div className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {applicants?.length || 0}
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
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">Error al cargar postulantes</p>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    Por favor, intenta de nuevo más tarde
                  </p>
                </div>
              ) : applicants && applicants.length > 0 ? (
                <div className="p-2">
                  {applicants.map((app) => (
                    <Link key={app.id} href={`/employer/applicants/${app.applicant.profile_id}`}>
                      <div className="flex items-center gap-4 p-4 mb-2 border border-gray-100 rounded-lg hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 group cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                         
                            <img src={app.applicant.profile_picture || "/profile_placeholder.png"} alt={app.applicant.first_name} className="w-full h-full object-cover rounded-full" />
                          
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {app.applicant.first_name} {app.applicant.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{app.applicant.email}</p>
                        </div>
                        <div className="flex items-center justify-end text-xs text-muted-foreground mt-4">
                          <Clock className="h-3 w-3 mr-1" />
                          Postulado {timeAgo(app.created_at)}
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 shadow-inner">
                    <Users className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-900 mb-2 text-lg">No hay postulantes todavía</p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Cuando alguien aplique a esta oferta de empleo, aparecerá aquí para que puedas revisar su perfil
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

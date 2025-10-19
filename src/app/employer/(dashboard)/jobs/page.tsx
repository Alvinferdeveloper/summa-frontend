"use client"

import { useState, useEffect } from "react"
import { useEmployerJobPosts } from "../hooks/useEmployerJobPosts"
import { useJobApplicants } from "./hooks/useJobApplicants"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Users, Briefcase, FileText, MoreHorizontal, Check, X, Eye } from "lucide-react"
import Link from "next/link"
import EmployerJobListItem from "./components/EmployerJobListItem"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUpdateApplicationStatus } from "./hooks/useApplicationMutations"
import clsx from "clsx"

const timeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  let interval = seconds / 86400
  if (interval > 1) return `hace ${Math.floor(interval)} días`
  interval = seconds / 3600
  if (interval > 1) return `hace ${Math.floor(interval)} horas`
  interval = seconds / 60
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`
  return `hace ${Math.floor(seconds)} segundos`
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case "aceptado":
      return "default"
    case "en revisión":
      return "outline"
    case "rechazado":
      return "destructive"
    case "postulado":
      return "secondary"
    default:
      return "outline"
  }
}

export default function MyJobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const { data: jobPosts, isLoading: isLoadingJobs, error: jobsError } = useEmployerJobPosts()
  const { data: applicants, isLoading: isLoadingApplicants, error: applicantsError } = useJobApplicants(selectedJobId!)
  const { mutate: updateStatus } = useUpdateApplicationStatus(selectedJobId!)

  useEffect(() => {
    if (!selectedJobId && jobPosts && jobPosts.length > 0) {
      setSelectedJobId(jobPosts[0].id.toString())
    }
  }, [jobPosts, selectedJobId])

  const selectedJob = jobPosts?.find((job) => job.id.toString() === selectedJobId)

  const handleStatusChange = (applicationId: number, status: string) => {
    updateStatus({ applicationId, status })
  }

  return (
    <div className="min-h-screen">
      <div className="mb-4">
        <div className="max-w-[1400px] mx-auto px-6 py-3 bg-gradient-to-br from-primary/70 via-primary/50 to-primary border-b">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black mb-1">Gestión de Ofertas</h1>
              <p className="text-sm text-white">Administra tus publicaciones y revisa los postulantes</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-black leading-none mb-1">Ofertas Activas</p>
                  <p className="text-xl font-semibold text-white leading-none">{jobPosts?.length || 0}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-neutral-800" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Users className="h-4 w-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-xs text-black leading-none mb-1">Total Postulantes</p>
                  <p className="text-xl font-semibold text-white leading-none">{applicants?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          <div className="lg:col-span-1 h-full bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100 py-5 px-6 bg-emerald-400">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-1">Mis Ofertas</CardTitle>
                  <p className="text-sm text-white">Selecciona para ver postulantes</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                  {jobPosts?.length || 0}
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              {isLoadingJobs ? (
                <div className="flex flex-col justify-center items-center h-full py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-slate-600 font-medium">Cargando ofertas...</p>
                </div>
              ) : jobsError ? (
                <div className="flex flex-col items-center justify-center h-full py-16 px-6">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-red-600 font-semibold text-base mb-1">Error al cargar ofertas</p>
                  <p className="text-sm text-slate-600 text-center">Por favor, intenta recargar la página</p>
                </div>
              ) : jobPosts && jobPosts.length > 0 ? (
                <div className="p-3">
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
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <FileText className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-900 text-lg mb-2">No hay ofertas publicadas</p>
                  <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                    Comienza publicando tu primera oferta de empleo para recibir postulaciones
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="lg:col-span-2 bg-white h-full border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100 py-5 px-6 bg-emerald-400">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-bold text-slate-900">Postulantes</CardTitle>
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center">
                      {applicants?.length || 0}
                    </div>
                  </div>
                  
                  {selectedJob ? (
                    <div>
                      <p className="text-sm text-white">{selectedJob.title}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-white">Selecciona una oferta para ver los postulantes</p>
                  )}
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              {isLoadingApplicants ? (
                <div className="flex flex-col justify-center items-center h-full py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-slate-600">Cargando postulantes...</p>
                </div>
              ) : applicantsError ? (
                <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-red-600 font-semibold mb-1">Error al cargar postulantes</p>
                  <p className="text-sm text-slate-600">Por favor, intenta nuevamente</p>
                </div>
              ) : applicants && applicants.length > 0 ? (
                <div className="p-4 space-y-3">
                  {applicants.map((app) => (
                    <div
                      key={app.id}
                      className="group relative flex items-center gap-4 p-5 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md bg-white transition-all duration-200"
                    >
                      <Link
                        href={`/employer/applicants/${app.applicant.profile_id}`}
                        className="flex items-center gap-4 flex-grow cursor-pointer min-w-0"
                      >
                        <div className="relative w-14 h-14 rounded-full flex-shrink-0 ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all duration-200">
                          <img
                            src={app.applicant.profile_picture || "/profile_placeholder.png"}
                            alt={app.applicant.first_name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-base mb-0.5">
                            {app.applicant.first_name} {app.applicant.last_name}
                          </p>
                          <p className="text-sm text-slate-500 truncate">{app.applicant.email}</p>
                        </div>
                      </Link>

                      {app.applicant.resume_url && (
                        <a
                          href={app.applicant.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group/resume"
                        >
                          <FileText className="h-4 w-4 text-slate-600 group-hover/resume:text-slate-900" />
                          <span className="text-sm font-medium text-slate-700 group-hover/resume:text-slate-900">
                            CV
                          </span>
                        </a>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatusVariant(app.status)}
                          className={clsx(
                            "capitalize font-medium px-3 py-1.5 text-xs",
                            app.status === "Postulado" && "bg-emerald-500 hover:bg-emerald-600 text-white",
                          )}
                        >
                          {app.status}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <MoreHorizontal className="h-5 w-5 text-slate-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(app.id, "Aceptado")}
                              className="cursor-pointer"
                            >
                              <Check className="mr-2 h-4 w-4 text-emerald-600" />
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
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                  <p className="font-semibold text-slate-900 mb-2 text-lg">No hay postulantes todavía</p>
                  <p className="text-sm text-slate-600 max-w-md leading-relaxed">
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
  )
}

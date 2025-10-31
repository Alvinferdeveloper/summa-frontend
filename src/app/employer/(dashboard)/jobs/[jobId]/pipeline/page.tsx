"use client"

import { useAllJobApplicants } from "../../hooks/useAllJobApplicants"
import KanbanBoard from "./components/KanbanBoard"
import { Loader2, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"

export default function PipelinePage() {
  const { jobId } = useParams() as { jobId: string }
  const { data: applications, isLoading, error } = useAllJobApplicants(jobId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 p-8"
      >
        <p className="text-lg font-semibold">Error al cargar los postulantes</p>
        <p className="text-sm mt-2">{error.message}</p>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br shadow-md from-slate-50 to-slate-100/50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 border-b bg-white/80 backdrop-blur-sm shadow-sm bg-gradient-to-br from-primary/80 via-primary/60 to-primary"
      >
        <div className="flex justify-between items-center max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-accent">Pipeline de Contratación</h1>
              <p className="text-sm text-accent mt-0.5">{applications?.length || 0} candidatos en proceso</p>
            </div>
          </div>
          <Link href={`/employer/jobs`}>
            <Button className="gap-2 bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Volver a la Lista
            </Button>
          </Link>
        </div>
      </motion.div>
      <div className="flex-grow overflow-hidden">
        <KanbanBoard applications={applications || []} jobId={jobId} />
      </div>
    </div>
  )
}

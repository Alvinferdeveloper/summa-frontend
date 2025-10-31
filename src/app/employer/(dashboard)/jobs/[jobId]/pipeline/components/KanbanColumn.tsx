"use client"

import { SortableContext } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import ApplicantKanbanCard from "./ApplicantKanbanCard"
import type { JobApplication } from "../../../types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMemo } from "react"
import { FileText, Eye, Video, Gift, CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface KanbanColumnProps {
  status: string
  applications: JobApplication[]
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: any; gradient: string }> = {
  Postulado: {
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    icon: FileText,
    gradient: "from-slate-500 to-slate-600",
  },
  "En revisión": {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Eye,
    gradient: "from-blue-500 to-blue-600",
  },
  Entrevista: {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    icon: Video,
    gradient: "from-purple-500 to-purple-600",
  },
  Oferta: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Gift,
    gradient: "from-amber-500 to-amber-600",
  },
  Contratado: {
    color: "text-green-700",
    bgColor: "bg-green-50",
    icon: CheckCircle2,
    gradient: "from-green-500 to-green-600",
  },
  Rechazado: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
  },
}

export default function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const applicationIds = useMemo(() => applications.map((app) => app.id), [applications])

  const config = statusConfig[status] || statusConfig["Postulado"]
  const Icon = config.icon

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`w-80 rounded-xl flex min-h-[calc(100vh-15rem)] flex-col flex-shrink-0 shadow-md transition-all duration-300 ${
        isOver ? "ring-2 ring-blue-400 shadow-xl scale-[1.02]" : ""
      }`}
    >
      <div className={`${config.bgColor} rounded-t-xl border-b-2 border-white/50`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${config.color}`}>{status}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {applications.length} {applications.length === 1 ? "candidato" : "candidatos"}
                </p>
              </div>
            </div>

            <motion.div
              key={applications.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center ${config.color} font-bold text-sm`}
            >
              {applications.length}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-gradient-to-b from-slate-50/50 to-white rounded-b-xl overflow-hidden">
        <ScrollArea className="h-full">
          <SortableContext items={applicationIds}>
            <div
              ref={setNodeRef}
              className={`min-h-[200px] p-3 transition-colors duration-300 ${isOver ? "bg-blue-50/50" : ""}`}
            >
              {applications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 text-slate-400"
                >
                  <Icon className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-sm font-medium">Sin candidatos</p>
                  <p className="text-xs mt-1">Arrastra aquí para cambiar estado</p>
                </motion.div>
              ) : (
                applications.map((app) => <ApplicantKanbanCard key={app.id} application={app} />)
              )}
            </div>
          </SortableContext>
        </ScrollArea>
      </div>
    </motion.div>
  )
}

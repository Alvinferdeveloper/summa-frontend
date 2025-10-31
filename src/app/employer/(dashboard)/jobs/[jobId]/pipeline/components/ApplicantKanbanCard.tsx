"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle2, Mail, GripVertical } from "lucide-react"
import type { JobApplication } from "../../../types"
import { motion } from "framer-motion"

interface ApplicantKanbanCardProps {
  application: JobApplication
}

export default function ApplicantKanbanCard({ application }: ApplicantKanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application.id,
    data: {
      application,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${isDragging ? "opacity-40" : "opacity-100"}`}
      >
        <Card
          className="mb-3 shadow-sm hover:shadow-lg transition-all duration-300 border-slate-200 bg-white overflow-hidden group cursor-grab active:cursor-grabbing"
          {...listeners}
        >
          <CardContent className="p-0">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="mt-1 text-slate-400 hover:text-slate-600 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ring-2 ring-white shadow-md">
                      <img
                        src={application.applicant.profile_picture_url || "/profile_placeholder.png"}
                        alt={application.applicant.first_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    {`${application.applicant.first_name} ${application.applicant.last_name}`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Postulado hace X días</p>
                  <div className="flex flex-col gap-1 mt-3">
                    {application.applicant.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{application.applicant.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Candidato activo
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

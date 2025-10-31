"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, closestCorners, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import KanbanColumn from "./KanbanColumn"
import ApplicantKanbanCard from "./ApplicantKanbanCard"
import type { JobApplication } from "../../../types"
import { useUpdateApplicationStatus } from "../../../hooks/useApplicationMutations"
import { arrayMove } from "@dnd-kit/sortable"
import { motion } from "framer-motion"

interface KanbanBoardProps {
  applications: JobApplication[]
  jobId: string
}

const statuses = ["Postulado", "En revisión", "Entrevista", "Oferta", "Contratado", "Rechazado"]

export default function KanbanBoard({ applications, jobId }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Record<string, JobApplication[]>>({})
  const [activeApplication, setActiveApplication] = useState<JobApplication | null>(null)
  const { mutate: updateStatus } = useUpdateApplicationStatus(jobId)

  useEffect(() => {
    const newColumns: Record<string, JobApplication[]> = {}
    statuses.forEach((status) => {
      newColumns[status] = applications.filter((app) => app.status === status)
    })
    setColumns(newColumns)
  }, [applications])

  const findContainer = (id: string | number) => {
    if (id in columns) {
      return id
    }
    return Object.keys(columns).find((key) => columns[key].find((item) => item.id === id))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeContainer = findContainer(active.id)
    if (activeContainer) {
      console.log(activeContainer)
      const app = columns[activeContainer].find((item) => item.id === active.id)
      setActiveApplication(app || null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveApplication(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer) return

    if (activeContainer === overContainer) {
      const items = columns[activeContainer]
      const oldIndex = items.findIndex((item) => item.id === activeId)
      const newIndex = items.findIndex((item) => item.id === overId)

      if (oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], oldIndex, newIndex),
        }))
      }
    } else {
      const activeItems = columns[activeContainer]
      const overItems = columns[overContainer]
      const activeIndex = activeItems.findIndex((item) => item.id === activeId)
      const overIndex = over.data.current?.sortable ? over.data.current.sortable.index : 0

      const [movedItem] = activeItems.splice(activeIndex, 1)
      overItems.splice(overIndex, 0, movedItem)

      setColumns((prev) => ({
        ...prev,
        [activeContainer]: [...activeItems],
        [overContainer]: [...overItems],
      }))

      updateStatus({ applicationId: Number(activeId), status: overContainer as string })
    }
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-4 p-6 overflow-x-auto h-full max-w-[1800px] mx-auto"
      >
        {statuses.map((status, index) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <KanbanColumn status={status} applications={columns[status] || []} />
          </motion.div>
        ))}
      </motion.div>

      <DragOverlay>
        {activeApplication ? (
          <div className="rotate-3 scale-105">
            <ApplicantKanbanCard application={activeApplication} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

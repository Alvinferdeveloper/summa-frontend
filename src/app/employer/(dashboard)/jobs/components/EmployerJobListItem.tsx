"use client"

import { Briefcase, Edit, MapPin, Users } from "lucide-react"
import type { EmployerJobPostsResponse } from "../../hooks/useEmployerJobPosts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUpdateJobPostStatus } from "../../hooks/useUpdateJobPostStatus"
import clsx from "clsx"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmployerJobListItemProps {
  job: EmployerJobPostsResponse
  isActive: boolean
  onClick: () => void
}

export default function EmployerJobListItem({ job, isActive, onClick }: EmployerJobListItemProps) {
  const { mutate: updateStatus, isPending } = useUpdateJobPostStatus();

  const handleStatusChange = (checked: boolean) => {
    const newStatus = checked ? 'open' : 'closed';
    updateStatus({ jobId: job.id.toString(), status: newStatus });
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 border-b cursor-pointer transition-all duration-200 ${isActive
        ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-sm"
        : "hover:bg-gray-50 hover:shadow-sm border-l-4 border-l-transparent"
        }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow min-w-0">
          <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${isActive ? "text-blue-700" : "text-gray-900"}`}>
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
              <Briefcase className="h-3.5 w-3.5" />
              {job.work_model.name}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div
            className={`flex items-center justify-center gap-2 rounded-lg px-2 py-1 ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
              }`}
          >
            <Users className="h-4 w-4" />
            <span className="font-bold text-lg">{job.applicant_count}</span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1.5 font-medium">Postulantes</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Switch
            id={`status-${job.id}`}
            checked={job.status === 'open'}
            onCheckedChange={handleStatusChange}
            disabled={isPending}
          />
          <Label htmlFor={`status-${job.id}`} className={clsx("font-medium", job.status === 'open' ? "text-green-600" : "text-red-600")}>
            {job.status === 'open' ? "Abierta" : "Cerrada"}
          </Label>
        </div>
        <Link href={`/employer/jobs/edit/${job.id}`}>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

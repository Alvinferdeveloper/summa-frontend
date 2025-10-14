"use client"

import { Briefcase, MapPin, Users } from "lucide-react"
import type { EmployerJobPostsResponse } from "../../hooks/useEmployerJobPosts"

interface EmployerJobListItemProps {
  job: EmployerJobPostsResponse
  isActive: boolean
  onClick: () => void
}

export default function EmployerJobListItem({ job, isActive, onClick }: EmployerJobListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-5 border-b cursor-pointer transition-all duration-200 ${
        isActive
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
              {job.contract_type}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div
            className={`flex items-center justify-center gap-2  rounded-lg ${
              isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-bold text-lg">{job.applicant_count}</span>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1.5 font-medium">Postulantes</p>
        </div>
      </div>
    </div>
  )
}

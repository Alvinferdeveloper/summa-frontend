
'use client';

import { useState } from 'react';
import { useMyApplications, InterviewDetails } from '../hooks/useMyApplications';
import ApplicationCard from './ApplicationCard';
import { Loader2, Heart } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";

interface ApplicationListProps {
  status: string;
  onRespondToInterview: (interview: InterviewDetails) => void;
}

const APPLICATIONS_PER_PAGE = 9;

export default function ApplicationList({ status, onRespondToInterview }: ApplicationListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: response, status: queryStatus, error } = useMyApplications(status, currentPage, APPLICATIONS_PER_PAGE);

  const applications = response?.data || [];
  const totalPages = Math.ceil((response?.total || 0) / APPLICATIONS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (queryStatus === 'pending') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (queryStatus === 'error') {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg mt-6">
        <Heart className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No hay postulaciones en esta categoría.</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onRespondToInterview={onRespondToInterview}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

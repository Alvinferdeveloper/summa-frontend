'use client';

import { useState, useEffect } from 'react';
import { useInfiniteQuery, type QueryFunctionContext, type InfiniteData } from '@tanstack/react-query';
import api from '@/lib/api';
import JobListItem, { Job } from './components/JobListItem';
import JobDetails from './components/JobDetails';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobsApiResponse {
  data: Job[];
  next_page: boolean;
  page: number;
}

const fetchJobs = async (
  { pageParam }: QueryFunctionContext<['jobs'], number>
): Promise<JobsApiResponse> => {
  const page = pageParam ?? 1;
  const response = await api.get<JobsApiResponse>(`/v1/jobs?page=${page}&limit=12`);
  return response.data;
};

export default function JobsPage() {
  const { ref, inView } = useInView();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<JobsApiResponse, Error, InfiniteData<JobsApiResponse, number>, ['jobs'], number>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) => {
      if (lastPage?.next_page) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (!selectedJob && data?.pages[0]?.data[0]) {
      setSelectedJob(data.pages[0].data[0]);
    }
  }, [data, selectedJob]);

  return (
    <div className="h-[calc(100vh-6rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Job List */}
      <div className=" rounded-lg">
        <ScrollArea className="h-full">
          {status === 'pending' ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : status === 'error' ? (
            <div className="p-4 text-center text-red-500">Error: {error.message}</div>
          ) : (
            <div>
              {data.pages.map((page) =>
                page.data.map((job) => (
                  <JobListItem
                    key={job.ID}
                    job={job}
                    isActive={selectedJob?.ID === job.ID}
                    onClick={() => setSelectedJob(job)}
                  />
                ))
              )}
              <div ref={ref} className="flex justify-center items-center h-24">
                {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                {!hasNextPage && data.pages.length > 0 && <p className="text-sm text-muted-foreground">No hay más empleos</p>}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Column: Job Details */}
      <div className="hidden lg:block lg:col-span-2">
        <JobDetails job={selectedJob} />
      </div>
    </div>
  );
}

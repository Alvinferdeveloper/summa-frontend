
import api from '@/lib/api';
import { Job } from '../components/JobListItem';
import JobDetails from '../components/JobDetails';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function JobDetailPage({ params, searchParams }: PageProps) {
  const { id } = params;
  const { data } = await api.get(`/v1/jobs/${id}`);
  const isAppliable = searchParams.isAppliable === 'true';

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <JobDetails job={data} isAppliable={isAppliable || false} />
    </div>
  );
}

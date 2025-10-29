
import apiServer from '@/lib/apiServer';
import JobDetails from '../components/JobDetails';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JobDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { isAppliable } = await searchParams;
  const { data } = await apiServer.get(`/v1/jobs/${id}`);
  const appliable = isAppliable === 'true';

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <JobDetails job={data} isAppliable={appliable || false} />
    </div>
  );
}

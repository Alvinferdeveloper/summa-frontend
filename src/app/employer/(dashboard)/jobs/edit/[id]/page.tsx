'use client';

import { useJobPost } from '../../hooks/useJobPost';
import { Loader2 } from 'lucide-react';
import React from 'react';
import EditJobForm from '../components/EditJobForm';
import { useParams } from 'next/navigation';

export default function EditJobPage() {
  const params = useParams();
  const { data: jobPost, isLoading: isLoadingJobPost } = useJobPost(params.id as string);

  if (isLoadingJobPost) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!jobPost) {
    return <div>Oferta de empleo no encontrada.</div>;
  }

  return <EditJobForm jobPost={jobPost} />;
}


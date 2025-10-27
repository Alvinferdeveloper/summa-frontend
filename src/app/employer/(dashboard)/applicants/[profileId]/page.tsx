
"use client"
import { useCandidateProfileForEmployer } from '../../dashboard/hooks/useCandidateProfileForEmployer';
import {
  Loader2,
} from 'lucide-react';
import CandidateProfile from '../../components/CandidateProfile';
import { useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";

export default function CandidateProfileForEmployerPage() {
  const params = useParams();
  const { profileId } = params as { profileId: string };
  const { data: profile, isLoading, error } = useCandidateProfileForEmployer(profileId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-center text-destructive font-medium">Error al cargar el perfil del candidato: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12 text-muted-foreground">Perfil no encontrado.</div>;
  }

  return (
    <CandidateProfile profile={profile} />
  );
}

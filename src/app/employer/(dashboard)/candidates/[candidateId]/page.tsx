"use client"
import CandidateProfile from "@/app/employer/(dashboard)/components/CandidateProfile";
import { useCandidateProfileForEmployer } from "../../dashboard/hooks/useCandidateProfileForEmployer";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CandidatePage() {
    const params = useParams();
    const { candidateId } = params as { candidateId: string };
    const { data: profile, isLoading, error } = useCandidateProfileForEmployer(candidateId);
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
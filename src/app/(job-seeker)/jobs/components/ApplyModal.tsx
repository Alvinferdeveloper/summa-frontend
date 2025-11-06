
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplyToJob } from '../hooks/useApplyToJob';
import { Job } from './JobListItem';
import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useCoverLetterAssistant } from "../hooks/useCoverLetterAssistant";
import { useSession } from "next-auth/react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function ApplyModal({ isOpen, onClose, job }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const { mutate, isPending } = useApplyToJob();
  const {data: session} = useSession()
  const { generatedCoverLetter, runAssistant, isLoading: isGenerating, setGeneratedCoverLetter } = useCoverLetterAssistant();

  useEffect(() => {
    if (generatedCoverLetter) {
      setCoverLetter(generatedCoverLetter);
    }
  }, [generatedCoverLetter]);

  useEffect(() => {
    if (!isOpen) {
      setCoverLetter('');
      setGeneratedCoverLetter('');
    }
  }, [isOpen, setGeneratedCoverLetter]);

  const handleGenerateClick = () => {
    if (!job) return;
    runAssistant({ job });
  };

  const handleSubmit = () => {
    if (!job) return;
    mutate({ jobId: job.id, cover_letter: coverLetter }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postular a: {job.title}</DialogTitle>
          <DialogDescription>
            Estás a punto de postular a este empleo en {job.employer.company_name}. Puedes añadir una carta de presentación (opcional).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="cover-letter">Carta de Presentación</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-2 text-xs cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generar con IA
            </Button>
          </div>
          <Textarea
            id="cover-letter"
            placeholder="Escribe un mensaje para el reclutador o deja que nuestra IA lo haga por ti..."
            rows={8}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="border-primary"
            disabled={isGenerating}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isPending || isGenerating} className="cursor-pointer">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
            ) : (
              'Confirmar Postulación'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

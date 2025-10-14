
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApplyToJob } from '../hooks/useApplyToJob';
import { Job } from './JobListItem';
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

export default function ApplyModal({ isOpen, onClose, job }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const { mutate, isPending } = useApplyToJob();

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
          <Label htmlFor="cover-letter">Carta de Presentación</Label>
          <Textarea
            id="cover-letter"
            placeholder="Escribe un mensaje para el reclutador..."
            rows={6}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
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


'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useCvAssistant } from '../hooks/useCvAssistant';

interface AiRewriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newText: string) => void;
  title: string;
  description: string;
}

export default function AiRewriteModal({ isOpen, onClose, onConfirm, title, description }: AiRewriteModalProps) {
  const [informalText, setInformalText] = useState('');
  const { result, setResult, runAssistant, isLoading } = useCvAssistant();

  useEffect(() => {
    if (result && !isLoading) {
      onConfirm(result);
      handleClose();
    }
  }, [result, isLoading]);

  const handleRewrite = () => {
    runAssistant({
      task: 'rewrite-description',
      context: { informalText },
    });
  };

  const handleClose = () => {
    setInformalText('');
    setResult('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Escribe aquí de forma sencilla lo que hiciste..."
            className='border-primary'
            value={informalText}
            onChange={(e) => setInformalText(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" className='cursor-pointer' onClick={handleClose} disabled={isLoading}>Cancelar</Button>
          <Button className='cursor-pointer' onClick={handleRewrite} disabled={isLoading || !informalText}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Reescribir con IA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

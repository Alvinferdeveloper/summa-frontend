
'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWebSpeechSearch } from '@/app/hooks/useWebSpeechSearch';
import { Loader2, Mic, MicOff } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (transcription: string) => void;
  isProcessing: boolean;
}

export default function VoiceSearchModal({ isOpen, onClose, onApplyFilters, isProcessing }: VoiceSearchModalProps) {
  const { isListening, transcript, startListening, stopListening, hasSupport } = useWebSpeechSearch();

  useEffect(() => {
    if (isOpen && hasSupport) {
      startListening();
    }
  }, [isOpen, hasSupport]);

  const handleApply = () => {
    stopListening();
    onApplyFilters(transcript);
  };

  const handleClose = () => {
    stopListening();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" /> Búsqueda por Voz
          </DialogTitle>
          <DialogDescription>
            {isListening ? "Estoy escuchando... Habla ahora." : "Presiona el botón para volver a intentarlo."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 px-2 min-h-[100px] text-center flex items-center justify-center bg-muted/50 rounded-md">
          {transcript ? (
            <p className="text-lg font-medium">{transcript}</p>
          ) : (
            <p className="text-muted-foreground">Di algo como: "Buscar empleos de diseño en remoto"</p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <Button 
            variant={isListening ? "destructive" : "outline"}
            onClick={isListening ? stopListening : startListening}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Dejar de escuchar' : 'Empezar a escuchar'}
          </Button>
          <Button onClick={handleApply} disabled={!transcript || isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

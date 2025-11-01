'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Pause, Volume2 } from 'lucide-react';
import { useJobExplanation } from '@/app/(job-seeker)/jobs/hooks/useJobExplanation';

interface JobExplainerProps {
  jobDescription: string;
}

export default function JobExplainer({ jobDescription }: JobExplainerProps) {
  const { explanation, getExplanation, isLoading } = useJobExplanation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // stop speaking when component unmounts
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleExplainClick = () => {
    // if the speech is speaking, cancel any voice before generating a new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    getExplanation(jobDescription);
  };

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (explanation) {
      // cancel any voice that might have been left
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.lang = 'es-ES';
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.error('Speech synthesis error:', e.error);
        }
        setIsSpeaking(false);
      };

      // save the reference to prevent garbage collection
      utteranceRef.current = utterance;
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <Button onClick={handleExplainClick} disabled={isLoading} className="w-full mb-4 cursor-pointer">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Explicar con IA
      </Button>

      {explanation && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Explicación Simplificada</h3>
            <Button onClick={handleTextToSpeech} className='bg-accent hover:bg-accent/80 cursor-pointer' size="icon" disabled={isLoading}>
              {isSpeaking ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}
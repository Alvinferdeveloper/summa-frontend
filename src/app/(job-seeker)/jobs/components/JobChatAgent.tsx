'use client';

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Volume2, Loader2 } from 'lucide-react';
import { useWebSpeechSearch } from '@/app/hooks/useWebSpeechSearch';
import { useEffect, useState } from 'react';
import { DefaultChatTransport } from 'ai';

interface JobChatAgentProps {
  onFiltersApplied: (filters: any) => void;
}

export default function JobChatAgent({ onFiltersApplied }: JobChatAgentProps) {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/job-agent', }),
    onToolCall: ({ toolCall }) => {
      if (toolCall.toolName === 'searchJobs') {
        onFiltersApplied(toolCall.input);
      }
    },
  });
  const [input, setInput] = useState('');
  const { isListening, transcript, startListening, stopListening } = useWebSpeechSearch();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  const handleVoiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    stopListening();
    handleSubmit(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() !== '') {
      sendMessage({ text: input.trim() });
      setInput('');
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };


  return (
    <div className="flex flex-col h-full bg-card">
      <ScrollArea className="flex-1 p-4 overflow-scroll">
        <div className="space-y-4">
          {messages.map((m, index) => (
            <div key={index} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-lg ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {m.role !== 'user' && (
                  m.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return (
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-bold">Asistente Summa</p>
                          <Button variant="ghost" size="icon" onClick={() => handleTextToSpeech(part.text)} className="h-6 w-6">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    }
                  })
                )}
                {
                  m.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return (
                        <p key={partIndex} className="whitespace-pre-wrap">{part.text}</p>
                      )
                    }
                  })
                }
              </div>
            </div>
          ))}
          {status === "streaming" && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-muted flex items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={isListening ? handleVoiceSubmit : handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Escuchando...' : 'Pide un nuevo filtro o haz una nueva búsqueda...'}
            className="flex-1"
            disabled={status === "streaming"}
          />
          <Button type="button" variant={isListening ? "destructive" : "outline"} onClick={isListening ? stopListening : startListening} disabled={status === "streaming"}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" disabled={status === "streaming" || !input}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
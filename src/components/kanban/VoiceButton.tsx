'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processVoiceTask } from '@/app/actions/voice';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function VoiceButton({ workspaceId }: { workspaceId: string }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await handleAudioSubmission(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Timeout máximo de 60 segundos
      timerRef.current = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
          toast.info("Grabación detenida automáticamente (límite de 60s).");
        }
      }, 60000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const handleAudioSubmission = async (blob: Blob) => {
    setIsProcessing(true);
    toast.loading("Procesando tarea con IA...", { id: 'ai-processing' });

    try {
      const formData = new FormData();
      // Ojo: whisper necesita una extensión de archivo válida como .webm o .mp3
      formData.append('audio', blob, 'audio.webm');
      
      const res = await processVoiceTask(formData, workspaceId);

      if (res.success) {
        toast.success(`Tarea agregada: ${res.task?.title}`, { id: 'ai-processing' });
        // Invalidar caché para que React Query recargue el tablero
        queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId] });
      } else {
        toast.error("Error al procesar la tarea: " + res.error, { id: 'ai-processing' });
      }
    } catch (err: any) {
      toast.error("Error de conexión con la IA.", { id: 'ai-processing' });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar form submission si está dentro de un form
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (isProcessing) {
    return (
      <Button type="button" size="sm" variant="secondary" className="h-8 px-2" disabled>
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      </Button>
    );
  }

  return (
    <Button 
      type="button" 
      size="sm" 
      variant={isRecording ? "destructive" : "secondary"} 
      className={`h-8 px-2 transition-all ${isRecording ? 'animate-pulse ring-2 ring-red-500' : ''}`}
      onClick={toggleRecording}
      title={isRecording ? "Detener grabación" : "Dictar tarea con IA"}
    >
      {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4 text-gray-600" />}
    </Button>
  );
}

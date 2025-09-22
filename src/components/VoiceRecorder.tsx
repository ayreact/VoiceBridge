import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isProcessing?: boolean;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isProcessing = false,
  className,
}) => {
  const { isRecording, duration, error, toggleRecording } = useVoiceRecording({
    onRecordingComplete,
    maxDuration: 60,
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("p-6 text-center space-y-4", className)}>
      <div className="relative">
        <Button
          variant="voice"
          size="xl"
          onClick={toggleRecording}
          disabled={isProcessing}
          data-recording={isRecording}
          className={cn(
            "w-24 h-24 rounded-full transition-all duration-300",
            isRecording && "voice-recording"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        
        {isRecording && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-voice-active text-white px-3 py-1 rounded-full text-sm font-medium">
              {formatDuration(duration)}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isRecording 
            ? "Recording... Tap to stop" 
            : isProcessing 
            ? "Processing your voice..." 
            : "Tap to start recording"
          }
        </p>
        
        {error && (
          <p className="text-sm text-destructive font-medium">
            {error}
          </p>
        )}
        
        {!isRecording && !isProcessing && (
          <p className="text-xs text-muted-foreground">
            Maximum recording time: 60 seconds
          </p>
        )}
      </div>
    </Card>
  );
};
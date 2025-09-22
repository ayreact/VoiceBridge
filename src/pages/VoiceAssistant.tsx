import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LanguageSelector, Language } from '@/components/LanguageSelector';
import { Send, MessageSquare, Mic2, Heart, BookOpen, DollarSign, Music } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AssistantResponse {
  text: string;
  audio_url?: string;
}

export const VoiceAssistant: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [textQuery, setTextQuery] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const { toast } = useToast();

  const handleVoiceRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setWasVoiceInput(true);
    try {
      // Convert blob to file
      const file = new File([audioBlob], 'voice_recording.webm', {
        type: 'audio/webm;codecs=opus'
      });
      console.log(file.name, file.type, file.size);

      const result = await api.voiceUpload(file, language);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setResponse({
        text: result.response || result.text || 'Response received',
        audio_url: result.audio_url
      });

      toast({
        title: "Voice processed successfully",
        description: "Your voice message has been understood",
      });
    } catch (error: any) {
      console.error('Voice processing error:', error);
      toast({
        title: "Voice processing failed",
        description: error.message || "Could not process your voice message",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextQuery = async () => {
    if (!textQuery.trim()) return;

    setIsProcessing(true);
    setWasVoiceInput(false);
    try {
      const result = await api.textQuery(textQuery.trim(), language);
      
      if ('error' in result && result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        setResponse({
          text: result.data.response || 'Response received',
          audio_url: result.data.audio_url
        });

        toast({
          title: "Query processed successfully",
          description: "Your question has been answered",
        });
      }
    } catch (error: any) {
      console.error('Text query error:', error);
      toast({
        title: "Query failed",
        description: error.message || "Could not process your question",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setTextQuery('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-merriweather font-bold text-gradient mb-4">
          VoiceBridge Assistant
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Your multilingual AI assistant for education, healthcare, finance, and entertainment
        </p>
        
        {/* Language Selector */}
        <div className="max-w-xs mx-auto">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            className="w-full"
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={mode === 'voice' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('voice')}
            className="flex items-center gap-2"
          >
            <Mic2 className="h-4 w-4" />
            Voice
          </Button>
          <Button
            variant={mode === 'text' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('text')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Text
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {mode === 'voice' ? (
                  <>
                    <Mic2 className="h-5 w-5" />
                    Voice Input
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    Text Input
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mode === 'voice' ? (
                <VoiceRecorder
                  onRecordingComplete={handleVoiceRecording}
                  isProcessing={isProcessing}
                />
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your question here..."
                    value={textQuery}
                    onChange={(e) => setTextQuery(e.target.value)}
                    className="min-h-[120px]"
                    disabled={isProcessing}
                  />
                  <Button
                    onClick={handleTextQuery}
                    disabled={!textQuery.trim() || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Send Query'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assistant Response</CardTitle>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {response.text}
                    </p>
                  </div>
                  
                {response.audio_url && (
                  <AudioPlayer 
                    audioUrl={response.audio_url}
                    title="Voice Response"
                    shouldAutoplay={wasVoiceInput}
                  />
                )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {mode === 'voice' 
                      ? 'Record a voice message to get started'
                      : 'Type your question to get an answer'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Assistants */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Or try our specialized assistants:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              size="lg"
              className="flex flex-col items-center gap-2 h-auto py-4"
              asChild
            >
              <a href="/assistant/health">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-medium">Health</span>
                <span className="text-xs text-muted-foreground">Medical advice & wellness</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex flex-col items-center gap-2 h-auto py-4"
              asChild
            >
              <a href="/assistant/education">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Education</span>
                <span className="text-xs text-muted-foreground">Learning & study help</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex flex-col items-center gap-2 h-auto py-4"
              asChild
            >
              <a href="/assistant/finance">
                <DollarSign className="h-6 w-6 text-green-500" />
                <span className="font-medium">Finance</span>
                <span className="text-xs text-muted-foreground">Money management</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex flex-col items-center gap-2 h-auto py-4"
              asChild
            >
              <a href="/assistant/entertainment">
                <Music className="h-6 w-6 text-purple-500" />
                <span className="font-medium">Entertainment</span>
                <span className="text-xs text-muted-foreground">Stories & culture</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Or try these examples:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Health symptoms and remedies",
              "Educational topics and lessons", 
              "Financial literacy and banking",
              "Entertainment and local stories"
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  if (mode === 'text') {
                    const queries = [
                      "What are common symptoms of malaria and how can I treat it naturally?",
                      "Can you teach me basic mathematics for primary school students?",
                      "How do I create a budget and save money effectively?",
                      "Tell me a traditional Yoruba folktale about wisdom and courage"
                    ];
                    setTextQuery(queries[index]);
                  } else {
                    // For voice mode, show toast to guide user
                    toast({
                      title: "Voice Mode Active",
                      description: `Tap the record button and ask: "${example.toLowerCase()}"`,
                    });
                  }
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
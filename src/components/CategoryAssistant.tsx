import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { AudioPlayer } from '@/components/AudioPlayer';
import { LanguageSelector, Language } from '@/components/LanguageSelector';
import { Send, MessageSquare, Mic2, Heart, BookOpen, DollarSign, Music, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface AssistantResponse {
  query: string;
  response: string;
  audio_url?: string;
  uploaded_input_audio_url?: string;
}

interface CategoryAssistantProps {
  category: 'health' | 'education' | 'finance' | 'entertainment';
}

const categoryConfig = {
  health: {
    title: 'Health Assistant',
    description: 'Get medical advice, health tips, and wellness guidance',
    icon: Heart,
    color: 'text-red-500',
    examples: [
      'What are symptoms of malaria?',
      'How can I maintain good hygiene?',
      'What foods are good for my health?',
      'How do I treat a common cold?'
    ]
  },
  education: {
    title: 'Education Assistant', 
    description: 'Learn about various subjects and get study help',
    icon: BookOpen,
    color: 'text-blue-500',
    examples: [
      'Teach me basic mathematics',
      'What is photosynthesis?',
      'Help me learn English grammar',
      'Explain Nigerian history'
    ]
  },
  finance: {
    title: 'Finance Assistant',
    description: 'Get financial literacy and money management advice',
    icon: DollarSign,
    color: 'text-green-500',
    examples: [
      'How do I create a budget?',
      'What is compound interest?',
      'How can I save money?',
      'Explain mobile banking'
    ]
  },
  entertainment: {
    title: 'Entertainment Assistant',
    description: 'Enjoy stories, music, and cultural content',
    icon: Music,
    color: 'text-purple-500',
    examples: [
      'Tell me a Yoruba folktale',
      'What are traditional Igbo songs?',
      'Share a funny story',
      'Teach me a local proverb'
    ]
  }
};

export const CategoryAssistant: React.FC<CategoryAssistantProps> = ({ category }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [textQuery, setTextQuery] = useState('');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const { toast } = useToast();

  const config = categoryConfig[category];
  const Icon = config.icon;

  const handleVoiceRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setWasVoiceInput(true);
    try {
      const file = new File([audioBlob], 'voice_recording.webm', {
        type: 'audio/webm;codecs=opus'
      });

      const result = await api.voiceUpload(file, language, category);
      
      if (result.error) {
        throw new Error(result.error);
      }

      setResponse({
        query: result.query || '[Voice Recording]',
        response: result.response || result.text || 'Response received',
        audio_url: result.audio_url,
        uploaded_input_audio_url: result.uploaded_input_audio_url
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
      const result = await api.textQuery(textQuery.trim(), language, category);
      
      if ('error' in result && result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        setResponse({
          query: result.data.query || textQuery,
          response: result.data.response || 'Response received',
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
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to General Assistant
        </Link>
        
        <div className="text-center mb-8">
          <div className={`flex items-center justify-center gap-3 mb-4`}>
            <Icon className={`h-8 w-8 ${config.color}`} />
            <h1 className="text-4xl font-merriweather font-bold text-gradient">
              {config.title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            {config.description}
          </p>
          
          <div className="max-w-xs mx-auto">
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              className="w-full"
            />
          </div>
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
                    placeholder={`Ask about ${category}...`}
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
                  {response.query && response.query !== '[Voice Recording]' && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-1">Your Question:</p>
                      <p className="text-sm text-foreground">{response.query}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {response.response}
                    </p>
                  </div>
                  
                  {response.audio_url && (
                    <AudioPlayer 
                      audioUrl={response.audio_url}
                      title="Voice Response"
                      shouldAutoplay={wasVoiceInput}
                    />
                  )}

                  {response.uploaded_input_audio_url && (
                    <AudioPlayer 
                      audioUrl={response.uploaded_input_audio_url}
                      title="Your Voice Input"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon className={`h-12 w-12 mx-auto mb-4 opacity-50 ${config.color}`} />
                  <p>
                    {mode === 'voice' 
                      ? `Record a voice message about ${category}`
                      : `Type your ${category} question to get an answer`
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Try asking about:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {config.examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => {
                  if (mode === 'text') {
                    setTextQuery(example);
                  } else {
                    toast({
                      title: "Voice Mode Active",
                      description: `Tap the record button and ask: "${example}"`,
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
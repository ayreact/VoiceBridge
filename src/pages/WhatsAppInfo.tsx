import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Mic, 
  Type, 
  Globe, 
  Smartphone, 
  Volume2, 
  ArrowRight,
  CheckCircle,
  Info,
  QrCode,
  PlusCircle
} from 'lucide-react';

const WHATSAPP_NUMBER = "+1(415)523886";

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
];

const features = [
  {
    title: "Join Sandbox",
    description: "Join the Twilio Sandbox to access VoiceBridge",
    icon: PlusCircle,
    examples: ["Save WhatsApp Number", "Send code 'join pen-willing'", "Get connected to VoiceBridge AI"]
  },
  {
    title: "Voice Messages",
    description: "Send voice notes directly to VoiceBridge",
    icon: Mic,
    examples: ["Record your question", "Get audio response back", "Natural conversation flow"]
  },
  {
    title: "Text Messages", 
    description: "Type your questions for quick responses",
    icon: Type,
    examples: ["Fast text replies", "Copy and share responses", "Great for quick queries"]
  },
];

export const WhatsAppInfo: React.FC = () => {
  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent("join pen-willing");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleAddContact = () => {
    // This creates a vCard that can be downloaded
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:VoiceBridge AI Assistant
TEL:${WHATSAPP_NUMBER}
ORG:VoiceBridge
NOTE:Your multilingual AI assistant for education, healthcare, finance, and entertainment
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'VoiceBridge-Assistant.vcf';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-merriweather font-bold text-gradient mb-4">
            WhatsApp Access
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Chat with VoiceBridge on WhatsApp. Send voice notes or text messages in your preferred language.
          </p>
          
          <div className="bg-card rounded-2xl p-8 shadow-medium max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">WhatsApp Number</span>
            </div>
            <div className="text-3xl font-bold font-mono mb-4 text-green-600">
              {WHATSAPP_NUMBER}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Button
                onClick={handleOpenWhatsApp}
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Open WhatsApp Chat
              </Button>
              <Button
                onClick={handleAddContact}
                variant="outline"
                size="sm"
                className="w-full"
              >
                📱 Add to Contacts
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Available 24/7 • Voice & Text Support
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-merriweather font-bold text-center mb-12">
            How to Use WhatsApp Access
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {feature.examples.map((example) => (
                      <li key={example} className="flex items-center gap-2 items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-success flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Language Support */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Globe className="h-5 w-5 text-primary" />
              Supported Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 max-w-2xl mx-auto">
              {supportedLanguages.map((lang) => (
                <div key={lang.code} className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl mb-2">{lang.flag}</div>
                  <div className="font-medium">{lang.name}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Voice & Text
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6">
              Simply send your message in any of these languages and VoiceBridge will understand and respond appropriately.
            </p>
          </CardContent>  
        </Card>

        {/* Sample Conversations */}
        <div className="mb-16">
          <h2 className="text-3xl font-merriweather font-bold text-center mb-8">
            Sample Conversations
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-green-600" />
                  Voice Message Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-100 p-3 rounded-lg rounded-bl-none">
                    <div className="flex items-center gap-2 mb-1">
                      <Mic className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">Voice message • 0:15</span>
                    </div>
                    <p className="text-sm">"Hello, I need help with my child's math homework in Yoruba"</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-br-none">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary">VoiceBridge response</span>
                    </div>
                    <p className="text-sm">"Mo ti gbo e! I can help with math homework. What grade level and specific topic?"</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-blue-600" />
                  Text Message Example
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-100 p-3 rounded-lg rounded-bl-none">
                    <p className="text-sm">"What are the symptoms of malaria in Hausa?"</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-br-none">
                    <p className="text-sm">"Alamun zazzabin cizon sauro sun hada da: zazzabi, rawan jiki, ciwon kai, da gajiya. Idan kana jin wadannan alamun, ka tafi asibiti nan da nan."</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      (Translation: Malaria symptoms include fever, chills, headache, and fatigue...)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Advantages */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Convenient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Chat anytime, anywhere
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  No app download needed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Works offline (voice notes)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Flexible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Voice or text messages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Share images and media
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Group chat support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-purple-600" />
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Conversation history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Context-aware responses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Private conversations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-primary text-white mb-8">
          <CardContent className="p-8">
            <h2 className="text-3xl font-merriweather font-bold mb-4">
              Start Chatting Now!
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Send a message to VoiceBridge on WhatsApp and experience multilingual AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleOpenWhatsApp}
                size="xl"
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Open WhatsApp
              </Button>
              <span className="text-sm opacity-75">or</span>
              <Link to="/">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                  Try Web Version
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-warning" />
              Tips for Best Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Speak clearly when sending voice messages</li>
              <li>• You can switch languages mid-conversation</li>
              <li>• Use voice messages for complex questions, text for quick queries</li>
              <li>• The AI remembers context within the same conversation</li>
              <li>• Feel free to ask follow-up questions for clarification</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
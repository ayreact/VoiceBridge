import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mic, 
  Clock, 
  Globe, 
  PhoneCall, 
  Volume2, 
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react';

const IVR_NUMBER = "+19126620419";

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
];

const steps = [
  {
    step: 1,
    title: "Dial the Number",
    description: "Call our VoiceBridge number",
    icon: PhoneCall,
  },
  {
    step: 2,
    title: "Wait for Prompt", 
    description: "Listen for the beep and start speaking",
    icon: Volume2,
  },
  {
    step: 3,
    title: "Speak Naturally",
    description: "Ask your question in your chosen language",
    icon: Mic,
  },
];

export const IVRInfo: React.FC = () => {
  const handleCallNow = () => {
    window.location.href = `tel:${IVR_NUMBER}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-merriweather font-bold text-gradient mb-4">
            Phone Access
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access VoiceBridge from any phone, anywhere in Nigeria. No internet required!
          </p>
          
          <div className="bg-card rounded-2xl p-8 shadow-medium max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Call Now</span>
            </div>
            <div className="text-3xl font-bold font-mono mb-4 text-primary">
              {IVR_NUMBER}
            </div>
            <Button
              onClick={handleCallNow}
              size="lg"
              className="w-full mb-4"
              variant="hero"
            >
              <PhoneCall className="h-5 w-5 mr-2" />
              Call VoiceBridge Now
            </Button>
            <p className="text-xs text-muted-foreground">
              Available 24/7
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-merriweather font-bold text-center mb-12">
            How to Use Phone Access
          </h2>
          
          <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-3 max-w-6xl mx-auto">
            {steps.map((step) => (
              <Card key={step.step} className="text-center hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Multilingual Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Speak in your preferred Nigerian language
              </p>
              <div className="space-y-2">
                {supportedLanguages.map((lang) => (
                  <div key={lang.code} className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Always Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                24/7 access to VoiceBridge services
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">No time restrictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Instant responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">No account required</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-secondary-dark" />
                Any Phone Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Works with smartphones and feature phones
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Smartphones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Feature phones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Landlines</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Available */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>What You Can Ask About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Education", icon: "📚", examples: ["School subjects", "Study tips", "Career guidance"] },
                { name: "Healthcare", icon: "🏥", examples: ["Symptoms", "First aid", "Health tips"] },
                { name: "Finance", icon: "💰", examples: ["Banking", "Savings", "Loans"] },
                { name: "Entertainment", icon: "🎭", examples: ["Stories", "News", "Culture"] },
              ].map((topic) => (
                <div key={topic.name} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{topic.icon}</span>
                    <h3 className="font-semibold">{topic.name}</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {topic.examples.map((example) => (
                      <li key={example}>• {example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center bg-gradient-primary text-white">
          <CardContent className="p-8">
            <h2 className="text-3xl font-merriweather font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Call now and experience VoiceBridge's multilingual AI assistant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleCallNow}
                size="xl"
                variant="secondary"
                className="text-primary font-bold"
              >
                <PhoneCall className="h-5 w-5 mr-2" />
                Call {IVR_NUMBER}
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
      </div>
    </div>
  );
};
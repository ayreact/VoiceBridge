import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { api } from '@/lib/api';

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check if we're in offline mode
    const checkOfflineMode = () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      setIsOffline(!baseUrl || baseUrl.trim() === '');
    };

    checkOfflineMode();

    // Listen for online/offline events
    const handleOnline = () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (baseUrl && baseUrl.trim() !== '') {
        setIsOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Badge 
      variant="secondary" 
      className="fixed bottom-4 right-4 z-50 bg-orange-100 text-orange-800 border-orange-200"
    >
      <WifiOff className="h-3 w-3 mr-1" />
      Offline Mode
    </Badge>
  );
};
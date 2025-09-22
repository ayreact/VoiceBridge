import { createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    device_type: 'smartphone' | 'feature-phone';
    language: 'en' | 'yo' | 'ha' | 'ig';
    phone_number?: string;
  };
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Token management utilities
export const getTokens = (): AuthTokens | null => {
  const tokens = localStorage.getItem('voicebridge_tokens');
  return tokens ? JSON.parse(tokens) : null;
};

export const setTokens = (tokens: AuthTokens | null) => {
  if (tokens) {
    localStorage.setItem('voicebridge_tokens', JSON.stringify(tokens));
  } else {
    localStorage.removeItem('voicebridge_tokens');
  }
};

export const getAuthHeaders = (): { Authorization?: string } => {
  const tokens = getTokens();
  return tokens ? { Authorization: `Bearer ${tokens.access}` } : {};
};
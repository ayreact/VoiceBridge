import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContext, AuthContextType, User, AuthTokens, getTokens, setTokens } from '@/lib/auth';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokensState] = useState<AuthTokens | null>(getTokens());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!tokens && !!user;

  // Initialize user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedTokens = getTokens();
      if (storedTokens) {
        try {
          const response = await api.getUserProfile();
          if (response.data) {
            setUser(response.data);
            setTokensState(storedTokens);
          } else {
            // Invalid tokens, clear them
            setTokens(null);
            setTokensState(null);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          setTokens(null);
          setTokensState(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(username, password);
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        const authTokens = { access, refresh };
        
        setTokens(authTokens);
        setTokensState(authTokens);
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: `Logged in as ${userData.username}`,
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || 'Invalid credentials',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.register(username, email, password);
      if (response.data) {
        const { access, refresh, user: userData } = response.data;
        const authTokens = { access, refresh };
        
        setTokens(authTokens);
        setTokensState(authTokens);
        setUser(userData);
        
        toast({
          title: "Welcome to VoiceBridge!",
          description: `Account created successfully for ${userData.username}`,
        });
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || 'Failed to create account',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setTokens(null);
    setTokensState(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const refreshToken = async () => {
    try {
      // This is handled by the API service
      const currentTokens = getTokens();
      setTokensState(currentTokens);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const contextValue: AuthContextType = {
    user,
    tokens,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
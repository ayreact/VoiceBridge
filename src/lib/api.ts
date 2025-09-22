import { getAuthHeaders, getTokens, setTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Mock data for offline mode
const MOCK_USER = {
  id: 'mock-user-1',
  username: 'demo_user',
  email: 'demo@voicebridge.app',
  profile: {
    device_type: 'smartphone' as const,
    language: 'en' as const,
    phone_number: '+1234567890'
  }
};

const MOCK_LESSONS = [
  {
    id: '1',
    title: 'Basic Health and Hygiene',
    body: 'Learn about proper handwashing, dental care, and maintaining good hygiene habits for better health.',
    language: 'en',
    category: 'healthcare',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', 
    title: 'Financial Literacy Basics',
    body: 'Understanding savings, budgeting, and making smart financial decisions for your future.',
    language: 'en',
    category: 'finance',
    created_at: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Primary Education Math',
    body: 'Basic arithmetic, counting, and simple mathematical concepts for young learners.',
    language: 'en', 
    category: 'education',
    created_at: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Local Stories and Culture',
    body: 'Discover traditional stories, cultural practices, and local history.',
    language: 'yo',
    category: 'entertainment', 
    created_at: '2024-01-12T16:45:00Z'
  }
];

// Local storage keys
const STORAGE_KEYS = {
  QUERY_HISTORY: 'voicebridge_query_history',
  USER_PROFILE: 'voicebridge_user_profile',
  LESSONS: 'voicebridge_lessons'
};

// Local storage utilities
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

// Initialize mock data if not exists
const initializeMockData = () => {
  if (!storage.get(STORAGE_KEYS.LESSONS)) {
    storage.set(STORAGE_KEYS.LESSONS, MOCK_LESSONS);
  }
  if (!storage.get(STORAGE_KEYS.QUERY_HISTORY)) {
    storage.set(STORAGE_KEYS.QUERY_HISTORY, []);
  }
  if (!storage.get(STORAGE_KEYS.USER_PROFILE)) {
    storage.set(STORAGE_KEYS.USER_PROFILE, MOCK_USER);
  }
};

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private isOfflineMode: boolean;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.isOfflineMode = !API_BASE_URL || API_BASE_URL.trim() === '';
    
    if (this.isOfflineMode) {
      initializeMockData();
      console.log('🔄 VoiceBridge running in offline mode with local storage');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request
          return this.request(endpoint, options);
        } else {
          // Refresh failed, redirect to login
          setTokens(null);
          window.location.href = '/login';
          return { error: 'Authentication failed' };
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || data.error || 'An error occurred' };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: 'Network error occurred' };
    }
  }

  private async refreshToken(): Promise<boolean> {
    const tokens = getTokens();
    if (!tokens?.refresh) return false;

    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens({ access: data.access, refresh: tokens.refresh });
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Auth endpoints
  async login(username: string, password: string) {
    if (this.isOfflineMode) {
      // Simulate successful login with any credentials
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: { ...MOCK_USER, username }
      };
      return { data: mockTokens };
    }

    return this.request<{ access: string; refresh: string; user: any }>('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username: string, email: string, password: string) {
    if (this.isOfflineMode) {
      // Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
        user: { ...MOCK_USER, username, email }
      };
      storage.set(STORAGE_KEYS.USER_PROFILE, mockTokens.user);
      return { data: mockTokens };
    }

    return this.request<{ access: string; refresh: string; user: any }>('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async getUserProfile() {
    if (this.isOfflineMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const profile = storage.get(STORAGE_KEYS.USER_PROFILE) || MOCK_USER;
      return { data: profile };
    }

    return this.request<any>('/api/user/profile/');
  }

  async updateUserProfile(data: any) {
    if (this.isOfflineMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const currentProfile = storage.get(STORAGE_KEYS.USER_PROFILE) || MOCK_USER;
      const updatedProfile = { ...currentProfile, ...data };
      storage.set(STORAGE_KEYS.USER_PROFILE, updatedProfile);
      return { data: updatedProfile };
    }

    return this.request<any>('/api/user/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async voiceUpload(file: File, language: string, category?: string) {
    if (this.isOfflineMode) {
      // Simulate voice processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponses = [
        { query: 'How can I stay healthy?', response: 'I understand you asked about health. Here are some basic health tips: wash your hands regularly, eat nutritious foods, and get adequate sleep.', category: 'health' },
        { query: 'Tell me about basic mathematics', response: 'For educational content, I recommend starting with basic concepts and building up your knowledge gradually.', category: 'education' },
        { query: 'How do I save money?', response: 'Regarding finance, always budget your money wisely and try to save a portion of your income regularly.', category: 'finance' },
        { query: 'Tell me a story', response: 'Entertainment is important for mental health. Consider traditional stories, music, and cultural activities.', category: 'entertainment' }
      ];
      
      const selectedResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const response = {
        query: selectedResponse.query,
        response: selectedResponse.response,
        audio_url: undefined, // No audio in offline mode
        uploaded_input_audio_url: undefined
      };

      // Save to query history
      const history = storage.get(STORAGE_KEYS.QUERY_HISTORY) || [];
      const newQuery = {
        id: Date.now().toString(),
        query: selectedResponse.query,
        response: selectedResponse.response,
        language,
        category: category || selectedResponse.category,
        timestamp: new Date().toISOString()
      };
      history.unshift(newQuery);
      storage.set(STORAGE_KEYS.QUERY_HISTORY, history.slice(0, 100));

      return response;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    if (category) {
      formData.append('category', category);
    }

    const tokens = getTokens();
    try {
      const response = await fetch(`${this.baseURL}/api/assistant/voice-upload`, {
        method: 'POST',
        headers: tokens ? { Authorization: `Bearer ${tokens.access}` } : {},
        body: formData,
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async textQuery(text: string, language: string, category?: string) {
    if (this.isOfflineMode) {
      // Simulate text query processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple keyword-based responses
      const responses = {
        health: 'For health queries: Regular exercise, balanced diet, adequate sleep, and proper hygiene are essential. Consult healthcare providers for specific medical concerns.',
        education: 'Educational tip: Break down complex topics into smaller parts, practice regularly, ask questions, and use multiple learning methods like reading, listening, and hands-on activities.',
        finance: 'Financial advice: Create a budget, track expenses, save regularly, avoid unnecessary debt, and learn about basic investment principles for long-term wealth building.',
        entertainment: 'For entertainment: Engage with local cultural activities, traditional music, storytelling, games, and community events that bring people together.',
        default: `Thank you for your question about "${text}". In a connected environment, I would provide detailed, personalized responses. For now, I recommend exploring our lessons section for comprehensive information.`
      };

      const queryLower = text.toLowerCase();
      let responseText = responses.default;
      let detectedCategory = category || 'general';
      
      if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('sick') || category === 'health') {
        responseText = responses.health;
        detectedCategory = 'health';
      } else if (queryLower.includes('learn') || queryLower.includes('education') || queryLower.includes('school') || category === 'education') {
        responseText = responses.education;
        detectedCategory = 'education';
      } else if (queryLower.includes('money') || queryLower.includes('finance') || queryLower.includes('bank') || category === 'finance') {
        responseText = responses.finance;
        detectedCategory = 'finance';
      } else if (queryLower.includes('fun') || queryLower.includes('entertainment') || queryLower.includes('story') || category === 'entertainment') {
        responseText = responses.entertainment;
        detectedCategory = 'entertainment';
      }

      const response = { 
        query: text,
        response: responseText, 
        audio_url: undefined 
      };

      // Save to query history
      const history = storage.get(STORAGE_KEYS.QUERY_HISTORY) || [];
      const newQuery = {
        id: Date.now().toString(),
        query: text,
        response: responseText,
        language,
        category: detectedCategory,
        timestamp: new Date().toISOString()
      };
      history.unshift(newQuery);
      storage.set(STORAGE_KEYS.QUERY_HISTORY, history.slice(0, 100));

      return { data: response };
    }

    return this.request<{ query: string; response: string; audio_url?: string }>('/api/assistant/query', {
      method: 'POST',
      body: JSON.stringify({ text, language, category }),
    });
  }

  async getLessons(language?: string, category?: string, searchQuery?: string, page: number = 1) {
    if (this.isOfflineMode) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let lessons = storage.get(STORAGE_KEYS.LESSONS) || MOCK_LESSONS;
      
      // Apply filters
      if (language && language !== 'all') {
        lessons = lessons.filter((lesson: any) => lesson.language === language);
      }
      if (category && category !== 'all') {
        lessons = lessons.filter((lesson: any) => lesson.category === category);
      }
      // Apply search in offline mode
      if (searchQuery) {
        lessons = lessons.filter((lesson: any) => 
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.body.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Pagination - still 10 for offline mode mock, adjust if you want it to mirror backend
      const pageSize = 6; // Changed to 6 to match backend default
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = lessons.slice(startIndex, endIndex);

      return {
        data: {
          results: paginatedResults,
          count: lessons.length,
          next: endIndex < lessons.length ? `/api/lessons?page=${page + 1}` : null,
          previous: page > 1 ? `/api/lessons?page=${page - 1}` : null
        }
      };
    }

    const params = new URLSearchParams();
    if (language && language !== 'all') params.append('language', language); // Only append if not 'all'
    if (category && category !== 'all') params.append('category', category); // Only append if not 'all'
    if (searchQuery) params.append('search', searchQuery); // New: add search query
    params.append('page', page.toString());
    // The backend's default page_size is 6, so we don't need to specify it unless we want a different size

    return this.request<{
      results: Array<{
        id: string;
        title: string;
        body: string;
        language: string;
        category: string;
        created_at: string;
      }>;
      count: number;
      next: string | null;
      previous: string | null;
    }>(`/api/assistant/topic-lessons?${params.toString()}`);
  }

  async getQueryHistory(page: number = 1) {
    if (this.isOfflineMode) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const history = storage.get(STORAGE_KEYS.QUERY_HISTORY) || [];
      
      // Pagination
      const pageSize = 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = history.slice(startIndex, endIndex);

      return {
        data: {
          results: paginatedResults,
          count: history.length,
          next: endIndex < history.length ? `/api/history?page=${page + 1}` : null,
          previous: page > 1 ? `/api/history?page=${page - 1}` : null
        }
      };
    }

    return this.request<{
      results: Array<{
        id: string;
        query: string;
        response: string;
        audio_url?: string;
        language: string;
        category: string;
        timestamp: string;
      }>;
      count: number;
      next: string | null;
      previous: string | null;
    }>(`/api/logs/query-history?page=${page}`);
  }
}

export const api = new ApiService();
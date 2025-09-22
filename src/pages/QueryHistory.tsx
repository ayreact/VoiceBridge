import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from '@/components/AudioPlayer';
import { History, MessageSquare, Clock, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface QueryHistoryItem {
  id: string;
  query: string;
  response: string;
  audio_url?: string;
  language: string;
  category: string;
  timestamp: string;
}

export const QueryHistory: React.FC = () => {
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHistory = async (pageNum: number = 1, reset: boolean = true) => {
    try {
      setLoading(true);

      const response = await api.getQueryHistory(pageNum);

      if ('error' in response && response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        // Ensure newHistory is always an array
        const newHistory = Array.isArray(response.data.results)
          ? response.data.results
          : Array.isArray(response.data)
            ? response.data
            : [];

        if (reset) {
          setHistory(newHistory);
        } else {
          setHistory(prev => [...prev, ...newHistory]);
        }

        // Only try to read `next` if it's a paginated object
        const hasNext = response.data?.next ?? false;
        setHasMore(!!hasNext);
        setPage(pageNum);
      }
    } catch (error: any) {
      console.error('Failed to fetch query history:', error);
      toast({
        title: "Failed to load history",
        description: error.message || "Could not fetch your query history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchHistory(page + 1, false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-100 text-blue-800',
      healthcare: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-purple-100 text-purple-800',
      technology: 'bg-indigo-100 text-indigo-800',
      culture: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getLanguageFlag = (langCode: string) => {
    const flags: Record<string, string> = {
      en: '🇬🇧',
      yo: '🇳🇬',
      ha: '🇳🇬',
      ig: '🇳🇬',
    };
    return flags[langCode] || '🌐';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-merriweather font-bold text-gradient mb-4">
          Query History
        </h1>
        <p className="text-lg text-muted-foreground">
          Your conversation history with VoiceBridge Assistant
        </p>
        <p className="text-sm text-muted-foreground">
          Only supports text queries for now (Beta Version)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{history.length}</p>
                <p className="text-sm text-muted-foreground">Total Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <History className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(history.map(item => item.language)).size}
                </p>
                <p className="text-sm text-muted-foreground">Languages Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Clock className="h-6 w-6 text-secondary-dark" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(history.map(item => item.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        {history.map((item) => (
          <Card 
            key={item.id}
            className="hover:shadow-medium transition-all duration-300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getLanguageFlag(item.language)} {item.language.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">
                    {item.query}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedItem(
                    expandedItem === item.id ? null : item.id
                  )}
                >
                  {expandedItem === item.id ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </CardHeader>

            {expandedItem === item.id && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                      Assistant Response:
                    </h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-foreground leading-relaxed">
                        {item.response}
                      </p>
                    </div>
                  </div>

                  {item.audio_url && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
                        Audio Response:
                      </h4>
                      <AudioPlayer 
                        audioUrl={item.audio_url}
                        title="Saved Response"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && history.length === 0 && (
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your query history...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && history.length === 0 && (
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No query history yet</h3>
          <p className="text-muted-foreground mb-4">
            Start using VoiceBridge Assistant to see your conversation history here
          </p>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              Start a Conversation
            </Link>
          </Button>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && history.length > 0 && (
        <div className="text-center mt-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More History'}
          </Button>
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Filter, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/components/LanguageSelector'; // Assuming this is correct

interface Lesson {
  id: string;
  title: string;
  body: string;
  language: string;
  category: string;
  created_at: string;
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'technology', label: 'Technology' },
  { value: 'culture', label: 'Culture' },
];

const languages = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'ha', label: 'Hausa' },
  { value: 'ig', label: 'Igbo' },
];

export const Lessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchTerm, setCurrentSearchTerm] = useState(''); // To trigger fetch on search button click
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLessons = useCallback(async (pageNum: number = 1, reset: boolean = true) => {
    try {
      setLoading(true);

      const language = selectedLanguage === 'all' ? undefined : selectedLanguage;
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const search = currentSearchTerm || undefined; // Use currentSearchTerm for actual query

      const response = await api.getLessons(language, category, search, pageNum);

      if ('error' in response && response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        const newLessons = Array.isArray(response.data.results)
          ? response.data.results
          : [];

        if (reset) {
          setLessons(newLessons);
        } else {
          setLessons(prev => [...prev, ...newLessons]);
        }

        const hasNext = response.data?.next ?? null; // Use null for no next page
        setHasMore(!!hasNext);
        setPage(pageNum);
      }
    } catch (error: any) {
      console.error('Failed to fetch lessons:', error);
      toast({
        title: "Failed to load lessons",
        description: error.message || "Could not fetch lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedCategory, currentSearchTerm]); // Add dependencies for useCallback

  useEffect(() => {
    // When language, category, or currentSearchTerm changes, reset to page 1 and fetch
    fetchLessons(1, true);
  }, [selectedLanguage, selectedCategory, currentSearchTerm, fetchLessons]); // Add fetchLessons to dependency array

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLessons(page + 1, false);
    }
  };

  const handleApplyFilters = () => {
    // When the "Apply Filters" button is clicked, update currentSearchTerm
    // and trigger a re-fetch (which useEffect will handle)
    setCurrentSearchTerm(searchQuery); 
  };

  // Remove filteredLessons variable - filtering now happens on the backend

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      education: 'bg-blue-100 text-blue-800',
      healthcare: 'bg-green-100 text-green-800',
      finance: 'bg-yellow-100 text-yellow-800',
      entertainment: 'bg-purple-100 text-purple-800',
      technology: 'bg-indigo-100 text-indigo-800',
      culture: 'bg-pink-100 text-pink-800',
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
          Educational Lessons
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover knowledge in your preferred language across various topics
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters(); // Trigger search on Enter key press
                  }
                }}
              />
            </div>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleApplyFilters} // Call new handler
              variant="outline"
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => ( // Render 'lessons' directly
          <Card 
            key={lesson.id} 
            className="hover:shadow-medium transition-all duration-300 cursor-pointer"
            onClick={() => setExpandedLesson(
              expandedLesson === lesson.id ? null : lesson.id
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {lesson.title}
                </CardTitle>
                <ChevronRight 
                  className={`h-4 w-4 transition-transform ${
                    expandedLesson === lesson.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getCategoryColor(lesson.category)}>
                  {lesson.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getLanguageFlag(lesson.language)} {lesson.language.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-muted-foreground ${
                expandedLesson === lesson.id ? '' : 'line-clamp-3'
              }`}>
                {lesson.body}
              </p>
              
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Published: {formatDate(lesson.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading State */}
      {loading && lessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && lessons.length === 0 && ( // Check 'lessons' directly
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No lessons found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && lessons.length > 0 && ( // Check 'lessons' directly
        <div className="text-center mt-8">
          <Button 
            onClick={handleLoadMore}
            variant="outline"
            size="lg"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Lessons'}
          </Button>
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ThumbsUp, MessageSquare, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SuggestedPost {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  engagement: number;
  reason: string;
}

const PostSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SuggestedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiSuggestions: SuggestedPost[] = [
      {
        id: '1',
        title: 'React Server Components: Complete Guide',
        description: 'Explore the latest React Server Components and how they revolutionize web development',
        tags: ['react', 'server-components', 'next.js'],
        difficulty: 'advanced',
        engagement: 85,
        reason: 'Trending topic with high engagement potential'
      },
      {
        id: '2',
        title: 'TypeScript Performance Optimization Tips',
        description: 'Best practices for optimizing TypeScript compilation and runtime performance',
        tags: ['typescript', 'performance', 'optimization'],
        difficulty: 'intermediate',
        engagement: 72,
        reason: 'Popular search topic this week'
      },
      {
        id: '3',
        title: 'Building Accessible Web Components',
        description: 'Creating inclusive web experiences with proper accessibility implementation',
        tags: ['accessibility', 'web-components', 'html'],
        difficulty: 'beginner',
        engagement: 68,
        reason: 'High community interest in accessibility'
      }
    ];
    
    setSuggestions(aiSuggestions);
    setIsLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <Card className="glass border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-purple-400" />
          AI Post Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <Button
            onClick={generateSuggestions}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Suggestions
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                {suggestions.length} suggestions generated
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuggestions([])}
                className="text-gray-400 border-gray-600 hover:bg-gray-800"
              >
                New Suggestions
              </Button>
            </div>
            
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm">{suggestion.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3 w-3" />
                    {suggestion.engagement}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{suggestion.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                    {suggestion.difficulty}
                  </Badge>
                  <span className="text-xs text-purple-400">{suggestion.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostSuggestions;

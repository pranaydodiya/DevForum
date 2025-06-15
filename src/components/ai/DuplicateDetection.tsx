
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

interface DuplicateMatch {
  postId: string;
  title: string;
  author: string;
  similarity: number;
  createdAt: string;
  reason: string;
}

const DuplicateDetection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { posts } = usePosts();

  const analyzeForDuplicates = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI-powered duplicate detection
    const query = searchQuery.toLowerCase();
    const matches: DuplicateMatch[] = [];
    
    posts.forEach(post => {
      const titleSimilarity = calculateSimilarity(query, post.title.toLowerCase());
      const contentSimilarity = calculateSimilarity(query, post.content.toLowerCase());
      const maxSimilarity = Math.max(titleSimilarity, contentSimilarity);
      
      if (maxSimilarity > 0.3) { // 30% similarity threshold
        matches.push({
          postId: post.id,
          title: post.title,
          author: post.author.name,
          similarity: Math.round(maxSimilarity * 100),
          createdAt: post.createdAt,
          reason: maxSimilarity === titleSimilarity ? 'Similar title' : 'Similar content'
        });
      }
    });
    
    // Sort by similarity
    matches.sort((a, b) => b.similarity - a.similarity);
    
    setDuplicates(matches.slice(0, 5)); // Top 5 matches
    setIsAnalyzing(false);
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const words1 = str1.split(' ').filter(word => word.length > 2);
    const words2 = str2.split(' ').filter(word => word.length > 2);
    
    let commonWords = 0;
    words1.forEach(word => {
      if (words2.some(w => w.includes(word) || word.includes(w))) {
        commonWords++;
      }
    });
    
    return commonWords / Math.max(words1.length, words2.length);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 70) return 'text-red-400';
    if (similarity >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSimilarityBadgeColor = (similarity: number) => {
    if (similarity >= 70) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (similarity >= 50) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-green-500/20 text-green-300 border-green-500/30';
  };

  return (
    <Card className="glass border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-orange-400" />
          Duplicate Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="Enter your post title or content to check for duplicates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-orange-500"
          />
          
          <Button
            onClick={analyzeForDuplicates}
            disabled={isAnalyzing || !searchQuery.trim()}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {isAnalyzing ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-spin" />
                Analyzing for Duplicates...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Check for Duplicates
              </>
            )}
          </Button>
        </div>

        {duplicates.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {duplicates.some(d => d.similarity >= 70) ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">
                    High similarity matches found
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">
                    Low similarity - likely unique content
                  </span>
                </>
              )}
            </div>
            
            <div className="space-y-3">
              {duplicates.map((duplicate) => (
                <div
                  key={duplicate.postId}
                  className="p-3 bg-gray-800/50 rounded border border-gray-700 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-white text-sm">{duplicate.title}</h4>
                    <Badge className={`text-xs ${getSimilarityBadgeColor(duplicate.similarity)}`}>
                      {duplicate.similarity}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">by {duplicate.author}</span>
                    <span className="text-orange-400">{duplicate.reason}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDuplicates([])}
              className="w-full text-gray-400 border-gray-600 hover:bg-gray-800"
            >
              Clear Results
            </Button>
          </div>
        ) : searchQuery && !isAnalyzing ? (
          <div className="text-center py-4 text-gray-400">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm">No similar posts found. Your content appears to be unique!</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DuplicateDetection;

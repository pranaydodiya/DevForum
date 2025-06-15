
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Users, MessageSquare } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';

interface ThreadSummary {
  postId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  participantCount: number;
  timeToRead: string;
  sentiment: 'positive' | 'neutral' | 'mixed';
}

const ThreadSummaries = () => {
  const [summaries, setSummaries] = useState<ThreadSummary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { posts } = usePosts();

  const generateSummaries = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate summaries for posts with high engagement
    const highEngagementPosts = posts.filter(post => post.comments > 5 || post.votes > 15);
    
    const generatedSummaries: ThreadSummary[] = highEngagementPosts.slice(0, 3).map(post => {
      const summaryData: ThreadSummary = {
        postId: post.id,
        title: post.title,
        summary: '',
        keyPoints: [],
        participantCount: Math.floor(Math.random() * 15) + 5,
        timeToRead: `${Math.floor(Math.random() * 3) + 1} min`,
        sentiment: ['positive', 'neutral', 'mixed'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'mixed'
      };

      // Generate AI summary based on post content
      if (post.title.includes('React')) {
        summaryData.summary = 'Discussion covers React performance optimization techniques, focusing on memoization, component structure, and rendering efficiency. Community shared practical examples and benchmarking results.';
        summaryData.keyPoints = ['Use React.memo() for expensive components', 'Implement useMemo() for complex calculations', 'Optimize component re-renders', 'Consider code splitting'];
      } else if (post.title.includes('TypeScript')) {
        summaryData.summary = 'In-depth code review of TypeScript API client with focus on type safety, error handling, and architecture patterns. Multiple suggestions for improvement provided.';
        summaryData.keyPoints = ['Add proper error handling', 'Implement generic types', 'Use interface segregation', 'Consider dependency injection'];
      } else if (post.title.includes('AI')) {
        summaryData.summary = 'Exploration of AI integration in development workflows, covering GPT-4 implementation, automation strategies, and practical use cases for code generation.';
        summaryData.keyPoints = ['GPT-4 API integration patterns', 'Prompt engineering best practices', 'Code generation limitations', 'Quality assurance for AI output'];
      } else {
        summaryData.summary = 'Community discussion with valuable insights and practical solutions. Multiple approaches discussed with pros and cons analyzed.';
        summaryData.keyPoints = ['Multiple solution approaches', 'Community best practices', 'Performance considerations', 'Real-world examples'];
      }

      return summaryData;
    });
    
    setSummaries(generatedSummaries);
    setIsGenerating(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'mixed': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <Card className="glass border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="h-5 w-5 text-cyan-400" />
          Thread Summaries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summaries.length === 0 ? (
          <Button
            onClick={generateSummaries}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <FileText className="h-4 w-4 mr-2 animate-spin" />
                Generating Summaries...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate AI Summaries
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                {summaries.length} thread summaries generated
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSummaries([])}
                className="text-gray-400 border-gray-600 hover:bg-gray-800"
              >
                New Analysis
              </Button>
            </div>
            
            {summaries.map((summary) => (
              <div
                key={summary.postId}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-white text-sm">{summary.title}</h3>
                  <Badge className={`text-xs ${getSentimentColor(summary.sentiment)}`}>
                    {summary.sentiment}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-300">{summary.summary}</p>
                
                <div className="space-y-2">
                  <span className="text-xs font-medium text-cyan-400">Key Points:</span>
                  <ul className="space-y-1">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {summary.participantCount} participants
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {summary.timeToRead} read
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThreadSummaries;

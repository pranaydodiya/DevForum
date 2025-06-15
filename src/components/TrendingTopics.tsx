
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Hash, Eye, Code, Download } from 'lucide-react';
import { TrendingTopic } from '@/hooks/usePosts';
import { gsap } from 'gsap';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onDownloadCode: (code: string, filename: string) => void;
}

const TrendingTopics = ({ topics, onDownloadCode }: TrendingTopicsProps) => {
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topicsRef.current) {
      const topicCards = topicsRef.current.querySelectorAll('.topic-card');
      gsap.fromTo(topicCards,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedTopic && detailsRef.current) {
      gsap.fromTo(detailsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [selectedTopic]);

  const getTrendingIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const generateCodeExample = (tag: string) => {
    const examples = {
      'ai': `// AI-powered code generation example
const aiCodeGenerator = async (prompt) => {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt,
      model: 'gpt-4',
      temperature: 0.7 
    })
  });
  
  const result = await response.json();
  return result.code;
};

// Usage
const generatedCode = await aiCodeGenerator(
  'Create a React component for user authentication'
);`,
      'react': `// React performance optimization example
import { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ items, onSelect }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.priority - b.priority);
  }, [items]);
  
  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);
  
  return (
    <div className="grid gap-4">
      {sortedItems.map(item => (
        <ItemCard 
          key={item.id} 
          item={item} 
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
});`,
      'typescript': `// Advanced TypeScript patterns
interface ApiResponse<T> {
  data: T;
  status: number;
  errors?: string[];
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

class TypeSafeApiClient {
  async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return response.json();
  }
  
  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }
  
  post<T>(endpoint: string, body: unknown) {
    return this.request<T>('POST', endpoint, body);
  }
}`,
      'performance': `// Performance monitoring and optimization
class PerformanceMonitor {
  private metrics = new Map();
  
  startTimer(label: string) {
    this.metrics.set(label, performance.now());
  }
  
  endTimer(label: string) {
    const start = this.metrics.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(\`\${label}: \${duration.toFixed(2)}ms\`);
      return duration;
    }
  }
  
  measureAsync = async <T>(
    label: string, 
    fn: () => Promise<T>
  ): Promise<T> => {
    this.startTimer(label);
    try {
      const result = await fn();
      return result;
    } finally {
      this.endTimer(label);
    }
  };
}`
    };
    
    return examples[tag] || `// Example code for ${tag}
console.log('No specific example available for ${tag}');`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20">
          <TrendingUp className="h-6 w-6 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Trending Topics</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topics List */}
        <div ref={topicsRef} className="space-y-4">
          {topics.map((topic, index) => (
            <Card
              key={topic.tag}
              className="topic-card glass border border-gray-600/50 cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:scale-[1.02]"
              onClick={() => setSelectedTopic(topic)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                      <Hash className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">#{topic.tag}</h3>
                      <p className="text-sm text-gray-400">{topic.count} posts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendingIcon(topic.growth)}
                    <span className={`text-sm font-bold ${
                      topic.growth > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {topic.growth > 0 ? '+' : ''}{topic.growth}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {topic.posts.reduce((sum, post) => sum + (post.views || 0), 0)} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    {topic.posts.filter(post => post.code).length} code examples
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((topic.count / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Topic Details */}
        {selectedTopic && (
          <div ref={detailsRef}>
            <Card className="glass border border-gray-600/50 sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-400" />
                    <span className="gradient-text">#{selectedTopic.tag}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 border-green-500/30">
                    Trending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center glass p-3 rounded-lg">
                    <p className="text-2xl font-bold text-white">{selectedTopic.count}</p>
                    <p className="text-sm text-gray-400">Total Posts</p>
                  </div>
                  <div className="text-center glass p-3 rounded-lg">
                    <p className={`text-2xl font-bold ${
                      selectedTopic.growth > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedTopic.growth > 0 ? '+' : ''}{selectedTopic.growth}%
                    </p>
                    <p className="text-sm text-gray-400">Growth</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-400" />
                    Code Example
                  </h4>
                  <div className="relative">
                    <pre className="bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 rounded-xl text-xs overflow-x-auto border border-gray-700 max-h-64">
                      <code>{generateCodeExample(selectedTopic.tag)}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                      onClick={() => onDownloadCode(
                        generateCodeExample(selectedTopic.tag),
                        `${selectedTopic.tag}-example.js`
                      )}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Recent Posts</h4>
                  <div className="space-y-2">
                    {selectedTopic.posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="glass p-3 rounded-lg">
                        <p className="text-sm font-medium text-white line-clamp-2">{post.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span>{post.author.name}</span>
                          <span>•</span>
                          <span>{post.votes} votes</span>
                          <span>•</span>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingTopics;

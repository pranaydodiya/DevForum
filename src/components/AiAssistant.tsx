
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, Code, Download, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

interface AiResponse {
  id: string;
  question: string;
  answer: string;
  code?: string;
  language?: string;
  timestamp: string;
}

const AiAssistant = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AiResponse[]>([]);
  const { toast } = useToast();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      const messages = chatRef.current.querySelectorAll('.ai-message');
      gsap.fromTo(messages,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [responses]);

  const simulateAiResponse = async (userQuestion: string): Promise<AiResponse> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = {
      'react performance': {
        answer: 'To optimize React performance, consider these key strategies: 1) Use React.memo() for component memoization, 2) Implement useMemo() and useCallback() hooks, 3) Optimize your bundle size with code splitting, 4) Use React DevTools Profiler to identify bottlenecks.',
        code: `// Example: Optimized React component
import React, { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ items, onItemClick }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      <h3>Total: {expensiveValue}</h3>
      {items.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});`,
        language: 'javascript'
      },
      'typescript api': {
        answer: 'Here\'s a robust TypeScript API client with error handling, type safety, and interceptors for common operations like authentication and request/response transformation.',
        code: `interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class TypeSafeApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: 'Success'
      };
    } catch (error) {
      throw new Error(\`API request failed: \${error.message}\`);
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}`,
        language: 'typescript'
      }
    };

    const key = Object.keys(responses).find(k => userQuestion.toLowerCase().includes(k));
    const response = key ? responses[key] : {
      answer: 'I can help you with React performance, TypeScript patterns, API design, and more! Try asking about specific topics like "React performance optimization" or "TypeScript API client".',
      code: `// Example: Basic React hook
import { useState, useEffect } from 'react';

const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};`,
      language: 'javascript'
    };

    return {
      id: Date.now().toString(),
      question: userQuestion,
      answer: response.answer,
      code: response.code,
      language: response.language,
      timestamp: new Date().toISOString()
    };
  };

  const handleAskAi = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await simulateAiResponse(question);
      setResponses(prev => [response, ...prev]);
      setQuestion('');
      
      toast({
        title: "AI Response Generated! 🤖",
        description: "Your question has been processed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied! 📋",
      description: "Code has been copied to clipboard.",
    });
  };

  const downloadCode = (code: string, filename: string = 'ai-generated-code.txt') => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 pulse-glow">
          <Bot className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">AI Code Assistant</h2>
        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
          Beta
        </Badge>
      </div>

      {/* AI Input */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Ask AI Anything
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about React, TypeScript, APIs, algorithms..."
              className="flex-1 bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleAskAi()}
            />
            <Button
              onClick={handleAskAi}
              disabled={isLoading || !question.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['React performance', 'TypeScript patterns', 'API design', 'Algorithm optimization'].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                size="sm"
                className="border-gray-600/50 text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                onClick={() => setQuestion(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Responses */}
      <div ref={chatRef} className="space-y-4">
        {responses.map((response) => (
          <Card key={response.id} className="ai-message glass border border-gray-600/50">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                  <Bot className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white mb-1">Q: {response.question}</p>
                  <p className="text-xs text-gray-400">{new Date(response.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200 leading-relaxed">{response.answer}</p>
              
              {response.code && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-blue-400 font-medium">{response.language}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                        onClick={() => copyCode(response.code!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                        onClick={() => downloadCode(response.code!, `ai-code-${response.id}.${response.language}`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 rounded-xl text-sm overflow-x-auto border border-gray-700 hover:border-blue-500/50 transition-colors duration-300">
                    <code>{response.code}</code>
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {responses.length === 0 && (
          <Card className="glass border border-gray-600/50">
            <CardContent className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">AI Assistant Ready</p>
              <p className="text-gray-500 text-sm">Ask me anything about coding and I'll help you with explanations and examples!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;

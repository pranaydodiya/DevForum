
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, CheckCircle, AlertTriangle, Info, Zap, Shield, Lightbulb } from 'lucide-react';

interface AiCodeReviewProps {
  code: string;
  language: string;
}

interface ReviewComment {
  type: 'bug' | 'optimization' | 'best-practice' | 'security' | 'info';
  line?: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
  suggestion?: string;
}

const AiCodeReview = ({ code, language }: AiCodeReviewProps) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  const performCodeReview = async () => {
    setIsReviewing(true);
    
    // Simulate AI code review with setTimeout
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Enhanced mock review comments based on comprehensive code analysis
    const comments: ReviewComment[] = [];
    
    // JavaScript/TypeScript specific checks
    if (language === 'javascript' || language === 'typescript') {
      // Variable declaration checks
      if (code.includes('var ')) {
        comments.push({
          type: 'best-practice',
          message: 'Use "const" or "let" instead of "var" for better scope management and to prevent hoisting issues',
          severity: 'medium',
          suggestion: 'Replace "var" with "const" for constants or "let" for reassignable variables'
        });
      }
      
      // Equality checks
      if (code.includes('==') && !code.includes('===')) {
        comments.push({
          type: 'bug',
          message: 'Use strict equality (===) instead of loose equality (==) to avoid type coercion bugs',
          severity: 'high',
          suggestion: 'Replace "==" with "===" and "!=" with "!=="'
        });
      }
      
      // Console logs
      if (code.includes('console.log')) {
        comments.push({
          type: 'best-practice',
          message: 'Remove console.log statements before production deployment',
          severity: 'low',
          suggestion: 'Use proper logging libraries or remove debug statements'
        });
      }
      
      // Function style
      if (code.includes('function ') && code.length < 200) {
        comments.push({
          type: 'optimization',
          message: 'Consider using arrow functions for better readability and lexical scope',
          severity: 'low',
          suggestion: 'Convert function declarations to arrow functions where appropriate'
        });
      }
      
      // Async operations without error handling
      if ((code.includes('fetch') || code.includes('await') || code.includes('.then(')) && !code.includes('try') && !code.includes('catch')) {
        comments.push({
          type: 'bug',
          message: 'Add proper error handling for async operations to prevent uncaught exceptions',
          severity: 'high',
          suggestion: 'Wrap async calls in try-catch blocks or use .catch() for promises'
        });
      }
      
      // Security issues
      if (code.includes('innerHTML') || code.includes('eval(')) {
        comments.push({
          type: 'security',
          message: 'Potential XSS vulnerability detected. Avoid using innerHTML or eval() with user input',
          severity: 'high',
          suggestion: 'Use textContent, createElement, or sanitize input before using innerHTML'
        });
      }
    }
    
    // React specific checks
    if (code.includes('React') || code.includes('useState') || code.includes('useEffect')) {
      // Missing dependencies in useEffect
      if (code.includes('useEffect') && !code.includes('[]') && !code.includes('[')) {
        comments.push({
          type: 'bug',
          message: 'useEffect is missing dependency array, which may cause infinite re-renders',
          severity: 'high',
          suggestion: 'Add dependency array to useEffect or use useCallback/useMemo for optimization'
        });
      }
      
      // Key prop in lists
      if (code.includes('.map(') && !code.includes('key=')) {
        comments.push({
          type: 'best-practice',
          message: 'Missing "key" prop in list items can cause rendering issues',
          severity: 'medium',
          suggestion: 'Add unique key prop to each item when rendering lists'
        });
      }
    }
    
    // General code quality checks
    if (code.length > 500) {
      comments.push({
        type: 'optimization',
        message: 'Function/component is quite long. Consider breaking it into smaller, more focused pieces',
        severity: 'medium',
        suggestion: 'Extract logic into separate functions or custom hooks'
      });
    }
    
    // Performance checks
    if (code.includes('document.querySelector') || code.includes('getElementById')) {
      comments.push({
        type: 'optimization',
        message: 'Direct DOM manipulation detected. Consider using React refs or state management',
        severity: 'medium',
        suggestion: 'Use useRef hook or state updates instead of direct DOM manipulation'
      });
    }
    
    // CSS/Styling checks
    if (language === 'css' || code.includes('style=')) {
      if (code.includes('!important')) {
        comments.push({
          type: 'best-practice',
          message: 'Avoid using !important as it makes CSS harder to maintain',
          severity: 'medium',
          suggestion: 'Use more specific selectors or restructure CSS hierarchy'
        });
      }
    }
    
    // Add some positive feedback if no major issues
    if (comments.length === 0 || comments.every(c => c.severity === 'low')) {
      comments.push({
        type: 'info',
        message: 'Code structure looks good! Consider adding comments for complex logic',
        severity: 'low',
        suggestion: 'Add JSDoc comments for better code documentation'
      });
    }
    
    setReviewComments(comments);
    setIsReviewing(false);
    setHasReviewed(true);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'bug':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'optimization':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'best-practice':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'security':
        return <Shield className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'security':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'optimization':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'best-practice':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Card className="glass border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bot className="h-5 w-5 text-purple-400" />
          AI Code Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasReviewed ? (
          <Button
            onClick={performCodeReview}
            disabled={isReviewing || !code.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isReviewing ? (
              <>
                <Bot className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Code...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Run AI Code Review
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                Review Complete ({reviewComments.length} {reviewComments.length === 1 ? 'issue' : 'issues'} found)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHasReviewed(false);
                  setReviewComments([]);
                }}
                className="text-gray-400 border-gray-600 hover:bg-gray-800"
              >
                New Review
              </Button>
            </div>
            
            {reviewComments.length === 0 ? (
              <div className="text-center py-6 text-green-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Excellent! No issues found.</p>
                <p className="text-sm text-gray-400">Your code follows best practices.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewComments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIconForType(comment.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs ${getSeverityColor(comment.severity)}`}>
                          {comment.severity.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${getTypeColor(comment.type)}`}>
                          {comment.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed">{comment.message}</p>
                      {comment.suggestion && (
                        <div className="bg-gray-900/50 rounded-md p-3 border-l-2 border-blue-500">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-3 w-3 text-blue-400" />
                            <span className="text-xs font-medium text-blue-400">Suggestion:</span>
                          </div>
                          <p className="text-xs text-gray-300">{comment.suggestion}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiCodeReview;

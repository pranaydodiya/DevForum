
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tag, Zap, CheckCircle } from 'lucide-react';

const SmartTagging = () => {
  const [inputText, setInputText] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<{ [key: string]: number }>({});

  const generateTags = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate NLP processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Enhanced AI tag generation based on content analysis
    const keywords = inputText.toLowerCase();
    const tags: string[] = [];
    const tagConfidence: { [key: string]: number } = {};
    
    // Programming languages detection
    const languagePatterns = [
      { pattern: /\b(react|jsx|hook|component|state|props)\b/, tag: 'react', confidence: 95 },
      { pattern: /\b(javascript|js|function|const|let|var)\b/, tag: 'javascript', confidence: 90 },
      { pattern: /\b(typescript|ts|interface|type|generic)\b/, tag: 'typescript', confidence: 92 },
      { pattern: /\b(python|py|def|import|class)\b/, tag: 'python', confidence: 88 },
      { pattern: /\b(node|nodejs|npm|express|server)\b/, tag: 'nodejs', confidence: 87 },
      { pattern: /\b(css|style|styling|flexbox|grid)\b/, tag: 'css', confidence: 85 },
      { pattern: /\b(html|markup|dom|element)\b/, tag: 'html', confidence: 83 },
      { pattern: /\b(vue|angular|svelte)\b/, tag: 'frontend', confidence: 86 },
    ];

    // Technology patterns
    const techPatterns = [
      { pattern: /\b(api|rest|endpoint|fetch|axios)\b/, tag: 'api', confidence: 84 },
      { pattern: /\b(database|db|sql|mongodb|mysql)\b/, tag: 'database', confidence: 88 },
      { pattern: /\b(git|github|version|commit)\b/, tag: 'git', confidence: 80 },
      { pattern: /\b(docker|container|deploy)\b/, tag: 'devops', confidence: 82 },
    ];

    // Concept patterns
    const conceptPatterns = [
      { pattern: /\b(performance|optimization|speed|fast)\b/, tag: 'performance', confidence: 85 },
      { pattern: /\b(bug|error|debug|fix|issue)\b/, tag: 'debugging', confidence: 90 },
      { pattern: /\b(security|auth|authentication|login)\b/, tag: 'security', confidence: 89 },
      { pattern: /\b(test|testing|unit|integration)\b/, tag: 'testing', confidence: 87 },
      { pattern: /\b(responsive|mobile|tablet|desktop)\b/, tag: 'responsive', confidence: 83 },
      { pattern: /\b(async|await|promise|callback)\b/, tag: 'async', confidence: 86 },
    ];

    // AI/ML patterns
    const aiPatterns = [
      { pattern: /\b(ai|artificial intelligence|machine learning|ml)\b/, tag: 'ai', confidence: 96 },
      { pattern: /\b(neural|network|deep learning)\b/, tag: 'deep-learning', confidence: 94 },
      { pattern: /\b(nlp|natural language|text processing)\b/, tag: 'nlp', confidence: 93 },
    ];

    // Check all patterns
    [...languagePatterns, ...techPatterns, ...conceptPatterns, ...aiPatterns].forEach(({ pattern, tag, confidence: conf }) => {
      if (pattern.test(keywords) && !tags.includes(tag)) {
        tags.push(tag);
        tagConfidence[tag] = conf + Math.floor(Math.random() * 5) - 2; // Add some variance
      }
    });

    // Fallback: extract potential tags from common words
    if (tags.length === 0) {
      const commonTechWords = inputText.toLowerCase().match(/\b(web|app|code|program|software|tech|digital)\b/g);
      if (commonTechWords) {
        tags.push('general');
        tagConfidence.general = 75;
      }
    }

    setSuggestedTags(tags.slice(0, 8)); // Limit to 8 tags
    setConfidence(tagConfidence);
    setIsProcessing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <Card className="glass border-gray-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Tag className="h-5 w-5 text-yellow-400" />
          Smart Tagging with NLP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            placeholder="Paste your post content here to generate intelligent tags..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500"
          />
          
          <Button
            onClick={generateTags}
            disabled={isProcessing || !inputText.trim()}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Processing with NLP...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Smart Tags
              </>
            )}
          </Button>
        </div>

        {suggestedTags.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                Generated {suggestedTags.length} tags
              </span>
            </div>
            
            <div className="space-y-2">
              {suggestedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-700"
                >
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30">
                    #{tag}
                  </Badge>
                  <span className={`text-xs font-medium ${getConfidenceColor(confidence[tag] || 0)}`}>
                    {confidence[tag] || 0}% confidence
                  </span>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuggestedTags([]);
                setConfidence({});
              }}
              className="w-full text-gray-400 border-gray-600 hover:bg-gray-800"
            >
              Clear Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartTagging;

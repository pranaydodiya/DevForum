
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ToxicityResult {
  isToxic: boolean;
  confidence: number;
  categories: string[];
  suggestion?: string;
}

export const useToxicityDetection = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // Simulated toxicity detection (in production, this would call an AI API)
  const checkToxicity = useCallback(async (text: string): Promise<ToxicityResult> => {
    setIsChecking(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const toxicWords = [
      'spam', 'stupid', 'idiot', 'hate', 'terrible', 'worst', 'garbage',
      'useless', 'pointless', 'dumb', 'moron', 'pathetic'
    ];
    
    const lowerText = text.toLowerCase();
    const foundToxicWords = toxicWords.filter(word => lowerText.includes(word));
    
    const isToxic = foundToxicWords.length > 0;
    const confidence = isToxic ? Math.min(foundToxicWords.length * 0.3 + 0.4, 0.95) : 0.1;
    
    const result: ToxicityResult = {
      isToxic,
      confidence,
      categories: isToxic ? ['offensive-language', 'unconstructive'] : [],
      suggestion: isToxic ? 'Consider rephrasing your comment to be more constructive and helpful.' : undefined
    };
    
    setIsChecking(false);
    return result;
  }, []);

  const moderateComment = useCallback(async (text: string): Promise<boolean> => {
    const result = await checkToxicity(text);
    
    if (result.isToxic && result.confidence > 0.7) {
      toast({
        title: "Comment Blocked",
        description: result.suggestion || "This comment contains potentially offensive content.",
        variant: "destructive",
      });
      return false;
    } else if (result.isToxic && result.confidence > 0.4) {
      toast({
        title: "Content Warning",
        description: "Please consider making your comment more constructive.",
        variant: "default",
      });
    }
    
    return true;
  }, [checkToxicity, toast]);

  return {
    checkToxicity,
    moderateComment,
    isChecking
  };
};

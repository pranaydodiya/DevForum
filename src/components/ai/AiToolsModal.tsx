
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Sparkles, FileText, Tag, Eye, Zap } from 'lucide-react';
import PostSuggestions from './PostSuggestions';
import SmartTagging from './SmartTagging';
import ThreadSummaries from './ThreadSummaries';
import DuplicateDetection from './DuplicateDetection';
import AiCodeReview from '../AiCodeReview';

interface AiToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiToolsModal = ({ isOpen, onClose }: AiToolsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto glass-dark border border-gray-600/50 shadow-2xl">
        <DialogHeader className="border-b border-gray-700/50 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Bot className="h-5 w-5 text-blue-400" />
            </div>
            <span className="gradient-text">AI Tools Suite</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border border-gray-700">
            <TabsTrigger 
              value="suggestions" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-300"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Suggestions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tagging" 
              className="flex items-center gap-2 data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-300"
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Tagging</span>
            </TabsTrigger>
            <TabsTrigger 
              value="summaries" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-300"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Summaries</span>
            </TabsTrigger>
            <TabsTrigger 
              value="duplicates" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-300"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Duplicates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="review" 
              className="flex items-center gap-2 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-300"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Review</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="suggestions" className="space-y-4">
              <PostSuggestions />
            </TabsContent>

            <TabsContent value="tagging" className="space-y-4">
              <SmartTagging />
            </TabsContent>

            <TabsContent value="summaries" className="space-y-4">
              <ThreadSummaries />
            </TabsContent>

            <TabsContent value="duplicates" className="space-y-4">
              <DuplicateDetection />
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <AiCodeReview code="" language="javascript" />
              <div className="text-center text-gray-400 text-sm mt-4">
                Use the Code Review feature in individual posts to analyze specific code snippets
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AiToolsModal;

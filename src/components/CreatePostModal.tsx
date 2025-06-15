
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Sparkles, Code, Tag, Bot, Zap, FileText, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';
import { usePosts } from '@/hooks/usePosts';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: any) => void;
}

const CreatePostModal = ({ isOpen, onClose, onCreatePost }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [similarPosts, setSimilarPosts] = useState<any[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const { toast } = useToast();
  const { posts } = usePosts();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  // AI-powered tag suggestions
  useEffect(() => {
    if (title.length > 10 || content.length > 50) {
      generateAiTags();
      checkSimilarPosts();
    }
  }, [title, content]);

  const generateAiTags = () => {
    // Simulate AI tag generation based on content
    const keywords = (title + ' ' + content).toLowerCase();
    const possibleTags = [];
    
    if (keywords.includes('react')) possibleTags.push('react');
    if (keywords.includes('javascript') || keywords.includes('js')) possibleTags.push('javascript');
    if (keywords.includes('typescript') || keywords.includes('ts')) possibleTags.push('typescript');
    if (keywords.includes('css')) possibleTags.push('css');
    if (keywords.includes('html')) possibleTags.push('html');
    if (keywords.includes('node')) possibleTags.push('nodejs');
    if (keywords.includes('api')) possibleTags.push('api');
    if (keywords.includes('database')) possibleTags.push('database');
    if (keywords.includes('performance')) possibleTags.push('performance');
    if (keywords.includes('bug') || keywords.includes('error')) possibleTags.push('debugging');
    
    setAiSuggestions(possibleTags.filter(tag => !tags.includes(tag)).slice(0, 3));
  };

  const checkSimilarPosts = () => {
    // Check for similar existing posts
    const similar = posts.filter(post => {
      const titleSimilarity = post.title.toLowerCase().includes(title.toLowerCase().substring(0, 20));
      const contentSimilarity = post.content.toLowerCase().includes(content.toLowerCase().substring(0, 30));
      return (titleSimilarity || contentSimilarity) && title.length > 10;
    }).slice(0, 3);
    
    setSimilarPosts(similar);
    setShowDuplicateWarning(similar.length > 0);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
      
      setTimeout(() => {
        const newTag = document.querySelector('.tag-item:last-child');
        if (newTag) {
          gsap.fromTo(newTag, 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
      }, 10);
    }
  };

  const handleAddAiTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setAiSuggestions(aiSuggestions.filter(t => t !== tag));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const tagElement = document.querySelector(`[data-tag="${tagToRemove}"]`);
    if (tagElement) {
      gsap.to(tagElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setTags(tags.filter(tag => tag !== tagToRemove));
        }
      });
    } else {
      setTags(tags.filter(tag => tag !== tagToRemove));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      code: code || undefined,
      language,
      tags,
      author: {
        name: 'Current User',
        reputation: 1250
      },
      votes: 0,
      comments: 0,
      createdAt: 'just now'
    };

    onCreatePost(newPost);
    
    // Reset form
    setTitle('');
    setContent('');
    setCode('');
    setLanguage('javascript');
    setTags([]);
    setCurrentTag('');
    setAiSuggestions([]);
    setSimilarPosts([]);
    setShowDuplicateWarning(false);
    
    toast({
      title: "Post created successfully! ✨",
      description: "Your post has been published and is now live!",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={modalRef}
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto glass-dark border border-gray-600/50 shadow-2xl"
      >
        <DialogHeader className="border-b border-gray-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <DialogTitle className="gradient-text text-xl">Create New Post</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Duplicate Warning */}
          {showDuplicateWarning && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">Similar posts found</span>
              </div>
              <div className="space-y-2">
                {similarPosts.map((post) => (
                  <div key={post.id} className="text-sm text-gray-300 p-2 bg-gray-800/50 rounded">
                    <span className="font-medium">{post.title}</span>
                    <span className="text-gray-400 ml-2">by {post.author.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="title" className="text-blue-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question or discussion topic?"
              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-all duration-300 h-12"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="content" className="text-blue-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Description
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question or share your thoughts..."
              rows={4}
              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-all duration-300 resize-none"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="code" className="text-green-300 font-semibold flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code (Optional)
            </Label>
            <div className="space-y-3">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[200px] bg-gray-900/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={6}
                className="font-mono text-sm bg-gray-900/70 border-gray-600 text-green-300 placeholder:text-gray-500 focus:border-green-500 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="tags" className="text-yellow-300 font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </Label>
            
            {/* AI Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">AI Suggested Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAiTag(tag)}
                      className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-500 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                variant="outline"
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-500/30 transition-all duration-300"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="tag-item flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400 transition-all duration-300"
                  data-tag={tag}
                >
                  #{tag}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-red-400 transition-colors duration-200" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-gray-700/50">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              ✨ Publish Post
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-8 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;

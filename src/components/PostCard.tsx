import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommentSection from '@/components/CommentSection';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Bookmark, 
  Share,
  Code,
  User,
  Star,
  Sparkles,
  Download,
  Copy,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import AiCodeReview from './AiCodeReview';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    code?: string;
    author: {
      name: string;
      avatar?: string;
      reputation: number;
    };
    votes: number;
    comments: number;
    tags: string[];
    createdAt: string;
    language?: string;
    views?: number;
  };
  isBookmarked?: boolean;
  isStarred?: boolean;
  onBookmark?: (postId: string) => void;
  onStar?: (postId: string) => void;
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
  getCommentsForPost?: (postId: string) => any[];
  onDownloadCode?: (code: string, filename: string) => void;
}

const PostCard = ({ 
  post, 
  isBookmarked, 
  isStarred, 
  onBookmark, 
  onStar, 
  onAddComment,
  getCommentsForPost,
  onDownloadCode
}: PostCardProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleVote = (type: 'up' | 'down') => {
    setUserVote(userVote === type ? null : type);
    
    // Animate vote button
    const button = cardRef.current?.querySelector(`.vote-${type}`);
    if (button) {
      gsap.to(button, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
    }
  };

  const handleBookmark = () => {
    onBookmark?.(post.id);
    // Animate bookmark
    const bookmark = cardRef.current?.querySelector('.bookmark-btn');
    if (bookmark) {
      gsap.to(bookmark, { 
        rotation: 360, 
        scale: 1.3, 
        duration: 0.4, 
        ease: "power2.out",
        onComplete: () => gsap.set(bookmark, { rotation: 0, scale: 1 })
      });
    }
  };

  const handleStar = () => {
    onStar?.(post.id);
    // Animate star
    const star = cardRef.current?.querySelector('.star-btn');
    if (star) {
      gsap.to(star, { 
        rotation: 360, 
        scale: 1.4, 
        duration: 0.5, 
        ease: "elastic.out(1, 0.3)",
        onComplete: () => gsap.set(star, { rotation: 0, scale: 1 })
      });
    }
  };

  const handleCopyCode = () => {
    if (post.code) {
      navigator.clipboard.writeText(post.code);
      toast({
        title: "Code copied! 📋",
        description: "Code has been copied to clipboard.",
      });
    }
  };

  const handleDownloadCode = () => {
    if (post.code && onDownloadCode) {
      const filename = `${post.title.replace(/\s+/g, '-').toLowerCase()}.${post.language || 'txt'}`;
      onDownloadCode(post.code, filename);
      toast({
        title: "Code downloaded! 📁",
        description: `${filename} has been downloaded.`,
      });
    }
  };

  const downloadCode = (code: string, filename: string) => {
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

  const comments = getCommentsForPost ? getCommentsForPost(post.id) : [];

  return (
    <Card 
      ref={cardRef}
      className="post-card relative overflow-hidden group transition-all duration-300 hover:transform hover:scale-[1.02]"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating sparkles effect */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start gap-4">
          {/* Enhanced Vote buttons */}
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`vote-up vote-button p-2 h-10 w-10 rounded-full transition-all duration-300 ${
                userVote === 'up' 
                  ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-500/10'
              }`}
              onClick={() => handleVote('up')}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span className={`text-sm font-bold transition-colors duration-300 ${
              userVote === 'up' ? 'text-blue-400' : userVote === 'down' ? 'text-red-400' : 'text-gray-300'
            }`}>
              {post.votes + (userVote === 'up' ? 1 : userVote === 'down' ? -1 : 0)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className={`vote-down vote-button p-2 h-10 w-10 rounded-full transition-all duration-300 ${
                userVote === 'down' 
                  ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30' 
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
              onClick={() => handleVote('down')}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Post content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold line-clamp-2 mb-3 gradient-text hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
              {post.title}
            </h3>

            <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
              {post.content}
            </p>

            {/* Enhanced Code snippet */}
            {post.code && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                      <Code className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-xs text-blue-400 font-medium">{post.language || 'Code'}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-8 w-8 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                      onClick={handleDownloadCode}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="relative group">
                  <pre className="bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4 rounded-xl text-sm overflow-x-auto border border-gray-700 hover:border-blue-500/50 transition-colors duration-300 max-h-64">
                    <code>{post.code}</code>
                  </pre>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Code Section with AI Review */}
            {post.code && (
              <div className="space-y-4">
                <div className="bg-gray-900/70 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{post.language}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadCode(post.code!, `${post.title.replace(/\s+/g, '_').toLowerCase()}.${post.language === 'javascript' ? 'js' : post.language}`)}
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <pre className="text-sm text-green-300 overflow-x-auto">
                    <code>{post.code}</code>
                  </pre>
                </div>
                
                {/* AI Code Review Component */}
                <AiCodeReview code={post.code} language={post.language || 'javascript'} />
              </div>
            )}

            {/* Enhanced Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Enhanced Author and meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{post.author.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs px-2 py-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                      {post.author.reputation}
                    </Badge>
                    <span className="text-xs text-gray-400">{post.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {post.views !== undefined && (
                  <div className="flex items-center gap-1 text-gray-400 text-xs mr-2">
                    <Eye className="h-3 w-3" />
                    <span>{post.views}</span>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`star-btn p-2 transition-all duration-300 ${
                    isStarred 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                  onClick={handleStar}
                >
                  <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`bookmark-btn p-2 transition-all duration-300 ${
                    isBookmarked 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-gray-400 hover:text-blue-400'
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Comments Section */}
      {showComments && onAddComment && (
        <CardContent className="border-t border-gray-700/50 pt-6">
          <CommentSection
            postId={post.id}
            comments={comments}
            onAddComment={onAddComment}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default PostCard;

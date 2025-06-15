import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Reply, MessageSquare, Sparkles, Flag } from 'lucide-react';
import { Comment } from '@/hooks/usePosts';
import { useToxicityDetection } from '@/hooks/useToxicityDetection';
import { useModeration } from '@/contexts/ModerationContext';
import { gsap } from 'gsap';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string, parentId?: string) => void;
}

const CommentSection = ({ postId, comments, onAddComment }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const commentsRef = useRef<HTMLDivElement>(null);
  
  const { moderateComment, isChecking } = useToxicityDetection();
  const { submitFlag, canModerate } = useModeration();

  useEffect(() => {
    if (commentsRef.current) {
      const commentElements = commentsRef.current.querySelectorAll('.comment-item');
      gsap.fromTo(commentElements,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    const isAllowed = await moderateComment(newComment);
    if (!isAllowed) return;
    
    onAddComment(postId, newComment);
    setNewComment('');
    
    // Animate new comment addition
    setTimeout(() => {
      const newCommentEl = commentsRef.current?.querySelector('.comment-item:first-child');
      if (newCommentEl) {
        gsap.fromTo(newCommentEl,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }, 100);
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const isAllowed = await moderateComment(replyContent);
    if (!isAllowed) return;
    
    onAddComment(postId, replyContent, commentId);
    setReplyContent('');
    setReplyTo(null);
  };

  const handleFlag = (commentId: string) => {
    submitFlag({
      commentId,
      reporterId: 'current',
      reason: 'offensive',
      description: 'Flagged via comment section'
    });
  };

  const handleVote = (commentId: string, type: 'up' | 'down') => {
    setUserVotes(prev => ({
      ...prev,
      [commentId]: prev[commentId] === type ? null : type
    }));
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`comment-item glass p-4 rounded-xl transition-all duration-300 hover:border-blue-500/30 ${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 rounded-full transition-all duration-300 ${
              userVotes[comment.id] === 'up' 
                ? 'text-white bg-gradient-to-r from-blue-500 to-blue-600' 
                : 'text-gray-400 hover:text-blue-400'
            }`}
            onClick={() => handleVote(comment.id, 'up')}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-gray-300">
            {comment.votes + (userVotes[comment.id] === 'up' ? 1 : userVotes[comment.id] === 'down' ? -1 : 0)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className={`p-1 h-8 w-8 rounded-full transition-all duration-300 ${
              userVotes[comment.id] === 'down' 
                ? 'text-white bg-gradient-to-r from-red-500 to-red-600' 
                : 'text-gray-400 hover:text-red-400'
            }`}
            onClick={() => handleVote(comment.id, 'down')}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-8 w-8 ring-2 ring-blue-500/30">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                {comment.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">{comment.author.name}</span>
              <Badge variant="outline" className="text-xs px-2 py-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                {comment.author.reputation}
              </Badge>
              <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <p className="text-gray-200 text-sm mb-3 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-2">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            
            {canModerate('current') && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                onClick={() => handleFlag(comment.id)}
              >
                <Flag className="h-4 w-4 mr-1" />
                Flag
              </Button>
            )}
          </div>
          
          {replyTo === comment.id && (
            <div className="mt-3 space-y-3">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-all duration-300 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Post Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <MessageSquare className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold gradient-text">Comments ({comments.length})</h3>
      </div>
      
      {/* Add new comment */}
      <div className="glass p-4 rounded-xl space-y-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-all duration-300 resize-none"
          rows={3}
        />
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6"
          onClick={handleAddComment}
          disabled={!newComment.trim() || isChecking}
        >
          {isChecking ? (
            <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {isChecking ? 'Checking...' : 'Post Comment'}
        </Button>
      </div>
      
      {/* Comments list */}
      <div ref={commentsRef} className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-12 glass rounded-xl">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;


import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import CreatePostButton from '@/components/CreatePostButton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { Sparkles, TrendingUp, Clock, MessageSquare, Heart } from 'lucide-react';
import Footer from '@/components/Footer';

const Index = () => {
  const [sortBy, setSortBy] = useState('trending');
  const [activeTab, setActiveTab] = useState('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const { activeSection, selectedTag } = useApp();
  const { 
    posts, 
    myPosts, 
    savedPosts, 
    starredPosts, 
    addPost, 
    toggleBookmark, 
    toggleStar,
    addComment,
    getCommentsForPost,
    downloadCode
  } = usePosts();
  const { toast } = useToast();
  const headerRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page entrance
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }

    if (postsRef.current) {
      const cards = postsRef.current.querySelectorAll('.post-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2
        }
      );
    }
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    toast({
      title: "🔔 Notifications",
      description: "You have 3 new notifications",
    });
  };

  const handleBookmark = (postId: string) => {
    toggleBookmark(postId);
    const post = posts.find(p => p.id === postId);
    const isCurrentlyBookmarked = savedPosts.some(p => p.id === postId);
    
    toast({
      title: isCurrentlyBookmarked ? "Bookmark Removed! 📌" : "Post Saved! 📌",
      description: isCurrentlyBookmarked 
        ? `"${post?.title}" has been removed from your saved posts.`
        : `"${post?.title}" has been saved to your bookmarks.`,
    });
  };

  const handleStar = (postId: string) => {
    toggleStar(postId);
    const post = posts.find(p => p.id === postId);
    const isCurrentlyStarred = starredPosts.some(p => p.id === postId);
    
    toast({
      title: isCurrentlyStarred ? "Star Removed! ⭐" : "Post Starred! ⭐",
      description: isCurrentlyStarred 
        ? `"${post?.title}" has been unstarred.`
        : `"${post?.title}" has been starred.`,
    });
  };

  const handleAddComment = (postId: string, content: string, parentId?: string) => {
    addComment(postId, content, parentId);
    toast({
      title: "Comment Added! 💬",
      description: "Your comment has been posted successfully.",
    });
  };

  const getCurrentPosts = () => {
    let currentPosts = posts;
    
    switch (activeSection) {
      case 'My Posts':
        currentPosts = myPosts;
        break;
      case 'Saved':
        currentPosts = savedPosts;
        break;
      case 'Starred':
        currentPosts = starredPosts;
        break;
      case 'Following':
        currentPosts = posts.filter(post => ['Sarah Chen', 'Alex Rodriguez'].includes(post.author.name));
        break;
      default:
        currentPosts = posts;
    }

    if (selectedTag) {
      currentPosts = currentPosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (activeTab !== 'all') {
      currentPosts = currentPosts.filter(post => {
        switch (activeTab) {
          case 'questions':
            return post.type === 'question' || post.title.toLowerCase().includes('how') || post.title.toLowerCase().includes('?');
          case 'discussions':
            return post.type === 'discussion' || (!post.code && !post.title.toLowerCase().includes('?'));
          case 'code':
            return post.type === 'code-review' || post.code;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'recent':
        return [...currentPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'votes':
        return [...currentPosts].sort((a, b) => b.votes - a.votes);
      case 'comments':
        return [...currentPosts].sort((a, b) => b.comments - a.comments);
      default:
        return [...currentPosts].sort((a, b) => {
          const aScore = a.votes * 2 + a.comments;
          const bScore = b.votes * 2 + b.comments;
          return bScore - aScore;
        });
    }
  };

  const getSectionTitle = () => {
    if (selectedTag) {
      return `Posts tagged with #${selectedTag}`;
    }
    
    switch (activeSection) {
      case 'My Posts':
        return 'My Posts';
      case 'Saved':
        return 'Saved Posts';
      case 'Starred':
        return 'Starred Posts';
      case 'Following':
        return 'Posts from People You Follow';
      default:
        return 'Latest Discussions';
    }
  };

  const getSectionDescription = () => {
    if (selectedTag) {
      return `Showing all posts related to ${selectedTag}`;
    }
    
    switch (activeSection) {
      case 'My Posts':
        return 'Posts you\'ve created';
      case 'Saved':
        return 'Posts you\'ve saved for later';
      case 'Starred':
        return 'Posts you\'ve starred';
      case 'Following':
        return 'Latest posts from developers you follow';
      default:
        return 'Share code, ask questions, and learn from the community';
    }
  };

  const getTabCounts = () => {
    let basePosts = posts;
    
    switch (activeSection) {
      case 'My Posts':
        basePosts = myPosts;
        break;
      case 'Saved':
        basePosts = savedPosts;
        break;
      case 'Starred':
        basePosts = starredPosts;
        break;
      case 'Following':
        basePosts = posts.filter(post => ['Sarah Chen', 'Alex Rodriguez'].includes(post.author.name));
        break;
    }

    if (selectedTag) {
      basePosts = basePosts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    return {
      all: basePosts.length,
      questions: basePosts.filter(post => 
        post.type === 'question' || post.title.toLowerCase().includes('how') || post.title.toLowerCase().includes('?')
      ).length,
      discussions: basePosts.filter(post => 
        post.type === 'discussion' || (!post.code && !post.title.toLowerCase().includes('?'))
      ).length,
      code: basePosts.filter(post => 
        post.type === 'code-review' || post.code
      ).length,
    };
  };

  const currentPosts = getCurrentPosts();
  const tabCounts = getTabCounts();

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'trending': return <TrendingUp className="h-4 w-4" />;
      case 'recent': return <Clock className="h-4 w-4" />;
      case 'votes': return <Heart className="h-4 w-4" />;
      case 'comments': return <MessageSquare className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Header 
        onNotificationClick={handleNotificationClick}
        notificationCount={3}
      />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {/* Enhanced header section */}
            <div ref={headerRef} className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 float">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                  </div>
                  <h1 className="text-3xl font-bold gradient-text">{getSectionTitle()}</h1>
                </div>
                <p className="text-gray-400 ml-14">
                  {getSectionDescription()}
                </p>
              </div>
              <CreatePostButton onCreatePost={addPost} />
            </div>

            {/* Enhanced filters and sorting */}
            <div className="flex items-center justify-between mb-8 glass p-4 rounded-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-700/50 rounded-xl">
                  <TabsTrigger 
                    value="all" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300"
                  >
                    All Posts
                    <span className="text-xs bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                      {tabCounts.all}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="questions" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300"
                  >
                    Questions
                    <span className="text-xs bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 px-2 py-0.5 rounded-full border border-green-500/30">
                      {tabCounts.questions}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="discussions" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300"
                  >
                    Discussions
                    <span className="text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                      {tabCounts.discussions}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="code" 
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300"
                  >
                    Code Reviews
                    <span className="text-xs bg-gradient-to-r from-orange-500/30 to-red-500/30 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/30">
                      {tabCounts.code}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[220px] glass border border-gray-600/50 text-white hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    {getSortIcon(sortBy)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-dark border border-gray-600/50">
                  <SelectItem value="trending" className="text-white hover:bg-gray-700/50 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </SelectItem>
                  <SelectItem value="recent" className="text-white hover:bg-gray-700/50">Most Recent</SelectItem>
                  <SelectItem value="votes" className="text-white hover:bg-gray-700/50">Most Voted</SelectItem>
                  <SelectItem value="comments" className="text-white hover:bg-gray-700/50">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced posts feed */}
            <div ref={postsRef} className="space-y-6">
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    isBookmarked={savedPosts.some(p => p.id === post.id)}
                    isStarred={starredPosts.some(p => p.id === post.id)}
                    onBookmark={handleBookmark}
                    onStar={handleStar}
                    onAddComment={handleAddComment}
                    getCommentsForPost={getCommentsForPost}
                    onDownloadCode={downloadCode}
                  />
                ))
              ) : (
                <div className="text-center py-16 glass rounded-xl">
                  <div className="animate-bounce mb-4">
                    <Sparkles className="h-12 w-12 text-blue-400 mx-auto" />
                  </div>
                  <p className="text-gray-400 text-lg mb-4">
                    No {activeTab === 'all' ? 'posts' : activeTab} found in this section.
                  </p>
                  {activeTab !== 'all' && (
                    <Button 
                      variant="outline" 
                      className="mt-4 border-blue-600/50 text-blue-300 hover:bg-blue-600/20 hover:border-blue-500 transition-all duration-300"
                      onClick={() => setActiveTab('all')}
                    >
                      View All Posts
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced load more */}
            {currentPosts.length > 0 && (
              <div className="flex justify-center mt-12">
                <Button 
                  variant="outline" 
                  className="px-8 py-3 glass border border-gray-600/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:border-blue-500/50 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Load More Posts
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

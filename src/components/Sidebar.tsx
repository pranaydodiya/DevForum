
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePostButton from '@/components/CreatePostButton';
import CodePlayground from '@/components/playground/CodePlayground';
import { 
  Zap, 
  Hash, 
  Activity, 
  MessageSquare, 
  Code,
  Home,
  Book,
  User,
  Settings,
  Play
} from 'lucide-react';
import CommunityStats from './CommunityStats';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { usePosts } from '@/hooks/usePosts';
import { useToast } from '@/hooks/use-toast';

const popularTags = ['react', 'typescript', 'nextjs', 'tailwindcss', 'javascript'];

const recentActivity = [
  { icon: MessageSquare, text: 'Sarah commented on your post' },
  { icon: Code, text: 'Alex reviewed your code' },
  { icon: Zap, text: 'John liked your post' },
];

const Sidebar = () => {
  const { setActiveSection } = useApp();
  const { addPost } = usePosts();
  const { toast } = useToast();

  const handleJoinDiscussion = () => {
    // Navigate to discussions section
    setActiveSection('Discussions');
    toast({
      title: "🗣️ Discussions",
      description: "Showing all active discussions. Join the conversation!",
    });
  };

  const handleCodeReview = () => {
    // Create a code review post
    const codeReviewPost = {
      title: 'Code Review Request',
      content: 'Share your code for community review and feedback.',
      author: {
        name: 'Current User',
        avatar: 'CU',
        reputation: 1250
      },
      tags: ['code-review', 'feedback'],
      type: 'code-review' as const,
      difficulty: 'intermediate' as const,
      code: '// Paste your code here for review\nfunction example() {\n  return "Hello, World!";\n}',
      language: 'javascript'
    };
    
    addPost(codeReviewPost);
    toast({
      title: "🔍 Code Review Created!",
      description: "Your code review request has been posted. Edit it to add your code.",
    });
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 overflow-y-auto">
      <div className="h-full">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="playground" className="flex items-center gap-2" data-onboarding="playground-tab">
                <Play className="h-4 w-4" />
                Playground
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 p-6 m-0">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Quick Actions
                </h3>
                
                <CreatePostButton onCreatePost={addPost} />
                
                <Button 
                  onClick={handleJoinDiscussion}
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500 transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
                
                <Button 
                  onClick={handleCodeReview}
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-green-500 transition-all duration-300"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Code Review
                </Button>
              </div>

              <Separator className="border-gray-700" />

              {/* Community Stats */}
              <CommunityStats />

              <Separator className="border-gray-700" />

              {/* Popular Tags */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-400" />
                  Popular Tags
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300 cursor-pointer transition-all duration-300"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="border-gray-700" />

              {/* Recent Activity */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Recent Activity
                </h3>
                
                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                      <activity.icon className="h-4 w-4 text-gray-500" />
                      <span className="line-clamp-1">{activity.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="playground" className="flex-1 p-4 m-0 overflow-y-auto">
            <CodePlayground />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
};

export default Sidebar;

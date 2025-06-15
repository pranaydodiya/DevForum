
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings,
  BarChart3,
  Filter,
  Code,
  Github,
  Chrome,
  Webhook,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useNavigate } from 'react-router-dom';
import UserAnalytics from '@/components/UserAnalytics';
import UserInsightsDashboard from '@/components/UserInsightsDashboard';
import CustomFeedManager from '@/components/CustomFeedManager';
import WebhooksApiAccess from '@/components/WebhooksApiAccess';
import GitHubSync from '@/components/GitHubSync';
import BrowserExtension from '@/components/BrowserExtension';

// Define the FeedSubscription type to match CustomFeedManager's interface
type FeedSubscription = {
  id: string;
  type: 'tag' | 'user' | 'topic';
  name: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  notifications: boolean;
};

const Profile = () => {
  const { user } = useAuth();
  const { posts, myPosts, savedPosts, starredPosts } = usePosts();
  const navigate = useNavigate();
  const [feedSubscriptions, setFeedSubscriptions] = useState<FeedSubscription[]>([
    { id: '1', type: 'tag', name: 'react', enabled: true, priority: 'high', notifications: true },
    { id: '2', type: 'user', name: 'alex-rodriguez', enabled: true, priority: 'medium', notifications: false },
    { id: '3', type: 'topic', name: 'performance-optimization', enabled: true, priority: 'high', notifications: true }
  ]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  // Check if this is a new user (created after signup)
  const isNewUser = user.id !== '1' && user.reputation === 0;

  const mockInsights = isNewUser ? [] : [
    {
      postId: '1',
      title: 'How to optimize React rendering performance?',
      views: 1250,
      upvotes: 22,
      comments: 12,
      saves: 8,
      shares: 3,
      engagementRate: 85.2,
      createdAt: '2024-06-14T10:30:00Z'
    },
    {
      postId: '2',
      title: 'TypeScript API Client Implementation',
      views: 890,
      upvotes: 17,
      comments: 8,
      saves: 12,
      shares: 5,
      engagementRate: 78.4,
      createdAt: '2024-06-13T09:15:00Z'
    }
  ];

  const userStats = isNewUser ? {
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalStars: 0,
    savedPosts: 0,
    followersCount: 0,
    followingCount: 0,
    streakDays: 0
  } : {
    totalPosts: myPosts.length,
    totalViews: 3140,
    totalComments: 28,
    totalStars: 45,
    savedPosts: savedPosts.length,
    followersCount: 234,
    followingCount: 67,
    streakDays: 15
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="glass border border-gray-600/50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-blue-500/30">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-gray-400 mb-4">{user.email}</p>
                
                <div className="flex items-center gap-4">
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                    {user.reputation} Reputation
                  </Badge>
                  <Badge variant="outline">
                    Member since {new Date(user.joinDate).getFullYear()}
                  </Badge>
                  {isNewUser && (
                    <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                      New Member
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-600/50">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="feeds" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Custom Feeds
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              API & Webhooks
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Sync
            </TabsTrigger>
            <TabsTrigger value="extension" className="flex items-center gap-2">
              <Chrome className="h-4 w-4" />
              Extension
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <UserAnalytics user={user} stats={userStats} />
          </TabsContent>

          <TabsContent value="insights">
            <UserInsightsDashboard 
              posts={mockInsights}
              profileViews={isNewUser ? 0 : 1250}
              totalReach={isNewUser ? 0 : 3140}
              engagementScore={isNewUser ? 0 : 82}
            />
          </TabsContent>

          <TabsContent value="feeds">
            <CustomFeedManager 
              subscriptions={isNewUser ? [] : feedSubscriptions}
              onUpdateSubscriptions={setFeedSubscriptions}
            />
          </TabsContent>

          <TabsContent value="api">
            <WebhooksApiAccess />
          </TabsContent>

          <TabsContent value="github">
            <GitHubSync />
          </TabsContent>

          <TabsContent value="extension">
            <BrowserExtension />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

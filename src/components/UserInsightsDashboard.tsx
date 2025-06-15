
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Bookmark,
  Calendar,
  Target,
  BarChart3,
  Globe
} from 'lucide-react';

interface PostInsights {
  postId: string;
  title: string;
  views: number;
  upvotes: number;
  comments: number;
  saves: number;
  shares: number;
  engagementRate: number;
  createdAt: string;
}

interface UserInsightsDashboardProps {
  posts: PostInsights[];
  profileViews: number;
  totalReach: number;
  engagementScore: number;
}

const UserInsightsDashboard = ({ 
  posts, 
  profileViews, 
  totalReach, 
  engagementScore 
}: UserInsightsDashboardProps) => {
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalUpvotes = posts.reduce((sum, post) => sum + post.upvotes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const totalSaves = posts.reduce((sum, post) => sum + post.saves, 0);
  
  const avgEngagement = posts.length > 0 
    ? posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length 
    : 0;

  const topPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return 'text-green-400';
    if (rate >= 60) return 'text-blue-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <BarChart3 className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Content Insights</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Views</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <div className="text-2xl font-bold text-white">{totalUpvotes}</div>
            <div className="text-sm text-gray-400">Upvotes</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{totalComments}</div>
            <div className="text-sm text-gray-400">Comments</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{totalSaves}</div>
            <div className="text-sm text-gray-400">Saves</div>
          </CardContent>
        </Card>
      </div>

      {/* Reach & Engagement */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              Reach & Profile Views
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">{totalReach.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Reach</div>
            </div>
            
            <div className="text-center glass p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">{profileViews.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Profile Views</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Score</span>
                <span className={`font-bold ${getEngagementColor(engagementScore)}`}>
                  {engagementScore}%
                </span>
              </div>
              <Progress value={engagementScore} className="h-3" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Engagement</span>
                <span className={`font-bold ${getEngagementColor(avgEngagement)}`}>
                  {avgEngagement.toFixed(1)}%
                </span>
              </div>
              <Progress value={avgEngagement} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-400" />
            Top Performing Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.postId} className="glass p-4 rounded-lg border border-gray-600/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">{post.title}</h4>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{post.views.toLocaleString()}</div>
                        <div className="text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{post.upvotes}</div>
                        <div className="text-gray-500">Upvotes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold">{post.comments}</div>
                        <div className="text-gray-500">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-bold">{post.saves}</div>
                        <div className="text-gray-500">Saves</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getEngagementColor(post.engagementRate)}`}>
                      {post.engagementRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">Engagement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserInsightsDashboard;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Star, 
  Code, 
  Trophy, 
  Users, 
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { useUsers } from '@/contexts/UsersContext';
import { useStreak } from '@/contexts/StreakContext';
import { useAuth } from '@/contexts/AuthContext';

interface UserAnalyticsProps {
  user: {
    name: string;
    reputation: number;
    joinDate: string;
  };
  stats: {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    totalStars: number;
    savedPosts: number;
    followersCount: number;
    followingCount: number;
    streakDays: number;
  };
}

const UserAnalytics = ({ user, stats }: UserAnalyticsProps) => {
  const { getFollowersCount, getFollowingCount } = useUsers();
  const { streakDays } = useStreak();
  const { user: currentUser } = useAuth();

  // Check if this is a new user (created after signup)
  const isNewUser = currentUser && currentUser.id !== '1' && currentUser.reputation === 0;

  // Update stats with real data, but reset for new users
  const realStats = isNewUser ? {
    totalPosts: 0,
    totalViews: 0,
    totalComments: 0,
    totalStars: 0,
    savedPosts: 0,
    followersCount: 0,
    followingCount: 0,
    streakDays: 0
  } : {
    ...stats,
    followersCount: getFollowersCount(),
    followingCount: getFollowingCount(),
    streakDays: streakDays
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 5000) return { level: 'Expert', color: 'text-purple-400', progress: 100 };
    if (reputation >= 2000) return { level: 'Advanced', color: 'text-blue-400', progress: 80 };
    if (reputation >= 1000) return { level: 'Intermediate', color: 'text-green-400', progress: 60 };
    if (reputation >= 500) return { level: 'Beginner+', color: 'text-yellow-400', progress: 40 };
    return { level: 'Beginner', color: 'text-gray-400', progress: 20 };
  };

  const reputationInfo = getReputationLevel(user.reputation);
  const engagementRate = ((realStats.totalComments + realStats.totalStars) / Math.max(realStats.totalPosts, 1) * 100).toFixed(1);
  const avgViewsPerPost = Math.round(realStats.totalViews / Math.max(realStats.totalPosts, 1));

  const achievements = [
    { name: 'First Post', earned: realStats.totalPosts >= 1, icon: Code },
    { name: 'Popular Author', earned: realStats.totalViews >= 1000, icon: Eye },
    { name: 'Community Helper', earned: realStats.totalComments >= 50, icon: MessageSquare },
    { name: 'Rising Star', earned: realStats.totalStars >= 25, icon: Star },
    { name: 'Consistent Contributor', earned: realStats.streakDays >= 7, icon: Calendar },
    { name: 'Reputation Master', earned: user.reputation >= 2000, icon: Trophy },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievements = achievements.filter(a => !a.earned).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <TrendingUp className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Analytics Dashboard</h2>
      </div>

      {isNewUser && (
        <Card className="glass border border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Star className="h-5 w-5" />
              <span className="font-semibold">Welcome to DevForum!</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Start by creating your first post or engaging with the community to build your stats and reputation.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Code className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{realStats.totalPosts}</div>
            <div className="text-sm text-gray-400">Posts Created</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{realStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Views</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{realStats.totalComments}</div>
            <div className="text-sm text-gray-400">Comments</div>
          </CardContent>
        </Card>
        
        <Card className="glass border border-gray-600/50">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{realStats.totalStars}</div>
            <div className="text-sm text-gray-400">Stars Received</div>
          </CardContent>
        </Card>
      </div>

      {/* Reputation & Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Reputation Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={`bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 ${reputationInfo.color}`}>
                {reputationInfo.level}
              </Badge>
              <span className="text-2xl font-bold text-white">{user.reputation}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to next level</span>
                <span className="text-gray-300">{reputationInfo.progress}%</span>
              </div>
              <Progress value={reputationInfo.progress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center glass p-3 rounded-lg">
                <div className="text-lg font-bold text-white">{engagementRate}%</div>
                <div className="text-xs text-gray-400">Engagement Rate</div>
              </div>
              <div className="text-center glass p-3 rounded-lg">
                <div className="text-lg font-bold text-white">{avgViewsPerPost}</div>
                <div className="text-xs text-gray-400">Avg Views/Post</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Community Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center glass p-3 rounded-lg">
                <div className="text-xl font-bold text-blue-400">{realStats.followersCount}</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center glass p-3 rounded-lg">
                <div className="text-xl font-bold text-purple-400">{realStats.followingCount}</div>
                <div className="text-sm text-gray-400">Following</div>
              </div>
            </div>
            
            <div className="text-center glass p-4 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-orange-400" />
                <span className="text-xl font-bold text-orange-400">{realStats.streakDays}</span>
              </div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </div>
            
            <div className="text-center glass p-3 rounded-lg">
              <div className="text-lg font-bold text-green-400">{realStats.savedPosts}</div>
              <div className="text-sm text-gray-400">Saved Posts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-3">Earned ({earnedAchievements.length}/{achievements.length})</h4>
            {earnedAchievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {earnedAchievements.map((achievement) => (
                  <div key={achievement.name} className="glass p-3 rounded-lg border border-green-500/30">
                    <achievement.icon className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white text-center">{achievement.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                No achievements earned yet. Start engaging with the community!
              </div>
            )}
          </div>
          
          {nextAchievements.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3">Next Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nextAchievements.map((achievement) => (
                  <div key={achievement.name} className="glass p-3 rounded-lg border border-gray-600/30 opacity-60">
                    <achievement.icon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-300 text-center">{achievement.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAnalytics;

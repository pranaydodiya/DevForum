
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/contexts/UsersContext';
import { useStreak } from '@/contexts/StreakContext';
import { usePosts } from '@/hooks/usePosts';
import { Users, Zap, Bookmark, UserPlus, UserMinus, Crown, Star, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommunityStats = () => {
  const { users, followUser, unfollowUser, getFollowersCount, getFollowingCount } = useUsers();
  const { streakDays } = useStreak();
  const { savedPosts } = usePosts();
  const { toast } = useToast();

  const handleFollowToggle = (userId: string, isCurrentlyFollowing: boolean, userName: string) => {
    if (isCurrentlyFollowing) {
      unfollowUser(userId);
      toast({
        title: "✅ Unfollowed",
        description: `You have unfollowed ${userName}.`,
      });
    } else {
      followUser(userId);
      toast({
        title: "🎉 Following!",
        description: `You are now following ${userName}. You'll see their posts in your feed.`,
      });
    }
  };

  const getReputationColor = (reputation: number) => {
    if (reputation >= 2500) return 'from-yellow-400 to-orange-500';
    if (reputation >= 2000) return 'from-purple-400 to-pink-500';
    if (reputation >= 1500) return 'from-blue-400 to-cyan-500';
    return 'from-green-400 to-emerald-500';
  };

  const getReputationIcon = (reputation: number) => {
    if (reputation >= 2500) return <Crown className="h-4 w-4" />;
    if (reputation >= 2000) return <Star className="h-4 w-4" />;
    return <MessageCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <Card className="glass border border-gray-600/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-blue-400" />
            Your Community Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center glass p-4 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {getFollowersCount()}
              </div>
              <div className="text-sm text-gray-300 font-medium">Followers</div>
            </div>
            <div className="text-center glass p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {getFollowingCount()}
              </div>
              <div className="text-sm text-gray-300 font-medium">Following</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center glass p-4 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-orange-400" />
                <span className="text-2xl font-bold text-orange-400">{streakDays}</span>
              </div>
              <div className="text-sm text-gray-300 font-medium">Day Streak</div>
            </div>

            <div className="text-center glass p-4 rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Bookmark className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold text-green-400">{savedPosts.length}</span>
              </div>
              <div className="text-sm text-gray-300 font-medium">Saved Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Community Members */}
      <Card className="glass border border-gray-600/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Community Members
            </div>
            <Badge variant="outline" className="border-blue-500/50 text-blue-300 bg-blue-500/10">
              {users.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="group relative p-4 glass rounded-xl border border-gray-700/30 bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:border-blue-500/50 hover:from-blue-900/20 hover:to-purple-900/20 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Background glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-600 group-hover:ring-blue-500/50 transition-all duration-300">
                      <AvatarFallback className={`bg-gradient-to-br ${getReputationColor(user.reputation)} text-white font-bold text-lg`}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {/* Status indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      {getReputationIcon(user.reputation)}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {user.name}
                      </h4>
                      {user.reputation >= 2500 && (
                        <Crown className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`border-gray-600/50 text-xs bg-gradient-to-r ${getReputationColor(user.reputation)} bg-clip-text text-transparent border-opacity-50`}
                      >
                        {user.reputation.toLocaleString()} rep
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    {user.bio && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant={user.isFollowing ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleFollowToggle(user.id, user.isFollowing || false, user.name)}
                    className={`min-w-[100px] text-xs transition-all duration-300 ${
                      user.isFollowing 
                        ? "bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-500/25" 
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg shadow-blue-500/25"
                    }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <UserMinus className="h-3 w-3 mr-1" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" />
                        Follow
                      </>
                    )}
                  </Button>
                  
                  {/* Reputation level indicator */}
                  <div className="text-xs text-center">
                    <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${getReputationColor(user.reputation)} mb-1`} />
                    <span className="text-gray-500">
                      {user.reputation >= 2500 ? 'Expert' : 
                       user.reputation >= 2000 ? 'Advanced' : 
                       user.reputation >= 1500 ? 'Intermediate' : 'Beginner'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Load more button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-600/50 text-gray-300 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:border-blue-500/50 transition-all duration-300"
            >
              View All Members
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;

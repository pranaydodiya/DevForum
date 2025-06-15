
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useEngagement } from '@/contexts/EngagementContext';
import { 
  Trophy, 
  TrendingUp, 
  Award, 
  Star, 
  Target, 
  Calendar,
  Code,
  ThumbsUp,
  MessageSquare,
  Zap
} from 'lucide-react';

const ReputationDashboard = () => {
  const { 
    reputation, 
    badges, 
    skillTags, 
    reputationHistory, 
    leaderboard,
    endorseSkill 
  } = useEngagement();

  const earnedBadges = badges.filter(badge => badge.earnedAt);
  const nextBadges = badges.filter(badge => !badge.earnedAt).slice(0, 3);
  
  const reputationLevel = () => {
    if (reputation >= 5000) return { level: 'Expert', progress: 100, color: 'text-purple-400' };
    if (reputation >= 2000) return { level: 'Advanced', progress: 80, color: 'text-blue-400' };
    if (reputation >= 1000) return { level: 'Intermediate', progress: 60, color: 'text-green-400' };
    if (reputation >= 500) return { level: 'Beginner+', progress: 40, color: 'text-yellow-400' };
    return { level: 'Beginner', progress: 20, color: 'text-gray-400' };
  };

  const { level, progress, color } = reputationLevel();
  const currentUserRank = leaderboard.findIndex(user => user.userId === 'current') + 1;

  return (
    <div className="space-y-6">
      {/* Reputation Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Reputation Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{reputation.toLocaleString()}</div>
              <Badge className={`${color} bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30`}>
                {level}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress to Expert</span>
                <span className="text-gray-300">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-400" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
              <div className="text-sm text-gray-400">Badges Earned</div>
              <div className="flex flex-wrap gap-1 justify-center">
                {earnedBadges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="text-2xl" title={badge.name}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Leaderboard Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-green-400">#{currentUserRank}</div>
              <div className="text-sm text-gray-400">Community Ranking</div>
              <div className="text-xs text-gray-500">
                Based on reputation & weekly activity
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            Recent Reputation Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reputationHistory.length > 0 ? (
              reputationHistory.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.type === 'upvote' && <ThumbsUp className="h-4 w-4 text-green-400" />}
                    {activity.type === 'accepted_answer' && <Star className="h-4 w-4 text-yellow-400" />}
                    {activity.type === 'helpful_comment' && <MessageSquare className="h-4 w-4 text-blue-400" />}
                    {activity.type === 'streak' && <Zap className="h-4 w-4 text-orange-400" />}
                    {activity.type === 'challenge_win' && <Trophy className="h-4 w-4 text-purple-400" />}
                    <div>
                      <div className="text-sm text-white">{activity.description}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    +{activity.points}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p>Start contributing to earn reputation points!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skill Tags */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-green-400" />
            Skill Tags & Endorsements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {skillTags.map((skill) => (
              <div key={skill.tag} className="glass p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      {skill.tag}
                    </Badge>
                    <Badge className={`text-xs ${
                      skill.level === 'expert' ? 'bg-purple-500/20 text-purple-300' :
                      skill.level === 'advanced' ? 'bg-blue-500/20 text-blue-300' :
                      skill.level === 'intermediate' ? 'bg-green-500/20 text-green-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {skill.level}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-blue-400 hover:text-blue-300"
                    onClick={() => endorseSkill(skill.tag)}
                  >
                    Endorse
                  </Button>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{skill.endorsements} endorsements</span>
                  <span>{skill.codeContributions} contributions</span>
                </div>
                {skill.autoGenerated && (
                  <div className="text-xs text-gray-500 mt-1">Auto-detected from code</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Badges */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-yellow-400" />
            Next Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {nextBadges.map((badge) => (
              <div key={badge.id} className="glass p-4 rounded-lg border border-gray-700/30 opacity-70">
                <div className="text-center space-y-2">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="font-medium text-white">{badge.name}</div>
                  <div className="text-sm text-gray-400">{badge.description}</div>
                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                    {badge.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReputationDashboard;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEngagement } from '@/contexts/EngagementContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Code, 
  Trophy, 
  Timer, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  Calendar,
  Users,
  Zap,
  Award
} from 'lucide-react';

const CodeChallenges = () => {
  const { challenges, submitChallenge, voteOnSubmission, leaderboard } = useEngagement();
  const { toast } = useToast();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [submissionCode, setSubmissionCode] = useState('');
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');

  const handleSubmitChallenge = (challengeId: string) => {
    if (!submissionCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please write some code before submitting.",
        variant: "destructive"
      });
      return;
    }

    submitChallenge(challengeId, submissionCode);
    setSubmissionCode('');
    setSelectedChallenge(null);
    
    toast({
      title: "Challenge Submitted! 🚀",
      description: "Your solution has been submitted and is now available for voting.",
    });
  };

  const handleVote = (submissionId: string, vote: 'up' | 'down') => {
    voteOnSubmission(submissionId, vote);
    toast({
      title: vote === 'up' ? "Upvoted! 👍" : "Downvoted 👎",
      description: "Your vote has been recorded.",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          <Code className="h-6 w-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Code Challenges</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'challenges' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('challenges')}
          className={activeTab === 'challenges' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-400'}
        >
          <Code className="h-4 w-4 mr-2" />
          Active Challenges
        </Button>
        <Button
          variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('leaderboard')}
          className={activeTab === 'leaderboard' ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-400'}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Leaderboard
        </Button>
      </div>

      {activeTab === 'challenges' && (
        <div className="space-y-6">
          {/* Active Challenges */}
          <div className="grid gap-6">
            {challenges.filter(c => c.isActive).map((challenge) => (
              <Card key={challenge.id} className="glass border border-gray-600/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-white mb-2">{challenge.title}</CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {challenge.language}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm">{getTimeRemaining(challenge.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{challenge.submissions.length}</div>
                      <div className="text-sm text-gray-400">Submissions</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">{challenge.description}</p>
                  
                  {selectedChallenge === challenge.id ? (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Write your solution here..."
                        value={submissionCode}
                        onChange={(e) => setSubmissionCode(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white font-mono text-sm min-h-32"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitChallenge(challenge.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Solution
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedChallenge(null);
                            setSubmissionCode('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedChallenge(challenge.id)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Submit Solution
                    </Button>
                  )}

                  {/* Top Submissions */}
                  {challenge.submissions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Top Submissions</h4>
                      {challenge.submissions
                        .sort((a, b) => b.votes - a.votes)
                        .slice(0, 3)
                        .map((submission) => (
                          <div key={submission.id} className="glass p-4 rounded-lg border border-gray-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-white">{submission.userName}</span>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                  {submission.performance}% efficiency
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                  onClick={() => handleVote(submission.id, 'up')}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                                <span className="text-white font-medium">{submission.votes}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  onClick={() => handleVote(submission.id, 'down')}
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto border border-gray-700">
                              <code>{submission.code}</code>
                            </pre>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Community Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-4 glass rounded-lg border border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.userName}</div>
                      <div className="text-sm text-gray-400">
                        {user.reputation.toLocaleString()} reputation • {user.badges} badges
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">+{user.weeklyPoints}</div>
                    <div className="text-sm text-gray-400">this week</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeChallenges;

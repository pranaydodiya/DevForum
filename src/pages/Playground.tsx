import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Save, 
  Share2, 
  Download, 
  Settings,
  Zap,
  Trophy,
  Clock,
  Users,
  Star,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CodePlayground from '@/components/playground/CodePlayground';
import TrendingSnippets, { TrendingSnippet } from '@/components/playground/TrendingSnippets';
import CreateSnippetModal from '@/components/playground/CreateSnippetModal';
import ShareSnippetModal from '@/components/playground/ShareSnippetModal';
import { useToast } from '@/hooks/use-toast';

const Playground = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('playground');
  const [challengeMode, setChallengeMode] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [loadedSnippet, setLoadedSnippet] = useState<TrendingSnippet | null>(null);
  const [showCreateSnippet, setShowCreateSnippet] = useState(false);
  const [showShareSnippet, setShowShareSnippet] = useState(false);
  const [currentCode, setCurrentCode] = useState('// Welcome to Code Playground\nconsole.log("Hello, World!");');
  const [currentLanguage, setCurrentLanguage] = useState<'javascript' | 'python' | 'cpp' | 'html' | 'css'>('javascript');
  const { toast } = useToast();

  // Challenge timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (challengeMode && challengeTimeLeft > 0 && !challengeCompleted) {
      interval = setInterval(() => {
        setChallengeTimeLeft(prev => {
          if (prev <= 1) {
            handleChallengeTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [challengeMode, challengeTimeLeft, challengeCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChallengeTimeout = () => {
    toast({
      title: "Time's Up! ⏰",
      description: "Challenge time has expired. You can still continue working or submit your solution.",
      variant: "destructive"
    });
  };

  const handleSubmitChallenge = () => {
    setChallengeCompleted(true);
    toast({
      title: "Challenge Submitted! 🎉",
      description: `Great work! Your solution for "${selectedChallenge?.title}" has been submitted.`,
    });
  };

  const handleCreateNewSnippet = () => {
    setShowCreateSnippet(true);
  };

  const handleShareSnippet = () => {
    if (!currentCode.trim()) {
      toast({
        title: "Nothing to Share",
        description: "Please write some code before sharing.",
        variant: "destructive"
      });
      return;
    }
    setShowShareSnippet(true);
  };

  const handleSnippetCreated = (snippet: any) => {
    setCurrentCode(snippet.code);
    setCurrentLanguage(snippet.language);
    setLoadedSnippet(null);
    setChallengeMode(false);
    setActiveTab('playground');
    
    toast({
      title: "Snippet Created! 🎉",
      description: `Your new "${snippet.title}" snippet is ready to use.`,
    });
  };

  const handleSnippetShared = (shareData: any) => {
    toast({
      title: "Snippet Shared! 🚀",
      description: `Your snippet has been shared ${shareData.method === 'link' ? 'via link' : shareData.method === 'social' ? 'on social media' : 'to the community'}.`,
    });
  };

  const stats = {
    totalSnippets: 142,
    publicSnippets: 89,
    privateSnippets: 53,
    totalViews: 3420,
    totalLikes: 287,
    totalForks: 156
  };

  const recentSnippets = [
    {
      id: '1',
      title: 'React Custom Hook for API Calls',
      language: 'typescript',
      views: 234,
      likes: 18,
      forks: 7,
      createdAt: '2 hours ago',
      isPublic: true
    },
    {
      id: '2',
      title: 'CSS Grid Layout Helper',
      language: 'css',
      views: 156,
      likes: 12,
      forks: 4,
      createdAt: '1 day ago',
      isPublic: true
    },
    {
      id: '3',
      title: 'Python Data Processing Script',
      language: 'python',
      views: 89,
      likes: 5,
      forks: 2,
      createdAt: '3 days ago',
      isPublic: false
    }
  ];

  const challenges = [
    {
      id: '1',
      title: 'Fibonacci Sequence Generator',
      difficulty: 'Easy',
      language: 'javascript',
      participants: 1247,
      timeLimit: '30 minutes',
      timeLimitSeconds: 1800,
      description: 'Write a function that generates the Fibonacci sequence up to the nth number.',
      starterCode: `// Write a function to generate Fibonacci sequence
function fibonacci(n) {
  // Your code here
}

// Test your function
console.log(fibonacci(10));`
    },
    {
      id: '2',
      title: 'Binary Tree Traversal',
      difficulty: 'Medium',
      language: 'python',
      participants: 892,
      timeLimit: '45 minutes',
      timeLimitSeconds: 2700,
      description: 'Implement in-order, pre-order, and post-order traversal for a binary tree.',
      starterCode: `# Binary Tree Node class
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root):
    # Your code here
    pass

def preorder_traversal(root):
    # Your code here
    pass

def postorder_traversal(root):
    # Your code here
    pass

# Test your functions
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
print("Inorder:", inorder_traversal(root))`
    },
    {
      id: '3',
      title: 'React Performance Optimization',
      difficulty: 'Hard',
      language: 'javascript',
      participants: 534,
      timeLimit: '60 minutes',
      timeLimitSeconds: 3600,
      description: 'Optimize a React component to prevent unnecessary re-renders.',
      starterCode: `// Optimize this React component
import React, { useState, useEffect } from 'react';

const ExpensiveComponent = ({ data, onUpdate }) => {
  const [count, setCount] = useState(0);
  
  // This component re-renders too often
  // Your task: optimize it using React.memo, useMemo, useCallback
  
  useEffect(() => {
    console.log('Component rendered');
  });
  
  const processData = () => {
    // Expensive operation
    return data.map(item => item * 2);
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <div>{processData().join(', ')}</div>
    </div>
  );
};

export default ExpensiveComponent;`
    }
  ];

  const handleStartChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setChallengeMode(true);
    setChallengeTimeLeft(challenge.timeLimitSeconds);
    setChallengeCompleted(false);
    setActiveTab('playground');
    setLoadedSnippet(null);
    setCurrentCode(challenge.starterCode);
    setCurrentLanguage(challenge.language);
    
    toast({
      title: "Challenge Started! 🚀",
      description: `Starting "${challenge.title}" - ${challenge.timeLimit} to complete`,
    });
  };

  const handleExitChallenge = () => {
    setChallengeMode(false);
    setSelectedChallenge(null);
    setChallengeTimeLeft(0);
    setChallengeCompleted(false);
    
    toast({
      title: "Challenge Exited",
      description: "Returned to normal playground mode",
    });
  };

  const handleLoadSnippet = (snippet: TrendingSnippet) => {
    setLoadedSnippet(snippet);
    setActiveTab('playground');
    setChallengeMode(false);
    setSelectedChallenge(null);
    setCurrentCode(snippet.code);
    setCurrentLanguage(snippet.language as any);
    
    toast({
      title: "Snippet Loaded! 🎉",
      description: `Successfully loaded "${snippet.title}" by ${snippet.author}`,
    });
  };

  const handleRunSnippet = (snippet: any) => {
    setLoadedSnippet(snippet);
    setActiveTab('playground');
    
    toast({
      title: "Running Snippet! ▶️",
      description: `Executing "${snippet.title}" in the playground`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 float">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold gradient-text">Code Playground</h1>
                {challengeMode && (
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className="bg-red-600 text-white">
                      Challenge: {selectedChallenge?.title}
                    </Badge>
                    <Badge variant="outline" className={`${
                      challengeTimeLeft > 300 ? 'border-green-500 text-green-400' :
                      challengeTimeLeft > 60 ? 'border-yellow-500 text-yellow-400' :
                      'border-red-500 text-red-400'
                    }`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(challengeTimeLeft)}
                    </Badge>
                    {challengeCompleted && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-lg ml-14">
                {challengeMode 
                  ? `Solve the challenge within ${selectedChallenge?.timeLimit}` 
                  : loadedSnippet
                  ? `Running: ${loadedSnippet.title} by ${loadedSnippet.author}`
                  : 'Write, test, and share code snippets in real-time'
                }
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {challengeMode ? (
              <div className="flex gap-2">
                {!challengeCompleted && challengeTimeLeft > 0 && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSubmitChallenge}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Solution
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleExitChallenge}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Exit Challenge
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleCreateNewSnippet}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Snippet
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={handleShareSnippet}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid - only show when not in challenge mode */}
        {!challengeMode && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">Total Snippets</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalSnippets}</p>
              </CardContent>
            </Card>

            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-400 text-sm">Total Likes</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalLikes}</p>
              </CardContent>
            </Card>

            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400 text-sm">Total Forks</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalForks}</p>
              </CardContent>
            </Card>

            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="text-gray-400 text-sm">Public</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.publicSnippets}</p>
              </CardContent>
            </Card>

            <Card className="glass border border-gray-600/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-400 text-sm">Private</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.privateSnippets}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {challengeMode ? (
          <div className="space-y-6">
            <Card className="glass border border-red-600/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Challenge: {selectedChallenge?.title}
                  {challengeCompleted && (
                    <Badge className="bg-green-600 text-white ml-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-gray-300">{selectedChallenge?.description}</p>
                <div className="flex gap-2">
                  <Badge className={
                    selectedChallenge?.difficulty === 'Easy' ? 'bg-green-600' :
                    selectedChallenge?.difficulty === 'Medium' ? 'bg-yellow-600' : 'bg-red-600'
                  }>
                    {selectedChallenge?.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedChallenge?.language}</Badge>
                  <Badge variant="outline" className={`${
                    challengeTimeLeft > 300 ? 'border-green-500 text-green-400' :
                    challengeTimeLeft > 60 ? 'border-yellow-500 text-yellow-400' :
                    'border-red-500 text-red-400'
                  }`}>
                    Time: {formatTime(challengeTimeLeft)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
            
            <CodePlayground 
              contextSnippet={currentCode}
              contextLanguage={currentLanguage}
            />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-600/50">
              <TabsTrigger value="playground" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Playground
              </TabsTrigger>
              <TabsTrigger value="snippets" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                My Snippets
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Challenges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playground">
              <CodePlayground 
                contextSnippet={currentCode}
                contextLanguage={currentLanguage}
              />
            </TabsContent>

            <TabsContent value="snippets">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">My Code Snippets</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleCreateNewSnippet}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      New Snippet
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {recentSnippets.map((snippet) => (
                    <Card key={snippet.id} className="glass border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-2">{snippet.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                {snippet.language}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {snippet.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {snippet.likes}
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-3 w-3" />
                                {snippet.forks}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {snippet.createdAt}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={snippet.isPublic ? "default" : "secondary"}>
                              {snippet.isPublic ? "Public" : "Private"}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleRunSnippet(snippet)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <TrendingSnippets onLoadSnippet={handleLoadSnippet} />
            </TabsContent>

            <TabsContent value="challenges">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Code Challenges</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Trophy className="h-4 w-4 mr-2" />
                    Create Challenge
                  </Button>
                </div>

                <div className="grid gap-4">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className="glass border border-gray-600/50 hover:border-green-500/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-2">{challenge.title}</h4>
                            <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <Badge 
                                variant="outline" 
                                className={`${
                                  challenge.difficulty === 'Easy' ? 'border-green-500/30 text-green-400' :
                                  challenge.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400' :
                                  'border-red-500/30 text-red-400'
                                }`}
                              >
                                {challenge.difficulty}
                              </Badge>
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                {challenge.language}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {challenge.participants} participants
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {challenge.timeLimit}
                              </div>
                            </div>
                          </div>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStartChallenge(challenge)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Challenge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Modals */}
      <CreateSnippetModal
        open={showCreateSnippet}
        onOpenChange={setShowCreateSnippet}
        onSnippetCreated={handleSnippetCreated}
      />
      
      <ShareSnippetModal
        open={showShareSnippet}
        onOpenChange={setShowShareSnippet}
        snippet={{
          title: loadedSnippet?.title || 'My Code Snippet',
          code: currentCode,
          language: currentLanguage,
          author: 'Current User'
        }}
        onSnippetShared={handleSnippetShared}
      />
    </div>
  );
};

export default Playground;

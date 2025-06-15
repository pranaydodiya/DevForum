
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Video, Share, Copy, Eye, Edit, MessageCircle, Code2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'coding' | 'viewing' | 'away';
  cursor?: { line: number; column: number };
  selection?: { start: number; end: number };
}

interface PairSession {
  id: string;
  title: string;
  language: string;
  code: string;
  host: string;
  collaborators: Collaborator[];
  isActive: boolean;
  createdAt: string;
}

const LivePairProgramming = () => {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<PairSession | null>(null);
  const [code, setCode] = useState('// Welcome to Live Pair Programming!\n// Invite collaborators to code together in real-time\n\nfunction welcome() {\n  console.log("Let\'s code together!");\n}');
  const [inviteEmail, setInviteEmail] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [language, setLanguage] = useState('javascript');

  const mockCollaborators: Collaborator[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/placeholder.svg',
      status: 'coding',
      cursor: { line: 5, column: 10 }
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: '/placeholder.svg',
      status: 'viewing'
    },
    {
      id: '3',
      name: 'Alex Rivera',
      avatar: '/placeholder.svg',
      status: 'online'
    }
  ];

  const mockSessions: PairSession[] = [
    {
      id: '1',
      title: 'React Component Refactoring',
      language: 'javascript',
      code: 'const Component = () => {\n  return <div>Hello World</div>;\n};',
      host: 'You',
      collaborators: mockCollaborators.slice(0, 2),
      isActive: true,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Python Data Analysis',
      language: 'python',
      code: 'import pandas as pd\n\ndata = pd.read_csv("data.csv")',
      host: 'Sarah Chen',
      collaborators: [mockCollaborators[0]],
      isActive: false,
      createdAt: '1 day ago'
    }
  ];

  const [sessions, setSessions] = useState(mockSessions);

  const startSession = () => {
    if (!sessionTitle.trim()) {
      toast({
        title: "Session Title Required",
        description: "Please enter a title for your coding session.",
        variant: "destructive"
      });
      return;
    }

    const newSession: PairSession = {
      id: Date.now().toString(),
      title: sessionTitle,
      language,
      code,
      host: 'You',
      collaborators: [],
      isActive: true,
      createdAt: 'just now'
    };

    setCurrentSession(newSession);
    setIsSessionActive(true);
    setSessions(prev => [newSession, ...prev]);

    toast({
      title: "Live Session Started! 🚀",
      description: "Your pair programming session is now active. Share the invite link with collaborators.",
    });
  };

  const inviteCollaborator = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending invitation
    toast({
      title: "Invitation Sent! 📧",
      description: `Collaboration invite sent to ${inviteEmail}`,
    });
    setInviteEmail('');
  };

  const copySessionLink = () => {
    const sessionLink = `https://devforum.dev/pair/${currentSession?.id}`;
    navigator.clipboard.writeText(sessionLink);
    toast({
      title: "Link Copied! 📋",
      description: "Session link copied to clipboard. Share it with collaborators.",
    });
  };

  const endSession = () => {
    setIsSessionActive(false);
    setCurrentSession(null);
    toast({
      title: "Session Ended",
      description: "Your pair programming session has been ended.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'coding': return 'bg-green-500';
      case 'viewing': return 'bg-blue-500';
      case 'online': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'coding': return <Edit className="h-3 w-3" />;
      case 'viewing': return <Eye className="h-3 w-3" />;
      case 'online': return <Users className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session */}
      {isSessionActive && currentSession ? (
        <Card className="glass border border-green-500/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-300 flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Live Session: {currentSession.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {currentSession.collaborators.length} collaborators • {currentSession.language}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={copySessionLink} variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={endSession} variant="destructive" size="sm">
                  End Session
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Collaborators */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-400">Active collaborators:</span>
              <div className="flex -space-x-2">
                {currentSession.collaborators.map((collaborator) => (
                  <div key={collaborator.id} className="relative">
                    <Avatar className="h-8 w-8 border-2 border-gray-800">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback className="text-xs">{collaborator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(collaborator.status)} flex items-center justify-center`}>
                      <div className="text-white text-xs">
                        {getStatusIcon(collaborator.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Editor Simulation */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">{language}</Badge>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live editing active
                </div>
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[200px] bg-transparent border-none resize-none font-mono text-green-300"
                placeholder="Start coding together..."
              />
              
              {/* Cursor indicators */}
              <div className="mt-2 space-y-1">
                {currentSession.collaborators.filter(c => c.cursor).map((collaborator) => (
                  <div key={collaborator.id} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(collaborator.status)}`}></div>
                    {collaborator.name} is editing line {collaborator.cursor?.line}
                  </div>
                ))}
              </div>
            </div>

            {/* Invite Section */}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Enter email to invite collaborator"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
              <Button onClick={inviteCollaborator} className="bg-blue-600 hover:bg-blue-700">
                Invite
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Start New Session */
        <Card className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Live Pair Programming
            </CardTitle>
            <CardDescription>
              Start a real-time collaborative coding session with other developers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Session Title</label>
              <Input
                placeholder="e.g., React Component Refactoring"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={startSession} className="w-full bg-blue-600 hover:bg-blue-700">
              <Video className="h-4 w-4 mr-2" />
              Start Live Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Code2 className="h-5 w-5 text-blue-400" />
                  <div>
                    <h4 className="font-medium text-white">{session.title}</h4>
                    <p className="text-sm text-gray-400">
                      {session.language} • {session.collaborators.length} collaborators • {session.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.isActive && (
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    {session.isActive ? 'Join' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePairProgramming;

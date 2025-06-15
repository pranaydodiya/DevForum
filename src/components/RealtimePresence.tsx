
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Edit, MessageCircle, Clock, Users, Activity } from 'lucide-react';

interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  status: 'viewing' | 'typing' | 'editing' | 'idle';
  lastActivity: string;
  isTyping?: boolean;
  currentSection?: string;
}

interface RealtimePresenceProps {
  threadId?: string;
  showInline?: boolean;
}

const RealtimePresence = ({ threadId, showInline = false }: RealtimePresenceProps) => {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  const [viewerCount, setViewerCount] = useState(0);

  // Mock real-time presence data
  useEffect(() => {
    const mockUsers: PresenceUser[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: '/placeholder.svg',
        status: 'typing',
        lastActivity: '2 seconds ago',
        isTyping: true,
        currentSection: 'comments'
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        avatar: '/placeholder.svg',
        status: 'viewing',
        lastActivity: '30 seconds ago',
        currentSection: 'main thread'
      },
      {
        id: '3',
        name: 'Alex Kim',
        avatar: '/placeholder.svg',
        status: 'editing',
        lastActivity: '1 minute ago',
        currentSection: 'code block'
      },
      {
        id: '4',
        name: 'Emma Wilson',
        avatar: '/placeholder.svg',
        status: 'viewing',
        lastActivity: '3 minutes ago',
        currentSection: 'main thread'
      }
    ];

    setActiveUsers(mockUsers);
    setViewerCount(mockUsers.length + Math.floor(Math.random() * 5) + 2);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        status: Math.random() > 0.7 ? 'typing' : user.status === 'typing' ? 'viewing' : user.status,
        isTyping: Math.random() > 0.8,
        lastActivity: Math.random() > 0.5 ? 'just now' : user.lastActivity
      })));
      
      setViewerCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);

    return () => clearInterval(interval);
  }, [threadId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'typing': return <MessageCircle className="h-3 w-3 text-green-400" />;
      case 'editing': return <Edit className="h-3 w-3 text-blue-400" />;
      case 'viewing': return <Eye className="h-3 w-3 text-gray-400" />;
      case 'idle': return <Clock className="h-3 w-3 text-gray-500" />;
      default: return <Activity className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'typing': return 'border-green-400 ring-green-400/20';
      case 'editing': return 'border-blue-400 ring-blue-400/20';
      case 'viewing': return 'border-gray-400 ring-gray-400/20';
      case 'idle': return 'border-gray-500 ring-gray-500/20';
      default: return 'border-gray-400 ring-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'typing': return 'is typing a comment...';
      case 'editing': return 'is editing content';
      case 'viewing': return 'is viewing this thread';
      case 'idle': return 'is idle';
      default: return 'is active';
    }
  };

  if (showInline) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {activeUsers.slice(0, 3).map((user) => (
            <TooltipProvider key={user.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className={`h-6 w-6 border-2 ring-2 ${getStatusColor(user.status)}`}>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-gray-700">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <span className="text-sm">{user.name} {getStatusText(user.status)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Last active: {user.lastActivity}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        {activeUsers.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{activeUsers.length - 3} more
          </Badge>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Eye className="h-3 w-3" />
          {viewerCount} viewing
        </div>
      </div>
    );
  }

  return (
    <Card className="glass border border-gray-600/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          Live Presence
        </CardTitle>
        <CardDescription>
          See who's currently active in this thread
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Count */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white">{activeUsers.length} active users</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="h-3 w-3" />
              {viewerCount} total viewers
            </div>
          </div>

          {/* Active Users List */}
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-800/30 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className={`h-8 w-8 border-2 ring-2 ${getStatusColor(user.status)}`}>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      {user.isTyping && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {getStatusIcon(user.status)}
                      <span>{getStatusText(user.status)}</span>
                      {user.currentSection && (
                        <>
                          <span>•</span>
                          <span>{user.currentSection}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{user.lastActivity}</span>
              </div>
            ))}
          </div>

          {/* Typing Indicators */}
          {activeUsers.some(user => user.isTyping) && (
            <div className="border-t border-gray-700 pt-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span>
                  {activeUsers.filter(user => user.isTyping).map(user => user.name).join(', ')} 
                  {activeUsers.filter(user => user.isTyping).length === 1 ? ' is' : ' are'} typing...
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimePresence;

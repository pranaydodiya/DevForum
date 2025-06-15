
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Github, 
  GitBranch, 
  RefreshCw, 
  Settings, 
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  FileText,
  Clock
} from 'lucide-react';

const GitHubSync = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncGists, setSyncGists] = useState(true);
  const [repoUrl, setRepoUrl] = useState('');

  const syncedRepos = [
    {
      name: 'my-awesome-project',
      url: 'https://github.com/user/my-awesome-project',
      lastSync: '2 hours ago',
      status: 'synced'
    },
    {
      name: 'code-snippets',
      url: 'https://github.com/user/code-snippets',
      lastSync: '1 day ago',
      status: 'pending'
    }
  ];

  const recentGists = [
    {
      id: '1',
      title: 'React Performance Hook',
      filename: 'usePerformance.js',
      updated: '3 hours ago'
    },
    {
      id: '2', 
      title: 'TypeScript Utility Types',
      filename: 'utils.ts',
      updated: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Github className="h-6 w-6 text-orange-400" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              )}
              <div>
                <h3 className="text-white font-medium">
                  {isConnected ? 'GitHub Connected' : 'Connect GitHub Account'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isConnected 
                    ? 'Sync posts with your GitHub gists and repositories'
                    : 'Connect your GitHub account to enable code synchronization'
                  }
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setIsConnected(!isConnected)}
              className={isConnected ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              <Github className="h-4 w-4 mr-2" />
              {isConnected ? 'Disconnect' : 'Connect GitHub'}
            </Button>
          </div>

          {isConnected && (
            <>
              {/* Sync Settings */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Sync Settings</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                    <div>
                      <label className="text-white text-sm font-medium">Auto-sync posts</label>
                      <p className="text-gray-400 text-xs">Automatically create gists when posting code</p>
                    </div>
                    <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                    <div>
                      <label className="text-white text-sm font-medium">Sync existing gists</label>
                      <p className="text-gray-400 text-xs">Import and sync your existing GitHub gists</p>
                    </div>
                    <Switch checked={syncGists} onCheckedChange={setSyncGists} />
                  </div>
                </div>
              </div>

              {/* Add Repository */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Add Repository</h4>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="repo-url" className="text-gray-300 text-sm">Repository URL</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Add Repo
                  </Button>
                </div>
              </div>

              {/* Synced Repositories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium">Synced Repositories</h4>
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync All
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {syncedRepos.map((repo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{repo.name}</p>
                          <p className="text-gray-400 text-xs">Last sync: {repo.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={repo.status === 'synced' ? 'default' : 'secondary'}
                          className={repo.status === 'synced' ? 'bg-green-600' : 'bg-yellow-600'}
                        >
                          {repo.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Gists */}
              <div className="space-y-3">
                <h4 className="text-white font-medium">Recent Gists</h4>
                <div className="space-y-2">
                  {recentGists.map((gist) => (
                    <div key={gist.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{gist.title}</p>
                          <p className="text-gray-400 text-xs">{gist.filename}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="h-3 w-3" />
                          {gist.updated}
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubSync;

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, GitCommit, RotateCcw, Eye, Download, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThreadVersion {
  id: string;
  timestamp: Date;
  author: string;
  message: string;
  changes: {
    type: 'content' | 'code' | 'title' | 'tags';
    description: string;
  }[];
  code?: string;
  content?: string;
  isCurrent?: boolean;
}

interface ThreadVersioningProps {
  versions?: ThreadVersion[];
  onRestoreVersion?: (versionId: string) => void;
  onViewDiff?: (versionId: string, compareWith?: string) => void;
  onExportHistory?: () => void;
}

const mockVersions: ThreadVersion[] = [
  {
    id: 'v1',
    timestamp: new Date(Date.now() - 60000 * 30), // 30 minutes ago
    author: 'You',
    message: 'Updated code implementation with better error handling',
    changes: [
      { type: 'code', description: 'Added try-catch blocks' },
      { type: 'code', description: 'Improved function documentation' }
    ],
    code: 'console.log("Updated version");',
    isCurrent: true
  },
  {
    id: 'v2',
    timestamp: new Date(Date.now() - 60000 * 120), // 2 hours ago
    author: 'Sarah Chen',
    message: 'Fixed algorithm optimization',
    changes: [
      { type: 'code', description: 'Optimized fibonacci function' },
      { type: 'content', description: 'Added performance notes' }
    ],
    code: 'console.log("Optimized version");'
  },
  {
    id: 'v3',
    timestamp: new Date(Date.now() - 60000 * 360), // 6 hours ago
    author: 'You',
    message: 'Initial code snippet',
    changes: [
      { type: 'code', description: 'Added initial implementation' },
      { type: 'title', description: 'Created thread title' }
    ],
    code: 'console.log("Initial version");'
  }
];

const ThreadVersioning: React.FC<ThreadVersioningProps> = ({
  versions = mockVersions,
  onRestoreVersion,
  onViewDiff,
  onExportHistory
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<string[]>([]);

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      if (compareVersions.includes(versionId)) {
        setCompareVersions(compareVersions.filter(id => id !== versionId));
      } else if (compareVersions.length < 2) {
        setCompareVersions([...compareVersions, versionId]);
      }
    } else {
      setSelectedVersion(selectedVersion === versionId ? null : versionId);
    }
  };

  const handleCompare = () => {
    if (compareVersions.length === 2 && onViewDiff) {
      onViewDiff(compareVersions[0], compareVersions[1]);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return '💻';
      case 'content':
        return '📝';
      case 'title':
        return '🏷️';
      case 'tags':
        return '#️⃣';
      default:
        return '✏️';
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'code':
        return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'content':
        return 'bg-green-500/20 text-green-300 border-green-500';
      case 'title':
        return 'bg-purple-500/20 text-purple-300 border-purple-500';
      case 'tags':
        return 'bg-orange-500/20 text-orange-300 border-orange-500';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Thread History</CardTitle>
              <Badge variant="outline">{versions.length} versions</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode);
                  setCompareVersions([]);
                }}
              >
                {compareMode ? 'Exit Compare' : 'Compare Versions'}
              </Button>
              
              {compareMode && compareVersions.length === 2 && (
                <Button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Diff
                </Button>
              )}
              
              {onExportHistory && (
                <Button variant="outline" size="sm" onClick={onExportHistory}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Version Timeline */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-4 space-y-4">
              {versions.map((version, index) => (
                <div key={version.id} className="relative">
                  {/* Timeline Line */}
                  {index < versions.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-600" />
                  )}
                  
                  <div
                    className={`flex gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedVersion === version.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : compareVersions.includes(version.id)
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                    }`}
                    onClick={() => handleVersionSelect(version.id)}
                  >
                    {/* Timeline Dot */}
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                      version.isCurrent
                        ? 'bg-green-500'
                        : selectedVersion === version.id
                        ? 'bg-blue-500'
                        : compareVersions.includes(version.id)
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`} />
                    
                    {/* Version Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GitCommit className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-white">{version.author}</span>
                          {version.isCurrent && (
                            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                              Current
                            </Badge>
                          )}
                          {compareMode && compareVersions.includes(version.id) && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500">
                              Selected
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm">{version.message}</p>
                      
                      {/* Changes */}
                      <div className="flex flex-wrap gap-2">
                        {version.changes.map((change, changeIndex) => (
                          <Badge
                            key={changeIndex}
                            variant="outline"
                            className={`text-xs ${getChangeColor(change.type)}`}
                          >
                            <span className="mr-1">{getChangeIcon(change.type)}</span>
                            {change.description}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      {selectedVersion === version.id && !version.isCurrent && (
                        <div className="flex items-center gap-2 pt-2">
                          {onRestoreVersion && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRestoreVersion(version.id);
                              }}
                              className="text-green-300 border-green-500 hover:bg-green-500/20"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          )}
                          
                          {onViewDiff && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDiff(version.id);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Changes
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < versions.length - 1 && <Separator className="my-2 bg-gray-700" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreadVersioning;

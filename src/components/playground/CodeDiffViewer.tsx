import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Download, ArrowLeft } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  lineNumber: number;
  content: string;
  originalLineNumber?: number;
}

interface CodeDiffViewerProps {
  originalCode: string;
  revisedCode: string;
  originalTitle?: string;
  revisedTitle?: string;
  language?: string;
  onClose?: () => void;
  onAcceptChanges?: () => void;
}

const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  originalCode,
  revisedCode,
  originalTitle = "Original",
  revisedTitle = "Revised",
  language = "javascript",
  onClose,
  onAcceptChanges
}) => {
  const diffData = useMemo(() => {
    const originalLines = originalCode.split('\n');
    const revisedLines = revisedCode.split('\n');
    
    const diffs: DiffLine[] = [];
    let originalIndex = 0;
    let revisedIndex = 0;
    
    // Simple diff algorithm
    while (originalIndex < originalLines.length || revisedIndex < revisedLines.length) {
      const originalLine = originalLines[originalIndex];
      const revisedLine = revisedLines[revisedIndex];
      
      if (originalIndex >= originalLines.length) {
        // Added line
        diffs.push({
          type: 'added',
          lineNumber: revisedIndex + 1,
          content: revisedLine
        });
        revisedIndex++;
      } else if (revisedIndex >= revisedLines.length) {
        // Removed line
        diffs.push({
          type: 'removed',
          lineNumber: originalIndex + 1,
          content: originalLine,
          originalLineNumber: originalIndex + 1
        });
        originalIndex++;
      } else if (originalLine === revisedLine) {
        // Unchanged line
        diffs.push({
          type: 'unchanged',
          lineNumber: revisedIndex + 1,
          content: revisedLine,
          originalLineNumber: originalIndex + 1
        });
        originalIndex++;
        revisedIndex++;
      } else {
        // Modified line
        diffs.push({
          type: 'removed',
          lineNumber: originalIndex + 1,
          content: originalLine,
          originalLineNumber: originalIndex + 1
        });
        diffs.push({
          type: 'added',
          lineNumber: revisedIndex + 1,
          content: revisedLine
        });
        originalIndex++;
        revisedIndex++;
      }
    }
    
    return diffs;
  }, [originalCode, revisedCode]);

  const stats = useMemo(() => {
    const added = diffData.filter(d => d.type === 'added').length;
    const removed = diffData.filter(d => d.type === 'removed').length;
    const modified = Math.min(added, removed);
    
    return {
      added: added - modified,
      removed: removed - modified,
      modified
    };
  }, [diffData]);

  const getLineClass = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return 'bg-green-500/20 border-l-4 border-green-500';
      case 'removed':
        return 'bg-red-500/20 border-l-4 border-red-500';
      case 'modified':
        return 'bg-yellow-500/20 border-l-4 border-yellow-500';
      default:
        return 'bg-transparent';
    }
  };

  const getLinePrefix = (type: DiffLine['type']) => {
    switch (type) {
      case 'added':
        return '+';
      case 'removed':
        return '-';
      default:
        return ' ';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Code Diff Viewer</CardTitle>
              <div className="flex gap-2">
                {stats.added > 0 && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                    +{stats.added}
                  </Badge>
                )}
                {stats.removed > 0 && (
                  <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500">
                    -{stats.removed}
                  </Badge>
                )}
                {stats.modified > 0 && (
                  <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500">
                    ~{stats.modified}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onAcceptChanges && (
                <Button onClick={onAcceptChanges} className="bg-green-600 hover:bg-green-700">
                  Accept Changes
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                <Download className="h-4 w-4 mr-1" />
                Export Diff
              </Button>
              {onClose && (
                <Button variant="ghost" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Diff Content */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-300">{originalTitle}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-900 font-mono text-sm max-h-96 overflow-y-auto">
              {originalCode.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={`px-4 py-1 flex ${
                    diffData.some(d => d.originalLineNumber === index + 1 && d.type === 'removed')
                      ? 'bg-red-500/20 border-l-4 border-red-500'
                      : 'bg-transparent'
                  }`}
                >
                  <span className="text-gray-500 w-8 text-right mr-3">{index + 1}</span>
                  <span className="text-red-300 w-4 mr-2">
                    {diffData.some(d => d.originalLineNumber === index + 1 && d.type === 'removed') ? '-' : ' '}
                  </span>
                  <span className="text-gray-300">{line}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revised Code */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-300">{revisedTitle}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gray-900 font-mono text-sm max-h-96 overflow-y-auto">
              {revisedCode.split('\n').map((line, index) => (
                <div
                  key={index}
                  className={`px-4 py-1 flex ${
                    diffData.some(d => d.lineNumber === index + 1 && d.type === 'added')
                      ? 'bg-green-500/20 border-l-4 border-green-500'
                      : 'bg-transparent'
                  }`}
                >
                  <span className="text-gray-500 w-8 text-right mr-3">{index + 1}</span>
                  <span className="text-green-300 w-4 mr-2">
                    {diffData.some(d => d.lineNumber === index + 1 && d.type === 'added') ? '+' : ' '}
                  </span>
                  <span className="text-gray-300">{line}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unified Diff View */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Unified Diff</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-900 font-mono text-sm max-h-64 overflow-y-auto">
            {diffData.map((diff, index) => (
              <div
                key={index}
                className={`px-4 py-1 flex ${getLineClass(diff.type)}`}
              >
                <span className="text-gray-500 w-8 text-right mr-3">
                  {diff.type === 'removed' ? diff.originalLineNumber : diff.lineNumber}
                </span>
                <span className={`w-4 mr-2 ${
                  diff.type === 'added' ? 'text-green-300' : 
                  diff.type === 'removed' ? 'text-red-300' : 'text-gray-500'
                }`}>
                  {getLinePrefix(diff.type)}
                </span>
                <span className="text-gray-300">{diff.content}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeDiffViewer;

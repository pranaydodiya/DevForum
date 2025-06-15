
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, GitBranch, History } from 'lucide-react';
import CodeExecutionSandbox from './CodeExecutionSandbox';
import CodeDiffViewer from './CodeDiffViewer';
import ThreadVersioning from './ThreadVersioning';

interface PlaygroundTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentCode: string;
  currentLanguage: 'javascript' | 'python' | 'cpp' | 'html' | 'css';
  originalCode: string;
  showDiff: boolean;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => void;
  onFork: (code: string, language: string) => void;
  onCloseDiff: () => void;
  onAcceptChanges: () => void;
  onRestoreVersion: (versionId: string) => void;
  onViewDiff: (versionId: string, compareWith?: string) => void;
  onExportHistory: () => void;
}

const PlaygroundTabs: React.FC<PlaygroundTabsProps> = ({
  activeTab,
  onTabChange,
  currentCode,
  currentLanguage,
  originalCode,
  showDiff,
  onCodeChange,
  onLanguageChange,
  onFork,
  onCloseDiff,
  onAcceptChanges,
  onRestoreVersion,
  onViewDiff,
  onExportHistory
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sandbox" className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Code Sandbox
        </TabsTrigger>
        <TabsTrigger value="diff" className="flex items-center gap-2" data-onboarding="diff-viewer">
          <GitBranch className="h-4 w-4" />
          Diff Viewer
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2" data-onboarding="version-history">
          <History className="h-4 w-4" />
          Version History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sandbox" className="mt-6">
        <CodeExecutionSandbox
          initialCode={currentCode}
          language={currentLanguage}
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
          onFork={onFork}
          showDiffTrigger={true}
        />
      </TabsContent>

      <TabsContent value="diff" className="mt-6">
        {showDiff ? (
          <CodeDiffViewer
            originalCode={originalCode}
            revisedCode={currentCode}
            onClose={onCloseDiff}
            onAcceptChanges={onAcceptChanges}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <GitBranch className="h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No Diff Available</h3>
              <p className="text-gray-500 text-center mb-4">
                Fork code in the sandbox or select versions in history to see differences
              </p>
              <Button variant="outline" onClick={() => onTabChange('sandbox')}>
                Go to Sandbox
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <ThreadVersioning
          onRestoreVersion={onRestoreVersion}
          onViewDiff={onViewDiff}
          onExportHistory={onExportHistory}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PlaygroundTabs;


import React, { useState } from 'react';
import CodeExecutionSandbox from './CodeExecutionSandbox';
import CodeDiffViewer from './CodeDiffViewer';
import TrendingSnippets, { TrendingSnippet } from './TrendingSnippets';
import PlaygroundTabs from './PlaygroundTabs';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  contextSnippet?: string;
  contextLanguage?: string;
  isEmbedded?: boolean;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  contextSnippet,
  contextLanguage,
  isEmbedded = false
}) => {
  const [activeTab, setActiveTab] = useState('sandbox');
  const [currentCode, setCurrentCode] = useState(contextSnippet || '');
  const [currentLanguage, setCurrentLanguage] = useState<'javascript' | 'python' | 'cpp' | 'html' | 'css'>(
    (contextLanguage as any) || 'javascript'
  );
  const [originalCode, setOriginalCode] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const { toast } = useToast();

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  const handleLanguageChange = (language: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => {
    setCurrentLanguage(language);
  };

  const handleFork = (code: string, language: string) => {
    setOriginalCode(currentCode);
    setCurrentCode(code);
    setShowDiff(true);
    setActiveTab('diff');
  };

  const handleLoadSnippet = (snippet: TrendingSnippet) => {
    setOriginalCode(currentCode);
    setCurrentCode(snippet.code);
    setCurrentLanguage(snippet.language as any);
    setActiveTab('sandbox');
    
    toast({
      title: "Snippet Loaded! 🎉",
      description: `Successfully loaded "${snippet.title}" by ${snippet.author}`,
    });
  };

  const handleRestoreVersion = (versionId: string) => {
    toast({
      title: "Version Restored",
      description: `Restored to version ${versionId}`,
    });
  };

  const handleViewDiff = (versionId: string, compareWith?: string) => {
    setShowDiff(true);
    setActiveTab('diff');
    toast({
      title: "Viewing Diff",
      description: `Comparing ${compareWith ? 'selected versions' : 'with current version'}`,
    });
  };

  const handleCloseDiff = () => {
    setShowDiff(false);
  };

  const handleAcceptChanges = () => {
    setOriginalCode(currentCode);
    setShowDiff(false);
    toast({
      title: "Changes Accepted",
      description: "Code changes have been applied.",
    });
  };

  const handleExportHistory = () => {
    toast({
      title: "History Exported",
      description: "Version history has been downloaded as JSON.",
    });
  };

  if (isEmbedded) {
    return (
      <div className="space-y-4">
        <CodeExecutionSandbox
          initialCode={contextSnippet}
          language={contextLanguage as any}
          onCodeChange={handleCodeChange}
          onFork={handleFork}
        />
        
        {showDiff && (
          <CodeDiffViewer
            originalCode={originalCode}
            revisedCode={currentCode}
            onClose={handleCloseDiff}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TrendingSnippets onLoadSnippet={handleLoadSnippet} />
      
      <PlaygroundTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentCode={currentCode}
        currentLanguage={currentLanguage}
        originalCode={originalCode}
        showDiff={showDiff}
        onCodeChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
        onFork={handleFork}
        onCloseDiff={handleCloseDiff}
        onAcceptChanges={handleAcceptChanges}
        onRestoreVersion={handleRestoreVersion}
        onViewDiff={handleViewDiff}
        onExportHistory={handleExportHistory}
      />
    </div>
  );
};

export default CodePlayground;

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Play, 
  Download, 
  Share2, 
  Copy, 
  GitBranch,
  Settings,
  Zap,
  Terminal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RealTimeExecutor from './RealTimeExecutor';

interface CodeExecutionSandboxProps {
  initialCode?: string;
  language?: 'javascript' | 'python' | 'cpp' | 'html' | 'css';
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => void;
  onFork?: (code: string, language: string) => void;
  showDiffTrigger?: boolean;
}

const CodeExecutionSandbox: React.FC<CodeExecutionSandboxProps> = ({
  initialCode,
  language: initialLanguage = 'javascript',
  onCodeChange,
  onLanguageChange,
  onFork,
  showDiffTrigger = false
}) => {
  const [code, setCode] = useState(initialCode || '');
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'html' | 'css'>(initialLanguage);
  const [activeTab, setActiveTab] = useState('executor');
  const { toast } = useToast();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleLanguageChange = (newLanguage: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    const extensions = { javascript: 'js', python: 'py', cpp: 'cpp', html: 'html', css: 'css' };
    const filename = `code.${extensions[language]}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded",
      description: `${filename} has been downloaded`,
    });
  };

  const handleFork = () => {
    onFork?.(code, language);
    toast({
      title: "Code Forked",
      description: "Created a new version for comparison",
    });
  };

  const handleShare = () => {
    const shareData = {
      title: 'Code Snippet',
      text: `Check out this ${language} code snippet!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Code className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle className="text-lg">Real-Time Code Execution</CardTitle>
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500">
                Live IDE
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              {showDiffTrigger && onFork && (
                <Button variant="outline" onClick={handleFork}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Fork
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="executor" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Real-Time Executor
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="executor" className="mt-6">
          <RealTimeExecutor
            initialCode={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Execution Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Auto-Run</h3>
                  <p className="text-sm text-gray-400">Automatically execute code as you type</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Syntax Highlighting</h3>
                  <p className="text-sm text-gray-400">Enhanced code visualization</p>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">Error Reporting</h3>
                  <p className="text-sm text-gray-400">Real-time error detection and reporting</p>
                </div>
                <Badge className="bg-green-600">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeExecutionSandbox;

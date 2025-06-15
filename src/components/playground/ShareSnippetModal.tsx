
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  Download,
  Mail,
  Code,
  Eye,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareSnippetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: {
    title: string;
    code: string;
    language: string;
    author: string;
  };
  onSnippetShared: (shareData: any) => void;
}

const ShareSnippetModal: React.FC<ShareSnippetModalProps> = ({
  open,
  onOpenChange,
  snippet,
  onSnippetShared
}) => {
  const [shareUrl] = useState(`${window.location.origin}/snippet/${Date.now()}`);
  const [embedCode] = useState(`<iframe src="${shareUrl}/embed" width="100%" height="400"></iframe>`);
  const [customMessage, setCustomMessage] = useState(`Check out this awesome ${snippet.language} code snippet: "${snippet.title}"`);
  const { toast } = useToast();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied! 📋",
      description: "Share URL has been copied to clipboard",
    });
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed Code Copied! 📋",
      description: "Embed code has been copied to clipboard",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code);
    toast({
      title: "Code Copied! 📋",
      description: "Code has been copied to clipboard",
    });
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(customMessage);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'github':
        // This would typically create a new gist
        shareLink = 'https://gist.github.com/';
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(snippet.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      onSnippetShared({ method: 'social', platform });
    }
  };

  const handleDownloadSnippet = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      cpp: 'cpp',
      html: 'html',
      css: 'css',
      java: 'java',
      go: 'go',
      rust: 'rs',
      php: 'php'
    };
    
    const extension = extensions[snippet.language] || 'txt';
    const filename = `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
    
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Snippet Downloaded! 💾",
      description: `${filename} has been downloaded`,
    });
    
    onSnippetShared({ method: 'download', filename });
  };

  const socialPlatforms = [
    { name: 'Twitter', icon: Twitter, color: 'hover:bg-blue-600', platform: 'twitter' },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-700', platform: 'linkedin' },
    { name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-800', platform: 'facebook' },
    { name: 'GitHub', icon: Github, color: 'hover:bg-gray-700', platform: 'github' },
    { name: 'Email', icon: Mail, color: 'hover:bg-green-600', platform: 'email' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <Share2 className="h-5 w-5 text-green-400" />
            </div>
            Share Code Snippet
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Preview */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Snippet Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{snippet.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                      {snippet.language}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      by {snippet.author}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{snippet.code.slice(0, 200)}...</code>
                  </pre>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>0 views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="h-3 w-3" />
                      <span>{snippet.code.split('\n').length} lines</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300"
                  onClick={handleDownloadSnippet}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Snippet
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-gray-600 text-gray-300"
                  onClick={() => window.open(shareUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Share Options */}
          <div className="space-y-4">
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="link">Share Link</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="embed">Embed Code</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-400" />
                      Public Share Link
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={shareUrl}
                        readOnly
                        className="bg-gray-900 border-gray-600 text-white font-mono text-sm"
                      />
                      <Button onClick={handleCopyUrl} className="bg-green-600 hover:bg-green-700">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Anyone with this link can view and run your code snippet
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Customize Share Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Add a custom message..."
                      className="bg-gray-900 border-gray-600 text-white"
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Share on Social Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {socialPlatforms.map((platform) => (
                        <Button
                          key={platform.platform}
                          variant="outline"
                          className={`w-full justify-start border-gray-600 text-gray-300 ${platform.color} transition-colors`}
                          onClick={() => handleSocialShare(platform.platform)}
                        >
                          <platform.icon className="h-4 w-4 mr-2" />
                          Share on {platform.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="embed" className="space-y-4">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-400" />
                      Embed Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Textarea
                        value={embedCode}
                        readOnly
                        className="bg-gray-900 border-gray-600 text-white font-mono text-sm"
                        rows={3}
                      />
                      <Button onClick={handleCopyEmbed} className="bg-purple-600 hover:bg-purple-700">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Embed this code snippet in your website or blog
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Embed Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-32 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <Code className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Embedded snippet preview</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>Snippet is ready to share</span>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300"
            >
              Close
            </Button>
            <Button 
              onClick={handleCopyUrl}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy Share Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareSnippetModal;

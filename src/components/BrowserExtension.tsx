
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Download, 
  Globe, 
  Code, 
  Settings, 
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const BrowserExtension = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [autoPost, setAutoPost] = useState(true);
  const [quickCapture, setQuickCapture] = useState(true);

  const extensionFeatures = [
    'Quick code snippet capture from any webpage',
    'One-click posting to DevForum',
    'Automatic syntax highlighting detection',
    'Direct integration with your DevForum account',
    'Offline snippet storage and sync'
  ];

  return (
    <div className="space-y-6">
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-400" />
            DevForum Browser Extension
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Installation Status */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              {isInstalled ? (
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              )}
              <div>
                <h3 className="text-white font-medium">
                  {isInstalled ? 'Extension Installed' : 'Extension Not Installed'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isInstalled 
                    ? 'DevForum extension is active and ready to use'
                    : 'Install the extension to start capturing code snippets'
                  }
                </p>
              </div>
            </div>
            {!isInstalled && (
              <Button 
                onClick={() => setIsInstalled(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Install Extension
              </Button>
            )}
          </div>

          {/* Features List */}
          <div>
            <h4 className="text-white font-medium mb-4">Extension Features</h4>
            <div className="space-y-2">
              {extensionFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extension Settings */}
          {isInstalled && (
            <div className="space-y-4">
              <h4 className="text-white font-medium">Extension Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                  <div>
                    <label className="text-white text-sm font-medium">Auto-post snippets</label>
                    <p className="text-gray-400 text-xs">Automatically create posts when capturing code</p>
                  </div>
                  <Switch checked={autoPost} onCheckedChange={setAutoPost} />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded border border-gray-700">
                  <div>
                    <label className="text-white text-sm font-medium">Quick capture mode</label>
                    <p className="text-gray-400 text-xs">Enable right-click context menu for code selection</p>
                  </div>
                  <Switch checked={quickCapture} onCheckedChange={setQuickCapture} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Extension Store
                </Button>
              </div>
            </div>
          )}

          {/* Browser Support */}
          <div>
            <h4 className="text-white font-medium mb-3">Browser Support</h4>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-500/30 text-green-400">Chrome</Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400">Firefox</Badge>
              <Badge variant="outline" className="border-green-500/30 text-green-400">Edge</Badge>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">Safari (Beta)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowserExtension;

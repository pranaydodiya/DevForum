
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Webhook, 
  Key, 
  Plus, 
  Copy, 
  RefreshCw, 
  Trash2,
  Globe,
  Lock,
  Activity,
  Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  deliveryCount: number;
}

const WebhooksApiAccess = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'dfapi_live_sk_1234567890abcdef',
      permissions: ['read:posts', 'read:stats'],
      createdAt: '2024-06-10T00:00:00Z',
      lastUsed: '2024-06-14T10:30:00Z',
      isActive: true
    }
  ]);

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Discord Notifications',
      url: 'https://discord.com/api/webhooks/...',
      events: ['post.created', 'comment.created'],
      secret: 'whsec_1234567890abcdef',
      isActive: true,
      createdAt: '2024-06-10T00:00:00Z',
      lastTriggered: '2024-06-14T09:15:00Z',
      deliveryCount: 25
    }
  ]);

  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const { toast } = useToast();

  const generateApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key.",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: `dfapi_live_sk_${Math.random().toString(36).substr(2, 20)}`,
      permissions: ['read:posts', 'read:stats'],
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewApiKeyName('');
    
    toast({
      title: "API Key Created",
      description: "Your new API key has been generated. Make sure to copy it now!",
    });
  };

  const createWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and URL for the webhook.",
        variant: "destructive",
      });
      return;
    }

    const newWebhook: WebhookEndpoint = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: ['post.created'],
      secret: `whsec_${Math.random().toString(36).substr(2, 20)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      deliveryCount: 0
    };

    setWebhooks(prev => [newWebhook, ...prev]);
    setNewWebhookName('');
    setNewWebhookUrl('');
    
    toast({
      title: "Webhook Created",
      description: "Your webhook endpoint has been configured.",
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const toggleApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ));
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(webhook => 
      webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
    ));
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted.",
    });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
    toast({
      title: "Webhook Deleted",
      description: "The webhook endpoint has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <Code className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">API & Webhooks</h2>
      </div>

      {/* API Keys Section */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-400" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newApiKeyName}
              onChange={(e) => setNewApiKeyName(e.target.value)}
              placeholder="API key name..."
              className="bg-gray-900/50 border-gray-600 text-white"
            />
            <Button onClick={generateApiKey}>
              <Plus className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="glass p-4 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-white">{apiKey.name}</h4>
                      <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="font-mono text-sm text-gray-300 bg-gray-800 p-2 rounded border border-gray-600">
                      {apiKey.key}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                      {apiKey.lastUsed && (
                        <span>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={apiKey.isActive}
                      onCheckedChange={() => toggleApiKey(apiKey.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key, 'API Key')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks Section */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-purple-400" />
            Webhook Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={newWebhookName}
              onChange={(e) => setNewWebhookName(e.target.value)}
              placeholder="Webhook name..."
              className="bg-gray-900/50 border-gray-600 text-white"
            />
            <div className="flex gap-2">
              <Input
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                className="bg-gray-900/50 border-gray-600 text-white"
              />
              <Button onClick={createWebhook}>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="glass p-4 rounded-lg border border-gray-600/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-white">{webhook.name}</h4>
                      <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                        {webhook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Activity className="h-3 w-3 mr-1" />
                        {webhook.deliveryCount} deliveries
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">{webhook.url}</div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      Secret: <code className="bg-gray-800 px-1 rounded">{webhook.secret}</code>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={webhook.isActive}
                      onCheckedChange={() => toggleWebhook(webhook.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(webhook.secret, 'Webhook Secret')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteWebhook(webhook.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-400" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
              <h4 className="font-semibold text-white mb-2">Base URL</h4>
              <code className="text-green-400">https://api.devforum.com/v1</code>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">Get Posts</h4>
                <code className="text-blue-400 text-sm">GET /posts</code>
                <p className="text-gray-400 text-sm mt-1">Fetch all posts with pagination</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">Get User Stats</h4>
                <code className="text-blue-400 text-sm">GET /users/:id/stats</code>
                <p className="text-gray-400 text-sm mt-1">Get user analytics and metrics</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">Embed Thread</h4>
                <code className="text-blue-400 text-sm">GET /embed/:threadId</code>
                <p className="text-gray-400 text-sm mt-1">Get embeddable thread HTML</p>
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                <h4 className="font-semibold text-white mb-2">Search</h4>
                <code className="text-blue-400 text-sm">GET /search</code>
                <p className="text-gray-400 text-sm mt-1">Search posts, users, and code</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhooksApiAccess;

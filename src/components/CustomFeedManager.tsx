
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Hash, 
  Users, 
  Plus, 
  X, 
  Settings,
  Filter,
  Bell,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedSubscription {
  id: string;
  type: 'tag' | 'user' | 'topic';
  name: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  notifications: boolean;
}

interface CustomFeedManagerProps {
  subscriptions: FeedSubscription[];
  onUpdateSubscriptions: (subscriptions: FeedSubscription[]) => void;
}

const CustomFeedManager = ({ subscriptions, onUpdateSubscriptions }: CustomFeedManagerProps) => {
  const [newSubscription, setNewSubscription] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'tag' | 'user' | 'topic'>('tag');
  const { toast } = useToast();

  const addSubscription = () => {
    if (!newSubscription.trim()) return;
    
    const existing = subscriptions.find(sub => 
      sub.name.toLowerCase() === newSubscription.toLowerCase() && sub.type === subscriptionType
    );
    
    if (existing) {
      toast({
        title: "Already Subscribed",
        description: `You're already subscribed to this ${subscriptionType}.`,
        variant: "default",
      });
      return;
    }

    const subscription: FeedSubscription = {
      id: Date.now().toString(),
      type: subscriptionType,
      name: newSubscription.trim(),
      enabled: true,
      priority: 'medium',
      notifications: false
    };

    onUpdateSubscriptions([...subscriptions, subscription]);
    setNewSubscription('');
    
    toast({
      title: "Subscription Added",
      description: `Now following ${subscriptionType}: ${subscription.name}`,
    });
  };

  const removeSubscription = (id: string) => {
    onUpdateSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast({
      title: "Subscription Removed",
      description: "Subscription has been removed from your feed.",
    });
  };

  const toggleSubscription = (id: string) => {
    onUpdateSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, enabled: !sub.enabled } : sub
    ));
  };

  const toggleNotifications = (id: string) => {
    onUpdateSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, notifications: !sub.notifications } : sub
    ));
  };

  const updatePriority = (id: string, priority: 'high' | 'medium' | 'low') => {
    onUpdateSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, priority } : sub
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tag': return Hash;
      case 'user': return Users;
      case 'topic': return Star;
      default: return Hash;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-gray-500/50 bg-gray-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.type]) acc[sub.type] = [];
    acc[sub.type].push(sub);
    return acc;
  }, {} as Record<string, FeedSubscription[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <Filter className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold gradient-text">Custom Feed Manager</h2>
      </div>

      {/* Add New Subscription */}
      <Card className="glass border border-gray-600/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-400" />
            Add New Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['tag', 'user', 'topic'] as const).map((type) => (
              <Button
                key={type}
                variant={subscriptionType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSubscriptionType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newSubscription}
              onChange={(e) => setNewSubscription(e.target.value)}
              placeholder={`Enter ${subscriptionType} name...`}
              className="bg-gray-900/50 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && addSubscription()}
            />
            <Button onClick={addSubscription} disabled={!newSubscription.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      {Object.entries(groupedSubscriptions).map(([type, subs]) => (
        <Card key={type} className="glass border border-gray-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {(() => {
                const Icon = getTypeIcon(type);
                return <Icon className="h-5 w-5 text-blue-400" />;
              })()}
              {type} Subscriptions ({subs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subs.map((subscription) => (
                <div 
                  key={subscription.id} 
                  className={`glass p-4 rounded-lg border ${getPriorityColor(subscription.priority)} transition-all duration-300`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={subscription.enabled}
                        onCheckedChange={() => toggleSubscription(subscription.id)}
                      />
                      <div>
                        <div className="font-medium text-white">{subscription.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {subscription.priority} priority
                          </Badge>
                          {subscription.notifications && (
                            <Badge variant="outline" className="text-xs text-yellow-400">
                              <Bell className="h-3 w-3 mr-1" />
                              Notifications
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={subscription.priority}
                        onChange={(e) => updatePriority(subscription.id, e.target.value as any)}
                        className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleNotifications(subscription.id)}
                        className={subscription.notifications ? 'text-yellow-400' : 'text-gray-400'}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubscription(subscription.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {subs.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No {type} subscriptions yet. Add one above to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CustomFeedManager;

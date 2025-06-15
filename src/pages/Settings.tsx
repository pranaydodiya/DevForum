import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, User, Bell, Shield, Palette, Globe, Zap, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, defaultCredentials } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  
  // Password verification states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  
  // Profile edit states
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedBio, setEditedBio] = useState('');

  const handleBackToHome = () => {
    navigate('/');
  };

  const handlePasswordVerification = () => {
    if (verificationPassword === defaultCredentials.password) {
      setIsPasswordVerified(true);
      setIsPasswordDialogOpen(false);
      setVerificationPassword('');
      toast({
        title: "Access granted",
        description: "You can now edit your profile information",
      });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please enter the correct password to edit your profile",
        variant: "destructive",
      });
      setVerificationPassword('');
    }
  };

  const handleSaveChanges = () => {
    if (!isPasswordVerified) {
      setIsPasswordDialogOpen(true);
      return;
    }
    
    // Here you would typically save the changes to a backend
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully",
    });
    setIsPasswordVerified(false); // Reset verification for next edit
  };

  const handleEditAttempt = () => {
    if (!isPasswordVerified) {
      setIsPasswordDialogOpen(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome}
            className="text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Settings Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        {/* Password Verification Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-black border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password Required
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Please enter your password to edit profile information:
              </p>
              <div className="space-y-2">
                <Label htmlFor="verification-password" className="text-gray-300">Password</Label>
                <Input
                  id="verification-password"
                  type="password"
                  value={verificationPassword}
                  onChange={(e) => setVerificationPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordVerification()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setVerificationPassword('');
                  }}
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordVerification}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!verificationPassword}
                >
                  Verify
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-gray-600/50">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="glass border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  Profile Information
                  {isPasswordVerified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Lock className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Display Name</Label>
                    <Input
                      id="name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isPasswordVerified}
                      onFocus={handleEditAttempt}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isPasswordVerified}
                      onFocus={handleEditAttempt}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Input
                    id="bio"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-gray-800 border-gray-600 text-white"
                    disabled={!isPasswordVerified}
                    onFocus={handleEditAttempt}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
                    {user.reputation} Reputation
                  </Badge>
                  <Badge variant="outline">
                    Member since {new Date(user.joinDate).getFullYear()}
                  </Badge>
                </div>
                <Button 
                  onClick={handleSaveChanges}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!isPasswordVerified}
                >
                  {isPasswordVerified ? 'Save Changes' : 'Unlock to Edit'}
                </Button>
                {!isPasswordVerified && (
                  <p className="text-sm text-gray-500">
                    Click "Unlock to Edit" and enter your password to modify profile information
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="glass border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications for new comments and replies</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Email Updates</Label>
                    <p className="text-sm text-gray-500">Receive weekly digest emails</p>
                  </div>
                  <Switch
                    checked={emailUpdates}
                    onCheckedChange={setEmailUpdates}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="glass border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Profile Visibility</Label>
                    <p className="text-sm text-gray-500 mb-2">Choose who can see your profile</p>
                    <select className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                      <option>Public</option>
                      <option>Members only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Activity Status</Label>
                    <p className="text-sm text-gray-500 mb-2">Show when you're online</p>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="glass border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Use dark theme</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <Separator className="bg-gray-700" />
                <div>
                  <Label className="text-gray-300">Font Size</Label>
                  <select className="w-full mt-2 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="glass border border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Auto-save Drafts</Label>
                    <p className="text-sm text-gray-500">Automatically save your work</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>
                <Separator className="bg-gray-700" />
                <div>
                  <Label className="text-gray-300">Default Code Language</Label>
                  <select className="w-full mt-2 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white">
                    <option>JavaScript</option>
                    <option>TypeScript</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>C++</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;

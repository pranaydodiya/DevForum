
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code, 
  Plus, 
  X, 
  Globe, 
  Lock, 
  Tag,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateSnippetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnippetCreated: (snippet: any) => void;
}

const CreateSnippetModal: React.FC<CreateSnippetModalProps> = ({
  open,
  onOpenChange,
  onSnippetCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const { toast } = useToast();

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-600' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-600' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-600' }
  ];

  const popularTags = ['react', 'api', 'algorithm', 'function', 'hook', 'component', 'utility', 'design-pattern'];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddPopularTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleCreateSnippet = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your snippet.",
        variant: "destructive"
      });
      return;
    }

    if (!code.trim() || code.trim() === '// Start coding here...') {
      toast({
        title: "Code Required",
        description: "Please write some code for your snippet.",
        variant: "destructive"
      });
      return;
    }

    const snippet = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      isPublic,
      tags,
      difficulty,
      author: 'Current User',
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      forks: 0
    };

    onSnippetCreated(snippet);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCode('// Start coding here...\n');
    setLanguage('javascript');
    setIsPublic(true);
    setTags([]);
    setDifficulty('beginner');
    
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleCreateSnippet();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            Create New Code Snippet
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter snippet title..."
                className="bg-gray-800 border-gray-600 text-white"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your code does..."
                className="bg-gray-800 border-gray-600 text-white min-h-20"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="text-white">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {difficultyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value} className="text-white">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Tags (max 5)</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="bg-gray-800 border-gray-600 text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={tags.length >= 5}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-400" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-gray-400 mr-2">Popular:</span>
                {popularTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className="cursor-pointer text-xs border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300"
                    onClick={() => handleAddPopularTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                {isPublic ? <Globe className="h-4 w-4 text-green-400" /> : <Lock className="h-4 w-4 text-gray-400" />}
                <div>
                  <p className="text-white font-medium">
                    {isPublic ? 'Public Snippet' : 'Private Snippet'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {isPublic ? 'Visible to everyone in the community' : 'Only visible to you'}
                  </p>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          {/* Right Column - Code Editor */}
          <div className="space-y-2">
            <Label className="text-white">Code *</Label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Start coding here..."
              className="bg-gray-800 border-gray-600 text-white font-mono text-sm min-h-96"
              onKeyDown={handleKeyDown}
            />
            <p className="text-xs text-gray-400">Press Ctrl+Enter (or Cmd+Enter) to create</p>
          </div>
        </div>

        {/* Preview Card */}
        <Card className="bg-gray-800 border-gray-600 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">
                  {title || 'Untitled Snippet'}
                </h4>
                {description && (
                  <p className="text-gray-400 text-sm mb-3">{description}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                    {languages.find(l => l.value === language)?.label}
                  </Badge>
                  <Badge 
                    className={difficultyLevels.find(d => d.value === difficulty)?.color}
                  >
                    {difficultyLevels.find(d => d.value === difficulty)?.label}
                  </Badge>
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isPublic ? "default" : "secondary"}>
                  {isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSnippet}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Code className="h-4 w-4 mr-2" />
            Create Snippet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSnippetModal;

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, BookmarkPlus, Search, Filter, Calendar, Tag, Edit, Trash2, StickyNote, Star, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
}

interface ThreadBookmark {
  id: string;
  threadId: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  notes: BookmarkNote[];
  category: 'learning' | 'reference' | 'inspiration' | 'todo' | 'important';
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
  threadData: {
    author: string;
    votes: number;
    comments: number;
    language?: string;
  };
}

const ThreadBookmarks = () => {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<ThreadBookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    description: '',
    url: '',
    tags: '',
    category: 'reference' as const
  });
  const [selectedBookmark, setSelectedBookmark] = useState<ThreadBookmark | null>(null);
  const [newNote, setNewNote] = useState('');
  const [noteColor, setNoteColor] = useState<BookmarkNote['color']>('yellow');

  // Mock bookmarks data
  useEffect(() => {
    const mockBookmarks: ThreadBookmark[] = [
      {
        id: '1',
        threadId: 'thread-1',
        title: 'Advanced React Hooks Patterns',
        description: 'Comprehensive guide to custom hooks and advanced patterns',
        url: '/thread/advanced-react-hooks-patterns',
        tags: ['react', 'hooks', 'patterns', 'advanced'],
        category: 'learning',
        isStarred: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-16',
        threadData: {
          author: 'Sarah Chen',
          votes: 45,
          comments: 12,
          language: 'javascript'
        },
        notes: [
          {
            id: 'note-1',
            content: 'Remember to implement the useCallback optimization mentioned in comment #5',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
            color: 'yellow'
          },
          {
            id: 'note-2',
            content: 'Good example for the team meeting next week',
            createdAt: '2024-01-16',
            updatedAt: '2024-01-16',
            color: 'blue'
          }
        ]
      },
      {
        id: '2',
        threadId: 'thread-2',
        title: 'Python Machine Learning Pipeline',
        description: 'Complete ML pipeline implementation with scikit-learn',
        url: '/thread/python-ml-pipeline',
        tags: ['python', 'machine-learning', 'scikit-learn', 'pipeline'],
        category: 'reference',
        isStarred: false,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
        threadData: {
          author: 'Dr. Alex Kim',
          votes: 78,
          comments: 23,
          language: 'python'
        },
        notes: [
          {
            id: 'note-3',
            content: 'Check the data preprocessing steps for my current project',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10',
            color: 'green'
          }
        ]
      },
      {
        id: '3',
        threadId: 'thread-3',
        title: 'CSS Grid Layout Tricks',
        description: 'Creative grid layouts and responsive design techniques',
        url: '/thread/css-grid-tricks',
        tags: ['css', 'grid', 'layout', 'responsive'],
        category: 'inspiration',
        isStarred: true,
        createdAt: '2024-01-08',
        updatedAt: '2024-01-08',
        threadData: {
          author: 'Emma Design',
          votes: 34,
          comments: 8,
          language: 'css'
        },
        notes: []
      }
    ];

    setBookmarks(mockBookmarks);
  }, []);

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = searchQuery === '' || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || 
      bookmark.category === selectedCategory ||
      (selectedCategory === 'starred' && bookmark.isStarred);

    return matchesSearch && matchesCategory;
  });

  const addBookmark = () => {
    if (!newBookmark.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your bookmark.",
        variant: "destructive"
      });
      return;
    }

    const bookmark: ThreadBookmark = {
      id: Date.now().toString(),
      threadId: `thread-${Date.now()}`,
      title: newBookmark.title,
      description: newBookmark.description,
      url: newBookmark.url || '#',
      tags: newBookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      category: newBookmark.category,
      isStarred: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      threadData: {
        author: 'Unknown',
        votes: 0,
        comments: 0
      },
      notes: []
    };

    setBookmarks(prev => [bookmark, ...prev]);
    setNewBookmark({ title: '', description: '', url: '', tags: '', category: 'reference' });
    setIsAddingBookmark(false);

    toast({
      title: "Bookmark Added! 📑",
      description: "Thread has been saved to your bookmarks.",
    });
  };

  const addNote = (bookmarkId: string) => {
    if (!newNote.trim()) return;

    const note: BookmarkNote = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: noteColor
    };

    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === bookmarkId 
        ? { ...bookmark, notes: [...bookmark.notes, note], updatedAt: new Date().toISOString().split('T')[0] }
        : bookmark
    ));

    setNewNote('');
    toast({
      title: "Note Added! 📝",
      description: "Your private note has been saved.",
    });
  };

  const toggleStar = (bookmarkId: string) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === bookmarkId 
        ? { ...bookmark, isStarred: !bookmark.isStarred }
        : bookmark
    ));
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId));
    toast({
      title: "Bookmark Deleted",
      description: "Thread has been removed from your bookmarks.",
    });
  };

  const deleteNote = (bookmarkId: string, noteId: string) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === bookmarkId 
        ? { ...bookmark, notes: bookmark.notes.filter(note => note.id !== noteId) }
        : bookmark
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return '📚';
      case 'reference': return '📖';
      case 'inspiration': return '💡';
      case 'todo': return '✅';
      case 'important': return '⭐';
      default: return '📑';
    }
  };

  const getNoteColorClass = (color: BookmarkNote['color']) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'blue': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'green': return 'bg-green-100 border-green-300 text-green-800';
      case 'red': return 'bg-red-100 border-red-300 text-red-800';
      case 'purple': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-blue-500" />
            Thread Bookmarks
          </h2>
          <p className="text-gray-400 mt-1">Save threads with private notes for future reference</p>
        </div>
        <Dialog open={isAddingBookmark} onOpenChange={setIsAddingBookmark}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Bookmark</DialogTitle>
              <DialogDescription className="text-gray-400">
                Save a thread with optional notes for future reference
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Title *</label>
                <Input
                  placeholder="Enter bookmark title"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  placeholder="Brief description of the thread"
                  value={newBookmark.description}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">URL</label>
                <Input
                  placeholder="Thread URL"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, url: e.target.value }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Tags</label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={newBookmark.tags}
                  onChange={(e) => setNewBookmark(prev => ({ ...prev, tags: e.target.value }))}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Category</label>
                <Select value={newBookmark.category} onValueChange={(value: any) => setNewBookmark(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learning">📚 Learning</SelectItem>
                    <SelectItem value="reference">📖 Reference</SelectItem>
                    <SelectItem value="inspiration">💡 Inspiration</SelectItem>
                    <SelectItem value="todo">✅ Todo</SelectItem>
                    <SelectItem value="important">⭐ Important</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addBookmark} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Add Bookmark
                </Button>
                <Button variant="outline" onClick={() => setIsAddingBookmark(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="starred">⭐ Starred</SelectItem>
            <SelectItem value="learning">📚 Learning</SelectItem>
            <SelectItem value="reference">📖 Reference</SelectItem>
            <SelectItem value="inspiration">💡 Inspiration</SelectItem>
            <SelectItem value="todo">✅ Todo</SelectItem>
            <SelectItem value="important">⭐ Important</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-4">
        {filteredBookmarks.length === 0 ? (
          <Card className="glass border border-gray-600/50">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No bookmarks found</h3>
                <p className="text-gray-400">
                  {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first bookmark'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="glass border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(bookmark.category)}</span>
                      <CardTitle className="text-lg text-white hover:text-blue-300 transition-colors cursor-pointer">
                        {bookmark.title}
                      </CardTitle>
                      {bookmark.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <CardDescription className="text-gray-400 mb-3">
                      {bookmark.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>by {bookmark.threadData.author}</span>
                      <span>•</span>
                      <span>{bookmark.threadData.votes} votes</span>
                      <span>•</span>
                      <span>{bookmark.threadData.comments} comments</span>
                      <span>•</span>
                      <span>Saved {bookmark.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(bookmark.id)}
                      className={bookmark.isStarred ? 'text-yellow-500' : 'text-gray-400'}
                    >
                      <Star className={`h-4 w-4 ${bookmark.isStarred ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Tags */}
                {bookmark.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {bookmark.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Notes Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      Private Notes ({bookmark.notes.length})
                    </h4>
                  </div>

                  {/* Existing Notes */}
                  {bookmark.notes.map((note) => (
                    <div key={note.id} className={`p-3 rounded-lg border-l-4 ${getNoteColorClass(note.color)}`}>
                      <div className="flex items-start justify-between">
                        <p className="text-sm flex-1">{note.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNote(bookmark.id, note.id)}
                          className="p-1 h-auto text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {/* Add New Note */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a private note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Select value={noteColor} onValueChange={(value: any) => setNoteColor(value)}>
                        <SelectTrigger className="w-20 bg-gray-800 border-gray-600">
                          <div className={`w-4 h-4 rounded border ${getNoteColorClass(noteColor)}`}></div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yellow">🟡</SelectItem>
                          <SelectItem value="blue">🔵</SelectItem>
                          <SelectItem value="green">🟢</SelectItem>
                          <SelectItem value="red">🔴</SelectItem>
                          <SelectItem value="purple">🟣</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => addNote(bookmark.id)}
                        disabled={!newNote.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ThreadBookmarks;

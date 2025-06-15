import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from '@/components/ui/menubar';
import { Search, Bell, Settings, User, LogOut, Code, Clock, Tag, Hash, Bot, Sparkles, FileText, Eye, Zap, Play, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { usePosts } from '@/hooks/usePosts';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import AuthModal from './AuthModal';
import AiToolsModal from './ai/AiToolsModal';

interface HeaderProps {
  onNotificationClick?: () => void;
  notificationCount?: number;
}

const Header = ({ onNotificationClick, notificationCount = 3 }: HeaderProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAiToolsModal, setShowAiToolsModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['React hooks', 'TypeScript', 'CSS Grid', 'Node.js API', 'Database optimization']);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { setSelectedTag, setActiveSection } = useApp();
  const { posts } = usePosts();
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [searchOpen]);

  // Enhanced search filtering with better matching
  const filteredResults = debouncedQuery.length > 0 ? posts.filter(post => {
    const searchTerm = debouncedQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.author.name.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (post.code && post.code.toLowerCase().includes(searchTerm))
    );
  }).slice(0, 8) : [];

  const popularTags = ['javascript', 'react', 'python', 'typescript', 'nodejs', 'css', 'api', 'database'];

  const handleLogout = () => {
    logout();
    console.log('User logged out');
  };

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query);
    setSearchOpen(false);
    setActiveSection('Home');
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    
    console.log('Search selected:', query);
  };

  const handleTagSearch = (tag: string) => {
    setSelectedTag(tag);
    setActiveSection('Home');
    setSearchOpen(false);
    setSearchQuery('');
    console.log('Tag selected:', tag);
  };

  const handlePostSelect = (postId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setActiveSection('Home');
    console.log('Post selected:', postId);
  };

  const handleSearchFocus = () => {
    setSearchOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!searchOpen) {
      setSearchOpen(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handlePlaygroundClick = () => {
    navigate('/playground');
    console.log('Navigating to Code Playground');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Code className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                DevForum
              </span>
            </div>

            {/* AI Tools and Code Playground Menu */}
            <div className="flex items-center gap-3">
              <Menubar className="bg-gray-900/50 border-gray-700">
                <MenubarMenu>
                  <MenubarTrigger className="text-white hover:bg-gray-800 data-[state=open]:bg-gray-800 flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    AI Tools
                  </MenubarTrigger>
                  <MenubarContent className="bg-gray-900 border-gray-700 text-white z-50">
                    <MenubarItem 
                      className="hover:bg-gray-800 flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowAiToolsModal(true)}
                    >
                      <Sparkles className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="font-medium">Post Suggestions</div>
                        <div className="text-xs text-gray-400">AI-powered recommendations</div>
                      </div>
                    </MenubarItem>
                    <MenubarItem 
                      className="hover:bg-gray-800 flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowAiToolsModal(true)}
                    >
                      <FileText className="h-4 w-4 text-green-400" />
                      <div>
                        <div className="font-medium">Code Review Bot</div>
                        <div className="text-xs text-gray-400">Auto-review shared code</div>
                      </div>
                    </MenubarItem>
                    <MenubarItem 
                      className="hover:bg-gray-800 flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowAiToolsModal(true)}
                    >
                      <Tag className="h-4 w-4 text-yellow-400" />
                      <div>
                        <div className="font-medium">Smart Tagging</div>
                        <div className="text-xs text-gray-400">Auto-generate tags with NLP</div>
                      </div>
                    </MenubarItem>
                    <MenubarItem 
                      className="hover:bg-gray-800 flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowAiToolsModal(true)}
                    >
                      <Eye className="h-4 w-4 text-cyan-400" />
                      <div>
                        <div className="font-medium">Thread Summaries</div>
                        <div className="text-xs text-gray-400">AI-generated overviews</div>
                      </div>
                    </MenubarItem>
                    <MenubarItem 
                      className="hover:bg-gray-800 flex items-center gap-3 cursor-pointer"
                      onClick={() => setShowAiToolsModal(true)}
                    >
                      <Zap className="h-4 w-4 text-orange-400" />
                      <div>
                        <div className="font-medium">Duplicate Detection</div>
                        <div className="text-xs text-gray-400">Find similar threads</div>
                      </div>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              {/* Code Playground Button */}
              <Button
                onClick={handlePlaygroundClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Code Playground
              </Button>
            </div>
          </div>

          {/* Enhanced Search with improved functionality */}
          <div className="flex-1 max-w-md mx-8" ref={searchContainerRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                ref={searchInputRef}
                placeholder="Search posts, code, users..."
                className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              
              {/* Enhanced Search Dropdown */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                  <div className="p-2">
                    {/* Search Results */}
                    {filteredResults.length > 0 && (
                      <div className="mb-4">
                        <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Search Results
                        </div>
                        <div className="space-y-1">
                          {filteredResults.map((post) => (
                            <div
                              key={post.id}
                              className="p-3 rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handlePostSelect(post.id)}
                            >
                              <div className="font-medium text-white text-sm mb-1">{post.title}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>by {post.author.name}</span>
                                <span>•</span>
                                <span>{post.votes} votes</span>
                                <span>•</span>
                                <span>{post.comments} comments</span>
                              </div>
                              {post.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {post.tags.slice(0, 3).map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs px-1 py-0 text-blue-400 border-blue-500/30">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Tags */}
                    {debouncedQuery.length === 0 && (
                      <div className="mb-4">
                        <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Popular Tags
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {popularTags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handleTagSearch(tag)}
                            >
                              <Hash className="h-3 w-3 text-blue-500" />
                              <span className="text-sm text-white">{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {debouncedQuery.length === 0 && recentSearches.length > 0 && (
                      <div>
                        <div className="px-2 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Recent Searches
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search) => (
                            <div
                              key={search}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 cursor-pointer transition-colors"
                              onClick={() => handleSearchSelect(search)}
                            >
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-white">{search}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {debouncedQuery.length > 0 && filteredResults.length === 0 && (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No results found for "{debouncedQuery}"</p>
                        <p className="text-gray-500 text-xs mt-1">Try different keywords or browse popular tags</p>
                      </div>
                    )}

                    {/* Empty State */}
                    {debouncedQuery.length === 0 && filteredResults.length === 0 && recentSearches.length === 0 && (
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Start typing to search...</p>
                        <p className="text-gray-500 text-xs mt-1">Search posts, code, users, and more</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationPanel />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-800">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gray-700 text-white">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700 z-50" align="end">
                    <div className="px-2 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                          {user.reputation} Rep
                        </Badge>
                        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
                          Level {Math.floor((user.reputation || 0) / 100) + 1}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuItem onClick={handleProfileClick} className="text-white hover:bg-gray-800 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick} className="text-white hover:bg-gray-800 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-gray-800 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <AiToolsModal 
        isOpen={showAiToolsModal} 
        onClose={() => setShowAiToolsModal(false)} 
      />
    </>
  );
};

export default Header;

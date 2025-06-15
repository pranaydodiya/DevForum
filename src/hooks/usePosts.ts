import { useState } from 'react';

export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  content: string;
  createdAt: string;
  votes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  code?: string;
  language?: string;
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  type?: 'question' | 'discussion' | 'code-review';
  views?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface TrendingTopic {
  tag: string;
  count: number;
  growth: number;
  posts: Post[];
}

const defaultComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: { name: 'Mike Johnson', reputation: 1500 },
    content: 'Great question! I recommend using React.memo() and useMemo() hooks for optimization.',
    createdAt: '2024-06-14T11:00:00Z',
    votes: 8,
    replies: [
      {
        id: '1-1',
        postId: '1',
        author: { name: 'Sarah Chen', reputation: 2340 },
        content: 'Exactly! Also consider useCallback for functions.',
        createdAt: '2024-06-14T11:15:00Z',
        votes: 3
      }
    ]
  }
];

const defaultPosts: Post[] = [
  {
    id: '1',
    title: 'How to optimize React rendering performance?',
    content: 'I\'m working on a large React application and noticing some performance issues with frequent re-renders. What are the best practices for optimizing React component rendering?',
    author: {
      name: 'Sarah Chen',
      avatar: 'SC',
      reputation: 2340
    },
    createdAt: '2024-06-14T10:30:00Z',
    votes: 22,
    comments: 12,
    tags: ['react', 'performance', 'optimization'],
    type: 'question',
    views: 1250,
    difficulty: 'intermediate'
  },
  {
    id: '2',
    title: 'Code Review: TypeScript API Client Implementation',
    content: 'Looking for feedback on my TypeScript API client. Any suggestions for improvement?',
    code: `class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    return response.json();
  }
}`,
    language: 'typescript',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'AR',
      reputation: 1890
    },
    createdAt: '2024-06-14T09:15:00Z',
    votes: 17,
    comments: 8,
    tags: ['typescript', 'api', 'architecture'],
    type: 'code-review',
    views: 890,
    difficulty: 'advanced'
  },
  {
    id: '3',
    title: 'AI-Powered Code Generation with GPT-4',
    content: 'Exploring how to integrate AI into development workflow. Here\'s my implementation of an AI code assistant.',
    code: `const aiCodeGenerator = async (prompt: string) => {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return await response.json();
};`,
    language: 'javascript',
    author: {
      name: 'Emma Davis',
      avatar: 'ED',
      reputation: 2890
    },
    createdAt: '2024-06-14T08:45:00Z',
    votes: 45,
    comments: 24,
    tags: ['ai', 'gpt-4', 'automation', 'javascript'],
    type: 'discussion',
    views: 2340,
    difficulty: 'advanced'
  }
];

const trendingTopics: TrendingTopic[] = [
  { tag: 'ai', count: 45, growth: 25, posts: defaultPosts.filter(p => p.tags.includes('ai')) },
  { tag: 'react', count: 38, growth: 12, posts: defaultPosts.filter(p => p.tags.includes('react')) },
  { tag: 'typescript', count: 29, growth: 8, posts: defaultPosts.filter(p => p.tags.includes('typescript')) },
  { tag: 'performance', count: 22, growth: 15, posts: defaultPosts.filter(p => p.tags.includes('performance')) }
];

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [myPosts] = useState<Post[]>([defaultPosts[1]]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [starredPosts, setStarredPosts] = useState<Post[]>([]);

  const addPost = (newPost: Omit<Post, 'id' | 'createdAt' | 'votes' | 'comments' | 'views'>) => {
    const post: Post = {
      ...newPost,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      votes: 0,
      comments: 0,
      views: 0,
    };
    
    setPosts(prev => [post, ...prev]);
    return post;
  };

  const addComment = (postId: string, content: string, parentId?: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: { name: 'Current User', reputation: 1250 },
      content,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setComments(prev => {
      if (parentId) {
        return prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment]
            };
          }
          return comment;
        });
      }
      return [newComment, ...prev];
    });

    // Update post comment count
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
  };

  const getCommentsForPost = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  const toggleBookmark = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setSavedPosts(prev => {
      const isBookmarked = prev.some(p => p.id === postId);
      if (isBookmarked) {
        return prev.filter(p => p.id !== postId);
      } else {
        return [...prev, post];
      }
    });
  };

  const toggleStar = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    setStarredPosts(prev => {
      const isStarred = prev.some(p => p.id === postId);
      if (isStarred) {
        return prev.filter(p => p.id !== postId);
      } else {
        return [...prev, post];
      }
    });
  };

  const downloadCode = (code: string, filename: string = 'code.txt') => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    posts,
    myPosts,
    savedPosts,
    starredPosts,
    comments,
    trendingTopics,
    addPost,
    addComment,
    getCommentsForPost,
    toggleBookmark,
    toggleStar,
    downloadCode,
  };
};

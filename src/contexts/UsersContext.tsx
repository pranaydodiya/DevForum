
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CommunityUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinDate: string;
  bio?: string;
  isFollowing?: boolean;
}

interface UsersContextType {
  users: CommunityUser[];
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getFollowersCount: () => number;
  getFollowingCount: () => number;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

interface UsersProviderProps {
  children: ReactNode;
}

const defaultUsers: CommunityUser[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    email: 'alex@devforum.com',
    avatar: 'AR',
    reputation: 1890,
    joinDate: '2023-02-15',
    bio: 'Full-stack developer passionate about React and Node.js',
    isFollowing: true
  },
  {
    id: '2',
    name: 'Emma Davis',
    email: 'emma@devforum.com',
    avatar: 'ED',
    reputation: 2890,
    joinDate: '2023-01-10',
    bio: 'AI/ML engineer and Python enthusiast',
    isFollowing: true
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@devforum.com',
    avatar: 'MJ',
    reputation: 1500,
    joinDate: '2023-03-20',
    bio: 'Frontend specialist with love for clean UI/UX',
    isFollowing: false
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@devforum.com',
    avatar: 'LC',
    reputation: 2100,
    joinDate: '2023-01-25',
    bio: 'DevOps engineer and cloud architecture expert',
    isFollowing: true
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@devforum.com',
    avatar: 'DW',
    reputation: 1750,
    joinDate: '2023-04-05',
    bio: 'Mobile app developer focused on React Native',
    isFollowing: false
  },
  {
    id: '6',
    name: 'Sophie Martin',
    email: 'sophie@devforum.com',
    avatar: 'SM',
    reputation: 3200,
    joinDate: '2022-12-10',
    bio: 'Senior backend engineer with expertise in microservices',
    isFollowing: true
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@devforum.com',
    avatar: 'JB',
    reputation: 980,
    joinDate: '2023-05-12',
    bio: 'Junior developer learning modern web technologies',
    isFollowing: false
  },
  {
    id: '8',
    name: 'Maria Garcia',
    email: 'maria@devforum.com',
    avatar: 'MG',
    reputation: 2450,
    joinDate: '2023-02-28',
    bio: 'Security specialist and ethical hacker',
    isFollowing: true
  },
  {
    id: '9',
    name: 'Ryan Taylor',
    email: 'ryan@devforum.com',
    avatar: 'RT',
    reputation: 1650,
    joinDate: '2023-03-15',
    bio: 'Game developer with Unity and Unreal Engine experience',
    isFollowing: false
  },
  {
    id: '10',
    name: 'Anna Thompson',
    email: 'anna@devforum.com',
    avatar: 'AT',
    reputation: 2800,
    joinDate: '2023-01-05',
    bio: 'Data scientist and machine learning researcher',
    isFollowing: true
  }
];

export const UsersProvider = ({ children }: UsersProviderProps) => {
  const [users, setUsers] = useState<CommunityUser[]>(defaultUsers);

  const followUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: true } : user
    ));
  };

  const unfollowUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: false } : user
    ));
  };

  const getFollowersCount = () => {
    return 234; // Static for current user
  };

  const getFollowingCount = () => {
    return users.filter(user => user.isFollowing).length;
  };

  return (
    <UsersContext.Provider value={{ 
      users, 
      followUser, 
      unfollowUser, 
      getFollowersCount, 
      getFollowingCount 
    }}>
      {children}
    </UsersContext.Provider>
  );
};

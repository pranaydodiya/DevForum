
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ModerationFlag {
  id: string;
  postId?: string;
  commentId?: string;
  reporterId: string;
  reason: 'spam' | 'offensive' | 'off-topic' | 'copyright' | 'other';
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface UserTrustLevel {
  userId: string;
  level: 'new' | 'trusted' | 'moderator' | 'admin';
  reputation: number;
  flagsSubmitted: number;
  flagsAccurate: number;
  moderationActions: number;
}

interface ModerationContextType {
  flags: ModerationFlag[];
  userTrust: UserTrustLevel[];
  submitFlag: (flag: Omit<ModerationFlag, 'id' | 'createdAt' | 'status'>) => void;
  resolveFlag: (flagId: string, action: 'resolved' | 'dismissed') => void;
  getUserTrustLevel: (userId: string) => UserTrustLevel;
  canModerate: (userId: string) => boolean;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

export const useModeration = () => {
  const context = useContext(ModerationContext);
  if (context === undefined) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
};

interface ModerationProviderProps {
  children: ReactNode;
}

const defaultUserTrust: UserTrustLevel[] = [
  { userId: 'current', level: 'trusted', reputation: 1250, flagsSubmitted: 5, flagsAccurate: 4, moderationActions: 2 },
  { userId: '1', level: 'moderator', reputation: 2890, flagsSubmitted: 15, flagsAccurate: 14, moderationActions: 25 },
  { userId: '2', level: 'admin', reputation: 3200, flagsSubmitted: 8, flagsAccurate: 8, moderationActions: 50 }
];

export const ModerationProvider = ({ children }: ModerationProviderProps) => {
  const [flags, setFlags] = useState<ModerationFlag[]>([]);
  const [userTrust, setUserTrust] = useState<UserTrustLevel[]>(defaultUserTrust);

  const submitFlag = (flag: Omit<ModerationFlag, 'id' | 'createdAt' | 'status'>) => {
    const newFlag: ModerationFlag = {
      ...flag,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setFlags(prev => [newFlag, ...prev]);
    
    // Update user trust metrics
    setUserTrust(prev => prev.map(user => 
      user.userId === flag.reporterId 
        ? { ...user, flagsSubmitted: user.flagsSubmitted + 1 }
        : user
    ));
  };

  const resolveFlag = (flagId: string, action: 'resolved' | 'dismissed') => {
    setFlags(prev => prev.map(flag => 
      flag.id === flagId 
        ? { 
            ...flag, 
            status: action, 
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'current'
          }
        : flag
    ));
  };

  const getUserTrustLevel = (userId: string): UserTrustLevel => {
    return userTrust.find(u => u.userId === userId) || {
      userId,
      level: 'new',
      reputation: 0,
      flagsSubmitted: 0,
      flagsAccurate: 0,
      moderationActions: 0
    };
  };

  const canModerate = (userId: string): boolean => {
    const trust = getUserTrustLevel(userId);
    return trust.level === 'moderator' || trust.level === 'admin' || 
           (trust.level === 'trusted' && trust.reputation > 1000);
  };

  return (
    <ModerationContext.Provider value={{
      flags,
      userTrust,
      submitFlag,
      resolveFlag,
      getUserTrustLevel,
      canModerate
    }}>
      {children}
    </ModerationContext.Provider>
  );
};

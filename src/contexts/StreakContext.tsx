
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StreakContextType {
  streakDays: number;
  lastActiveDate: string;
  updateStreak: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

interface StreakProviderProps {
  children: ReactNode;
}

export const StreakProvider = ({ children }: StreakProviderProps) => {
  const [streakDays, setStreakDays] = useState(12);
  const [lastActiveDate, setLastActiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (lastActiveDate === yesterday) {
      // Continuing streak
      setStreakDays(prev => prev + 1);
      setLastActiveDate(today);
    } else if (lastActiveDate !== today) {
      // Breaking streak or starting new
      setStreakDays(1);
      setLastActiveDate(today);
    }
  };

  // Auto-update streak on component mount
  useEffect(() => {
    updateStreak();
  }, []);

  return (
    <StreakContext.Provider value={{ streakDays, lastActiveDate, updateStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

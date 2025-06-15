
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Home');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      selectedTag,
      setSelectedTag,
    }}>
      {children}
    </AppContext.Provider>
  );
};

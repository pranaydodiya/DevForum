
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem('devforum_onboarding_completed');
      const hasSkippedOnboarding = localStorage.getItem('devforum_onboarding_skipped');
      const lastLoginUser = localStorage.getItem('devforum_last_login_user');

      // Check if this is a new user or first login
      const isNewUser = lastLoginUser !== user.email;
      
      if (isNewUser) {
        setIsFirstLogin(true);
        localStorage.setItem('devforum_last_login_user', user.email);
        
        // Show onboarding if not completed or skipped
        if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
          setShowOnboarding(true);
        }
      }
    }
  }, [user]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('devforum_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('devforum_onboarding_completed');
    localStorage.removeItem('devforum_onboarding_skipped');
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    isFirstLogin,
    startOnboarding,
    closeOnboarding,
    completeOnboarding,
    resetOnboarding
  };
};

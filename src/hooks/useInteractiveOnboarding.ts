import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DevForum! 🎉',
    description: 'Let\'s take a comprehensive tour of all the amazing features that make DevForum the best platform for developers to collaborate and grow.',
    target: 'body',
    position: 'center'
  },
  {
    id: 'create-post',
    title: 'Share Your Code & Ideas',
    description: 'Click here to create your first post! Share code snippets, ask questions, or start discussions with our Monaco editor supporting syntax highlighting for all languages.',
    target: '[data-onboarding="create-post"]',
    position: 'bottom'
  },
  {
    id: 'playground-intro',
    title: 'Discover the Code Playground 🚀',
    description: 'Welcome to our powerful Code Playground! Execute code in real-time, compare versions, and track every change. Click here to explore the ultimate coding environment.',
    target: '[data-onboarding="playground-tab"]',
    position: 'right'
  },
  {
    id: 'code-execution',
    title: 'Run Code in Your Browser ⚡',
    description: 'Execute JavaScript, Python, and C++ code directly in your browser! See console output in real-time and experiment with trending snippets.',
    target: '[data-onboarding="code-editor"]',
    position: 'bottom'
  },
  {
    id: 'run-code-demo',
    title: 'Try Running Some Code!',
    description: 'Click the Run button to execute the sample Fibonacci code. Watch the magic happen as your code runs in a secure sandbox environment.',
    target: '[data-onboarding="run-button"]',
    position: 'left'
  },
  {
    id: 'diff-viewer',
    title: 'Visual Code Comparison 🔍',
    description: 'See exactly what changed with our side-by-side diff viewer. Perfect for code reviews, tracking edits, and understanding improvements.',
    target: '[data-onboarding="diff-viewer"]',
    position: 'bottom'
  },
  {
    id: 'version-history',
    title: 'Never Lose Your Work 📚',
    description: 'Every edit is saved! Browse your complete revision history, restore previous versions, and see exactly how your code evolved over time.',
    target: '[data-onboarding="version-history"]',
    position: 'left'
  },
  {
    id: 'ai-assistant',
    title: 'AI-Powered Development Assistant',
    description: 'Get intelligent code suggestions, automated code reviews, and smart assistance for your development challenges using our advanced AI tools.',
    target: '[data-onboarding="ai-assistant"]',
    position: 'left'
  },
  {
    id: 'code-challenges',
    title: 'Weekly Code Challenges',
    description: 'Participate in exciting coding challenges, compete with other developers, and climb the leaderboard to showcase your programming skills.',
    target: '[data-onboarding="challenges"]',
    position: 'right'
  },
  {
    id: 'live-collaboration',
    title: 'Real-time Pair Programming',
    description: 'Collaborate with other developers in real-time! Share your screen, code together, and learn from experienced developers in live sessions.',
    target: '[data-onboarding="live-programming"]',
    position: 'bottom'
  },
  {
    id: 'community-stats',
    title: 'Community Insights & Stats',
    description: 'Explore community activity, see who\'s online, discover trending topics, and track the pulse of our vibrant developer community.',
    target: '[data-onboarding="community-stats"]',
    position: 'right'
  },
  {
    id: 'reputation-system',
    title: 'Build Your Developer Reputation',
    description: 'Earn reputation points through helpful contributions, quality posts, and community engagement. Your expertise is recognized and rewarded!',
    target: '[data-onboarding="reputation"]',
    position: 'bottom'
  },
  {
    id: 'bookmarks-saved',
    title: 'Save & Organize Content',
    description: 'Bookmark interesting posts, save code snippets for later, and organize your favorite content for easy access and reference.',
    target: '[data-onboarding="bookmarks"]',
    position: 'left'
  },
  {
    id: 'notifications',
    title: 'Stay Updated with Notifications',
    description: 'Never miss important updates! Get real-time notifications for replies, mentions, new challenges, and community activities.',
    target: '[data-onboarding="notifications"]',
    position: 'bottom'
  },
  {
    id: 'trending-topics',
    title: 'Discover Trending Technologies',
    description: 'Explore what\'s hot in the dev world! Discover trending technologies, popular frameworks, and emerging tools discussed by the community.',
    target: '[data-onboarding="trending-topics"]',
    position: 'right'
  },
  {
    id: 'user-analytics',
    title: 'Track Your Growth & Progress',
    description: 'Monitor your learning journey with detailed analytics showing your activity, contributions, skill development, and community impact.',
    target: '[data-onboarding="user-analytics"]',
    position: 'left'
  },
  {
    id: 'profile-customization',
    title: 'Showcase Your Developer Profile',
    description: 'Customize your profile to highlight your skills, showcase projects, display achievements, and connect with like-minded developers.',
    target: '[data-onboarding="profile-menu"]',
    position: 'bottom'
  }
];

export const useInteractiveOnboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const { user } = useAuth();

  const updateSpotlightPosition = useCallback(() => {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    
    setSpotlightPosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
  }, [targetElement]);

  const findTargetElement = useCallback((selector: string) => {
    // First try to find by data attribute
    let element = document.querySelector(selector);
    
    if (!element && selector.includes('data-onboarding')) {
      const stepId = selector.match(/data-onboarding="([^"]+)"/)?.[1];
      
      switch (stepId) {
        case 'playground-tab':
          element = document.querySelector('[data-onboarding="playground-tab"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('playground')
                   ) ||
                   Array.from(document.querySelectorAll('button')).find(btn =>
                     btn.textContent?.toLowerCase().includes('playground')
                   );
          break;

        case 'code-editor':
          element = document.querySelector('.monaco-editor') ||
                   document.querySelector('[data-onboarding="code-editor"]') ||
                   Array.from(document.querySelectorAll('div')).find(div =>
                     div.classList.toString().includes('monaco')
                   );
          break;

        case 'run-button':
          element = Array.from(document.querySelectorAll('button')).find(btn =>
                   btn.textContent?.toLowerCase().includes('run') &&
                   btn.querySelector('[data-lucide="play"]')
                 ) ||
                 document.querySelector('[data-onboarding="run-button"]');
          break;

        case 'diff-viewer':
          element = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                    tab.textContent?.toLowerCase().includes('diff')
                  ) ||
                  document.querySelector('[data-onboarding="diff-viewer"]');
          break;

        case 'version-history':
          element = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                    tab.textContent?.toLowerCase().includes('history') ||
                    tab.textContent?.toLowerCase().includes('version')
                  ) ||
                  document.querySelector('[data-onboarding="version-history"]');
          break;

        case 'create-post':
          element = document.querySelector('button[class*="create"]') ||
                   document.querySelector('[data-testid="create-post"]') ||
                   Array.from(document.querySelectorAll('button')).find(btn => 
                     btn.textContent?.toLowerCase().includes('create') ||
                     btn.textContent?.toLowerCase().includes('post') ||
                     btn.textContent?.toLowerCase().includes('new')
                   ) ||
                   document.querySelector('header button:first-of-type') ||
                   document.querySelector('.header button');
          break;

        case 'ai-assistant':
          element = document.querySelector('[data-testid="ai-assistant"]') ||
                   document.querySelector('button[class*="ai"]') ||
                   Array.from(document.querySelectorAll('button, div, span')).find(el => 
                     el.textContent?.toLowerCase().includes('ai') ||
                     el.textContent?.toLowerCase().includes('assistant')
                   ) ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('ai')
                   );
          break;

        case 'challenges':
          element = document.querySelector('[data-testid="challenges"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('challenge')
                   ) ||
                   Array.from(document.querySelectorAll('h1, h2, h3, div')).find(el => 
                     el.textContent?.toLowerCase().includes('challenge')
                   )?.closest('div, section');
          break;

        case 'live-programming':
          element = document.querySelector('[data-testid="live-programming"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('pair') ||
                     tab.textContent?.toLowerCase().includes('live')
                   ) ||
                   Array.from(document.querySelectorAll('button, div')).find(el => 
                     el.textContent?.toLowerCase().includes('live') ||
                     el.textContent?.toLowerCase().includes('pair') ||
                     el.textContent?.toLowerCase().includes('collaboration')
                   );
          break;

        case 'community-stats':
          element = document.querySelector('[data-testid="community-stats"]') ||
                   document.querySelector('aside') ||
                   Array.from(document.querySelectorAll('h2, h3, div')).find(el => 
                     el.textContent?.includes('Community') ||
                     el.textContent?.includes('Stats')
                   )?.closest('div, section') ||
                   document.querySelector('.sidebar');
          break;

        case 'reputation':
          element = document.querySelector('[data-testid="reputation"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('reputation')
                   ) ||
                   Array.from(document.querySelectorAll('div, span, p')).find(el => 
                     el.textContent?.toLowerCase().includes('reputation')
                   ) ||
                   document.querySelector('[data-state="active"][value="reputation"]');
          break;

        case 'bookmarks':
          element = document.querySelector('[data-testid="bookmarks"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('bookmark')
                   ) ||
                   Array.from(document.querySelectorAll('button')).find(btn => 
                     btn.textContent?.toLowerCase().includes('bookmark')
                   );
          break;

        case 'notifications':
          element = document.querySelector('[data-testid="notifications"]') ||
                   document.querySelector('button[class*="notification"]') ||
                   Array.from(document.querySelectorAll('button')).find(btn => 
                     btn.textContent?.toLowerCase().includes('notification') ||
                     btn.getAttribute('aria-label')?.toLowerCase().includes('notification')
                   ) ||
                   document.querySelector('[data-lucide="bell"]')?.closest('button') ||
                   document.querySelector('header button[class*="relative"]');
          break;

        case 'trending-topics':
          element = document.querySelector('[data-testid="trending-topics"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('trending')
                   ) ||
                   Array.from(document.querySelectorAll('h2, h3, div')).find(el => 
                     el.textContent?.toLowerCase().includes('trending')
                   )?.closest('div, section');
          break;

        case 'user-analytics':
          element = document.querySelector('[data-testid="user-analytics"]') ||
                   Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                     tab.textContent?.toLowerCase().includes('analytics')
                   ) ||
                   Array.from(document.querySelectorAll('div, h2, h3')).find(el => 
                     el.textContent?.toLowerCase().includes('analytics')
                   );
          break;

        case 'profile-menu':
          element = document.querySelector('[data-testid="profile-menu"]') ||
                   document.querySelector('button[class*="profile"]') ||
                   document.querySelector('button[class*="avatar"]') ||
                   document.querySelector('img[alt*="avatar"]')?.closest('button') ||
                   document.querySelector('img[alt*="profile"]')?.closest('button') ||
                   document.querySelector('header img[class*="avatar"]')?.closest('button') ||
                   document.querySelector('header button:last-of-type') ||
                   Array.from(document.querySelectorAll('header button')).find(btn =>
                     btn.querySelector('img') || btn.textContent?.includes(user?.name || '')
                   );
          break;
      }
      
      if (element) {
        element.setAttribute('data-onboarding', stepId!);
        console.log(`Found and tagged element for ${stepId}:`, element);
      } else {
        console.log(`Could not find element for ${stepId}`);
      }
    }
    
    return element;
  }, [user]);

  useEffect(() => {
    if (user && !localStorage.getItem('devforum_interactive_onboarding_completed')) {
      const hasSkipped = localStorage.getItem('devforum_interactive_onboarding_skipped');
      if (!hasSkipped) {
        setTimeout(() => setIsActive(true), 2000);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isActive && onboardingSteps[currentStep]) {
      const step = onboardingSteps[currentStep];
      
      if (step.target === 'body') {
        setTargetElement(document.body);
        setSpotlightPosition({ x: 0, y: 0, width: 0, height: 0 });
        return;
      }
      
      const element = findTargetElement(step.target);
      
      if (element) {
        setTargetElement(element);
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      } else {
        console.log(`Element not found for step: ${step.id}, selector: ${step.target}`);
        setSpotlightPosition({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 25, width: 200, height: 50 });
      }
    }
  }, [isActive, currentStep, findTargetElement]);

  useEffect(() => {
    if (targetElement && isActive && targetElement !== document.body) {
      updateSpotlightPosition();
      
      const handleResize = () => updateSpotlightPosition();
      const handleScroll = () => updateSpotlightPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [targetElement, isActive, updateSpotlightPosition]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('devforum_interactive_onboarding_skipped', 'true');
    setIsActive(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('devforum_interactive_onboarding_completed', 'true');
    setIsActive(false);
  };

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('devforum_interactive_onboarding_completed');
    localStorage.removeItem('devforum_interactive_onboarding_skipped');
    startOnboarding();
  };

  return {
    isActive,
    currentStep,
    totalSteps: onboardingSteps.length,
    currentStepData: onboardingSteps[currentStep],
    spotlightPosition,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
    startOnboarding,
    resetOnboarding
  };
};

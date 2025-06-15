import { useEffect } from 'react';

const OnboardingWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const addDataAttributes = () => {
      // Target create post button with multiple fallbacks
      const createPostBtn = document.querySelector('button[class*="create"]') ||
                           document.querySelector('[data-testid="create-post"]') ||
                           Array.from(document.querySelectorAll('button')).find(btn => 
                             btn.textContent?.toLowerCase().includes('create') ||
                             btn.textContent?.toLowerCase().includes('post') ||
                             btn.textContent?.toLowerCase().includes('new')
                           ) ||
                           document.querySelector('header button:first-of-type');
      if (createPostBtn) {
        createPostBtn.setAttribute('data-onboarding', 'create-post');
      }

      // Target AI assistant tabs
      const aiAssistant = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                         tab.textContent?.toLowerCase().includes('ai')
                       ) ||
                       document.querySelector('[data-testid="ai-assistant"]');
      if (aiAssistant) {
        aiAssistant.setAttribute('data-onboarding', 'ai-assistant');
      }

      // Target challenges tab
      const challenges = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                        tab.textContent?.toLowerCase().includes('challenge')
                      ) ||
                      document.querySelector('[data-testid="challenges"]');
      if (challenges) {
        challenges.setAttribute('data-onboarding', 'challenges');
      }

      // Target live programming tab
      const liveProgramming = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                             tab.textContent?.toLowerCase().includes('pair') ||
                             tab.textContent?.toLowerCase().includes('live')
                           ) ||
                           document.querySelector('[data-testid="live-programming"]');
      if (liveProgramming) {
        liveProgramming.setAttribute('data-onboarding', 'live-programming');
      }

      // Target community stats section (sidebar)
      const communityStats = document.querySelector('aside') ||
                             document.querySelector('.sidebar') ||
                             Array.from(document.querySelectorAll('h2, h3')).find(el => 
                               el.textContent?.includes('Community')
                             )?.closest('div, section');
      if (communityStats) {
        communityStats.setAttribute('data-onboarding', 'community-stats');
      }

      // Target reputation tab
      const reputation = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                        tab.textContent?.toLowerCase().includes('reputation')
                      ) ||
                      document.querySelector('[data-state="active"][value="reputation"]');
      if (reputation) {
        reputation.setAttribute('data-onboarding', 'reputation');
      }

      // Target bookmarks tab
      const bookmarks = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                       tab.textContent?.toLowerCase().includes('bookmark')
                     ) ||
                     document.querySelector('[data-testid="bookmarks"]');
      if (bookmarks) {
        bookmarks.setAttribute('data-onboarding', 'bookmarks');
      }

      // Target notifications button (look for bell icon or notification text)
      const notifications = document.querySelector('[data-lucide="bell"]')?.closest('button') ||
                           document.querySelector('button[class*="notification"]') ||
                           Array.from(document.querySelectorAll('header button')).find(btn =>
                             btn.textContent?.toLowerCase().includes('notification') ||
                             btn.getAttribute('aria-label')?.toLowerCase().includes('notification')
                           );
      if (notifications) {
        notifications.setAttribute('data-onboarding', 'notifications');
      }

      // Target trending topics tab
      const trendingTopics = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                            tab.textContent?.toLowerCase().includes('trending')
                          ) ||
                          document.querySelector('[data-testid="trending-topics"]');
      if (trendingTopics) {
        trendingTopics.setAttribute('data-onboarding', 'trending-topics');
      }

      // Target user analytics tab
      const userAnalytics = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                           tab.textContent?.toLowerCase().includes('analytics')
                         ) ||
                         document.querySelector('[data-testid="user-analytics"]');
      if (userAnalytics) {
        userAnalytics.setAttribute('data-onboarding', 'user-analytics');
      }

      // Target profile menu (avatar button in header)
      const profileMenu = document.querySelector('header img[class*="avatar"]')?.closest('button') ||
                         document.querySelector('button[class*="profile"]') ||
                         document.querySelector('button[class*="avatar"]') ||
                         document.querySelector('img[alt*="avatar"]')?.closest('button') ||
                         document.querySelector('header button:last-of-type');
      if (profileMenu) {
        profileMenu.setAttribute('data-onboarding', 'profile-menu');
      }

      // Target playground tab
      const playgroundTab = document.querySelector('[data-onboarding="playground-tab"]') ||
                           Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                             tab.textContent?.toLowerCase().includes('playground')
                           ) ||
                           Array.from(document.querySelectorAll('button')).find(btn =>
                             btn.textContent?.toLowerCase().includes('playground')
                           );
      if (playgroundTab) {
        playgroundTab.setAttribute('data-onboarding', 'playground-tab');
      }

      // Target code execution area
      const codeEditor = document.querySelector('.monaco-editor') ||
                        document.querySelector('[data-onboarding="code-editor"]') ||
                        Array.from(document.querySelectorAll('div')).find(div =>
                          div.classList.toString().includes('monaco') ||
                          div.textContent?.includes('Run')
                        );
      if (codeEditor) {
        codeEditor.setAttribute('data-onboarding', 'code-editor');
      }

      // Target run button in playground
      const runButton = Array.from(document.querySelectorAll('button')).find(btn =>
                       btn.textContent?.toLowerCase().includes('run') &&
                       btn.querySelector('[data-lucide="play"]')
                     ) ||
                     document.querySelector('[data-onboarding="run-button"]');
      if (runButton) {
        runButton.setAttribute('data-onboarding', 'run-button');
      }

      // Target diff viewer
      const diffViewer = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                        tab.textContent?.toLowerCase().includes('diff')
                      ) ||
                      document.querySelector('[data-onboarding="diff-viewer"]');
      if (diffViewer) {
        diffViewer.setAttribute('data-onboarding', 'diff-viewer');
      }

      // Target version history
      const versionHistory = Array.from(document.querySelectorAll('[role="tab"]')).find(tab =>
                            tab.textContent?.toLowerCase().includes('history') ||
                            tab.textContent?.toLowerCase().includes('version')
                          ) ||
                          document.querySelector('[data-onboarding="version-history"]');
      if (versionHistory) {
        versionHistory.setAttribute('data-onboarding', 'version-history');
      }
    };

    // Run immediately and after DOM updates
    addDataAttributes();
    
    // Use a more frequent observer for dynamic content
    const observer = new MutationObserver(() => {
      setTimeout(addDataAttributes, 100);
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export default OnboardingWrapper;

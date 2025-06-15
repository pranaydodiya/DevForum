import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UsersProvider } from "./contexts/UsersContext";
import { StreakProvider } from "./contexts/StreakContext";
import { EngagementProvider } from "./contexts/EngagementContext";
import { ModerationProvider } from "./contexts/ModerationContext";
import { useOnboarding } from "./hooks/useOnboarding";
import OnboardingFlow from "./components/OnboardingFlow";
import InteractiveOnboarding from "./components/InteractiveOnboarding";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";
import "./components/OnboardingStyles.css";
import OnboardingWrapper from "./components/OnboardingWrapper";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showOnboarding, closeOnboarding, completeOnboarding } = useOnboarding();

  return (
    <OnboardingWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/playground" element={<Playground />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        onComplete={completeOnboarding}
      />
      
      <InteractiveOnboarding />
    </OnboardingWrapper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UsersProvider>
        <StreakProvider>
          <EngagementProvider>
            <ModerationProvider>
              <AppProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AppContent />
                </TooltipProvider>
              </AppProvider>
            </ModerationProvider>
          </EngagementProvider>
        </StreakProvider>
      </UsersProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

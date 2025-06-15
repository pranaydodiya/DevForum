
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Code, 
  MessageSquare, 
  Trophy, 
  Sparkles, 
  User, 
  Zap,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Bookmark,
  Users,
  Brain,
  Target
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  highlight?: string;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DevForum! 🎉',
    description: 'A collaborative platform where developers share code, discuss ideas, and grow together. Let\'s take a quick tour of what makes this community special.',
    icon: Sparkles,
    action: 'Get Started'
  },
  {
    id: 'code-sharing',
    title: 'Live Code Sharing',
    description: 'Share code snippets with syntax highlighting, get instant feedback, and collaborate in real-time with Monaco Editor integration.',
    icon: Code,
    highlight: '.post-card, .create-post',
    action: 'Try Posting Code'
  },
  {
    id: 'discussions',
    title: 'Real-time Discussions',
    description: 'Engage in live conversations with instant comments, replies, and notifications powered by Socket.io for seamless collaboration.',
    icon: MessageSquare,
    highlight: '.comment-section',
    action: 'Join Discussion'
  },
  {
    id: 'reputation',
    title: 'Reputation System',
    description: 'Earn reputation points through upvotes, helpful answers, and consistent activity. Your expertise is recognized and rewarded.',
    icon: Trophy,
    highlight: '.reputation-display',
    action: 'View Reputation'
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Assistance',
    description: 'Get smart code suggestions, duplicate detection, and intelligent tagging to enhance your coding experience.',
    icon: Brain,
    highlight: '.ai-assistant',
    action: 'Try AI Tools'
  },
  {
    id: 'challenges',
    title: 'Code Challenges',
    description: 'Participate in weekly coding challenges, compete with peers, and climb the leaderboard to showcase your skills.',
    icon: Target,
    highlight: '.challenges-section',
    action: 'View Challenges'
  },
  {
    id: 'profile',
    title: 'Your Developer Profile',
    description: 'Customize your profile, showcase your skills, track your achievements, and build your developer reputation.',
    icon: User,
    highlight: '.profile-section',
    action: 'Complete Profile'
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Follow other developers, save interesting posts, maintain activity streaks, and become part of our thriving community.',
    icon: Users,
    highlight: '.community-stats',
    action: 'Explore Community'
  }
];

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingFlow = ({ isOpen, onClose, onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];

  useEffect(() => {
    if (isOpen && step.highlight) {
      // Add spotlight effect to highlighted elements
      const elements = document.querySelectorAll(step.highlight);
      elements.forEach(el => {
        el.classList.add('onboarding-spotlight');
      });

      return () => {
        elements.forEach(el => {
          el.classList.remove('onboarding-spotlight');
        });
      };
    }
  }, [currentStep, isOpen, step.highlight]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 150);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('devforum_onboarding_completed', 'true');
    toast({
      title: "Welcome aboard! 🚀",
      description: "You're all set to start your DevForum journey. Happy coding!",
    });
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('devforum_onboarding_skipped', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-400 hover:text-white"
            >
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className={`glass border border-gray-600/50 transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          <CardContent className="p-8">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Step Content */}
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <step.icon className="h-8 w-8 text-blue-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                {step.description}
              </p>

              {/* Feature Preview */}
              {step.id === 'code-sharing' && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <code className="text-blue-300 text-sm">
                    {`function greetDevForum() {
  console.log("Welcome to the community! 🚀");
}`}
                  </code>
                </div>
              )}

              {step.id === 'reputation' && (
                <div className="flex justify-center gap-4">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    1,250 Reputation
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    3 Badges
                  </Badge>
                </div>
              )}

              {step.id === 'profile' && user && (
                <div className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-gray-400">Developer</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep 
                          ? 'bg-blue-500' 
                          : index < currentStep 
                            ? 'bg-green-500' 
                            : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </>
                  ) : (
                    <>
                      {step.action || 'Next'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        {step.id === 'welcome' && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Code, label: 'Code Sharing' },
              { icon: MessageSquare, label: 'Discussions' },
              { icon: Trophy, label: 'Reputation' },
              { icon: Sparkles, label: 'AI Tools' }
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="flex flex-col items-center p-3 glass rounded-lg border border-gray-700/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className="h-6 w-6 text-blue-400 mb-2" />
                <span className="text-sm text-gray-300">{feature.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

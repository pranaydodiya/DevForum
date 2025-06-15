
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useInteractiveOnboarding } from '@/hooks/useInteractiveOnboarding';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  CheckCircle,
  SkipForward
} from 'lucide-react';

const InteractiveOnboarding = () => {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    spotlightPosition,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding
  } = useInteractiveOnboarding();

  const { toast } = useToast();

  const handleComplete = () => {
    completeOnboarding();
    toast({
      title: "Tour Complete! 🎉",
      description: "You're all set to start your DevForum journey. Happy coding!",
    });
  };

  const handleSkip = () => {
    skipOnboarding();
    toast({
      title: "Tour Skipped",
      description: "You can restart the tour anytime from your settings.",
    });
  };

  if (!isActive || !currentStepData) return null;

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isWelcomeStep = currentStepData.id === 'welcome';
  const isLastStep = currentStep === totalSteps - 1;

  // Create spotlight clip path
  const createSpotlightClipPath = () => {
    if (isWelcomeStep || !spotlightPosition.width) {
      return 'none';
    }
    
    const { x, y, width, height } = spotlightPosition;
    const padding = 8;
    
    return `polygon(
      0% 0%, 
      0% 100%, 
      ${x - padding}px 100%, 
      ${x - padding}px ${y - padding}px, 
      ${x + width + padding}px ${y - padding}px, 
      ${x + width + padding}px ${y + height + padding}px, 
      ${x - padding}px ${y + height + padding}px, 
      ${x - padding}px 100%, 
      100% 100%, 
      100% 0%
    )`;
  };

  const getTooltipPosition = () => {
    if (isWelcomeStep) {
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
    
    const { x, y, width, height } = spotlightPosition;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate available space
    const spaceBelow = viewportHeight - (y + height);
    const spaceAbove = y;
    const spaceRight = viewportWidth - (x + width);
    const spaceLeft = x;
    
    let position = '';
    
    if (spaceBelow > 300) {
      // Place below
      position = `top-[${y + height + 20}px] left-[${Math.max(20, Math.min(x, viewportWidth - 400))}px]`;
    } else if (spaceAbove > 300) {
      // Place above
      position = `top-[${Math.max(20, y - 220)}px] left-[${Math.max(20, Math.min(x, viewportWidth - 400))}px]`;
    } else if (spaceRight > 400) {
      // Place to the right
      position = `top-[${Math.max(20, y)}px] left-[${x + width + 20}px]`;
    } else if (spaceLeft > 400) {
      // Place to the left
      position = `top-[${Math.max(20, y)}px] left-[${x - 420}px]`;
    } else {
      // Fallback to center
      position = 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
    
    return position;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay with spotlight cutout */}
        <div 
          className="absolute inset-0 bg-black/80 transition-all duration-300"
          style={{
            clipPath: createSpotlightClipPath()
          }}
        />

        {/* Spotlight highlight ring */}
        {!isWelcomeStep && spotlightPosition.width > 0 && (
          <motion.div
            className="absolute border-2 border-blue-500 rounded-lg shadow-lg"
            style={{
              left: spotlightPosition.x - 4,
              top: spotlightPosition.y - 4,
              width: spotlightPosition.width + 8,
              height: spotlightPosition.height + 8,
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.5)',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Tooltip/Card */}
        <motion.div
          className={`absolute pointer-events-auto w-96 ${getTooltipPosition()}`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Card className="bg-gray-900 border border-gray-600 shadow-2xl">
            <CardContent className="p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {currentStep + 1} of {totalSteps}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {currentStepData.title}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={previousStep}
                    disabled={currentStep === 0}
                    className="text-gray-400 hover:text-white disabled:opacity-30"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <SkipForward className="h-4 w-4 mr-1" />
                      Skip
                    </Button>
                    
                    <Button
                      onClick={isLastStep ? handleComplete : nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      {isLastStep ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </>
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractiveOnboarding;

'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, ArrowLeft, Check, Sparkles, Dumbbell, Heart, Target, Zap } from 'lucide-react';
import { completeOnboardingAction } from '../onboarding.actions';
import {
  type ExperienceLevel,
  type FitnessGoal,
  type BodyLimitation,
  type Equipment,
  type FitnessProfileInput,
  experienceLevels,
  experienceLevelLabels,
  fitnessGoals,
  fitnessGoalLabels,
  bodyLimitations,
  limitationLabels,
  equipmentOptions,
  equipmentLabels,
} from '../types';

type Step = 'experience' | 'days' | 'goal' | 'equipment' | 'limitations';

const steps: Step[] = ['experience', 'days', 'goal', 'equipment', 'limitations'];

// Icons for goals without emojis
const goalIcons: Record<FitnessGoal, React.ReactNode> = {
  strength: <Dumbbell className="h-6 w-6" />,
  recomposition: <Zap className="h-6 w-6" />,
  endurance: <Heart className="h-6 w-6" />,
  flexibility: <Sparkles className="h-6 w-6" />,
  general: <Target className="h-6 w-6" />,
};

// Icons for experience levels
const experienceIcons: Record<ExperienceLevel, React.ReactNode> = {
  beginner: <Sparkles className="h-6 w-6" />,
  intermediate: <Dumbbell className="h-6 w-6" />,
  advanced: <Zap className="h-6 w-6" />,
};

interface OnboardingFlowProps {
  locale: string;
}

const SWIPE_THRESHOLD = 50;

export function OnboardingFlow({ locale }: OnboardingFlowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<Step>('experience');
  const [direction, setDirection] = useState(0);
  const [data, setData] = useState<Partial<FitnessProfileInput>>({
    experienceLevel: undefined,
    trainingDaysPerWeek: 3,
    primaryGoal: undefined,
    availableEquipment: ['bodyweight'],
    limitations: [],
  });

  const lang = locale as 'en' | 'es';
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'experience':
        return !!data.experienceLevel;
      case 'days':
        return !!data.trainingDaysPerWeek;
      case 'goal':
        return !!data.primaryGoal;
      case 'equipment':
        return data.availableEquipment && data.availableEquipment.length > 0;
      case 'limitations':
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  const handleComplete = useCallback(() => {
    startTransition(async () => {
      const result = await completeOnboardingAction({
        experienceLevel: data.experienceLevel!,
        trainingDaysPerWeek: data.trainingDaysPerWeek!,
        primaryGoal: data.primaryGoal!,
        availableEquipment: data.availableEquipment!,
        limitations: data.limitations,
      });

      if (result.success) {
        router.push(`/${locale}/dashboard`);
      }
    });
  }, [data, locale, router]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleComplete();
    } else if (canProceed()) {
      setDirection(1);
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  }, [isLastStep, currentStepIndex, canProceed, handleComplete]);

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      setDirection(-1);
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  }, [isFirstStep, currentStepIndex]);

  // Swipe handling
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD && canProceed() && !isLastStep) {
        handleNext();
      } else if (info.offset.x > SWIPE_THRESHOLD && !isFirstStep) {
        handleBack();
      }
    },
    [canProceed, isLastStep, isFirstStep, handleNext, handleBack]
  );

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const stepTitles: Record<Step, { title: string; subtitle: string }> = {
    experience: {
      title: lang === 'es' ? 'Tu experiencia' : 'Your experience',
      subtitle:
        lang === 'es'
          ? 'Adaptamos los ejercicios a tu nivel'
          : 'We adapt exercises to your level',
    },
    days: {
      title: lang === 'es' ? 'Días de entreno' : 'Training days',
      subtitle:
        lang === 'es' ? 'Tu base semanal de entrenamiento' : 'Your weekly training base',
    },
    goal: {
      title: lang === 'es' ? 'Tu objetivo' : 'Your goal',
      subtitle:
        lang === 'es'
          ? 'Personalizamos cada sesión para ti'
          : 'We personalize each session for you',
    },
    equipment: {
      title: lang === 'es' ? 'Equipamiento' : 'Equipment',
      subtitle:
        lang === 'es' ? 'Selecciona todo lo que tengas' : 'Select everything you have',
    },
    limitations: {
      title: lang === 'es' ? 'Limitaciones' : 'Limitations',
      subtitle:
        lang === 'es'
          ? 'Evitaremos ejercicios que puedan molestarte'
          : "We'll avoid exercises that may bother you",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="p-4 pt-6">
        <div className="flex gap-2 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-500',
                index <= currentStepIndex
                  ? 'bg-primary'
                  : 'bg-white/60'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full max-w-md touch-pan-y"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-primary">
                {stepTitles[currentStep].title}
              </h1>
              <p className="text-muted-foreground mt-2">{stepTitles[currentStep].subtitle}</p>
            </div>

            {/* Step content */}
            <div className="space-y-3">
              {/* Experience Step */}
              {currentStep === 'experience' && (
                <>
                  {experienceLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setData({ ...data, experienceLevel: level as ExperienceLevel })
                      }
                      className={cn(
                        'w-full p-4 rounded-2xl transition-all duration-300 text-left',
                        'backdrop-blur-md border',
                        data.experienceLevel === level
                          ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                          : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                            data.experienceLevel === level
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {experienceIcons[level]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {experienceLevelLabels[level][lang]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {experienceLevelLabels[level].description[lang]}
                          </p>
                        </div>
                        {data.experienceLevel === level && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Days Step */}
              {currentStep === 'days' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-5 gap-3">
                    {[2, 3, 4, 5, 6].map((days) => (
                      <button
                        key={days}
                        onClick={() => setData({ ...data, trainingDaysPerWeek: days })}
                        className={cn(
                          'aspect-square rounded-2xl text-2xl font-bold transition-all duration-300',
                          'backdrop-blur-md border',
                          data.trainingDaysPerWeek === days
                            ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/25 scale-110'
                            : 'bg-white/60 border-white/80 text-muted-foreground hover:bg-white/80 hover:border-primary/20'
                        )}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {data.trainingDaysPerWeek === 2 &&
                        (lang === 'es' ? '2 días = Full body' : '2 days = Full body')}
                      {data.trainingDaysPerWeek === 3 &&
                        (lang === 'es'
                          ? '3 días = Pierna / Upper / Full'
                          : '3 days = Legs / Upper / Full')}
                      {data.trainingDaysPerWeek === 4 &&
                        (lang === 'es'
                          ? '4 días = Upper / Lower alternados'
                          : '4 days = Upper / Lower alternating')}
                      {data.trainingDaysPerWeek === 5 &&
                        (lang === 'es'
                          ? '5 días = Push / Pull / Legs + Upper / Lower'
                          : '5 days = Push / Pull / Legs + Upper / Lower')}
                      {data.trainingDaysPerWeek === 6 &&
                        (lang === 'es' ? '6 días = PPL x 2' : '6 days = PPL x 2')}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/50 backdrop-blur-md border border-accent">
                    <p className="text-sm text-accent-foreground text-center">
                      {lang === 'es'
                        ? 'Siempre puedes entrenar más días si te apetece'
                        : 'You can always train more days if you feel like it'}
                    </p>
                  </div>
                </div>
              )}

              {/* Goal Step */}
              {currentStep === 'goal' && (
                <>
                  {fitnessGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setData({ ...data, primaryGoal: goal as FitnessGoal })}
                      className={cn(
                        'w-full p-4 rounded-2xl transition-all duration-300 text-left',
                        'backdrop-blur-md border',
                        data.primaryGoal === goal
                          ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
                          : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-primary/20'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                            data.primaryGoal === goal
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {goalIcons[goal]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {fitnessGoalLabels[goal][lang]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {fitnessGoalLabels[goal].description[lang]}
                          </p>
                        </div>
                        {data.primaryGoal === goal && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Equipment Step */}
              {currentStep === 'equipment' && (
                <div className="grid grid-cols-2 gap-3">
                  {equipmentOptions.map((equip) => {
                    const isSelected = data.availableEquipment?.includes(equip);
                    return (
                      <button
                        key={equip}
                        onClick={() => {
                          const current = data.availableEquipment || [];
                          const updated = isSelected
                            ? current.filter((e) => e !== equip)
                            : [...current, equip as Equipment];
                          if (!updated.includes('bodyweight')) {
                            updated.unshift('bodyweight');
                          }
                          setData({ ...data, availableEquipment: updated });
                        }}
                        className={cn(
                          'p-4 rounded-2xl transition-all duration-300 text-center',
                          'backdrop-blur-md border',
                          isSelected
                            ? 'bg-primary/10 border-primary/30 shadow-md'
                            : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-primary/20'
                        )}
                      >
                        <span
                          className={cn(
                            'text-sm font-medium transition-colors',
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          )}
                        >
                          {equipmentLabels[equip][lang]}
                        </span>
                        {isSelected && (
                          <div className="mt-2 flex justify-center">
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Limitations Step */}
              {currentStep === 'limitations' && (
                <>
                  <div className="p-4 rounded-2xl bg-secondary/50 backdrop-blur-md border border-secondary mb-4">
                    <p className="text-sm text-secondary-foreground text-center">
                      {lang === 'es'
                        ? 'Paso opcional. Si no tienes limitaciones, continúa.'
                        : 'Optional step. If you have no limitations, continue.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {bodyLimitations.map((limitation) => {
                      const isSelected = data.limitations?.includes(limitation);
                      return (
                        <button
                          key={limitation}
                          onClick={() => {
                            const current = data.limitations || [];
                            const updated = isSelected
                              ? current.filter((l) => l !== limitation)
                              : [...current, limitation as BodyLimitation];
                            setData({ ...data, limitations: updated });
                          }}
                          className={cn(
                            'p-4 rounded-2xl transition-all duration-300 text-center',
                            'backdrop-blur-md border',
                            isSelected
                              ? 'bg-primary/10 border-primary/30 shadow-md'
                              : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-primary/20'
                          )}
                        >
                          <span
                            className={cn(
                              'text-sm font-medium transition-colors',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            )}
                          >
                            {limitationLabels[limitation][lang]}
                          </span>
                          {isSelected && (
                            <div className="mt-2 flex justify-center">
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-4 pb-8">
        <div className="max-w-md mx-auto flex gap-3">
          {!isFirstStep && (
            <button
              onClick={handleBack}
              disabled={isPending}
              className="flex-1 h-14 rounded-2xl backdrop-blur-md bg-white/60 border border-white/80 text-muted-foreground font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/80 disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
              {lang === 'es' ? 'Atrás' : 'Back'}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed() || isPending}
            className={cn(
              'flex-1 h-14 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300',
              'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
              'hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]',
              'disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg',
              isFirstStep && 'w-full'
            )}
          >
            {isPending ? (
              lang === 'es' ? (
                'Guardando...'
              ) : (
                'Saving...'
              )
            ) : isLastStep ? (
              <>
                <Sparkles className="h-5 w-5" />
                {lang === 'es' ? 'Empezar' : "Let's go"}
              </>
            ) : (
              <>
                {lang === 'es' ? 'Siguiente' : 'Next'}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

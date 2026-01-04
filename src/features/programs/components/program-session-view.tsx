'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Play,
  Check,
  Pause,
  RotateCcw,
  Trophy,
  Dumbbell,
  Clock,
  Info,
  TrendingUp,
  Minus,
  Plus,
  Target,
  AlertTriangle,
  Shield,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { saveSessionResultAction } from '../programs.actions';
import type { ProgramSession, ProgramExercise, ExerciseSuggestion, WorkoutFeedback } from '../types';
import { progressionReasonMessages } from '../types';
import { WorkoutFeedbackModal } from './workout-feedback-modal';

interface ProgramSessionViewProps {
  session: ProgramSession;
  suggestions: ExerciseSuggestion[];
  energyLevel: 'high' | 'medium' | 'low';
  locale: string;
  currentWeek: number;
  totalWeeks: number;
}

interface ExerciseState {
  weight: number;
  setsCompleted: number;
  repsPerSet: number[];
}

export function ProgramSessionView({
  session,
  suggestions,
  energyLevel,
  locale,
  currentWeek,
  totalWeeks,
}: ProgramSessionViewProps) {
  const t = useTranslations('workouts.programs');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({});
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const exercises = session.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const currentSuggestion = suggestions.find(s => s.exerciseSlug === currentExercise?.exerciseSlug);

  // Initialize exercise states
  useEffect(() => {
    if (exercises.length > 0 && Object.keys(exerciseStates).length === 0) {
      const initialStates: Record<string, ExerciseState> = {};
      exercises.forEach((ex) => {
        const suggestion = suggestions.find(s => s.exerciseSlug === ex.exerciseSlug);
        initialStates[ex.exerciseSlug] = {
          weight: suggestion?.suggestedWeight || 0,
          setsCompleted: 0,
          repsPerSet: Array(ex.sets).fill(ex.minReps),
        };
      });
      setExerciseStates(initialStates);
    }
  }, [exercises, suggestions, exerciseStates]);

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  // Close instructions when exercise changes
  useEffect(() => {
    setShowInstructions(false);
  }, [currentExerciseIndex]);

  const getCurrentExerciseState = useCallback(() => {
    if (!currentExercise) return null;
    return exerciseStates[currentExercise.exerciseSlug] || {
      weight: 0,
      setsCompleted: 0,
      repsPerSet: Array(currentExercise.sets).fill(currentExercise.minReps),
    };
  }, [currentExercise, exerciseStates]);

  const updateWeight = (delta: number) => {
    if (!currentExercise) return;
    setExerciseStates(prev => ({
      ...prev,
      [currentExercise.exerciseSlug]: {
        ...prev[currentExercise.exerciseSlug],
        weight: Math.max(0, (prev[currentExercise.exerciseSlug]?.weight || 0) + delta),
      },
    }));
  };

  const setWeight = (value: number) => {
    if (!currentExercise) return;
    setExerciseStates(prev => ({
      ...prev,
      [currentExercise.exerciseSlug]: {
        ...prev[currentExercise.exerciseSlug],
        weight: Math.max(0, value),
      },
    }));
  };

  const updateReps = (setIndex: number, delta: number) => {
    if (!currentExercise) return;
    setExerciseStates(prev => {
      const current = prev[currentExercise.exerciseSlug];
      const newReps = [...(current?.repsPerSet || [])];
      newReps[setIndex] = Math.max(0, Math.min(30, (newReps[setIndex] || 0) + delta));
      return {
        ...prev,
        [currentExercise.exerciseSlug]: {
          ...current,
          repsPerSet: newReps,
        },
      };
    });
  };

  const completeSet = () => {
    if (!currentExercise) return;
    const state = getCurrentExerciseState();
    if (!state) return;

    const newSetsCompleted = state.setsCompleted + 1;

    setExerciseStates(prev => ({
      ...prev,
      [currentExercise.exerciseSlug]: {
        ...prev[currentExercise.exerciseSlug],
        setsCompleted: newSetsCompleted,
      },
    }));

    // Start rest timer if not the last set
    if (newSetsCompleted < currentExercise.sets) {
      setRestTimeLeft(currentExercise.restSeconds);
      setIsResting(true);
    } else if (currentExerciseIndex < exercises.length - 1) {
      // Move to next exercise
      setTimeout(() => {
        setCurrentExerciseIndex(prev => prev + 1);
      }, 500);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const finishWorkout = (feedback?: WorkoutFeedback) => {
    const exerciseData = exercises.map((ex) => {
      const state = exerciseStates[ex.exerciseSlug];
      return {
        exerciseSlug: ex.exerciseSlug,
        weight: state?.weight || 0,
        setsCompleted: state?.setsCompleted || 0,
        repsPerSet: state?.repsPerSet || [],
        allRepsCompleted: (state?.setsCompleted || 0) >= ex.sets,
      };
    });

    startTransition(async () => {
      const result = await saveSessionResultAction({
        sessionId: session.id,
        exercises: exerciseData,
        feedback,
      });

      if (result.success) {
        setIsCompleted(true);
        toast.success(t('sessionCompleted'));
      } else {
        toast.error(result.error || t('sessionError'));
      }
    });
  };

  // Workout completed screen
  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-6 animate-bounce">
          <Trophy className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('wellDone')}</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          {t('sessionCompletedMessage')}
        </p>
        <Button
          size="lg"
          className="rounded-full"
          onClick={() => window.location.href = `/${locale}/dashboard`}
        >
          {t('backToDashboard')}
        </Button>
      </div>
    );
  }

  if (!currentExercise || exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">{t('noExercises')}</p>
      </div>
    );
  }

  const state = getCurrentExerciseState();
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isExerciseComplete = (state?.setsCompleted || 0) >= currentExercise.sets;
  const allExercisesComplete = exercises.every(
    ex => (exerciseStates[ex.exerciseSlug]?.setsCompleted || 0) >= ex.sets
  );

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {session.name[locale as 'en' | 'es'] || session.name.es}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('week')} {currentWeek}/{totalWeeks}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${((currentExerciseIndex + (isExerciseComplete ? 1 : 0)) / exercises.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{t('exercise')} {currentExerciseIndex + 1}/{exercises.length}</span>
            <span>
              {Math.round(((currentExerciseIndex + (isExerciseComplete ? 1 : 0)) / exercises.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {isResting && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <p className="text-white/60 text-lg mb-4">{t('resting')}</p>
            <div className="text-8xl font-bold text-white mb-8 tabular-nums">
              {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setRestTimeLeft(prev => prev + 30)}
              >
                <Plus className="h-5 w-5 mr-2" />
                30s
              </Button>
              <Button
                size="lg"
                className="bg-rose-500 hover:bg-rose-600"
                onClick={skipRest}
              >
                {t('skipRest')}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Exercise */}
      <div className="p-4">
        <Card className="mb-4 border-0 shadow-lg bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
          <CardContent className="p-6">
            {/* Exercise Name */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  {currentExercise.exercise?.name[locale as 'en' | 'es'] || currentExercise.exerciseSlug}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentExercise.sets} × {currentExercise.minReps}-{currentExercise.maxReps} reps
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                <Dumbbell className="h-5 w-5 text-rose-600" />
              </div>
            </div>

            {/* Exercise Instructions - Expandable */}
            {currentExercise.exercise?.card && (
              <div className="mb-4">
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
                >
                  <Info className="h-4 w-4" />
                  {showInstructions ? (locale === 'es' ? 'Ocultar instrucciones' : 'Hide instructions') : (locale === 'es' ? '¿Cómo se hace?' : 'How to do it?')}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
                </button>

                {showInstructions && (
                  <div className="mt-3 space-y-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    {/* Position */}
                    {currentExercise.exercise.card.position && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Target className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-0.5">
                            {locale === 'es' ? 'Posición' : 'Position'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {currentExercise.exercise.card.position[locale as 'en' | 'es'] || currentExercise.exercise.card.position.es}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Movement */}
                    {currentExercise.exercise.card.movement && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Dumbbell className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-0.5">
                            {locale === 'es' ? 'Movimiento' : 'Movement'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {currentExercise.exercise.card.movement[locale as 'en' | 'es'] || currentExercise.exercise.card.movement.es}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Key Cue */}
                    {currentExercise.exercise.card.keyCue && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-0.5">
                            {locale === 'es' ? 'Clave' : 'Key Cue'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {currentExercise.exercise.card.keyCue[locale as 'en' | 'es'] || currentExercise.exercise.card.keyCue.es}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Common Mistake */}
                    {currentExercise.exercise.card.commonMistake && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-0.5">
                            {locale === 'es' ? 'Error común' : 'Common Mistake'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {currentExercise.exercise.card.commonMistake[locale as 'en' | 'es'] || currentExercise.exercise.card.commonMistake.es}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Safety Tip */}
                    {currentExercise.exercise.card.safetyTip && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-0.5">
                            {locale === 'es' ? 'Seguridad' : 'Safety'}
                          </p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {currentExercise.exercise.card.safetyTip[locale as 'en' | 'es'] || currentExercise.exercise.card.safetyTip.es}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Progression Info */}
            {currentSuggestion && currentSuggestion.progressionReason !== 'first_time' && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  {progressionReasonMessages[currentSuggestion.progressionReason]?.[locale as 'en' | 'es'] ||
                   progressionReasonMessages[currentSuggestion.progressionReason]?.es}
                </span>
              </div>
            )}

            {/* Weight Input */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">{t('weight')} (kg)</label>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => updateWeight(-0.5)}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  step="0.5"
                  value={state?.weight || 0}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-24 text-center text-2xl font-bold h-14"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => updateWeight(0.5)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {currentSuggestion?.previousWeight ? (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {t('lastTime')}: {currentSuggestion.previousWeight}kg × {currentSuggestion.previousReps} reps
                </p>
              ) : null}
            </div>

            {/* Sets Grid */}
            <div className="space-y-3">
              <label className="text-sm font-medium">{t('sets')}</label>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: currentExercise.sets }).map((_, setIndex) => {
                  const isCompleted = setIndex < (state?.setsCompleted || 0);
                  const isCurrent = setIndex === (state?.setsCompleted || 0);
                  const reps = state?.repsPerSet[setIndex] || currentExercise.minReps;

                  return (
                    <div
                      key={setIndex}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : isCurrent
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                          : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs text-muted-foreground text-center mb-1">
                        {t('set')} {setIndex + 1}
                      </div>
                      {isCompleted ? (
                        <div className="flex items-center justify-center">
                          <Check className="h-6 w-6 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                            onClick={() => updateReps(setIndex, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">{reps}</span>
                          <button
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
                            onClick={() => updateReps(setIndex, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {currentExercise.notes && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {currentExercise.notes[locale as 'en' | 'es'] || currentExercise.notes.es}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercise Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={isLastExercise}
            onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
          >
            {t('next')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          {!isExerciseComplete ? (
            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold gap-2 rounded-2xl shadow-lg"
              onClick={completeSet}
            >
              <Check className="h-5 w-5" />
              {t('completeSet')} {(state?.setsCompleted || 0) + 1}
            </Button>
          ) : isLastExercise && allExercisesComplete ? (
            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold gap-2 rounded-2xl shadow-lg bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowFeedbackModal(true)}
              disabled={isPending}
            >
              <Trophy className="h-5 w-5" />
              {isPending ? t('saving') : t('finishWorkout')}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold gap-2 rounded-2xl shadow-lg"
              onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
            >
              {t('nextExercise')}
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <WorkoutFeedbackModal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={(feedback) => {
          setShowFeedbackModal(false);
          finishWorkout(feedback);
        }}
        isPending={isPending}
        locale={locale}
      />
    </div>
  );
}

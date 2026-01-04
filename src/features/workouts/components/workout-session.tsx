'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import {
  ArrowLeft,
  Play,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  Trophy,
  Home,
  Dumbbell,
  Info,
  Timer,
  Plus,
  Minus,
  SkipForward,
  History,
  ArrowLeftRight,
} from 'lucide-react';
import { ExerciseSwapModal } from './exercise-swap-modal';
import type { GeneratedWorkout } from '../types';
import type { EnergyLevel } from '@/features/dashboard/types';
import { saveWorkoutSessionAction } from '../workouts.actions';

interface WorkoutSessionProps {
  workout: GeneratedWorkout;
  energyLevel: EnergyLevel;
  previousWeights?: Record<string, number>;
  locale?: string;
}

type SessionState = 'preview' | 'active' | 'resting' | 'completed';

interface SetLog {
  reps: number;
  weight: number;
}

interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
}

const intensityColors: Record<string, string> = {
  alta: 'from-orange-400 to-red-500',
  media: 'from-amber-400 to-yellow-500',
  baja: 'from-rose-300 to-pink-400',
  recuperación: 'from-indigo-400 to-purple-500',
};

// Parse rest time string to seconds
function parseRestTime(rest: string): number {
  if (rest === '-' || !rest) return 0;
  const match = rest.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 60;
}

// Format seconds to mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function WorkoutSession({ workout: initialWorkout, energyLevel, previousWeights = {}, locale = 'es' }: WorkoutSessionProps) {
  const [workout, setWorkout] = useState(initialWorkout);
  const [sessionState, setSessionState] = useState<SessionState>('preview');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  // Timer state
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Weight tracking
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [currentReps, setCurrentReps] = useState(10);
  const [isSaving, startSaving] = useTransition();

  // Swap state
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapExerciseIndex, setSwapExerciseIndex] = useState<number | null>(null);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const previousWeight = currentExercise ? previousWeights[currentExercise.name] : undefined;
  const progress = (completedExercises.size / workout.exercises.length) * 100;
  const totalSets = currentExercise?.sets || 1;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            // Vibrate if available
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, restTimeLeft]);

  // Save session when completed
  useEffect(() => {
    if (sessionState === 'completed' && exerciseLogs.length > 0) {
      startSaving(async () => {
        await saveWorkoutSessionAction({
          energyLevel,
          workoutName: workout.name,
          duration: workout.duration,
          exercisesCompleted: completedExercises.size,
          exercisesTotal: workout.exercises.length,
          exerciseLogs,
        });
      });
    }
  }, [sessionState, exerciseLogs, energyLevel, workout, completedExercises.size]);

  const handleStart = () => {
    setSessionState('active');
    setCurrentSetIndex(0);
    // Initialize with default reps from exercise
    const repsMatch = currentExercise?.reps.match(/(\d+)/);
    setCurrentReps(repsMatch ? parseInt(repsMatch[1], 10) : 10);
    // Initialize with previous weight if available
    const prevWeight = previousWeights[currentExercise?.name || ''];
    setCurrentWeight(prevWeight || 0);
  };

  const handleCompleteSet = () => {
    // Log this set
    const newLogs = [...exerciseLogs];
    const exerciseLogIndex = newLogs.findIndex(
      (log) => log.exerciseName === currentExercise.name
    );

    const setData: SetLog = { reps: currentReps, weight: currentWeight };

    if (exerciseLogIndex >= 0) {
      newLogs[exerciseLogIndex].sets.push(setData);
    } else {
      newLogs.push({
        exerciseName: currentExercise.name,
        sets: [setData],
      });
    }
    setExerciseLogs(newLogs);

    // Check if more sets remaining
    if (currentSetIndex < totalSets - 1) {
      // Start rest timer
      const restSeconds = parseRestTime(currentExercise.rest);
      if (restSeconds > 0) {
        setRestTimeLeft(restSeconds);
        setIsTimerRunning(true);
        setSessionState('resting');
      } else {
        setCurrentSetIndex(currentSetIndex + 1);
      }
    } else {
      // Exercise completed
      const newCompleted = new Set(completedExercises);
      newCompleted.add(currentExerciseIndex);
      setCompletedExercises(newCompleted);

      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Start rest before next exercise
        const restSeconds = parseRestTime(currentExercise.rest);
        if (restSeconds > 0) {
          setRestTimeLeft(restSeconds);
          setIsTimerRunning(true);
          setSessionState('resting');
        } else {
          moveToNextExercise();
        }
      } else {
        setSessionState('completed');
      }
    }
  };

  const moveToNextExercise = useCallback(() => {
    setCurrentExerciseIndex((prev) => prev + 1);
    setCurrentSetIndex(0);
    setSessionState('active');
    // Reset reps and weight for new exercise
    const nextExercise = workout.exercises[currentExerciseIndex + 1];
    if (nextExercise) {
      const repsMatch = nextExercise.reps.match(/(\d+)/);
      setCurrentReps(repsMatch ? parseInt(repsMatch[1], 10) : 10);
      // Set previous weight if available
      const prevWeight = previousWeights[nextExercise.name];
      setCurrentWeight(prevWeight || 0);
    }
  }, [currentExerciseIndex, workout.exercises, previousWeights]);

  const handleSkipRest = () => {
    setIsTimerRunning(false);
    setRestTimeLeft(0);

    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setSessionState('active');
    } else {
      moveToNextExercise();
    }
  };

  const handleSkipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      moveToNextExercise();
    } else {
      setSessionState('completed');
    }
  };

  const adjustWeight = (delta: number) => {
    setCurrentWeight((prev) => Math.max(0, prev + delta));
  };

  const adjustReps = (delta: number) => {
    setCurrentReps((prev) => Math.max(1, prev + delta));
  };

  // Handle exercise swap
  const handleOpenSwap = (index: number) => {
    setSwapExerciseIndex(index);
    setSwapModalOpen(true);
  };

  const handleSwapExercise = (newExercise: {
    name: string;
    instructions?: string;
    equipment?: string[];
  }) => {
    if (swapExerciseIndex === null) return;

    setWorkout((prev) => {
      const newExercises = [...prev.exercises];
      newExercises[swapExerciseIndex] = {
        ...newExercises[swapExerciseIndex],
        name: newExercise.name,
        instructions: newExercise.instructions,
        equipment: newExercise.equipment,
      };
      return { ...prev, exercises: newExercises };
    });

    setSwapExerciseIndex(null);
  };

  // Preview screen
  if (sessionState === 'preview') {
    return (
      <div className="min-h-screen pb-24">
        {/* Header */}
        <div className={cn(
          'relative -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6 px-4 md:px-6 pt-6 pb-8 rounded-b-[2rem]',
          'bg-gradient-to-br',
          intensityColors[workout.intensity]
        )}>
          <Link
            href="/es/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {workout.name}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {workout.duration} min
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {workout.exerciseCount} ejercicios
            </span>
          </div>
        </div>

        {/* Exercise list preview with expandable details */}
        <div className="space-y-3 mb-8 px-4">
          {workout.exercises.map((exercise, index) => (
            <Card key={index} className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="w-full p-4 flex items-center gap-4 text-left"
                  onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                >
                  <span className="text-2xl">{exercise.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets > 1
                        ? `${exercise.sets} series × ${exercise.reps}`
                        : exercise.reps}
                      {exercise.rest !== '-' && ` • ${exercise.rest} descanso`}
                    </p>
                  </div>
                  {exercise.instructions ? (
                    expandedExercise === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {/* Expanded details */}
                {expandedExercise === index && exercise.instructions && (
                  <div className="px-4 pb-4 pt-0 border-t bg-muted/30">
                    <div className="pt-3 space-y-3">
                      {/* Material */}
                      {exercise.equipment && exercise.equipment.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Dumbbell className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-primary">Material</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.equipment.join(', ')}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-primary mb-2">Cómo hacerlo</p>
                          <div className="text-sm text-muted-foreground space-y-2">
                            {exercise.instructions.split('\n\n').map((paragraph, pi) => {
                              const isHeader = /^(POSICIÓN|AGARRE|MOVIMIENTO|MÚSCULOS|CLAVE|ERROR COMÚN|SEGURIDAD|CONSEJO|BENEFICIO|BENEFICIOS|RITMO|TÉCNICA|SECUENCIA|VERSIONES|PROGRESIÓN|MODIFICACIÓN|FINAL):/.test(paragraph);

                              if (isHeader) {
                                const [header, ...content] = paragraph.split(':');
                                const contentText = content.join(':').trim();
                                return (
                                  <div key={pi}>
                                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-0.5">
                                      {header}
                                    </p>
                                    <p className="whitespace-pre-line">{contentText}</p>
                                  </div>
                                );
                              }
                              return (
                                <p key={pi} className="whitespace-pre-line">{paragraph}</p>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Swap button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSwap(index);
                        }}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                        Cambiar ejercicio
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <Button
            size="lg"
            className={cn(
              'w-full gap-2 rounded-full text-lg py-6 shadow-xl',
              'bg-gradient-to-r',
              intensityColors[workout.intensity]
            )}
            onClick={handleStart}
          >
            <Play className="h-6 w-6" fill="currentColor" />
            Empezar entrenamiento
          </Button>
        </div>

        {/* Swap Modal */}
        <ExerciseSwapModal
          isOpen={swapModalOpen}
          onClose={() => {
            setSwapModalOpen(false);
            setSwapExerciseIndex(null);
          }}
          exerciseName={swapExerciseIndex !== null ? workout.exercises[swapExerciseIndex]?.name || '' : ''}
          locale={locale}
          onSwap={handleSwapExercise}
        />
      </div>
    );
  }

  // Completed screen
  if (sessionState === 'completed') {
    const totalWeight = exerciseLogs.reduce(
      (sum, log) => sum + log.sets.reduce((s, set) => s + set.weight * set.reps, 0),
      0
    );

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-xl">
          <Trophy className="h-12 w-12 text-white" />
        </div>

        <h1 className="text-3xl font-bold mb-2">¡Increíble! 🎉</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-sm">
          Has completado tu entrenamiento de hoy. Tu cuerpo te lo agradece.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8 w-full max-w-sm">
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-primary">{workout.duration}</p>
              <p className="text-xs text-muted-foreground">minutos</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-primary">{completedExercises.size}</p>
              <p className="text-xs text-muted-foreground">ejercicios</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-primary">{totalWeight > 0 ? `${totalWeight}kg` : '-'}</p>
              <p className="text-xs text-muted-foreground">volumen</p>
            </CardContent>
          </Card>
        </div>

        {/* Exercise summary */}
        {exerciseLogs.length > 0 && (
          <Card className="border-0 shadow-md mb-8 w-full max-w-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-left">Resumen</h3>
              <div className="space-y-2 text-left">
                {exerciseLogs.map((log, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{log.exerciseName}</span>
                    <span className="font-medium">
                      {log.sets.map((s) => `${s.reps}${s.weight > 0 ? `×${s.weight}kg` : ''}`).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Button size="lg" className="gap-2 rounded-full" asChild>
          <Link href="/es/dashboard">
            <Home className="h-5 w-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    );
  }

  // Resting screen with real timer
  if (sessionState === 'resting') {
    const isNextSet = currentSetIndex < totalSets - 1;
    const nextExercise = isNextSet
      ? currentExercise
      : workout.exercises[currentExerciseIndex + 1];

    return (
      <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Timer section - centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Timer circle */}
          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * restTimeLeft) / parseRestTime(currentExercise.rest)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Timer className="h-5 w-5 text-indigo-500 mb-1" />
              <span className="text-3xl font-bold text-indigo-700">
                {formatTime(restTimeLeft)}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-1">
            {restTimeLeft > 0 ? 'Descansa' : '¡Tiempo!'}
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            {isNextSet
              ? `Siguiente: Serie ${currentSetIndex + 2} de ${totalSets}`
              : 'Prepara el siguiente ejercicio'}
          </p>
        </div>

        {/* Next exercise preview - bottom section */}
        {nextExercise && !isNextSet && (
          <Card className="border-0 shadow-lg mb-4 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-indigo-600 mb-2 uppercase tracking-wide">
                Siguiente ejercicio
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{nextExercise.emoji}</span>
                <div>
                  <h3 className="font-semibold">{nextExercise.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {nextExercise.sets > 1
                      ? `${nextExercise.sets} series × ${nextExercise.reps}`
                      : nextExercise.reps}
                  </p>
                </div>
              </div>

              {/* Material for next exercise */}
              {nextExercise.equipment && nextExercise.equipment.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                  <Dumbbell className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Prepara: {nextExercise.equipment.join(' + ')}
                  </span>
                </div>
              )}

              {/* Brief instructions */}
              {nextExercise.instructions && (
                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                  {nextExercise.instructions}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2 rounded-full bg-white/50"
            onClick={() => setRestTimeLeft((prev) => prev + 30)}
          >
            +30s
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            onClick={handleSkipRest}
          >
            <SkipForward className="h-5 w-5" />
            {restTimeLeft > 0 ? 'Saltar' : 'Continuar'}
          </Button>
        </div>
      </div>
    );
  }

  // Active session - exercise with weight tracking
  return (
    <div className="min-h-screen pb-40">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setSessionState('preview')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">
            {currentExerciseIndex + 1} / {workout.exercises.length}
          </span>
          <button
            onClick={handleSkipExercise}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Saltar
          </button>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full bg-gradient-to-r transition-all', intensityColors[workout.intensity])}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current exercise */}
      <div className="pt-24 px-4">
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block">{currentExercise.emoji}</span>
          <h1 className="text-2xl font-bold mb-1">{currentExercise.name}</h1>

          {/* Swap button for current exercise */}
          <button
            onClick={() => handleOpenSwap(currentExerciseIndex)}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
          >
            <ArrowLeftRight className="h-3 w-3" />
            Cambiar ejercicio
          </button>

          {/* Set indicator */}
          {totalSets > 1 && (
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    i < currentSetIndex
                      ? 'bg-green-500'
                      : i === currentSetIndex
                        ? 'bg-primary scale-125'
                        : 'bg-muted'
                  )}
                />
              ))}
            </div>
          )}

          <p className="text-lg text-muted-foreground">
            {totalSets > 1 ? `Serie ${currentSetIndex + 1} de ${totalSets}` : ''} • {currentExercise.reps}
          </p>
        </div>

        {/* Material needed */}
        {currentExercise.equipment && currentExercise.equipment.length > 0 && (
          <Card className="border-0 shadow-sm mb-4 bg-primary/5">
            <CardContent className="p-3 flex items-center gap-3">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {currentExercise.equipment.join(' + ')}
              </span>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {currentExercise.instructions && (
          <Card className="border-0 shadow-md mb-6">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-primary mb-3">💡 Cómo hacerlo</p>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
                {currentExercise.instructions.split('\n\n').map((paragraph, i) => {
                  // Check if it's a section header (POSICIÓN:, AGARRE:, etc.)
                  const isHeader = /^(POSICIÓN|AGARRE|MOVIMIENTO|MÚSCULOS|CLAVE|ERROR COMÚN|SEGURIDAD|CONSEJO|BENEFICIO|BENEFICIOS|RITMO|TÉCNICA|SECUENCIA|VERSIONES|PROGRESIÓN|MODIFICACIÓN|FINAL):/.test(paragraph);

                  if (isHeader) {
                    const [header, ...content] = paragraph.split(':');
                    const contentText = content.join(':').trim();

                    return (
                      <div key={i}>
                        <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">
                          {header}
                        </p>
                        <p className="whitespace-pre-line">{contentText}</p>
                      </div>
                    );
                  }

                  // Regular paragraph or numbered list
                  return (
                    <p key={i} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous weight hint */}
        {previousWeight && previousWeight > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-amber-600 bg-amber-50 rounded-full py-2 px-4">
            <History className="h-4 w-4" />
            <span>Última vez: <strong>{previousWeight}kg</strong></span>
          </div>
        )}

        {/* Weight & Reps tracking */}
        <Card className="border-0 shadow-md mb-4">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-center mb-4">Anota tu serie</p>

            <div className="grid grid-cols-2 gap-6">
              {/* Reps */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Repeticiones</p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => adjustReps(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={currentReps}
                    onChange={(e) => setCurrentReps(parseInt(e.target.value) || 0)}
                    className="w-16 text-center text-xl font-bold h-12"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => adjustReps(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Weight */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Peso (kg)</p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => adjustWeight(-2.5)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    step="0.5"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                    className="w-16 text-center text-xl font-bold h-12"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => adjustWeight(2.5)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest info */}
        {currentExercise.rest !== '-' && (
          <p className="text-center text-sm text-muted-foreground">
            ⏱️ Descanso después: {currentExercise.rest}
          </p>
        )}
      </div>

      {/* Complete button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          size="lg"
          className="w-full gap-2 rounded-full text-lg py-6 shadow-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
          onClick={handleCompleteSet}
        >
          <Check className="h-6 w-6" />
          {currentSetIndex < totalSets - 1
            ? `Serie ${currentSetIndex + 1} completada`
            : 'Ejercicio completado'}
        </Button>
      </div>

      {/* Swap Modal */}
      <ExerciseSwapModal
        isOpen={swapModalOpen}
        onClose={() => {
          setSwapModalOpen(false);
          setSwapExerciseIndex(null);
        }}
        exerciseName={swapExerciseIndex !== null ? workout.exercises[swapExerciseIndex]?.name || '' : ''}
        locale={locale}
        onSwap={handleSwapExercise}
      />
    </div>
  );
}

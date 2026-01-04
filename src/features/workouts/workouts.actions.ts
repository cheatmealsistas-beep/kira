'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/shared/auth';
import { saveWorkoutSession } from './workouts.command';
import { getSwapAlternatives as getSwapAlternativesQuery } from './workouts.query';
import type { Exercise } from './types';

interface ExerciseSetLog {
  reps: number;
  weight: number;
}

interface ExerciseLog {
  exerciseName: string;
  sets: ExerciseSetLog[];
}

interface SaveSessionData {
  energyLevel: 'high' | 'medium' | 'low' | 'rest';
  workoutName: string;
  duration: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  exerciseLogs: ExerciseLog[];
}

export async function saveWorkoutSessionAction(
  data: SaveSessionData
): Promise<{ success: boolean; error: string | null }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'No autenticada' };
  }

  const result = await saveWorkoutSession({
    userId: user.id,
    ...data,
  });

  if (result.success) {
    revalidatePath('/progress');
    revalidatePath('/dashboard');
  }

  return result;
}

/**
 * Get alternative exercises for swapping during workout
 */
export async function getSwapAlternativesAction(
  exerciseName: string,
  locale: string = 'es'
): Promise<{
  success: boolean;
  exercise: Exercise | null;
  alternatives: Exercise[];
}> {
  const user = await getUser();
  if (!user) {
    return { success: false, exercise: null, alternatives: [] };
  }

  const result = await getSwapAlternativesQuery(exerciseName, locale);
  return {
    success: true,
    ...result,
  };
}

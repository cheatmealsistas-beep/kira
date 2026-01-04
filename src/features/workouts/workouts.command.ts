import { createClientServer } from '@/shared/database/supabase';

interface ExerciseSetLog {
  reps: number;
  weight: number;
}

interface ExerciseLog {
  exerciseName: string;
  sets: ExerciseSetLog[];
}

interface SaveSessionInput {
  userId: string;
  energyLevel: 'high' | 'medium' | 'low' | 'rest';
  workoutName: string;
  duration: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  exerciseLogs: ExerciseLog[];
}

// Map UI energy level to DB energy level
const energyLevelToDb: Record<string, string> = {
  high: 'high',
  medium: 'normal',
  low: 'low',
  rest: 'very_low',
};

/**
 * Save a completed workout session with exercise details
 */
export async function saveWorkoutSession(input: SaveSessionInput): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClientServer();
  const now = new Date();
  const sessionDate = now.toISOString().split('T')[0];

  // Calculate totals
  const totalSets = input.exerciseLogs.reduce((sum, log) => sum + log.sets.length, 0);
  const totalReps = input.exerciseLogs.reduce(
    (sum, log) => sum + log.sets.reduce((s, set) => s + set.reps, 0),
    0
  );

  const { error } = await supabase.from('session_logs').insert({
    user_id: input.userId,
    session_date: sessionDate,
    started_at: now.toISOString(),
    ended_at: now.toISOString(),
    actual_duration: input.duration,
    energy_level: energyLevelToDb[input.energyLevel],
    exercises_completed: input.exercisesCompleted,
    exercises_total: input.exercisesTotal,
    total_sets: totalSets,
    total_reps: totalReps,
    metadata: {
      workoutName: input.workoutName,
      exerciseLogs: input.exerciseLogs,
    },
  });

  if (error) {
    console.error('Error saving workout session:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Get the last weight used for a specific exercise
 */
export async function getLastExerciseWeight(
  userId: string,
  exerciseName: string
): Promise<number | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('session_logs')
    .select('metadata')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .limit(10);

  if (error || !data) {
    return null;
  }

  // Search through recent sessions for this exercise
  for (const session of data) {
    const metadata = session.metadata as { exerciseLogs?: ExerciseLog[] } | null;
    if (metadata?.exerciseLogs) {
      const exerciseLog = metadata.exerciseLogs.find(
        (log) => log.exerciseName === exerciseName
      );
      if (exerciseLog && exerciseLog.sets.length > 0) {
        // Return the last set's weight (most recent)
        const lastSet = exerciseLog.sets[exerciseLog.sets.length - 1];
        if (lastSet.weight > 0) {
          return lastSet.weight;
        }
      }
    }
  }

  return null;
}

/**
 * Get last weights for multiple exercises
 */
export async function getLastExerciseWeights(
  userId: string,
  exerciseNames: string[]
): Promise<Record<string, number>> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('session_logs')
    .select('metadata')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .limit(20);

  if (error || !data) {
    return {};
  }

  const weights: Record<string, number> = {};
  const foundExercises = new Set<string>();

  // Search through sessions for each exercise
  for (const session of data) {
    if (foundExercises.size === exerciseNames.length) break;

    const metadata = session.metadata as { exerciseLogs?: ExerciseLog[] } | null;
    if (metadata?.exerciseLogs) {
      for (const log of metadata.exerciseLogs) {
        if (
          exerciseNames.includes(log.exerciseName) &&
          !foundExercises.has(log.exerciseName) &&
          log.sets.length > 0
        ) {
          const lastSet = log.sets[log.sets.length - 1];
          if (lastSet.weight > 0) {
            weights[log.exerciseName] = lastSet.weight;
            foundExercises.add(log.exerciseName);
          }
        }
      }
    }
  }

  return weights;
}

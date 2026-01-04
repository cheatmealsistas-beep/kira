/**
 * Kira Workouts Types
 */

import { z } from 'zod';

// ============================================================================
// EXERCISE TYPES
// ============================================================================

export type ExerciseType = 'strength' | 'warmup' | 'mobility' | 'cardio';

export type ExercisePattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'push_horizontal'
  | 'push_vertical'
  | 'pull_horizontal'
  | 'pull_vertical'
  | 'carry'
  | 'core'
  | 'shoulder'
  | 'arm_biceps'
  | 'arm_triceps'
  | 'warmup'
  | 'mobility';

export type ExerciseOrder =
  | 'warmup'
  | 'compound_first'
  | 'compound'
  | 'accessory'
  | 'finisher'
  | 'cooldown';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  slug: string;
  name_es: string;
  name_en: string;
  type: ExerciseType;
  pattern: ExercisePattern;
  muscle_groups: string[];
  primary_muscle: string;
  equipment_required: string[];
  affects_pain_zones: string[];
  difficulty: Difficulty;
  exercise_order: ExerciseOrder;
  // Card instructions
  card_position_es?: string;
  card_grip_es?: string;
  card_movement_es?: string;
  card_target_muscles_es?: string;
  card_key_cue_es?: string;
  card_common_mistake_es?: string;
  card_safety_tip_es?: string;
  // Media
  video_url?: string;
  image_url?: string;
}

// ============================================================================
// WORKOUT TYPES
// ============================================================================

export type WorkoutType = 'full_body' | 'upper' | 'lower' | 'push' | 'pull' | 'legs';
export type WorkoutStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface WorkoutExercise {
  id: string;
  exercise_slug: string;
  exercise_order: number;
  sets: number;
  reps_min?: number;
  reps_max?: number;
  reps_target?: number;
  duration_seconds?: number;
  rest_seconds: number;
  intensity_rpe?: number;
  notes?: string;
  completed: boolean;
  actual_sets?: number;
  actual_reps?: number[];
  actual_weight?: number;
  // Joined exercise data
  exercise?: Exercise;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  workout_type: WorkoutType;
  day_order: number;
  estimated_duration: number;
  scheduled_for?: string;
  status: WorkoutStatus;
  completed_at?: string;
  exercises?: WorkoutExercise[];
}

// ============================================================================
// GENERATED WORKOUT (for display)
// ============================================================================

export interface GeneratedWorkout {
  name: string;
  duration: number;
  exerciseCount: number;
  intensity: 'alta' | 'media' | 'baja' | 'recuperación';
  exercises: {
    name: string;
    sets: number;
    reps: string; // "8-12" or "30s"
    rest: string; // "60s"
    emoji: string;
    instructions?: string;
    equipment?: string[]; // Material necesario
  }[];
}

// Schema for completing an exercise
export const completeExerciseSchema = z.object({
  workoutExerciseId: z.string().uuid(),
  actualSets: z.number().min(0).max(10),
  actualReps: z.array(z.number().min(0).max(100)),
  actualWeight: z.number().min(0).max(500).optional(),
});

export type CompleteExerciseInput = z.infer<typeof completeExerciseSchema>;

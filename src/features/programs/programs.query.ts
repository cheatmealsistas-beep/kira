import { createClientServer } from '@/shared/database/supabase/server';
import type {
  TrainingProgram,
  ProgramSession,
  ProgramExercise,
  UserProgram,
  UserExerciseProgress,
  ExerciseSuggestion,
  ProgressionReason,
  ProgressionType,
  ExerciseCard,
} from './types';
import { PROGRESSION_CONFIG } from './types';

// ============================================================================
// PROGRAMAS
// ============================================================================

/**
 * Obtener todos los programas activos
 */
export async function getActivePrograms(): Promise<TrainingProgram[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('training_programs')
    .select('*')
    .eq('is_active', true)
    .order('days_per_week', { ascending: true });

  if (error || !data) return [];

  return data.map(mapProgram);
}

/**
 * Obtener programa por slug
 */
export async function getProgramBySlug(slug: string): Promise<TrainingProgram | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('training_programs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return mapProgram(data);
}

/**
 * Buscar el programa más adecuado según el perfil del usuario
 */
export async function findBestProgramForUser(
  daysPerWeek: number,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<TrainingProgram | null> {
  const supabase = await createClientServer();

  // Primero intentar match exacto de días y nivel
  let { data, error } = await supabase
    .from('training_programs')
    .select('*')
    .eq('is_active', true)
    .eq('days_per_week', daysPerWeek)
    .eq('level', experienceLevel)
    .limit(1)
    .single();

  // Si no hay match exacto, buscar por días primero (nivel menos restrictivo)
  if (error || !data) {
    const levelFallback = experienceLevel === 'advanced' ? 'intermediate' : 'beginner';

    const result = await supabase
      .from('training_programs')
      .select('*')
      .eq('is_active', true)
      .eq('days_per_week', daysPerWeek)
      .in('level', [experienceLevel, levelFallback])
      .order('level', { ascending: experienceLevel === 'beginner' })
      .limit(1)
      .single();

    data = result.data;
    error = result.error;
  }

  // Si aún no hay match, buscar el más cercano en días
  if (error || !data) {
    const result = await supabase
      .from('training_programs')
      .select('*')
      .eq('is_active', true)
      .order('days_per_week', { ascending: true });

    if (result.data && result.data.length > 0) {
      // Encontrar el programa con días más cercanos
      const programs = result.data;
      let closest = programs[0];
      let minDiff = Math.abs(closest.days_per_week - daysPerWeek);

      for (const p of programs) {
        const diff = Math.abs(p.days_per_week - daysPerWeek);
        if (diff < minDiff) {
          minDiff = diff;
          closest = p;
        }
      }

      data = closest;
    }
  }

  if (!data) return null;

  return mapProgram(data);
}

/**
 * Obtener programa completo con sesiones y ejercicios
 */
export async function getProgramWithSessions(programId: string): Promise<{
  program: TrainingProgram;
  sessions: ProgramSession[];
} | null> {
  const supabase = await createClientServer();

  // Obtener programa
  const { data: programData, error: programError } = await supabase
    .from('training_programs')
    .select('*')
    .eq('id', programId)
    .single();

  if (programError || !programData) return null;

  // Obtener sesiones con ejercicios
  const { data: sessionsData, error: sessionsError } = await supabase
    .from('program_sessions')
    .select(`
      *,
      program_exercises (
        *,
        exercises:exercise_slug (
          slug,
          name_en,
          name_es,
          primary_muscle,
          equipment_required,
          card_position_en,
          card_position_es,
          card_grip_en,
          card_grip_es,
          card_movement_en,
          card_movement_es,
          card_target_muscles_en,
          card_target_muscles_es,
          card_key_cue_en,
          card_key_cue_es,
          card_common_mistake_en,
          card_common_mistake_es,
          card_safety_tip_en,
          card_safety_tip_es
        )
      )
    `)
    .eq('program_id', programId)
    .order('session_order', { ascending: true });

  if (sessionsError) return null;

  const program = mapProgram(programData);
  const sessions = (sessionsData || []).map((s) => ({
    ...mapSession(s),
    exercises: (s.program_exercises || [])
      .sort((a: { exercise_order: number }, b: { exercise_order: number }) => a.exercise_order - b.exercise_order)
      .map((e: Record<string, unknown>) => mapProgramExercise(e)),
  }));

  return { program, sessions };
}

// ============================================================================
// PROGRAMA DEL USUARIO
// ============================================================================

/**
 * Obtener programa activo del usuario
 */
export async function getUserActiveProgram(userId: string): Promise<UserProgram | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('user_programs')
    .select(`
      *,
      training_programs (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    programId: data.program_id,
    startedAt: data.started_at,
    currentWeek: data.current_week,
    isActive: data.is_active,
    completedAt: data.completed_at,
    program: data.training_programs ? mapProgram(data.training_programs) : undefined,
  };
}

/**
 * Obtener la sesión que toca hoy según el programa
 */
export async function getTodaySession(
  userId: string,
  dayOfWeek: number  // 0-6, donde 0 = domingo
): Promise<ProgramSession | null> {
  const userProgram = await getUserActiveProgram(userId);
  if (!userProgram) return null;

  const programData = await getProgramWithSessions(userProgram.programId);
  if (!programData) return null;

  const { sessions } = programData;

  // Mapear día de la semana a sesión
  // Asumiendo distribución: L-X-V para 3 días, L-M-J-V para 4 días, etc.
  const dayMappings: Record<number, Record<number, number>> = {
    3: { 1: 0, 3: 1, 5: 2 },  // Lunes=0, Miércoles=1, Viernes=2
    4: { 1: 0, 2: 1, 4: 2, 5: 3 },  // L-M-J-V
    5: { 1: 0, 2: 1, 3: 2, 5: 3, 6: 4 },  // L-M-X-V-S
    6: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 },  // L-S
  };

  const daysPerWeek = programData.program.daysPerWeek;
  const mapping = dayMappings[daysPerWeek] || dayMappings[3];
  const sessionIndex = mapping[dayOfWeek];

  if (sessionIndex === undefined) return null;  // Día de descanso

  return sessions[sessionIndex] || null;
}

// ============================================================================
// PROGRESO Y SUGERENCIAS
// ============================================================================

/**
 * Obtener progreso del usuario en un ejercicio
 */
export async function getExerciseProgress(
  userId: string,
  exerciseSlug: string
): Promise<UserExerciseProgress | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('user_exercise_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_slug', exerciseSlug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    exerciseSlug: data.exercise_slug,
    currentWeight: parseFloat(data.current_weight) || 0,
    lastRepsCompleted: data.last_reps_completed,
    lastSessionDate: data.last_session_date,
    consecutiveSuccesses: data.consecutive_successes || 0,
    recentHistory: data.recent_history || [],
  };
}

/**
 * Calcular sugerencia de peso/reps para un ejercicio
 */
export async function getExerciseSuggestion(
  userId: string,
  exerciseSlug: string,
  programExercise: ProgramExercise,
  energyLevel: 'high' | 'medium' | 'low' = 'medium'
): Promise<ExerciseSuggestion> {
  const progress = await getExerciseProgress(userId, exerciseSlug);

  // Si es primera vez
  if (!progress || progress.currentWeight === 0) {
    return {
      exerciseSlug,
      suggestedWeight: 0,  // Usuario elige peso inicial
      suggestedReps: programExercise.minReps,
      previousWeight: 0,
      previousReps: 0,
      progressionReason: 'first_time',
    };
  }

  const { currentWeight, lastRepsCompleted, consecutiveSuccesses } = progress;
  const { minReps, maxReps, progressionType } = programExercise;

  // Determinar tipo de progresión
  const effectiveProgression = progressionType || 'double';

  // Calcular sugerencia según tipo
  let suggestedWeight = currentWeight;
  let suggestedReps = lastRepsCompleted || minReps;
  let reason: ProgressionReason = 'maintain';

  // Ajuste por energía baja
  if (energyLevel === 'low') {
    suggestedWeight = Math.round(currentWeight * (1 - PROGRESSION_CONFIG.lowEnergyReduction) * 2) / 2;
    suggestedReps = minReps;
    reason = 'decrease_weight';
  } else if (effectiveProgression === 'double') {
    // Doble progresión
    reason = calculateDoubleProgression(
      consecutiveSuccesses,
      lastRepsCompleted || minReps,
      minReps,
      maxReps,
      programExercise
    );

    if (reason === 'increase_weight') {
      const increment = getWeightIncrement(programExercise.exercise?.muscleGroup || 'upper');
      suggestedWeight = currentWeight + increment;
      suggestedReps = minReps;  // Volver a reps mínimas con nuevo peso
    } else if (reason === 'increase_reps') {
      suggestedReps = Math.min((lastRepsCompleted || minReps) + 1, maxReps);
    }
  } else if (effectiveProgression === 'pyramid') {
    reason = 'pyramid';
    // Para piramidal, el peso varía por serie (se maneja en UI)
  }

  return {
    exerciseSlug,
    suggestedWeight,
    suggestedReps,
    previousWeight: currentWeight,
    previousReps: lastRepsCompleted || 0,
    progressionReason: reason,
  };
}

/**
 * Obtener sugerencias para todos los ejercicios de una sesión
 */
export async function getSessionSuggestions(
  userId: string,
  session: ProgramSession,
  energyLevel: 'high' | 'medium' | 'low' = 'medium'
): Promise<ExerciseSuggestion[]> {
  if (!session.exercises) return [];

  const suggestions = await Promise.all(
    session.exercises.map((ex) =>
      getExerciseSuggestion(userId, ex.exerciseSlug, ex, energyLevel)
    )
  );

  return suggestions;
}

// ============================================================================
// HELPERS INTERNOS
// ============================================================================

function calculateDoubleProgression(
  consecutiveSuccesses: number,
  lastReps: number,
  minReps: number,
  maxReps: number,
  exercise: ProgramExercise
): ProgressionReason {
  const muscleGroup = exercise.exercise?.muscleGroup || 'upper';
  const isCompound = ['legs', 'full_body'].includes(muscleGroup);
  const successesNeeded = isCompound
    ? PROGRESSION_CONFIG.successesBeforeIncrease.compound
    : PROGRESSION_CONFIG.successesBeforeIncrease.isolation;

  // Si completó max_reps suficientes veces → subir peso
  if (lastReps >= maxReps && consecutiveSuccesses >= successesNeeded) {
    return 'increase_weight';
  }

  // Si está en el rango pero no ha llegado a max → aumentar reps
  if (lastReps >= minReps && lastReps < maxReps) {
    return 'increase_reps';
  }

  // Mantener
  return 'maintain';
}

function getWeightIncrement(muscleGroup: string): number {
  if (muscleGroup === 'legs' || muscleGroup === 'glutes') {
    return PROGRESSION_CONFIG.weightIncrement.legs;
  }
  if (['arms', 'shoulders'].includes(muscleGroup)) {
    return PROGRESSION_CONFIG.weightIncrement.isolation;
  }
  return PROGRESSION_CONFIG.weightIncrement.upper;
}

// ============================================================================
// HISTORIAL DE ENTRENAMIENTOS
// ============================================================================

export interface WorkoutHistoryEntry {
  id: string;
  sessionId: string;
  completedAt: string;
  feeling: string;
  difficultyRating: number;
  notes?: string;
  exerciseCount: number;
  sessionName?: { en: string; es: string };
}

/**
 * Obtener historial de entrenamientos del usuario
 */
export async function getWorkoutHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ entries: WorkoutHistoryEntry[]; total: number }> {
  const supabase = await createClientServer();

  // Obtener total
  const { count } = await supabase
    .from('workout_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Obtener historial con join a sesiones
  const { data, error } = await supabase
    .from('workout_feedback')
    .select(`
      id,
      session_id,
      created_at,
      feeling,
      difficulty_rating,
      notes,
      program_sessions (
        name
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error || !data) {
    return { entries: [], total: 0 };
  }

  // Contar ejercicios por sesión
  const sessionIds = data.map(d => d.session_id).filter(Boolean);
  let exerciseCounts: Record<string, number> = {};

  if (sessionIds.length > 0) {
    const { data: exercises } = await supabase
      .from('program_exercises')
      .select('session_id')
      .in('session_id', sessionIds);

    if (exercises) {
      exerciseCounts = exercises.reduce((acc, ex) => {
        acc[ex.session_id] = (acc[ex.session_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }
  }

  const entries: WorkoutHistoryEntry[] = data.map((d) => {
    // program_sessions puede ser un array o un objeto dependiendo de la relación
    const sessionData = Array.isArray(d.program_sessions)
      ? d.program_sessions[0]
      : d.program_sessions;

    return {
      id: d.id,
      sessionId: d.session_id,
      completedAt: d.created_at,
      feeling: d.feeling,
      difficultyRating: d.difficulty_rating,
      notes: d.notes,
      exerciseCount: exerciseCounts[d.session_id] || 0,
      sessionName: sessionData?.name as { en: string; es: string } | undefined,
    };
  });

  return { entries, total: count || 0 };
}

/**
 * Obtener estadísticas de entrenamientos del usuario
 */
export async function getWorkoutStats(userId: string): Promise<{
  totalWorkouts: number;
  thisWeek: number;
  thisMonth: number;
  currentStreak: number;
  longestStreak: number;
  avgDifficulty: number;
}> {
  const supabase = await createClientServer();

  // Total workouts
  const { count: totalWorkouts } = await supabase
    .from('workout_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Esta semana
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const { count: thisWeek } = await supabase
    .from('workout_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfWeek.toISOString());

  // Este mes
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: thisMonth } = await supabase
    .from('workout_feedback')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());

  // Dificultad promedio
  const { data: feedbacks } = await supabase
    .from('workout_feedback')
    .select('difficulty_rating, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const avgDifficulty = feedbacks && feedbacks.length > 0
    ? feedbacks.reduce((sum, f) => sum + (f.difficulty_rating || 3), 0) / feedbacks.length
    : 0;

  // Calcular racha actual y más larga
  let currentStreak = 0;
  let longestStreak = 0;

  if (feedbacks && feedbacks.length > 0) {
    const dates = feedbacks.map(f =>
      new Date(f.created_at).toISOString().split('T')[0]
    );
    const uniqueDates = [...new Set(dates)].sort().reverse();

    // Racha actual
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 2) { // Permite 1 día de descanso
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Racha más larga
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 2) {
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        streak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  return {
    totalWorkouts: totalWorkouts || 0,
    thisWeek: thisWeek || 0,
    thisMonth: thisMonth || 0,
    currentStreak,
    longestStreak,
    avgDifficulty: Math.round(avgDifficulty * 10) / 10,
  };
}

// ============================================================================
// MAPPERS
// ============================================================================

function mapProgram(data: Record<string, unknown>): TrainingProgram {
  return {
    id: data.id as string,
    slug: data.slug as string,
    name: data.name as { en: string; es: string },
    description: data.description as { en: string; es: string } | undefined,
    daysPerWeek: data.days_per_week as number,
    durationWeeks: data.duration_weeks as number,
    level: data.level as TrainingProgram['level'],
    goal: data.goal as TrainingProgram['goal'],
    progressionType: data.progression_type as ProgressionType,
    isActive: data.is_active as boolean,
  };
}

function mapSession(data: Record<string, unknown>): ProgramSession {
  return {
    id: data.id as string,
    programId: data.program_id as string,
    sessionOrder: data.session_order as number,
    name: data.name as { en: string; es: string },
    sessionType: data.session_type as ProgramSession['sessionType'],
    estimatedDuration: data.estimated_duration as number,
  };
}

function mapProgramExercise(data: Record<string, unknown>): ProgramExercise {
  const exercises = data.exercises as Record<string, unknown> | null;

  // Construir objeto card con las instrucciones del ejercicio
  const buildCard = (ex: Record<string, unknown>): ExerciseCard | undefined => {
    const card: ExerciseCard = {};

    if (ex.card_position_en || ex.card_position_es) {
      card.position = { en: (ex.card_position_en as string) || '', es: (ex.card_position_es as string) || '' };
    }
    if (ex.card_grip_en || ex.card_grip_es) {
      card.grip = { en: (ex.card_grip_en as string) || '', es: (ex.card_grip_es as string) || '' };
    }
    if (ex.card_movement_en || ex.card_movement_es) {
      card.movement = { en: (ex.card_movement_en as string) || '', es: (ex.card_movement_es as string) || '' };
    }
    if (ex.card_target_muscles_en || ex.card_target_muscles_es) {
      card.targetMuscles = { en: (ex.card_target_muscles_en as string) || '', es: (ex.card_target_muscles_es as string) || '' };
    }
    if (ex.card_key_cue_en || ex.card_key_cue_es) {
      card.keyCue = { en: (ex.card_key_cue_en as string) || '', es: (ex.card_key_cue_es as string) || '' };
    }
    if (ex.card_common_mistake_en || ex.card_common_mistake_es) {
      card.commonMistake = { en: (ex.card_common_mistake_en as string) || '', es: (ex.card_common_mistake_es as string) || '' };
    }
    if (ex.card_safety_tip_en || ex.card_safety_tip_es) {
      card.safetyTip = { en: (ex.card_safety_tip_en as string) || '', es: (ex.card_safety_tip_es as string) || '' };
    }

    return Object.keys(card).length > 0 ? card : undefined;
  };

  return {
    id: data.id as string,
    sessionId: data.session_id as string,
    exerciseSlug: data.exercise_slug as string,
    exerciseOrder: data.exercise_order as number,
    sets: data.sets as number,
    minReps: data.min_reps as number,
    maxReps: data.max_reps as number,
    restSeconds: data.rest_seconds as number,
    progressionType: data.progression_type as ProgressionType | undefined,
    pyramidConfig: data.pyramid_config as ProgramExercise['pyramidConfig'],
    notes: data.notes as { en: string; es: string } | undefined,
    exercise: exercises
      ? {
          slug: exercises.slug as string,
          name: {
            en: exercises.name_en as string,
            es: exercises.name_es as string,
          },
          muscleGroup: exercises.primary_muscle as string,
          equipment: exercises.equipment_required as string[],
          card: buildCard(exercises),
        }
      : undefined,
  };
}

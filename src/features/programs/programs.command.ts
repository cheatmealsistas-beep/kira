import { createClientServer } from '@/shared/database/supabase/server';
import type { WorkoutFeedback, SessionResult } from './types';

// ============================================================================
// INSCRIPCIÓN A PROGRAMA
// ============================================================================

/**
 * Inscribir usuario a un programa
 */
export async function enrollUserToProgram(
  userId: string,
  programId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClientServer();

  // Desactivar programa anterior si existe
  await supabase
    .from('user_programs')
    .update({ is_active: false, completed_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('is_active', true);

  // Inscribir al nuevo programa
  const { error } = await supabase.from('user_programs').insert({
    user_id: userId,
    program_id: programId,
    started_at: new Date().toISOString(),
    current_week: 1,
    is_active: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ============================================================================
// GUARDAR RESULTADO DE SESIÓN
// ============================================================================

/**
 * Guardar resultado completo de una sesión de entrenamiento
 * Incluye feedback del usuario para ajuste de progresión
 */
export async function saveSessionResult(
  userId: string,
  sessionResult: SessionResult
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClientServer();

  // Guardar cada ejercicio
  for (const exercise of sessionResult.exercises) {
    // 1. Guardar en exercise_logs
    const { error: logError } = await supabase.from('exercise_logs').insert({
      user_id: userId,
      exercise_slug: exercise.exerciseSlug,
      sets: exercise.setsCompleted,
      reps: exercise.repsPerSet[0] || 0, // Primera serie como referencia
      weight: exercise.weight,
      reps_per_set: exercise.repsPerSet,
      all_reps_completed: exercise.allRepsCompleted,
      difficulty_rating: sessionResult.feedback?.difficultyRating,
      energy_level: sessionResult.feedback?.energyLevel,
      logged_at: new Date().toISOString(),
    });

    if (logError) {
      console.error('Error saving exercise log:', logError);
      continue;
    }

    // 2. Actualizar progreso del ejercicio
    await updateExerciseProgress(userId, exercise);
  }

  // 3. Guardar feedback general de la sesión si existe
  if (sessionResult.feedback) {
    await saveWorkoutFeedback(userId, sessionResult.sessionId, sessionResult.feedback);
  }

  return { success: true };
}

/**
 * Actualizar progreso de un ejercicio individual
 * Gestiona consecutiveSuccesses para doble progresión
 */
async function updateExerciseProgress(
  userId: string,
  exercise: SessionResult['exercises'][0]
): Promise<void> {
  const supabase = await createClientServer();

  // Obtener progreso actual
  const { data: currentProgress } = await supabase
    .from('user_exercise_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_slug', exercise.exerciseSlug)
    .single();

  const now = new Date().toISOString().split('T')[0];

  // Calcular nuevo consecutiveSuccesses
  let newConsecutiveSuccesses = 0;
  if (exercise.allRepsCompleted) {
    newConsecutiveSuccesses = (currentProgress?.consecutive_successes || 0) + 1;
  }
  // Si no completó todas las reps, se resetea a 0

  // Preparar historial reciente (últimas 4 sesiones)
  const recentHistory = currentProgress?.recent_history || [];
  const newHistoryEntry = {
    date: now,
    weight: exercise.weight,
    reps: exercise.repsPerSet,
    completed: exercise.allRepsCompleted,
  };

  // Mantener solo últimas 4 sesiones
  const updatedHistory = [newHistoryEntry, ...recentHistory].slice(0, 4);

  if (currentProgress) {
    // Actualizar existente
    await supabase
      .from('user_exercise_progress')
      .update({
        current_weight: exercise.weight,
        last_reps_completed: exercise.repsPerSet[exercise.repsPerSet.length - 1] || 0,
        last_session_date: now,
        consecutive_successes: newConsecutiveSuccesses,
        recent_history: updatedHistory,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentProgress.id);
  } else {
    // Crear nuevo registro de progreso
    await supabase.from('user_exercise_progress').insert({
      user_id: userId,
      exercise_slug: exercise.exerciseSlug,
      current_weight: exercise.weight,
      last_reps_completed: exercise.repsPerSet[exercise.repsPerSet.length - 1] || 0,
      last_session_date: now,
      consecutive_successes: newConsecutiveSuccesses,
      recent_history: updatedHistory,
    });
  }
}

/**
 * Guardar feedback post-entrenamiento
 * Usado para ajustar futuras sugerencias
 */
async function saveWorkoutFeedback(
  userId: string,
  sessionId: string,
  feedback: WorkoutFeedback
): Promise<void> {
  const supabase = await createClientServer();

  // Guardar en tabla de feedback (si existe) o en logs
  // Por ahora lo guardamos como metadata en un log especial
  await supabase.from('workout_feedback').insert({
    user_id: userId,
    session_id: sessionId,
    feeling: feedback.feeling,
    difficulty_rating: feedback.difficultyRating,
    energy_level: feedback.energyLevel,
    notes: feedback.notes,
    created_at: new Date().toISOString(),
  });
}

// ============================================================================
// AJUSTAR PROGRESIÓN BASADO EN FEEDBACK
// ============================================================================

/**
 * Obtener factor de ajuste basado en feedback reciente
 * Retorna un multiplicador para las sugerencias
 */
export async function getProgressionAdjustmentFactor(
  userId: string
): Promise<number> {
  const supabase = await createClientServer();

  // Obtener últimos 3 feedbacks
  const { data: recentFeedback } = await supabase
    .from('workout_feedback')
    .select('feeling, difficulty_rating')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!recentFeedback || recentFeedback.length === 0) {
    return 1; // Sin ajuste
  }

  // Calcular promedio de dificultad
  const avgDifficulty =
    recentFeedback.reduce((sum, f) => sum + (f.difficulty_rating || 3), 0) /
    recentFeedback.length;

  // Contar sensaciones
  const feelings = recentFeedback.map((f) => f.feeling);
  const exhaustedCount = feelings.filter((f) => f === 'exhausted').length;
  const strongCount = feelings.filter((f) => f === 'strong').length;

  // Ajustar factor
  let factor = 1;

  // Si consistentemente muy difícil o exhausto → reducir
  if (avgDifficulty >= 4.5 || exhaustedCount >= 2) {
    factor = 0.95; // Reducir 5%
  }
  // Si consistentemente fácil y se siente fuerte → aumentar
  else if (avgDifficulty <= 2 && strongCount >= 2) {
    factor = 1.05; // Aumentar 5%
  }

  return factor;
}

// ============================================================================
// AVANZAR SEMANA DE PROGRAMA
// ============================================================================

/**
 * Avanzar a la siguiente semana del programa
 */
export async function advanceProgramWeek(
  userId: string
): Promise<{ success: boolean; completed?: boolean; error?: string }> {
  const supabase = await createClientServer();

  // Obtener programa activo
  const { data: userProgram, error: fetchError } = await supabase
    .from('user_programs')
    .select(`
      *,
      training_programs (duration_weeks)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (fetchError || !userProgram) {
    return { success: false, error: 'No active program found' };
  }

  const maxWeeks = userProgram.training_programs?.duration_weeks || 8;
  const newWeek = userProgram.current_week + 1;

  if (newWeek > maxWeeks) {
    // Programa completado
    await supabase
      .from('user_programs')
      .update({
        is_active: false,
        completed_at: new Date().toISOString(),
      })
      .eq('id', userProgram.id);

    return { success: true, completed: true };
  }

  // Avanzar semana
  const { error: updateError } = await supabase
    .from('user_programs')
    .update({ current_week: newWeek })
    .eq('id', userProgram.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true, completed: false };
}

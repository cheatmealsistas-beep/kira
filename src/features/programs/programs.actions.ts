'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/shared/auth';
import {
  enrollUserToProgram,
  saveSessionResult,
  advanceProgramWeek,
} from './programs.command';
import { getProgramWithSessions, getSessionSuggestions } from './programs.query';
import { workoutFeedbackSchema, type SessionResult, type WorkoutFeedback, type ExerciseSuggestion } from './types';

// ============================================================================
// INSCRIBIRSE A PROGRAMA
// ============================================================================

export async function enrollToProgramAction(
  programId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const result = await enrollUserToProgram(user.id, programId);

  if (result.success) {
    revalidatePath('/workouts');
    revalidatePath('/dashboard');
  }

  return result;
}

// ============================================================================
// GUARDAR RESULTADO DE SESIÓN
// ============================================================================

interface SaveSessionActionInput {
  sessionId: string;
  exercises: {
    exerciseSlug: string;
    weight: number;
    setsCompleted: number;
    repsPerSet: number[];
    allRepsCompleted: boolean;
  }[];
  feedback?: WorkoutFeedback;
}

export async function saveSessionResultAction(
  input: SaveSessionActionInput
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Validar feedback si existe
  if (input.feedback) {
    const feedbackValidation = workoutFeedbackSchema.safeParse(input.feedback);
    if (!feedbackValidation.success) {
      return {
        success: false,
        error: feedbackValidation.error.issues[0].message,
      };
    }
  }

  const sessionResult: SessionResult = {
    ...input,
    completedAt: new Date().toISOString(),
  };

  const result = await saveSessionResult(user.id, sessionResult);

  if (result.success) {
    revalidatePath('/workouts');
    revalidatePath('/progress');
    revalidatePath('/dashboard');
  }

  return result;
}

// ============================================================================
// AVANZAR SEMANA DEL PROGRAMA
// ============================================================================

export async function advanceWeekAction(): Promise<{
  success: boolean;
  completed?: boolean;
  error?: string;
}> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const result = await advanceProgramWeek(user.id);

  if (result.success) {
    revalidatePath('/workouts');
    revalidatePath('/dashboard');
  }

  return result;
}

// ============================================================================
// GUARDAR SOLO FEEDBACK (para form de feedback post-entrenamiento)
// ============================================================================

export async function saveFeedbackAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const feeling = formData.get('feeling') as string;
  const difficultyRating = parseInt(formData.get('difficultyRating') as string, 10);
  const energyLevel = formData.get('energyLevel') as 'high' | 'medium' | 'low' | undefined;
  const notes = formData.get('notes') as string | undefined;
  const sessionId = formData.get('sessionId') as string;

  const feedback: WorkoutFeedback = {
    feeling: feeling as WorkoutFeedback['feeling'],
    difficultyRating,
    energyLevel: energyLevel || undefined,
    notes: notes || undefined,
  };

  const validation = workoutFeedbackSchema.safeParse(feedback);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  // Guardar como sesión vacía con solo feedback (caso especial)
  const sessionResult: SessionResult = {
    sessionId,
    exercises: [], // Sin ejercicios, solo feedback
    feedback,
    completedAt: new Date().toISOString(),
  };

  const result = await saveSessionResult(user.id, sessionResult);

  if (result.success) {
    revalidatePath('/workouts');
  }

  return result;
}

// ============================================================================
// OBTENER SUGERENCIAS PARA UNA SESIÓN (usado desde cliente)
// ============================================================================

export async function getSessionSuggestionsAction(
  programId: string,
  sessionId: string,
  energyLevel: 'high' | 'medium' | 'low' = 'medium'
): Promise<ExerciseSuggestion[]> {
  const user = await getUser();
  if (!user) {
    return [];
  }

  // Obtener la sesión completa con ejercicios
  const programData = await getProgramWithSessions(programId);
  if (!programData) {
    return [];
  }

  const session = programData.sessions.find(s => s.id === sessionId);
  if (!session) {
    return [];
  }

  return getSessionSuggestions(user.id, session, energyLevel);
}

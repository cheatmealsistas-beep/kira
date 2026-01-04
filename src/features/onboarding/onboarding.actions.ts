'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/shared/auth';
import { fitnessProfileSchema, type FitnessProfileInput } from './types';
import { saveFitnessProfile, updateFitnessProfile, updateTrainingDays } from './onboarding.command';

interface ActionResult {
  success: boolean;
  error: string | null;
}

/**
 * Complete onboarding and save fitness profile
 */
export async function completeOnboardingAction(input: FitnessProfileInput): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'No autenticado' };
  }

  // Validate input
  const validation = fitnessProfileSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const result = await saveFitnessProfile(user.id, validation.data);

  if (result.success) {
    revalidatePath('/[locale]/dashboard', 'page');
    revalidatePath('/[locale]/workouts', 'page');
  }

  return result;
}

/**
 * Update training days configuration
 */
export async function updateTrainingDaysAction(
  daysPerWeek: number,
  preferredDays?: number[]
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'No autenticado' };
  }

  if (daysPerWeek < 2 || daysPerWeek > 6) {
    return { success: false, error: 'Los días deben estar entre 2 y 6' };
  }

  const result = await updateTrainingDays(user.id, daysPerWeek, preferredDays);

  if (result.success) {
    revalidatePath('/[locale]/dashboard', 'page');
    revalidatePath('/[locale]/workouts', 'page');
  }

  return result;
}

/**
 * Update fitness profile (partial)
 */
export async function updateFitnessProfileAction(
  updates: Partial<FitnessProfileInput>
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'No autenticado' };
  }

  const result = await updateFitnessProfile(user.id, updates);

  if (result.success) {
    revalidatePath('/[locale]/dashboard', 'page');
    revalidatePath('/[locale]/workouts', 'page');
    revalidatePath('/[locale]/settings', 'page');
  }

  return result;
}

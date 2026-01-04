import { createClientServer } from '@/shared/database/supabase/server';
import type { FitnessProfileInput, TrainingDayType } from './types';
import { generateTrainingSchedule } from './onboarding.query';
import { trainingDayLabels } from './types';
import { findBestProgramForUser } from '@/features/programs/programs.query';
import { enrollUserToProgram } from '@/features/programs/programs.command';

/**
 * Create or update fitness profile
 */
export async function saveFitnessProfile(
  userId: string,
  input: FitnessProfileInput
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase.from('fitness_profiles').upsert(
    {
      user_id: userId,
      training_days_per_week: input.trainingDaysPerWeek,
      preferred_days: input.preferredDays || [],
      primary_goal: input.primaryGoal,
      limitations: input.limitations || [],
      available_equipment: input.availableEquipment,
      experience_level: input.experienceLevel,
      preferred_duration: input.preferredDuration || 30,
      track_menstrual_cycle: input.trackMenstrualCycle || false,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  // Generate weekly plan after saving profile
  await generateWeeklyPlan(userId, input.trainingDaysPerWeek, input.preferredDays);

  // Auto-enroll user in the best matching program
  await autoEnrollToProgram(userId, input.trainingDaysPerWeek, input.experienceLevel);

  return { success: true, error: null };
}

/**
 * Automatically enroll user to the best matching program
 */
async function autoEnrollToProgram(
  userId: string,
  daysPerWeek: number,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
): Promise<void> {
  try {
    const program = await findBestProgramForUser(daysPerWeek, experienceLevel);

    if (program) {
      await enrollUserToProgram(userId, program.id);
    }
  } catch (error) {
    // Log but don't fail the onboarding if program enrollment fails
    console.error('Error auto-enrolling to program:', error);
  }
}

/**
 * Update just the training days
 */
export async function updateTrainingDays(
  userId: string,
  daysPerWeek: number,
  preferredDays?: number[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const { error } = await supabase
    .from('fitness_profiles')
    .update({
      training_days_per_week: daysPerWeek,
      preferred_days: preferredDays || [],
    })
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Regenerate weekly plan
  await generateWeeklyPlan(userId, daysPerWeek, preferredDays);

  return { success: true, error: null };
}

/**
 * Generate weekly training plan
 */
export async function generateWeeklyPlan(
  userId: string,
  daysPerWeek: number,
  preferredDays?: number[]
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  // Get Monday of current week
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekStart = monday.toISOString().split('T')[0];

  // Generate schedule
  const schedule = generateTrainingSchedule(daysPerWeek, preferredDays);

  // Convert to plan days with names
  const toPlanDay = (type: TrainingDayType | null) => {
    if (!type) return null;
    const label = trainingDayLabels[type];
    return {
      type,
      name: label.es,
    };
  };

  const { error } = await supabase.from('weekly_training_plans').upsert(
    {
      user_id: userId,
      week_start: weekStart,
      monday: toPlanDay(schedule.monday),
      tuesday: toPlanDay(schedule.tuesday),
      wednesday: toPlanDay(schedule.wednesday),
      thursday: toPlanDay(schedule.thursday),
      friday: toPlanDay(schedule.friday),
      saturday: toPlanDay(schedule.saturday),
      sunday: toPlanDay(schedule.sunday),
    },
    {
      onConflict: 'user_id,week_start',
    }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Update fitness profile (partial update)
 */
export async function updateFitnessProfile(
  userId: string,
  updates: Partial<FitnessProfileInput>
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();

  const dbUpdates: Record<string, unknown> = {};

  if (updates.trainingDaysPerWeek !== undefined) {
    dbUpdates.training_days_per_week = updates.trainingDaysPerWeek;
  }
  if (updates.preferredDays !== undefined) {
    dbUpdates.preferred_days = updates.preferredDays;
  }
  if (updates.primaryGoal !== undefined) {
    dbUpdates.primary_goal = updates.primaryGoal;
  }
  if (updates.limitations !== undefined) {
    dbUpdates.limitations = updates.limitations;
  }
  if (updates.availableEquipment !== undefined) {
    dbUpdates.available_equipment = updates.availableEquipment;
  }
  if (updates.experienceLevel !== undefined) {
    dbUpdates.experience_level = updates.experienceLevel;
  }
  if (updates.preferredDuration !== undefined) {
    dbUpdates.preferred_duration = updates.preferredDuration;
  }
  if (updates.trackMenstrualCycle !== undefined) {
    dbUpdates.track_menstrual_cycle = updates.trackMenstrualCycle;
  }

  const { error } = await supabase
    .from('fitness_profiles')
    .update(dbUpdates)
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Regenerate plan if days changed
  if (updates.trainingDaysPerWeek !== undefined || updates.preferredDays !== undefined) {
    const { data: profile } = await supabase
      .from('fitness_profiles')
      .select('training_days_per_week, preferred_days')
      .eq('user_id', userId)
      .single();

    if (profile) {
      await generateWeeklyPlan(userId, profile.training_days_per_week, profile.preferred_days);
    }
  }

  return { success: true, error: null };
}

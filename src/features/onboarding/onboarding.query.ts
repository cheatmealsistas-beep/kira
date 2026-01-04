import { createClientServer } from '@/shared/database/supabase/server';
import type { FitnessProfile, WeeklyTrainingPlan, WeeklyPlanDay, TrainingDayType } from './types';

/**
 * Get user's fitness profile
 */
export async function getFitnessProfile(userId: string): Promise<FitnessProfile | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('fitness_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    trainingDaysPerWeek: data.training_days_per_week,
    preferredDays: data.preferred_days || [],
    primaryGoal: data.primary_goal,
    limitations: data.limitations || [],
    availableEquipment: data.available_equipment || ['bodyweight'],
    experienceLevel: data.experience_level,
    preferredDuration: data.preferred_duration,
    trackMenstrualCycle: data.track_menstrual_cycle,
    onboardingCompleted: data.onboarding_completed,
    onboardingCompletedAt: data.onboarding_completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const profile = await getFitnessProfile(userId);
  return profile?.onboardingCompleted ?? false;
}

/**
 * Get current week's training plan
 */
export async function getCurrentWeekPlan(userId: string): Promise<WeeklyTrainingPlan | null> {
  const supabase = await createClientServer();

  // Get Monday of current week
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekStart = monday.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weekly_training_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    userId: data.user_id,
    weekStart: data.week_start,
    monday: data.monday as WeeklyPlanDay | null,
    tuesday: data.tuesday as WeeklyPlanDay | null,
    wednesday: data.wednesday as WeeklyPlanDay | null,
    thursday: data.thursday as WeeklyPlanDay | null,
    friday: data.friday as WeeklyPlanDay | null,
    saturday: data.saturday as WeeklyPlanDay | null,
    sunday: data.sunday as WeeklyPlanDay | null,
    generatedAt: data.generated_at,
  };
}

/**
 * Get today's suggested workout type
 */
export async function getTodaySuggestedWorkout(
  userId: string
): Promise<{ type: TrainingDayType; name: string } | null> {
  const plan = await getCurrentWeekPlan(userId);
  if (!plan) return null;

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const today = dayNames[new Date().getDay()];

  return plan[today] || null;
}

/**
 * Generate training plan based on days per week
 */
export function generateTrainingSchedule(
  daysPerWeek: number,
  preferredDays?: number[]
): Record<string, TrainingDayType | null> {
  // Templates based on days per week
  const templates: Record<number, TrainingDayType[]> = {
    2: ['full_body', 'full_body'],
    3: ['legs', 'upper', 'full_body'],
    4: ['legs', 'upper', 'legs', 'upper'],
    5: ['legs', 'push', 'pull', 'legs', 'upper'],
    6: ['legs', 'push', 'pull', 'legs', 'push', 'pull'],
  };

  const schedule: Record<string, TrainingDayType | null> = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  };

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const template = templates[daysPerWeek] || templates[3];

  // If preferred days are specified, use them
  if (preferredDays && preferredDays.length >= daysPerWeek) {
    const sortedDays = [...preferredDays].sort((a, b) => a - b).slice(0, daysPerWeek);
    sortedDays.forEach((dayNum, index) => {
      const dayName = dayNames[dayNum];
      schedule[dayName] = template[index];
    });
  } else {
    // Default distribution: spread evenly through the week
    const defaultDays: Record<number, number[]> = {
      2: [1, 4], // Mon, Thu
      3: [1, 3, 5], // Mon, Wed, Fri
      4: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
      5: [1, 2, 3, 5, 6], // Mon-Wed, Fri-Sat
      6: [1, 2, 3, 4, 5, 6], // Mon-Sat
    };

    const days = defaultDays[daysPerWeek] || defaultDays[3];
    days.forEach((dayNum, index) => {
      const dayName = dayNames[dayNum];
      schedule[dayName] = template[index];
    });
  }

  return schedule;
}

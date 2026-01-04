import { createClientServer } from '@/shared/database/supabase';
import type { DashboardStats, EnergyLevel, DBEnergyLevel, WeeklyProgress } from './types';
import { dbToEnergyLevel } from './types';

/**
 * Get today's energy level for a user
 */
export async function getTodayEnergy(userId: string): Promise<{
  level: EnergyLevel | null;
  loggedAt: string | null;
}> {
  const supabase = await createClientServer();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('energy_logs')
    .select('energy_level, created_at')
    .eq('user_id', userId)
    .eq('log_date', today)
    .single();

  if (error || !data) {
    return { level: null, loggedAt: null };
  }

  return {
    level: dbToEnergyLevel[data.energy_level as DBEnergyLevel],
    loggedAt: data.created_at,
  };
}

/**
 * Get weekly progress for a user
 */
export async function getWeeklyProgress(userId: string): Promise<WeeklyProgress> {
  const supabase = await createClientServer();

  // Get start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust so Monday = 0
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const { data: sessions } = await supabase
    .from('session_logs')
    .select('session_date')
    .eq('user_id', userId)
    .gte('session_date', startOfWeek.toISOString().split('T')[0]);

  const completedDates = new Set(sessions?.map(s => s.session_date) || []);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const weekDays = days.map((day, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    return {
      day,
      completed: completedDates.has(dateStr),
      isToday: i === todayIndex,
    };
  });

  // Get current streak
  const { data: recentSessions } = await supabase
    .from('session_logs')
    .select('session_date')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .limit(30);

  let streak = 0;
  if (recentSessions && recentSessions.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (recentSessions.some(s => s.session_date === dateStr)) {
        streak++;
      } else if (i > 0) { // Allow today to not be completed yet
        break;
      }
    }
  }

  return {
    daysCompleted: completedDates.size,
    totalDays: 7,
    currentStreak: streak,
    weekDays,
  };
}

/**
 * Get dashboard statistics (legacy - for admin)
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    totalUsers: 0,
    activeSubscriptions: 0,
    revenue: 0,
  };
}

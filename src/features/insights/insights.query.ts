import { createClientServer } from '@/shared/database/supabase/server';
import type {
  EnergyLevel,
  EnergyPattern,
  WorkoutPerformance,
  EnergyWorkoutCorrelation,
  WeekdayPattern,
  InsightsSummary,
  GeneratedInsight,
  CalendarDay,
  MonthCalendarData,
} from './types';

// DB energy level mapping
const dbToEnergy: Record<string, EnergyLevel> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
  rest: 'rest',
};

const energyToNumber: Record<EnergyLevel, number> = {
  high: 4,
  medium: 3,
  low: 2,
  rest: 1,
};

const weekdayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const weekdayShort: Record<string, string> = {
  sunday: 'D',
  monday: 'L',
  tuesday: 'M',
  wednesday: 'X',
  thursday: 'J',
  friday: 'V',
  saturday: 'S',
};

/**
 * Get energy pattern for the last N days
 */
export async function getEnergyPattern(userId: string, days: number = 30): Promise<EnergyPattern> {
  const supabase = await createClientServer();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: logs } = await supabase
    .from('energy_logs')
    .select('energy_level, log_date')
    .eq('user_id', userId)
    .gte('log_date', startDate.toISOString().split('T')[0])
    .order('log_date', { ascending: false });

  if (!logs || logs.length === 0) {
    return {
      dominantEnergy: 'medium',
      averageEnergy: 0,
      highEnergyDays: 0,
      lowEnergyDays: 0,
      totalDays: 0,
    };
  }

  const energyCounts: Record<EnergyLevel, number> = { high: 0, medium: 0, low: 0, rest: 0 };
  let totalEnergy = 0;

  logs.forEach(log => {
    const energy = dbToEnergy[log.energy_level] || 'medium';
    energyCounts[energy]++;
    totalEnergy += energyToNumber[energy];
  });

  const dominantEnergy = (Object.entries(energyCounts) as [EnergyLevel, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  return {
    dominantEnergy,
    averageEnergy: Math.round((totalEnergy / logs.length) * 10) / 10,
    highEnergyDays: energyCounts.high,
    lowEnergyDays: energyCounts.low + energyCounts.rest,
    totalDays: logs.length,
  };
}

/**
 * Get workout performance stats
 */
export async function getWorkoutPerformance(userId: string): Promise<WorkoutPerformance> {
  const supabase = await createClientServer();
  const now = new Date();

  // Get start of week (Monday)
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(now.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Get start of month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get all sessions
  const { data: allSessions } = await supabase
    .from('session_logs')
    .select('session_date, duration_minutes, completed')
    .eq('user_id', userId)
    .order('session_date', { ascending: false });

  if (!allSessions || allSessions.length === 0) {
    return {
      totalWorkouts: 0,
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      averageDuration: 0,
      completionRate: 0,
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  const weekSessions = allSessions.filter(
    s => new Date(s.session_date) >= startOfWeek
  );
  const monthSessions = allSessions.filter(
    s => new Date(s.session_date) >= startOfMonth
  );

  const completedSessions = allSessions.filter(s => s.completed !== false);
  const avgDuration = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / completedSessions.length
    : 0;

  // Calculate streaks
  const sortedDates = [...new Set(allSessions.map(s => s.session_date))].sort().reverse();
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check current streak
  if (sortedDates[0] === today || sortedDates[0] === yesterdayStr) {
    let checkDate = new Date(sortedDates[0]);
    for (const dateStr of sortedDates) {
      if (dateStr === checkDate.toISOString().split('T')[0]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      prevDate.setDate(prevDate.getDate() - 1);

      if (prevDate.toISOString().split('T')[0] === sortedDates[i]) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

  return {
    totalWorkouts: allSessions.length,
    workoutsThisWeek: weekSessions.length,
    workoutsThisMonth: monthSessions.length,
    averageDuration: Math.round(avgDuration),
    completionRate: Math.round((completedSessions.length / allSessions.length) * 100),
    currentStreak,
    bestStreak,
  };
}

/**
 * Get energy-workout correlations
 */
export async function getEnergyWorkoutCorrelations(
  userId: string,
  days: number = 30
): Promise<EnergyWorkoutCorrelation[]> {
  const supabase = await createClientServer();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  // Get energy logs
  const { data: energyLogs } = await supabase
    .from('energy_logs')
    .select('energy_level, log_date')
    .eq('user_id', userId)
    .gte('log_date', startStr);

  // Get session logs
  const { data: sessionLogs } = await supabase
    .from('session_logs')
    .select('session_date, duration_minutes, completed')
    .eq('user_id', userId)
    .gte('session_date', startStr);

  const correlations: Record<EnergyLevel, {
    count: number;
    completed: number;
    totalDuration: number;
  }> = {
    high: { count: 0, completed: 0, totalDuration: 0 },
    medium: { count: 0, completed: 0, totalDuration: 0 },
    low: { count: 0, completed: 0, totalDuration: 0 },
    rest: { count: 0, completed: 0, totalDuration: 0 },
  };

  // Map dates to energy levels
  const dateEnergy: Record<string, EnergyLevel> = {};
  energyLogs?.forEach(log => {
    dateEnergy[log.log_date] = dbToEnergy[log.energy_level] || 'medium';
  });

  // Count workouts by energy level
  sessionLogs?.forEach(session => {
    const energy = dateEnergy[session.session_date] || 'medium';
    correlations[energy].count++;
    if (session.completed !== false) {
      correlations[energy].completed++;
      correlations[energy].totalDuration += session.duration_minutes || 0;
    }
  });

  return (['high', 'medium', 'low', 'rest'] as EnergyLevel[]).map(energy => ({
    energy,
    workoutCount: correlations[energy].count,
    completionRate: correlations[energy].count > 0
      ? Math.round((correlations[energy].completed / correlations[energy].count) * 100)
      : 0,
    averageDuration: correlations[energy].completed > 0
      ? Math.round(correlations[energy].totalDuration / correlations[energy].completed)
      : 0,
  }));
}

/**
 * Get weekday patterns
 */
export async function getWeekdayPatterns(userId: string, days: number = 30): Promise<WeekdayPattern[]> {
  const supabase = await createClientServer();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  // Get energy and session logs
  const [{ data: energyLogs }, { data: sessionLogs }] = await Promise.all([
    supabase
      .from('energy_logs')
      .select('energy_level, log_date')
      .eq('user_id', userId)
      .gte('log_date', startStr),
    supabase
      .from('session_logs')
      .select('session_date, completed')
      .eq('user_id', userId)
      .gte('session_date', startStr),
  ]);

  const patterns: Record<string, {
    totalEnergy: number;
    energyCount: number;
    workouts: number;
    completed: number;
  }> = {};

  weekdayNames.forEach(day => {
    patterns[day] = { totalEnergy: 0, energyCount: 0, workouts: 0, completed: 0 };
  });

  energyLogs?.forEach(log => {
    const date = new Date(log.log_date);
    const day = weekdayNames[date.getDay()];
    const energy = dbToEnergy[log.energy_level] || 'medium';
    patterns[day].totalEnergy += energyToNumber[energy];
    patterns[day].energyCount++;
  });

  sessionLogs?.forEach(session => {
    const date = new Date(session.session_date);
    const day = weekdayNames[date.getDay()];
    patterns[day].workouts++;
    if (session.completed !== false) {
      patterns[day].completed++;
    }
  });

  return weekdayNames.slice(1).concat(weekdayNames.slice(0, 1)).map(day => ({
    day,
    dayShort: weekdayShort[day],
    averageEnergy: patterns[day].energyCount > 0
      ? Math.round((patterns[day].totalEnergy / patterns[day].energyCount) * 10) / 10
      : 0,
    workoutCount: patterns[day].workouts,
    completionRate: patterns[day].workouts > 0
      ? Math.round((patterns[day].completed / patterns[day].workouts) * 100)
      : 0,
  }));
}

/**
 * Generate insights based on data
 */
export function generateInsights(
  energyPattern: EnergyPattern,
  performance: WorkoutPerformance,
  correlations: EnergyWorkoutCorrelation[],
  weekdayPatterns: WeekdayPattern[]
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];

  // Streak achievement
  if (performance.currentStreak >= 3) {
    insights.push({
      id: 'streak',
      type: 'achievement',
      icon: 'Flame',
      title: {
        en: `${performance.currentStreak} day streak!`,
        es: `${performance.currentStreak} días de racha!`,
      },
      description: {
        en: 'Keep it up! Consistency is key to progress.',
        es: 'Sigue así. La consistencia es clave para progresar.',
      },
      priority: 10,
    });
  }

  // Best energy day
  const bestEnergyDay = weekdayPatterns.reduce((best, day) =>
    day.averageEnergy > best.averageEnergy ? day : best
  );
  if (bestEnergyDay.averageEnergy > 0) {
    insights.push({
      id: 'best_day',
      type: 'pattern',
      icon: 'TrendingUp',
      title: {
        en: `${bestEnergyDay.dayShort} is your best day`,
        es: `${bestEnergyDay.dayShort} es tu mejor día`,
      },
      description: {
        en: `Your energy tends to be highest on ${bestEnergyDay.day}s. Great for challenging workouts!`,
        es: `Tu energía suele ser más alta los ${bestEnergyDay.day}. Ideal para entrenos intensos.`,
      },
      priority: 7,
    });
  }

  // High energy correlation
  const highEnergyCorr = correlations.find(c => c.energy === 'high');
  if (highEnergyCorr && highEnergyCorr.workoutCount >= 3) {
    insights.push({
      id: 'high_energy_tip',
      type: 'tip',
      icon: 'Zap',
      title: {
        en: 'Make the most of high energy days',
        es: 'Aprovecha los días de alta energía',
      },
      description: {
        en: `On high energy days, you complete ${highEnergyCorr.completionRate}% of workouts. Push a little harder!`,
        es: `En días de alta energía, completas el ${highEnergyCorr.completionRate}% de los entrenos. Puedes apretar un poco más.`,
      },
      priority: 6,
    });
  }

  // Low energy suggestion
  const lowEnergyCorr = correlations.find(c => c.energy === 'low');
  if (lowEnergyCorr && lowEnergyCorr.workoutCount >= 2 && lowEnergyCorr.completionRate < 70) {
    insights.push({
      id: 'low_energy_tip',
      type: 'suggestion',
      icon: 'Heart',
      title: {
        en: 'Listen to your body on low days',
        es: 'Escucha a tu cuerpo en días bajos',
      },
      description: {
        en: 'On low energy days, shorter workouts or mobility sessions can be more effective.',
        es: 'En días de baja energía, sesiones cortas o de movilidad pueden ser más efectivas.',
      },
      priority: 5,
    });
  }

  // Consistency suggestion
  if (performance.workoutsThisWeek < 2 && performance.totalWorkouts > 5) {
    insights.push({
      id: 'consistency',
      type: 'suggestion',
      icon: 'Calendar',
      title: {
        en: 'Stay consistent',
        es: 'Mantén la consistencia',
      },
      description: {
        en: 'You usually train more. Even a light session counts!',
        es: 'Normalmente entrenas más. Incluso una sesión suave cuenta.',
      },
      priority: 8,
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
}

/**
 * Get full insights summary
 */
export async function getInsightsSummary(userId: string, days: number = 30): Promise<InsightsSummary> {
  const [energyPattern, performance, correlations, weekdayPatterns] = await Promise.all([
    getEnergyPattern(userId, days),
    getWorkoutPerformance(userId),
    getEnergyWorkoutCorrelations(userId, days),
    getWeekdayPatterns(userId, days),
  ]);

  const insights = generateInsights(energyPattern, performance, correlations, weekdayPatterns);

  return {
    energyPattern,
    performance,
    correlations,
    weekdayPatterns,
    insights,
  };
}

/**
 * Get calendar data for a month
 */
export async function getMonthCalendar(
  userId: string,
  year: number,
  month: number
): Promise<MonthCalendarData> {
  const supabase = await createClientServer();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const [{ data: energyLogs }, { data: sessionLogs }] = await Promise.all([
    supabase
      .from('energy_logs')
      .select('energy_level, log_date')
      .eq('user_id', userId)
      .gte('log_date', startStr)
      .lte('log_date', endStr),
    supabase
      .from('session_logs')
      .select('session_date, completed')
      .eq('user_id', userId)
      .gte('session_date', startStr)
      .lte('session_date', endStr),
  ]);

  const energyMap: Record<string, EnergyLevel> = {};
  energyLogs?.forEach(log => {
    energyMap[log.log_date] = dbToEnergy[log.energy_level] || 'medium';
  });

  const sessionMap: Record<string, { had: boolean; completed: boolean }> = {};
  sessionLogs?.forEach(session => {
    sessionMap[session.session_date] = {
      had: true,
      completed: session.completed !== false,
    };
  });

  const days: CalendarDay[] = [];
  const daysInMonth = endDate.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dateStr = date.toISOString().split('T')[0];

    days.push({
      date: dateStr,
      energy: energyMap[dateStr] || null,
      hadWorkout: sessionMap[dateStr]?.had || false,
      workoutCompleted: sessionMap[dateStr]?.completed || false,
    });
  }

  return { year, month, days };
}

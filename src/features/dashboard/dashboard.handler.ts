import { getDashboardStats } from './dashboard.query';
import { setTodayEnergy } from './dashboard.command';
import { setEnergySchema, type DashboardStats, type EnergyLevel } from './types';

/**
 * Handle fetching dashboard data
 */
export async function handleGetDashboardData(): Promise<{
  stats: DashboardStats;
  error: string | null;
}> {
  try {
    const stats = await getDashboardStats();
    return { stats, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      stats: { totalUsers: 0, activeSubscriptions: 0, revenue: 0 },
      error: message,
    };
  }
}

/**
 * Handle setting today's energy level
 */
export async function handleSetEnergy(
  userId: string,
  input: { energyLevel: EnergyLevel }
): Promise<{ success: boolean; error: string | null }> {
  // Validate input
  const validation = setEnergySchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  return setTodayEnergy(userId, validation.data.energyLevel);
}

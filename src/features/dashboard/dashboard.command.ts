import { createClientServer } from '@/shared/database/supabase';
import type { EnergyLevel, DBEnergyLevel } from './types';
import { energyLevelToDb } from './types';

/**
 * Set or update today's energy level
 */
export async function setTodayEnergy(
  userId: string,
  energyLevel: EnergyLevel
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClientServer();
  const today = new Date().toISOString().split('T')[0];
  const dbLevel: DBEnergyLevel = energyLevelToDb[energyLevel];

  // Upsert - insert or update if exists
  const { error } = await supabase
    .from('energy_logs')
    .upsert(
      {
        user_id: userId,
        log_date: today,
        energy_level: dbLevel,
      },
      {
        onConflict: 'user_id,log_date',
      }
    );

  if (error) {
    console.error('Error setting energy:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

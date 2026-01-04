'use server';

import { revalidatePath } from 'next/cache';
import { getUser } from '@/shared/auth';
import { handleGetDashboardData, handleSetEnergy } from './dashboard.handler';
import type { EnergyLevel } from './types';

export async function getDashboardDataAction() {
  return handleGetDashboardData();
}

export async function setEnergyAction(energyLevel: EnergyLevel) {
  const user = await getUser();
  if (!user) {
    return { success: false, error: 'No autenticada' };
  }

  const result = await handleSetEnergy(user.id, { energyLevel });

  if (result.success) {
    revalidatePath('/dashboard');
  }

  return result;
}

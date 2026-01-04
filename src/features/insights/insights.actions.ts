'use server';

import { getInsightsSummary, getMonthCalendar } from './insights.query';
import { getUser } from '@/shared/auth';
import type { InsightsSummary, MonthCalendarData } from './types';

/**
 * Get insights summary for the current user
 */
export async function getInsightsAction(days: number = 30): Promise<{
  success: boolean;
  data?: InsightsSummary;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const data = await getInsightsSummary(user.id, days);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting insights:', error);
    return { success: false, error: 'Failed to load insights' };
  }
}

/**
 * Get calendar data for a specific month
 */
export async function getCalendarAction(year: number, month: number): Promise<{
  success: boolean;
  data?: MonthCalendarData;
  error?: string;
}> {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const data = await getMonthCalendar(user.id, year, month);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting calendar:', error);
    return { success: false, error: 'Failed to load calendar' };
  }
}

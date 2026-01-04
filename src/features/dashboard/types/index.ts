/**
 * Kira Dashboard Types
 * Tipos para el dashboard de entrenamiento personalizado
 */

import { z } from 'zod';

// ============================================================================
// ENERGY LEVELS
// ============================================================================

// Niveles de energía en la UI (simplificado para UX)
export type EnergyLevel = 'high' | 'medium' | 'low' | 'rest';

// Niveles de energía en la DB (más granular para análisis)
export type DBEnergyLevel = 'very_high' | 'high' | 'normal' | 'low' | 'very_low';

// Mapeo UI → DB
export const energyLevelToDb: Record<EnergyLevel, DBEnergyLevel> = {
  high: 'high',
  medium: 'normal',
  low: 'low',
  rest: 'very_low',
};

// Mapeo DB → UI
export const dbToEnergyLevel: Record<DBEnergyLevel, EnergyLevel> = {
  very_high: 'high',
  high: 'high',
  normal: 'medium',
  low: 'low',
  very_low: 'rest',
};

// Schema para validar entrada de energía
export const setEnergySchema = z.object({
  energyLevel: z.enum(['high', 'medium', 'low', 'rest']),
});

export type SetEnergyInput = z.infer<typeof setEnergySchema>;

// Estado de energía del usuario para hoy
export interface TodayEnergy {
  level: EnergyLevel | null;
  loggedAt: string | null;
}

// Entrenamiento recomendado basado en energía
export interface RecommendedWorkout {
  id: string;
  name: string;
  duration: number; // en minutos
  exerciseCount: number;
  intensity: 'alta' | 'media' | 'baja' | 'recuperación';
  description: string;
}

// Progreso semanal
export interface WeeklyProgress {
  daysCompleted: number;
  totalDays: 7;
  currentStreak: number;
  weekDays: {
    day: string; // 'L', 'M', 'X', 'J', 'V', 'S', 'D'
    completed: boolean;
    isToday: boolean;
  }[];
}

// Estadísticas del usuario
export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  longestStreak: number;
  thisMonthWorkouts: number;
}

// Dashboard completo de Kira
export interface KiraDashboard {
  greeting: string;
  todayEnergy: TodayEnergy;
  recommendedWorkout: RecommendedWorkout | null;
  weeklyProgress: WeeklyProgress;
  stats: UserStats;
  lastWorkoutDate: string | null;
}

// Props para el saludo personalizado
export interface GreetingProps {
  userName: string | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

// Legacy type para compatibilidad (eliminar cuando no se use)
export type DashboardStats = {
  totalUsers: number;
  activeSubscriptions: number;
  revenue: number;
};

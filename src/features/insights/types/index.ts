/**
 * Kira Insights Types
 *
 * Types for energy-performance correlations and patterns
 */

import { z } from 'zod';

// ============================================================================
// ENERGY PATTERNS
// ============================================================================

export type EnergyLevel = 'high' | 'medium' | 'low' | 'rest';

export interface DailyEnergyLog {
  date: string;
  energy: EnergyLevel;
  hadWorkout: boolean;
  workoutCompleted: boolean;
}

export interface EnergyPattern {
  /** Most common energy level */
  dominantEnergy: EnergyLevel;
  /** Average energy (1-4 scale) */
  averageEnergy: number;
  /** Days with high energy */
  highEnergyDays: number;
  /** Days with low/rest energy */
  lowEnergyDays: number;
  /** Total days tracked */
  totalDays: number;
}

// ============================================================================
// WORKOUT PERFORMANCE
// ============================================================================

export interface WorkoutPerformance {
  /** Total workouts completed */
  totalWorkouts: number;
  /** Workouts this week */
  workoutsThisWeek: number;
  /** Workouts this month */
  workoutsThisMonth: number;
  /** Average workout duration in minutes */
  averageDuration: number;
  /** Completion rate (started vs completed) */
  completionRate: number;
  /** Current streak */
  currentStreak: number;
  /** Best streak ever */
  bestStreak: number;
}

// ============================================================================
// ENERGY-PERFORMANCE CORRELATIONS
// ============================================================================

export interface EnergyWorkoutCorrelation {
  energy: EnergyLevel;
  /** Number of workouts at this energy level */
  workoutCount: number;
  /** Completion rate at this energy level */
  completionRate: number;
  /** Average workout duration at this energy level */
  averageDuration: number;
  /** Average perceived difficulty (RPE) */
  averageRpe?: number;
}

export interface WeekdayPattern {
  day: string; // 'monday', 'tuesday', etc.
  dayShort: string; // 'L', 'M', 'X', etc.
  /** Average energy on this day */
  averageEnergy: number;
  /** Number of workouts on this day */
  workoutCount: number;
  /** Completion rate on this day */
  completionRate: number;
}

// ============================================================================
// INSIGHTS DASHBOARD DATA
// ============================================================================

export interface InsightsSummary {
  /** Last 30 days energy pattern */
  energyPattern: EnergyPattern;
  /** Workout performance stats */
  performance: WorkoutPerformance;
  /** Energy-workout correlations */
  correlations: EnergyWorkoutCorrelation[];
  /** Weekday patterns */
  weekdayPatterns: WeekdayPattern[];
  /** Generated insights/tips */
  insights: GeneratedInsight[];
}

export interface GeneratedInsight {
  id: string;
  type: 'tip' | 'pattern' | 'achievement' | 'suggestion';
  icon: string; // Lucide icon name
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  priority: number; // Higher = more important
}

// ============================================================================
// CALENDAR DATA
// ============================================================================

export interface CalendarDay {
  date: string;
  energy: EnergyLevel | null;
  hadWorkout: boolean;
  workoutCompleted: boolean;
}

export interface MonthCalendarData {
  year: number;
  month: number;
  days: CalendarDay[];
}

// ============================================================================
// PROGRESS OVER TIME
// ============================================================================

export interface ProgressDataPoint {
  date: string;
  /** Exercise slug */
  exercise: string;
  /** Weight used in kg */
  weight: number;
  /** Reps completed */
  reps: number;
}

export interface ExerciseProgress {
  exerciseSlug: string;
  exerciseName: string;
  /** Data points over time */
  dataPoints: ProgressDataPoint[];
  /** Starting weight */
  startWeight: number;
  /** Current weight */
  currentWeight: number;
  /** Percentage increase */
  progressPercent: number;
}

// ============================================================================
// API SCHEMAS
// ============================================================================

export const insightsQuerySchema = z.object({
  /** Number of days to analyze (default 30) */
  days: z.number().min(7).max(365).default(30),
});

export type InsightsQueryInput = z.infer<typeof insightsQuerySchema>;

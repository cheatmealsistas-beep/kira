// Components
export { DashboardStatsCards, KiraDashboard } from './components';

// Actions & queries
export * from './dashboard.actions';
export * from './dashboard.handler';
export * from './dashboard.query';

// Types (export individually to avoid conflicts)
export type {
  EnergyLevel,
  TodayEnergy,
  RecommendedWorkout,
  WeeklyProgress,
  UserStats,
  KiraDashboard as KiraDashboardData,
  GreetingProps,
  DashboardStats,
} from './types';

// Components
export { OnboardingFlow } from './components';

// Queries
export {
  getFitnessProfile,
  hasCompletedOnboarding,
  getCurrentWeekPlan,
  getTodaySuggestedWorkout,
  generateTrainingSchedule,
} from './onboarding.query';

// Commands
export {
  saveFitnessProfile,
  updateTrainingDays,
  generateWeeklyPlan,
  updateFitnessProfile,
} from './onboarding.command';

// Actions
export {
  completeOnboardingAction,
  updateTrainingDaysAction,
  updateFitnessProfileAction,
} from './onboarding.actions';

// Types
export type {
  ExperienceLevel,
  FitnessGoal,
  BodyLimitation,
  Equipment,
  TrainingDayType,
  FitnessProfileInput,
  FitnessProfile,
  WeeklyPlanDay,
  WeeklyTrainingPlan,
} from './types';

export {
  experienceLevels,
  experienceLevelLabels,
  fitnessGoals,
  fitnessGoalLabels,
  bodyLimitations,
  limitationLabels,
  equipmentOptions,
  equipmentLabels,
  trainingDayTypes,
  trainingDayLabels,
} from './types';

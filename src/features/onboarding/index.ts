// Components
export { OnboardingFlow } from './components';

// Actions (safe for client components - they are server actions)
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

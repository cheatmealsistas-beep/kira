// Types
export type {
  TrainingProgram,
  ProgramSession,
  ProgramExercise,
  PyramidSet,
  UserProgram,
  UserExerciseProgress,
  ExerciseHistoryEntry,
  ExerciseSuggestion,
  ProgressionReason,
  ProgressionType,
  WorkoutFeedback,
  FeelingType,
  SessionResult,
  ExerciseLogInput,
  WorkoutFeedbackInput,
} from './types';

// Constants and schemas
export {
  progressionTypes,
  progressionTypeLabels,
  progressionReasonMessages,
  feelingTypes,
  feelingLabels,
  difficultyLabels,
  exerciseLogInputSchema,
  workoutFeedbackSchema,
  PROGRESSION_CONFIG,
} from './types';

// Queries
export {
  getActivePrograms,
  getProgramBySlug,
  getProgramWithSessions,
  getUserActiveProgram,
  getTodaySession,
  getExerciseProgress,
  getExerciseSuggestion,
  getSessionSuggestions,
} from './programs.query';

// Commands
export {
  enrollUserToProgram,
  saveSessionResult,
  advanceProgramWeek,
  getProgressionAdjustmentFactor,
} from './programs.command';

// Actions
export {
  enrollToProgramAction,
  saveSessionResultAction,
  advanceWeekAction,
  saveFeedbackAction,
  getSessionSuggestionsAction,
} from './programs.actions';

// Components
export { ProgramSelector, ProgramSessionView, RestDayOptions } from './components';

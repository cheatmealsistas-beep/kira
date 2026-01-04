import { z } from 'zod';

// ============================================================================
// TIPOS DE PROGRESIÓN
// ============================================================================

export const progressionTypes = ['double', 'linear_reps', 'linear_weight', 'pyramid', 'none'] as const;
export type ProgressionType = (typeof progressionTypes)[number];

export const progressionTypeLabels: Record<ProgressionType, { en: string; es: string }> = {
  double: {
    en: 'Double Progression (reps then weight)',
    es: 'Doble Progresión (reps y luego peso)',
  },
  linear_reps: {
    en: 'Linear Reps (add reps each week)',
    es: 'Progresión por Reps',
  },
  linear_weight: {
    en: 'Linear Weight (add weight each week)',
    es: 'Progresión por Peso',
  },
  pyramid: {
    en: 'Pyramid Sets',
    es: 'Series Piramidales',
  },
  none: {
    en: 'No Progression (isometric, etc)',
    es: 'Sin Progresión (isométricos, etc)',
  },
};

// ============================================================================
// PROGRAMA DE ENTRENAMIENTO
// ============================================================================

export interface TrainingProgram {
  id: string;
  slug: string;
  name: { en: string; es: string };
  description?: { en: string; es: string };
  daysPerWeek: number;
  durationWeeks: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: 'strength' | 'recomposition' | 'endurance' | 'general';
  progressionType: ProgressionType;
  isActive: boolean;
}

export interface ProgramSession {
  id: string;
  programId: string;
  sessionOrder: number;
  name: { en: string; es: string };
  sessionType: 'legs' | 'upper' | 'push' | 'pull' | 'full_body';
  estimatedDuration: number;
  exercises?: ProgramExercise[];
}

// Ficha de instrucciones del ejercicio
export interface ExerciseCard {
  position?: { en: string; es: string };
  grip?: { en: string; es: string };
  movement?: { en: string; es: string };
  targetMuscles?: { en: string; es: string };
  keyCue?: { en: string; es: string };
  commonMistake?: { en: string; es: string };
  safetyTip?: { en: string; es: string };
}

export interface ProgramExercise {
  id: string;
  sessionId: string;
  exerciseSlug: string;
  exerciseOrder: number;
  sets: number;
  minReps: number;
  maxReps: number;
  restSeconds: number;
  progressionType?: ProgressionType;
  pyramidConfig?: PyramidSet[];
  notes?: { en: string; es: string };
  // Datos del ejercicio (join)
  exercise?: {
    slug: string;
    name: { en: string; es: string };
    muscleGroup: string;
    equipment: string[];
    card?: ExerciseCard;
  };
}

export interface PyramidSet {
  reps: number;
  intensity: number; // 0.7 = 70% del peso máximo
}

// ============================================================================
// PROGRESO DEL USUARIO
// ============================================================================

export interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  startedAt: string;
  currentWeek: number;
  isActive: boolean;
  completedAt?: string;
  program?: TrainingProgram;
}

export interface UserExerciseProgress {
  id: string;
  userId: string;
  exerciseSlug: string;
  currentWeight: number;
  lastRepsCompleted?: number;
  lastSessionDate?: string;
  consecutiveSuccesses: number;
  recentHistory: ExerciseHistoryEntry[];
}

export interface ExerciseHistoryEntry {
  date: string;
  weight: number;
  reps: number[];  // reps por cada serie
  completed: boolean;  // true si completó todas las reps del rango máximo
}

// ============================================================================
// SUGERENCIA DE PESO/REPS PARA PRÓXIMA SESIÓN
// ============================================================================

export interface ExerciseSuggestion {
  exerciseSlug: string;
  suggestedWeight: number;
  suggestedReps: number;  // objetivo de reps por serie
  previousWeight: number;
  previousReps: number;
  progressionReason: ProgressionReason;
}

export type ProgressionReason =
  | 'first_time'        // Primera vez haciendo el ejercicio
  | 'maintain'          // Mantener peso, aún no dominas el rango
  | 'increase_reps'     // Aumentar reps (dentro del rango)
  | 'increase_weight'   // Subir peso (completaste max_reps varias veces)
  | 'decrease_weight'   // Bajar peso (fallaste o día de baja energía)
  | 'pyramid';          // Serie piramidal

export const progressionReasonMessages: Record<ProgressionReason, { en: string; es: string }> = {
  first_time: {
    en: 'Start light and focus on form',
    es: 'Empieza ligero, enfócate en la técnica',
  },
  maintain: {
    en: 'Same weight - master the movement',
    es: 'Mismo peso - domina el movimiento',
  },
  increase_reps: {
    en: 'Try to add 1-2 more reps',
    es: 'Intenta añadir 1-2 reps más',
  },
  increase_weight: {
    en: 'Ready to go heavier!',
    es: '¡Lista para subir peso!',
  },
  decrease_weight: {
    en: 'Lower weight today - listen to your body',
    es: 'Menos peso hoy - escucha a tu cuerpo',
  },
  pyramid: {
    en: 'Pyramid set - weight varies per set',
    es: 'Serie piramidal - el peso varía por serie',
  },
};

// ============================================================================
// SCHEMAS DE VALIDACIÓN
// ============================================================================

export const exerciseLogInputSchema = z.object({
  exerciseSlug: z.string(),
  sessionId: z.string().uuid(),
  weight: z.number().min(0),
  repsPerSet: z.array(z.number().min(0)),  // [12, 12, 10]
  allRepsCompleted: z.boolean(),
  difficultyRating: z.number().min(1).max(5).optional(),
  energyLevel: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().optional(),
});

export type ExerciseLogInput = z.infer<typeof exerciseLogInputSchema>;

// ============================================================================
// FEEDBACK POST-ENTRENAMIENTO
// ============================================================================

export const feelingTypes = ['exhausted', 'tired', 'good', 'strong', 'energized'] as const;
export type FeelingType = (typeof feelingTypes)[number];

export const feelingLabels: Record<FeelingType, { en: string; es: string; emoji: string }> = {
  exhausted: { en: 'Exhausted', es: 'Agotada', emoji: '😫' },
  tired: { en: 'Tired', es: 'Cansada', emoji: '😓' },
  good: { en: 'Good', es: 'Bien', emoji: '🙂' },
  strong: { en: 'Strong', es: 'Fuerte', emoji: '💪' },
  energized: { en: 'Energized', es: 'Con energía', emoji: '⚡' },
};

export const difficultyLabels: Record<number, { en: string; es: string }> = {
  1: { en: 'Very easy - could do much more', es: 'Muy fácil - podría hacer mucho más' },
  2: { en: 'Easy - could do more', es: 'Fácil - podría hacer más' },
  3: { en: 'Just right', es: 'Adecuado' },
  4: { en: 'Hard - struggled to finish', es: 'Difícil - me costó terminarlo' },
  5: { en: 'Very hard - barely finished', es: 'Muy difícil - casi no lo termino' },
};

export interface WorkoutFeedback {
  feeling: FeelingType;
  difficultyRating: number; // 1-5
  energyLevel?: 'high' | 'medium' | 'low';
  notes?: string;
}

export const workoutFeedbackSchema = z.object({
  feeling: z.enum(feelingTypes),
  difficultyRating: z.number().min(1).max(5),
  energyLevel: z.enum(['high', 'medium', 'low']).optional(),
  notes: z.string().max(500).optional(),
});

export type WorkoutFeedbackInput = z.infer<typeof workoutFeedbackSchema>;

// ============================================================================
// RESULTADO DE SESIÓN COMPLETA
// ============================================================================

export interface SessionResult {
  sessionId: string;
  exercises: {
    exerciseSlug: string;
    weight: number;
    setsCompleted: number;
    repsPerSet: number[];
    allRepsCompleted: boolean;
  }[];
  feedback?: WorkoutFeedback;
  completedAt: string;
}

// ============================================================================
// CONFIGURACIÓN DE PROGRESIÓN
// ============================================================================

export const PROGRESSION_CONFIG = {
  // Cuántas sesiones exitosas consecutivas antes de subir peso
  successesBeforeIncrease: {
    compound: 2,    // Ejercicios compuestos (sentadilla, peso muerto)
    isolation: 3,   // Ejercicios de aislamiento (curl, extensión)
  },

  // Incrementos de peso por tipo de ejercicio (en kg)
  weightIncrement: {
    legs: 2,        // Pierna - salto típico de mancuernas
    upper: 1,       // Tren superior - más conservador
    isolation: 0.5, // Aislamiento - muy gradual (puede requerir micro-discos)
  },

  // Reducción de peso en días de baja energía (%)
  lowEnergyReduction: 0.15, // 15% menos peso

  // Rango de reps para considerar "éxito"
  // Si max_reps = 12 y haces 12 en todas las series → éxito
  // Si haces 10-11 → mantener, si haces <10 → revisar peso
};

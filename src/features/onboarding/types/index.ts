import { z } from 'zod';

// Experience levels
export const experienceLevels = ['beginner', 'intermediate', 'advanced'] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];

export const experienceLevelLabels: Record<ExperienceLevel, { es: string; en: string; description: { es: string; en: string } }> = {
  beginner: {
    es: 'Principiante',
    en: 'Beginner',
    description: {
      es: 'Nueva en el entrenamiento o retomando después de tiempo',
      en: 'New to training or getting back after a break',
    },
  },
  intermediate: {
    es: 'Intermedio',
    en: 'Intermediate',
    description: {
      es: 'Entreno regularmente y conozco los ejercicios básicos',
      en: 'I train regularly and know the basic exercises',
    },
  },
  advanced: {
    es: 'Avanzado',
    en: 'Advanced',
    description: {
      es: 'Llevo años entrenando y domino la técnica',
      en: 'I have years of experience and master the technique',
    },
  },
};

// Goals
export const fitnessGoals = ['strength', 'recomposition', 'endurance', 'flexibility', 'general'] as const;
export type FitnessGoal = (typeof fitnessGoals)[number];

export const fitnessGoalLabels: Record<FitnessGoal, { es: string; en: string; description: { es: string; en: string } }> = {
  strength: {
    es: 'Fuerza',
    en: 'Strength',
    description: {
      es: 'Ganar fuerza y músculo',
      en: 'Build strength and muscle',
    },
  },
  recomposition: {
    es: 'Recomposición',
    en: 'Recomposition',
    description: {
      es: 'Perder grasa y ganar músculo',
      en: 'Lose fat and build muscle',
    },
  },
  endurance: {
    es: 'Resistencia',
    en: 'Endurance',
    description: {
      es: 'Mejorar aguante y cardio',
      en: 'Improve stamina and cardio',
    },
  },
  flexibility: {
    es: 'Flexibilidad',
    en: 'Flexibility',
    description: {
      es: 'Ganar movilidad y reducir tensión',
      en: 'Gain mobility and reduce tension',
    },
  },
  general: {
    es: 'Bienestar',
    en: 'Wellness',
    description: {
      es: 'Sentirme bien y mantenerme activa',
      en: 'Feel good and stay active',
    },
  },
};

// Limitations
export const bodyLimitations = ['knees', 'lower_back', 'shoulders', 'wrists', 'neck', 'hips', 'ankles'] as const;
export type BodyLimitation = (typeof bodyLimitations)[number];

export const limitationLabels: Record<BodyLimitation, { es: string; en: string }> = {
  knees: { es: 'Rodillas', en: 'Knees' },
  lower_back: { es: 'Espalda baja', en: 'Lower back' },
  shoulders: { es: 'Hombros', en: 'Shoulders' },
  wrists: { es: 'Muñecas', en: 'Wrists' },
  neck: { es: 'Cuello', en: 'Neck' },
  hips: { es: 'Caderas', en: 'Hips' },
  ankles: { es: 'Tobillos', en: 'Ankles' },
};

// Equipment
export const equipmentOptions = [
  'bodyweight',
  'dumbbells',
  'kettlebell',
  'barbell',
  'bench',
  'bands',
  'pull_up_bar',
  'cable_machine',
] as const;
export type Equipment = (typeof equipmentOptions)[number];

export const equipmentLabels: Record<Equipment, { es: string; en: string }> = {
  bodyweight: { es: 'Solo cuerpo', en: 'Bodyweight' },
  dumbbells: { es: 'Mancuernas', en: 'Dumbbells' },
  kettlebell: { es: 'Kettlebell', en: 'Kettlebell' },
  barbell: { es: 'Barra', en: 'Barbell' },
  bench: { es: 'Banco', en: 'Bench' },
  bands: { es: 'Bandas elásticas', en: 'Resistance bands' },
  pull_up_bar: { es: 'Barra de dominadas', en: 'Pull-up bar' },
  cable_machine: { es: 'Poleas/máquinas', en: 'Cable machine' },
};

// Training day types
export const trainingDayTypes = ['legs', 'upper', 'full_body', 'push', 'pull', 'cardio', 'mobility'] as const;
export type TrainingDayType = (typeof trainingDayTypes)[number];

export const trainingDayLabels: Record<TrainingDayType, { es: string; en: string }> = {
  legs: { es: 'Pierna', en: 'Legs' },
  upper: { es: 'Tren Superior', en: 'Upper Body' },
  full_body: { es: 'Full Body', en: 'Full Body' },
  push: { es: 'Empuje', en: 'Push' },
  pull: { es: 'Tirón', en: 'Pull' },
  cardio: { es: 'Cardio', en: 'Cardio' },
  mobility: { es: 'Movilidad', en: 'Mobility' },
};

// Fitness Profile Schema
export const fitnessProfileSchema = z.object({
  trainingDaysPerWeek: z.number().min(2).max(6),
  preferredDays: z.array(z.number().min(0).max(6)).optional(),
  primaryGoal: z.enum(fitnessGoals),
  limitations: z.array(z.enum(bodyLimitations)).optional(),
  availableEquipment: z.array(z.enum(equipmentOptions)),
  experienceLevel: z.enum(experienceLevels),
  preferredDuration: z.number().min(15).max(90).optional(),
  trackMenstrualCycle: z.boolean().optional(),
});

export type FitnessProfileInput = z.infer<typeof fitnessProfileSchema>;

// Full profile from DB
export interface FitnessProfile extends FitnessProfileInput {
  id: string;
  userId: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Weekly plan day
export interface WeeklyPlanDay {
  type: TrainingDayType;
  name: string;
}

// Weekly training plan
export interface WeeklyTrainingPlan {
  id: string;
  userId: string;
  weekStart: string;
  monday: WeeklyPlanDay | null;
  tuesday: WeeklyPlanDay | null;
  wednesday: WeeklyPlanDay | null;
  thursday: WeeklyPlanDay | null;
  friday: WeeklyPlanDay | null;
  saturday: WeeklyPlanDay | null;
  sunday: WeeklyPlanDay | null;
  generatedAt: string;
}

// Onboarding step
export type OnboardingStep = 'experience' | 'days' | 'goal' | 'equipment' | 'limitations';

// Onboarding state
export interface OnboardingState {
  currentStep: OnboardingStep;
  data: Partial<FitnessProfileInput>;
}

import { createClientServer } from '@/shared/database/supabase';
import type { EnergyLevel } from '@/features/dashboard/types';
import type { GeneratedWorkout, Exercise } from './types';

/**
 * Get exercises from database
 */
export async function getExercises(): Promise<Exercise[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true);

  if (error || !data) {
    return [];
  }

  return data as Exercise[];
}

/**
 * Generate a workout based on energy level
 * For now, returns a static workout until we have exercises in DB
 */
export async function generateWorkoutForEnergy(
  energyLevel: EnergyLevel
): Promise<GeneratedWorkout> {
  // Try to get exercises from DB
  const exercises = await getExercises();

  // If we have exercises in DB, generate dynamically
  if (exercises.length > 0) {
    return generateDynamicWorkout(exercises, energyLevel);
  }

  // Otherwise, return static workouts
  return getStaticWorkout(energyLevel);
}

/**
 * Generate workout dynamically from exercise catalog
 */
function generateDynamicWorkout(
  exercises: Exercise[],
  energyLevel: EnergyLevel
): GeneratedWorkout {
  // Filter by difficulty based on energy
  const difficultyMap: Record<EnergyLevel, string[]> = {
    high: ['intermediate', 'advanced'],
    medium: ['beginner', 'intermediate'],
    low: ['beginner'],
    rest: [],
  };

  const allowedDifficulties = difficultyMap[energyLevel];
  const filtered = exercises.filter((e) =>
    allowedDifficulties.includes(e.difficulty)
  );

  // Select exercises by pattern to ensure balanced workout
  const patterns: Record<string, Exercise | null> = {
    squat: null,
    hinge: null,
    push_horizontal: null,
    pull_horizontal: null,
    core: null,
  };

  for (const pattern of Object.keys(patterns)) {
    const matching = filtered.filter((e) => e.pattern === pattern);
    if (matching.length > 0) {
      patterns[pattern] = matching[Math.floor(Math.random() * matching.length)];
    }
  }

  const selectedExercises = Object.values(patterns).filter(Boolean) as Exercise[];

  // Config based on energy
  const config = {
    high: { sets: 4, reps: '8-12', rest: '90s', duration: 45, intensity: 'alta' as const },
    medium: { sets: 3, reps: '10-15', rest: '60s', duration: 30, intensity: 'media' as const },
    low: { sets: 2, reps: '12-15', rest: '45s', duration: 20, intensity: 'baja' as const },
    rest: { sets: 0, reps: '0', rest: '0s', duration: 0, intensity: 'recuperación' as const },
  };

  const c = config[energyLevel];

  return {
    name: energyLevel === 'high' ? 'Fuerza Total' : energyLevel === 'medium' ? 'Fuerza Moderada' : 'Movimiento Suave',
    duration: c.duration,
    exerciseCount: selectedExercises.length,
    intensity: c.intensity,
    exercises: selectedExercises.map((e) => ({
      name: e.name_es,
      sets: c.sets,
      reps: c.reps,
      rest: c.rest,
      emoji: getExerciseEmoji(e.pattern),
      instructions: e.card_movement_es || e.card_key_cue_es,
      equipment: e.equipment_required,
    })),
  };
}

/**
 * Static workouts for when DB is empty
 */
function getStaticWorkout(energyLevel: EnergyLevel): GeneratedWorkout {
  const workouts: Record<EnergyLevel, GeneratedWorkout> = {
    high: {
      name: 'Fuerza Total',
      duration: 45,
      exerciseCount: 8,
      intensity: 'alta',
      exercises: [
        { name: 'Calentamiento articular', sets: 1, reps: '5 min', rest: '-', emoji: '🔄', instructions: 'Moviliza todas las articulaciones: cuello, hombros, muñecas, cadera, rodillas y tobillos', equipment: [] },
        { name: 'Sentadilla Goblet', sets: 4, reps: '8-10', rest: '90s', emoji: '🏋️', instructions: 'Sostén la mancuerna/kettlebell frente al pecho. Pecho alto, rodillas hacia afuera siguiendo la línea de los pies. Baja hasta que los codos toquen el interior de las rodillas.', equipment: ['mancuerna', 'kettlebell'] },
        { name: 'Peso muerto rumano', sets: 4, reps: '10-12', rest: '90s', emoji: '💪', instructions: 'Pies separados al ancho de caderas. Mantén las rodillas ligeramente flexionadas. Empuja la cadera hacia atrás manteniendo la espalda neutra. Siente el estiramiento en isquiotibiales.', equipment: ['mancuernas', 'barra'] },
        { name: 'Press de pecho', sets: 3, reps: '10-12', rest: '60s', emoji: '🔥', instructions: 'Tumbada en banco, pies apoyados. Baja las mancuernas hasta que los codos formen 90°. Empuja hacia arriba apretando pectorales arriba.', equipment: ['mancuernas', 'banco'] },
        { name: 'Remo con mancuerna', sets: 3, reps: '10-12', rest: '60s', emoji: '💪', instructions: 'Apoya una mano y rodilla en el banco. Tira del codo hacia el techo manteniéndolo cerca del cuerpo. Aprieta la escápula al subir.', equipment: ['mancuerna', 'banco'] },
        { name: 'Zancadas', sets: 3, reps: '12 cada', rest: '60s', emoji: '🦵', instructions: 'Da un paso largo adelante. Baja la rodilla trasera hacia el suelo sin que la delantera pase la punta del pie. Empuja con el talón delantero para volver.', equipment: ['mancuernas'] },
        { name: 'Plancha', sets: 3, reps: '30-45s', rest: '45s', emoji: '🧘', instructions: 'Antebrazos y puntas de pies en el suelo. Cuerpo en línea recta. Aprieta glúteos y abdomen. No dejes caer la cadera ni la subas demasiado.', equipment: ['esterilla'] },
        { name: 'Estiramientos', sets: 1, reps: '5 min', rest: '-', emoji: '🌸', instructions: 'Estira cuádriceps, isquiotibiales, cadera, pecho y espalda. Mantén cada estiramiento 30s respirando profundamente.', equipment: ['esterilla'] },
      ],
    },
    medium: {
      name: 'Fuerza Moderada',
      duration: 30,
      exerciseCount: 6,
      intensity: 'media',
      exercises: [
        { name: 'Calentamiento', sets: 1, reps: '3 min', rest: '-', emoji: '🔄', instructions: 'Movilidad articular suave: círculos de hombros, rotaciones de cadera, flexiones de rodilla', equipment: [] },
        { name: 'Sentadilla sumo', sets: 3, reps: '12-15', rest: '60s', emoji: '🏋️', instructions: 'Pies más anchos que caderas, puntas hacia afuera. Baja manteniendo las rodillas en línea con los pies. Aprieta glúteos al subir.', equipment: ['mancuerna', 'kettlebell'] },
        { name: 'Puente de glúteos', sets: 3, reps: '15', rest: '45s', emoji: '🍑', instructions: 'Tumbada boca arriba, rodillas flexionadas, pies apoyados. Eleva la cadera apretando glúteos. Mantén 2 segundos arriba.', equipment: ['esterilla', 'disco (opcional)'] },
        { name: 'Flexiones (rodillas ok)', sets: 3, reps: '10-12', rest: '60s', emoji: '💪', instructions: 'Manos un poco más anchas que los hombros. Baja el pecho hacia el suelo manteniendo el cuerpo recto. Puedes apoyar rodillas si lo necesitas.', equipment: ['esterilla'] },
        { name: 'Remo inclinado', sets: 3, reps: '12-15', rest: '60s', emoji: '💪', instructions: 'Inclínate desde la cadera 45°. Tira de los codos hacia atrás apretando escápulas. Mantén la espalda neutra.', equipment: ['mancuernas'] },
        { name: 'Estiramientos', sets: 1, reps: '5 min', rest: '-', emoji: '🌸', instructions: 'Enfócate en respirar profundo mientras estiras los músculos trabajados', equipment: ['esterilla'] },
      ],
    },
    low: {
      name: 'Movimiento Suave',
      duration: 20,
      exerciseCount: 5,
      intensity: 'baja',
      exercises: [
        { name: 'Respiración profunda', sets: 1, reps: '2 min', rest: '-', emoji: '🌬️', instructions: 'Siéntate o túmbate cómodamente. Inhala por la nariz 4 segundos, exhala por la boca 6 segundos. Relaja los hombros.', equipment: ['esterilla'] },
        { name: 'Movilidad de cadera', sets: 2, reps: '10 cada lado', rest: '30s', emoji: '🔄', instructions: 'A cuatro patas, haz círculos con la rodilla hacia afuera. Movimientos suaves y controlados.', equipment: ['esterilla'] },
        { name: 'Cat-cow', sets: 2, reps: '10', rest: '30s', emoji: '🐱', instructions: 'A cuatro patas, arquea la espalda mirando al techo (cat) y luego hunde el abdomen mirando al frente (cow). Siente cada vértebra.', equipment: ['esterilla'] },
        { name: 'Estiramiento de espalda', sets: 2, reps: '30s cada', rest: '20s', emoji: '🧘', instructions: 'Postura del niño: siéntate sobre los talones y estira los brazos hacia adelante. Respira profundo sin forzar.', equipment: ['esterilla'] },
        { name: 'Relajación guiada', sets: 1, reps: '5 min', rest: '-', emoji: '🌸', instructions: 'Túmbate boca arriba con los ojos cerrados. Escanea tu cuerpo relajando cada parte desde los pies hasta la cabeza.', equipment: ['esterilla'] },
      ],
    },
    rest: {
      name: 'Día de Descanso',
      duration: 0,
      exerciseCount: 0,
      intensity: 'recuperación',
      exercises: [],
    },
  };

  return workouts[energyLevel];
}

function getExerciseEmoji(pattern: string): string {
  const emojis: Record<string, string> = {
    squat: '🏋️',
    hinge: '💪',
    lunge: '🦵',
    push_horizontal: '🔥',
    push_vertical: '💪',
    pull_horizontal: '💪',
    pull_vertical: '💪',
    carry: '🏃',
    core: '🧘',
    shoulder: '💪',
    arm_biceps: '💪',
    arm_triceps: '💪',
    warmup: '🔄',
    mobility: '🌸',
  };
  return emojis[pattern] || '💪';
}

/**
 * Get alternative exercises for swapping
 * Returns exercises with same pattern/muscle group
 */
export async function getSwapAlternatives(
  exerciseName: string,
  locale: string = 'es'
): Promise<{
  exercise: Exercise | null;
  alternatives: Exercise[];
}> {
  const supabase = await createClientServer();

  // First, find the current exercise by name
  const nameColumn = locale === 'es' ? 'name_es' : 'name_en';

  const { data: currentExercise, error: currentError } = await supabase
    .from('exercises')
    .select('*')
    .eq(nameColumn, exerciseName)
    .eq('is_active', true)
    .single();

  if (currentError || !currentExercise) {
    // Try to find by pattern based on name keywords
    return { exercise: null, alternatives: [] };
  }

  // Get swap alternatives by slug if available
  if (currentExercise.swap_alternatives && currentExercise.swap_alternatives.length > 0) {
    const { data: swapExercises, error: swapError } = await supabase
      .from('exercises')
      .select('*')
      .in('slug', currentExercise.swap_alternatives)
      .eq('is_active', true);

    if (!swapError && swapExercises && swapExercises.length > 0) {
      return {
        exercise: currentExercise as Exercise,
        alternatives: swapExercises as Exercise[],
      };
    }
  }

  // Fallback: get exercises with same pattern and primary muscle
  const { data: similarExercises, error: similarError } = await supabase
    .from('exercises')
    .select('*')
    .eq('pattern', currentExercise.pattern)
    .eq('primary_muscle', currentExercise.primary_muscle)
    .eq('is_active', true)
    .neq('slug', currentExercise.slug)
    .limit(5);

  if (similarError || !similarExercises) {
    return { exercise: currentExercise as Exercise, alternatives: [] };
  }

  return {
    exercise: currentExercise as Exercise,
    alternatives: similarExercises as Exercise[],
  };
}

/**
 * Get exercise by slug
 */
export async function getExerciseBySlug(slug: string): Promise<Exercise | null> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Exercise;
}

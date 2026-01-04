import { createClientServer } from '@/shared/database/supabase/server';
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
        {
          name: 'Calentamiento articular',
          sets: 1,
          reps: '5 min',
          rest: '-',
          emoji: '🔄',
          instructions: `POSICIÓN: De pie, pies separados al ancho de caderas.

MOVIMIENTO: Haz círculos suaves con cada articulación durante 30 segundos cada una: cuello (izquierda-derecha, arriba-abajo), hombros (círculos adelante y atrás), muñecas, caderas (círculos amplios), rodillas (semiflexionadas, círculos), tobillos.

CLAVE: Movimientos lentos y controlados. No fuerces ningún rango.

CONSEJO: Si algo duele, reduce el rango de movimiento o sáltalo.`,
          equipment: [],
        },
        {
          name: 'Sentadilla Goblet',
          sets: 4,
          reps: '8-10',
          rest: '90s',
          emoji: '🏋️',
          instructions: `POSICIÓN: De pie, pies al ancho de hombros o un poco más, puntas ligeramente hacia afuera (15-30°).

AGARRE: Sostén la mancuerna o kettlebell verticalmente contra el pecho, sujetándola por los extremos. Codos apuntando hacia abajo.

MOVIMIENTO:
1. Inhala y empuja la cadera hacia atrás como si fueras a sentarte
2. Baja controladamente hasta que los codos toquen el interior de las rodillas
3. Mantén el pecho alto y la espalda neutra todo el tiempo
4. Exhala y empuja a través de los talones para subir

MÚSCULOS: Cuádriceps, glúteos, core.

CLAVE: "Pecho arriba, rodillas afuera". Las rodillas deben seguir la línea de los pies.

ERROR COMÚN: Dejar que las rodillas colapsen hacia dentro o inclinar el torso demasiado adelante.

SEGURIDAD: Si sientes molestia en rodillas, no bajes tanto. La profundidad se gana con el tiempo.`,
          equipment: ['mancuerna o kettlebell'],
        },
        {
          name: 'Peso muerto rumano',
          sets: 4,
          reps: '10-12',
          rest: '90s',
          emoji: '💪',
          instructions: `POSICIÓN: De pie, pies al ancho de caderas, rodillas ligeramente flexionadas (no bloqueadas).

AGARRE: Mancuernas frente a los muslos con agarre neutro (palmas mirándose).

MOVIMIENTO:
1. Inhala y empuja la cadera hacia ATRÁS (no abajo), manteniendo las mancuernas pegadas a las piernas
2. Baja hasta sentir un estiramiento en los isquiotibiales (normalmente a media espinilla)
3. La espalda permanece RECTA durante todo el movimiento - como una tabla inclinándose
4. Exhala y empuja la cadera hacia adelante para subir, apretando glúteos arriba

MÚSCULOS: Isquiotibiales, glúteos, espalda baja.

CLAVE: "Empuja la cadera hacia atrás, no hacia abajo". Imagina que cierras una puerta con el trasero.

ERROR COMÚN: Redondear la espalda o bajar demasiado doblando las rodillas (eso es sentadilla, no RDL).

SEGURIDAD: Si sientes tirantez en la espalda baja, estás redondeando. Para, recolócate.`,
          equipment: ['mancuernas'],
        },
        {
          name: 'Press de pecho',
          sets: 3,
          reps: '10-12',
          rest: '60s',
          emoji: '🔥',
          instructions: `POSICIÓN: Tumbada en banco, pies apoyados firmemente en el suelo. Pequeña curva natural en la espalda baja (no exagerada). Escápulas juntas y hacia abajo.

AGARRE: Mancuernas a la altura del pecho, codos a unos 45° del cuerpo (no 90°), palmas mirando hacia los pies.

MOVIMIENTO:
1. Inhala mientras bajas las mancuernas controladamente hacia los lados del pecho
2. Los codos bajan hasta formar aproximadamente 90°
3. Exhala y empuja hacia arriba, juntando ligeramente las mancuernas arriba sin chocarlas
4. No bloquees los codos completamente arriba

MÚSCULOS: Pectoral mayor, deltoides anterior, tríceps.

CLAVE: "Hombros atrás y abajo". Mantén las escápulas retraídas todo el movimiento.

ERROR COMÚN: Separar los codos a 90° del cuerpo (riesgo de lesión de hombro). Mantén 45°.

SEGURIDAD: Si no tienes banco, hazlo en el suelo - tendrás menos rango pero es igual de efectivo.`,
          equipment: ['mancuernas', 'banco'],
        },
        {
          name: 'Remo con mancuerna',
          sets: 3,
          reps: '10-12',
          rest: '60s',
          emoji: '💪',
          instructions: `POSICIÓN: Apoya una mano y la rodilla del mismo lado en un banco. La otra pierna está al lado del banco con el pie plano en el suelo. Tu espalda debe estar paralela al suelo.

AGARRE: Mancuerna en la mano libre, brazo extendido hacia abajo, palma mirando hacia el banco.

MOVIMIENTO:
1. Mantén el core apretado y la espalda recta
2. Tira del codo hacia el techo, manteniéndolo cerca del cuerpo
3. Sube hasta que la mancuerna llegue a la altura de la cadera
4. Aprieta la escápula un segundo arriba
5. Baja controladamente

MÚSCULOS: Dorsales, romboides, bíceps, core.

CLAVE: "Tira con el codo, no con la mano". Imagina que tienes un cable atado al codo.

ERROR COMÚN: Rotar el torso para subir más peso. El torso debe quedarse quieto.

SEGURIDAD: Si sientes tensión en el cuello, probablemente estás encogiendo los hombros. Relaja.`,
          equipment: ['mancuerna', 'banco'],
        },
        {
          name: 'Zancadas estáticas',
          sets: 3,
          reps: '12 cada pierna',
          rest: '60s',
          emoji: '🦵',
          instructions: `POSICIÓN: De pie en posición de zancada: un pie adelante, otro atrás. Los pies deben estar separados también a lo ancho (no en línea como en una cuerda floja). Torso erguido.

AGARRE: Mancuernas a los lados (opcional) o manos en las caderas.

MOVIMIENTO:
1. Mantén el torso vertical durante todo el movimiento
2. Baja la rodilla trasera hacia el suelo (sin tocarlo)
3. La rodilla delantera se flexiona pero NO pasa de la punta del pie
4. Empuja con el talón delantero para subir
5. Completa todas las repeticiones de un lado antes de cambiar

MÚSCULOS: Cuádriceps, glúteos, isquiotibiales.

CLAVE: "Baja, no adelante". El movimiento es vertical, no hacia adelante.

ERROR COMÚN: Inclinarse hacia adelante o dejar que la rodilla delantera se vaya hacia dentro.

SEGURIDAD: Si las rodillas te molestan, no bajes tanto. Con el tiempo ganarás rango.`,
          equipment: ['mancuernas (opcional)'],
        },
        {
          name: 'Plancha',
          sets: 3,
          reps: '30-45s',
          rest: '45s',
          emoji: '🧘',
          instructions: `POSICIÓN: Boca abajo, apoyada en antebrazos y puntas de los pies. Codos directamente debajo de los hombros. Cuerpo en línea recta desde la cabeza hasta los talones.

MOVIMIENTO:
1. Aprieta glúteos y abdomen como si alguien fuera a darte un golpe en el estómago
2. Empuja los antebrazos contra el suelo
3. Mira al suelo (cuello neutro)
4. Mantén la posición respirando normalmente
5. No dejes que la cadera baje (banana) ni suba (montaña)

MÚSCULOS: Core completo (recto abdominal, transverso, oblicuos), hombros.

CLAVE: "Cola de pato". Mete ligeramente la pelvis hacia adentro para activar más el core.

ERROR COMÚN: Aguantar la respiración o dejar caer la cadera.

SEGURIDAD: Si 30s es demasiado, hazla de rodillas. Si es muy fácil, levanta una pierna.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Estiramientos',
          sets: 1,
          reps: '5 min',
          rest: '-',
          emoji: '🌸',
          instructions: `SECUENCIA RECOMENDADA (30s cada estiramiento):

1. CUÁDRICEPS: De pie, agarra un tobillo llevando el talón al glúteo. Rodillas juntas.

2. ISQUIOTIBIALES: Pierna estirada sobre una superficie a la altura de la cadera. Inclínate desde la cadera manteniendo la espalda recta.

3. CADERA (PIRIFORME): Sentada, cruza un tobillo sobre la rodilla opuesta. Empuja suavemente la rodilla cruzada hacia abajo.

4. PECHO: Brazo estirado contra una pared o marco de puerta. Gira el cuerpo alejándote del brazo.

5. ESPALDA (CAT-COW): A cuatro patas, alterna arquear la espalda (mirando al techo) y hundirla (mirando al frente).

CLAVE: Estira hasta sentir tensión suave, nunca dolor. Respira profundo.

CONSEJO: Si algún músculo está muy cargado, dale más tiempo (60s).`,
          equipment: ['esterilla'],
        },
      ],
    },
    medium: {
      name: 'Fuerza Moderada',
      duration: 30,
      exerciseCount: 6,
      intensity: 'media',
      exercises: [
        {
          name: 'Calentamiento',
          sets: 1,
          reps: '3 min',
          rest: '-',
          emoji: '🔄',
          instructions: `SECUENCIA RÁPIDA (30s cada):

1. MARCHA EN EL SITIO: Sube las rodillas alternando, moviendo los brazos.

2. CÍRCULOS DE HOMBROS: 10 hacia adelante, 10 hacia atrás.

3. CÍRCULOS DE CADERA: Manos en caderas, haz círculos amplios (10 cada lado).

4. ROTACIONES DE TRONCO: Pies fijos, gira el torso de lado a lado.

5. SENTADILLAS SIN PESO: 10 repeticiones suaves, bajando lo que puedas.

6. BALANCEO DE PIERNAS: Apóyate en la pared, balancea cada pierna adelante-atrás.

CLAVE: Movimientos fluidos, sin prisa. El objetivo es activar, no cansar.`,
          equipment: [],
        },
        {
          name: 'Sentadilla sumo',
          sets: 3,
          reps: '12-15',
          rest: '60s',
          emoji: '🏋️',
          instructions: `POSICIÓN: Pies bastante más anchos que los hombros (1.5x), puntas hacia afuera a 45°.

AGARRE: Sostén una mancuerna o kettlebell con ambas manos frente a ti, brazos relajados.

MOVIMIENTO:
1. Inhala y baja empujando las rodillas hacia afuera en la dirección de los pies
2. Mantén el torso lo más vertical posible
3. Baja hasta que los muslos estén paralelos al suelo (o lo que permitan tus caderas)
4. Exhala y sube apretando glúteos arriba

MÚSCULOS: Aductores (interior del muslo), glúteos, cuádriceps.

CLAVE: "Rodillas afuera, pecho arriba". Las rodillas deben ir hacia los dedos pequeños del pie.

ERROR COMÚN: Dejar que las rodillas colapsen hacia dentro. Eso carga las articulaciones.

SEGURIDAD: Si sientes pinzamiento en la cadera, reduce la apertura de los pies.`,
          equipment: ['mancuerna o kettlebell'],
        },
        {
          name: 'Puente de glúteos',
          sets: 3,
          reps: '15',
          rest: '45s',
          emoji: '🍑',
          instructions: `POSICIÓN: Tumbada boca arriba, rodillas flexionadas a 90°, pies apoyados en el suelo al ancho de caderas. Brazos a los lados.

MOVIMIENTO:
1. Empuja los talones contra el suelo
2. Eleva la cadera apretando glúteos FUERTE - como si cerraras una cremallera
3. Sube hasta que haya una línea recta de rodillas a hombros
4. Mantén 2 segundos arriba apretando
5. Baja controladamente

MÚSCULOS: Glúteos, isquiotibiales, core.

CLAVE: "Aprieta como si tuvieras una moneda entre los glúteos".

ERROR COMÚN: Arquear la espalda baja para subir más. La extensión viene de la cadera, no de la espalda.

PROGRESIÓN: Para hacerlo más difícil, pon un disco o mancuerna sobre la cadera.`,
          equipment: ['esterilla', 'disco (opcional)'],
        },
        {
          name: 'Flexiones (rodillas ok)',
          sets: 3,
          reps: '10-12',
          rest: '60s',
          emoji: '💪',
          instructions: `POSICIÓN: Manos en el suelo, un poco más anchas que los hombros. Dedos hacia adelante o ligeramente hacia afuera. De rodillas o de puntas de pies.

MOVIMIENTO:
1. Cuerpo en línea recta (ni cadera arriba ni abajo)
2. Inhala y baja el pecho hacia el suelo flexionando los codos
3. Los codos van a 45° del cuerpo, no a los lados
4. Baja hasta que el pecho casi toque el suelo
5. Exhala y empuja hacia arriba

MÚSCULOS: Pectorales, deltoides anterior, tríceps, core.

VERSIONES (de más fácil a más difícil):
- Pared (de pie)
- Banco o escalón inclinado
- Suelo con rodillas
- Suelo completa

CLAVE: "Todo el cuerpo sube y baja junto". Nada de serpiente.

ERROR COMÚN: Cabeza caída (cuello tensionado) o cadera arriba.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Remo inclinado',
          sets: 3,
          reps: '12-15',
          rest: '60s',
          emoji: '💪',
          instructions: `POSICIÓN: De pie, pies al ancho de caderas. Inclínate hacia adelante desde la cadera (como un peso muerto) hasta que el torso esté a 45° del suelo. Rodillas ligeramente flexionadas.

AGARRE: Mancuernas colgando hacia abajo, palmas mirándose.

MOVIMIENTO:
1. Mantén la espalda recta y el core activo
2. Tira de los codos hacia el techo, manteniéndolos cerca del cuerpo
3. Aprieta las escápulas juntas arriba
4. Baja controladamente

MÚSCULOS: Dorsales, romboides, trapecios, bíceps.

CLAVE: "Junta las escápulas como si quisieras romper una nuez entre ellas".

ERROR COMÚN: Enderezar el torso para ayudarte (hace trampa y puedes lesionarte).

SEGURIDAD: Si te duele la espalda baja, quizás estés muy inclinada. Prueba con menos inclinación.`,
          equipment: ['mancuernas'],
        },
        {
          name: 'Estiramientos',
          sets: 1,
          reps: '5 min',
          rest: '-',
          emoji: '🌸',
          instructions: `SECUENCIA SUAVE (45s cada):

1. CUÁDRICEPS: De pie o tumbada de lado, lleva el talón al glúteo.

2. GLÚTEOS: Tumbada, lleva una rodilla al pecho y crúzala ligeramente hacia el hombro opuesto.

3. PECHO: Entrelaza los dedos detrás de la espalda y empuja las manos hacia atrás y abajo.

4. ESPALDA: Siéntate en los talones (postura del niño) y estira los brazos hacia adelante.

5. HOMBROS: Cruza un brazo por delante del pecho y empújalo suavemente con el otro.

CLAVE: Respira profundo en cada estiramiento. Exhala para relajar más el músculo.

CONSEJO: Cierra los ojos y disfruta. Te lo has ganado.`,
          equipment: ['esterilla'],
        },
      ],
    },
    low: {
      name: 'Movimiento Suave',
      duration: 20,
      exerciseCount: 5,
      intensity: 'baja',
      exercises: [
        {
          name: 'Respiración profunda',
          sets: 1,
          reps: '2 min',
          rest: '-',
          emoji: '🌬️',
          instructions: `POSICIÓN: Siéntate cómodamente con la espalda recta, o túmbate boca arriba con las rodillas flexionadas.

TÉCNICA (Respiración 4-7-8):
1. INHALA por la nariz durante 4 segundos - llena el abdomen primero, luego el pecho
2. MANTÉN el aire durante 7 segundos
3. EXHALA lentamente por la boca durante 8 segundos - como si soplaras a través de una pajita
4. Repite 5-8 veces

CLAVE: Pon una mano en el pecho y otra en el abdomen. La mano del abdomen debe moverse más.

BENEFICIOS: Activa el sistema nervioso parasimpático (modo relajación). Ideal para días estresados.

CONSEJO: Si 4-7-8 es muy largo, empieza con 3-5-6 y ve aumentando.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Movilidad de cadera',
          sets: 2,
          reps: '10 cada lado',
          rest: '30s',
          emoji: '🔄',
          instructions: `POSICIÓN: A cuatro patas, manos debajo de hombros, rodillas debajo de caderas. Espalda neutra.

MOVIMIENTO (Círculos de fuego hidratante):
1. Levanta una rodilla del suelo (manteniendo la flexión de 90°)
2. Haz un círculo amplio hacia afuera con esa rodilla
3. El movimiento sale de la cadera, no de la espalda
4. Hazlo fluido, como si pintaras un círculo en el aire
5. 10 círculos hacia afuera, luego 10 hacia dentro
6. Cambia de pierna

MÚSCULOS: Rotadores de cadera, glúteo medio, core.

CLAVE: "Mueve solo la cadera". El resto del cuerpo debe quedarse quieto.

ERROR COMÚN: Balancear la espalda para hacer círculos más grandes. Menos rango pero mejor control.

BENEFICIO: Mejora la movilidad de cadera y alivia tensión de estar sentada.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Cat-Cow',
          sets: 2,
          reps: '10',
          rest: '30s',
          emoji: '🐱',
          instructions: `POSICIÓN: A cuatro patas, manos debajo de hombros, rodillas debajo de caderas.

MOVIMIENTO:
GATO (Exhala):
1. Redondea la espalda hacia el techo (como un gato asustado)
2. Mete la barbilla hacia el pecho
3. Mete el ombligo hacia dentro y arriba
4. Siente cómo se separan las vértebras

VACA (Inhala):
1. Hunde el abdomen hacia el suelo
2. Levanta la cabeza y mira hacia adelante
3. Saca el pecho
4. Abre los hombros

RITMO: Sincroniza con tu respiración. Exhala en Gato, inhala en Vaca.

CLAVE: "Mueve vértebra a vértebra". No es un movimiento brusco, es una ola.

BENEFICIO: Alivia tensión en espalda, mejora movilidad de columna, masajea órganos internos.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Postura del niño',
          sets: 2,
          reps: '30s cada posición',
          rest: '20s',
          emoji: '🧘',
          instructions: `POSICIÓN BÁSICA:
1. De rodillas, siéntate sobre los talones
2. Inclínate hacia adelante apoyando la frente en el suelo
3. Brazos estirados hacia adelante o a los lados del cuerpo
4. Relaja todo

VARIACIÓN LATERAL (30s cada lado):
1. Desde la postura básica, camina las manos hacia la derecha
2. Siente el estiramiento en el lado izquierdo
3. Mantén 30s, luego cambia al otro lado

RESPIRACIÓN: Inhala inflando la espalda. Exhala hundiéndote más en la postura.

CLAVE: "Suelta todo". No hay nada que hacer, solo estar.

MODIFICACIÓN: Si los talones molestan, pon una manta enrollada detrás de las rodillas.

BENEFICIO: Estira espalda baja, hombros y caderas. Reduce estrés y calma la mente.`,
          equipment: ['esterilla'],
        },
        {
          name: 'Relajación guiada',
          sets: 1,
          reps: '5 min',
          rest: '-',
          emoji: '🌸',
          instructions: `POSICIÓN: Tumbada boca arriba, piernas estiradas y separadas, brazos a los lados con palmas hacia arriba. Cierra los ojos.

ESCANEO CORPORAL (guía para ti):

1. PIES Y PIERNAS (1 min)
   Nota tus pies. Siente su peso. Relaja los dedos, los tobillos, las pantorrillas, las rodillas, los muslos.

2. CADERA Y ABDOMEN (1 min)
   Siente la cadera hundirse en el suelo. Relaja el abdomen. Deja ir cualquier tensión.

3. ESPALDA Y PECHO (1 min)
   Nota cómo la espalda contacta con el suelo. El pecho sube y baja con cada respiración.

4. BRAZOS Y MANOS (1 min)
   Relaja hombros, codos, muñecas, manos, hasta la punta de los dedos.

5. CUELLO Y CABEZA (1 min)
   Suelta cualquier tensión en el cuello. Relaja la mandíbula, los ojos, la frente.

FINAL: Quédate 30s más sintiendo tu cuerpo completo. Cuando estés lista, mueve los dedos y abre los ojos lentamente.

CONSEJO: Si te quedas dormida, está bien. Tu cuerpo lo necesitaba.`,
          equipment: ['esterilla'],
        },
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

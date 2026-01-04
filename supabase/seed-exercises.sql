-- Seed: Ejercicios para Kira MVP
-- Basado en plan real para mujeres 40+ con metodología BodyLurra + Sweat
-- Run with: npx supabase db seed --file=supabase/seed-exercises.sql

-- Limpiar tabla si existe data
DELETE FROM exercises;

-- ============================================================================
-- CALENTAMIENTO Y MOVILIDAD
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, difficulty, exercise_order,
  card_movement_es, card_key_cue_es
) VALUES
('joint-circles', 'Joint Circles', 'Círculos articulares', 'warmup', 'warmup',
  ARRAY['full_body'], 'joints', ARRAY['bodyweight'], 'beginner', 'warmup',
  'Haz círculos suaves con cada articulación: tobillos, rodillas, caderas, hombros',
  'Movimientos lentos y controlados, 10 círculos cada dirección'),

('cat-cow', 'Cat-Cow', 'Gato-Vaca', 'mobility', 'mobility',
  ARRAY['back', 'core'], 'spine', ARRAY['bodyweight'], 'beginner', 'warmup',
  'En cuatro puntos, arquea la espalda hacia arriba (gato) y luego hacia abajo (vaca)',
  'Siente cada vértebra moverse, sincroniza con la respiración'),

('hip-circles', 'Hip Circles', 'Círculos de cadera', 'warmup', 'warmup',
  ARRAY['hips', 'glutes'], 'hips', ARRAY['bodyweight'], 'beginner', 'warmup',
  'De pie, dibuja círculos con la cadera como si movieras un hula-hoop',
  'Mantén el torso estable, 10 círculos cada dirección'),

('cervical-mobility', 'Cervical Mobility', 'Movilidad cervical', 'mobility', 'mobility',
  ARRAY['neck', 'shoulders'], 'neck', ARRAY['bodyweight'], 'beginner', 'warmup',
  'Gira la cabeza suavemente de lado a lado, luego sí/no, luego orejas a hombros',
  'Movimientos MUY lentos, sin forzar nunca'),

('thoracic-rotation', 'Thoracic Rotation', 'Rotación torácica', 'mobility', 'mobility',
  ARRAY['back', 'shoulders'], 'thoracic_spine', ARRAY['bodyweight'], 'beginner', 'warmup',
  'En cuatro puntos, mano en la nuca, gira abriendo el codo hacia el techo',
  'Las caderas no se mueven, todo el movimiento es de la espalda alta');

-- ============================================================================
-- EJERCICIOS PRINCIPALES - DÍA PIERNA (Día A)
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es,
  swap_alternatives
) VALUES
('goblet-squat', 'Goblet Squat', 'Sentadilla Goblet', 'strength', 'squat',
  ARRAY['quads', 'glutes', 'core'], 'quads',
  ARRAY['dumbbell', 'kettlebell'], ARRAY['knees', 'lower_back'], 'beginner', 'compound_first',
  9, 8,
  'Mancuerna pegada al pecho, pies algo más abiertos que caderas, puntas ligeramente hacia afuera',
  'Baja como si te sentaras en una silla invisible. Pecho siempre abierto y alto. Sube empujando el suelo con los talones.',
  'Piensa "sentarte en una silla invisible" - pecho arriba, cadera atrás',
  'Dejar que las rodillas colapsen hacia dentro o levantar los talones',
  'Si sientes molestia en rodillas, no bajes tanto - el rango se gana con el tiempo',
  ARRAY['sumo-squat', 'bodyweight-squat']),

('hip-thrust-dumbbell', 'Hip Thrust with Dumbbell', 'Hip Thrust con mancuerna', 'strength', 'hinge',
  ARRAY['glutes', 'hamstrings'], 'glutes',
  ARRAY['dumbbell', 'bench'], ARRAY[]::TEXT[], 'beginner', 'compound_first',
  9, 7,
  'Espalda alta apoyada en banco (a la altura de los omóplatos), mancuerna sobre las caderas, pies al ancho de caderas',
  'Sube la cadera hasta formar una línea recta hombros-rodillas. Aprieta el glúteo 1 segundo arriba. Baja controlado.',
  'Mirada al frente (no al techo), aprieta glúteo arriba 1 segundo',
  'Arquear la espalda o mirar hacia arriba',
  'El banco debe estar ESTABLE. Si no tienes banco, hazlo desde el suelo (glute bridge)',
  ARRAY['glute-bridge']),

('romanian-deadlift', 'Romanian Deadlift', 'Peso Muerto Rumano', 'strength', 'hinge',
  ARRAY['hamstrings', 'glutes', 'lower_back'], 'hamstrings',
  ARRAY['dumbbell', 'barbell', 'kettlebell'], ARRAY['lower_back'], 'intermediate', 'compound',
  9, 8,
  'Mancuernas pegadas a los muslos, pies al ancho de caderas, rodillas semiflexionadas (¡siempre!)',
  'Empuja la cadera hacia atrás manteniendo la espalda neutra. Baja hasta sentir estiramiento en isquios. Sube apretando glúteos.',
  'No es bajar mucho, es CONTROLAR. Espalda siempre neutra.',
  'Redondear la espalda o bajar demasiado',
  'Mantén las mancuernas rozando las piernas durante todo el movimiento',
  ARRAY['sumo-deadlift', 'good-morning']),

('static-lunge', 'Static Lunge', 'Zancada estática', 'strength', 'lunge',
  ARRAY['quads', 'glutes', 'hamstrings'], 'quads',
  ARRAY['bodyweight', 'dumbbell'], ARRAY['knees'], 'beginner', 'compound',
  7, 6,
  'Un paso largo hacia atrás, torso completamente recto, manos en cadera o peso a los lados',
  'Baja en VERTICAL hasta que la rodilla trasera casi toque el suelo. Sube empujando con el talón delantero.',
  'Torso vertical siempre, 90° en ambas rodillas',
  'Inclinarse hacia adelante o dejar que la rodilla pase la punta del pie',
  'Si te cuesta el equilibrio, empieza sin peso y apoyándote ligeramente',
  ARRAY['reverse-lunge', 'bodyweight-squat']),

('hip-abduction', 'Hip Abduction', 'Abducciones de cadera', 'strength', 'hinge',
  ARRAY['glutes', 'hip_abductors'], 'glute_medius',
  ARRAY['band', 'cable_machine', 'bodyweight'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  6, 5,
  'De pie o tumbada de lado, pierna recta o ligeramente flexionada',
  'Separa la pierna del cuerpo de forma controlada. Control lento tanto al subir como al bajar.',
  'La quema es normal. Control > velocidad.',
  'Usar impulso o rotar la cadera',
  'Fundamental para estabilidad de rodilla y cadera',
  ARRAY[]::TEXT[]);

-- ============================================================================
-- EJERCICIOS PRINCIPALES - DÍA UPPER (Día B) - Cuello & muñeca friendly
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es,
  swap_alternatives
) VALUES
('neutral-grip-chest-press', 'Neutral Grip Chest Press', 'Press de pecho agarre neutro', 'strength', 'push_horizontal',
  ARRAY['chest', 'triceps', 'shoulders'], 'chest',
  ARRAY['dumbbell', 'bench'], ARRAY['shoulders', 'wrists'], 'beginner', 'compound_first',
  8, 8,
  'Tumbada en banco, mancuernas con PALMAS MIRÁNDOSE (agarre neutro), pies firmes en el suelo',
  'Baja controlado sin que los codos bajen mucho del nivel del banco. Empuja sin bloquear los codos arriba.',
  'Palmas mirándose = hombros felices. Mucho mejor que barra.',
  'Arquear excesivamente la espalda o bajar los codos demasiado',
  'Este agarre es IDEAL si tienes hombros tensos o muñecas sensibles',
  ARRAY['pushup', 'knee-pushup']),

('single-arm-row', 'Single Arm Row', 'Remo a una mano', 'strength', 'pull_horizontal',
  ARRAY['lats', 'rhomboids', 'biceps'], 'lats',
  ARRAY['dumbbell', 'bench'], ARRAY[]::TEXT[], 'beginner', 'compound_first',
  8, 8,
  'Una rodilla y mano apoyadas en banco, la otra pierna firme en el suelo, mancuerna colgando',
  'Tira del codo hacia atrás (no hacia afuera), aprieta el omóplato arriba. Baja controlado.',
  'Piensa "meter el codo en el bolsillo trasero"',
  'Rotar el torso para subir el peso o tirar con el brazo en vez de la espalda',
  'Mantén las caderas cuadradas al suelo, sin rotar',
  ARRAY['bent-over-row']),

('seated-lateral-raise', 'Seated Lateral Raise', 'Elevaciones laterales sentada', 'strength', 'shoulder',
  ARRAY['shoulders', 'deltoids'], 'lateral_deltoid',
  ARRAY['dumbbell'], ARRAY['shoulders', 'neck'], 'beginner', 'accessory',
  6, 5,
  'Sentada en banco, mancuernas ligeras a los lados, brazos semi extendidos',
  'Sube los brazos hasta la altura del hombro (no más). Control absoluto en la bajada.',
  'Hombros ABAJO - no los subas a las orejas. Peso ligero.',
  'Balancear el cuerpo o encoger los hombros',
  'Menos peso = mejor forma = más resultados. El ego no tonifica.',
  ARRAY['lateral-raise-standing']),

('dumbbell-pullover', 'Dumbbell Pullover', 'Pullover con mancuerna', 'strength', 'pull_vertical',
  ARRAY['lats', 'chest', 'triceps'], 'lats',
  ARRAY['dumbbell', 'bench'], ARRAY['shoulders'], 'intermediate', 'compound',
  7, 7,
  'Tumbada en banco, mancuerna con ambas manos sobre el pecho, brazos casi rectos',
  'Baja la mancuerna por detrás de la cabeza de forma controlada. Sube usando los dorsales.',
  'MARAVILLOSO para espalda y postura. Siente el estiramiento abajo.',
  'Flexionar demasiado los codos o bajar muy rápido',
  'Si sientes molestia en el hombro, reduce el rango de movimiento',
  ARRAY[]::TEXT[]),

('hammer-curl', 'Hammer Curl', 'Curl martillo', 'strength', 'arm_biceps',
  ARRAY['biceps', 'forearms'], 'biceps',
  ARRAY['dumbbell'], ARRAY['wrists'], 'beginner', 'accessory',
  5, 5,
  'De pie, mancuernas a los lados con palmas mirando al cuerpo (agarre martillo)',
  'Flexiona los codos subiendo las mancuernas sin mover el codo de sitio. Baja controlado.',
  'Los codos NO se mueven. Solo flexiona.',
  'Balancear el cuerpo para subir más peso',
  'Agarre neutro = más amable con muñecas y antebrazos',
  ARRAY['concentration-curl']),

('overhead-tricep-extension', 'Overhead Tricep Extension', 'Extensión de tríceps sobre cabeza', 'strength', 'arm_triceps',
  ARRAY['triceps'], 'triceps',
  ARRAY['dumbbell'], ARRAY['elbows', 'shoulders'], 'beginner', 'accessory',
  5, 5,
  'De pie o sentada, una mancuerna sujetada con ambas manos detrás de la cabeza',
  'Extiende los brazos hacia arriba sin mover los codos. Baja controlado.',
  'Los codos apuntan al frente, no se abren',
  'Dejar que los codos se abran hacia los lados',
  'Si molesta el hombro, hazlo tumbada o con polea',
  ARRAY['tricep-dip-bench']);

-- ============================================================================
-- EJERCICIOS PRINCIPALES - DÍA FULL BODY (Día C)
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es,
  swap_alternatives
) VALUES
('step-up', 'Step Up', 'Step-up', 'strength', 'lunge',
  ARRAY['quads', 'glutes', 'hamstrings'], 'quads',
  ARRAY['bench', 'dumbbell', 'bodyweight'], ARRAY['knees'], 'beginner', 'compound',
  7, 6,
  'Frente a un banco estable, pie completo apoyado en el banco',
  'Sube empujando con el TALÓN del pie de arriba, no impulsándote con el de abajo. Baja controlado.',
  'Todo el trabajo lo hace la pierna de arriba. El pie de abajo solo acompaña.',
  'Impulsarse con la pierna de abajo en vez de trabajar con la de arriba',
  'El banco debe ser estable y a una altura que permita 90° de rodilla',
  ARRAY['static-lunge', 'reverse-lunge']),

('sumo-deadlift', 'Sumo Deadlift', 'Peso muerto sumo', 'strength', 'hinge',
  ARRAY['glutes', 'hamstrings', 'quads', 'adductors'], 'glutes',
  ARRAY['dumbbell', 'kettlebell'], ARRAY['lower_back', 'knees'], 'beginner', 'compound',
  8, 7,
  'Pies muy abiertos (más anchos que hombros), puntas hacia afuera, mancuerna entre las piernas',
  'Empuja las rodillas hacia afuera mientras bajas. Sube empujando el suelo y apretando glúteos.',
  'Pecho abierto, empuja rodillas hacia afuera',
  'Dejar que las rodillas colapsen hacia dentro',
  'Excelente variación para quienes tienen molestias con el peso muerto convencional',
  ARRAY['romanian-deadlift', 'goblet-squat']),

('bent-over-row', 'Bent Over Row', 'Remo inclinado', 'strength', 'pull_horizontal',
  ARRAY['lats', 'rhomboids', 'biceps', 'rear_delts'], 'lats',
  ARRAY['dumbbell', 'barbell'], ARRAY['lower_back'], 'intermediate', 'compound',
  8, 8,
  'Pies al ancho de caderas, bisagra de cadera (torso inclinado), espalda NEUTRA',
  'Tira de los codos hacia atrás apretando los omóplatos. Baja controlado.',
  'Mira al suelo (protege el cuello), aprieta omóplatos arriba',
  'Usar impulso, redondear la espalda, o mirar al frente',
  'Si tienes molestias de espalda, mejor el remo a una mano con apoyo',
  ARRAY['single-arm-row']),

('farmer-carry', 'Farmer Carry', 'Farmer Carry', 'strength', 'carry',
  ARRAY['core', 'grip', 'traps', 'shoulders'], 'core',
  ARRAY['dumbbell', 'kettlebell'], ARRAY[]::TEXT[], 'beginner', 'finisher',
  7, 6,
  'De pie, mancuernas pesadas a los lados, hombros atrás y abajo',
  'Camina erguida manteniendo el core apretado. Hombros lejos de las orejas.',
  'Camina como si llevaras una corona. Hombros ABAJO.',
  'Encorvar los hombros o inclinarse',
  'Excelente para core, postura y grip. Peso pesado.',
  ARRAY[]::TEXT[]),

('elevated-plank', 'Elevated Plank', 'Plancha elevada', 'strength', 'core',
  ARRAY['core', 'shoulders', 'glutes'], 'core',
  ARRAY['bench', 'bodyweight'], ARRAY['lower_back', 'shoulders', 'neck'], 'beginner', 'accessory',
  5, 4,
  'Manos en banco (no en el suelo), cuerpo en línea recta',
  'Mantén la posición apretando abdomen y glúteos. Sin dejar caer las caderas.',
  'Menos estrés en hombros y cuello que la plancha normal. Ideal para empezar.',
  'Subir o bajar las caderas, aguantar la respiración',
  'Progresa a plancha normal cuando esta sea fácil 45+ segundos',
  ARRAY['plank']);

-- ============================================================================
-- EJERCICIOS ADICIONALES Y VARIACIONES
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es
) VALUES
('glute-bridge', 'Glute Bridge', 'Puente de glúteos', 'strength', 'hinge',
  ARRAY['glutes', 'hamstrings', 'core'], 'glutes',
  ARRAY['bodyweight', 'dumbbell'], ARRAY[]::TEXT[], 'beginner', 'compound',
  7, 6,
  'Tumbada boca arriba, rodillas flexionadas, pies al ancho de caderas apoyados en el suelo',
  'Empuja los talones para elevar la cadera. Aprieta glúteos arriba 2 segundos. Baja controlado.',
  'Aprieta glúteos arriba y MANTÉN 2 segundos',
  'Arquear la espalda en lugar de usar los glúteos',
  'Perfecta si no tienes banco para hip thrust'),

('bodyweight-squat', 'Bodyweight Squat', 'Sentadilla sin peso', 'strength', 'squat',
  ARRAY['quads', 'glutes', 'core'], 'quads',
  ARRAY['bodyweight'], ARRAY['knees'], 'beginner', 'compound',
  6, 5,
  'Pies al ancho de hombros o ligeramente más, brazos al frente o en el pecho',
  'Baja como si te sentaras, manteniendo el peso en los talones y el pecho arriba. Sube empujando el suelo.',
  'Perfecta para calentar o para días de baja energía',
  'Levantar los talones del suelo o dejar caer el pecho',
  'Ideal para aprender el patrón antes de añadir peso'),

('reverse-lunge', 'Reverse Lunge', 'Zancada hacia atrás', 'strength', 'lunge',
  ARRAY['quads', 'glutes', 'hamstrings'], 'quads',
  ARRAY['bodyweight', 'dumbbell'], ARRAY['knees'], 'beginner', 'compound',
  7, 6,
  'De pie, pies juntos, manos en caderas o peso a los lados',
  'Da un paso largo hacia ATRÁS. Baja hasta que ambas rodillas estén a 90°. Vuelve empujando.',
  'Paso hacia ATRÁS es más estable que hacia adelante',
  'Inclinarse hacia adelante o no dar un paso suficientemente largo',
  'Más estable que la zancada frontal - ideal para principiantes'),

('pushup', 'Push-up', 'Flexiones', 'strength', 'push_horizontal',
  ARRAY['chest', 'triceps', 'shoulders', 'core'], 'chest',
  ARRAY['bodyweight'], ARRAY['shoulders', 'wrists'], 'intermediate', 'compound',
  7, 7,
  'Manos ligeramente más anchas que hombros, cuerpo en línea recta de cabeza a talones',
  'Baja el pecho hacia el suelo, codos a 45° del cuerpo. Empuja hacia arriba manteniendo el cuerpo recto.',
  'Cuerpo recto como una TABLA. Aprieta glúteos y abdomen.',
  'Dejar caer las caderas o subir el trasero',
  'Si es difícil, empieza con rodillas o con manos en banco elevado'),

('knee-pushup', 'Knee Push-up', 'Flexiones de rodillas', 'strength', 'push_horizontal',
  ARRAY['chest', 'triceps', 'shoulders'], 'chest',
  ARRAY['bodyweight'], ARRAY['wrists'], 'beginner', 'compound',
  6, 5,
  'Manos más anchas que hombros, RODILLAS apoyadas, cuerpo en línea de cabeza a rodillas',
  'Mismo movimiento que flexiones completas, pero con menos carga.',
  'NO es hacer menos - es progresión hacia flexiones completas',
  'Subir primero las caderas o no bajar lo suficiente',
  'Progresión perfecta. Domina estas antes de intentar flexiones completas.');

-- ============================================================================
-- CORE ESPECÍFICO
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es
) VALUES
('dead-bug', 'Dead Bug', 'Bicho Muerto', 'strength', 'core',
  ARRAY['core', 'hip_flexors'], 'core',
  ARRAY['bodyweight'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  'Tumbada boca arriba, brazos hacia el techo, rodillas a 90° sobre las caderas',
  'Extiende UN brazo y la pierna CONTRARIA hacia el suelo mientras mantienes la espalda PEGADA al suelo. Alterna.',
  'La espalda baja NUNCA se despega del suelo. Si se despega, el ejercicio no cuenta.',
  'Arquear la espalda al extender',
  'Excelente para aprender a activar el core profundo y proteger la espalda'),

('bird-dog', 'Bird Dog', 'Perro-Pájaro', 'strength', 'core',
  ARRAY['core', 'glutes', 'back'], 'core',
  ARRAY['bodyweight'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  'En cuatro puntos, manos bajo hombros, rodillas bajo caderas, espalda neutra',
  'Extiende un brazo hacia adelante y la pierna CONTRARIA hacia atrás. Mantén 2 segundos. Alterna.',
  'Imagina que tienes una taza de café en la espalda que no puedes derramar',
  'Rotar las caderas o la espalda, o arquear la columna',
  'Ideal para estabilidad del core y coordinación'),

('plank', 'Plank', 'Plancha', 'strength', 'core',
  ARRAY['core', 'shoulders', 'glutes'], 'core',
  ARRAY['bodyweight'], ARRAY['lower_back', 'shoulders'], 'beginner', 'accessory',
  'Antebrazos apoyados en el suelo, codos bajo los hombros, cuerpo en línea recta',
  'Mantén la posición activando abdomen y glúteos, sin dejar caer ni subir las caderas.',
  'Aprieta como si fueras a recibir un golpe en el estómago',
  'Subir las caderas (tienda de campaña) o dejarlas caer',
  'Mejor 20s perfectos que 60s con mala forma');

-- ============================================================================
-- COOLDOWN Y ESTIRAMIENTOS
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, difficulty, exercise_order,
  card_movement_es, card_key_cue_es
) VALUES
('childs-pose', 'Child''s Pose', 'Postura del niño', 'mobility', 'mobility',
  ARRAY['back', 'hips', 'shoulders'], 'back', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Arrodillada, siéntate sobre los talones y estira los brazos hacia adelante apoyando la frente en el suelo',
  'Respira profundo y relaja todo el cuerpo. Quédate 30-60 segundos.'),

('figure-four-stretch', 'Figure Four Stretch', 'Estiramiento en 4', 'mobility', 'mobility',
  ARRAY['glutes', 'hips'], 'glutes', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Tumbada, cruza un tobillo sobre la rodilla contraria formando un 4. Tira de la pierna hacia ti.',
  'Mantén la espalda baja en el suelo, respira. 30 segundos cada lado.'),

('hip-flexor-stretch', 'Hip Flexor Stretch', 'Estiramiento de flexor de cadera', 'mobility', 'mobility',
  ARRAY['hip_flexors', 'quads'], 'hip_flexors', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'En posición de zancada con rodilla trasera en el suelo, empuja la cadera hacia adelante suavemente',
  'Aprieta el glúteo del lado arrodillado para intensificar. 30 segundos cada lado.'),

('chest-doorway-stretch', 'Doorway Chest Stretch', 'Apertura de pecho en puerta', 'mobility', 'mobility',
  ARRAY['chest', 'shoulders'], 'chest', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Antebrazo apoyado en el marco de una puerta, da un paso adelante para sentir el estiramiento en el pecho',
  'Excelente para contrarrestar la postura de oficina. 30 segundos cada lado.'),

('standing-hamstring-stretch', 'Standing Hamstring Stretch', 'Estiramiento de isquios de pie', 'mobility', 'mobility',
  ARRAY['hamstrings', 'lower_back'], 'hamstrings', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Un pie adelante con la pierna recta, inclínate desde la cadera hacia adelante manteniendo la espalda recta',
  'No redondees la espalda. Siente el estiramiento en la parte trasera del muslo.'),

('deep-breathing', 'Deep Breathing', 'Respiración profunda', 'mobility', 'mobility',
  ARRAY['diaphragm', 'core'], 'diaphragm', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Tumbada o sentada, respira profundo por la nariz (4 segundos) y exhala lento por la boca (6 segundos)',
  '5-10 respiraciones. Relaja hombros, mandíbula, y todo el cuerpo.');

-- ============================================================================
-- EJERCICIOS ADICIONALES - PIERNA
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es,
  swap_alternatives
) VALUES
('sumo-squat', 'Sumo Squat', 'Sentadilla Sumo', 'strength', 'squat',
  ARRAY['quads', 'glutes', 'adductors'], 'adductors',
  ARRAY['dumbbell', 'kettlebell', 'bodyweight'], ARRAY['knees'], 'beginner', 'compound',
  8, 7,
  'Pies muy abiertos (más del doble de hombros), puntas hacia afuera 45°, peso entre las piernas',
  'Baja manteniendo las rodillas en línea con los pies. Empuja las rodillas hacia afuera al subir.',
  'Rodillas SIEMPRE siguiendo la dirección de los pies',
  'Dejar que las rodillas colapsen hacia dentro',
  'Ideal para trabajar aductores y glúteos con menos estrés en rodillas',
  ARRAY['goblet-squat', 'bodyweight-squat']),

('bulgarian-split-squat', 'Bulgarian Split Squat', 'Sentadilla Búlgara', 'strength', 'lunge',
  ARRAY['quads', 'glutes', 'hamstrings'], 'quads',
  ARRAY['dumbbell', 'bodyweight', 'bench'], ARRAY['knees'], 'intermediate', 'compound',
  8, 8,
  'Un pie en banco detrás, pie delantero a un paso de distancia, torso erguido',
  'Baja en vertical hasta que la rodilla trasera casi toque el suelo. Sube empujando con el talón.',
  'Todo el peso en la pierna delantera, la trasera solo equilibra',
  'Inclinarse demasiado hacia adelante o poner el pie demasiado cerca',
  'Empieza sin peso hasta dominar el equilibrio',
  ARRAY['static-lunge', 'reverse-lunge']),

('calf-raise', 'Calf Raise', 'Elevación de talones', 'strength', 'squat',
  ARRAY['calves'], 'calves',
  ARRAY['dumbbell', 'bodyweight'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  5, 5,
  'De pie, pies al ancho de caderas, opcional mancuernas a los lados',
  'Sube en las puntas de los pies, aprieta arriba 1 segundo, baja controlado.',
  'Sube alto y baja LENTO - la bajada es donde más trabajas',
  'Hacer el movimiento muy rápido o no subir hasta arriba',
  'Apóyate en algo para equilibrio si es necesario',
  ARRAY[]::TEXT[]),

('wall-sit', 'Wall Sit', 'Sentadilla en pared', 'strength', 'squat',
  ARRAY['quads', 'glutes'], 'quads',
  ARRAY['bodyweight'], ARRAY['knees'], 'beginner', 'accessory',
  6, 5,
  'Espalda completamente pegada a la pared, rodillas a 90°, muslos paralelos al suelo',
  'Mantén la posición. La espalda nunca se despega de la pared.',
  'La quema es NORMAL. Respira y aguanta.',
  'Arquear la espalda o dejar que las rodillas se junten',
  'Ideal para fortalecer cuádriceps sin impacto',
  ARRAY['bodyweight-squat']),

('single-leg-deadlift', 'Single Leg Deadlift', 'Peso Muerto a una pierna', 'strength', 'hinge',
  ARRAY['hamstrings', 'glutes', 'core'], 'hamstrings',
  ARRAY['dumbbell', 'kettlebell', 'bodyweight'], ARRAY['lower_back'], 'intermediate', 'compound',
  7, 7,
  'De pie sobre una pierna, peso en la mano contraria, rodilla ligeramente flexionada',
  'Inclínate hacia adelante mientras la pierna libre sube hacia atrás. Forma una T con el cuerpo.',
  'Cadera cuadrada al suelo, NO rotes',
  'Rotar la cadera hacia el lado o redondear la espalda',
  'Empieza sin peso o apoyándote ligeramente',
  ARRAY['romanian-deadlift']),

('good-morning', 'Good Morning', 'Buenos días', 'strength', 'hinge',
  ARRAY['hamstrings', 'glutes', 'lower_back'], 'hamstrings',
  ARRAY['bodyweight', 'barbell'], ARRAY['lower_back'], 'intermediate', 'compound',
  6, 6,
  'De pie, manos detrás de la cabeza o barra en hombros, pies al ancho de caderas',
  'Bisagra de cadera hacia adelante manteniendo espalda neutra. Baja hasta sentir isquios.',
  'La espalda NUNCA se redondea. Menos rango pero perfecta forma.',
  'Redondear la espalda o bloquear las rodillas',
  'Empieza solo con peso corporal hasta dominar el movimiento',
  ARRAY['romanian-deadlift']),

('curtsy-lunge', 'Curtsy Lunge', 'Zancada de reverencia', 'strength', 'lunge',
  ARRAY['glutes', 'quads', 'adductors'], 'glute_medius',
  ARRAY['dumbbell', 'bodyweight'], ARRAY['knees'], 'intermediate', 'compound',
  7, 6,
  'De pie, pies al ancho de caderas',
  'Da un paso diagonal hacia atrás cruzando por detrás de la pierna de apoyo, como una reverencia.',
  'Trabaja el glúteo medio de forma única',
  'Perder el equilibrio o no cruzar lo suficiente',
  'Excelente para estabilidad de cadera y glúteo medio',
  ARRAY['reverse-lunge', 'static-lunge']);

-- ============================================================================
-- EJERCICIOS ADICIONALES - UPPER BODY
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  goal_recomposition, goal_strength,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es,
  swap_alternatives
) VALUES
('incline-pushup', 'Incline Push-up', 'Flexiones inclinadas', 'strength', 'push_horizontal',
  ARRAY['chest', 'triceps', 'shoulders'], 'chest',
  ARRAY['bench', 'bodyweight'], ARRAY['wrists'], 'beginner', 'compound',
  6, 6,
  'Manos en banco o superficie elevada, cuerpo en línea recta',
  'Baja el pecho hacia el banco, codos a 45°. Empuja hacia arriba.',
  'Más fácil que flexiones normales pero mismo patrón',
  'Subir las caderas o bajar la cabeza',
  'Progresión perfecta hacia flexiones completas',
  ARRAY['knee-pushup', 'pushup']),

('diamond-pushup', 'Diamond Push-up', 'Flexiones diamante', 'strength', 'push_horizontal',
  ARRAY['triceps', 'chest', 'shoulders'], 'triceps',
  ARRAY['bodyweight'], ARRAY['wrists', 'elbows'], 'intermediate', 'compound',
  6, 7,
  'Manos juntas formando un diamante bajo el pecho, cuerpo en línea',
  'Baja el pecho hacia las manos, codos pegados al cuerpo. Empuja arriba.',
  'Más énfasis en TRÍCEPS que flexiones normales',
  'Abrir los codos hacia afuera',
  'Si molestan las muñecas, hazlo con manos en mancuernas',
  ARRAY['pushup', 'overhead-tricep-extension']),

('pike-pushup', 'Pike Push-up', 'Flexiones pike', 'strength', 'push_vertical',
  ARRAY['shoulders', 'triceps', 'core'], 'shoulders',
  ARRAY['bodyweight'], ARRAY['shoulders', 'wrists'], 'intermediate', 'compound',
  7, 7,
  'Forma de V invertida: manos y pies en suelo, cadera alta hacia el techo',
  'Baja la cabeza hacia el suelo flexionando los codos. Empuja arriba.',
  'Trabaja HOMBROS principalmente - preparación para verticales',
  'No subir suficiente la cadera o dejar caer la cabeza',
  'Empieza con rango de movimiento pequeño',
  ARRAY['arnold-press']),

('face-pull', 'Face Pull', 'Face Pull', 'strength', 'pull_horizontal',
  ARRAY['rear_delts', 'rhomboids', 'rotator_cuff'], 'rear_delts',
  ARRAY['band', 'cable_machine'], ARRAY['shoulders'], 'beginner', 'accessory',
  6, 5,
  'Banda a la altura de la cara, agarre con palmas hacia abajo',
  'Tira hacia la cara separando las manos, codos altos. Aprieta omóplatos.',
  'ESENCIAL para salud del hombro y postura',
  'Tirar muy bajo o no separar las manos',
  'Usa banda ligera - el objetivo es activar, no fatigar',
  ARRAY['reverse-fly']),

('reverse-fly', 'Reverse Fly', 'Aperturas inversas', 'strength', 'pull_horizontal',
  ARRAY['rear_delts', 'rhomboids'], 'rear_delts',
  ARRAY['dumbbell', 'band'], ARRAY['shoulders'], 'beginner', 'accessory',
  5, 5,
  'Inclinada hacia adelante 45-60°, mancuernas colgando, palmas mirándose',
  'Abre los brazos hacia los lados manteniendo los codos semiflexionados. Baja controlado.',
  'Peso LIGERO - siente la contracción en la espalda alta',
  'Usar momentum o peso demasiado pesado',
  'Excelente para postura y equilibrar todo el press que hacemos',
  ARRAY['face-pull']),

('arnold-press', 'Arnold Press', 'Press Arnold', 'strength', 'shoulder',
  ARRAY['shoulders', 'triceps'], 'shoulders',
  ARRAY['dumbbell'], ARRAY['shoulders'], 'intermediate', 'compound',
  7, 7,
  'Sentada, mancuernas a la altura del pecho con palmas hacia ti',
  'Rota y presiona hacia arriba en un solo movimiento fluido. Invierte al bajar.',
  'Rotación + press = trabajo completo del hombro',
  'Hacer el movimiento muy rápido o con peso excesivo',
  'Usa peso moderado - el movimiento ya es complejo',
  ARRAY['seated-lateral-raise']),

('lateral-raise-standing', 'Standing Lateral Raise', 'Elevaciones laterales de pie', 'strength', 'shoulder',
  ARRAY['shoulders', 'deltoids'], 'lateral_deltoid',
  ARRAY['dumbbell'], ARRAY['shoulders', 'neck'], 'beginner', 'accessory',
  5, 5,
  'De pie, mancuernas a los lados, ligera flexión de codos',
  'Sube los brazos hasta la altura del hombro. Baja controlado.',
  'Hombros ABAJO, no encogidos. Peso ligero siempre.',
  'Balancear el cuerpo o encoger los hombros',
  'Variación de pie de las elevaciones sentada',
  ARRAY['seated-lateral-raise']),

('front-raise', 'Front Raise', 'Elevaciones frontales', 'strength', 'shoulder',
  ARRAY['shoulders', 'deltoids'], 'front_deltoid',
  ARRAY['dumbbell'], ARRAY['shoulders'], 'beginner', 'accessory',
  5, 5,
  'De pie, mancuernas al frente de los muslos, brazos semi extendidos',
  'Sube un brazo al frente hasta altura del hombro. Alterna o ambos a la vez.',
  'Controla el peso - nada de balanceo',
  'Arquear la espalda o usar momentum',
  'Trabaja el deltoides anterior - complementa las laterales',
  ARRAY['lateral-raise-standing']),

('concentration-curl', 'Concentration Curl', 'Curl concentrado', 'strength', 'arm_biceps',
  ARRAY['biceps'], 'biceps',
  ARRAY['dumbbell'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  5, 5,
  'Sentada, codo apoyado en el interior del muslo, mancuerna colgando',
  'Flexiona el codo subiendo la mancuerna hacia el hombro. Baja controlado.',
  'El codo NO se mueve de su posición',
  'Mover el codo o balancear',
  'Aísla perfectamente el bíceps',
  ARRAY['hammer-curl']),

('tricep-dip-bench', 'Bench Tricep Dip', 'Fondos de tríceps en banco', 'strength', 'arm_triceps',
  ARRAY['triceps', 'chest', 'shoulders'], 'triceps',
  ARRAY['bench', 'bodyweight'], ARRAY['shoulders', 'wrists'], 'beginner', 'compound',
  6, 6,
  'Manos en el borde del banco detrás de ti, pies adelante, glúteos cerca del banco',
  'Baja flexionando los codos hasta 90°. Empuja hacia arriba.',
  'Codos hacia ATRÁS, no hacia los lados',
  'Abrir los codos o bajar los hombros',
  'Piernas más estiradas = más difícil',
  ARRAY['overhead-tricep-extension']);

-- ============================================================================
-- EJERCICIOS ADICIONALES - CORE
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es
) VALUES
('mountain-climber', 'Mountain Climber', 'Escaladores', 'strength', 'core',
  ARRAY['core', 'hip_flexors', 'shoulders'], 'core',
  ARRAY['bodyweight'], ARRAY['wrists', 'lower_back'], 'intermediate', 'accessory',
  'En posición de plancha alta, manos bajo hombros',
  'Lleva las rodillas alternadamente hacia el pecho de forma rápida pero controlada.',
  'Cadera BAJA - no subas el trasero',
  'Subir las caderas o perder el control',
  'Para versión más suave, hazlo lento y controlado'),

('side-plank', 'Side Plank', 'Plancha lateral', 'strength', 'core',
  ARRAY['obliques', 'core', 'shoulders'], 'obliques',
  ARRAY['bodyweight'], ARRAY['shoulders'], 'intermediate', 'accessory',
  'De lado, antebrazo apoyado, codo bajo el hombro, cuerpo en línea',
  'Eleva la cadera formando línea recta de cabeza a pies. Mantén.',
  'Cadera ARRIBA - no la dejes caer',
  'Dejar caer la cadera o rotar hacia adelante',
  'Empieza con rodilla de apoyo en el suelo si es necesario'),

('russian-twist', 'Russian Twist', 'Giro ruso', 'strength', 'core',
  ARRAY['obliques', 'core'], 'obliques',
  ARRAY['bodyweight', 'dumbbell'], ARRAY['lower_back'], 'intermediate', 'accessory',
  'Sentada, rodillas flexionadas, pies elevados o apoyados, torso inclinado atrás',
  'Gira el torso de lado a lado llevando las manos (o peso) hacia cada lado.',
  'El movimiento es de la CINTURA, no de los brazos',
  'Redondear la espalda o mover solo los brazos',
  'Mantén el pecho abierto durante todo el movimiento'),

('bicycle-crunch', 'Bicycle Crunch', 'Crunch bicicleta', 'strength', 'core',
  ARRAY['obliques', 'core', 'hip_flexors'], 'obliques',
  ARRAY['bodyweight'], ARRAY['neck', 'lower_back'], 'intermediate', 'accessory',
  'Tumbada, manos detrás de la cabeza (sin tirar), piernas elevadas',
  'Lleva codo hacia rodilla contraria mientras extiendes la otra pierna. Alterna.',
  'ROTA el torso - no solo mueves el codo',
  'Tirar del cuello o hacer el movimiento muy rápido',
  'Movimiento controlado, siente la rotación'),

('leg-raise', 'Leg Raise', 'Elevación de piernas', 'strength', 'core',
  ARRAY['core', 'hip_flexors'], 'lower_abs',
  ARRAY['bodyweight'], ARRAY['lower_back'], 'intermediate', 'accessory',
  'Tumbada boca arriba, manos bajo los glúteos o a los lados, piernas rectas',
  'Eleva las piernas juntas hasta 90°. Baja controlado sin tocar el suelo.',
  'La espalda baja SIEMPRE pegada al suelo',
  'Arquear la espalda al bajar las piernas',
  'Flexiona las rodillas si necesitas modificar'),

('hollow-body-hold', 'Hollow Body Hold', 'Hollow body', 'strength', 'core',
  ARRAY['core'], 'core',
  ARRAY['bodyweight'], ARRAY['lower_back'], 'intermediate', 'accessory',
  'Tumbada, brazos sobre la cabeza, piernas juntas y rectas',
  'Eleva hombros y piernas del suelo formando una "banana". Mantén.',
  'Espalda baja PEGADA al suelo - si se despega, sube las piernas',
  'Arquear la espalda',
  'Regresión: rodillas flexionadas y/o brazos a los lados'),

('pallof-press', 'Pallof Press', 'Pallof Press', 'strength', 'core',
  ARRAY['core', 'obliques'], 'core',
  ARRAY['band', 'cable_machine'], ARRAY[]::TEXT[], 'beginner', 'accessory',
  'De pie de lado a la banda/polea, banda a la altura del pecho, ambas manos juntas',
  'Extiende los brazos al frente resistiendo la rotación. Mantén 2s. Regresa.',
  'Anti-rotación: NO dejes que la banda te gire',
  'Rotar el torso o inclinarse',
  'Excelente para core funcional y estabilidad');

-- ============================================================================
-- EJERCICIOS ADICIONALES - CARDIO/FUNCIONAL
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, affects_pain_zones, difficulty, exercise_order,
  card_position_es, card_movement_es, card_key_cue_es, card_common_mistake_es, card_safety_tip_es
) VALUES
('jumping-jack', 'Jumping Jack', 'Jumping Jacks', 'cardio', 'warmup',
  ARRAY['full_body'], 'cardio',
  ARRAY['bodyweight'], ARRAY['knees'], 'beginner', 'warmup',
  'De pie, pies juntos, brazos a los lados',
  'Salta abriendo piernas y brazos al mismo tiempo. Salta para volver.',
  'Aterriza suave, con las rodillas semiflexionadas',
  'Aterrizar con las rodillas bloqueadas',
  'Versión de bajo impacto: da un paso lateral en vez de saltar'),

('high-knees', 'High Knees', 'Rodillas altas', 'cardio', 'warmup',
  ARRAY['core', 'hip_flexors', 'quads'], 'hip_flexors',
  ARRAY['bodyweight'], ARRAY['knees'], 'beginner', 'warmup',
  'De pie, brazos a los lados listos para moverse',
  'Corre en el sitio llevando las rodillas al nivel de la cadera alternadamente.',
  'Rodillas ARRIBA - no es trotar, es llevarlas altas',
  'No subir las rodillas lo suficiente',
  'Versión de bajo impacto: marcha en el sitio'),

('butt-kicks', 'Butt Kicks', 'Patadas al glúteo', 'cardio', 'warmup',
  ARRAY['hamstrings', 'quads'], 'hamstrings',
  ARRAY['bodyweight'], ARRAY[]::TEXT[], 'beginner', 'warmup',
  'De pie, brazos a los lados',
  'Corre en el sitio llevando los talones hacia los glúteos alternadamente.',
  'Talones tocan (o casi) los glúteos',
  'Inclinarse hacia adelante',
  'Mantén el torso erguido'),

('squat-jump', 'Squat Jump', 'Sentadilla con salto', 'cardio', 'squat',
  ARRAY['quads', 'glutes', 'calves'], 'quads',
  ARRAY['bodyweight'], ARRAY['knees', 'lower_back'], 'intermediate', 'compound',
  'Pies al ancho de hombros, brazos preparados',
  'Baja en sentadilla y explota hacia arriba en un salto. Aterriza suave y repite.',
  'Aterriza SUAVE con rodillas flexionadas',
  'Aterrizar con las piernas rígidas',
  'Alto impacto - evitar si hay problemas de rodillas'),

('box-jump-step-down', 'Box Jump Step Down', 'Salto al cajón', 'cardio', 'squat',
  ARRAY['quads', 'glutes', 'calves'], 'quads',
  ARRAY['bench', 'box'], ARRAY['knees'], 'intermediate', 'compound',
  'Frente a un cajón estable a la altura adecuada',
  'Salta al cajón aterrizando suave. BAJA CAMINANDO (no saltes hacia abajo).',
  'Aterriza con ambos pies al mismo tiempo, BAJA caminando',
  'Saltar hacia abajo (muy estresante para articulaciones)',
  'El cajón debe ser estable. Empieza bajo.'),

('burpee-modified', 'Modified Burpee', 'Burpee modificado', 'cardio', 'core',
  ARRAY['full_body'], 'full_body',
  ARRAY['bodyweight'], ARRAY['wrists', 'lower_back', 'knees'], 'intermediate', 'compound',
  'De pie, pies al ancho de caderas',
  'Sentadilla → manos al suelo → da un paso atrás a plancha → paso adelante → sube (sin salto).',
  'Sin salto, sin caer al suelo. Control siempre.',
  'Colapsar en el suelo o hacer el movimiento descontrolado',
  'Versión segura del burpee tradicional'),

('skater', 'Skater', 'Patinadores', 'cardio', 'lunge',
  ARRAY['glutes', 'quads', 'adductors'], 'glutes',
  ARRAY['bodyweight'], ARRAY['knees'], 'intermediate', 'compound',
  'De pie sobre una pierna',
  'Salta lateralmente aterrizando en la otra pierna, llevando la pierna libre por detrás.',
  'Aterriza suave, controla el equilibrio antes del siguiente salto',
  'Aterrizar con la rodilla colapsada hacia dentro',
  'Versión de bajo impacto: da un paso lateral grande'),

('inchworm', 'Inchworm', 'Gusano', 'mobility', 'core',
  ARRAY['hamstrings', 'core', 'shoulders'], 'core',
  ARRAY['bodyweight'], ARRAY['wrists'], 'beginner', 'warmup',
  'De pie, pies juntos',
  'Inclínate hacia adelante → camina con las manos hasta plancha → camina con los pies hacia las manos → sube.',
  'Piernas lo más rectas posible al caminar hacia las manos',
  'Flexionar demasiado las rodillas',
  'Excelente calentamiento dinámico');

-- ============================================================================
-- EJERCICIOS ADICIONALES - MOVILIDAD/ESTIRAMIENTOS
-- ============================================================================

INSERT INTO exercises (
  slug, name_en, name_es, type, pattern, muscle_groups, primary_muscle,
  equipment_required, difficulty, exercise_order,
  card_movement_es, card_key_cue_es
) VALUES
('worlds-greatest-stretch', 'World''s Greatest Stretch', 'El mejor estiramiento del mundo', 'mobility', 'mobility',
  ARRAY['hip_flexors', 'hamstrings', 'thoracic_spine'], 'hip_flexors', ARRAY['bodyweight'], 'beginner', 'warmup',
  'Zancada profunda → codo hacia el suelo dentro del pie → rota abriendo el brazo hacia el techo. Alterna.',
  'Combina flexor de cadera, rotación torácica y aductores. TODO en uno.'),

('90-90-stretch', '90-90 Stretch', 'Estiramiento 90-90', 'mobility', 'mobility',
  ARRAY['glutes', 'hips'], 'glutes', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Sentada, pierna delantera a 90° frente a ti, pierna trasera a 90° hacia el lado.',
  'Mantén la espalda recta e inclínate suavemente hacia adelante. 30s cada lado.'),

('pigeon-pose', 'Pigeon Pose', 'Postura de la paloma', 'mobility', 'mobility',
  ARRAY['glutes', 'hip_flexors'], 'glutes', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Una pierna flexionada al frente, la otra estirada hacia atrás, torso erguido o inclinado.',
  'Estiramiento profundo de glúteo. Respira y relaja. 30-60s cada lado.'),

('quad-stretch-standing', 'Standing Quad Stretch', 'Estiramiento de cuádriceps de pie', 'mobility', 'mobility',
  ARRAY['quads', 'hip_flexors'], 'quads', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'De pie, lleva un talón hacia el glúteo sujetando el tobillo. Rodillas juntas.',
  'Aprieta el glúteo para intensificar. Apóyate en algo si necesitas equilibrio.'),

('shoulder-stretch-cross', 'Cross Body Shoulder Stretch', 'Estiramiento de hombro cruzado', 'mobility', 'mobility',
  ARRAY['shoulders', 'rear_delts'], 'shoulders', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Lleva un brazo recto al frente del cuerpo, usa la otra mano para presionar suavemente hacia ti.',
  '30 segundos cada lado. Siente el estiramiento en la parte trasera del hombro.'),

('tricep-stretch', 'Tricep Stretch', 'Estiramiento de tríceps', 'mobility', 'mobility',
  ARRAY['triceps', 'shoulders'], 'triceps', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Lleva una mano detrás de la cabeza hacia la espalda. Usa la otra mano para empujar el codo.',
  '30 segundos cada lado.'),

('neck-stretch', 'Neck Stretch', 'Estiramiento de cuello', 'mobility', 'mobility',
  ARRAY['neck', 'traps'], 'neck', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Inclina la cabeza hacia un lado, oreja hacia hombro. Puedes usar la mano para presionar suavemente.',
  'NUNCA fuerces. Movimientos suaves. 20s cada lado.'),

('seated-forward-fold', 'Seated Forward Fold', 'Flexión sentada hacia adelante', 'mobility', 'mobility',
  ARRAY['hamstrings', 'lower_back'], 'hamstrings', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Sentada con piernas rectas al frente, inclínate hacia adelante desde las caderas.',
  'Estira la espalda, no la redondees. Siente los isquios. 30-60s.'),

('butterfly-stretch', 'Butterfly Stretch', 'Estiramiento mariposa', 'mobility', 'mobility',
  ARRAY['adductors', 'hips'], 'adductors', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Sentada, plantas de los pies juntas, rodillas hacia los lados. Presiona suavemente las rodillas.',
  'Espalda recta. Deja que la gravedad haga el trabajo. 30-60s.'),

('supine-twist', 'Supine Twist', 'Torsión supina', 'mobility', 'mobility',
  ARRAY['lower_back', 'glutes', 'obliques'], 'lower_back', ARRAY['bodyweight'], 'beginner', 'cooldown',
  'Tumbada boca arriba, lleva una rodilla al pecho y crúzala hacia el lado contrario. Brazos en T.',
  'Los hombros permanecen en el suelo. Gira la cabeza al lado contrario. 30s cada lado.');

-- ============================================================================
-- VERIFICAR
-- ============================================================================

SELECT
  type,
  COUNT(*) as count
FROM exercises
GROUP BY type
ORDER BY type;

SELECT COUNT(*) as total_exercises FROM exercises;

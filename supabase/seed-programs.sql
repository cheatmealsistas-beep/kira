-- Seed: Training Programs
-- Programa inicial para 3 días/semana - Principiante/Intermedio

-- ============================================================================
-- LIMPIAR DATOS ANTERIORES
-- ============================================================================
DELETE FROM program_exercises;
DELETE FROM program_sessions;
DELETE FROM training_programs;

-- ============================================================================
-- PROGRAMA: Fuerza Funcional 3 Días (Principiante)
-- ============================================================================
INSERT INTO training_programs (slug, name, description, days_per_week, duration_weeks, level, goal, progression_type)
VALUES (
  'strength_3days_beginner',
  '{"en": "Functional Strength 3 Days", "es": "Fuerza Funcional 3 Días"}',
  '{"en": "Build a solid strength foundation with 3 weekly sessions", "es": "Construye una base sólida de fuerza con 3 sesiones semanales"}',
  3,
  8,
  'beginner',
  'strength',
  'double'
);

-- Obtener ID del programa e insertar sesiones y ejercicios
DO $$
DECLARE
  program_uuid UUID;
  session_a_uuid UUID;
  session_b_uuid UUID;
  session_c_uuid UUID;
BEGIN
  -- Obtener programa
  SELECT id INTO program_uuid FROM training_programs WHERE slug = 'strength_3days_beginner';

  -- ============================================================================
  -- SESIÓN A: Tren Inferior (Pierna + Glúteo) - ~40 min
  -- ============================================================================
  INSERT INTO program_sessions (program_id, session_order, name, session_type, estimated_duration)
  VALUES (program_uuid, 1, '{"en": "Day A - Lower Body", "es": "Día A - Tren Inferior"}', 'legs', 40)
  RETURNING id INTO session_a_uuid;

  -- Ejercicios Sesión A (slugs correctos con guiones)
  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_a_uuid, 'goblet-squat', 1, 3, 8, 12, 90,
    '{"en": "Focus on depth and keeping chest up", "es": "Enfócate en la profundidad y mantén el pecho arriba"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'goblet-squat');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_a_uuid, 'romanian-deadlift', 2, 3, 8, 12, 90,
    '{"en": "Feel the stretch in hamstrings", "es": "Siente el estiramiento en isquios"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'romanian-deadlift');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_a_uuid, 'hip-thrust-dumbbell', 3, 3, 10, 15, 60,
    '{"en": "Squeeze glutes at the top", "es": "Aprieta glúteos arriba"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'hip-thrust-dumbbell');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_a_uuid, 'static-lunge', 4, 3, 8, 12, 60,
    '{"en": "8-12 reps per leg", "es": "8-12 reps por pierna"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'static-lunge');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, progression_type)
  SELECT session_a_uuid, 'calf-raise', 5, 3, 12, 20, 45, 'linear_reps'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'calf-raise');

  -- ============================================================================
  -- SESIÓN B: Tren Superior (Push + Pull) - ~40 min
  -- ============================================================================
  INSERT INTO program_sessions (program_id, session_order, name, session_type, estimated_duration)
  VALUES (program_uuid, 2, '{"en": "Day B - Upper Body", "es": "Día B - Tren Superior"}', 'upper', 40)
  RETURNING id INTO session_b_uuid;

  -- Ejercicios Sesión B
  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_b_uuid, 'neutral-grip-chest-press', 1, 3, 8, 12, 90,
    '{"en": "Palms facing - shoulder friendly", "es": "Palmas mirándose - amable con hombros"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'neutral-grip-chest-press');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_b_uuid, 'single-arm-row', 2, 3, 8, 12, 90,
    '{"en": "Pull with elbow, not hand", "es": "Tira con el codo, no con la mano"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'single-arm-row');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds)
  SELECT session_b_uuid, 'seated-lateral-raise', 3, 3, 10, 15, 60
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'seated-lateral-raise');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, progression_type)
  SELECT session_b_uuid, 'hammer-curl', 4, 3, 10, 15, 60, 'linear_reps'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'hammer-curl');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, progression_type)
  SELECT session_b_uuid, 'overhead-tricep-extension', 5, 3, 10, 15, 60, 'linear_reps'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'overhead-tricep-extension');

  -- ============================================================================
  -- SESIÓN C: Full Body - ~45 min
  -- ============================================================================
  INSERT INTO program_sessions (program_id, session_order, name, session_type, estimated_duration)
  VALUES (program_uuid, 3, '{"en": "Day C - Full Body", "es": "Día C - Full Body"}', 'full_body', 45)
  RETURNING id INTO session_c_uuid;

  -- Ejercicios Sesión C
  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, notes)
  SELECT session_c_uuid, 'sumo-deadlift', 1, 3, 8, 12, 120,
    '{"en": "Main compound lift - take your time", "es": "Ejercicio principal - tómate tu tiempo"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'sumo-deadlift');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds)
  SELECT session_c_uuid, 'sumo-squat', 2, 3, 10, 15, 90
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'sumo-squat');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds)
  SELECT session_c_uuid, 'bent-over-row', 3, 3, 8, 12, 90
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'bent-over-row');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds)
  SELECT session_c_uuid, 'dumbbell-pullover', 4, 3, 10, 15, 60
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'dumbbell-pullover');

  INSERT INTO program_exercises (session_id, exercise_slug, exercise_order, sets, min_reps, max_reps, rest_seconds, progression_type, notes)
  SELECT session_c_uuid, 'plank', 5, 3, 30, 60, 45, 'none',
    '{"en": "Hold for 30-60 seconds", "es": "Mantén 30-60 segundos"}'
  WHERE EXISTS (SELECT 1 FROM exercises WHERE slug = 'plank');

END $$;

-- ============================================================================
-- PROGRAMA: Torso/Pierna 4 Días (Intermedio)
-- ============================================================================
INSERT INTO training_programs (slug, name, description, days_per_week, duration_weeks, level, goal, progression_type)
VALUES (
  'strength_4days_intermediate',
  '{"en": "Upper/Lower Split 4 Days", "es": "Torso/Pierna 4 Días"}',
  '{"en": "Classic upper/lower split for intermediate lifters", "es": "Split clásico torso/pierna para nivel intermedio"}',
  4,
  8,
  'intermediate',
  'strength',
  'double'
);

-- ============================================================================
-- Verificar inserción
-- ============================================================================
SELECT p.slug, p.name->>'es' as nombre,
       COUNT(DISTINCT ps.id) as sesiones,
       COUNT(pe.id) as ejercicios_total
FROM training_programs p
LEFT JOIN program_sessions ps ON ps.program_id = p.id
LEFT JOIN program_exercises pe ON pe.session_id = ps.id
GROUP BY p.id;

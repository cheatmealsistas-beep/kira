-- Migration: Kira exercises catalog
-- Description: Static exercise catalog with metadata for workout generation

-- Tabla exercises (catálogo de ejercicios)
CREATE TABLE exercises (
  slug TEXT PRIMARY KEY, -- 'goblet-squat', 'hip-hinge', etc.

  -- Nombres
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,

  -- Clasificación
  type TEXT NOT NULL CHECK (type IN ('strength', 'warmup', 'mobility', 'cardio')),
  pattern TEXT NOT NULL CHECK (
    pattern IN ('squat', 'hinge', 'lunge', 'push_horizontal', 'push_vertical',
                'pull_horizontal', 'pull_vertical', 'carry', 'core', 'shoulder',
                'arm_biceps', 'arm_triceps', 'warmup', 'mobility')
  ),

  -- Músculos
  muscle_groups TEXT[] NOT NULL,
  primary_muscle TEXT NOT NULL,

  -- Equipamiento
  equipment_required TEXT[] DEFAULT '{}',

  -- Zonas de dolor que afecta
  affects_pain_zones TEXT[] DEFAULT '{}',

  -- Puntuación por objetivo (1-10)
  goal_recomposition INTEGER DEFAULT 5 CHECK (goal_recomposition BETWEEN 1 AND 10),
  goal_strength INTEGER DEFAULT 5 CHECK (goal_strength BETWEEN 1 AND 10),
  goal_endurance INTEGER DEFAULT 5 CHECK (goal_endurance BETWEEN 1 AND 10),
  goal_flexibility INTEGER DEFAULT 5 CHECK (goal_flexibility BETWEEN 1 AND 10),

  -- Orden en la rutina
  exercise_order TEXT DEFAULT 'accessory' CHECK (
    exercise_order IN ('warmup', 'compound_first', 'compound', 'accessory', 'finisher', 'cooldown')
  ),

  -- Dificultad
  difficulty TEXT DEFAULT 'beginner' CHECK (
    difficulty IN ('beginner', 'intermediate', 'advanced')
  ),

  -- Card de ejercicio (instrucciones)
  card_position_en TEXT,
  card_position_es TEXT,
  card_grip_en TEXT,
  card_grip_es TEXT,
  card_movement_en TEXT,
  card_movement_es TEXT,
  card_target_muscles_en TEXT,
  card_target_muscles_es TEXT,
  card_key_cue_en TEXT,
  card_key_cue_es TEXT,
  card_common_mistake_en TEXT,
  card_common_mistake_es TEXT,
  card_safety_tip_en TEXT,
  card_safety_tip_es TEXT,

  -- Alternativas para swap
  swap_alternatives TEXT[] DEFAULT '{}',

  -- Video/imagen URL (futuro)
  video_url TEXT,
  image_url TEXT,

  -- Activo en el catálogo
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercises_pattern ON exercises(pattern);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment_required);
CREATE INDEX idx_exercises_pain_zones ON exercises USING GIN(affects_pain_zones);
CREATE INDEX idx_exercises_active ON exercises(is_active);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (todos pueden leer, solo service_role puede escribir)
CREATE POLICY "Anyone can view active exercises" ON exercises
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role full access exercises" ON exercises
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger para updated_at
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE exercises IS 'Static exercise catalog for Kira workout generation';
COMMENT ON COLUMN exercises.slug IS 'Unique identifier: goblet-squat, romanian-deadlift, etc.';
COMMENT ON COLUMN exercises.pattern IS 'Movement pattern for balanced programming';
COMMENT ON COLUMN exercises.exercise_order IS 'Where exercise fits in workout: warmup → compound_first → compound → accessory → finisher → cooldown';
COMMENT ON COLUMN exercises.swap_alternatives IS 'Array of exercise slugs that can substitute this one';

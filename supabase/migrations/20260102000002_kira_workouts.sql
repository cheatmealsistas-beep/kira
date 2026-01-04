-- Migration: Kira workouts
-- Description: Stores generated workouts and their exercises

-- Tabla workouts (rutinas generadas)
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Metadata de la rutina
  name TEXT NOT NULL, -- "Día 1 - Full Body", "Upper A", etc.
  workout_type TEXT NOT NULL CHECK (
    workout_type IN ('full_body', 'upper', 'lower', 'push', 'pull', 'legs')
  ),

  -- Orden en la semana (1-7)
  day_order INTEGER NOT NULL CHECK (day_order BETWEEN 1 AND 7),

  -- Duración estimada (minutos)
  estimated_duration INTEGER NOT NULL,

  -- Fecha programada (nullable - puede ser template sin fecha)
  scheduled_for DATE,

  -- Estado
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'completed', 'skipped')
  ),

  -- Si fue completada
  completed_at TIMESTAMPTZ,

  -- Metadata adicional (energía usada, notas, etc.)
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla workout_exercises (ejercicios dentro de una rutina)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,

  -- Referencia al ejercicio (slug del catálogo)
  exercise_slug TEXT NOT NULL,

  -- Orden en la rutina
  exercise_order INTEGER NOT NULL,

  -- Prescripción del ejercicio
  sets INTEGER NOT NULL DEFAULT 3,
  reps_min INTEGER, -- Para rangos: 8-12
  reps_max INTEGER,
  reps_target INTEGER, -- Para objetivo fijo: 10
  duration_seconds INTEGER, -- Para ejercicios por tiempo (plancha, etc.)
  rest_seconds INTEGER DEFAULT 60,

  -- Intensidad sugerida (RPE o % del max)
  intensity_rpe INTEGER CHECK (intensity_rpe BETWEEN 1 AND 10),

  -- Notas/cues para este ejercicio en esta rutina
  notes TEXT,

  -- Si fue completado
  completed BOOLEAN DEFAULT false,

  -- Datos reales logrados (para tracking de progreso)
  actual_sets INTEGER,
  actual_reps INTEGER[], -- Array con reps por set: [10, 10, 8]
  actual_weight DECIMAL(5,2), -- Peso usado

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices workouts
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_scheduled_for ON workouts(scheduled_for);
CREATE INDEX idx_workouts_status ON workouts(status);
CREATE INDEX idx_workouts_user_scheduled ON workouts(user_id, scheduled_for);

-- Índices workout_exercises
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_slug ON workout_exercises(exercise_slug);

-- Enable Row Level Security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Políticas RLS workouts
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS workout_exercises (heredan del workout)
CREATE POLICY "Users can view own workout exercises" ON workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises" ON workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises" ON workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises" ON workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM workouts w
      WHERE w.id = workout_exercises.workout_id
      AND w.user_id = auth.uid()
    )
  );

-- Service role acceso completo
CREATE POLICY "Service role full access workouts" ON workouts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access workout_exercises" ON workout_exercises
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger para updated_at
CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE workouts IS 'Generated workout routines for users';
COMMENT ON TABLE workout_exercises IS 'Exercises within a workout with prescription and tracking';
COMMENT ON COLUMN workout_exercises.actual_reps IS 'Array of reps achieved per set: [10, 10, 8]';
COMMENT ON COLUMN workout_exercises.intensity_rpe IS 'Rate of Perceived Exertion: 1-10 scale';

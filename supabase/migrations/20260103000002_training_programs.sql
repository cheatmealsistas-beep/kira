-- Migration: Training Programs with Progression System
-- Description: Structured training programs with intelligent progression

-- ============================================================================
-- TABLA: training_programs (Programas de entrenamiento predefinidos)
-- ============================================================================
CREATE TABLE training_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identificación
  slug TEXT UNIQUE NOT NULL,  -- 'strength_3days_beginner', 'upper_lower_4days', etc.
  name JSONB NOT NULL,  -- {"en": "Strength Builder", "es": "Constructor de Fuerza"}
  description JSONB,

  -- Configuración
  days_per_week INTEGER NOT NULL CHECK (days_per_week BETWEEN 2 AND 6),
  duration_weeks INTEGER NOT NULL DEFAULT 8,  -- Duración del programa en semanas
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  goal TEXT NOT NULL CHECK (goal IN ('strength', 'recomposition', 'endurance', 'general')),

  -- Tipo de progresión por defecto
  progression_type TEXT NOT NULL DEFAULT 'double' CHECK (
    progression_type IN ('double', 'linear_reps', 'linear_weight', 'pyramid')
  ),

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- TABLA: program_sessions (Sesiones/días del programa)
-- ============================================================================
CREATE TABLE program_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE NOT NULL,

  -- Identificación de la sesión
  session_order INTEGER NOT NULL,  -- 1, 2, 3... (orden en la semana)
  name JSONB NOT NULL,  -- {"en": "Day A - Lower", "es": "Día A - Tren Inferior"}
  session_type TEXT NOT NULL CHECK (
    session_type IN ('legs', 'upper', 'push', 'pull', 'full_body')
  ),

  -- Configuración
  estimated_duration INTEGER DEFAULT 45,  -- minutos

  UNIQUE(program_id, session_order)
);

-- ============================================================================
-- TABLA: program_exercises (Ejercicios de cada sesión con config de progresión)
-- ============================================================================
CREATE TABLE program_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES program_sessions(id) ON DELETE CASCADE NOT NULL,
  exercise_slug TEXT REFERENCES exercises(slug) ON DELETE CASCADE NOT NULL,

  -- Orden en la sesión
  exercise_order INTEGER NOT NULL,

  -- Configuración de series/reps
  sets INTEGER NOT NULL DEFAULT 3,
  min_reps INTEGER NOT NULL DEFAULT 8,  -- Rango inferior
  max_reps INTEGER NOT NULL DEFAULT 12, -- Rango superior (para doble progresión)

  -- Descanso entre series (segundos)
  rest_seconds INTEGER DEFAULT 90,

  -- Tipo de progresión específica (override del programa)
  progression_type TEXT CHECK (
    progression_type IN ('double', 'linear_reps', 'linear_weight', 'pyramid', 'none')
  ),

  -- Para ejercicios piramidales: configuración de series
  -- Ej: [{"reps": 12, "intensity": 0.7}, {"reps": 10, "intensity": 0.8}, {"reps": 8, "intensity": 0.9}]
  pyramid_config JSONB,

  -- Notas/instrucciones especiales
  notes JSONB,  -- {"en": "Focus on depth", "es": "Enfócate en la profundidad"}

  UNIQUE(session_id, exercise_order)
);

-- ============================================================================
-- TABLA: user_programs (Programa activo del usuario)
-- ============================================================================
CREATE TABLE user_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE NOT NULL,

  -- Estado del programa
  started_at TIMESTAMPTZ DEFAULT now(),
  current_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ,

  -- Solo un programa activo por usuario
  UNIQUE(user_id, is_active) -- Partial unique cuando is_active = true
);

-- ============================================================================
-- TABLA: user_exercise_progress (Progreso por ejercicio)
-- ============================================================================
CREATE TABLE user_exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_slug TEXT REFERENCES exercises(slug) ON DELETE CASCADE NOT NULL,

  -- Peso actual de trabajo (en kg)
  current_weight DECIMAL(5,2) DEFAULT 0,

  -- Última sesión exitosa
  last_reps_completed INTEGER,  -- Reps conseguidas en última serie
  last_session_date DATE,

  -- Contadores para progresión
  consecutive_successes INTEGER DEFAULT 0,  -- Veces seguidas completando max_reps

  -- Historial resumido (últimas 4 sesiones)
  recent_history JSONB DEFAULT '[]',
  -- [{"date": "2026-01-03", "weight": 10, "reps": [12,12,10], "completed": false}]

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, exercise_slug)
);

-- ============================================================================
-- TABLA: exercise_logs (Logs detallados por ejercicio)
-- ============================================================================
CREATE TABLE exercise_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_slug TEXT REFERENCES exercises(slug) ON DELETE CASCADE NOT NULL,
  session_log_id UUID REFERENCES session_logs(id) ON DELETE SET NULL,

  -- Datos del ejercicio
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,  -- Reps de referencia (primera serie)
  weight DECIMAL(5,2) DEFAULT 0,
  reps_per_set INTEGER[] DEFAULT '{}',  -- [12, 12, 10] - reps por cada serie
  all_reps_completed BOOLEAN DEFAULT false,

  -- Feedback
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  energy_level TEXT CHECK (energy_level IN ('high', 'medium', 'low')),

  -- Timestamp
  logged_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para exercise_logs
CREATE INDEX idx_exercise_logs_user ON exercise_logs(user_id);
CREATE INDEX idx_exercise_logs_exercise ON exercise_logs(user_id, exercise_slug);
CREATE INDEX idx_exercise_logs_date ON exercise_logs(user_id, logged_at DESC);

-- RLS para exercise_logs
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own exercise logs" ON exercise_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role manages exercise logs" ON exercise_logs
  FOR ALL TO service_role USING (true);

-- ============================================================================
-- TABLA: workout_feedback (Feedback post-entrenamiento)
-- ============================================================================
CREATE TABLE workout_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES program_sessions(id) ON DELETE SET NULL,

  -- Cómo se sintió
  feeling TEXT NOT NULL CHECK (
    feeling IN ('exhausted', 'tired', 'good', 'strong', 'energized')
  ),

  -- Dificultad percibida (1-5, similar a RPE simplificado)
  -- 1: Muy fácil, podría hacer mucho más
  -- 2: Fácil, podría hacer más
  -- 3: Adecuado, bien equilibrado
  -- 4: Difícil, costó terminarlo
  -- 5: Muy difícil, casi no lo termino
  difficulty_rating INTEGER NOT NULL CHECK (difficulty_rating BETWEEN 1 AND 5),

  -- Nivel de energía al inicio
  energy_level TEXT CHECK (energy_level IN ('high', 'medium', 'low')),

  -- Notas opcionales
  notes TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
CREATE INDEX idx_program_sessions_program ON program_sessions(program_id);
CREATE INDEX idx_program_exercises_session ON program_exercises(session_id);
CREATE INDEX idx_user_programs_user ON user_programs(user_id);
CREATE INDEX idx_user_programs_active ON user_programs(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_exercise_progress_user ON user_exercise_progress(user_id);
CREATE INDEX idx_user_exercise_progress_exercise ON user_exercise_progress(user_id, exercise_slug);
CREATE INDEX idx_workout_feedback_user ON workout_feedback(user_id);
CREATE INDEX idx_workout_feedback_recent ON workout_feedback(user_id, created_at DESC);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_feedback ENABLE ROW LEVEL SECURITY;

-- Training programs (lectura pública, solo admins modifican)
CREATE POLICY "Anyone can view active programs" ON training_programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service role manages programs" ON training_programs
  FOR ALL TO service_role USING (true);

-- Program sessions (lectura pública)
CREATE POLICY "Anyone can view program sessions" ON program_sessions
  FOR SELECT USING (true);

CREATE POLICY "Service role manages sessions" ON program_sessions
  FOR ALL TO service_role USING (true);

-- Program exercises (lectura pública)
CREATE POLICY "Anyone can view program exercises" ON program_exercises
  FOR SELECT USING (true);

CREATE POLICY "Service role manages exercises" ON program_exercises
  FOR ALL TO service_role USING (true);

-- User programs (solo el usuario)
CREATE POLICY "Users manage own programs" ON user_programs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role manages user programs" ON user_programs
  FOR ALL TO service_role USING (true);

-- User exercise progress (solo el usuario)
CREATE POLICY "Users manage own progress" ON user_exercise_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role manages progress" ON user_exercise_progress
  FOR ALL TO service_role USING (true);

-- Workout feedback (solo el usuario)
CREATE POLICY "Users manage own feedback" ON workout_feedback
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role manages feedback" ON workout_feedback
  FOR ALL TO service_role USING (true);

-- ============================================================================
-- TRIGGER para updated_at
-- ============================================================================
CREATE TRIGGER update_user_exercise_progress_updated_at
  BEFORE UPDATE ON user_exercise_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMENTARIOS
-- ============================================================================
COMMENT ON TABLE training_programs IS 'Predefined training programs with progression systems';
COMMENT ON TABLE program_sessions IS 'Individual workout sessions within a program';
COMMENT ON TABLE program_exercises IS 'Exercises for each session with progression config';
COMMENT ON TABLE user_programs IS 'Active program assignment for each user';
COMMENT ON TABLE user_exercise_progress IS 'User progress tracking per exercise for intelligent progression';
COMMENT ON COLUMN user_exercise_progress.consecutive_successes IS 'Count of consecutive sessions where user completed all reps at max_reps - triggers weight increase';
COMMENT ON TABLE workout_feedback IS 'Post-workout feedback for intelligent training adjustment';
COMMENT ON COLUMN workout_feedback.feeling IS 'How the user felt: exhausted, tired, good, strong, energized';
COMMENT ON COLUMN workout_feedback.difficulty_rating IS 'Perceived difficulty 1-5 (1=very easy, 5=very hard)';

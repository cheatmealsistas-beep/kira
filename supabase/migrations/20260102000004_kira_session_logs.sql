-- Migration: Kira session logs
-- Description: Logs completed workout sessions with performance data

-- Tabla session_logs (registro de sesiones completadas)
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL, -- SET NULL para mantener log si workout se borra

  -- Fecha y duración real
  session_date DATE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  actual_duration INTEGER, -- minutos reales

  -- Energía al inicio de la sesión
  energy_level TEXT CHECK (
    energy_level IN ('very_low', 'low', 'normal', 'high', 'very_high')
  ),

  -- Feedback post-sesión
  perceived_difficulty INTEGER CHECK (perceived_difficulty BETWEEN 1 AND 5), -- 1=muy fácil, 5=muy difícil
  enjoyment INTEGER CHECK (enjoyment BETWEEN 1 AND 5), -- 1=no disfruté, 5=me encantó
  mood_after TEXT CHECK (
    mood_after IN ('worse', 'same', 'better', 'much_better')
  ),

  -- Ejercicios completados vs total
  exercises_completed INTEGER DEFAULT 0,
  exercises_total INTEGER DEFAULT 0,

  -- Volumen total (para tracking de progreso)
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,

  -- Notas de la sesión
  notes TEXT,

  -- Metadata (para analytics)
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_session_logs_user_id ON session_logs(user_id);
CREATE INDEX idx_session_logs_date ON session_logs(session_date);
CREATE INDEX idx_session_logs_user_date ON session_logs(user_id, session_date DESC);
CREATE INDEX idx_session_logs_workout_id ON session_logs(workout_id);

-- Enable Row Level Security
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own session logs" ON session_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session logs" ON session_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own session logs" ON session_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own session logs" ON session_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Service role acceso completo
CREATE POLICY "Service role full access session_logs" ON session_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Comentarios
COMMENT ON TABLE session_logs IS 'Completed workout session records with performance data';
COMMENT ON COLUMN session_logs.perceived_difficulty IS 'User rating: 1=very easy, 5=very hard';
COMMENT ON COLUMN session_logs.enjoyment IS 'User rating: 1=did not enjoy, 5=loved it';
COMMENT ON COLUMN session_logs.mood_after IS 'How user feels after: worse, same, better, much_better';

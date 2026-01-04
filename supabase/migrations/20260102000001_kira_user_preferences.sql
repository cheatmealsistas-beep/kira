-- Migration: Kira user preferences
-- Description: Stores user training preferences (goals, equipment, pain zones, schedule)

-- Tabla user_preferences (configuración de entrenamiento del usuario)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- Objetivos (puede tener múltiples, ordenados por prioridad)
  goals TEXT[] DEFAULT '{}' CHECK (
    goals <@ ARRAY['recomposition', 'strength', 'endurance', 'flexibility']::TEXT[]
  ),

  -- Equipamiento disponible
  equipment TEXT[] DEFAULT '{}' CHECK (
    equipment <@ ARRAY['bodyweight', 'dumbbell', 'barbell', 'kettlebell', 'bands', 'bench', 'pullup_bar', 'cable_machine', 'trx']::TEXT[]
  ),

  -- Zonas de dolor/limitación
  pain_zones TEXT[] DEFAULT '{}' CHECK (
    pain_zones <@ ARRAY['knees', 'lower_back', 'shoulders', 'wrists', 'neck', 'elbows', 'hips']::TEXT[]
  ),

  -- Días de entrenamiento por semana
  training_days_per_week INTEGER DEFAULT 3 CHECK (training_days_per_week BETWEEN 1 AND 7),

  -- Preferencia de duración (minutos)
  session_duration INTEGER DEFAULT 45 CHECK (session_duration BETWEEN 15 AND 90),

  -- Tipo de entrenamiento preferido
  workout_type TEXT DEFAULT 'full_body' CHECK (
    workout_type IN ('full_body', 'upper_lower', 'push_pull_legs')
  ),

  -- Nivel de experiencia
  experience_level TEXT DEFAULT 'beginner' CHECK (
    experience_level IN ('beginner', 'intermediate', 'advanced')
  ),

  -- Onboarding completado
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_goals ON user_preferences USING GIN(goals);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role acceso completo
CREATE POLICY "Service role full access user_preferences" ON user_preferences
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger para updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE user_preferences IS 'User training preferences for Kira workout generation';
COMMENT ON COLUMN user_preferences.goals IS 'Training goals ordered by priority: recomposition, strength, endurance, flexibility';
COMMENT ON COLUMN user_preferences.equipment IS 'Available equipment for home/gym workouts';
COMMENT ON COLUMN user_preferences.pain_zones IS 'Body areas with pain/limitations to avoid exercises';
COMMENT ON COLUMN user_preferences.workout_type IS 'Training split preference: full_body, upper_lower, push_pull_legs';

-- Migration: Fitness profiles for personalized training
-- Description: Stores user fitness preferences for workout personalization

-- Tabla fitness_profiles (preferencias de entrenamiento del usuario)
CREATE TABLE fitness_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Días de entrenamiento por semana (2-6)
  training_days_per_week INTEGER NOT NULL DEFAULT 3 CHECK (training_days_per_week BETWEEN 2 AND 6),

  -- Días preferidos (array de días: 0=domingo, 1=lunes, etc.)
  preferred_days INTEGER[] DEFAULT '{}',

  -- Objetivo principal
  primary_goal TEXT NOT NULL DEFAULT 'strength' CHECK (
    primary_goal IN ('strength', 'recomposition', 'endurance', 'flexibility', 'general')
  ),

  -- Limitaciones físicas (zonas de dolor/cuidado)
  limitations TEXT[] DEFAULT '{}',
  -- Valores posibles: 'knees', 'lower_back', 'shoulders', 'wrists', 'neck', 'hips', 'ankles'

  -- Equipamiento disponible
  available_equipment TEXT[] DEFAULT ARRAY['bodyweight'],
  -- Valores posibles: 'bodyweight', 'dumbbells', 'kettlebell', 'barbell', 'bench', 'bands', 'pull_up_bar', 'cable_machine'

  -- Nivel de experiencia
  experience_level TEXT NOT NULL DEFAULT 'beginner' CHECK (
    experience_level IN ('beginner', 'intermediate', 'advanced')
  ),

  -- Duración preferida de sesión (en minutos)
  preferred_duration INTEGER DEFAULT 30 CHECK (preferred_duration BETWEEN 15 AND 90),

  -- Tracking del ciclo menstrual (opcional)
  track_menstrual_cycle BOOLEAN DEFAULT false,
  cycle_day INTEGER CHECK (cycle_day IS NULL OR cycle_day BETWEEN 1 AND 35),
  cycle_length INTEGER DEFAULT 28 CHECK (cycle_length BETWEEN 21 AND 35),
  last_period_start DATE,

  -- Estado del onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla para el plan semanal generado
CREATE TABLE weekly_training_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Semana del plan (lunes de esa semana)
  week_start DATE NOT NULL,

  -- Plan para cada día (JSONB con estructura del workout)
  monday JSONB,    -- null = descanso, o {type: 'legs', name: 'Día de Pierna'}
  tuesday JSONB,
  wednesday JSONB,
  thursday JSONB,
  friday JSONB,
  saturday JSONB,
  sunday JSONB,

  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint: un plan por semana por usuario
  UNIQUE(user_id, week_start)
);

-- Índices
CREATE INDEX idx_fitness_profiles_user ON fitness_profiles(user_id);
CREATE INDEX idx_weekly_plans_user_week ON weekly_training_plans(user_id, week_start);

-- Enable Row Level Security
ALTER TABLE fitness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_training_plans ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para fitness_profiles
CREATE POLICY "Users can view own fitness profile" ON fitness_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own fitness profile" ON fitness_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fitness profile" ON fitness_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para weekly_training_plans
CREATE POLICY "Users can view own weekly plans" ON weekly_training_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own weekly plans" ON weekly_training_plans
  FOR ALL USING (auth.uid() = user_id);

-- Service role access
CREATE POLICY "Service role full access fitness_profiles" ON fitness_profiles
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access weekly_plans" ON weekly_training_plans
  FOR ALL TO service_role USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_fitness_profiles_updated_at
  BEFORE UPDATE ON fitness_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE fitness_profiles IS 'User fitness preferences for personalized workout generation';
COMMENT ON COLUMN fitness_profiles.training_days_per_week IS 'How many days per week user wants to train (2-6)';
COMMENT ON COLUMN fitness_profiles.preferred_days IS 'Array of preferred weekdays (0=Sun, 1=Mon, etc.)';
COMMENT ON COLUMN fitness_profiles.limitations IS 'Body areas that need special care or have pain';
COMMENT ON COLUMN fitness_profiles.available_equipment IS 'Equipment user has access to';
COMMENT ON TABLE weekly_training_plans IS 'Generated weekly training schedule for each user';

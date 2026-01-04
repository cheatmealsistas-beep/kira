-- Migration: Kira energy logs
-- Description: Tracks daily energy levels for workout adaptation

-- Tabla energy_logs (registro de niveles de energía)
CREATE TABLE energy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Fecha del registro (solo una entrada por día)
  log_date DATE NOT NULL,

  -- Nivel de energía
  energy_level TEXT NOT NULL CHECK (
    energy_level IN ('very_low', 'low', 'normal', 'high', 'very_high')
  ),

  -- Contexto opcional (por qué se siente así)
  context TEXT, -- "No dormí bien", "Estresada con el trabajo", etc.

  -- Metadata (para análisis futuro)
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now(),

  -- Constraint: solo una entrada por usuario por día
  CONSTRAINT unique_user_date UNIQUE (user_id, log_date)
);

-- Índices
CREATE INDEX idx_energy_logs_user_id ON energy_logs(user_id);
CREATE INDEX idx_energy_logs_date ON energy_logs(log_date);
CREATE INDEX idx_energy_logs_user_date ON energy_logs(user_id, log_date DESC);

-- Enable Row Level Security
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own energy logs" ON energy_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own energy logs" ON energy_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own energy logs" ON energy_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own energy logs" ON energy_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Service role acceso completo
CREATE POLICY "Service role full access energy_logs" ON energy_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Comentarios
COMMENT ON TABLE energy_logs IS 'Daily energy level tracking for workout adaptation';
COMMENT ON COLUMN energy_logs.energy_level IS 'Energy levels: very_low, low, normal, high, very_high';
COMMENT ON COLUMN energy_logs.context IS 'Optional user note explaining their energy level';

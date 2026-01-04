# Feature: Programs

## Descripción
Sistema de programas de entrenamiento estructurados con progresión de peso realista.

## Arquitectura

### Flujo del Usuario
1. Usuario sin programa activo -> `/workouts` muestra `ProgramSelector`
2. Usuario selecciona programa -> Se enrolla via `enrollToProgramAction`
3. Día de entrenamiento -> Muestra `ProgramSessionView` con ejercicios sugeridos
4. Día de descanso -> Muestra `RestDayOptions` con opción de entrenar

### Sistema de Progresión
- **Double progression**: Primero reps, luego peso
- **Incrementos conservadores**: 2kg piernas, 1kg upper, 0.5kg aislamiento
- **Basado en energía**: high/medium/low ajusta sets y peso sugerido
- **Historial por ejercicio**: `user_exercise_progress` guarda último peso/reps

## Diseño UI (2025-01-03)

**Estilo unificado**:
- Gradientes coral/rose/orange para elementos activos
- Glassmorphism: `backdrop-blur-md bg-white/60 border border-white/80`
- Esquinas: `rounded-2xl`
- Sin emojis: usar Lucide icons
- Transiciones suaves: `transition-all duration-300`

**Colores por contexto**:
- Selección/activo: `from-rose-500 to-orange-500`
- Día de descanso: `from-violet-500 to-indigo-500`
- Éxito: `from-emerald-400 to-teal-500`

## Archivos Principales

```
/src/features/programs/
├── CLAUDE.md
├── types/index.ts                    # Tipos: TrainingProgram, ProgramSession, etc.
├── programs.query.ts                 # Queries: getActivePrograms, getProgramWithSessions
├── programs.command.ts               # Commands: enrollUserToProgram, saveSessionResult
├── programs.actions.ts               # Server Actions
├── components/
│   ├── index.ts
│   ├── program-selector.tsx          # Selección de programa (glassmorphism)
│   ├── program-session-view.tsx      # Vista de entrenamiento
│   └── rest-day-options.tsx          # Opciones día descanso (glassmorphism)
└── index.ts
```

## Base de Datos

### Tabla: training_programs
```sql
- id UUID
- name JSONB {en, es}
- description JSONB {en, es}
- level: beginner | intermediate | advanced
- goal: strength | recomposition | endurance | general
- days_per_week (3-6)
- duration_weeks
- is_active (para publicar/ocultar)
```

### Tabla: program_sessions
```sql
- id UUID
- program_id FK
- order_index (0, 1, 2...)
- name JSONB {en, es}
```

### Tabla: program_exercises
```sql
- id UUID
- session_id FK
- exercise_slug FK (referencia a exercises.slug)
- order_index
- sets_config JSONB (pyramid sets)
```

### Tabla: user_programs
```sql
- user_id FK
- program_id FK
- current_week
- started_at
- is_active
```

### Tabla: user_exercise_progress
```sql
- user_id FK
- exercise_slug FK
- last_weight
- last_reps
- max_weight
- total_sessions
```

## Decisiones de Arquitectura

### 2025-01-03: Diseño glassmorphism unificado
- **Decisión**: Aplicar mismo estilo coral/glassmorphism a todos los componentes de programs
- **Razón**: Consistencia con nuevo diseño de onboarding
- **Cambios**:
  - `ProgramSelector`: Fondo con gradiente, cards glassmorphism
  - `RestDayOptions`: Fondo violeta para diferenciar, cards glassmorphism
  - Sin uso de emojis, solo Lucide icons

### 2025-01-03: Días de entrenamiento por mapeo
- **Decisión**: Mapear días de semana a sesiones del programa
- **Implementación** en `page.tsx`:
  ```typescript
  const dayMappings = {
    3: { 1: 0, 3: 1, 5: 2 }, // L-X-V
    4: { 1: 0, 2: 1, 4: 2, 5: 3 }, // L-M-J-V
  };
  ```
- **Razón**: Flexibilidad sin requerir que usuario elija días específicos

## Testing Checklist

- [ ] Usuario sin programa ve ProgramSelector
- [ ] Enrollment crea user_programs correctamente
- [ ] Día de entrenamiento muestra sesión correcta según mapeo
- [ ] Día no-entrenamiento muestra RestDayOptions
- [ ] Sugerencias de peso respetan nivel de energía
- [ ] Historial de ejercicio se actualiza correctamente

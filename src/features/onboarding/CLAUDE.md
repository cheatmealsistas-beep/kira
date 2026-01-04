# Feature: Onboarding

## Descripción
Sistema de onboarding para nuevos usuarios que recopila información sobre su experiencia, objetivos y limitaciones para generar un plan de entrenamiento personalizado.

## Arquitectura

### Flujo del Usuario
1. Usuario se registra/logea
2. Si no tiene `onboarding_completed = true` en `fitness_profiles`, se redirige a `/onboarding`
3. Completa 5 pasos en formato carousel con swipe:
   - **Experience**: Nivel de experiencia (beginner/intermediate/advanced)
   - **Days**: Días de entrenamiento por semana (2-6)
   - **Goal**: Objetivo principal (strength/recomposition/endurance/flexibility/general)
   - **Equipment**: Equipamiento disponible (multi-selección)
   - **Limitations**: Limitaciones físicas (opcional, multi-selección)
4. Al completar, se guarda en `fitness_profiles` y genera `weekly_training_plans`
5. Redirige a `/dashboard`

### Diseño UI
- **Estilo**: Glassmorphism, gradientes coral/orange, esquinas redondeadas
- **Sin emojis**: Usamos Lucide icons en su lugar
- **Animaciones**: Framer Motion para transiciones swipe entre pasos
- **Mobile-first**: Touch gestures para navegar entre pasos

## Archivos Principales

```
/src/features/onboarding/
├── CLAUDE.md                    # Este archivo
├── types/index.ts               # Tipos y labels (sin emojis)
├── onboarding.query.ts          # Queries: getFitnessProfile, hasCompletedOnboarding
├── onboarding.command.ts        # Commands: saveFitnessProfile, generateWeeklyPlan
├── onboarding.actions.ts        # Server Actions
├── components/
│   ├── index.ts
│   └── onboarding-flow.tsx      # Componente principal con carousel
└── index.ts                     # Exports
```

## Base de Datos

### Tabla: fitness_profiles
```sql
- user_id (FK auth.users)
- training_days_per_week (2-6)
- preferred_days (int[])
- primary_goal (enum)
- limitations (text[])
- available_equipment (text[])
- experience_level (enum)
- preferred_duration (15-90 mins)
- track_menstrual_cycle (bool)
- onboarding_completed (bool)
- onboarding_completed_at (timestamp)
```

### Tabla: weekly_training_plans
```sql
- user_id (FK)
- week_start (date)
- monday/tuesday/.../sunday (jsonb) -> { type: TrainingDayType, name: string }
```

## Decisiones de Arquitectura

### 2025-01-03: Eliminación de emojis
- **Decisión**: Quitar todos los emojis de labels y usar Lucide icons
- **Razón**: Preferencia de diseño de la usuaria
- **Cambios**:
  - `types/index.ts`: Labels sin propiedad `emoji`
  - `WeeklyPlanDay`: Sin propiedad `emoji`
  - Dashboard usa `<Play />` icon en lugar de emoji

### 2025-01-03: Carousel con Framer Motion
- **Decisión**: Implementar swipe gestures con framer-motion
- **Razón**: UX mobile-first, una pregunta por pantalla
- **Implementación**: `drag="x"` con `onDragEnd` threshold de 50px

## Integración con Programa

Después del onboarding, el usuario va a `/workouts`:
1. Si no tiene `user_programs` activo -> Muestra `ProgramSelector`
2. El programa elegido usa los datos del fitness_profile para ajustar:
   - Número de días del programa
   - Progresión según experiencia
   - Evitar ejercicios con limitaciones marcadas

## Testing Checklist

- [ ] Nuevo usuario sin onboarding -> redirige a /onboarding
- [ ] Usuario con onboarding completo -> redirige a /dashboard
- [ ] Swipe funciona en mobile
- [ ] Se guarda correctamente en fitness_profiles
- [ ] Se genera weekly_training_plan
- [ ] Datos correctos en español e inglés

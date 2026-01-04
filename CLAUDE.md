# Kira - PWA Bienestar Femenino | Claude Code Context

## Sobre el Producto

**Kira** es una PWA de bienestar para mujeres en menopausia y premenopausia. Enfoque minimalista y tech que combina:
- Tracking de ciclo menstrual y síntomas
- Entrenamientos personalizados según fase del ciclo
- Recomendaciones de suplementos basadas en quiz inicial + tracking continuo

**Público objetivo**: Mujeres 40-60 años experimentando cambios hormonales
**Modelo de negocio**: Freemium + Premium
**Mercado**: Global (ES + EN)
**Monetización suplementos**: Solo recomendaciones con enlaces afiliados (no e-commerce propio)
**Nivel médico**: Bienestar general, sin claims médicos, disclaimers claros

---

## Meta-instrucciones (Eficiencia)

**Criterio experto**:
- No te dejes guiar ciegamente - usa tu juicio técnico
- Cuestiona si algo no tiene sentido o perjudica al producto
- Propón alternativas mejores cuando las veas
- Prioriza: eficiencia del desarrollo > experiencia de usuario > petición literal
- Sé honesto sobre trade-offs y consecuencias
- **Contexto Kira**: Siempre considera que el público son mujeres en una etapa de vida sensible - empatía y claridad son prioritarias

**CRÍTICO - Antes de cada tarea**:
- Lee el CLAUDE.md de las features afectadas para tener contexto específico
- Identifica qué patrones aplican
- Revisa si hay deuda técnica relacionada que debas considerar
- **Considera**: ¿Esta feature respeta la privacidad de datos sensibles de salud?

**Durante la ejecución**:
- Si detectas deuda técnica → Documéntala en el CLAUDE.md de la feature
- Si tomas decisiones arquitectónicas → Añádelas a "Decisiones de Arquitectura"
- **Salud**: Nunca almacenar datos de salud sin consentimiento explícito

**Después de cada tarea**:
- Actualiza el CLAUDE.md de la feature si hay nuevo contexto relevante
- Verifica que los casos de testing están actualizados
- Ejecuta tests si es posible

**Periódicamente** (`/audit`):
- Revisa si esta configuración de Claude Code sigue siendo óptima
- Propón mejoras a commands/skills si detectas tareas repetitivas
- Actualiza este CLAUDE.md si hay patrones nuevos no documentados

**Antes de compact/fin de sesión** (`/pre-compact`):
- Evalúa si hay aprendizajes de esta sesión que mejorarían la documentación
- Patrones nuevos → Este CLAUDE.md
- Decisiones/deuda/contexto de features → CLAUDE.md de la feature
- Errores comunes → Troubleshooting en feature correspondiente

**Recursos adicionales**:
- Los README.md en directorios contienen documentación de uso - consúltalos si necesitas contexto de setup, convenciones, o uso de librerías

---

## Principios de Desarrollo

**Simplicidad y seguridad**:
- Busca siempre la solución más simple que funcione
- Menos código = menos bugs = más mantenible
- Evita abstracciones prematuras
- **Datos de salud**: Encriptación, anonimización cuando sea posible

**No romper lo previo**:
- Añadir código nuevo antes que modificar existente
- Si hay que modificar, asegurar backwards compatibility
- Tests deben seguir pasando

**Extensible sin editar** (Open/Closed):
- Diseña para que se pueda extender sin modificar código existente
- Usa composición sobre herencia
- Nuevas features = nuevos archivos, no editar los actuales

**YAGNI** (You Ain't Gonna Need It):
- No implementes funcionalidad "por si acaso"
- Implementa lo que se necesita ahora
- Es más fácil añadir después que eliminar

**Velocidad de iteración**:
- Minimizar pasos para probar cambios localmente
- Todo debe ser testeable sin deploy (Stripe CLI, Supabase local)
- Despliegues rápidos y sin fricción
- Si requiere muchos pasos manuales, automatizarlo

**PWA-First**:
- Offline-first para tracking diario
- Push notifications para recordatorios
- Instalable en home screen
- Sincronización en background cuando hay conexión

---

## Principios UX/UI para Kira

**Prioridad absoluta**:
1. Carga < 200ms (crítico en PWA)
2. Claridad > Estética (público 40-60 años)
3. Empatía en cada interacción
4. Privacidad visible y controlable

**Diseño para el público objetivo**:
- **Tipografía legible**: Mínimo 16px base, alto contraste
- **Touch targets generosos**: Mínimo 48x48px
- **Sin jerga médica**: Lenguaje claro y accesible
- **Colores calmantes**: Paleta suave, evitar rojos/alertas agresivas
- **Modo oscuro**: Opcional pero importante (sofocos nocturnos = uso nocturno)

**"Mi abuela debe poder usarlo"**:
- Auto-explicativo sin instrucciones
- Mínimos clicks posibles (cada click extra = abandono)
- Sin decisiones complejas para el usuario
- Acciones obvias y visibles
- Iconografía clara, no abstracta

**Velocidad real (no trucos)**:
- Todo debe ser rápido por diseño, no por caché
- Optimistic UI siempre (mostrar resultado, revertir si error)
- Prefetch en hover/focus
- NO skeleton loaders si añaden delay - transición instantánea
- Evitar spinners - si algo tarda, el diseño está mal

**Mobile-First (PWA)**:
- Desktop secundario, mobile es la experiencia principal
- Gestos naturales (swipe para navegar días/semanas)
- Haptic feedback en acciones importantes
- Bottom navigation para acceso rápido

**Empatía > Features**:
- Guiar al usuario con narrativa de acompañamiento
- Celebrar pequeños logros (racha de tracking, completar entrenamiento)
- Normalizar síntomas sin alarmar
- CTAs orientados a bienestar, no urgencia

**Maximizar conversiones (Freemium → Premium)**:
- Mostrar valor antes de pedir upgrade
- Un CTA principal por pantalla
- Social proof de mujeres reales (testimonios)
- Trial de features premium sin fricción

**Lo que NO hacer**:
- Alertas alarmistas sobre síntomas
- Comparaciones con otras usuarias
- Gamificación excesiva (no es una competencia)
- Pop-ups intrusivos pidiendo upgrade
- Animaciones complejas sin propósito
- Colores brillantes/neón

**Checklist antes de entregar UI**:
- [ ] ¿Puede completarse en menos clicks?
- [ ] ¿Está claro qué hacer sin leer?
- [ ] ¿Hay feedback inmediato en cada acción?
- [ ] ¿Los estados de error son útiles y empáticos?
- [ ] ¿Funciona offline?
- [ ] ¿La tipografía es legible para +40 años?
- [ ] ¿El tono es cálido y no alarmista?

---

## Brand Voice & UX Writing

**REGLA CRÍTICA**: NUNCA hardcodear textos. TODO debe venir de copies.

### Tono de Kira

**Personalidad de marca**:
- **Cercana pero profesional**: Como una amiga que sabe del tema
- **Empática sin dramatizar**: Normalizar, no alarmar
- **Clara y directa**: Sin rodeos ni jerga médica
- **Empoderadora**: "Tú conoces tu cuerpo"
- **Minimalista**: Menos es más en comunicación

**Voz**:
- Primera persona plural inclusiva: "Vamos a...", "Tu cuerpo..."
- Evitar: "Debes", "Tienes que", "Es importante que..."
- Preferir: "Puedes", "Te sugerimos", "Muchas mujeres encuentran útil..."

**Ejemplos de tono**:

| Contexto | ❌ Evitar | ✅ Kira |
|----------|-----------|---------|
| Registro síntoma | "Síntoma registrado" | "Anotado. Gracias por escucharte" |
| Sin datos | "No hay datos" | "Empieza a conocerte mejor. Tu primer registro toma 30 segundos" |
| Sofoco | "Has tenido un sofoco" | "Sofoco registrado. Son comunes y pasajeros" |
| Upgrade | "Actualiza a Premium" | "Descubre más sobre ti con Premium" |
| Error | "Error al guardar" | "No pudimos guardar. Reintentamos en unos segundos" |
| Entrenamiento | "Entrenamiento completado" | "Hecho. Tu cuerpo te lo agradece" |

### Sistema de Traducciones: Meta-copies + Route-Level Copies

**Arquitectura en Dos Capas**:

1. **Meta-copies** (Prompts para LLM) → En `features/X/meta-copies/`
2. **Copies finales** (Textos reales) → En `app/[locale]/[ruta]/copies/`

**Estructura**:
```
src/
├── features/cycle-tracking/
│   ├── meta-copies/
│   │   └── texts.json          # PROMPTS: Qué texto se necesita y por qué
│   └── components/
│
├── app/[locale]/(app)/track/
│   ├── page.tsx
│   └── copies/
│       ├── en.json              # TEXTOS FINALES
│       └── es.json
│
└── app/[locale]/_shared/ui/
    └── copies/
        ├── en.json              # UI compartida
        └── es.json
```

### Meta-copies: Prompts para LLM

Los meta-copies **NO son textos finales**. Son **instrucciones** para que Claude genere los textos con el tono de Kira.

**Ejemplo** (`features/cycle-tracking/meta-copies/texts.json`):
```json
{
  "track": {
    "title": "Page title for daily tracking. Warm, inviting. Ex: 'How are you today?'",
    "empty_state": "First time tracking. Encouraging, not pushy. Explain benefit briefly.",
    "symptom_logged": "Confirmation after logging symptom. Grateful, validating. Brief.",
    "energy_label": "Label for energy level selector. Simple, no medical jargon."
  }
}
```

**Claude lee esto + `shared/config/brand.ts`** y genera:

```json
// app/[locale]/(app)/track/copies/en.json (GENERADO)
{
  "title": "How are you feeling?",
  "empty_state": "Start tracking to discover your patterns. It only takes a moment.",
  "symptom_logged": "Got it. Thanks for checking in with yourself.",
  "energy_label": "Energy today"
}
```

### Principios de Copy para Kira

**Beneficio > Función**:
```json
// ❌ MAL
"submit": "Submit"

// ✅ BIEN
"submit": "Save my day"
```

**Empático y específico**:
```json
// ❌ MAL
"created": "Entry created successfully"

// ✅ BIEN
"created": "Saved. You're building a picture of your patterns."
```

**Sin alarmas**:
```json
// ❌ MAL
"high_symptoms": "WARNING: You logged many symptoms today"

// ✅ BIEN
"high_symptoms": "Busy day for your body. Rest if you can."
```

### Ejemplos Buenos vs Malos (Contexto Kira)

| Contexto | ❌ Malo | ✅ Bueno |
|----------|---------|----------|
| Empty state tracking | "No hay registros" | "Tu historia empieza hoy. ¿Cómo te sientes?" |
| Error sync | "Error de sincronización" | "Guardado local. Sincronizamos cuando vuelva la conexión" |
| Loading | "Cargando..." | "Preparando tu día..." |
| Workout complete | "Entrenamiento finalizado" | "Hecho. Tu cuerpo te lo agradece" |
| Supplement rec | "Suplementos recomendados" | "Opciones que podrían ayudarte" |
| Premium upsell | "Hazte Premium" | "Descubre más sobre ti" |

---

## Disclaimers Obligatorios

**CRÍTICO**: Kira NO es una app médica. Siempre incluir disclaimers.

### Disclaimer General (Footer/About)
```
Kira es una herramienta de bienestar general. La información proporcionada
no constituye consejo médico, diagnóstico ni tratamiento. Consulta siempre
con un profesional de salud antes de tomar decisiones sobre tu bienestar.
```

### Disclaimer Suplementos
```
Las recomendaciones de suplementos son informativas y basadas en
preferencias generales. No sustituyen el consejo de un profesional.
Consulta con tu médico antes de iniciar cualquier suplementación.
```

### Disclaimer Entrenamientos
```
Adapta los ejercicios a tu condición física. Si experimentas dolor
o malestar, detente y consulta con un profesional.
```

**Implementación**:
- Disclaimer visible en onboarding (checkbox de aceptación)
- Link a "Aviso legal" en footer de todas las páginas
- Tooltip en recomendaciones de suplementos
- Nota al inicio de cada entrenamiento

---

## i18n Automation Scripts

### Propósito

Sistema completo de scripts para automatizar la creación, generación y validación de traducciones. Vive en `/scripts/i18n/` siguiendo VSA (vertical slice architecture).

### Documentación Completa

📖 **Punto de entrada**: `scripts/i18n/00-START-HERE.md`

### Scripts Disponibles

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `i18n:create-structure` | Crear archivos vacíos en.json/es.json | Siempre (paso 1) |
| `i18n:generate-ai` | Generar contenido con Claude API desde meta-copies | Si tienes meta-copies |
| `i18n:sync-keys` | Sincronizar keys faltantes EN↔ES | Mantenimiento, después de añadir keys |
| `i18n:validate` | Validar todas las traducciones | Antes de commit, en CI/CD |
| `i18n:generate-static` | **Generar archivos estáticos** (build-time) | **Automático** en dev/build |

### Workflow Típico

**Crear nueva página con traducciones**:

```bash
# 1. Crear estructura vacía
npm run i18n:create-structure -- --path=app/[locale]/(app)/track

# 2. Opción A: Generar con AI (si tienes meta-copies)
npm run i18n:generate-ai -- \
  --source=src/features/cycle-tracking/meta-copies \
  --target=src/app/[locale]/(app)/track

# 3. Regenerar archivos estáticos
npm run i18n:generate-static

# 4. Validar
npm run i18n:validate
```

---

## Accesibilidad (A11y) - Crítico para Kira

### Por qué es extra importante

Nuestro público (40-60 años) puede tener:
- Presbicia (dificultad para leer texto pequeño)
- Menor sensibilidad al contraste
- Menos familiaridad con patrones UI modernos
- Posibles limitaciones motoras (artritis)

### Requisitos Obligatorios

**Tipografía y Contraste**:
- Base font-size: 18px mínimo (no 16px estándar)
- Line-height: 1.6 mínimo
- Contraste WCAG AAA (7:1) para texto principal
- Evitar grises claros sobre blanco

**Touch Targets**:
- Mínimo 48x48px (preferible 56x56px)
- Espaciado entre elementos interactivos: 8px mínimo
- Botones con padding generoso

**Formularios Accesibles**:
```typescript
// SIEMPRE incluir estos atributos
<div>
  <Label htmlFor="energy" className="text-lg">
    {t('form.energy.label')}
  </Label>
  <p id="energy-help" className="text-base text-muted-foreground">
    {t('form.energy.help')}
  </p>
  <Slider
    id="energy"
    name="energy"
    aria-describedby="energy-help"
    aria-valuetext={getEnergyLabel(value)}
    min={1}
    max={5}
  />
</div>
```

**Navegación por Teclado**:
- Todo interactivo debe ser focusable (Tab)
- Orden de tab lógico
- Focus visible MUY claro (no solo outline sutil)
- Escape cierra modals/dropdowns
- Enter/Space activan buttons

**Preferencias del Usuario**:
```css
/* OBLIGATORIO en animaciones */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Soporte para texto grande del sistema */
html {
  font-size: clamp(16px, 1rem + 0.5vw, 20px);
}
```

### Checklist A11y para Kira

**Texto**:
- [ ] Font-size base ≥ 18px
- [ ] Contraste ≥ 7:1 para texto importante
- [ ] Line-height ≥ 1.6
- [ ] Sin texto en imágenes

**Interacción**:
- [ ] Touch targets ≥ 48x48px
- [ ] Focus visible y claro
- [ ] Navegable con teclado
- [ ] Feedback en cada acción

**Específico Kira**:
- [ ] Emojis tienen aria-label descriptivo
- [ ] Gráficos tienen alternativa textual
- [ ] Sliders tienen aria-valuetext legible
- [ ] Colores no son único indicador (usar iconos también)

---

## Empty States & Touchpoints

### Empty States = Oportunidades de Conexión

En Kira, los empty states son momentos de onboarding emocional.

**Estructura obligatoria**:
```typescript
<EmptyState
  illustration={<WelcomeIllustration />}  // Ilustración cálida, no icono frío
  title={t('empty.title')}                 // "Tu historia empieza aquí"
  description={t('empty.description')}     // Beneficio + empatía
  action={{
    label: t('empty.action'),              // "Hacer mi primer registro"
    onClick: handleStart
  }}
/>
```

**Principios**:
- Ilustraciones cálidas, no iconos fríos
- Nunca culpar al usuario
- Explicar el beneficio emocional de tomar acción
- CTA invitador, no imperativo

**Ejemplos por feature**:

| Feature | Empty State |
|---------|-------------|
| Tracking | "Tu historia empieza hoy. Cada registro te ayuda a entenderte mejor." |
| Workouts | "Entrenamientos pensados para ti. Descubre cuál va con tu día." |
| Supplements | "Completa tu perfil para recomendaciones personalizadas." |
| History | "Aquí verás tus patrones. Empieza a registrar para descubrirte." |

### Cada Touchpoint = Conexión Empática

**Regla**: Toda acción del usuario debe tener respuesta cálida e inmediata.

| Acción | Feedback Kira |
|--------|---------------|
| Log síntoma | "Anotado. Gracias por escucharte." |
| Completar workout | "Hecho. Tu cuerpo te lo agradece." |
| Ver recomendación | Tooltip con "Por qué te lo sugerimos" |
| Error | "No pudimos guardar. Reintentamos en unos segundos." |
| Streak | "5 días registrando. Vas conociéndote cada vez mejor." |

**Patrón de Toast**:
```typescript
// Usar toast de sonner con tono Kira
toast.success(t('success.logged'), {
  description: t('success.loggedDescription')  // "Anotado"
});

toast.error(t('errors.sync'), {
  description: t('errors.syncRetry'),  // "Guardado local. Sincronizamos pronto"
  action: {
    label: t('actions.retry'),
    onClick: handleRetry
  }
});
```

---

## Checklist Pre-Entrega (Kira)

### Funcionalidad
- [ ] ¿Funciona el happy path completo?
- [ ] ¿Los errores muestran mensajes empáticos?
- [ ] ¿Hay validación client-side y server-side?
- [ ] ¿Funciona offline? (PWA)

### UX/UI
- [ ] ¿Puede completarse en menos clicks?
- [ ] ¿Está claro qué hacer sin leer?
- [ ] ¿Hay feedback inmediato en cada acción?
- [ ] ¿Empty states invitan cálidamente a tomar acción?
- [ ] ¿Funciona en mobile con touch targets grandes?
- [ ] ¿Tipografía legible (+18px)?
- [ ] ¿Alto contraste?

### i18n & Copy
- [ ] ¿TODOS los textos están en `copies/`?
- [ ] ¿Creaste `/copies/en.json` y `/copies/es.json`?
- [ ] ¿Copy empático y orientado a bienestar?
- [ ] ¿Sin jerga médica?
- [ ] ¿Errores específicos y no alarmistas?

### Privacidad & Disclaimers
- [ ] ¿Datos de salud con consentimiento explícito?
- [ ] ¿Disclaimer visible donde aplique?
- [ ] ¿Sin claims médicos?

### Accesibilidad
- [ ] ¿Labels asociados a inputs?
- [ ] ¿Errores tienen role="alert"?
- [ ] ¿Navegable solo con teclado?
- [ ] ¿Focus MUY visible?
- [ ] ¿Animaciones respetan prefers-reduced-motion?

### Performance (PWA)
- [ ] ¿Carga inicial < 200ms?
- [ ] ¿No hay layout shifts (CLS)?
- [ ] ¿Funciona offline?
- [ ] ¿Imágenes optimizadas?

---

## Quick Start

### Comandos de Desarrollo

**Scripts optimizados (para Claude y CI)**:
```bash
npm run dev          # Development server
npm run build        # Production build (output mínimo)
npm run type-check   # TypeScript (sin colores, solo errores)
npm run lint         # ESLint (quiet mode, formato compacto)
npm run test         # Vitest (reporter básico, solo resumen)
```

**Scripts verbose (para debugging manual)**:
```bash
npm run build:verbose      # Build con output completo
npm run type-check:verbose # TypeScript con colores y detalles
npm run lint:verbose       # ESLint con warnings completos
npm run test:verbose       # Vitest con output detallado
```

**Otros comandos útiles**:
```bash
npm run lint:fix     # Auto-fix de ESLint
npm run check        # Pre-commit checks (type-check + lint + test)
npm run pre-push     # Validación completa antes de push
```

### Claude Code Commands
- `/new-feature [name]` - Crear feature completa
- `/add-page [name]` - Crear página con SEO completo
- `/add-action [name]` - Añadir Server Action
- `/fix-types` - Corregir errores TypeScript
- `/add-translation [keys]` - Añadir traducciones
- `/review-feature [name]` - Revisar feature
- `/audit` - Auto-auditoría completa
- `/security-audit` - Auditoría de seguridad
- `/update-feature-context [name]` - Actualizar CLAUDE.md de feature

---

## Arquitectura: VSA + CQRS

### Estructura Principal

```
src/
├── features/       # Features (VSA + CQRS)
├── shared/         # Utilidades compartidas
├── app/            # Next.js routing
├── i18n/           # Configuración i18n
└── test/           # Test utilities
```

### Estructura de Feature
```
/src/features/[name]/
├── CLAUDE.md             # Contexto específico de la feature
├── components/           # UI específica
├── types/index.ts        # Zod schemas + TS types
├── [name].query.ts       # SELECT operations
├── [name].command.ts     # INSERT/UPDATE/DELETE
├── [name].handler.ts     # Business logic + validation
└── [name].actions.ts     # Server Actions (entry points)
```

### Reglas de Imports
```typescript
// ✅ CORRECTO
import { Button } from '@/shared/components/ui';
import { getUser } from '@/shared/auth';
import { createClientServer } from '@/shared/database/supabase';
import { TrackingForm } from '@/features/cycle-tracking';

// ❌ NUNCA - imports cross-feature
import { something } from '@/features/other-feature';
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, RSC) |
| PWA | next-pwa + Workbox |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email, magic-link, OAuth) |
| Payments | Stripe (Freemium + Premium) |
| UI | shadcn/ui + Tailwind + Radix + Magic UI |
| Forms | React Hook Form + Zod |
| i18n | next-intl (en/es) |
| Charts | Recharts (para visualizar patrones) |

### MCP Tools Disponibles

- **Magic UI** (`mcp__magicui__*`): Componentes animados - textos, efectos, decorativos
- **Context7** (`mcp__context7__*`): Documentación actualizada de librerías

---

## Features de Kira

### Heredadas del Boilerplate (Reutilizar 100%)

| Feature | Descripción | Estado | Acción |
|---------|-------------|--------|--------|
| `auth` | Login, register, magic-link, OAuth | ✅ Ready | Usar tal cual |
| `billing` | Stripe Pricing Table + Webhooks | ✅ Ready | Usar tal cual |
| `my-account` | Perfil, tema, idioma, timezone | ✅ Ready | Usar tal cual |
| `admin` | Roles, settings, info-bar | ✅ Ready | Adaptar widgets |
| `home` | Landing page architecture | ✅ Ready | Cambiar copy |

### Features a ELIMINAR/IGNORAR

| Feature | Razón |
|---------|-------|
| `organizations` | Incompleto + B2C no necesita multi-org |
| `affiliates` | Decidir más adelante |

### Features NUEVAS de Kira

| Feature | Descripción | Prioridad | Estado |
|---------|-------------|-----------|--------|
| `onboarding` | Wizard 5 pasos: nivel, días, objetivo, equipo, limitaciones | P0 | ✅ Completado |
| `workouts` | Generador de sesiones + vista de ejercicio + tracking pesos | P0 | ✅ Completado |
| `energy-tracking` | Selector de 4 niveles (high/medium/low/rest) | P0 | ✅ Completado |
| `dashboard` | Saludo, energía, racha, progreso semanal, día sugerido | P0 | ✅ Completado |
| `session-log` | Registro de entreno completado + pesos por serie | P1 | ✅ Completado |
| `supplements` | Recomendaciones + enlaces afiliados | P2 | 📅 Fase 2 |
| `insights` | Patrones energía-rendimiento | P2 | 📅 Fase 2 |
| `reminders` | Push notifications PWA | P2 | 📅 Fase 2 |

### Estructura Feature Onboarding

```
/src/features/onboarding/
├── types/index.ts           # Schemas + tipos (experiencia, objetivo, limitaciones, equipo)
├── onboarding.query.ts      # getFitnessProfile, hasCompletedOnboarding, getCurrentWeekPlan
├── onboarding.command.ts    # saveFitnessProfile, generateWeeklyPlan, updateTrainingDays
├── onboarding.actions.ts    # Server Actions
├── components/
│   └── onboarding-flow.tsx  # Wizard de 5 pasos
└── index.ts                 # Exports
```

**Tablas relacionadas**:
- `fitness_profiles` - Preferencias del usuario (días, objetivo, limitaciones, equipo, nivel)
- `weekly_training_plans` - Plan semanal generado con tipo de entrenamiento por día

**Flujo**:
1. Usuario nuevo → Dashboard redirige a /onboarding
2. 5 pasos: Nivel → Días → Objetivo → Equipo → Limitaciones
3. Al completar → Guarda perfil + Genera plan semanal → Dashboard

### Estructura Feature Workouts

```
/src/features/workouts/
├── types/index.ts             # Exercise, Workout, GeneratedWorkout
├── workouts.query.ts          # generateWorkoutForEnergy, getExercises
├── workouts.command.ts        # saveWorkoutSession, getLastExerciseWeights
├── workouts.actions.ts        # saveWorkoutSessionAction
├── components/
│   └── workout-session.tsx    # UI de sesión con timer, tracking pesos
└── index.ts                   # Exports
```

**Tablas relacionadas**:
- `exercises` - Catálogo de 77 ejercicios con instrucciones, alternativas, zonas de dolor
- `workout_sessions` - Sesiones completadas
- `exercise_logs` - Pesos/reps por ejercicio por sesión

**Funcionalidades**:
- Timer de descanso real con countdown visual
- Tracking de pesos y reps por serie
- Muestra peso de sesión anterior ("Última vez: Xkg")
- Pantalla de preview antes de empezar
- Pantalla de completado con estadísticas

---

## Plan de Desarrollo

### FASE 0: Setup ✅ COMPLETADO

- [x] Actualizar `brand.ts` con datos de Kira
- [x] Crear migraciones SQL para tablas nuevas
- [x] Regenerar tipos Supabase (`npm run gen:types`)

### FASE 1: Core MVP ✅ COMPLETADO

**Onboarding Feature**:
- [x] Wizard 5 pasos (nivel → días → objetivo → equipo → limitaciones)
- [x] Guardar `fitness_profiles` en BD
- [x] Generar plan semanal automático
- [x] Redirect a dashboard al completar

**Workouts Feature**:
- [x] Vista "Hoy" con selector de energía (4 niveles)
- [x] Algoritmo de generación de sesión por energía
- [x] Vista de sesión con lista de ejercicios
- [x] Ficha de ejercicio (card con instrucciones)
- [x] Timer de descanso real con countdown
- [ ] Botón "Cambiar ejercicio" (swaps) - Pendiente

**Energy Tracking**:
- [x] Selector de 4 niveles (high/medium/low/rest)
- [x] Persistir en `daily_energy`
- [x] Ajustes automáticos a la sesión

### FASE 2: Tracking & Progress ✅ COMPLETADO

**Session Log Feature**:
- [x] Marcar ejercicio como completado
- [x] Registrar peso y reps por serie
- [x] Mostrar peso anterior ("Última vez: Xkg")
- [x] Guardar sesiones completadas

**Dashboard Feature**:
- [x] Saludo personalizado con frase motivacional
- [x] Racha de entrenamientos
- [x] Progreso semanal visual
- [x] Día de entrenamiento sugerido (según plan)

### FASE 3: Polish & PWA ⬅️ ACTUAL

- [ ] Adaptar Home/Landing con copy de Kira
- [ ] PWA config (manifest.json, service worker)
- [ ] Configuración de entreno en Settings
- [ ] Historial de entrenamientos
- [ ] Swap de ejercicios durante sesión
- [ ] Offline-first para tracking
- [ ] Push notifications básicas
- [ ] Testing E2E de flujos críticos

### FASE 4: Secundarias (Fase 2 del producto)

- [ ] Supplements recommendations (con afiliados cuando estén disponibles)
- [x] Insights (correlaciones energía-rendimiento) ✅ COMPLETADO
- [ ] Wearables integration (Apple Health, etc.)

### FASE 5: IA como Entrenador Personal (Futuro)

**Concepto**: La IA actúa como una entrenadora personal conversacional que:
1. Hace preguntas para entender mejor a la usuaria (no un formulario rígido)
2. Genera un plan de entrenamiento personalizado basado en las respuestas
3. El plan se mantiene estable en el tiempo (no cambia cada día)
4. Se reajusta solo cuando hay inputs específicos:
   - Feedback explícito de la usuaria
   - Cambio de objetivos
   - Dolor o molestia reportada
   - Cambios en equipamiento disponible
   - Después de X semanas (revisión periódica)

**Requisitos técnicos**:
- Integración con Claude API (o similar)
- Sistema de prompts para el "trainer persona" de Kira
- Lógica de cuándo re-evaluar vs mantener el plan
- UI conversacional o wizard inteligente
- Historial de conversaciones para contexto

**Diferencia con sistema actual**:
- Actual: Algoritmo determinista basado en config + energía diaria
- Futuro: IA conversacional que entiende contexto y ajusta con criterio

**Para implementar cuando**:
- El MVP esté validado con usuarias reales
- Haya feedback sobre qué les falta en la personalización actual
- Se tenga presupuesto para API calls de IA

---

## Matriz de Archivos Clave

| Archivo | Acción | Prioridad |
|---------|--------|-----------|
| `/src/shared/config/brand.ts` | MODIFICAR valores | P0 |
| `/supabase/migrations/` | CREAR nuevas tablas | P0 |
| `/src/features/organizations/` | IGNORAR | - |
| `/src/features/affiliates/` | IGNORAR | - |
| `/src/features/onboarding/` | CREAR | P0 |
| `/src/features/workouts/` | CREAR | P0 |
| `/src/features/energy-tracking/` | CREAR | P0 |
| `/src/features/session-log/` | CREAR | P1 |
| `/src/features/dashboard/` | MODIFICAR widgets | P1 |
| `/src/features/home/` | MODIFICAR copy | P2 |

---

## Modelo de Datos (Core)

### user_profiles (Extensión de profiles)
```sql
-- Extender tabla profiles existente
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  birth_year INTEGER,
  menopause_stage TEXT CHECK (menopause_stage IN ('premenopause', 'perimenopause', 'menopause', 'postmenopause')),
  onboarding_completed BOOLEAN DEFAULT false,
  quiz_responses JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{
    "notifications": true,
    "reminder_time": "09:00",
    "unit_system": "metric"
  }';
```

### daily_logs
```sql
CREATE TABLE daily_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,

  -- Periodo
  period_flow TEXT CHECK (period_flow IN ('none', 'spotting', 'light', 'medium', 'heavy')),

  -- Síntomas (array de strings predefinidos)
  symptoms TEXT[] DEFAULT '{}',

  -- Escalas 1-5
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),

  -- Notas libres
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, date)
);
```

### exercises (Catálogo de ejercicios)
```sql
CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identificación
  slug TEXT UNIQUE NOT NULL,  -- 'goblet_squat', 'deadlift_db', etc.
  name JSONB NOT NULL,  -- {"en": "Goblet Squat", "es": "Sentadilla Goblet"}

  -- Categorización
  type TEXT NOT NULL CHECK (type IN ('strength', 'running', 'mobility', 'warmup', 'cooldown')),
  muscle_group TEXT NOT NULL CHECK (muscle_group IN (
    'legs', 'glutes', 'back', 'chest', 'shoulders', 'arms', 'core', 'full_body', 'cardio'
  )),
  equipment TEXT[] DEFAULT '{}',  -- ['dumbbell', 'bench', 'none']

  -- Ficha rápida del ejercicio
  card JSONB NOT NULL,  -- {
    -- "position": {"en": "...", "es": "..."},
    -- "movement": {"en": "...", "es": "..."},
    -- "target_muscles": {"en": "...", "es": "..."},
    -- "common_mistake": {"en": "...", "es": "..."},
    -- "safety_tip": {"en": "...", "es": "..."}
  -- }

  -- Media
  video_url TEXT,
  thumbnail_url TEXT,

  -- Alternativas para swap rápido (mismo músculo, diferente equipo)
  swap_alternatives TEXT[] DEFAULT '{}',  -- ['squat_bodyweight', 'leg_press']

  -- Zonas de dolor que afecta (para ajustes automáticos)
  affects_zones TEXT[] DEFAULT '{}',  -- ['wrists', 'shoulders', 'neck', 'forearms']

  -- Metadata
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### workout_templates (Plantillas de sesiones)
```sql
CREATE TABLE workout_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Identificación
  slug TEXT UNIQUE NOT NULL,  -- 'strength_day_a', 'running_intervals', etc.
  name JSONB NOT NULL,  -- {"en": "Strength Day A - Lower", "es": "Día Fuerza A - Tren Inferior"}
  description JSONB NOT NULL,

  -- Tipo y duración
  type TEXT NOT NULL CHECK (type IN ('strength', 'running')),
  duration_minutes INTEGER NOT NULL,  -- 60 para fuerza, 20 para running

  -- Estructura de la sesión
  structure JSONB NOT NULL,  -- {
    -- "warmup": [{"exercise_slug": "...", "duration_seconds": 60}],
    -- "main": [
    --   {"exercise_slug": "goblet_squat", "sets": 3, "reps": "10-12", "rest_seconds": 90},
    --   {"exercise_slug": "rdl_db", "sets": 3, "reps": "10-12", "rest_seconds": 90}
    -- ],
    -- "cooldown": [{"exercise_slug": "...", "duration_seconds": 60}]
  -- }

  -- Ajustes base (los ajustes por energía se aplican en runtime)
  base_intensity TEXT DEFAULT 'moderate' CHECK (base_intensity IN ('light', 'moderate', 'intense')),

  -- Para el programa semanal
  day_of_week INTEGER[],  -- [1, 3, 5] = Lunes, Miércoles, Viernes
  week_rotation INTEGER DEFAULT 1,  -- Para alternar semanas (A/B)

  -- Premium o free
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### user_workout_logs (Historial con rendimiento)
```sql
CREATE TABLE user_workout_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES workout_templates(id),

  -- Cuándo
  completed_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER,

  -- Energía pre-entreno
  energy_level TEXT CHECK (energy_level IN ('very_low', 'low', 'normal', 'high', 'very_high')),
  pain_zones_today TEXT[] DEFAULT '{}',  -- Molestias reportadas ese día

  -- Rendimiento por ejercicio
  exercise_logs JSONB NOT NULL,  -- [
    -- {
    --   "exercise_slug": "goblet_squat",
    --   "sets_completed": 3,
    --   "reps_per_set": [12, 10, 10],
    --   "weight_kg": 12,
    --   "rpe": 7,  -- Rate of Perceived Exertion 1-10
    --   "pain_reported": ["wrists"],  -- Si hubo molestia
    --   "swapped_from": null  -- Si hizo swap
    -- }
  -- ]

  -- Running específico
  running_data JSONB,  -- {
    -- "distance_km": 3.2,
    -- "avg_pace_min_km": 6.5,
    -- "intervals": [{"type": "run", "duration": 60}, {"type": "walk", "duration": 30}]
  -- }

  -- Feedback general
  energy_before INTEGER CHECK (energy_before BETWEEN 1 AND 5),
  energy_after INTEGER CHECK (energy_after BETWEEN 1 AND 5),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);
```

### user_exercise_progress (Progresión individual)
```sql
CREATE TABLE user_exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_slug TEXT NOT NULL,

  -- Cargas actuales
  current_weight_kg DECIMAL(5,2),
  current_reps_target INTEGER,

  -- Historial de progresión
  progression_history JSONB DEFAULT '[]',  -- [
    -- {"date": "2024-01-15", "weight_kg": 10, "reps": 12, "rpe": 6},
    -- {"date": "2024-01-22", "weight_kg": 12, "reps": 10, "rpe": 7}
  -- ]

  -- Ajustes por dolor
  pain_adjustments JSONB DEFAULT '{}',  -- {
    -- "wrists": {"reduce_weight_pct": 20, "use_alternative": "goblet_squat_neutral"},
    -- "shoulders": {"skip": true, "alternative": "chest_supported_row"}
  -- }

  -- Última actualización
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, exercise_slug)
);
```

### supplements
```sql
CREATE TABLE supplements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name JSONB NOT NULL,  -- {"en": "...", "es": "..."}
  description JSONB NOT NULL,
  benefits JSONB NOT NULL,  -- Array de beneficios traducidos

  -- Para qué síntomas/fases es útil
  target_symptoms TEXT[] DEFAULT '{}',
  target_phases TEXT[] DEFAULT '{}',

  -- Affiliate
  affiliate_url TEXT,
  affiliate_code TEXT,
  brand TEXT,

  -- Disclaimer obligatorio
  disclaimer JSONB NOT NULL,

  -- Estado
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### workout_completions
```sql
CREATE TABLE workout_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  duration_seconds INTEGER,

  UNIQUE(user_id, workout_id, completed_at::date)
);
```

---

## Síntomas Predefinidos

Mantener lista consistente para tracking y análisis:

```typescript
// shared/config/symptoms.ts
export const SYMPTOMS = {
  // Vasomotores
  hot_flashes: { en: 'Hot flashes', es: 'Sofocos' },
  night_sweats: { en: 'Night sweats', es: 'Sudores nocturnos' },

  // Físicos
  headache: { en: 'Headache', es: 'Dolor de cabeza' },
  bloating: { en: 'Bloating', es: 'Hinchazón' },
  breast_tenderness: { en: 'Breast tenderness', es: 'Sensibilidad en senos' },
  joint_pain: { en: 'Joint pain', es: 'Dolor articular' },
  fatigue: { en: 'Fatigue', es: 'Fatiga' },

  // Emocionales
  anxiety: { en: 'Anxiety', es: 'Ansiedad' },
  irritability: { en: 'Irritability', es: 'Irritabilidad' },
  mood_swings: { en: 'Mood swings', es: 'Cambios de humor' },
  brain_fog: { en: 'Brain fog', es: 'Niebla mental' },

  // Sueño
  insomnia: { en: 'Insomnia', es: 'Insomnio' },

  // Otros
  dry_skin: { en: 'Dry skin', es: 'Piel seca' },
  hair_changes: { en: 'Hair changes', es: 'Cambios en el cabello' },
} as const;

export type SymptomKey = keyof typeof SYMPTOMS;
```

---

## Niveles de Energía (Sistema Principal)

El sistema de Kira se basa en **energía percibida**, no en ciclo menstrual.

```typescript
// shared/config/energy-levels.ts
export const ENERGY_LEVELS = {
  very_low: {
    emoji: '😴',
    en: 'Very low',
    es: 'Muy baja',
    color: '#E57373',
    description: {
      en: 'Not feeling it today',
      es: 'Hoy no es mi día'
    }
  },
  low: {
    emoji: '😐',
    en: 'Low',
    es: 'Algo baja',
    color: '#FFB74D',
    description: {
      en: 'Not at 100%',
      es: 'No estoy al 100%'
    }
  },
  normal: {
    emoji: '😊',
    en: 'Normal',
    es: 'Normal',
    color: '#81C784',
    description: {
      en: 'Feeling fine',
      es: 'Me siento bien'
    }
  },
  high: {
    emoji: '💪',
    en: 'High',
    es: 'Con energía',
    color: '#4FC3F7',
    description: {
      en: 'Feeling good',
      es: 'Con ganas'
    }
  },
  very_high: {
    emoji: '🔥',
    en: 'Very high',
    es: 'Al máximo',
    color: '#9575CD',
    description: {
      en: 'Ready to crush it',
      es: 'A tope'
    }
  }
} as const;

export type EnergyLevel = keyof typeof ENERGY_LEVELS;
```

**¿Por qué energía y no ciclo?**
- No requiere datos de salud sensibles (GDPR-friendly)
- Funciona para TODAS las mujeres (con o sin ciclo regular)
- Menos barreras de entrada
- La usuaria tiene el control total
- Más inclusivo (no todas quieren hablar de su ciclo)

---

## Sistema de Entrenamiento Kira

### Filosofía

Kira actúa como una **entrenadora especialista en mujeres +40**. El sistema está diseñado para:
- **Adherencia a largo plazo** (no perfección)
- **Adaptación automática** a la fase del ciclo y dolor reportado
- **Usabilidad real en gimnasio** (swaps rápidos cuando no hay equipo)
- **Progresión sostenible** sin cambiar toda la rutina cada mes

### Configuración Personalizada (Onboarding + Settings)

El sistema NO impone estructura. La usuaria configura según su vida real.

#### Datos que recopilamos en Onboarding

```typescript
// shared/types/user-workout-config.ts
export interface UserWorkoutConfig {
  // OBJETIVO PRINCIPAL
  primary_goal: 'recomposition' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
  secondary_goals?: string[];  // ['firmness', 'energy', 'stress_relief', 'bone_health']

  // DISPONIBILIDAD SEMANAL
  available_days: number[];    // [1, 3, 5] = Lunes, Miércoles, Viernes
  preferred_time: 'morning' | 'midday' | 'evening' | 'flexible';
  session_duration: 30 | 45 | 60;  // minutos disponibles

  // TIPO DE ENTRENAMIENTO PREFERIDO
  workout_types: {
    strength: boolean;         // ¿Quiere entrenar fuerza?
    running: boolean;          // ¿Quiere correr?
    mobility: boolean;         // ¿Quiere movilidad/yoga?
    hiit: boolean;             // ¿Quiere cardio intenso?
  };

  // EQUIPAMIENTO DISPONIBLE
  equipment: {
    location: 'gym' | 'home' | 'both';
    available: string[];       // ['dumbbells', 'bench', 'bands', 'mat', 'none']
    dumbbell_range?: {         // Rango de mancuernas disponible
      min_kg: number;
      max_kg: number;
    };
  };

  // EXPERIENCIA Y NIVEL
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  years_training?: number;
  can_do: {                    // Evaluación rápida
    pushups: 'none' | 'modified' | 'full' | 'many';
    squats: 'none' | 'bodyweight' | 'weighted';
    running_5min: boolean;
  };

  // DOLENCIAS Y ZONAS A CUIDAR (CRÍTICO)
  pain_zones: PainZone[];      // ['wrists', 'shoulders', 'knees', 'lower_back']
  chronic_conditions?: string[]; // ['arthritis', 'osteoporosis', 'fibromyalgia']
  injuries_history?: string;   // Texto libre para contexto

  // AJUSTES POR ENERGÍA (NO requiere datos de ciclo)
  // La usuaria indica cómo se siente HOY, no necesitamos saber por qué
  use_energy_based_adjustments: boolean;  // ¿Quiere ajustes según energía diaria?
}
```

#### Tabla: user_workout_config
```sql
CREATE TABLE user_workout_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Objetivo
  primary_goal TEXT NOT NULL CHECK (primary_goal IN (
    'recomposition', 'strength', 'endurance', 'flexibility', 'general_fitness'
  )),
  secondary_goals TEXT[] DEFAULT '{}',

  -- Disponibilidad
  available_days INTEGER[] NOT NULL,  -- [1,3,5] = L, X, V
  preferred_time TEXT DEFAULT 'flexible',
  session_duration INTEGER DEFAULT 60,

  -- Tipos de entrenamiento
  wants_strength BOOLEAN DEFAULT true,
  wants_running BOOLEAN DEFAULT false,
  wants_mobility BOOLEAN DEFAULT false,
  wants_hiit BOOLEAN DEFAULT false,

  -- Equipamiento
  training_location TEXT DEFAULT 'gym',
  available_equipment TEXT[] DEFAULT '{}',
  dumbbell_min_kg DECIMAL(4,1),
  dumbbell_max_kg DECIMAL(4,1),

  -- Experiencia
  experience_level TEXT DEFAULT 'beginner',
  years_training INTEGER,

  -- Dolencias (CRÍTICO)
  pain_zones TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  injuries_notes TEXT,

  -- Ajustes por energía (sin datos de ciclo)
  use_energy_adjustments BOOLEAN DEFAULT true,

  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Sistema de Recomendación de Ejercicios

**Enfoque**: Algoritmo dinámico con base de ejercicios mixta (manual + IA para expandir).

##### Paso 1: Base de Ejercicios

Cada ejercicio tiene metadatos que permiten filtrado y selección inteligente:

```typescript
// shared/types/exercise.ts
export interface Exercise {
  slug: string;
  name: { en: string; es: string };

  // Para filtrado
  type: 'strength' | 'running' | 'mobility' | 'warmup' | 'cooldown';
  muscle_groups: MuscleGroup[];      // ['quads', 'glutes'] - puede trabajar varios
  primary_muscle: MuscleGroup;       // 'glutes' - el principal
  equipment_required: Equipment[];   // ['dumbbell'] o ['none']
  affects_pain_zones: PainZone[];    // ['knees', 'lower_back']

  // Para selección por objetivo
  goal_scores: {
    recomposition: number;   // 0-10: qué tan bueno es para este objetivo
    strength: number;
    endurance: number;
    flexibility: number;
  };

  // Para ordenar dentro de sesión
  exercise_order: 'compound_first' | 'isolation' | 'accessory' | 'finisher';
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Contenido (ficha)
  card: ExerciseCard;
  swap_alternatives: string[];       // slugs de alternativas
}
```

##### Paso 2: Filtrado por Compatibilidad

```typescript
// shared/lib/workout/exercise-filter.ts

export function getCompatibleExercises(
  allExercises: Exercise[],
  config: UserWorkoutConfig
): Exercise[] {
  return allExercises.filter(exercise => {
    // 1. Filtrar por dolencias
    const hasPainConflict = exercise.affects_pain_zones.some(
      zone => config.pain_zones.includes(zone)
    );
    if (hasPainConflict) return false;

    // 2. Filtrar por equipamiento
    const hasEquipment = exercise.equipment_required.every(
      equip => equip === 'none' || config.equipment.available.includes(equip)
    );
    if (!hasEquipment) return false;

    // 3. Filtrar por nivel
    if (config.experience_level === 'beginner' && exercise.difficulty === 'advanced') {
      return false;
    }

    return true;
  });
}
```

##### Paso 3: Selección por Objetivo y Grupo Muscular

```typescript
// shared/lib/workout/exercise-selector.ts

export function selectExercisesForSession(
  compatibleExercises: Exercise[],
  session: {
    type: 'upper' | 'lower' | 'full_body' | 'push' | 'pull';
    goal: PrimaryGoal;
    duration_minutes: number;
    level: ExperienceLevel;
  }
): SelectedExercise[] {
  // Definir grupos musculares según tipo de sesión
  const targetMuscles = SESSION_MUSCLE_MAP[session.type];
  // upper: ['chest', 'back', 'shoulders', 'arms']
  // lower: ['quads', 'glutes', 'hamstrings', 'calves']
  // full_body: todos

  // Filtrar ejercicios que trabajan estos músculos
  let candidates = compatibleExercises.filter(ex =>
    ex.muscle_groups.some(m => targetMuscles.includes(m))
  );

  // Ordenar por score del objetivo
  candidates.sort((a, b) =>
    b.goal_scores[session.goal] - a.goal_scores[session.goal]
  );

  // Seleccionar asegurando cobertura de grupos musculares
  const selected: SelectedExercise[] = [];
  const coveredMuscles = new Set<MuscleGroup>();

  // Primero: un ejercicio compuesto por cada grupo principal
  for (const muscle of targetMuscles) {
    if (coveredMuscles.has(muscle)) continue;

    const compound = candidates.find(ex =>
      ex.primary_muscle === muscle &&
      ex.exercise_order === 'compound_first' &&
      !selected.some(s => s.slug === ex.slug)
    );

    if (compound) {
      selected.push(toSelectedExercise(compound, session));
      compound.muscle_groups.forEach(m => coveredMuscles.add(m));
    }
  }

  // Segundo: ejercicios de aislamiento/accesorios según tiempo disponible
  const timePerExercise = 8; // minutos promedio por ejercicio
  const maxExercises = Math.floor((session.duration_minutes - 10) / timePerExercise); // -10 para warmup/cooldown

  while (selected.length < maxExercises && candidates.length > 0) {
    // Buscar músculo menos trabajado
    const muscleCount = countMuscleOccurrences(selected);
    const leastWorkedMuscle = targetMuscles
      .filter(m => (muscleCount[m] || 0) < 2)
      .sort((a, b) => (muscleCount[a] || 0) - (muscleCount[b] || 0))[0];

    if (!leastWorkedMuscle) break;

    const nextExercise = candidates.find(ex =>
      ex.muscle_groups.includes(leastWorkedMuscle) &&
      !selected.some(s => s.slug === ex.slug)
    );

    if (nextExercise) {
      selected.push(toSelectedExercise(nextExercise, session));
      candidates = candidates.filter(c => c.slug !== nextExercise.slug);
    } else {
      break;
    }
  }

  // Ordenar: compuestos primero, aislamiento después
  return selected.sort((a, b) =>
    ORDER_PRIORITY[a.exercise_order] - ORDER_PRIORITY[b.exercise_order]
  );
}
```

##### Paso 4: Distribución Semanal Inteligente

```typescript
// shared/lib/workout/week-planner.ts

export function distributeWeeklyWorkouts(
  config: UserWorkoutConfig
): WeeklyPlan {
  const days = config.available_days;

  // Determinar split según días disponibles
  let split: WorkoutSplit;

  if (days.length <= 2) {
    // 1-2 días: Full body siempre
    split = 'full_body';
  } else if (days.length === 3) {
    // 3 días: Full body o Push/Pull/Legs según nivel
    split = config.experience_level === 'beginner' ? 'full_body' : 'push_pull_legs';
  } else if (days.length >= 4) {
    // 4+ días: Upper/Lower o PPL
    split = 'upper_lower';
  }

  // Asignar tipo a cada día evitando mismos músculos consecutivos
  const plan: WeeklyPlan = { days: {}, split };

  const sessionTypes = getSplitRotation(split, days.length);
  // full_body x3: ['full_body', 'full_body', 'full_body']
  // upper_lower x4: ['upper', 'lower', 'upper', 'lower']
  // ppl x3: ['push', 'pull', 'legs']

  days.forEach((dayNumber, index) => {
    const sessionType = sessionTypes[index % sessionTypes.length];

    // Si incluye running, alternar con fuerza
    let finalType = sessionType;
    if (config.workout_types.running && index % 2 === 1 && days.length >= 4) {
      finalType = 'running';
    }

    plan.days[dayNumber] = {
      type: finalType,
      name: getSessionName(finalType, index),
      exercises: [] // Se llena después
    };
  });

  return plan;
}
```

##### Paso 5: Sets y Reps según Objetivo

```typescript
// shared/config/rep-schemes.ts

export const REP_SCHEMES = {
  recomposition: {
    // Híbrido: algo de fuerza, algo de volumen
    compound: { sets: 3, reps: '8-10', rest_seconds: 90 },
    isolation: { sets: 3, reps: '10-12', rest_seconds: 60 },
    accessory: { sets: 2, reps: '12-15', rest_seconds: 45 }
  },

  strength: {
    // Menos reps, más peso, más descanso
    compound: { sets: 4, reps: '5-6', rest_seconds: 120 },
    isolation: { sets: 3, reps: '8-10', rest_seconds: 90 },
    accessory: { sets: 2, reps: '10-12', rest_seconds: 60 }
  },

  endurance: {
    // Más reps, menos descanso
    compound: { sets: 3, reps: '12-15', rest_seconds: 60 },
    isolation: { sets: 3, reps: '15-20', rest_seconds: 45 },
    accessory: { sets: 2, reps: '15-20', rest_seconds: 30 }
  },

  flexibility: {
    // Menos carga, movimiento completo
    compound: { sets: 2, reps: '10-12', rest_seconds: 60 },
    isolation: { sets: 2, reps: '12-15', rest_seconds: 45 },
    accessory: { sets: 2, reps: '12-15', rest_seconds: 45 }
  },

  general_fitness: {
    // Equilibrado
    compound: { sets: 3, reps: '10-12', rest_seconds: 75 },
    isolation: { sets: 3, reps: '12-15', rest_seconds: 60 },
    accessory: { sets: 2, reps: '12-15', rest_seconds: 45 }
  }
} as const;
```

##### Paso 6: Construcción Final de Sesión

```typescript
// shared/lib/workout/session-builder.ts

export function buildSession(
  config: UserWorkoutConfig,
  dayPlan: DayPlan,
  energyLevel?: EnergyLevel
): WorkoutSession {
  // 1. Obtener ejercicios compatibles
  const compatible = getCompatibleExercises(ALL_EXERCISES, config);

  // 2. Seleccionar para esta sesión
  const mainExercises = selectExercisesForSession(compatible, {
    type: dayPlan.type,
    goal: config.primary_goal,
    duration_minutes: config.session_duration,
    level: config.experience_level
  });

  // 3. Aplicar esquema de reps según objetivo
  const repScheme = REP_SCHEMES[config.primary_goal];
  const exercisesWithScheme = mainExercises.map(ex => ({
    ...ex,
    ...repScheme[ex.exercise_order]
  }));

  // 4. Añadir warmup y cooldown
  const warmup = selectWarmupExercises(dayPlan.type, 5); // 5 min
  const cooldown = selectCooldownExercises(dayPlan.type, 5); // 5 min

  // 5. Aplicar ajustes por energía si aplica
  let finalExercises = exercisesWithScheme;
  if (energyLevel && config.use_energy_adjustments) {
    finalExercises = applyEnergyAdjustments(exercisesWithScheme, energyLevel);
  }

  return {
    name: dayPlan.name,
    type: dayPlan.type,
    duration_minutes: config.session_duration,
    warmup,
    main: finalExercises,
    cooldown,
    energy_level: energyLevel,
    generated_at: new Date().toISOString()
  };
}
```

##### Ejemplo: Sesión Generada

**Input**:
- Objetivo: Recomposición
- Días: L, X, V (3 días)
- Dolencias: Rodillas
- Equipo: Mancuernas, banco
- Duración: 45 min
- Nivel: Intermedio

**Output para Lunes (Tren Inferior)**:

```
CALENTAMIENTO (5 min)
├── Movilidad de cadera · 2 min
├── Activación glúteos · 2 min
└── Sentadilla sin peso · 1 min

EJERCICIOS PRINCIPALES
┌──────────────────────────────────────────────────────────┐
│ 1. Hip Thrust (compuesto, glúteos)                       │
│    3 series × 8-10 reps · 90s descanso                  │
│    → Seleccionado: alto score recomp, no afecta rodillas │
├──────────────────────────────────────────────────────────┤
│ 2. RDL Mancuernas (compuesto, isquios)                   │
│    3 series × 8-10 reps · 90s descanso                  │
│    → Seleccionado: trabaja posterior sin impacto rodilla │
├──────────────────────────────────────────────────────────┤
│ 3. Step Up Bajo (compuesto, cuádriceps)                  │
│    3 series × 10-12 reps · 60s descanso                 │
│    → Alternativa a sentadilla profunda por rodillas      │
├──────────────────────────────────────────────────────────┤
│ 4. Curl Isquios Mancuerna (aislamiento)                  │
│    3 series × 10-12 reps · 60s descanso                 │
├──────────────────────────────────────────────────────────┤
│ 5. Elevación Talones (accesorio, gemelos)                │
│    2 series × 12-15 reps · 45s descanso                 │
└──────────────────────────────────────────────────────────┘

VUELTA A LA CALMA (5 min)
├── Estiramiento isquios · 2 min
├── Estiramiento glúteos · 2 min
└── Respiración · 1 min

Notas:
⚠️ Ejercicios de rodilla adaptados (sin sentadilla profunda)
💡 Hip Thrust primero: mejor activación glúteos para recomp
```

##### Base de Ejercicios: Estrategia Mixta

**Fase 1 (MVP)**: ~30 ejercicios manuales
- 10 tren inferior
- 10 tren superior
- 5 core
- 5 movilidad/warmup

Cada uno con ficha completa escrita manualmente.

##### Base de Ejercicios MVP

```typescript
// shared/data/exercises.ts

export const EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: SQUAT (Sentadillas)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'goblet-squat',
    name: { en: 'Goblet Squat', es: 'Sentadilla Goblet' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes', 'core'],
    primary_muscle: 'quads',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 8, strength: 7, endurance: 6, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing, feet shoulder-width', es: 'De pie, pies al ancho de hombros' },
      grip: { en: 'Dumbbell at chest height', es: 'Mancuerna a la altura del pecho' },
      movement: { en: 'Hips down and back, then stand up', es: 'Caderas abajo y atrás, luego levantarse' },
      target_muscles: { en: 'Quadriceps, glutes, core', es: 'Cuádriceps, glúteos, core' },
      key_cue: { en: 'Chest tall, knees follow toes', es: 'Pecho arriba, rodillas siguen los pies' },
      common_mistake: { en: 'Leaning forward, knees collapsing inward', es: 'Inclinarse adelante, rodillas hacia adentro' },
      safety_tip: { en: 'Keep core engaged throughout movement', es: 'Mantén el core activo durante todo el movimiento' }
    },
    swap_alternatives: ['box-squat', 'front-squat']
  },

  {
    slug: 'box-squat',
    name: { en: 'Box Squat', es: 'Sentadilla al Cajón' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes'],
    primary_muscle: 'quads',
    equipment_required: ['bench', 'dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 7, strength: 7, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing with bench behind', es: 'De pie con banco detrás' },
      grip: { en: 'Front or back loaded', es: 'Carga frontal o trasera' },
      movement: { en: 'Sit back to bench then stand', es: 'Sentarse hacia el banco y levantarse' },
      target_muscles: { en: 'Quadriceps, glutes', es: 'Cuádriceps, glúteos' },
      key_cue: { en: 'Soft touch on bench', es: 'Toque suave en el banco' },
      common_mistake: { en: 'Dropping fast onto bench', es: 'Dejarse caer rápido' },
      safety_tip: { en: 'Control the descent, pause briefly on box', es: 'Controla el descenso, pausa breve en el cajón' }
    },
    swap_alternatives: ['goblet-squat']
  },

  {
    slug: 'front-squat',
    name: { en: 'Front Squat', es: 'Sentadilla Frontal' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes', 'core'],
    primary_muscle: 'quads',
    equipment_required: ['barbell'],
    affects_pain_zones: ['wrists', 'knees'],
    goal_scores: { recomposition: 8, strength: 9, endurance: 5, flexibility: 6 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing, barbell in front rack', es: 'De pie, barra en posición frontal' },
      grip: { en: 'Front rack position', es: 'Agarre frontal' },
      movement: { en: 'Squat down keeping torso upright', es: 'Sentadilla manteniendo torso erguido' },
      target_muscles: { en: 'Quadriceps, glutes, core', es: 'Cuádriceps, glúteos, core' },
      key_cue: { en: 'Elbows high throughout', es: 'Codos altos en todo momento' },
      common_mistake: { en: 'Collapsing chest forward', es: 'Pecho cayendo hacia adelante' },
      safety_tip: { en: 'If wrists hurt, use cross-arm grip', es: 'Si duelen las muñecas, usa agarre cruzado' }
    },
    swap_alternatives: ['goblet-squat']
  },

  {
    slug: 'back-squat',
    name: { en: 'Back Squat', es: 'Sentadilla Trasera' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes', 'lower_back'],
    primary_muscle: 'quads',
    equipment_required: ['barbell'],
    affects_pain_zones: ['lower_back', 'knees'],
    goal_scores: { recomposition: 9, strength: 10, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Standing, barbell on upper back', es: 'De pie, barra en espalda alta' },
      grip: { en: 'Barbell on back, hands wide', es: 'Barra en espalda, manos separadas' },
      movement: { en: 'Sit back and down, then stand', es: 'Sentarse atrás y abajo, luego levantarse' },
      target_muscles: { en: 'Quadriceps, glutes, lower back', es: 'Cuádriceps, glúteos, lumbar' },
      key_cue: { en: 'Brace core before descent', es: 'Activar core antes de bajar' },
      common_mistake: { en: 'Butt wink at bottom', es: 'Redondear lumbar abajo' },
      safety_tip: { en: 'Use safety bars, never round lower back', es: 'Usa seguros, nunca redondees la lumbar' }
    },
    swap_alternatives: ['front-squat', 'goblet-squat']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: HINGE (Bisagra de cadera)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'romanian-deadlift',
    name: { en: 'Romanian Deadlift', es: 'Peso Muerto Rumano' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'hamstrings'],
    primary_muscle: 'glutes',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 9, strength: 8, endurance: 5, flexibility: 7 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing, slight knee bend', es: 'De pie, ligera flexión de rodillas' },
      grip: { en: 'Neutral or overhand', es: 'Agarre neutro o prono' },
      movement: { en: 'Hips back, then stand tall', es: 'Caderas atrás, luego erguirse' },
      target_muscles: { en: 'Glutes, hamstrings', es: 'Glúteos, isquiotibiales' },
      key_cue: { en: 'Long spine throughout', es: 'Columna larga en todo momento' },
      common_mistake: { en: 'Rounding back', es: 'Redondear la espalda' },
      safety_tip: { en: 'Feel stretch in hamstrings, not lower back', es: 'Sentir estiramiento en isquios, no en lumbar' }
    },
    swap_alternatives: ['hip-thrust']
  },

  {
    slug: 'conventional-deadlift',
    name: { en: 'Conventional Deadlift', es: 'Peso Muerto Convencional' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'hamstrings', 'lower_back'],
    primary_muscle: 'glutes',
    equipment_required: ['barbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 9, strength: 10, endurance: 4, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Standing over barbell, feet hip-width', es: 'De pie sobre la barra, pies al ancho de cadera' },
      grip: { en: 'Overhand or mixed grip', es: 'Agarre prono o mixto' },
      movement: { en: 'Lift bar from floor by extending hips and knees', es: 'Levantar barra del suelo extendiendo cadera y rodillas' },
      target_muscles: { en: 'Glutes, hamstrings, lower back', es: 'Glúteos, isquios, lumbar' },
      key_cue: { en: 'Push floor away with legs', es: 'Empujar el suelo con las piernas' },
      common_mistake: { en: 'Jerking bar off floor', es: 'Tirar de la barra de golpe' },
      safety_tip: { en: 'Keep bar close to body, neutral spine always', es: 'Barra cerca del cuerpo, columna neutra siempre' }
    },
    swap_alternatives: ['trap-bar-deadlift', 'romanian-deadlift']
  },

  {
    slug: 'trap-bar-deadlift',
    name: { en: 'Trap Bar Deadlift', es: 'Peso Muerto con Barra Hexagonal' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['trap_bar'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 8, strength: 9, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing inside trap bar', es: 'De pie dentro de la barra hexagonal' },
      grip: { en: 'Neutral grip on handles', es: 'Agarre neutro en los mangos' },
      movement: { en: 'Stand up with bar', es: 'Levantarse con la barra' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Chest up, drive through heels', es: 'Pecho arriba, empujar con talones' },
      common_mistake: { en: 'Locking knees at top', es: 'Bloquear rodillas arriba' },
      safety_tip: { en: 'Easier on lower back than conventional', es: 'Más amable con la lumbar que el convencional' }
    },
    swap_alternatives: ['romanian-deadlift']
  },

  {
    slug: 'hip-thrust',
    name: { en: 'Hip Thrust', es: 'Empuje de Cadera' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'core'],
    primary_muscle: 'glutes',
    equipment_required: ['bench', 'dumbbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 9, strength: 7, endurance: 6, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Upper back on bench, feet flat on floor', es: 'Espalda alta en banco, pies planos en el suelo' },
      grip: { en: 'Weight on hips', es: 'Peso sobre la cadera' },
      movement: { en: 'Drive hips up to ceiling', es: 'Empujar caderas hacia el techo' },
      target_muscles: { en: 'Glutes, core', es: 'Glúteos, core' },
      key_cue: { en: 'Pause and squeeze at top', es: 'Pausar y apretar arriba' },
      common_mistake: { en: 'Overarching lower back', es: 'Arquear demasiado la lumbar' },
      safety_tip: { en: 'Chin tucked, ribs down at top', es: 'Barbilla abajo, costillas hacia abajo arriba' }
    },
    swap_alternatives: ['glute-bridge']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: LUNGE (Zancadas)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'static-lunge',
    name: { en: 'Static Lunge', es: 'Zancada Estática' },
    type: 'strength',
    pattern: 'lunge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 6 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Split stance, one foot forward', es: 'Posición dividida, un pie adelante' },
      grip: { en: 'Dumbbells at sides', es: 'Mancuernas a los lados' },
      movement: { en: 'Lower vertically, then rise', es: 'Bajar verticalmente, luego subir' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Long stance, vertical torso', es: 'Zancada larga, torso vertical' },
      common_mistake: { en: 'Too short step', es: 'Paso demasiado corto' },
      safety_tip: { en: 'Front knee tracks over toes', es: 'Rodilla delantera sigue los dedos del pie' }
    },
    swap_alternatives: ['reverse-lunge']
  },

  {
    slug: 'reverse-lunge',
    name: { en: 'Reverse Lunge', es: 'Zancada Inversa' },
    type: 'strength',
    pattern: 'lunge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 6 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing tall', es: 'De pie erguida' },
      grip: { en: 'Dumbbells at sides', es: 'Mancuernas a los lados' },
      movement: { en: 'Step back, lower, then return', es: 'Paso atrás, bajar, volver' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Push through front heel', es: 'Empujar con el talón delantero' },
      common_mistake: { en: 'Falling forward', es: 'Caer hacia adelante' },
      safety_tip: { en: 'Easier on knees than forward lunge', es: 'Más amable con las rodillas que la zancada frontal' }
    },
    swap_alternatives: ['static-lunge']
  },

  {
    slug: 'bulgarian-split-squat',
    name: { en: 'Bulgarian Split Squat', es: 'Sentadilla Búlgara' },
    type: 'strength',
    pattern: 'lunge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['bench', 'dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 9, strength: 8, endurance: 6, flexibility: 7 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Rear foot elevated on bench', es: 'Pie trasero elevado en banco' },
      grip: { en: 'Dumbbells at sides', es: 'Mancuernas a los lados' },
      movement: { en: 'Lower and rise on front leg', es: 'Bajar y subir con pierna delantera' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Slow controlled tempo', es: 'Tempo lento y controlado' },
      common_mistake: { en: 'Dropping too fast', es: 'Bajar demasiado rápido' },
      safety_tip: { en: 'Start bodyweight to find balance', es: 'Empezar sin peso para encontrar el equilibrio' }
    },
    swap_alternatives: ['static-lunge', 'reverse-lunge']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: PUSH HORIZONTAL (Empuje horizontal)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'dumbbell-bench-press-neutral',
    name: { en: 'Dumbbell Bench Press (Neutral)', es: 'Press de Banca con Mancuernas (Neutro)' },
    type: 'strength',
    pattern: 'push_horizontal',
    muscle_groups: ['chest', 'triceps', 'shoulders'],
    primary_muscle: 'chest',
    equipment_required: ['bench', 'dumbbell'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 8, strength: 7, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Lying on bench, feet flat', es: 'Tumbada en banco, pies planos' },
      grip: { en: 'Neutral grip (palms facing each other)', es: 'Agarre neutro (palmas enfrentadas)' },
      movement: { en: 'Lower to chest, then press up', es: 'Bajar al pecho, luego empujar arriba' },
      target_muscles: { en: 'Chest, triceps, shoulders', es: 'Pecho, tríceps, hombros' },
      key_cue: { en: 'Shoulders down and back', es: 'Hombros abajo y atrás' },
      common_mistake: { en: 'Locking elbows at top', es: 'Bloquear codos arriba' },
      safety_tip: { en: 'Neutral grip is easier on shoulders', es: 'Agarre neutro es más amable con los hombros' }
    },
    swap_alternatives: ['floor-press']
  },

  {
    slug: 'barbell-bench-press',
    name: { en: 'Barbell Bench Press', es: 'Press de Banca con Barra' },
    type: 'strength',
    pattern: 'push_horizontal',
    muscle_groups: ['chest', 'triceps'],
    primary_muscle: 'chest',
    equipment_required: ['barbell', 'bench'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 8, strength: 10, endurance: 4, flexibility: 3 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Lying on bench, feet flat', es: 'Tumbada en banco, pies planos' },
      grip: { en: 'Overhand grip, slightly wider than shoulders', es: 'Agarre prono, un poco más ancho que hombros' },
      movement: { en: 'Lower bar to chest, press up', es: 'Bajar barra al pecho, empujar arriba' },
      target_muscles: { en: 'Chest, triceps', es: 'Pecho, tríceps' },
      key_cue: { en: 'Stable shoulders, slight arch', es: 'Hombros estables, ligero arco' },
      common_mistake: { en: 'Bouncing bar off chest', es: 'Rebotar barra en el pecho' },
      safety_tip: { en: 'Always use spotter or safety bars', es: 'Siempre usar ayudante o seguros' }
    },
    swap_alternatives: ['dumbbell-bench-press-neutral']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: PULL (Tirón)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'seated-cable-row',
    name: { en: 'Seated Cable Row', es: 'Remo Sentado en Polea' },
    type: 'strength',
    pattern: 'pull_horizontal',
    muscle_groups: ['back', 'biceps'],
    primary_muscle: 'back',
    equipment_required: ['cable'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 7, strength: 7, endurance: 6, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Seated, feet on platform', es: 'Sentada, pies en plataforma' },
      grip: { en: 'Neutral grip on handle', es: 'Agarre neutro en el mango' },
      movement: { en: 'Pull handle to torso', es: 'Tirar del mango hacia el torso' },
      target_muscles: { en: 'Back, biceps', es: 'Espalda, bíceps' },
      key_cue: { en: 'Chest tall, squeeze shoulder blades', es: 'Pecho arriba, apretar escápulas' },
      common_mistake: { en: 'Leaning too far back', es: 'Inclinarse demasiado atrás' },
      safety_tip: { en: 'Control the return, dont let weight pull you', es: 'Controla el retorno, no dejes que el peso te arrastre' }
    },
    swap_alternatives: ['one-arm-dumbbell-row']
  },

  {
    slug: 'pull-up-assisted',
    name: { en: 'Pull-up Assisted', es: 'Dominada Asistida' },
    type: 'strength',
    pattern: 'pull_vertical',
    muscle_groups: ['lats', 'biceps'],
    primary_muscle: 'lats',
    equipment_required: ['machine'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 7, strength: 8, endurance: 6, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Hanging from bar, knees on pad', es: 'Colgada de la barra, rodillas en soporte' },
      grip: { en: 'Neutral or pronated grip', es: 'Agarre neutro o prono' },
      movement: { en: 'Pull chin to bar level', es: 'Subir barbilla a la altura de la barra' },
      target_muscles: { en: 'Lats, biceps', es: 'Dorsales, bíceps' },
      key_cue: { en: 'Lead with elbows, not hands', es: 'Guiar con los codos, no con las manos' },
      common_mistake: { en: 'Shrugging shoulders', es: 'Encoger los hombros' },
      safety_tip: { en: 'Reduce assistance gradually', es: 'Reducir asistencia gradualmente' }
    },
    swap_alternatives: ['lat-pulldown']
  },

  {
    slug: 'lat-pulldown',
    name: { en: 'Lat Pulldown', es: 'Jalón al Pecho' },
    type: 'strength',
    pattern: 'pull_vertical',
    muscle_groups: ['lats', 'biceps'],
    primary_muscle: 'lats',
    equipment_required: ['cable'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 7, strength: 7, endurance: 6, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Seated, thighs under pad', es: 'Sentada, muslos bajo el soporte' },
      grip: { en: 'Wide or neutral grip', es: 'Agarre ancho o neutro' },
      movement: { en: 'Pull bar to upper chest', es: 'Tirar de la barra al pecho alto' },
      target_muscles: { en: 'Lats, biceps', es: 'Dorsales, bíceps' },
      key_cue: { en: 'Chest tall, lean back slightly', es: 'Pecho arriba, inclinarse ligeramente atrás' },
      common_mistake: { en: 'Leaning too far back', es: 'Inclinarse demasiado atrás' },
      safety_tip: { en: 'Dont pull behind neck', es: 'No tirar detrás del cuello' }
    },
    swap_alternatives: ['pull-up-assisted']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: SHOULDER (Hombros)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'seated-lateral-raise',
    name: { en: 'Seated Lateral Raise', es: 'Elevación Lateral Sentada' },
    type: 'strength',
    pattern: 'shoulder',
    muscle_groups: ['shoulders', 'traps'],
    primary_muscle: 'shoulders',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 4 },
    exercise_order: 'isolation',
    difficulty: 'beginner',
    card: {
      position: { en: 'Seated on bench, feet flat', es: 'Sentada en banco, pies planos' },
      grip: { en: 'Neutral grip, dumbbells at sides', es: 'Agarre neutro, mancuernas a los lados' },
      movement: { en: 'Raise arms sideways to shoulder height', es: 'Elevar brazos lateralmente a la altura del hombro' },
      target_muscles: { en: 'Lateral deltoid, traps', es: 'Deltoides lateral, trapecios' },
      key_cue: { en: 'Light weight, control movement', es: 'Peso ligero, movimiento controlado' },
      common_mistake: { en: 'Shrugging shoulders up', es: 'Encoger los hombros' },
      safety_tip: { en: 'Keep slight bend in elbows', es: 'Mantener ligera flexión en codos' }
    },
    swap_alternatives: ['cable-lateral-raise']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: ARM (Brazos)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'hammer-curl',
    name: { en: 'Hammer Curl', es: 'Curl Martillo' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['biceps', 'forearms'],
    primary_muscle: 'biceps',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['forearms'],
    goal_scores: { recomposition: 5, strength: 6, endurance: 6, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing tall, arms at sides', es: 'De pie erguida, brazos a los lados' },
      grip: { en: 'Neutral grip (palms facing body)', es: 'Agarre neutro (palmas hacia el cuerpo)' },
      movement: { en: 'Curl dumbbells up keeping neutral grip', es: 'Flexionar mancuernas manteniendo agarre neutro' },
      target_muscles: { en: 'Biceps, forearms', es: 'Bíceps, antebrazos' },
      key_cue: { en: 'Elbows close to body', es: 'Codos cerca del cuerpo' },
      common_mistake: { en: 'Swinging body for momentum', es: 'Balancear el cuerpo para impulso' },
      safety_tip: { en: 'Easier on wrists than regular curls', es: 'Más amable con las muñecas que curls normales' }
    },
    swap_alternatives: ['cable-curl']
  },

  {
    slug: 'cable-triceps-pushdown',
    name: { en: 'Cable Triceps Pushdown', es: 'Extensión de Tríceps en Polea' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['triceps'],
    primary_muscle: 'triceps',
    equipment_required: ['cable'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 5, strength: 6, endurance: 6, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable machine', es: 'De pie frente a la polea' },
      grip: { en: 'Rope or bar attachment', es: 'Cuerda o barra' },
      movement: { en: 'Extend elbows downward', es: 'Extender codos hacia abajo' },
      target_muscles: { en: 'Triceps', es: 'Tríceps' },
      key_cue: { en: 'Upper arms still, only forearms move', es: 'Brazos quietos, solo mueven antebrazos' },
      common_mistake: { en: 'Leaning forward with body', es: 'Inclinarse hacia adelante' },
      safety_tip: { en: 'Keep elbows close to body', es: 'Mantener codos cerca del cuerpo' }
    },
    swap_alternatives: ['overhead-triceps-extension']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: CARRY (Acarreos)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'farmer-carry',
    name: { en: 'Farmer Carry', es: 'Paseo del Granjero' },
    type: 'strength',
    pattern: 'carry',
    muscle_groups: ['core', 'grip', 'traps'],
    primary_muscle: 'core',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 7, strength: 7, endurance: 8, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing tall with weights at sides', es: 'De pie erguida con pesos a los lados' },
      grip: { en: 'Neutral grip on heavy dumbbells', es: 'Agarre neutro en mancuernas pesadas' },
      movement: { en: 'Walk forward maintaining posture', es: 'Caminar hacia adelante manteniendo postura' },
      target_muscles: { en: 'Core, grip, traps', es: 'Core, agarre, trapecios' },
      key_cue: { en: 'Tall posture, shoulders back', es: 'Postura alta, hombros atrás' },
      common_mistake: { en: 'Slouching forward', es: 'Encorvarse hacia adelante' },
      safety_tip: { en: 'Great for core without spinal load', es: 'Excelente para core sin cargar la columna' }
    },
    swap_alternatives: ['suitcase-carry']
  },

  // ═══════════════════════════════════════════════════════════════════
  // PATRÓN: CORE
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'dead-bug',
    name: { en: 'Dead Bug', es: 'Bicho Muerto' },
    type: 'strength',
    pattern: 'core',
    muscle_groups: ['core'],
    primary_muscle: 'core',
    equipment_required: ['none'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 6 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Lying on back, arms up, knees at 90°', es: 'Tumbada boca arriba, brazos arriba, rodillas a 90°' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Extend opposite arm and leg, then return', es: 'Extender brazo y pierna opuestos, luego volver' },
      target_muscles: { en: 'Core (anti-extension)', es: 'Core (anti-extensión)' },
      key_cue: { en: 'Lower back stays flat on floor', es: 'Lumbar pegada al suelo' },
      common_mistake: { en: 'Arching lower back', es: 'Arquear la lumbar' },
      safety_tip: { en: 'Excellent for back pain prevention', es: 'Excelente para prevenir dolor de espalda' }
    },
    swap_alternatives: ['plank']
  },

  // ═══════════════════════════════════════════════════════════════════
  // TANDA 2: EJERCICIOS ADICIONALES
  // ═══════════════════════════════════════════════════════════════════

  // SQUAT - Variantes adicionales
  {
    slug: 'cable-squat',
    name: { en: 'Cable Squat', es: 'Sentadilla en Polea' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes', 'core'],
    primary_muscle: 'quads',
    equipment_required: ['cable'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable machine', es: 'De pie frente a la polea' },
      grip: { en: 'Handle at chest height', es: 'Mango a la altura del pecho' },
      movement: { en: 'Sit down and stand keeping tension', es: 'Sentarse y levantarse manteniendo tensión' },
      target_muscles: { en: 'Quadriceps, glutes, core', es: 'Cuádriceps, glúteos, core' },
      key_cue: { en: 'Constant cable tension throughout', es: 'Tensión constante del cable' },
      common_mistake: { en: 'Leaning back too much', es: 'Inclinarse demasiado atrás' },
      safety_tip: { en: 'Great for learning squat pattern', es: 'Excelente para aprender el patrón de sentadilla' }
    },
    swap_alternatives: ['goblet-squat']
  },

  {
    slug: 'hack-squat-dumbbell',
    name: { en: 'Hack Squat Dumbbell (Heels Elevated)', es: 'Hack Squat con Mancuerna (Talones Elevados)' },
    type: 'strength',
    pattern: 'squat',
    muscle_groups: ['quads', 'glutes'],
    primary_muscle: 'quads',
    equipment_required: ['dumbbell', 'plates'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 8, strength: 7, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing, heels on plates', es: 'De pie, talones en discos' },
      grip: { en: 'Dumbbell behind legs', es: 'Mancuerna detrás de las piernas' },
      movement: { en: 'Squat down keeping torso upright', es: 'Sentadilla manteniendo torso erguido' },
      target_muscles: { en: 'Quadriceps (emphasis), glutes', es: 'Cuádriceps (énfasis), glúteos' },
      key_cue: { en: 'Knees forward, torso tall', es: 'Rodillas adelante, torso alto' },
      common_mistake: { en: 'Rounding back', es: 'Redondear la espalda' },
      safety_tip: { en: 'Great for quad focus with less back stress', es: 'Excelente para énfasis en cuádriceps con menos estrés lumbar' }
    },
    swap_alternatives: ['goblet-squat']
  },

  // HINGE - Variantes adicionales
  {
    slug: 'single-leg-romanian-deadlift',
    name: { en: 'Single-Leg Romanian Deadlift', es: 'Peso Muerto Rumano a Una Pierna' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'hamstrings', 'core'],
    primary_muscle: 'glutes',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 8, strength: 7, endurance: 6, flexibility: 8 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing on one leg', es: 'De pie sobre una pierna' },
      grip: { en: 'Single dumbbell opposite hand', es: 'Una mancuerna en mano opuesta' },
      movement: { en: 'Hinge on one leg and return', es: 'Bisagra sobre una pierna y volver' },
      target_muscles: { en: 'Glutes, hamstrings, core (balance)', es: 'Glúteos, isquios, core (equilibrio)' },
      key_cue: { en: 'Keep hips square to floor', es: 'Caderas paralelas al suelo' },
      common_mistake: { en: 'Rotating pelvis open', es: 'Rotar la pelvis hacia fuera' },
      safety_tip: { en: 'Start without weight to master balance', es: 'Empezar sin peso para dominar el equilibrio' }
    },
    swap_alternatives: ['romanian-deadlift']
  },

  {
    slug: 'cable-pull-through',
    name: { en: 'Cable Pull-Through', es: 'Tirón de Cable entre Piernas' },
    type: 'strength',
    pattern: 'hinge',
    muscle_groups: ['glutes', 'hamstrings'],
    primary_muscle: 'glutes',
    equipment_required: ['cable'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 6 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing away from cable', es: 'De pie de espaldas a la polea' },
      grip: { en: 'Rope between legs', es: 'Cuerda entre las piernas' },
      movement: { en: 'Hinge forward then extend hips', es: 'Bisagra adelante, luego extender caderas' },
      target_muscles: { en: 'Glutes, hamstrings', es: 'Glúteos, isquiotibiales' },
      key_cue: { en: 'Push hips back, not down', es: 'Empujar caderas atrás, no abajo' },
      common_mistake: { en: 'Squatting the movement', es: 'Convertirlo en sentadilla' },
      safety_tip: { en: 'Excellent for learning hip hinge', es: 'Excelente para aprender la bisagra de cadera' }
    },
    swap_alternatives: ['romanian-deadlift', 'hip-thrust']
  },

  // LUNGE - Variantes adicionales
  {
    slug: 'walking-lunge',
    name: { en: 'Walking Lunge', es: 'Zancada Caminando' },
    type: 'strength',
    pattern: 'lunge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 8, strength: 7, endurance: 8, flexibility: 6 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing tall', es: 'De pie erguida' },
      grip: { en: 'Dumbbells at sides', es: 'Mancuernas a los lados' },
      movement: { en: 'Step forward alternating legs', es: 'Paso adelante alternando piernas' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Long controlled step', es: 'Paso largo y controlado' },
      common_mistake: { en: 'Rushing reps', es: 'Hacer las repeticiones muy rápido' },
      safety_tip: { en: 'Needs space, ensure clear path', es: 'Necesita espacio, asegurar camino libre' }
    },
    swap_alternatives: ['reverse-lunge', 'static-lunge']
  },

  {
    slug: 'cable-reverse-lunge',
    name: { en: 'Cable Reverse Lunge', es: 'Zancada Inversa en Polea' },
    type: 'strength',
    pattern: 'lunge',
    muscle_groups: ['glutes', 'quads'],
    primary_muscle: 'glutes',
    equipment_required: ['cable'],
    affects_pain_zones: ['knees'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable', es: 'De pie frente a la polea' },
      grip: { en: 'Handle at chest', es: 'Mango al pecho' },
      movement: { en: 'Step back under cable load', es: 'Paso atrás bajo la carga del cable' },
      target_muscles: { en: 'Glutes, quadriceps', es: 'Glúteos, cuádriceps' },
      key_cue: { en: 'Constant tension throughout', es: 'Tensión constante' },
      common_mistake: { en: 'Losing balance', es: 'Perder el equilibrio' },
      safety_tip: { en: 'Cable helps with balance', es: 'El cable ayuda con el equilibrio' }
    },
    swap_alternatives: ['reverse-lunge']
  },

  // PUSH HORIZONTAL - Variantes adicionales
  {
    slug: 'push-up',
    name: { en: 'Push-up', es: 'Flexión de Brazos' },
    type: 'strength',
    pattern: 'push_horizontal',
    muscle_groups: ['chest', 'triceps', 'core'],
    primary_muscle: 'chest',
    equipment_required: ['none'],
    affects_pain_zones: ['wrists'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 8, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Plank position, hands under shoulders', es: 'Posición de plancha, manos bajo hombros' },
      grip: { en: 'Hands flat on floor', es: 'Manos planas en el suelo' },
      movement: { en: 'Lower chest to floor then push up', es: 'Bajar pecho al suelo, luego empujar' },
      target_muscles: { en: 'Chest, triceps, core', es: 'Pecho, tríceps, core' },
      key_cue: { en: 'Body in one straight line', es: 'Cuerpo en línea recta' },
      common_mistake: { en: 'Hips sagging or piking', es: 'Caderas cayendo o subiendo' },
      safety_tip: { en: 'Use push-up handles if wrists hurt', es: 'Usar soportes si duelen las muñecas' }
    },
    swap_alternatives: ['incline-push-up', 'dumbbell-bench-press-neutral']
  },

  {
    slug: 'cable-chest-press',
    name: { en: 'Cable Chest Press', es: 'Press de Pecho en Polea' },
    type: 'strength',
    pattern: 'push_horizontal',
    muscle_groups: ['chest', 'triceps'],
    primary_muscle: 'chest',
    equipment_required: ['cable'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 7, strength: 6, endurance: 7, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing between cables', es: 'De pie entre poleas' },
      grip: { en: 'Handles at chest height', es: 'Mangos a la altura del pecho' },
      movement: { en: 'Press handles forward', es: 'Empujar mangos hacia adelante' },
      target_muscles: { en: 'Chest, triceps', es: 'Pecho, tríceps' },
      key_cue: { en: 'Core braced, stable stance', es: 'Core activo, postura estable' },
      common_mistake: { en: 'Arching back', es: 'Arquear la espalda' },
      safety_tip: { en: 'Stagger feet for stability', es: 'Escalonar pies para estabilidad' }
    },
    swap_alternatives: ['dumbbell-bench-press-neutral']
  },

  // PUSH VERTICAL - Variantes adicionales
  {
    slug: 'arnold-press',
    name: { en: 'Arnold Press', es: 'Press Arnold' },
    type: 'strength',
    pattern: 'push_vertical',
    muscle_groups: ['shoulders', 'triceps'],
    primary_muscle: 'shoulders',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 7, strength: 8, endurance: 5, flexibility: 5 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Seated, dumbbells at shoulders', es: 'Sentada, mancuernas en hombros' },
      grip: { en: 'Supinated rotating to neutral', es: 'Supinado rotando a neutro' },
      movement: { en: 'Rotate and press overhead', es: 'Rotar y presionar sobre la cabeza' },
      target_muscles: { en: 'All deltoid heads, triceps', es: 'Todos los deltoides, tríceps' },
      key_cue: { en: 'Smooth rotation throughout', es: 'Rotación suave durante todo el movimiento' },
      common_mistake: { en: 'Rushing the rotation', es: 'Hacer la rotación muy rápido' },
      safety_tip: { en: 'Start light to master the pattern', es: 'Empezar ligero para dominar el patrón' }
    },
    swap_alternatives: ['neutral-shoulder-press']
  },

  {
    slug: 'cable-overhead-press',
    name: { en: 'Cable Overhead Press', es: 'Press Vertical en Polea' },
    type: 'strength',
    pattern: 'push_vertical',
    muscle_groups: ['shoulders', 'triceps'],
    primary_muscle: 'shoulders',
    equipment_required: ['cable'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 6, strength: 6, endurance: 7, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing facing away from cable', es: 'De pie de espaldas a la polea' },
      grip: { en: 'Rope at shoulder height', es: 'Cuerda a la altura del hombro' },
      movement: { en: 'Press overhead', es: 'Presionar sobre la cabeza' },
      target_muscles: { en: 'Shoulders, triceps', es: 'Hombros, tríceps' },
      key_cue: { en: 'Ribs down, dont arch', es: 'Costillas abajo, no arquear' },
      common_mistake: { en: 'Overextending lower back', es: 'Hiperextender la lumbar' },
      safety_tip: { en: 'Half-kneeling version is safer for back', es: 'Versión de rodillas es más segura para la espalda' }
    },
    swap_alternatives: ['neutral-shoulder-press']
  },

  // PULL HORIZONTAL - Variantes adicionales
  {
    slug: 'bent-over-barbell-row',
    name: { en: 'Bent Over Barbell Row', es: 'Remo con Barra Inclinado' },
    type: 'strength',
    pattern: 'pull_horizontal',
    muscle_groups: ['back', 'biceps'],
    primary_muscle: 'back',
    equipment_required: ['barbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 8, strength: 9, endurance: 5, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Hinged at hips, back flat', es: 'Inclinada desde caderas, espalda plana' },
      grip: { en: 'Overhand grip on barbell', es: 'Agarre prono en barra' },
      movement: { en: 'Row bar to lower chest', es: 'Remar barra al pecho bajo' },
      target_muscles: { en: 'Back, biceps', es: 'Espalda, bíceps' },
      key_cue: { en: 'Flat back throughout', es: 'Espalda plana en todo momento' },
      common_mistake: { en: 'Jerking bar with momentum', es: 'Tirar de la barra con impulso' },
      safety_tip: { en: 'Keep core braced to protect lower back', es: 'Core activo para proteger la lumbar' }
    },
    swap_alternatives: ['one-arm-dumbbell-row', 'seated-cable-row']
  },

  {
    slug: 'chest-supported-dumbbell-row',
    name: { en: 'Chest-Supported Dumbbell Row', es: 'Remo con Mancuernas Apoyada en Banco' },
    type: 'strength',
    pattern: 'pull_horizontal',
    muscle_groups: ['back', 'biceps'],
    primary_muscle: 'back',
    equipment_required: ['bench', 'dumbbell'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 7, strength: 7, endurance: 6, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'beginner',
    card: {
      position: { en: 'Chest on incline bench', es: 'Pecho apoyado en banco inclinado' },
      grip: { en: 'Neutral grip on dumbbells', es: 'Agarre neutro en mancuernas' },
      movement: { en: 'Row both arms simultaneously', es: 'Remar ambos brazos a la vez' },
      target_muscles: { en: 'Back, biceps', es: 'Espalda, bíceps' },
      key_cue: { en: 'No lower back strain', es: 'Sin tensión en la lumbar' },
      common_mistake: { en: 'Shrugging shoulders', es: 'Encoger los hombros' },
      safety_tip: { en: 'Best row variation for back issues', es: 'Mejor variante de remo para problemas de espalda' }
    },
    swap_alternatives: ['seated-cable-row']
  },

  // PULL VERTICAL - Variantes adicionales
  {
    slug: 'straight-arm-pulldown',
    name: { en: 'Straight Arm Pulldown', es: 'Jalón con Brazos Rectos' },
    type: 'strength',
    pattern: 'pull_vertical',
    muscle_groups: ['lats', 'core'],
    primary_muscle: 'lats',
    equipment_required: ['cable'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 5 },
    exercise_order: 'isolation',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable, slight lean', es: 'De pie frente a la polea, ligera inclinación' },
      grip: { en: 'Bar or rope attachment', es: 'Barra o cuerda' },
      movement: { en: 'Pull arms down keeping them straight', es: 'Tirar brazos abajo manteniéndolos rectos' },
      target_muscles: { en: 'Lats, core', es: 'Dorsales, core' },
      key_cue: { en: 'Arms stay long throughout', es: 'Brazos largos en todo momento' },
      common_mistake: { en: 'Bending elbows too much', es: 'Doblar demasiado los codos' },
      safety_tip: { en: 'Great for lat activation', es: 'Excelente para activación de dorsales' }
    },
    swap_alternatives: ['lat-pulldown']
  },

  {
    slug: 'chin-up-assisted',
    name: { en: 'Chin-up Assisted', es: 'Dominada Supina Asistida' },
    type: 'strength',
    pattern: 'pull_vertical',
    muscle_groups: ['lats', 'biceps'],
    primary_muscle: 'lats',
    equipment_required: ['machine'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 7, strength: 8, endurance: 6, flexibility: 4 },
    exercise_order: 'compound_first',
    difficulty: 'advanced',
    card: {
      position: { en: 'Hanging from bar', es: 'Colgada de la barra' },
      grip: { en: 'Supinated (palms facing you)', es: 'Supinado (palmas hacia ti)' },
      movement: { en: 'Pull chin above bar', es: 'Subir barbilla sobre la barra' },
      target_muscles: { en: 'Lats, biceps', es: 'Dorsales, bíceps' },
      key_cue: { en: 'Drive elbows down', es: 'Llevar codos abajo' },
      common_mistake: { en: 'Kipping or swinging', es: 'Usar impulso o balanceo' },
      safety_tip: { en: 'Supinated grip works biceps more', es: 'Agarre supino trabaja más los bíceps' }
    },
    swap_alternatives: ['lat-pulldown', 'pull-up-assisted']
  },

  // SHOULDER - Variantes adicionales
  {
    slug: 'cable-lateral-raise',
    name: { en: 'Cable Lateral Raise', es: 'Elevación Lateral en Polea' },
    type: 'strength',
    pattern: 'shoulder',
    muscle_groups: ['shoulders'],
    primary_muscle: 'shoulders',
    equipment_required: ['cable'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 4 },
    exercise_order: 'isolation',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing side to cable', es: 'De pie lateral a la polea' },
      grip: { en: 'Single handle, arm down', es: 'Un mango, brazo abajo' },
      movement: { en: 'Raise arm sideways', es: 'Elevar brazo lateralmente' },
      target_muscles: { en: 'Lateral deltoid', es: 'Deltoides lateral' },
      key_cue: { en: 'Constant tension from cable', es: 'Tensión constante del cable' },
      common_mistake: { en: 'Swinging for momentum', es: 'Balancear para impulso' },
      safety_tip: { en: 'Better resistance curve than dumbbells', es: 'Mejor curva de resistencia que mancuernas' }
    },
    swap_alternatives: ['seated-lateral-raise']
  },

  {
    slug: 'face-pull',
    name: { en: 'Face Pull', es: 'Tirón a la Cara' },
    type: 'strength',
    pattern: 'shoulder',
    muscle_groups: ['shoulders', 'back'],
    primary_muscle: 'shoulders',
    equipment_required: ['cable'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 6 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable at face height', es: 'De pie frente a polea a la altura de la cara' },
      grip: { en: 'Rope attachment', es: 'Cuerda' },
      movement: { en: 'Pull rope to face, elbows high', es: 'Tirar cuerda a la cara, codos altos' },
      target_muscles: { en: 'Rear deltoid, upper back', es: 'Deltoides posterior, espalda alta' },
      key_cue: { en: 'Elbows stay high throughout', es: 'Codos altos en todo momento' },
      common_mistake: { en: 'Leaning back too much', es: 'Inclinarse demasiado atrás' },
      safety_tip: { en: 'Essential for shoulder health', es: 'Esencial para la salud del hombro' }
    },
    swap_alternatives: ['rear-delt-fly']
  },

  // ARM - Variantes adicionales
  {
    slug: 'ez-bar-curl',
    name: { en: 'EZ Bar Curl', es: 'Curl con Barra EZ' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['biceps', 'forearms'],
    primary_muscle: 'biceps',
    equipment_required: ['ez_bar'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 5, strength: 7, endurance: 5, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing, arms extended', es: 'De pie, brazos extendidos' },
      grip: { en: 'Semi-supinated on EZ bar', es: 'Semi-supinado en barra EZ' },
      movement: { en: 'Curl bar upward', es: 'Flexionar barra hacia arriba' },
      target_muscles: { en: 'Biceps, forearms', es: 'Bíceps, antebrazos' },
      key_cue: { en: 'Elbows fixed at sides', es: 'Codos fijos a los lados' },
      common_mistake: { en: 'Swinging bar with momentum', es: 'Balancear barra con impulso' },
      safety_tip: { en: 'EZ bar is easier on wrists', es: 'Barra EZ es más amable con las muñecas' }
    },
    swap_alternatives: ['hammer-curl', 'cable-curl']
  },

  {
    slug: 'cable-curl',
    name: { en: 'Cable Curl', es: 'Curl en Polea' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['biceps'],
    primary_muscle: 'biceps',
    equipment_required: ['cable'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 5, strength: 5, endurance: 7, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing facing cable', es: 'De pie frente a la polea' },
      grip: { en: 'Bar or rope attachment', es: 'Barra o cuerda' },
      movement: { en: 'Curl handle upward', es: 'Flexionar mango hacia arriba' },
      target_muscles: { en: 'Biceps', es: 'Bíceps' },
      key_cue: { en: 'Constant tension from cable', es: 'Tensión constante del cable' },
      common_mistake: { en: 'Leaning back', es: 'Inclinarse atrás' },
      safety_tip: { en: 'Great for continuous tension', es: 'Excelente para tensión continua' }
    },
    swap_alternatives: ['hammer-curl']
  },

  {
    slug: 'skull-crushers',
    name: { en: 'Skull Crushers', es: 'Rompecráneos' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['triceps'],
    primary_muscle: 'triceps',
    equipment_required: ['ez_bar', 'bench'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 5, strength: 7, endurance: 5, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'advanced',
    card: {
      position: { en: 'Lying on bench, arms vertical', es: 'Tumbada en banco, brazos verticales' },
      grip: { en: 'Narrow grip on EZ bar', es: 'Agarre estrecho en barra EZ' },
      movement: { en: 'Lower bar to forehead, then extend', es: 'Bajar barra a la frente, luego extender' },
      target_muscles: { en: 'Triceps (long head)', es: 'Tríceps (cabeza larga)' },
      key_cue: { en: 'Elbows stay fixed in place', es: 'Codos fijos en su lugar' },
      common_mistake: { en: 'Flaring elbows out', es: 'Abrir codos hacia fuera' },
      safety_tip: { en: 'Control the weight, protect your face', es: 'Controla el peso, protege tu cara' }
    },
    swap_alternatives: ['cable-triceps-pushdown']
  },

  {
    slug: 'cable-overhead-triceps-extension',
    name: { en: 'Cable Overhead Triceps Extension', es: 'Extensión de Tríceps Overhead en Polea' },
    type: 'strength',
    pattern: 'arm',
    muscle_groups: ['triceps'],
    primary_muscle: 'triceps',
    equipment_required: ['cable'],
    affects_pain_zones: ['elbows'],
    goal_scores: { recomposition: 5, strength: 6, endurance: 6, flexibility: 4 },
    exercise_order: 'accessory',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Facing away from cable, staggered stance', es: 'De espaldas a la polea, pies escalonados' },
      grip: { en: 'Rope overhead', es: 'Cuerda sobre la cabeza' },
      movement: { en: 'Extend elbows overhead', es: 'Extender codos sobre la cabeza' },
      target_muscles: { en: 'Triceps (long head stretch)', es: 'Tríceps (estiramiento cabeza larga)' },
      key_cue: { en: 'Keep core tight', es: 'Core apretado' },
      common_mistake: { en: 'Arching lower back', es: 'Arquear la lumbar' },
      safety_tip: { en: 'Great for triceps long head', es: 'Excelente para cabeza larga del tríceps' }
    },
    swap_alternatives: ['cable-triceps-pushdown']
  },

  // CARRY - Variantes adicionales
  {
    slug: 'front-carry',
    name: { en: 'Front Carry', es: 'Acarreo Frontal' },
    type: 'strength',
    pattern: 'carry',
    muscle_groups: ['core', 'back'],
    primary_muscle: 'core',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 6, strength: 6, endurance: 8, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing, weight at chest', es: 'De pie, peso al pecho' },
      grip: { en: 'Goblet hold on dumbbell', es: 'Agarre goblet en mancuerna' },
      movement: { en: 'Walk holding load in front', es: 'Caminar con carga al frente' },
      target_muscles: { en: 'Core (anti-extension), upper back', es: 'Core (anti-extensión), espalda alta' },
      key_cue: { en: 'Ribs down, dont lean back', es: 'Costillas abajo, no inclinarse atrás' },
      common_mistake: { en: 'Leaning back to balance', es: 'Inclinarse atrás para equilibrar' },
      safety_tip: { en: 'Excellent for anti-extension strength', es: 'Excelente para fuerza anti-extensión' }
    },
    swap_alternatives: ['farmer-carry']
  },

  {
    slug: 'overhead-carry',
    name: { en: 'Overhead Carry', es: 'Acarreo Overhead' },
    type: 'strength',
    pattern: 'carry',
    muscle_groups: ['core', 'shoulders'],
    primary_muscle: 'core',
    equipment_required: ['dumbbell'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 6, strength: 7, endurance: 7, flexibility: 5 },
    exercise_order: 'accessory',
    difficulty: 'advanced',
    card: {
      position: { en: 'Standing, arm locked overhead', es: 'De pie, brazo bloqueado arriba' },
      grip: { en: 'Single dumbbell overhead', es: 'Una mancuerna sobre la cabeza' },
      movement: { en: 'Walk with load overhead', es: 'Caminar con carga arriba' },
      target_muscles: { en: 'Core (anti-lateral flexion), shoulders', es: 'Core (anti-flexión lateral), hombros' },
      key_cue: { en: 'Arm stays locked, ribs down', es: 'Brazo bloqueado, costillas abajo' },
      common_mistake: { en: 'Bending elbow', es: 'Doblar el codo' },
      safety_tip: { en: 'Start light, requires good shoulder mobility', es: 'Empezar ligero, requiere buena movilidad de hombro' }
    },
    swap_alternatives: ['front-carry', 'farmer-carry']
  },

  // CORE - Variantes adicionales
  {
    slug: 'cable-pallof-press',
    name: { en: 'Cable Pallof Press', es: 'Press Pallof en Polea' },
    type: 'strength',
    pattern: 'core',
    muscle_groups: ['core'],
    primary_muscle: 'core',
    equipment_required: ['cable'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 8, flexibility: 4 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing perpendicular to cable', es: 'De pie perpendicular a la polea' },
      grip: { en: 'Handle at chest', es: 'Mango al pecho' },
      movement: { en: 'Press handle forward resisting rotation', es: 'Presionar mango adelante resistiendo rotación' },
      target_muscles: { en: 'Core (anti-rotation)', es: 'Core (anti-rotación)' },
      key_cue: { en: 'No torso movement at all', es: 'Sin movimiento del torso' },
      common_mistake: { en: 'Twisting body towards cable', es: 'Rotar cuerpo hacia la polea' },
      safety_tip: { en: 'Best anti-rotation exercise', es: 'Mejor ejercicio anti-rotación' }
    },
    swap_alternatives: ['dead-bug']
  },

  {
    slug: 'cable-woodchopper',
    name: { en: 'Cable Woodchopper', es: 'Leñador en Polea' },
    type: 'strength',
    pattern: 'core',
    muscle_groups: ['core', 'obliques'],
    primary_muscle: 'core',
    equipment_required: ['cable'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 5 },
    exercise_order: 'accessory',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Standing side to cable', es: 'De pie lateral a la polea' },
      grip: { en: 'Both hands on handle', es: 'Ambas manos en el mango' },
      movement: { en: 'Rotate torso diagonally', es: 'Rotar torso diagonalmente' },
      target_muscles: { en: 'Core (rotation), obliques', es: 'Core (rotación), oblicuos' },
      key_cue: { en: 'Hips stay stable, rotate from core', es: 'Caderas estables, rotar desde el core' },
      common_mistake: { en: 'Using only arms', es: 'Usar solo los brazos' },
      safety_tip: { en: 'Control the rotation, dont jerk', es: 'Controlar la rotación, no tirar de golpe' }
    },
    swap_alternatives: ['cable-pallof-press']
  },

  // ═══════════════════════════════════════════════════════════════════
  // WARMUP / MOVILIDAD
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'cat-cow',
    name: { en: 'Cat-Cow', es: 'Gato-Vaca' },
    type: 'warmup',
    pattern: 'mobility',
    muscle_groups: ['spine', 'core'],
    primary_muscle: 'spine',
    equipment_required: ['none'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 3, strength: 2, endurance: 4, flexibility: 9 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Quadruped (hands and knees)', es: 'Cuadrupedia (manos y rodillas)' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Alternate spinal flexion and extension', es: 'Alternar flexión y extensión de columna' },
      target_muscles: { en: 'Spine mobility, core', es: 'Movilidad de columna, core' },
      key_cue: { en: 'Move slowly with breath', es: 'Mover lentamente con la respiración' },
      common_mistake: { en: 'Rushing the movement', es: 'Hacer el movimiento muy rápido' },
      safety_tip: { en: 'Great for back stiffness', es: 'Excelente para rigidez de espalda' }
    },
    swap_alternatives: ['thread-the-needle'],
    recommended_reps: '6-8'
  },

  {
    slug: 'hip-circles',
    name: { en: 'Hip Circles', es: 'Círculos de Cadera' },
    type: 'warmup',
    pattern: 'mobility',
    muscle_groups: ['hips', 'core'],
    primary_muscle: 'hips',
    equipment_required: ['none'],
    affects_pain_zones: ['hips'],
    goal_scores: { recomposition: 2, strength: 2, endurance: 3, flexibility: 8 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing or quadruped', es: 'De pie o en cuadrupedia' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Draw circles with hips', es: 'Dibujar círculos con las caderas' },
      target_muscles: { en: 'Hip mobility, core', es: 'Movilidad de cadera, core' },
      key_cue: { en: 'Smooth controlled circles', es: 'Círculos suaves y controlados' },
      common_mistake: { en: 'Moving too fast', es: 'Moverse demasiado rápido' },
      safety_tip: { en: 'Essential before lower body work', es: 'Esencial antes de trabajar tren inferior' }
    },
    swap_alternatives: ['worlds-greatest-stretch'],
    recommended_reps: '6-8 each direction'
  },

  {
    slug: 'worlds-greatest-stretch',
    name: { en: "World's Greatest Stretch", es: 'El Mejor Estiramiento del Mundo' },
    type: 'warmup',
    pattern: 'mobility',
    muscle_groups: ['hips', 'spine', 'hamstrings', 'shoulders'],
    primary_muscle: 'hips',
    equipment_required: ['none'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 3, strength: 2, endurance: 4, flexibility: 10 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Lunge position on floor', es: 'Posición de zancada en el suelo' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Lunge with thoracic rotation', es: 'Zancada con rotación torácica' },
      target_muscles: { en: 'Hips, thoracic spine, hamstrings', es: 'Caderas, columna torácica, isquios' },
      key_cue: { en: 'Rotate from upper back', es: 'Rotar desde la espalda alta' },
      common_mistake: { en: 'Forcing range of motion', es: 'Forzar el rango de movimiento' },
      safety_tip: { en: 'Best all-in-one warmup stretch', es: 'Mejor estiramiento todo-en-uno para calentar' }
    },
    swap_alternatives: ['hip-circles'],
    recommended_reps: '4-6 per side'
  },

  {
    slug: 'shoulder-dislocates',
    name: { en: 'Shoulder Dislocates', es: 'Dislocaciones de Hombro' },
    type: 'warmup',
    pattern: 'mobility',
    muscle_groups: ['shoulders', 'back'],
    primary_muscle: 'shoulders',
    equipment_required: ['band'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 2, strength: 2, endurance: 3, flexibility: 9 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Standing tall', es: 'De pie erguida' },
      grip: { en: 'Wide grip on band', es: 'Agarre ancho en banda' },
      movement: { en: 'Band pass-through overhead and behind', es: 'Pasar banda por encima y detrás' },
      target_muscles: { en: 'Shoulder mobility, upper back', es: 'Movilidad de hombro, espalda alta' },
      key_cue: { en: 'Wide grip, pain-free range only', es: 'Agarre ancho, solo rango sin dolor' },
      common_mistake: { en: 'Grip too narrow', es: 'Agarre demasiado estrecho' },
      safety_tip: { en: 'Stop if any shoulder pain', es: 'Parar si hay dolor de hombro' }
    },
    swap_alternatives: ['thread-the-needle'],
    recommended_reps: '8-10'
  },

  {
    slug: 'glute-bridge-activation',
    name: { en: 'Glute Bridge (Activation)', es: 'Puente de Glúteos (Activación)' },
    type: 'warmup',
    pattern: 'activation',
    muscle_groups: ['glutes', 'core'],
    primary_muscle: 'glutes',
    equipment_required: ['none'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 4, strength: 3, endurance: 5, flexibility: 5 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Lying on back, knees bent', es: 'Tumbada boca arriba, rodillas flexionadas' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Lift hips squeezing glutes', es: 'Elevar caderas apretando glúteos' },
      target_muscles: { en: 'Glutes, core', es: 'Glúteos, core' },
      key_cue: { en: 'Squeeze hard at top', es: 'Apretar fuerte arriba' },
      common_mistake: { en: 'Overextending lower back', es: 'Hiperextender la lumbar' },
      safety_tip: { en: 'Essential before squats and lunges', es: 'Esencial antes de sentadillas y zancadas' }
    },
    swap_alternatives: ['hip-thrust'],
    recommended_reps: '10-12'
  },

  {
    slug: 'bird-dog',
    name: { en: 'Bird Dog', es: 'Perro-Pájaro' },
    type: 'warmup',
    pattern: 'stability',
    muscle_groups: ['core', 'glutes'],
    primary_muscle: 'core',
    equipment_required: ['none'],
    affects_pain_zones: ['lower_back'],
    goal_scores: { recomposition: 5, strength: 4, endurance: 6, flexibility: 6 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Quadruped (hands and knees)', es: 'Cuadrupedia (manos y rodillas)' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Extend opposite arm and leg', es: 'Extender brazo y pierna opuestos' },
      target_muscles: { en: 'Core stability, glutes', es: 'Estabilidad de core, glúteos' },
      key_cue: { en: 'Keep hips square to floor', es: 'Caderas paralelas al suelo' },
      common_mistake: { en: 'Arching lower back', es: 'Arquear la lumbar' },
      safety_tip: { en: 'Great for back pain prevention', es: 'Excelente para prevenir dolor de espalda' }
    },
    swap_alternatives: ['dead-bug'],
    recommended_reps: '6-8 per side'
  },

  {
    slug: 'thread-the-needle',
    name: { en: 'Thread the Needle', es: 'Enhebrar la Aguja' },
    type: 'warmup',
    pattern: 'mobility',
    muscle_groups: ['spine', 'shoulders', 'neck'],
    primary_muscle: 'spine',
    equipment_required: ['none'],
    affects_pain_zones: ['neck'],
    goal_scores: { recomposition: 2, strength: 2, endurance: 3, flexibility: 9 },
    exercise_order: 'warmup',
    difficulty: 'beginner',
    card: {
      position: { en: 'Quadruped (hands and knees)', es: 'Cuadrupedia (manos y rodillas)' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Rotate upper body threading arm under', es: 'Rotar torso pasando brazo por debajo' },
      target_muscles: { en: 'Thoracic mobility, shoulders', es: 'Movilidad torácica, hombros' },
      key_cue: { en: 'Rotate gently, follow with eyes', es: 'Rotar suavemente, seguir con la mirada' },
      common_mistake: { en: 'Forcing the stretch', es: 'Forzar el estiramiento' },
      safety_tip: { en: 'Excellent for upper back stiffness', es: 'Excelente para rigidez de espalda alta' }
    },
    swap_alternatives: ['cat-cow'],
    recommended_reps: '6-8 per side'
  },

  // ═══════════════════════════════════════════════════════════════════
  // CORE EXTRA
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'plank',
    name: { en: 'Plank', es: 'Plancha' },
    type: 'strength',
    pattern: 'core',
    muscle_groups: ['core', 'shoulders'],
    primary_muscle: 'core',
    equipment_required: ['none'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 8, flexibility: 3 },
    exercise_order: 'accessory',
    difficulty: 'beginner',
    card: {
      position: { en: 'Forearms and toes on floor', es: 'Antebrazos y puntas de pies en el suelo' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Isometric hold', es: 'Mantener posición' },
      target_muscles: { en: 'Core (anti-extension), shoulders', es: 'Core (anti-extensión), hombros' },
      key_cue: { en: 'Ribs down, glutes tight', es: 'Costillas abajo, glúteos apretados' },
      common_mistake: { en: 'Hips sagging or piking', es: 'Caderas cayendo o subiendo' },
      safety_tip: { en: 'Keep breathing throughout', es: 'Seguir respirando durante todo el ejercicio' }
    },
    swap_alternatives: ['dead-bug'],
    recommended_time: '20-40s'
  },

  {
    slug: 'side-plank',
    name: { en: 'Side Plank', es: 'Plancha Lateral' },
    type: 'strength',
    pattern: 'core',
    muscle_groups: ['core', 'obliques', 'glutes'],
    primary_muscle: 'core',
    equipment_required: ['none'],
    affects_pain_zones: ['shoulders'],
    goal_scores: { recomposition: 6, strength: 5, endurance: 7, flexibility: 4 },
    exercise_order: 'accessory',
    difficulty: 'intermediate',
    card: {
      position: { en: 'Side lying, forearm and feet stacked', es: 'De lado, antebrazo y pies apilados' },
      grip: { en: 'None', es: 'Sin agarre' },
      movement: { en: 'Isometric hold', es: 'Mantener posición' },
      target_muscles: { en: 'Core (anti-lateral flexion), obliques', es: 'Core (anti-flexión lateral), oblicuos' },
      key_cue: { en: 'Straight line from head to feet', es: 'Línea recta de cabeza a pies' },
      common_mistake: { en: 'Hips dropping', es: 'Caderas cayendo' },
      safety_tip: { en: 'Can modify on knees if needed', es: 'Se puede modificar sobre rodillas si es necesario' }
    },
    swap_alternatives: ['cable-pallof-press'],
    recommended_time: '15-30s per side'
  }
];
```

**Resumen de ejercicios incluidos (55 ejercicios)**:

| Patrón | Ejercicios | Cantidad |
|--------|------------|----------|
| Squat | Goblet, Box, Front, Back, Cable, Hack Squat DB | 6 |
| Hinge | Romanian DL, Conventional DL, Trap Bar DL, Hip Thrust, Single-Leg RDL, Cable Pull-Through | 6 |
| Lunge | Static, Reverse, Bulgarian Split Squat, Walking, Cable Reverse | 5 |
| Push Horizontal | DB Bench Neutral, Barbell Bench, Push-up, Cable Chest Press | 4 |
| Push Vertical | Arnold Press, Cable Overhead Press | 2 |
| Pull Horizontal | Seated Cable Row, Bent Over Row, Chest-Supported Row | 3 |
| Pull Vertical | Pull-up Assisted, Lat Pulldown, Straight Arm Pulldown, Chin-up Assisted | 4 |
| Shoulder | Seated Lateral Raise, Cable Lateral Raise, Face Pull | 3 |
| Arm (Biceps) | Hammer Curl, EZ Bar Curl, Cable Curl | 3 |
| Arm (Triceps) | Cable Pushdown, Skull Crushers, Cable Overhead Extension | 3 |
| Carry | Farmer, Front, Overhead | 3 |
| Core | Dead Bug, Pallof Press, Woodchopper, Plank, Side Plank | 5 |
| **Warmup/Movilidad** | Cat-Cow, Hip Circles, World's Greatest Stretch, Shoulder Dislocates, Glute Bridge Activation, Bird Dog, Thread the Needle | **7** |
| **TOTAL** | | **55** |

**Estado**: ✅ Base completa para MVP - incluye warmup y cooldown

##### Sistema de Adaptación de Ejercicios

El sistema adapta automáticamente los ejercicios a cada usuaria mediante **6 capas de personalización**:

**1. Filtrado por Dolencias (Pain Zones)**

```typescript
// Si usuaria marca "rodillas" en onboarding
const userConfig = { pain_zones: ['knees'] };

// Estos ejercicios se EXCLUYEN automáticamente:
// - back-squat (affects_pain_zones: ['lower_back', 'knees'])
// - bulgarian-split-squat (affects_pain_zones: ['knees'])
// - front-squat (affects_pain_zones: ['wrists', 'knees'])

// Estos se PRIORIZAN (no afectan rodillas):
// - hip-thrust (affects_pain_zones: ['lower_back'])
// - cable-pull-through (affects_pain_zones: ['lower_back'])
// - romanian-deadlift (affects_pain_zones: ['lower_back'])
```

**2. Filtrado por Equipamiento Disponible**

```typescript
// Si usuaria entrena en casa con solo mancuernas y banco
const userConfig = {
  training_location: 'home',
  available_equipment: ['dumbbell', 'bench']
};

// Se EXCLUYEN ejercicios que requieren:
// - cable (seated-cable-row, lat-pulldown, etc.)
// - barbell (back-squat, conventional-deadlift)
// - machine (pull-up-assisted)

// Se INCLUYEN solo ejercicios compatibles:
// - goblet-squat (equipment: ['dumbbell'])
// - romanian-deadlift (equipment: ['dumbbell'])
// - dumbbell-bench-press-neutral (equipment: ['bench', 'dumbbell'])
```

**3. Selección por Objetivo (Goal Scores)**

Cada ejercicio tiene puntuación 0-10 por objetivo. El algoritmo prioriza según el objetivo de la usuaria:

```typescript
// Objetivo: Recomposición corporal
// Prioriza ejercicios con alto goal_scores.recomposition:
// 1. hip-thrust (9), romanian-deadlift (9), back-squat (9)
// 2. bulgarian-split-squat (9), conventional-deadlift (9)
// 3. goblet-squat (8), front-squat (8), walking-lunge (8)

// Objetivo: Fuerza pura
// Prioriza goal_scores.strength:
// 1. back-squat (10), conventional-deadlift (10), barbell-bench-press (10)
// 2. front-squat (9), trap-bar-deadlift (9), bent-over-barbell-row (9)

// Objetivo: Resistencia/Endurance
// Prioriza goal_scores.endurance:
// 1. push-up (8), walking-lunge (8), farmer-carry (8), front-carry (8)
// 2. cable-pallof-press (8), dead-bug (7), cable exercises...
```

**4. Ajuste por Energía Diaria (Obligatorio)**

La usuaria indica cómo se siente HOY. El sistema ajusta automáticamente:

```typescript
export const ENERGY_ADJUSTMENTS = {
  very_low: {
    // "Hoy estoy agotada"
    intensity_modifier: 0.60,    // 40% menos peso
    rest_modifier: 1.50,         // 50% más descanso
    volume_modifier: 0.70,       // 30% menos series
    allow_skip: true,            // Puede saltarse el entreno
    suggested_alternatives: ['mobility', 'light_cardio']
  },
  low: {
    // "Me siento cansada"
    intensity_modifier: 0.80,
    rest_modifier: 1.20,
    volume_modifier: 0.90,
    message: 'Hoy tu cuerpo pide ir más suave. Está bien.'
  },
  normal: {
    // "Normal, bien"
    intensity_modifier: 1.00,
    rest_modifier: 1.00,
    volume_modifier: 1.00
  },
  high: {
    // "Con energía!"
    intensity_modifier: 1.00,
    rest_modifier: 1.00,
    volume_modifier: 1.00,
    allow_progression: true      // Puede subir peso
  },
  very_high: {
    // "A tope!"
    intensity_modifier: 1.05,    // Puede intentar +5%
    rest_modifier: 0.90,
    volume_modifier: 1.00,
    suggest_challenge: true      // Ofrecer variantes más difíciles
  }
};
```

**4b. Fase del Ciclo (Opcional, Solo localStorage)**

Sistema híbrido que respeta la privacidad:
- **Energía**: SIEMPRE se pregunta, se guarda en BD para analytics/progreso
- **Fase del ciclo**: OPCIONAL, toggle en settings, NUNCA se envía al servidor

```typescript
// En localStorage del navegador (NUNCA en BD)
interface LocalCycleData {
  enabled: boolean;
  currentPhase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null;
  lastUpdated: string; // ISO date
}

// Hook para leer fase (client-only)
function useCyclePhase() {
  const [phase, setPhase] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('kira_cycle');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.enabled) setPhase(parsed.currentPhase);
    }
  }, []);

  return phase;
}

// Ajustes por fase (complementan los ajustes de energía)
export const PHASE_RECOMMENDATIONS = {
  menstrual: {
    // Días 1-5: Menstruación
    focus: 'recovery',
    tips: [
      'Es normal tener menos energía',
      'Prioriza descanso si lo necesitas',
      'El hierro baja - considera suplemento'
    ],
    suggested_workout_types: ['light', 'mobility', 'yoga'],
    nutrition_focus: 'iron_rich_foods'
  },
  follicular: {
    // Días 6-13: Post-menstruación
    focus: 'strength',
    tips: [
      'Buen momento para entrenamientos intensos',
      'Tu cuerpo recupera mejor ahora',
      'Aprovecha para probar nuevos ejercicios'
    ],
    suggested_workout_types: ['strength', 'hiit'],
    allow_progression: true
  },
  ovulatory: {
    // Días 14-16: Ovulación
    focus: 'power',
    tips: [
      'Máxima energía del ciclo',
      'Ideal para records personales',
      'Cuidado con lesiones por exceso de confianza'
    ],
    suggested_workout_types: ['strength', 'power'],
    intensity_boost: 1.05
  },
  luteal: {
    // Días 17-28: Pre-menstruación
    focus: 'maintenance',
    tips: [
      'Es normal sentirse más hinchada',
      'Reduce intensidad si sientes fatiga',
      'El magnesio puede ayudar con síntomas PMS'
    ],
    suggested_workout_types: ['moderate', 'endurance'],
    hydration_reminder: true
  }
};
```

**UX del Sistema Híbrido**:

```
┌─────────────────────────────────────────┐
│  ¿Cómo te sientes hoy?                  │ ← SIEMPRE
│                                          │
│  😴  😐  🙂  😊  🔥                      │
│  (1)  (2)  (3)  (4)  (5)                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ☐ Quiero indicar mi fase del ciclo     │ ← Toggle en Settings
│    (Solo se guarda en tu dispositivo)   │
│                                          │
│  Si activa:                             │
│  ┌────────────────────────────────────┐ │
│  │ Fase actual:                       │ │
│  │ ○ Menstrual (días 1-5)            │ │
│  │ ○ Folicular (días 6-13)           │ │
│  │ ● Ovulatoria (días 14-16)         │ │
│  │ ○ Lútea (días 17-28)              │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Privacidad**:
- ✅ Datos de energía → BD (necesarios para progreso)
- ✅ Fase del ciclo → localStorage ÚNICAMENTE
- ✅ Nunca se transmite al servidor
- ✅ Se borra al limpiar datos del navegador
- ✅ No aparece en exports ni backups
- ✅ Cumple GDPR sin complejidad adicional

**5. Filtrado por Nivel de Experiencia**

```typescript
// Beginner: Solo ejercicios difficulty: 'beginner'
// - goblet-squat ✓
// - hip-thrust ✓
// - back-squat ✗ (advanced)
// - bulgarian-split-squat ✗ (advanced)

// Intermediate: Beginner + Intermediate
// - Acceso a casi toda la base
// - Se excluyen solo los advanced más técnicos

// Advanced: Todo disponible
```

**6. Swaps en Tiempo Real**

Cada ejercicio tiene `swap_alternatives`. En el gimnasio, si el equipo no está disponible:

```typescript
// Usuario ve: "Hip Thrust - 3x10"
// Toca botón "Cambiar" porque no hay banco libre
// Sistema muestra alternativas compatibles:

const hipThrust = EXERCISES.find(e => e.slug === 'hip-thrust');
// swap_alternatives: ['glute-bridge']

// Filtrado adicional: solo mostrar alternativas que:
// 1. El usuario tiene el equipo
// 2. No afectan sus pain_zones
// 3. Trabajan el mismo muscle_group

// Resultado: "Glute Bridge" como alternativa
```

**Flujo Completo de Personalización**

```
┌─────────────────────────────────────────────────────────────────┐
│                    46 EJERCICIOS EN BASE                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FILTRO 1: Pain Zones                                           │
│  Usuario marcó: rodillas, muñecas                               │
│  Resultado: 32 ejercicios compatibles                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FILTRO 2: Equipamiento                                         │
│  Usuario tiene: mancuernas, banco, cable                        │
│  Resultado: 28 ejercicios disponibles                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FILTRO 3: Nivel                                                │
│  Usuario es: intermediate                                       │
│  Resultado: 25 ejercicios apropiados                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SELECCIÓN: Por objetivo + distribución muscular                │
│  Objetivo: recomposition                                        │
│  Sesión: Lower Body, 45 min                                     │
│  Resultado: 5-6 ejercicios seleccionados                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AJUSTE: Por energía de hoy                                     │
│  Usuario indicó: "low" (cansada)                                │
│  Resultado: -20% peso, +20% descanso, -10% series               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SESIÓN FINAL PERSONALIZADA                                     │
│                                                                 │
│  1. Hip Thrust - 3x8-10 (72s descanso)                         │
│  2. Romanian Deadlift - 3x8-10 (72s descanso)                  │
│  3. Cable Pull-Through - 2x10-12 (54s descanso)                │
│  4. Reverse Lunge - 2x10-12 (54s descanso)                     │
│  5. Dead Bug - 2x12-15 (45s descanso)                          │
│                                                                 │
│  Nota: "Hoy tu cuerpo pide ir más suave. Está bien."           │
└─────────────────────────────────────────────────────────────────┘
```

**Fase 2**: Expansión con IA
- Claude genera fichas para ejercicios nuevos
- Revisión humana antes de publicar
- Template:
```
Genera ficha para: "Zancada con mancuernas"
Incluye: posición, movimiento, músculos, error común, tip de seguridad
Tono: claro, práctico, sin jerga médica
Formato: JSON con traducciones en/es
```

**Fase 3**: API externa (opcional)
- ExerciseDB o similar para imágenes/videos
- Mapear a nuestro sistema de scoring

#### UI: Onboarding de Configuración

```
PASO 1: Tu objetivo
┌─────────────────────────────────────────────────┐
│  ¿Qué quieres conseguir principalmente?         │
│                                                 │
│  [○] Recomposición corporal                     │
│      Perder grasa y ganar músculo               │
│                                                 │
│  [○] Ganar fuerza                               │
│      Sentirte más fuerte en el día a día        │
│                                                 │
│  [○] Mejorar resistencia                        │
│      Más energía y menos fatiga                 │
│                                                 │
│  [○] Flexibilidad y movilidad                   │
│      Moverme mejor, menos rigidez               │
│                                                 │
│  [○] Bienestar general                          │
│      Un poco de todo                            │
└─────────────────────────────────────────────────┘

PASO 2: Tu semana
┌─────────────────────────────────────────────────┐
│  ¿Qué días puedes entrenar?                     │
│                                                 │
│  [L] [M] [X] [J] [V] [S] [D]                   │
│   ✓       ✓       ✓                            │
│                                                 │
│  ¿Cuánto tiempo tienes por sesión?              │
│  [30 min] [45 min] [60 min]                     │
│                                                 │
│  ¿A qué hora sueles entrenar?                   │
│  [Mañana] [Mediodía] [Tarde] [Flexible]         │
└─────────────────────────────────────────────────┘

PASO 3: Tu cuerpo (CRÍTICO)
┌─────────────────────────────────────────────────┐
│  ¿Tienes molestias en alguna zona?              │
│  Adaptaremos los ejercicios para cuidarte       │
│                                                 │
│  [□] Muñecas                                    │
│  [□] Antebrazos                                 │
│  [□] Hombros                                    │
│  [□] Cuello                                     │
│  [□] Espalda baja                               │
│  [□] Rodillas                                   │
│  [□] Caderas                                    │
│  [□] Ninguna molestia actual                    │
│                                                 │
│  ¿Algo más que debamos saber?                   │
│  ┌─────────────────────────────────────────┐    │
│  │ Ej: tengo artrosis en mano derecha...  │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘

PASO 4: Tu equipamiento
┌─────────────────────────────────────────────────┐
│  ¿Dónde entrenas normalmente?                   │
│                                                 │
│  [○] Gimnasio                                   │
│  [○] Casa                                       │
│  [○] Ambos                                      │
│                                                 │
│  ¿Qué tienes disponible?                        │
│  [□] Mancuernas                                 │
│  [□] Banco                                      │
│  [□] Bandas elásticas                           │
│  [□] Esterilla                                  │
│  [□] Máquinas de gimnasio                       │
│  [□] Solo mi cuerpo                             │
└─────────────────────────────────────────────────┘

PASO 5: Tu tipo de entrenamiento
┌─────────────────────────────────────────────────┐
│  ¿Qué te gustaría incluir?                      │
│                                                 │
│  [□] Fuerza con pesas                           │
│      Ideal para firmeza y huesos fuertes        │
│                                                 │
│  [□] Running / Caminar                          │
│      Cardio suave para el corazón               │
│                                                 │
│  [□] Movilidad / Yoga                           │
│      Flexibilidad y relajación                  │
│                                                 │
│  [□] HIIT / Cardio intenso                      │
│      Sesiones cortas y efectivas                │
└─────────────────────────────────────────────────┘
```

#### Ejemplo de Plan Generado

Basado en configuración: **3 días (L, X, V), 45 min, fuerza + movilidad, dolor de muñecas, gimnasio**

```
TU SEMANA EN KIRA
┌─────────────────────────────────────────────────┐
│  LUNES                                          │
│  Fuerza - Tren Inferior · 45 min                │
│  Adaptado: ejercicios sin carga en muñecas      │
├─────────────────────────────────────────────────┤
│  MIÉRCOLES                                      │
│  Fuerza - Tren Superior · 45 min                │
│  Adaptado: usando agarre neutro                 │
├─────────────────────────────────────────────────┤
│  VIERNES                                        │
│  Fuerza - Full Body + Movilidad · 45 min        │
│  Incluye 10 min de estiramientos                │
└─────────────────────────────────────────────────┘

[Editar mi plan]  [Cambiar días]  [Ajustar dolencias]
```

### Ajustes Automáticos por Energía (Sin Datos de Ciclo)

**Filosofía**: No necesitamos saber POR QUÉ la usuaria tiene baja energía. Solo necesitamos saber CÓMO SE SIENTE HOY y adaptar el entreno.

Esto evita:
- Recopilar datos de salud sensibles (GDPR categoría especial)
- Preguntas incómodas sobre ciclo/menopausia
- Barreras de entrada para usuarias que no quieren compartir esa info

#### Check-in Pre-Entreno (30 segundos)

```
┌─────────────────────────────────────────────────┐
│  ¿Cómo te sientes hoy?                          │
│                                                 │
│  [😴]  [😐]  [😊]  [💪]  [🔥]                   │
│  Muy     Algo   Normal  Con    Al               │
│  baja    baja          energía máximo           │
│                                                 │
│  ────────────────────────────────────────────   │
│                                                 │
│  ¿Alguna molestia hoy? (opcional)               │
│  [Muñecas] [Hombros] [Rodillas] [Ninguna]       │
└─────────────────────────────────────────────────┘
```

#### Ajustes Basados en Energía

```typescript
// shared/config/energy-adjustments.ts
export const ENERGY_ADJUSTMENTS = {
  very_low: {
    // 😴 "Hoy no es mi día"
    intensity_modifier: 0.60,      // -40% cargas
    rest_modifier: 1.50,           // +50% descanso
    volume_modifier: 0.70,         // -30% series
    message: {
      en: "Low energy day? That's okay. Let's do a gentle session.",
      es: "¿Día de poca energía? No pasa nada. Hagamos algo suave."
    },
    suggest_alternatives: true,
    alternatives: ['mobility', 'walk', 'skip'],
    allow_skip: true
  },

  low: {
    // 😐 "No estoy al 100%"
    intensity_modifier: 0.80,      // -20% cargas
    rest_modifier: 1.20,           // +20% descanso
    volume_modifier: 0.90,
    message: {
      en: "Taking it easier today. Focus on moving well.",
      es: "Hoy más tranquila. Enfócate en moverte bien."
    },
    suggest_alternatives: false,
    allow_skip: true
  },

  normal: {
    // 😊 "Normal, bien"
    intensity_modifier: 1.00,
    rest_modifier: 1.00,
    volume_modifier: 1.00,
    message: null,  // Sin mensaje, entreno normal
    suggest_alternatives: false,
    allow_skip: false
  },

  high: {
    // 💪 "Con energía"
    intensity_modifier: 1.00,
    rest_modifier: 1.00,
    volume_modifier: 1.00,
    message: {
      en: "Feeling good! Stick to the plan.",
      es: "Te sientes bien. Sigue el plan."
    },
    allow_progression: true        // Puede intentar subir peso
  },

  very_high: {
    // 🔥 "Al máximo"
    intensity_modifier: 1.05,
    rest_modifier: 0.90,
    volume_modifier: 1.00,
    message: {
      en: "Great energy! Perfect day to push a little.",
      es: "Mucha energía. Buen día para apretar un poco."
    },
    allow_progression: true,
    suggest_challenge: true        // Sugerir reto adicional
  }
} as const;

export type EnergyLevel = keyof typeof ENERGY_ADJUSTMENTS;
```

#### UI: Entreno Adaptado

Cuando la usuaria dice que tiene energía baja:

```
┌─────────────────────────────────────────────────┐
│  HOY: Versión suave                    😴       │
│  Fuerza - Tren Inferior · ~35 min              │
│  Cargas reducidas · Más descanso               │
├─────────────────────────────────────────────────┤
│                                                 │
│  💡 Hoy es un buen día para:                   │
│  • Enfocarte en la técnica                      │
│  • Escuchar a tu cuerpo                         │
│  • No competir contigo misma                    │
│                                                 │
│  [Empezar así]  [Ver alternativas]  [Hoy no]   │
│                                                 │
├─────────────────────────────────────────────────┤
│  EJERCICIO          SERIES  REPS    PESO        │
│  ────────────────────────────────────────────   │
│  Sentadilla Goblet    2    8-10    6kg ↓       │
│  RDL Mancuernas       2    8-10    8kg ↓       │
│  Hip Thrust           2    10-12   10kg ↓      │
│  Plancha              2    20s     -           │
└─────────────────────────────────────────────────┘

[↓] = Peso ajustado por tu energía de hoy
```

#### Alternativas Sugeridas (Energía Muy Baja)

```
┌─────────────────────────────────────────────────┐
│  Alternativas para hoy                          │
│                                                 │
│  [🧘 Movilidad 15min]                          │
│  Estiramientos suaves para soltar tensión       │
│                                                 │
│  [🚶 Caminata 20min]                           │
│  Movimiento sin esfuerzo                        │
│                                                 │
│  [🛋️ Descanso activo]                          │
│  A veces el mejor entreno es descansar          │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Entrenar con poca energía no es malo, pero    │
│  escucharte y descansar cuando lo necesitas    │
│  es parte del proceso.                          │
└─────────────────────────────────────────────────┘
```

#### Tracking de Energía (Opcional, Agregado)

Si la usuaria quiere ver sus patrones de energía:

```
┌─────────────────────────────────────────────────┐
│  Tu energía este mes                            │
│                                                 │
│  Sem 1: 😊 😊 💪 😐 😴 -- --                   │
│  Sem 2: 😊 💪 🔥 💪 😊 -- --                   │
│  Sem 3: 😊 😐 😐 😴 😴 -- --                   │
│  Sem 4: 😐 😊 😊 💪 😊 -- --                   │
│                                                 │
│  💡 Detectamos que sueles tener menos energía   │
│  a mitad de mes. Es completamente normal.       │
└─────────────────────────────────────────────────┘
```

**Nota**: Este tracking es local y NO correlacionamos con ciclo menstrual. Si la usuaria nota un patrón, ella misma puede conectar los puntos. Nosotros NO asumimos ni preguntamos.

### Sistema de Prevención de Dolor

Zonas monitoreadas (comunes en +40):
- **Muñecas** (artritis, túnel carpiano)
- **Antebrazos** (tendinitis)
- **Hombros** (manguito rotador)
- **Cuello** (tensión cervical)
- **Rodillas** (desgaste)
- **Espalda baja** (lumbalgia)

```typescript
// shared/config/pain-zones.ts
export const PAIN_ZONES = {
  wrists: {
    en: 'Wrists',
    es: 'Muñecas',
    affected_exercises: ['pushup', 'plank', 'front_squat'],
    alternatives: {
      'pushup': 'pushup_on_fists',      // Puños en vez de palmas
      'plank': 'plank_on_forearms',
      'front_squat': 'goblet_squat'
    },
    prevention_tip: {
      en: 'Keep wrists neutral. Use dumbbells instead of barbells when possible.',
      es: 'Mantén muñecas neutras. Usa mancuernas en vez de barra cuando puedas.'
    }
  },

  shoulders: {
    en: 'Shoulders',
    es: 'Hombros',
    affected_exercises: ['overhead_press', 'lateral_raise', 'upright_row'],
    alternatives: {
      'overhead_press': 'landmine_press',
      'lateral_raise': 'lateral_raise_cable',
      'upright_row': 'face_pull'  // Upright row es problemático, eliminar
    },
    prevention_tip: {
      en: 'Avoid going behind the neck. Keep shoulders packed down.',
      es: 'Evita movimientos tras la nuca. Mantén hombros hacia abajo.'
    }
  },

  neck: {
    en: 'Neck',
    es: 'Cuello',
    affected_exercises: ['crunch', 'situp', 'shrug'],
    alternatives: {
      'crunch': 'dead_bug',
      'situp': 'plank',
      'shrug': 'farmers_walk'
    },
    prevention_tip: {
      en: 'Keep neck neutral. Imagine holding an orange under your chin.',
      es: 'Cuello neutro. Imagina sostener una naranja bajo tu barbilla.'
    }
  },

  forearms: {
    en: 'Forearms',
    es: 'Antebrazos',
    affected_exercises: ['bicep_curl', 'reverse_curl', 'wrist_curl'],
    alternatives: {
      'bicep_curl': 'hammer_curl',  // Agarre neutro
      'reverse_curl': 'hammer_curl',
      'wrist_curl': null  // Eliminar
    },
    prevention_tip: {
      en: 'Use neutral grip when possible. Avoid overgripping.',
      es: 'Usa agarre neutro cuando puedas. No aprietes de más.'
    }
  },

  lower_back: {
    en: 'Lower back',
    es: 'Espalda baja',
    affected_exercises: ['deadlift', 'bent_over_row', 'good_morning'],
    alternatives: {
      'deadlift': 'rdl_db',  // RDL con mancuernas, menos carga axial
      'bent_over_row': 'chest_supported_row',
      'good_morning': 'hip_thrust'
    },
    prevention_tip: {
      en: 'Brace your core. Hinge at hips, not lower back.',
      es: 'Activa tu core. Bisagra desde cadera, no desde lumbar.'
    }
  },

  knees: {
    en: 'Knees',
    es: 'Rodillas',
    affected_exercises: ['deep_squat', 'lunge', 'leg_extension'],
    alternatives: {
      'deep_squat': 'box_squat',  // Controlar profundidad
      'lunge': 'split_squat',     // Más estable
      'leg_extension': 'leg_curl' // Evitar extensión aislada
    },
    prevention_tip: {
      en: 'Keep knees tracking over toes. Don\'t let them cave in.',
      es: 'Rodillas en línea con los dedos. Que no colapsen hacia dentro.'
    }
  }
} as const;

export type PainZone = keyof typeof PAIN_ZONES;
```

### Lógica de Ajuste de Cargas

```typescript
// shared/lib/workout/progression.ts

/**
 * Determina si la usuaria debe subir, mantener o bajar peso
 * Basado en RPE (Rate of Perceived Exertion) y reps completadas
 */
export function calculateProgression(
  lastWorkout: {
    weight_kg: number;
    reps_completed: number[];
    rpe: number;
    target_reps: string;  // "10-12"
    pain_reported: string[];
  },
  cyclePhase: CyclePhase
): ProgressionDecision {
  const [minReps, maxReps] = lastWorkout.target_reps.split('-').map(Number);
  const avgReps = average(lastWorkout.reps_completed);
  const lastSetReps = lastWorkout.reps_completed.at(-1) || 0;

  // Si reportó dolor, NO subir y considerar bajar
  if (lastWorkout.pain_reported.length > 0) {
    return {
      action: 'reduce',
      reason: 'pain_reported',
      new_weight_kg: lastWorkout.weight_kg * 0.8,
      message: {
        en: `Pain reported. Let's reduce weight and focus on form.`,
        es: `Reportaste molestia. Bajamos peso y nos enfocamos en técnica.`
      }
    };
  }

  // No permitir subidas en fase luteal/menstrual
  const allowProgression = ['follicular', 'ovulation'].includes(cyclePhase);

  // RPE < 6 y todas las reps completadas → Subir
  if (avgReps >= maxReps && lastWorkout.rpe <= 6 && allowProgression) {
    return {
      action: 'increase',
      reason: 'too_easy',
      new_weight_kg: lastWorkout.weight_kg + 2,  // Subir 2kg
      message: {
        en: `Great work! Let's try a bit more weight.`,
        es: `Excelente trabajo. Probemos un poco más de peso.`
      }
    };
  }

  // RPE 7-8 y reps en rango → Mantener (punto óptimo)
  if (avgReps >= minReps && lastWorkout.rpe >= 7 && lastWorkout.rpe <= 8) {
    return {
      action: 'maintain',
      reason: 'optimal',
      new_weight_kg: lastWorkout.weight_kg,
      message: {
        en: `Perfect zone! Keep this weight.`,
        es: `Zona perfecta. Mantén este peso.`
      }
    };
  }

  // RPE > 8 o no completó reps mínimas → Bajar
  if (lastWorkout.rpe > 8 || avgReps < minReps) {
    return {
      action: 'reduce',
      reason: 'too_hard',
      new_weight_kg: lastWorkout.weight_kg * 0.9,  // Bajar 10%
      message: {
        en: `That was tough. Let's dial it back a bit.`,
        es: `Eso fue duro. Bajemos un poco.`
      }
    };
  }

  // Default: mantener
  return {
    action: 'maintain',
    reason: 'default',
    new_weight_kg: lastWorkout.weight_kg,
    message: null
  };
}
```

### UI: "Entreno de Hoy" (Tabla)

La pantalla principal de entrenamiento muestra una tabla clara:

```
┌─────────────────────────────────────────────────────────────────┐
│  HOY: Fuerza A - Tren Inferior                    🌙 Fase Lútea │
│  60 min · Intensidad ajustada (-15%)                            │
├─────────────────────────────────────────────────────────────────┤
│  CALENTAMIENTO (5 min)                                          │
│  ├── Movilidad de cadera · 2 min                                │
│  └── Sentadilla sin peso · 2x10                                 │
├─────────────────────────────────────────────────────────────────┤
│  EJERCICIO          SERIES  REPS    PESO     DESCANSO   [SWAP]  │
│  ─────────────────────────────────────────────────────────────  │
│  Sentadilla Goblet    3    10-12   10kg ↓    90s        [↔]    │
│  RDL Mancuernas       3    10-12   12kg      90s        [↔]    │
│  Hip Thrust           3    12-15   14kg      75s        [↔]    │
│  Zancada Búlgara      3    8-10    8kg       90s        [↔]    │
│  Plancha              3    30s     -         60s        [↔]    │
├─────────────────────────────────────────────────────────────────┤
│  VUELTA A LA CALMA (5 min)                                      │
│  └── Estiramientos tren inferior                                │
└─────────────────────────────────────────────────────────────────┘

[↓] = Peso reducido por fase del ciclo
[↔] = Tap para ver alternativas (swap)
```

### Ficha Rápida de Ejercicio

Al tocar un ejercicio, se muestra una ficha compacta:

```
┌─────────────────────────────────────────────────────────────────┐
│  SENTADILLA GOBLET                                    [▶ Video] │
├─────────────────────────────────────────────────────────────────┤
│  📍 POSICIÓN                                                    │
│  Pies a la anchura de hombros, puntas ligeramente hacia fuera. │
│  Mancuerna pegada al pecho, codos apuntando abajo.             │
├─────────────────────────────────────────────────────────────────┤
│  🔄 MOVIMIENTO                                                  │
│  Baja llevando la cadera atrás, como si fueras a sentarte.     │
│  Rodillas en línea con los dedos. Sube empujando desde talones.│
├─────────────────────────────────────────────────────────────────┤
│  💪 MÚSCULOS                                                    │
│  Cuádriceps, glúteos, core                                      │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️ ERROR COMÚN                                                 │
│  Dejar que las rodillas colapsen hacia dentro.                 │
├─────────────────────────────────────────────────────────────────┤
│  🛡️ CUIDADO SI TIENES...                                       │
│  Dolor de rodillas: No bajes más de 90°                        │
│  Dolor lumbar: Activa core antes de bajar                      │
├─────────────────────────────────────────────────────────────────┤
│  [ALTERNATIVAS: Sentadilla sin peso · Prensa de piernas]       │
└─────────────────────────────────────────────────────────────────┘
```

### Sistema de Swaps

Para gimnasio saturado (mancuernas/banco ocupados):

```typescript
// shared/config/exercise-swaps.ts
export const EXERCISE_SWAPS = {
  goblet_squat: {
    same_muscle: [
      { slug: 'bodyweight_squat', equipment: ['none'], difficulty: 'easier' },
      { slug: 'leg_press', equipment: ['machine'], difficulty: 'same' },
      { slug: 'smith_squat', equipment: ['smith'], difficulty: 'same' }
    ],
    message: {
      en: 'No dumbbells? Try these:',
      es: '¿Sin mancuernas? Prueba:'
    }
  },

  bench_press_db: {
    same_muscle: [
      { slug: 'pushup', equipment: ['none'], difficulty: 'easier' },
      { slug: 'chest_press_machine', equipment: ['machine'], difficulty: 'same' },
      { slug: 'floor_press_db', equipment: ['dumbbell'], difficulty: 'same' }  // Sin banco
    ],
    message: {
      en: 'Bench taken? Try these:',
      es: '¿Banco ocupado? Prueba:'
    }
  },

  // etc.
} as const;
```

### Progresión Mensual (Sin Cambiar Todo)

El sistema mantiene los mismos ejercicios base pero ajusta:

**Semana 1-2**: Fase de aprendizaje
- Cargas moderadas (RPE 6-7)
- Enfoque en técnica
- 3 series por ejercicio

**Semana 3-4**: Fase de desarrollo
- Subir cargas si técnica es buena
- RPE objetivo 7-8
- Mantener 3 series

**Semana 5-6**: Fase de consolidación
- Pequeña subida de volumen (4 series en ejercicios principales)
- Mantener o subir cargas ligeramente

**Semana 7-8**: Deload (descarga)
- Reducir cargas 20%
- Reducir volumen (2 series)
- Recuperación activa

```typescript
// shared/lib/workout/periodization.ts
export function getWeekPhase(weekNumber: number): WeekPhase {
  const cycleWeek = ((weekNumber - 1) % 8) + 1;

  if (cycleWeek <= 2) return { phase: 'learning', volume_modifier: 1.0, intensity_modifier: 0.85 };
  if (cycleWeek <= 4) return { phase: 'development', volume_modifier: 1.0, intensity_modifier: 1.0 };
  if (cycleWeek <= 6) return { phase: 'consolidation', volume_modifier: 1.15, intensity_modifier: 1.0 };
  return { phase: 'deload', volume_modifier: 0.65, intensity_modifier: 0.80 };
}
```

### Running: Estructura de 20 min

```typescript
// shared/config/running-workouts.ts
export const RUNNING_WORKOUTS = {
  intervals_beginner: {
    name: { en: 'Walk-Run Intervals', es: 'Intervalos Caminar-Correr' },
    duration_minutes: 20,
    structure: [
      { type: 'warmup_walk', duration: 3 },
      // 10 min de intervalos
      { type: 'run', duration: 1 },
      { type: 'walk', duration: 1.5 },
      // Repetir 4x
      { type: 'cooldown_walk', duration: 2 }
    ],
    phase_adjustments: {
      menstrual: { walk_duration_modifier: 1.5 },  // Más caminata
      luteal: { run_duration_modifier: 0.8 }
    }
  },

  continuous_easy: {
    name: { en: 'Easy Continuous Run', es: 'Carrera Continua Suave' },
    duration_minutes: 20,
    structure: [
      { type: 'warmup_walk', duration: 3 },
      { type: 'easy_run', duration: 14, pace: 'conversational' },
      { type: 'cooldown_walk', duration: 3 }
    ],
    tip: {
      en: 'You should be able to hold a conversation. If not, slow down.',
      es: 'Deberías poder mantener una conversación. Si no, baja el ritmo.'
    }
  },

  progression: {
    name: { en: 'Progression Run', es: 'Carrera Progresiva' },
    duration_minutes: 20,
    structure: [
      { type: 'warmup_walk', duration: 3 },
      { type: 'easy_run', duration: 5 },
      { type: 'moderate_run', duration: 5 },
      { type: 'tempo_run', duration: 4 },
      { type: 'cooldown_walk', duration: 3 }
    ],
    recommended_phases: ['follicular', 'ovulation']  // Solo en fases de alta energía
  }
} as const;
```

### Catálogo Inicial de Ejercicios

Ejercicios base recomendados (todos con mancuernas + alternativas):

**Tren Inferior**:
| Ejercicio | Músculos | Zonas cuidado | Swap sin equipo |
|-----------|----------|---------------|-----------------|
| Sentadilla Goblet | Cuádriceps, Glúteos | Rodillas | Sentadilla sin peso |
| RDL Mancuernas | Isquios, Glúteos | Lumbar | Good Morning sin peso |
| Hip Thrust | Glúteos | Lumbar | Glute Bridge |
| Zancada Búlgara | Cuádriceps, Glúteos | Rodillas | Zancada estática |
| Step Up | Cuádriceps, Glúteos | Rodillas | Subir escaleras |

**Tren Superior**:
| Ejercicio | Músculos | Zonas cuidado | Swap sin equipo |
|-----------|----------|---------------|-----------------|
| Press Pecho Mancuernas | Pecho, Tríceps | Hombros | Flexiones |
| Remo Mancuerna | Espalda, Bíceps | Lumbar | Remo invertido |
| Press Hombro Mancuernas | Hombros, Tríceps | Hombros, Cuello | Pike Push Up |
| Curl Martillo | Bíceps | Antebrazos | - |
| Extensión Tríceps | Tríceps | Codos | Fondos en banco |

**Core**:
| Ejercicio | Músculos | Zonas cuidado | Swap sin equipo |
|-----------|----------|---------------|-----------------|
| Plancha | Core completo | Muñecas, Lumbar | Plancha en antebrazos |
| Dead Bug | Core, Estabilidad | - | - |
| Pallof Press | Oblicuos, Core | - | Plancha lateral |
| Bird Dog | Core, Espalda | - | - |

---

## Estructura de Directorios (Kira)

```
/src
├── features/
│   ├── auth/                  # ✅ Heredado
│   ├── billing/               # ✅ Heredado
│   ├── admin/                 # ✅ Heredado
│   ├── my-account/            # ✅ Heredado
│   ├── onboarding/            # 🚧 Quiz inicial
│   ├── cycle-tracking/        # 🚧 Registro diario
│   ├── workouts/              # 🚧 Entrenamientos
│   ├── supplements/           # 🚧 Recomendaciones
│   ├── dashboard/             # 🚧 Vista general
│   └── insights/              # 📅 Fase 2 - Patrones
├── shared/
│   ├── auth/
│   ├── components/ui/
│   ├── config/
│   │   ├── brand.ts           # Configuración Kira
│   │   ├── symptoms.ts        # Lista de síntomas
│   │   └── cycle-phases.ts    # Fases del ciclo
│   ├── database/supabase/
│   ├── payments/stripe/
│   └── types/
├── app/
│   ├── [locale]/
│   │   ├── (app)/             # Rutas protegidas
│   │   │   ├── dashboard/
│   │   │   ├── track/
│   │   │   ├── workouts/
│   │   │   ├── supplements/
│   │   │   └── settings/
│   │   ├── (auth)/
│   │   ├── (admin)/
│   │   └── (landing)/
│   └── api/
├── i18n/
└── public/
    └── icons/                 # PWA icons
```

---

## PWA Configuration

### Manifest
```json
{
  "name": "Kira",
  "short_name": "Kira",
  "description": "Tu compañera de bienestar en la menopausia",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7C3AED",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Strategy
- **Tracking data**: Cache-first, sync when online
- **Workouts**: Network-first (videos), cache thumbnails
- **Static assets**: Cache-first con stale-while-revalidate

---

## Variables de Entorno

### Requeridas
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Kira
```

### Opcionales
```bash
NEXT_PUBLIC_OAUTH_PROVIDERS=google
RESEND_API_KEY=
SENTRY_DSN=

# Analytics (Fase 2)
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## Freemium vs Premium

### Free
- Tracking diario ilimitado
- 3 entrenamientos por semana
- Recomendaciones básicas de suplementos
- Historial de 30 días

### Premium
- Todo lo de Free
- Entrenamientos ilimitados
- Recomendaciones avanzadas personalizadas
- Historial completo
- Insights y patrones detectados
- Exportación de datos
- Sin anuncios

---

## Testing Strategy

### Flujos Críticos (E2E Obligatorio)

1. **Onboarding completo**: Quiz → Perfil creado → Dashboard
2. **Tracking diario**: Abrir → Registrar síntomas → Guardar → Ver en historial
3. **Workout flow**: Ver lista → Seleccionar → Completar → Registrar
4. **Upgrade to Premium**: Free user → Ver upsell → Checkout → Premium activo
5. **Offline sync**: Registrar offline → Reconectar → Datos sincronizados

### Unit Tests (Cuando aplique)

- Cálculo de fase del ciclo basado en logs
- Algoritmo de recomendación de suplementos
- Lógica de detección de patrones
- Validaciones de datos de salud

---

## Seguridad y Privacidad

### Datos Sensibles

Los datos de salud son **categoría especial** bajo GDPR/LOPD:
- Consentimiento explícito en onboarding
- Derecho a exportar todos los datos
- Derecho a eliminar cuenta y datos
- Encriptación en tránsito y reposo
- No compartir con terceros (excepto procesadores necesarios)

### RLS Policies (Críticas)

```sql
-- daily_logs: Solo el usuario puede ver/editar sus logs
CREATE POLICY "Users can manage own logs"
  ON daily_logs FOR ALL
  USING (auth.uid() = user_id);

-- workout_completions: Solo el usuario puede ver/editar
CREATE POLICY "Users can manage own completions"
  ON workout_completions FOR ALL
  USING (auth.uid() = user_id);

-- workouts: Todos pueden ver activos, premium filtra en app
CREATE POLICY "Anyone can view active workouts"
  ON workouts FOR SELECT
  USING (is_active = true);

-- supplements: Todos pueden ver activos
CREATE POLICY "Anyone can view active supplements"
  ON supplements FOR SELECT
  USING (is_active = true);
```

---

## Comandos Útiles

```bash
# Generar nueva feature
npm run generate:slice

# Aplicar migraciones
npx supabase db push

# Generar tipos TypeScript desde Supabase
npm run gen:types

# Añadir componente shadcn
npx shadcn@latest add [componente]

# Type check
npm run type-check

# PWA: Generar service worker
npm run build  # Incluido en build
```

---

## Workflow de Desarrollo

### Crear nueva feature de Kira
```bash
npm run generate:slice    # Genera estructura
npx supabase db push      # Aplica migración
npm run gen:types         # Actualiza tipos
```

### Antes de cada PR
- [ ] `npm run check` pasa
- [ ] Textos en copies (no hardcoded)
- [ ] Disclaimers donde aplique
- [ ] Funciona offline (si aplica)
- [ ] A11y checklist completo
- [ ] Tono empático verificado

---

## Próximos Pasos Sugeridos

1. **Configurar PWA**: Añadir next-pwa, manifest, service worker
2. **Crear onboarding**: Quiz inicial con flow visual atractivo
3. **Implementar cycle-tracking**: Calendario + registro diario
4. **Crear dashboard**: Vista resumen con racha y próxima fase
5. **Añadir workouts**: CRUD admin + visualización user
6. **Implementar supplements**: Recomendaciones con afiliados
7. **Configurar push notifications**: Recordatorios de tracking

---

## Recursos

- **Diseño**: [Pendiente - Figma/Referencias]
- **Competencia**: Clue, Flo, Balance (referencia, no copiar)
- **Contenido**: [Pendiente - Fuentes para entrenamientos/suplementos]

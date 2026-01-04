'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { brand } from '@/shared/config';
import { cn } from '@/shared/lib/utils';
import { Play, Flame, Sparkles, Moon, Battery, ChevronRight, Heart, Loader2, Sun, CloudSun, Check, Dumbbell } from 'lucide-react';
import { setEnergyAction } from '../dashboard.actions';
import type { EnergyLevel, WeeklyProgress } from '../types';

interface SuggestedWorkout {
  type: string;
  name: string;
}

interface KiraDashboardProps {
  userName: string | null;
  todayEnergy: EnergyLevel | null;
  weeklyProgress: WeeklyProgress;
  currentStreak: number;
  suggestedWorkout?: SuggestedWorkout | null;
}

// Helper para obtener saludo según hora
function getGreeting(): { text: string; icon: 'sun' | 'cloud' | 'moon' } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: '¡Buenos días', icon: 'sun' };
  if (hour < 19) return { text: '¡Buenas tardes', icon: 'cloud' };
  return { text: '¡Buenas noches', icon: 'moon' };
}

// Configuración de niveles de energía con iconos Lucide
const energyConfig: Record<EnergyLevel, {
  icon: typeof Flame;
  title: string;
  selectedBg: string;
  borderColor: string;
  textColor: string;
  iconBg: string;
  gradient: string;
}> = {
  high: {
    icon: Flame,
    title: 'A tope',
    selectedBg: 'bg-primary/10',
    borderColor: 'border-primary/20 hover:border-primary/40',
    textColor: 'text-primary',
    iconBg: 'bg-primary',
    gradient: 'from-rose-500 to-rose-600',
  },
  medium: {
    icon: Sparkles,
    title: 'Normal',
    selectedBg: 'bg-accent/50',
    borderColor: 'border-accent hover:border-accent',
    textColor: 'text-accent-foreground',
    iconBg: 'bg-accent',
    gradient: 'from-amber-400 to-amber-500',
  },
  low: {
    icon: Battery,
    title: 'Bajita',
    selectedBg: 'bg-secondary/50',
    borderColor: 'border-secondary hover:border-secondary',
    textColor: 'text-secondary-foreground',
    iconBg: 'bg-secondary',
    gradient: 'from-slate-400 to-slate-500',
  },
  rest: {
    icon: Moon,
    title: 'Descanso',
    selectedBg: 'bg-muted',
    borderColor: 'border-muted-foreground/20 hover:border-muted-foreground/40',
    textColor: 'text-muted-foreground',
    iconBg: 'bg-muted-foreground/20',
    gradient: 'from-slate-300 to-slate-400',
  },
};

export function KiraDashboard({
  userName,
  todayEnergy: initialEnergy,
  weeklyProgress,
  currentStreak,
  suggestedWorkout
}: KiraDashboardProps) {
  const [selectedEnergy, setSelectedEnergy] = useState<EnergyLevel | null>(initialEnergy);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const greeting = getGreeting();
  const firstName = userName || 'bonita';

  const handleEnergySelect = (level: EnergyLevel) => {
    // Optimistic update
    setSelectedEnergy(level);

    // Save to DB
    startTransition(async () => {
      const result = await setEnergyAction(level);
      if (!result.success) {
        // Revert on error
        setSelectedEnergy(initialEnergy);
      }
    });
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header con gradiente */}
      <div className="relative -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-8 px-4 md:px-6 pt-8 pb-12 bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30 rounded-b-[2rem]">
        <div className="max-w-lg">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            {greeting.icon === 'sun' && <Sun className="h-7 w-7 text-primary" />}
            {greeting.icon === 'cloud' && <CloudSun className="h-7 w-7 text-primary" />}
            {greeting.icon === 'moon' && <Moon className="h-7 w-7 text-primary" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            {greeting.text}, {firstName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {selectedEnergy
              ? brand.messages.energyLevels[selectedEnergy].description
              : '¿Cómo te encuentras hoy?'
            }
          </p>
          {/* Frase motivacional */}
          <p className="text-muted-foreground/80 italic text-sm mt-3">
            "{brand.messages.encouragement[new Date().getDate() % brand.messages.encouragement.length]}"
          </p>
        </div>

        {/* Racha actual */}
        {currentStreak > 0 && (
          <div className="absolute top-8 right-4 md:right-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-orange-700">{currentStreak} días</span>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Selector de energía */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            ¿Cómo te sientes hoy?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(energyConfig) as EnergyLevel[]).map((level) => {
              const config = energyConfig[level];
              const isSelected = selectedEnergy === level;

              return (
                <button
                  key={level}
                  onClick={() => handleEnergySelect(level)}
                  className={cn(
                    'relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    isSelected
                      ? `${config.selectedBg} border-transparent shadow-lg ring-2 ring-offset-2 ring-primary/30`
                      : `bg-white ${config.borderColor}`
                  )}
                >
                  {/* Icono grande */}
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    isSelected ? config.iconBg : 'bg-muted'
                  )}>
                    <config.icon className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-white' : 'text-muted-foreground'
                    )} />
                  </div>

                  {/* Título */}
                  <span className={cn(
                    'text-sm font-semibold',
                    isSelected ? config.textColor : 'text-foreground'
                  )}>
                    {config.title}
                  </span>

                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-primary text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Día sugerido del plan */}
        {suggestedWorkout && (
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl border border-rose-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-rose-600 font-medium uppercase tracking-wide">Según tu plan</p>
              <p className="font-semibold text-rose-900">{suggestedWorkout.name}</p>
            </div>
          </div>
        )}

        {/* CTA Principal - Entrenamiento */}
        {selectedEnergy && selectedEnergy !== 'rest' && (
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={cn(
              'h-2 bg-gradient-to-r',
              energyConfig[selectedEnergy].gradient
            )} />
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Tu entrenamiento de hoy</p>
                  <h3 className="text-xl font-bold">
                    {suggestedWorkout ? suggestedWorkout.name : (
                      <>
                        {selectedEnergy === 'high' && 'Fuerza Total'}
                        {selectedEnergy === 'medium' && 'Fuerza Moderada'}
                        {selectedEnergy === 'low' && 'Movimiento Suave'}
                      </>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-xs">
                      {selectedEnergy === 'high' && '45 min'}
                      {selectedEnergy === 'medium' && '30 min'}
                      {selectedEnergy === 'low' && '20 min'}
                    </span>
                    <span>•</span>
                    <span>
                      {selectedEnergy === 'high' && '8 ejercicios'}
                      {selectedEnergy === 'medium' && '6 ejercicios'}
                      {selectedEnergy === 'low' && '5 ejercicios'}
                    </span>
                  </p>
                </div>
                <Button
                  size="lg"
                  className="gap-2 rounded-full px-8 shadow-lg hover:shadow-xl transition-shadow"
                  asChild
                >
                  <Link href="/es/workouts">
                    <Play className="h-5 w-5" fill="currentColor" />
                    Empezar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Día de descanso */}
        {selectedEnergy === 'rest' && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500" />
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Moon className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Hoy toca descansar</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {brand.messages.energyLevels.rest.description}
                <br />
                <span className="text-sm">Mañana será otro día. Tu cuerpo te lo agradecerá.</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progreso semanal */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Esta semana
            </h2>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              Ver historial
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between gap-1">
                {weeklyProgress.weekDays.map((day, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className={cn(
                      'text-xs font-medium',
                      day.isToday ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {day.day}
                    </span>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      day.completed
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md'
                        : day.isToday
                          ? 'border-2 border-primary border-dashed bg-primary/5'
                          : 'bg-muted/50'
                    )}>
                      {day.completed ? <Check className="h-4 w-4" /> : day.isToday ? <Dumbbell className="h-4 w-4 text-primary" /> : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  {weeklyProgress.daysCompleted} de 7 días
                </span>
                {weeklyProgress.daysCompleted > 0 && (
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    ¡Vas genial!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        </div>
    </div>
  );
}

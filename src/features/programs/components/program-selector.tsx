'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Calendar, Dumbbell, Trophy, Clock, ChevronRight, Sparkles, Target, Zap, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { enrollToProgramAction } from '../programs.actions';
import type { TrainingProgram } from '../types';

interface ProgramSelectorProps {
  programs: TrainingProgram[];
  locale: string;
}

const levelConfig = {
  beginner: {
    label: { en: 'Beginner', es: 'Principiante' },
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
    text: 'text-emerald-700',
  },
  intermediate: {
    label: { en: 'Intermediate', es: 'Intermedio' },
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    text: 'text-amber-700',
  },
  advanced: {
    label: { en: 'Advanced', es: 'Avanzado' },
    gradient: 'from-rose-400 to-red-500',
    bg: 'bg-gradient-to-r from-rose-50 to-red-50',
    text: 'text-rose-700',
  },
};

const goalConfig = {
  strength: {
    label: { en: 'Strength', es: 'Fuerza' },
    icon: Dumbbell,
  },
  recomposition: {
    label: { en: 'Body Recomp', es: 'Recomposición' },
    icon: Zap,
  },
  endurance: {
    label: { en: 'Endurance', es: 'Resistencia' },
    icon: Target,
  },
  general: {
    label: { en: 'General Fitness', es: 'Bienestar' },
    icon: Sparkles,
  },
};

export function ProgramSelector({ programs, locale }: ProgramSelectorProps) {
  const t = useTranslations('workouts.programs');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEnroll = () => {
    if (!selectedId) return;

    startTransition(async () => {
      const result = await enrollToProgramAction(selectedId);

      if (result.success) {
        toast.success(t('enrolled'));
      } else {
        toast.error(result.error || t('enrollError'));
      }
    });
  };

  if (programs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50/80 to-amber-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center mb-6 shadow-lg">
          <Dumbbell className="h-10 w-10 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-2">
          {t('noPrograms')}
        </h1>
        <p className="text-zinc-500 max-w-sm">
          {t('noProgramsDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50/80 to-amber-50 p-4 pb-32">
      {/* Header */}
      <div className="text-center mb-8 pt-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/25">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent mb-2">
          {t('selectProgram')}
        </h1>
        <p className="text-zinc-500 max-w-sm mx-auto">
          {t('selectProgramDescription')}
        </p>
      </div>

      {/* Program Cards */}
      <div className="space-y-4 max-w-lg mx-auto">
        {programs.map((program) => {
          const isSelected = selectedId === program.id;
          const level = levelConfig[program.level];
          const goal = goalConfig[program.goal];
          const GoalIcon = goal.icon;

          return (
            <button
              key={program.id}
              onClick={() => setSelectedId(program.id)}
              className={cn(
                'w-full p-5 rounded-2xl transition-all duration-300 text-left',
                'backdrop-blur-md border',
                isSelected
                  ? 'bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-rose-300 shadow-lg shadow-rose-500/10'
                  : 'bg-white/60 border-white/80 hover:bg-white/80 hover:border-rose-200'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Program Name */}
                  <h3 className="font-semibold text-lg text-zinc-800 mb-1">
                    {program.name[locale as 'en' | 'es'] || program.name.es}
                  </h3>

                  {/* Description */}
                  {program.description && (
                    <p className="text-sm text-zinc-500 mb-3">
                      {program.description[locale as 'en' | 'es'] || program.description.es}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {/* Level Badge */}
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
                      level.bg,
                      level.text
                    )}>
                      {level.label[locale as 'en' | 'es'] || level.label.es}
                    </span>

                    {/* Goal Badge */}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-600">
                      <GoalIcon className="h-3 w-3" />
                      {goal.label[locale as 'en' | 'es'] || goal.label.es}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {program.daysPerWeek} {t('daysPerWeek')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {program.durationWeeks} {t('weeks')}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={cn(
                  'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
                  isSelected
                    ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-md'
                    : 'border-2 border-zinc-200'
                )}>
                  {isSelected && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-amber-50 via-amber-50/90 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            disabled={!selectedId || isPending}
            onClick={handleEnroll}
            className={cn(
              'w-full h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300',
              'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25',
              'hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02]',
              'disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg'
            )}
          >
            {isPending ? (
              t('enrolling')
            ) : (
              <>
                {t('startProgram')}
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

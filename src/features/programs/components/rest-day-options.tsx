'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Calendar, Dumbbell, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ProgramSession, TrainingProgram, ExerciseSuggestion } from '../types';
import { ProgramSessionView } from './program-session-view';
import { getSessionSuggestionsAction } from '../programs.actions';

interface RestDayOptionsProps {
  program: TrainingProgram;
  sessions: ProgramSession[];
  currentWeek: number;
  locale: string;
  energyLevel: 'high' | 'medium' | 'low';
  nextSessionIndex: number;
}

export function RestDayOptions({
  program,
  sessions,
  currentWeek,
  locale,
  energyLevel,
  nextSessionIndex,
}: RestDayOptionsProps) {
  const t = useTranslations('workouts.programs');
  const [selectedSession, setSelectedSession] = useState<ProgramSession | null>(null);
  const [suggestions, setSuggestions] = useState<ExerciseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSession = async (session: ProgramSession) => {
    setIsLoading(true);
    try {
      const sessionSuggestions = await getSessionSuggestionsAction(
        program.id,
        session.id,
        energyLevel
      );
      setSuggestions(sessionSuggestions);
      setSelectedSession(session);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedSession) {
    return (
      <ProgramSessionView
        session={selectedSession}
        suggestions={suggestions}
        energyLevel={energyLevel}
        locale={locale}
        currentWeek={currentWeek}
        totalWeeks={program.durationWeeks}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50/80 to-purple-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
        <Calendar className="h-10 w-10 text-white" />
      </div>

      <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent mb-2">
        {t('restDayTitle')}
      </h1>
      <p className="text-zinc-500 mb-4 max-w-sm">
        {t('restDayDescription', { days: program.daysPerWeek })}
      </p>
      <p className="text-sm text-zinc-400 mb-6 max-w-sm">
        {program.name[locale as 'en' | 'es'] || program.name.es}
        {' · '}{t('week')} {currentWeek}/{program.durationWeeks}
      </p>

      {/* Sesión sugerida */}
      {sessions[nextSessionIndex] && (
        <div className="mb-4 max-w-sm w-full">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <span className="text-xs font-medium text-rose-600 bg-gradient-to-r from-rose-100 to-orange-100 px-3 py-1 rounded-full">
              {t('recommended')}
            </span>
          </div>
          <button
            onClick={() => handleSelectSession(sessions[nextSessionIndex])}
            disabled={isLoading}
            className={cn(
              'w-full p-5 rounded-2xl transition-all duration-300 text-left',
              'bg-gradient-to-r from-rose-500/10 to-orange-500/10 backdrop-blur-md',
              'border-2 border-rose-300 shadow-lg shadow-rose-500/10',
              'hover:shadow-xl hover:scale-[1.02]',
              'disabled:opacity-50 disabled:hover:scale-100'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-base font-semibold text-zinc-800 block">
                    {sessions[nextSessionIndex].name[locale as 'en' | 'es'] || sessions[nextSessionIndex].name.es}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {t('nextInProgram')}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-rose-500" />
            </div>
          </button>
        </div>
      )}

      {/* Otras sesiones */}
      {sessions.length > 1 && (
        <div className="mb-6 max-w-sm w-full">
          <p className="text-sm font-medium text-zinc-500 mb-3">{t('otherSessions')}</p>
          <div className="space-y-2">
            {sessions.map((session, idx) => {
              if (idx === nextSessionIndex) return null;
              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  disabled={isLoading}
                  className={cn(
                    'w-full p-4 rounded-2xl transition-all duration-300 text-left',
                    'bg-white/60 backdrop-blur-md border border-white/80',
                    'hover:bg-white/80 hover:border-violet-200',
                    'disabled:opacity-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-zinc-700">
                        {session.name[locale as 'en' | 'es'] || session.name.es}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón de volver */}
      <Link
        href={`/${locale}/dashboard`}
        className={cn(
          'h-12 px-6 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300',
          'bg-white/60 backdrop-blur-md border border-white/80 text-zinc-600',
          'hover:bg-white/80 hover:border-violet-200'
        )}
      >
        <ArrowLeft className="h-5 w-5" />
        {t('backToDashboard')}
      </Link>
    </div>
  );
}

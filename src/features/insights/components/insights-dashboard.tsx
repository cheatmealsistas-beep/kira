'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Flame,
  TrendingUp,
  Zap,
  Heart,
  Calendar,
  Activity,
  Target,
  Clock,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { getInsightsAction } from '../insights.actions';
import type { InsightsSummary, EnergyLevel, GeneratedInsight } from '../types';

const energyColors: Record<EnergyLevel, string> = {
  high: 'bg-green-500',
  medium: 'bg-amber-500',
  low: 'bg-orange-500',
  rest: 'bg-rose-400',
};

const energyLabels: Record<EnergyLevel, { en: string; es: string }> = {
  high: { en: 'High', es: 'Alta' },
  medium: { en: 'Medium', es: 'Media' },
  low: { en: 'Low', es: 'Baja' },
  rest: { en: 'Rest', es: 'Descanso' },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  TrendingUp,
  Zap,
  Heart,
  Calendar,
};

export function InsightsDashboard() {
  const t = useTranslations('insights');
  const locale = useLocale() as 'en' | 'es';
  const [data, setData] = useState<InsightsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      const result = await getInsightsAction(30);
      if (result.success && result.data) {
        setData(result.data);
      }
      setLoading(false);
    }
    loadInsights();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {locale === 'es'
              ? 'Empieza a registrar tu energía y entrenamientos para ver tus patrones.'
              : 'Start tracking your energy and workouts to see your patterns.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      {data.insights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.insights.slice(0, 3).map((insight) => (
            <InsightCard key={insight.id} insight={insight} locale={locale} />
          ))}
        </div>
      )}

      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Target className="h-5 w-5 text-rose-500" />}
          label={locale === 'es' ? 'Entrenamientos' : 'Workouts'}
          value={data.performance.totalWorkouts.toString()}
          sublabel={locale === 'es' ? 'total' : 'total'}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          label={locale === 'es' ? 'Racha actual' : 'Current streak'}
          value={data.performance.currentStreak.toString()}
          sublabel={locale === 'es' ? 'días' : 'days'}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          label={locale === 'es' ? 'Mejor racha' : 'Best streak'}
          value={data.performance.bestStreak.toString()}
          sublabel={locale === 'es' ? 'días' : 'days'}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          label={locale === 'es' ? 'Duración media' : 'Avg duration'}
          value={data.performance.averageDuration.toString()}
          sublabel="min"
        />
      </div>

      {/* Energy Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-rose-500" />
            {locale === 'es' ? 'Tu patrón de energía' : 'Your energy pattern'}
          </CardTitle>
          <CardDescription>
            {locale === 'es' ? 'Últimos 30 días' : 'Last 30 days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${energyColors[data.energyPattern.dominantEnergy]}`} />
              <div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'es' ? 'Energía dominante' : 'Dominant energy'}
                </p>
                <p className="font-semibold">
                  {energyLabels[data.energyPattern.dominantEnergy][locale]}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Días alta energía' : 'High energy days'}
              </p>
              <p className="font-semibold">{data.energyPattern.highEnergyDays}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Días baja energía' : 'Low energy days'}
              </p>
              <p className="font-semibold">{data.energyPattern.lowEnergyDays}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {locale === 'es' ? 'Días registrados' : 'Days tracked'}
              </p>
              <p className="font-semibold">{data.energyPattern.totalDays}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekday Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-500" />
            {locale === 'es' ? 'Patrones por día' : 'Weekday patterns'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-between">
            {data.weekdayPatterns.map((day) => (
              <div key={day.day} className="flex-1 text-center">
                <div className="text-sm font-medium mb-2">{day.dayShort}</div>
                <div
                  className="h-16 rounded-lg flex items-end justify-center pb-1 transition-all"
                  style={{
                    backgroundColor: day.averageEnergy > 0
                      ? `rgba(244, 63, 94, ${day.averageEnergy / 4})`
                      : 'rgb(241 245 249)',
                  }}
                >
                  {day.workoutCount > 0 && (
                    <span className="text-xs font-medium">
                      {day.workoutCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.averageEnergy > 0 ? day.averageEnergy.toFixed(1) : '-'}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {locale === 'es'
              ? 'Número = entrenamientos realizados. Color = energía media.'
              : 'Number = workouts completed. Color = average energy.'}
          </p>
        </CardContent>
      </Card>

      {/* Energy-Workout Correlations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rose-500" />
            {locale === 'es' ? 'Rendimiento por nivel de energía' : 'Performance by energy level'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.correlations.map((corr) => (
              <div key={corr.energy} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${energyColors[corr.energy]}`} />
                <div className="w-20 font-medium">
                  {energyLabels[corr.energy][locale]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {corr.workoutCount} {locale === 'es' ? 'entrenos' : 'workouts'}
                    </span>
                    {corr.workoutCount > 0 && (
                      <>
                        <span className="text-muted-foreground">
                          {corr.completionRate}% {locale === 'es' ? 'completados' : 'completed'}
                        </span>
                        <span className="text-muted-foreground">
                          {corr.averageDuration} min {locale === 'es' ? 'media' : 'avg'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InsightCard({ insight, locale }: { insight: GeneratedInsight; locale: 'en' | 'es' }) {
  const Icon = iconMap[insight.icon] || Zap;

  const typeColors = {
    achievement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    pattern: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    tip: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    suggestion: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${typeColors[insight.type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold mb-1">{insight.title[locale]}</h3>
        <p className="text-sm text-muted-foreground">{insight.description[locale]}</p>
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">
              {value} <span className="text-sm font-normal text-muted-foreground">{sublabel}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

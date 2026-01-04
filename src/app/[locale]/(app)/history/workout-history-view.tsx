'use client';

import { useState } from 'react';
import {
  Calendar,
  Flame,
  TrendingUp,
  Zap,
  Battery,
  BatteryLow,
  BatteryMedium,
  Dumbbell,
  Trophy,
  Target,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { WorkoutHistoryEntry } from '@/features/programs/programs.query';

interface WorkoutHistoryViewProps {
  initialEntries: WorkoutHistoryEntry[];
  total: number;
  stats: {
    totalWorkouts: number;
    thisWeek: number;
    thisMonth: number;
    currentStreak: number;
    longestStreak: number;
    avgDifficulty: number;
  };
  locale: string;
  translations: {
    empty: { title: string; description: string };
    stats: {
      total: string;
      thisWeek: string;
      thisMonth: string;
      currentStreak: string;
      longestStreak: string;
      avgDifficulty: string;
    };
    entry: { exercises: string; difficulty: string };
    feelings: Record<string, string>;
    loadMore: string;
  };
}

const feelingIcons = {
  exhausted: BatteryLow,
  tired: Battery,
  good: BatteryMedium,
  strong: Zap,
  energized: Flame,
};

const feelingColors = {
  exhausted: 'text-red-500',
  tired: 'text-orange-500',
  good: 'text-amber-500',
  strong: 'text-emerald-500',
  energized: 'text-rose-500',
};

export function WorkoutHistoryView({
  initialEntries,
  total,
  stats,
  locale,
  translations: t,
}: WorkoutHistoryViewProps) {
  const [entries] = useState(initialEntries);
  const hasMore = entries.length < total;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Dumbbell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">
          {t.empty.title}
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          {t.empty.description}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          icon={Trophy}
          label={t.stats.total}
          value={stats.totalWorkouts}
          color="text-rose-500"
        />
        <StatCard
          icon={Calendar}
          label={t.stats.thisWeek}
          value={stats.thisWeek}
          color="text-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          label={t.stats.thisMonth}
          value={stats.thisMonth}
          color="text-emerald-500"
        />
        <StatCard
          icon={Flame}
          label={t.stats.currentStreak}
          value={stats.currentStreak}
          color="text-orange-500"
        />
        <StatCard
          icon={Zap}
          label={t.stats.longestStreak}
          value={stats.longestStreak}
          color="text-purple-500"
        />
        <StatCard
          icon={Target}
          label={t.stats.avgDifficulty}
          value={stats.avgDifficulty.toFixed(1)}
          color="text-blue-500"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {entries.map((entry) => {
          const FeelingIcon = feelingIcons[entry.feeling as keyof typeof feelingIcons] || BatteryMedium;
          const feelingColor = feelingColors[entry.feeling as keyof typeof feelingColors] || 'text-muted-foreground';

          return (
            <div
              key={entry.id}
              className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {entry.sessionName?.[locale as 'en' | 'es'] || 'Workout'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {entry.exerciseCount} {t.entry.exercises}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{formatDate(entry.completedAt)}</span>
                    <span className="flex items-center gap-1">
                      {t.entry.difficulty}: {entry.difficultyRating}/5
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="mt-2 text-sm text-muted-foreground italic">
                      "{entry.notes}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <FeelingIcon className={`w-6 h-6 ${feelingColor}`} />
                  <span className={`text-xs ${feelingColor}`}>
                    {t.feelings[entry.feeling] || entry.feeling}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button variant="outline" disabled>
            {t.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="p-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/shared/auth';
import { getWorkoutHistory, getWorkoutStats } from '@/features/programs/programs.query';
import { WorkoutHistoryView } from './workout-history-view';

interface HistoryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { locale } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const t = await getTranslations({ locale, namespace: 'history' });

  const [historyData, stats] = await Promise.all([
    getWorkoutHistory(user.id, 20, 0),
    getWorkoutStats(user.id),
  ]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      <WorkoutHistoryView
        initialEntries={historyData.entries}
        total={historyData.total}
        stats={stats}
        locale={locale}
        translations={{
          empty: {
            title: t('empty.title'),
            description: t('empty.description'),
          },
          stats: {
            total: t('stats.total'),
            thisWeek: t('stats.thisWeek'),
            thisMonth: t('stats.thisMonth'),
            currentStreak: t('stats.currentStreak'),
            longestStreak: t('stats.longestStreak'),
            avgDifficulty: t('stats.avgDifficulty'),
          },
          entry: {
            exercises: t('entry.exercises'),
            difficulty: t('entry.difficulty'),
          },
          feelings: {
            exhausted: t('feelings.exhausted'),
            tired: t('feelings.tired'),
            good: t('feelings.good'),
            strong: t('feelings.strong'),
            energized: t('feelings.energized'),
          },
          loadMore: t('loadMore'),
        }}
      />
    </div>
  );
}

import { getTranslations } from 'next-intl/server';
import { InsightsDashboard } from '@/features/insights';
import { requireUser } from '@/shared/auth';

interface InsightsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InsightsPage({ params }: InsightsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('insights');
  await requireUser(locale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <InsightsDashboard />
    </div>
  );
}

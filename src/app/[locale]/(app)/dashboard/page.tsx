import { redirect } from 'next/navigation';
import { KiraDashboard } from '@/features/dashboard';
import { getTodayEnergy, getWeeklyProgress } from '@/features/dashboard/dashboard.query';
import { requireUser, getUser } from '@/shared/auth';
import { hasCompletedOnboarding, getTodaySuggestedWorkout } from '@/features/onboarding/onboarding.query';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  // Obtener datos del usuario
  const user = await getUser();
  if (!user) return null;

  // Check if onboarding is completed
  const onboardingCompleted = await hasCompletedOnboarding(user.id);
  if (!onboardingCompleted) {
    redirect(`/${locale}/onboarding`);
  }

  // Fetch data from DB
  const [todayEnergyData, weeklyProgress, suggestedWorkout] = await Promise.all([
    getTodayEnergy(user.id),
    getWeeklyProgress(user.id),
    getTodaySuggestedWorkout(user.id),
  ]);

  // Extraer nombre del usuario
  const userName = user.email?.split('@')[0] || null;

  return (
    <KiraDashboard
      userName={userName}
      todayEnergy={todayEnergyData.level}
      weeklyProgress={weeklyProgress}
      currentStreak={weeklyProgress.currentStreak}
      suggestedWorkout={suggestedWorkout}
    />
  );
}

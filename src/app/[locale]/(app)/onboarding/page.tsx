import { redirect } from 'next/navigation';
import { requireUser, getUser } from '@/shared/auth';
import { hasCompletedOnboarding, OnboardingFlow } from '@/features/onboarding';

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const user = await getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // If onboarding already completed, redirect to dashboard
  const completed = await hasCompletedOnboarding(user.id);
  if (completed) {
    redirect(`/${locale}/dashboard`);
  }

  return <OnboardingFlow locale={locale} />;
}

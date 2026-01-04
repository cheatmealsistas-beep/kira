import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ProfileForm, TrainingSettingsForm, NotificationSettings, getProfileAction } from '@/features/my-account';
import { getFitnessProfile } from '@/features/onboarding/onboarding.query';
import {
  getSubscription,
  SubscriptionCard,
  BillingActions,
} from '@/features/billing';
import { requireUser } from '@/shared/auth';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { User, Dumbbell, Bell, CreditCard } from 'lucide-react';

interface MyAccountPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyAccountPage({ params }: MyAccountPageProps) {
  const { locale } = await params;
  const t = await getTranslations('my-account');
  const tBilling = await getTranslations('billing');
  const user = await requireUser(locale);
  const { profile } = await getProfileAction();
  const fitnessProfile = await getFitnessProfile(user.id);
  const subscription = await getSubscription(user.id);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24 md:pb-8">
      <div className="py-4 md:py-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      {/* Mobile: Tabs | Desktop: Stacked cards */}
      <div className="md:hidden">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-12">
            <TabsTrigger value="profile" className="flex flex-col gap-0.5 h-full text-xs">
              <User className="h-4 w-4" />
              <span>{t('profile')}</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex flex-col gap-0.5 h-full text-xs">
              <Dumbbell className="h-4 w-4" />
              <span>{t('training')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col gap-0.5 h-full text-xs">
              <Bell className="h-4 w-4" />
              <span className="truncate">{t('notifications')}</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex flex-col gap-0.5 h-full text-xs">
              <CreditCard className="h-4 w-4" />
              <span>{tBilling('title')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <ProfileForm profile={profile} />
          </TabsContent>

          <TabsContent value="training" className="mt-4">
            {fitnessProfile ? (
              <TrainingSettingsForm profile={fitnessProfile} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>{t('noTrainingProfile')}</p>
                  <Button asChild className="mt-4">
                    <Link href={`/${locale}/onboarding`}>{t('setupTraining')}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="billing" className="mt-4">
            {subscription ? (
              <div className="space-y-4">
                <SubscriptionCard
                  status={subscription.status}
                  currentPeriodEnd={subscription.current_period_end}
                  cancelAtPeriodEnd={subscription.cancel_at_period_end}
                  locale={locale}
                />
                <BillingActions hasSubscription={true} />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{tBilling('subscription')}</CardTitle>
                  <CardDescription>{tBilling('currentPlan')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{tBilling('noSubscription')}</p>
                    <Button asChild className="w-full">
                      <Link href={`/${locale}/pricing`}>{tBilling('viewPlans')}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Stacked layout */}
      <div className="hidden md:block space-y-6">
        <ProfileForm profile={profile} />

        {fitnessProfile ? (
          <TrainingSettingsForm profile={fitnessProfile} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>{t('noTrainingProfile')}</p>
              <Button asChild className="mt-4">
                <Link href={`/${locale}/onboarding`}>{t('setupTraining')}</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <NotificationSettings />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{tBilling('title')}</h2>
          {subscription ? (
            <div className="space-y-4">
              <SubscriptionCard
                status={subscription.status}
                currentPeriodEnd={subscription.current_period_end}
                cancelAtPeriodEnd={subscription.cancel_at_period_end}
                locale={locale}
              />
              <BillingActions hasSubscription={true} />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{tBilling('subscription')}</CardTitle>
                <CardDescription>{tBilling('currentPlan')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{tBilling('noSubscription')}</p>
                  <Button asChild>
                    <Link href={`/${locale}/pricing`}>{tBilling('viewPlans')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { Bell, BellOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { usePushNotifications } from '@/shared/hooks';

export function NotificationSettings() {
  const t = useTranslations('myAccount');
  const {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    disableNotifications,
  } = usePushNotifications();

  const handleEnable = async () => {
    await requestPermission();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-rose-500" />
          {t('notifications')}
        </CardTitle>
        <CardDescription>{t('notificationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupported ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('notificationsNotSupported')}</span>
          </div>
        ) : permission === 'denied' ? (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('notificationsBlocked')}</span>
          </div>
        ) : isSubscribed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
              <Bell className="h-4 w-4" />
              <span>{t('notificationsEnabled')}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disableNotifications}
            >
              <BellOff className="h-4 w-4 mr-2" />
              {t('disableNotifications')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <BellOff className="h-4 w-4" />
              <span>{t('notificationsDisabled')}</span>
            </div>
            <Button size="sm" onClick={handleEnable}>
              <Bell className="h-4 w-4 mr-2" />
              {t('enableNotifications')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
}

/**
 * Hook for managing PWA push notifications
 * Note: For full push notifications, you need a backend service (e.g., Firebase, OneSignal)
 * This hook handles local notifications and permission management
 */
export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
  });

  // Check support and permission on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

    setState({
      isSupported,
      permission: isSupported
        ? (Notification.permission as NotificationPermission)
        : 'denied',
      isSubscribed: localStorage.getItem('kira_notifications_enabled') === 'true',
    });
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      setState((prev) => ({
        ...prev,
        permission: permission as NotificationPermission,
        isSubscribed: granted,
      }));

      if (granted) {
        localStorage.setItem('kira_notifications_enabled', 'true');
      }

      return granted;
    } catch {
      return false;
    }
  }, [state.isSupported]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    localStorage.removeItem('kira_notifications_enabled');
    setState((prev) => ({
      ...prev,
      isSubscribed: false,
    }));
  }, []);

  // Send a local notification (works only if permission granted)
  const sendLocalNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!state.isSupported || state.permission !== 'granted') return;

      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options,
      });

      return notification;
    },
    [state.isSupported, state.permission]
  );

  // Schedule a notification for a specific time (using setTimeout)
  const scheduleNotification = useCallback(
    (title: string, options: NotificationOptions, delayMs: number) => {
      if (!state.isSupported || state.permission !== 'granted') return null;

      const timeoutId = setTimeout(() => {
        sendLocalNotification(title, options);
      }, delayMs);

      return timeoutId;
    },
    [state.isSupported, state.permission, sendLocalNotification]
  );

  // Send workout reminder notification
  const sendWorkoutReminder = useCallback(() => {
    sendLocalNotification('Es hora de entrenar', {
      body: 'Tu cuerpo te espera. Hoy es un buen día para moverte.',
      tag: 'workout-reminder',
    });
  }, [sendLocalNotification]);

  return {
    ...state,
    requestPermission,
    disableNotifications,
    sendLocalNotification,
    scheduleNotification,
    sendWorkoutReminder,
  };
}

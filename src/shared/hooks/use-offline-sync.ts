'use client';

import { useEffect, useState, useCallback } from 'react';

interface PendingAction<T> {
  id: string;
  type: string;
  data: T;
  timestamp: number;
}

const STORAGE_KEY = 'kira_pending_actions';

/**
 * Hook for offline-first data syncing
 * Stores actions in localStorage when offline and syncs when online
 */
export function useOfflineSync<T>() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Check online status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending count
    const pending = getPendingActions<T>();
    setPendingCount(pending.length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get all pending actions
  const getPendingActions = useCallback(<U>(): PendingAction<U>[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save action for later sync
  const saveForSync = useCallback(
    (type: string, data: T) => {
      if (typeof window === 'undefined') return;

      const pending = getPendingActions<T>();
      const newAction: PendingAction<T> = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
      };

      pending.push(newAction);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      setPendingCount(pending.length);
    },
    [getPendingActions]
  );

  // Clear specific action after successful sync
  const clearAction = useCallback(
    (id: string) => {
      if (typeof window === 'undefined') return;

      const pending = getPendingActions<T>();
      const filtered = pending.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setPendingCount(filtered.length);
    },
    [getPendingActions]
  );

  // Clear all pending actions
  const clearAll = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    setPendingCount(0);
  }, []);

  // Process all pending actions with a sync function
  const syncPending = useCallback(
    async (syncFn: (action: PendingAction<T>) => Promise<boolean>) => {
      if (!isOnline) return { synced: 0, failed: 0 };

      const pending = getPendingActions<T>();
      let synced = 0;
      let failed = 0;

      for (const action of pending) {
        try {
          const success = await syncFn(action);
          if (success) {
            clearAction(action.id);
            synced++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }

      return { synced, failed };
    },
    [isOnline, getPendingActions, clearAction]
  );

  return {
    isOnline,
    pendingCount,
    saveForSync,
    syncPending,
    getPendingActions,
    clearAction,
    clearAll,
  };
}

/**
 * Specific hook for energy tracking offline support
 */
export function useOfflineEnergyTracking() {
  const sync = useOfflineSync<{
    energyLevel: string;
    date: string;
  }>();

  const saveEnergyOffline = useCallback(
    (energyLevel: string) => {
      const today = new Date().toISOString().split('T')[0];
      sync.saveForSync('energy_log', { energyLevel, date: today });
    },
    [sync]
  );

  return {
    ...sync,
    saveEnergyOffline,
  };
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, User, LogOut, ChevronRight, Dumbbell, History, BarChart3 } from 'lucide-react';
import { Button } from './button';
import { logoutAction } from '@/features/auth/auth.actions';

/**
 * MobileMenu - Elegant hamburger menu for mobile app navigation
 *
 * Features:
 * - Smooth slide-in animation
 * - Backdrop blur overlay
 * - Proper focus management
 * - Escape key to close
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('layouts');
  const locale = useLocale();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 w-10 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <div className="relative h-5 w-5">
          <span
            className={`absolute left-0 block h-0.5 w-5 bg-current transform transition-all duration-300 ease-out ${
              isOpen ? 'top-2 rotate-45' : 'top-0.5'
            }`}
          />
          <span
            className={`absolute left-0 top-2 block h-0.5 w-5 bg-current transition-all duration-300 ease-out ${
              isOpen ? 'opacity-0 translate-x-2' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-5 bg-current transform transition-all duration-300 ease-out ${
              isOpen ? 'top-2 -rotate-45' : 'top-3.5'
            }`}
          />
        </div>
      </Button>

      {/* Overlay with blur */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        id="mobile-menu"
        className={`fixed left-0 right-0 top-[60px] z-50 transform transition-all duration-300 ease-out ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <nav className="p-2" role="navigation" aria-label="Menú principal">
            {/* Navigation Items */}
            <Link
              href={`/${locale}/dashboard`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-colors">
                  <LayoutDashboard className="h-4.5 w-4.5" />
                </div>
                <span>{t('dashboard')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-rose-500 transition-colors" />
            </Link>

            <Link
              href={`/${locale}/workouts`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                  <Dumbbell className="h-4.5 w-4.5" />
                </div>
                <span>Entrenar</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
            </Link>

            <Link
              href={`/${locale}/history`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <History className="h-4.5 w-4.5" />
                </div>
                <span>Historial</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-purple-500 transition-colors" />
            </Link>

            <Link
              href={`/${locale}/insights`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <BarChart3 className="h-4.5 w-4.5" />
                </div>
                <span>Insights</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            </Link>

            <Link
              href={`/${locale}/my-account`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                  <User className="h-4.5 w-4.5" />
                </div>
                <span>{t('myAccount')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
            </Link>

            {/* Divider */}
            <div className="my-2 mx-4 h-px bg-zinc-200 dark:bg-zinc-700" />

            {/* Logout */}
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button
                type="submit"
                className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                    <LogOut className="h-4.5 w-4.5" />
                  </div>
                  <span>{t('logout')}</span>
                </div>
              </button>
            </form>
          </nav>
        </div>
      </div>
    </div>
  );
}

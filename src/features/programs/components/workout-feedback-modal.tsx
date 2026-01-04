'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Battery, BatteryLow, BatteryMedium, Zap, Flame } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import type { WorkoutFeedback, FeelingType } from '../types';
import { feelingTypes, difficultyLabels } from '../types';

// Icons and labels for feelings (no emojis)
const feelingConfig: Record<FeelingType, {
  icon: typeof Battery;
  label: { en: string; es: string };
  color: string;
}> = {
  exhausted: {
    icon: BatteryLow,
    label: { en: 'Exhausted', es: 'Agotada' },
    color: 'text-red-500',
  },
  tired: {
    icon: Battery,
    label: { en: 'Tired', es: 'Cansada' },
    color: 'text-orange-500',
  },
  good: {
    icon: BatteryMedium,
    label: { en: 'Good', es: 'Bien' },
    color: 'text-amber-500',
  },
  strong: {
    icon: Zap,
    label: { en: 'Strong', es: 'Fuerte' },
    color: 'text-emerald-500',
  },
  energized: {
    icon: Flame,
    label: { en: 'Energized', es: 'Con energia' },
    color: 'text-rose-500',
  },
};

interface WorkoutFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (feedback: WorkoutFeedback) => void;
  isPending?: boolean;
  locale: string;
}

export function WorkoutFeedbackModal({
  open,
  onClose,
  onSubmit,
  isPending,
  locale,
}: WorkoutFeedbackModalProps) {
  const t = useTranslations('workouts.feedback');
  const [feeling, setFeeling] = useState<FeelingType | null>(null);
  const [difficulty, setDifficulty] = useState<number>(3);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!feeling) return;

    onSubmit({
      feeling,
      difficultyRating: difficulty,
      notes: notes.trim() || undefined,
    });
  };

  const handleSkip = () => {
    onSubmit({
      feeling: 'good',
      difficultyRating: 3,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Feeling selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t('howDoYouFeel')}
            </label>
            <div className="flex justify-between gap-2">
              {feelingTypes.map((type) => {
                const config = feelingConfig[type];
                const Icon = config.icon;
                const isSelected = feeling === type;

                return (
                  <button
                    key={type}
                    onClick={() => setFeeling(type)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? config.color : 'text-muted-foreground'}`} />
                    <span className={`text-xs ${isSelected ? 'font-medium text-rose-600' : 'text-muted-foreground'}`}>
                      {config.label[locale as 'en' | 'es'] || config.label.es}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty slider */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              {t('howWasIt')}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('easy')}</span>
                <span>{t('hard')}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {difficultyLabels[difficulty]?.[locale as 'en' | 'es'] || difficultyLabels[difficulty]?.es}
              </p>
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('notes')} <span className="text-muted-foreground font-normal">({t('optional')})</span>
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="resize-none"
              rows={3}
              maxLength={500}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isPending}
            className="flex-1"
          >
            {t('skip')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!feeling || isPending}
            className="flex-1 gap-2"
          >
            <Send className="h-4 w-4" />
            {isPending ? t('saving') : t('submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

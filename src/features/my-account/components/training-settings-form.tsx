'use client';

import { useState, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Dumbbell, Target, Activity, AlertCircle, Clock, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { updateFitnessProfileAction } from '@/features/onboarding';
import {
  experienceLevels,
  experienceLevelLabels,
  fitnessGoals,
  fitnessGoalLabels,
  bodyLimitations,
  limitationLabels,
  equipmentOptions,
  equipmentLabels,
  type FitnessProfile,
  type ExperienceLevel,
  type FitnessGoal,
  type BodyLimitation,
  type Equipment,
} from '@/features/onboarding';

interface TrainingSettingsFormProps {
  profile: FitnessProfile | null;
}

export function TrainingSettingsForm({ profile }: TrainingSettingsFormProps) {
  const t = useTranslations('myAccount');
  const tUI = useTranslations('ui');
  const locale = useLocale() as 'en' | 'es';
  const [isPending, startTransition] = useTransition();

  // Local state for form
  const [daysPerWeek, setDaysPerWeek] = useState(profile?.trainingDaysPerWeek ?? 3);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    profile?.experienceLevel ?? 'beginner'
  );
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(
    profile?.primaryGoal ?? 'general'
  );
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>(
    profile?.availableEquipment ?? ['bodyweight']
  );
  const [selectedLimitations, setSelectedLimitations] = useState<BodyLimitation[]>(
    profile?.limitations ?? []
  );
  const [preferredDuration, setPreferredDuration] = useState(
    profile?.preferredDuration ?? 45
  );

  const toggleEquipment = (equipment: Equipment) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const toggleLimitation = (limitation: BodyLimitation) => {
    setSelectedLimitations((prev) =>
      prev.includes(limitation)
        ? prev.filter((l) => l !== limitation)
        : [...prev, limitation]
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateFitnessProfileAction({
        trainingDaysPerWeek: daysPerWeek,
        experienceLevel,
        primaryGoal,
        availableEquipment: selectedEquipment,
        limitations: selectedLimitations,
        preferredDuration,
      });

      if (result.success) {
        toast.success(t('updateSuccess'));
      } else {
        toast.error(t('updateError'));
      }
    });
  };

  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-rose-500" />
          {t('training')}
        </CardTitle>
        <CardDescription>{t('trainingDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Days per week */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('daysPerWeek')}</Label>
          <div className="flex gap-2">
            {[2, 3, 4, 5, 6].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDaysPerWeek(days)}
                className={cn(
                  'h-10 w-10 rounded-lg border text-sm font-medium transition-all',
                  daysPerWeek === days
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                )}
              >
                {days}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('experienceLevel')}</Label>
          <div className="grid grid-cols-3 gap-2">
            {experienceLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setExperienceLevel(level)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm transition-all',
                  experienceLevel === level
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                )}
              >
                {experienceLevelLabels[level][locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Goal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-rose-500" />
            {t('primaryGoal')}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {fitnessGoals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setPrimaryGoal(goal)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm transition-all text-left',
                  primaryGoal === goal
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                )}
              >
                {fitnessGoalLabels[goal][locale]}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Duration */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-500" />
            {t('preferredDuration')}
          </Label>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setPreferredDuration(mins)}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm transition-all',
                  preferredDuration === mins
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                )}
              >
                {mins} {t('minutes')}
              </button>
            ))}
          </div>
        </div>

        {/* Available Equipment */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-rose-500" />
            {t('availableEquipment')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {equipmentOptions.map((equipment) => {
              const isSelected = selectedEquipment.includes(equipment);
              return (
                <button
                  key={equipment}
                  type="button"
                  onClick={() => toggleEquipment(equipment)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
                    isSelected
                      ? 'border-rose-500 bg-rose-500 text-white'
                      : 'border-border hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {equipmentLabels[equipment][locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body Limitations */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            {t('limitations')}
          </Label>
          <p className="text-xs text-muted-foreground">{t('limitationsHelp')}</p>
          <div className="flex flex-wrap gap-2">
            {bodyLimitations.map((limitation) => {
              const isSelected = selectedLimitations.includes(limitation);
              return (
                <button
                  key={limitation}
                  type="button"
                  onClick={() => toggleLimitation(limitation)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all',
                    isSelected
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-border hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                  {limitationLabels[limitation][locale]}
                </button>
              );
            })}
          </div>
          {selectedLimitations.length === 0 && (
            <p className="text-xs text-muted-foreground italic">{t('noLimitations')}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? '...' : tUI('save')}
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import {
  ArrowLeftRight,
  Dumbbell,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { getSwapAlternativesAction } from '../workouts.actions';
import type { Exercise } from '../types';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  locale?: string;
  onSwap: (newExercise: {
    name: string;
    instructions?: string;
    equipment?: string[];
  }) => void;
}

export function ExerciseSwapModal({
  isOpen,
  onClose,
  exerciseName,
  locale = 'es',
  onSwap,
}: ExerciseSwapModalProps) {
  const [alternatives, setAlternatives] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, startLoading] = useTransition();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load alternatives when modal opens
  const loadAlternatives = () => {
    if (hasLoaded) return;

    startLoading(async () => {
      const result = await getSwapAlternativesAction(exerciseName, locale);
      if (result.success) {
        setCurrentExercise(result.exercise);
        setAlternatives(result.alternatives);
      }
      setHasLoaded(true);
    });
  };

  // Trigger load when dialog opens
  if (isOpen && !hasLoaded && !isLoading) {
    loadAlternatives();
  }

  // Reset when closed
  const handleClose = () => {
    setSelectedSlug(null);
    onClose();
  };

  const handleConfirmSwap = () => {
    const selected = alternatives.find((a) => a.slug === selectedSlug);
    if (selected) {
      const name = locale === 'es' ? selected.name_es : selected.name_en;
      const instructions =
        locale === 'es' ? selected.card_movement_es : selected.card_movement_es;

      onSwap({
        name,
        instructions: instructions || undefined,
        equipment: selected.equipment_required || [],
      });
      handleClose();
    }
  };

  const getExerciseName = (exercise: Exercise) =>
    locale === 'es' ? exercise.name_es : exercise.name_en;

  const getExerciseInstructions = (exercise: Exercise) =>
    locale === 'es'
      ? exercise.card_movement_es || exercise.card_key_cue_es
      : exercise.card_movement_es || exercise.card_key_cue_es;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            {locale === 'es' ? 'Cambiar ejercicio' : 'Swap exercise'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current exercise */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {locale === 'es' ? 'Ejercicio actual' : 'Current exercise'}
            </p>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-3 flex items-center gap-3">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span className="font-medium">{exerciseName}</span>
              </CardContent>
            </Card>
          </div>

          {/* Alternatives */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              {locale === 'es' ? 'Alternativas' : 'Alternatives'}
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : alternatives.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {locale === 'es'
                    ? 'No hay alternativas disponibles para este ejercicio'
                    : 'No alternatives available for this exercise'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {alternatives.map((alt) => {
                  const isSelected = selectedSlug === alt.slug;
                  return (
                    <button
                      key={alt.slug}
                      onClick={() => setSelectedSlug(alt.slug)}
                      className={cn(
                        'w-full text-left rounded-lg border p-3 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {getExerciseName(alt)}
                          </p>
                          {alt.equipment_required &&
                            alt.equipment_required.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Dumbbell className="h-3 w-3" />
                                {alt.equipment_required.join(', ')}
                              </p>
                            )}
                          {getExerciseInstructions(alt) && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {getExerciseInstructions(alt)}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              {locale === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedSlug}
              onClick={handleConfirmSwap}
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              {locale === 'es' ? 'Cambiar' : 'Swap'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

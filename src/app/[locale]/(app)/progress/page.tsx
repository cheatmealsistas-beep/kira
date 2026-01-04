import { requireUser, getUser } from '@/shared/auth';
import { getWeeklyProgress } from '@/features/dashboard/dashboard.query';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Flame, Trophy, Calendar, TrendingUp, Target } from 'lucide-react';

interface ProgressPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const user = await getUser();
  if (!user) return null;

  const weeklyProgress = await getWeeklyProgress(user.id);

  // Calculate stats (placeholder for now - will come from DB)
  const stats = {
    totalWorkouts: 0,
    totalMinutes: 0,
    longestStreak: weeklyProgress.currentStreak,
    thisMonthWorkouts: 0,
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="relative -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-8 px-4 md:px-6 pt-8 pb-10 bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/30 rounded-b-[2rem]">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          Tu Progreso 📊
        </h1>
        <p className="text-muted-foreground">
          Cada paso cuenta, cada día suma
        </p>
      </div>

      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-3">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{weeklyProgress.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Racha actual</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Mejor racha</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalWorkouts}</p>
              <p className="text-sm text-muted-foreground">Entrenamientos</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats.totalMinutes}</p>
              <p className="text-sm text-muted-foreground">Minutos totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Esta semana
          </h2>

          <Card className="border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between gap-1 mb-6">
                {weeklyProgress.weekDays.map((day, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className={cn(
                      'text-xs font-medium',
                      day.isToday ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {day.day}
                    </span>
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      day.completed
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md'
                        : day.isToday
                          ? 'border-2 border-primary border-dashed bg-primary/5'
                          : 'bg-muted/50'
                    )}>
                      {day.completed ? '✓' : day.isToday ? '•' : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {weeklyProgress.daysCompleted} de 7 días completados
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                      style={{ width: `${(weeklyProgress.daysCompleted / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {Math.round((weeklyProgress.daysCompleted / 7) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Empty state for history */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Historial de entrenamientos</h2>

          <Card className="border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary/50" />
              </div>
              <h3 className="font-semibold mb-2">Aún no hay entrenamientos</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Completa tu primer entrenamiento y aquí verás todo tu historial con estadísticas detalladas.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Motivational message */}
        <div className="text-center py-6 px-4">
          <p className="text-muted-foreground italic">
            "El progreso no es lineal, pero cada paso cuenta. Sigue adelante." 💪
          </p>
        </div>
      </div>
    </div>
  );
}

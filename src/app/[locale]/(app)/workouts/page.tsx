import { redirect } from 'next/navigation';
import { requireUser, getUser } from '@/shared/auth';
import { getTodayEnergy } from '@/features/dashboard/dashboard.query';
import {
  getUserActiveProgram,
  getActivePrograms,
  getProgramWithSessions,
  getSessionSuggestions,
  ProgramSelector,
  ProgramSessionView,
  RestDayOptions,
} from '@/features/programs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Battery } from 'lucide-react';
import Link from 'next/link';

interface WorkoutsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function WorkoutsPage({ params }: WorkoutsPageProps) {
  const { locale } = await params;
  await requireUser(locale);

  const user = await getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Check if user has an active program
  const userProgram = await getUserActiveProgram(user.id);

  // If no active program, show program selector
  if (!userProgram) {
    const availablePrograms = await getActivePrograms();
    return <ProgramSelector programs={availablePrograms} locale={locale} />;
  }

  // Get today's energy
  const { level: energyLevel } = await getTodayEnergy(user.id);

  // If no energy selected, redirect to dashboard to select
  if (!energyLevel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6">
          <Battery className="h-10 w-10 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold mb-2">¿Cómo te sientes hoy?</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Primero cuéntame cómo estás para prepararte el entrenamiento perfecto.
        </p>

        <Button size="lg" className="gap-2 rounded-full" asChild>
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="h-5 w-5" />
            Ir al inicio
          </Link>
        </Button>
      </div>
    );
  }

  // If rest day, show rest screen
  if (energyLevel === 'rest') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
          <span className="text-5xl">💤</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Hoy toca descansar</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">
          El descanso es parte del entrenamiento. Tu cuerpo lo necesita para recuperarse y hacerse más fuerte.
        </p>

        <Card className="border-0 shadow-md mb-8 max-w-sm w-full">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Ideas para tu día de descanso:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>🚶 Un paseo tranquilo</li>
              <li>🧘 Estiramientos suaves</li>
              <li>📖 Lectura relajante</li>
              <li>🛁 Un baño caliente</li>
              <li>💤 Dormir bien</li>
            </ul>
          </CardContent>
        </Card>

        <Button variant="outline" size="lg" className="gap-2 rounded-full" asChild>
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="h-5 w-5" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    );
  }

  // Get program with sessions
  const programData = await getProgramWithSessions(userProgram.programId);
  if (!programData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">Error loading program</p>
      </div>
    );
  }

  // Get today's session based on day of week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Map day of week to session (L-X-V for 3 days, L-M-J-V for 4 days)
  const dayMappings: Record<number, Record<number, number>> = {
    3: { 1: 0, 3: 1, 5: 2 }, // Lunes=0, Miércoles=1, Viernes=2
    4: { 1: 0, 2: 1, 4: 2, 5: 3 }, // L-M-J-V
    5: { 1: 0, 2: 1, 3: 2, 5: 3, 6: 4 }, // L-M-X-V-S
    6: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 }, // L-S
  };

  const daysPerWeek = programData.program.daysPerWeek;
  const mapping = dayMappings[daysPerWeek] || dayMappings[3];
  const sessionIndex = mapping[dayOfWeek];

  // If today is not a training day for this program, show rest day with options
  if (sessionIndex === undefined) {
    // Calcular cuál sería la siguiente sesión según el día
    // Buscar el próximo día de entrenamiento
    const trainingDays = Object.keys(mapping).map(Number).sort((a, b) => a - b);
    let nextTrainingDay = trainingDays.find(d => d > dayOfWeek);
    if (nextTrainingDay === undefined) {
      nextTrainingDay = trainingDays[0]; // Volver al primer día de la semana
    }
    const nextSessionIndex = mapping[nextTrainingDay] ?? 0;

    const effectiveEnergy = energyLevel === 'high' ? 'high' : energyLevel === 'low' ? 'low' : 'medium';

    return (
      <RestDayOptions
        program={programData.program}
        sessions={programData.sessions}
        currentWeek={userProgram.currentWeek}
        locale={locale}
        energyLevel={effectiveEnergy}
        nextSessionIndex={nextSessionIndex}
      />
    );
  }

  const todaySession = programData.sessions[sessionIndex];
  if (!todaySession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    );
  }

  // Get suggestions for all exercises based on energy level
  const effectiveEnergy = energyLevel === 'high' ? 'high' : energyLevel === 'low' ? 'low' : 'medium';
  const suggestions = await getSessionSuggestions(user.id, todaySession, effectiveEnergy);

  return (
    <ProgramSessionView
      session={todaySession}
      suggestions={suggestions}
      energyLevel={effectiveEnergy}
      locale={locale}
      currentWeek={userProgram.currentWeek}
      totalWeeks={programData.program.durationWeeks}
    />
  );
}

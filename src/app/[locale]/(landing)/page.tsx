import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getUser } from '@/shared/auth';
import { Button } from '@/shared/components/ui/button';
import { brand } from '@/shared/config';
import { ArrowRight, Dumbbell, Heart, Sparkles, CheckCircle } from 'lucide-react';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const user = await getUser();

  if (user) {
    redirect(`/${locale}/dashboard`);
  }

  const isEs = locale === 'es';

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-rose-100 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image src={brand.logo} alt={brand.name} width={80} height={28} priority />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/login`}>
                {isEs ? 'Iniciar sesión' : 'Sign in'}
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/${locale}/register`}>
                {isEs ? 'Empezar gratis' : 'Start free'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          {isEs ? 'Tu cuerpo, tu ritmo' : 'Your body, your rhythm'}
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          {isEs ? 'Entrena según' : 'Train according to'}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
            {isEs ? 'Tu Energía' : 'Your Energy'}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {isEs
            ? 'Entrenamientos personalizados que se adaptan a cómo te sientes hoy. Diseñado para mujeres de 40+ que quieren sentirse fuertes sin agotarse.'
            : 'Personalized workouts that adapt to how you feel today. Designed for women 40+ who want to feel strong without burning out.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8" asChild>
            <Link href={`/${locale}/register`}>
              {isEs ? 'Empezar Gratis' : 'Start Free'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link href="#how-it-works">
              {isEs ? 'Ver cómo funciona' : 'See how it works'}
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          {isEs
            ? 'Únete a mujeres que entrenan de forma inteligente'
            : 'Join women who train smarter, not harder'}
        </p>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {isEs ? 'Tu cuerpo sabe' : 'Your body knows best'}
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          {isEs
            ? 'Kira escucha cómo te sientes y ajusta tu entrenamiento'
            : 'Kira listens to how you feel and adjusts your workout'}
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-rose-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isEs ? 'Indica tu energía' : 'Share your energy'}
            </h3>
            <p className="text-muted-foreground">
              {isEs
                ? 'Cada día es diferente. Cuéntanos cómo te sientes y adaptamos el entreno.'
                : 'Every day is different. Tell us how you feel and we adapt the workout.'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-rose-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Dumbbell className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isEs ? 'Entrena a tu medida' : 'Train your way'}
            </h3>
            <p className="text-muted-foreground">
              {isEs
                ? 'Sesiones diseñadas para ti. Con tu equipo, tus limitaciones, tu tiempo.'
                : 'Sessions designed for you. With your equipment, your limitations, your time.'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-rose-100 dark:border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isEs ? 'Progresa sin agotarte' : 'Progress without burnout'}
            </h3>
            <p className="text-muted-foreground">
              {isEs
                ? 'Ajustes automáticos según cómo te sientes. Tu cuerpo te lo agradece.'
                : 'Automatic adjustments based on how you feel. Your body will thank you.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-3xl p-12 md:p-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isEs ? '¿Lista para sentirte más fuerte?' : 'Ready to feel stronger?'}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            {isEs
              ? 'Comienza tu viaje de entrenamiento personalizado hoy. Sin necesidad de gimnasio.'
              : 'Start your personalized training journey today. No gym required.'}
          </p>
          <Button size="lg" variant="secondary" className="px-8" asChild>
            <Link href={`/${locale}/register`}>
              {isEs ? 'Empezar Gratis' : 'Start Free'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-rose-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {brand.name}. {isEs ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              {isEs ? 'Privacidad' : 'Privacy'}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              {isEs ? 'Términos' : 'Terms'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

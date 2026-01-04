/**
 * Kira Brand Configuration
 *
 * Kira: PWA de entrenamiento personalizado para mujeres 40-60+
 * Enfoque: Energía, fuerza y bienestar sin complicaciones
 *
 * Audiencia: Mujeres en premenopausia/menopausia que quieren:
 * - Mantenerse fuertes y activas
 * - Entrenar según cómo se sienten cada día
 * - Sin jerga fitness ni presión
 * - Resultados reales, a su ritmo
 */

export const brand = {
  // ═══════════════════════════════════════════════════════════════════
  // IDENTIDAD DE KIRA
  // ═══════════════════════════════════════════════════════════════════

  /** Nombre del producto */
  name: 'Kira',

  /** Tagline principal - conecta con la propuesta de valor */
  tagline: 'Tu fuerza, tu ritmo',

  /** Descripción corta para contextos donde necesitamos más que el tagline */
  shortDescription: 'Entrena según tu energía. Sin complicaciones.',

  /** Propuesta de valor en una frase */
  valueProposition: 'El entrenamiento que se adapta a ti, no al revés',

  /** Tono de voz: cercano, empoderador, sin condescendencia */
  voiceTone: 'warm-empowering' as const, // Para referencia en copies

  // ═══════════════════════════════════════════════════════════════════
  // CONTACTO Y URLs
  // ═══════════════════════════════════════════════════════════════════

  /** URL de producción */
  website: 'https://kira.fit',

  /** Email de soporte */
  support: 'hola@kira.fit',

  // ═══════════════════════════════════════════════════════════════════
  // ASSETS (place files in /public/)
  // ═══════════════════════════════════════════════════════════════════

  /** Logo for header/navigation (SVG recommended) */
  logo: '/logo.svg',

  /** Small icon for favicon context */
  icon: '/icon.svg',

  /** Browser favicon */
  favicon: '/favicon.svg',

  // ═══════════════════════════════════════════════════════════════════
  // TYPOGRAPHY
  // To change font: see README.md in this folder for instructions
  // ═══════════════════════════════════════════════════════════════════

  font: {
    family: 'Inter',
    package: '@fontsource/inter',
    weights: [400, 500, 600, 700],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TEMA VISUAL - Cálido, femenino, empoderante
  // ═══════════════════════════════════════════════════════════════════

  theme: {
    /**
     * Variante de tema para Kira
     * 'standard' con colores personalizados en globals.css
     *
     * Paleta Kira:
     * - Primary: Coral/Rosa empoderador (no infantil)
     * - Secondary: Verde salvia (calma, naturaleza)
     * - Accent: Dorado suave (celebración, logro)
     * - Backgrounds: Cremas cálidos
     */
    variant: 'standard' as const,

    /** Glassmorphism sutil para cards */
    glass: true,

    /** Esquinas redondeadas - sensación acogedora */
    rounded: 'lg' as const,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO - Optimizado para nuestra audiencia
  // ═══════════════════════════════════════════════════════════════════

  seo: {
    titleTemplate: '%s | Kira',
    defaultTitle: 'Kira - Entrena según tu energía',

    /** Meta description enfocada en beneficios, no features */
    defaultDescription:
      'Rutinas de fuerza que se adaptan a cómo te sientes hoy. Para mujeres que quieren mantenerse fuertes, sin complicaciones ni excusas.',

    /** Keywords naturales, cómo busca nuestra audiencia */
    keywords: [
      'ejercicio mujer 50 años',
      'rutinas fuerza menopausia',
      'entrenamiento para mujeres mayores 40',
      'ejercicios en casa mujer',
      'mantenerse en forma después de los 40',
      'fuerza mujer menopausia',
      'ejercicio según energía',
    ],

    ogImage: '/og-image.png',
    twitterHandle: '@kaborame',

    verification: {
      google: '',
      bing: '',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // REDES SOCIALES - Donde está nuestra comunidad
  // ═══════════════════════════════════════════════════════════════════

  social: {
    twitter: 'https://twitter.com/kaborame',
    instagram: 'https://instagram.com/kira.fit', // Instagram es clave para esta audiencia
    youtube: '', // Tutoriales y demos de ejercicios
    facebook: '', // Comunidad
  },

  // ═══════════════════════════════════════════════════════════════════
  // INFO ORGANIZACIÓN (Schema.org)
  // ═══════════════════════════════════════════════════════════════════

  organization: {
    type: 'Organization' as const,
    foundingDate: '2025',
    founders: ['Maribel'] as string[],
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'ES',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRAWLER & AI BOT CONFIGURATION
  // Controls robots.txt generation and AI search optimization (GEO)
  // ═══════════════════════════════════════════════════════════════════

  crawlers: {
    /**
     * Allow AI bots to crawl your site (recommended for GEO)
     * Includes: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, etc.
     */
    allowAIBots: true,

    /**
     * Paths to disallow in robots.txt
     * Protected routes are automatically excluded
     */
    disallowPaths: ['/app/', '/auth/', '/api/', '/checkout/'],

    /**
     * Additional paths to allow (overrides disallow)
     * Example: ['/api/public/']
     */
    allowPaths: [] as string[],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL PAGES
  // ═══════════════════════════════════════════════════════════════════

  legal: {
    terms: '/terms',
    privacy: '/privacy',
  },

  // ═══════════════════════════════════════════════════════════════════
  // PÁGINAS DE AUTH - Primera impresión importa
  // ═══════════════════════════════════════════════════════════════════

  auth: {
    showBrandingPanel: true,

    /** Gradiente cálido, acogedor */
    gradient: 'from-rose-50 via-amber-50/30 to-background',

    showPattern: true,
    showTestimonial: true,

    /** Testimonio real de nuestra audiencia */
    testimonial: {
      quote: 'Por fin un entrenamiento que entiende que no todos los días son iguales. Algunos días tengo energía para todo, otros solo quiero moverme suave. Kira me lo pone fácil.',
      author: 'Carmen',
      role: '52 años, Madrid',
    },

    /** Beneficios clave - lenguaje de nuestra audiencia */
    features: [
      'Elige cómo te sientes hoy y entrena acorde',
      'Ejercicios claros, sin jerga fitness',
      'Tu cuerpo, tus reglas, tu ritmo',
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════

  copyright: `© ${new Date().getFullYear()} Kira. Hecho con cariño para mujeres fuertes.`,

  // ═══════════════════════════════════════════════════════════════════
  // MENSAJES Y COPIES DE KIRA
  // Tono: cercano, empoderador, nunca condescendiente
  // ═══════════════════════════════════════════════════════════════════

  messages: {
    /** Saludo según hora del día */
    greetings: {
      morning: '¡Buenos días! ¿Cómo amaneces hoy?',
      afternoon: '¡Buenas tardes! ¿Qué tal va el día?',
      evening: '¡Buenas noches! Relaja y descansa.',
    },

    /** Mensajes para niveles de energía */
    energyLevels: {
      high: {
        title: 'A tope',
        description: 'Hoy te sientes con toda la energía. ¡Aprovechemos!',
      },
      medium: {
        title: 'Normal',
        description: 'Un día tranquilo. Vamos a movernos sin forzar.',
      },
      low: {
        title: 'Bajita',
        description: 'Hoy toca suave. Moverse siempre es ganar.',
      },
      rest: {
        title: 'Descanso',
        description: 'Escuchar al cuerpo también es entrenar.',
      },
    },

    /** Celebraciones tras completar workout */
    celebrations: [
      '¡Hecho! Cada sesión cuenta.',
      '¡Genial! Tu yo del futuro te lo agradece.',
      '¡Bien! Constancia > intensidad.',
      '¡Completado! Eso es fuerza de verdad.',
      '¡Lo lograste! Pequeños pasos, grandes cambios.',
    ],

    /** Mensajes motivacionales para días difíciles */
    encouragement: [
      'No tienes que ser perfecta, solo constante.',
      'Cada vez que te mueves, tu cuerpo te lo agradece.',
      'Hoy viniste. Eso ya es ganar.',
      'La fuerza se construye día a día, no de un tirón.',
      'Tu único rival eres tú de ayer.',
    ],

    /** Empty states */
    empty: {
      noWorkouts: 'Todavía no tienes entrenamientos. ¡Empecemos!',
      noHistory: 'Aquí aparecerá tu historial. El primer paso es el más importante.',
    },

    /** CTAs principales */
    cta: {
      startWorkout: 'Empezar entrenamiento',
      continueWorkout: 'Continuar donde lo dejaste',
      viewProgress: 'Ver mi progreso',
      adjustEnergy: 'Cambiar energía de hoy',
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN PWA
  // ═══════════════════════════════════════════════════════════════════

  pwa: {
    name: 'Kira',
    shortName: 'Kira',
    description: 'Tu entrenamiento personalizado',
    themeColor: '#f43f5e', // Rose-500 como color primario
    backgroundColor: '#fffbeb', // Amber-50 como fondo cálido
    display: 'standalone' as const,
    orientation: 'portrait' as const,
  },
};

export type Brand = typeof brand;

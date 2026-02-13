import Link from "next/link"
import { redirect } from "next/navigation"
import {
  Coffee,
  BookOpen,
  BarChart3,
  Timer,
  Star,
  ArrowRight,
  CheckCircle2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  CoffeeBeansIllustration,
  V60Illustration,
  ChemexIllustration,
  GrinderIllustration,
  ScaleIllustration,
} from "@/lib/placeholder-illustrations"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  let user = null
  let userName: string | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user

    // Si el usuario está logueado, redirigir al dashboard
    if (user) {
      redirect("/dashboard")
    }
  } catch {
    // Si falla Supabase, mostramos la version no autenticada
    user = null
  }
  return (
    <div className="min-h-screen bg-neutral-100/80 dark:bg-neutral-950 mesh-gradient">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-white/[0.04] glass border-b border-white/20 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-coffee-600" />
            <span className="font-semibold text-base sm:text-lg">BrewVault</span>
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{userName}</span>
                  <span className="sm:hidden">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Iniciar sesion
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Comenzar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative illustrations */}
        <div className="absolute top-20 left-0 opacity-20 dark:opacity-10 hidden lg:block">
          <V60Illustration className="w-32 h-32 text-coffee-600" />
        </div>
        <div className="absolute top-40 right-0 opacity-20 dark:opacity-10 hidden lg:block">
          <ChemexIllustration className="w-28 h-28 text-coffee-500" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-15 dark:opacity-10 hidden lg:block">
          <CoffeeBeansIllustration className="w-24 h-24 text-coffee-700" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/50 dark:bg-white/[0.06] glass-subtle glass-border text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-coffee-500" />
            Tu diario digital de cafe de especialidad
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 sm:mb-6">
            Cada taza cuenta
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">una historia</span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Registra tus cafés, perfecciona tus preparaciones y descubre patrones
            en tu viaje cafetero.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href={user ? "/beans" : "/signup"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
                {user ? "Ir al dashboard" : "Empezar ahora"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
                Conocer mas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Break - Coffee Illustration */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white/40 dark:bg-white/[0.04] glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-coffee-200/30 to-coffee-300/30 dark:from-coffee-900/20 dark:to-coffee-800/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-tr from-coffee-200/30 to-yellow-200/30 dark:from-coffee-900/20 dark:to-yellow-900/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-3 gap-4 sm:gap-8 text-center">
              <div className="space-y-1 sm:space-y-3">
                <div className="text-2xl sm:text-5xl font-bold text-neutral-900 dark:text-white">20+</div>
                <div className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">Parametros</div>
              </div>
              <div className="space-y-1 sm:space-y-3">
                <div className="text-2xl sm:text-5xl font-bold text-neutral-900 dark:text-white">7</div>
                <div className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">Tipos de datos</div>
              </div>
              <div className="space-y-1 sm:space-y-3">
                <div className="text-2xl sm:text-5xl font-bold text-neutral-900 dark:text-white">100%</div>
                <div className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400">Gratis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto px-2">
              Herramientas disenadas para entusiastas del cafe que quieren llevar
              su experiencia al siguiente nivel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <FeatureCard
              icon={<Coffee className="h-6 w-6" />}
              illustration={<CoffeeBeansIllustration className="w-16 h-16 text-coffee-600/60" />}
              title="Biblioteca de Cafés"
              description="Registra origen, variedad, proceso, notas de sabor y mas. Nunca olvides un cafe que te encanto."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              illustration={<V60Illustration className="w-16 h-16 text-coffee-600/60" />}
              title="Diario de Preparaciones"
              description="Documenta cada variable: dosis, temperatura, tiempo, molienda. Replica tus mejores tazas."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              illustration={<BarChart3 className="w-14 h-14 text-coffee-600/40" />}
              title="Dashboard Analitico"
              description="Visualiza tu consumo, gasto, origenes favoritos y metodos preferidos en graficos claros."
            />
            <FeatureCard
              icon={<Timer className="h-6 w-6" />}
              illustration={<ScaleIllustration className="w-16 h-16 text-coffee-600/60" />}
              title="Control de Inventario"
              description="Sigue el stock de tus cafés con alertas de frescura y agotamiento automáticas."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              illustration={<GrinderIllustration className="w-16 h-16 text-coffee-600/60" />}
              title="Notas de Cata SCA"
              description="Evalua con el protocolo profesional: fragancia, acidez, cuerpo, balance y mas."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-white/20 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
              Simple y poderoso
            </h2>
            <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400">
              Tres pasos para transformar tu rutina de cafe
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            <StepCard
              number="01"
              title="Registra tus cafés"
              description="Anade cada bolsa de cafe con todos sus detalles: origen, tostador, notas de sabor."
            />
            <StepCard
              number="02"
              title="Documenta tus brews"
              description="Cada preparacion queda guardada con todos los parametros para replicarla o mejorarla."
            />
            <StepCard
              number="03"
              title="Descubre patrones"
              description="El dashboard te muestra tendencias, preferencias y te ayuda a encontrar tu cafe perfecto."
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6">
                Por que BrewVault
              </h2>
              <div className="space-y-4">
                <BenefitItem text="Accesible desde cualquier dispositivo, sin instalacion" />
                <BenefitItem text="Tus datos sincronizados en la nube, siempre seguros" />
                <BenefitItem text="Interfaz limpia y facil de usar" />
                <BenefitItem text="Sin publicidad, sin distracciones" />
                <BenefitItem text="Desarrollado por amantes del cafe" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white/40 dark:bg-white/[0.04] glass-panel rounded-3xl flex items-center justify-center overflow-hidden">
                <V60Illustration className="w-48 h-48 text-coffee-600/70 dark:text-coffee-400/50" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/50 dark:bg-white/[0.06] glass-panel rounded-2xl flex items-center justify-center overflow-hidden">
                <ScaleIllustration className="w-20 h-20 text-coffee-500/60" />
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/50 dark:bg-white/[0.06] glass-panel rounded-xl flex items-center justify-center overflow-hidden">
                <CoffeeBeansIllustration className="w-16 h-16 text-coffee-700/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-3 sm:mb-4">
            {user ? "Continua tu viaje cafetero" : "Empieza tu diario hoy"}
          </h2>
          <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8 px-2">
            {user
              ? "Registra tu proxima preparacion y sigue perfeccionando tu tecnica."
              : "Unete a la comunidad de entusiastas que estan mejorando su cafe cada dia."}
          </p>
          <Link href={user ? "/brews/new" : "/signup"}>
            <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base">
              {user ? "Nueva preparacion" : "Crear cuenta gratis"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/20 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-coffee-600" />
              <span className="font-semibold">BrewVault</span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8 text-sm text-neutral-600 dark:text-neutral-400">
              {user ? (
                <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Iniciar sesion
                  </Link>
                  <Link href="/signup" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
              2026 BrewVault
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  illustration,
  title,
  description,
}: {
  icon: React.ReactNode
  illustration?: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-panel hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/40 dark:bg-white/[0.06] glass-subtle flex items-center justify-center">
          {icon}
        </div>
        {illustration && (
          <div className="opacity-60 group-hover:opacity-80 transition-opacity">
            {illustration}
          </div>
        )}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-1 sm:mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="text-4xl sm:text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-2 sm:mb-4">
        {number}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-1 sm:mb-2">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-neutral-700 dark:text-neutral-300">{text}</span>
    </div>
  )
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard } from 'lucide-react';
import { HeroTypewriter } from '@/components/landing/HeroTypewriter';
import { AnimatedStep } from '@/components/landing/AnimatedStep';
import { CountUpMetric } from '@/components/landing/CountUpMetric';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      {/* SECCIÓN 1 — NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/70 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg p-1.5 shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-serif font-bold text-stone-800 tracking-tight">Orbit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-stone-600 hover:text-teal-700 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login" className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors shadow-sm">
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* SECCIÓN 2 — HERO */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#F4F1EB] overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #a8a29e 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-800 leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Organiza, colabora<br />
                y entrega <span className="text-teal-700">sin fricción.</span>
              </h1>
              <p className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                Orbit es el espacio de trabajo donde los equipos ágiles brillan. Con sincronización instantánea y un asistente de Inteligencia Artificial integrado, gestionar proyectos nunca fue tan natural.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link href="/login" className="bg-teal-700 text-white rounded-full h-14 px-8 text-lg shadow-lg hover:-translate-y-0.5 transition-transform flex items-center font-medium">
                  Empezar ahora &rarr;
                </Link>
              </div>
            </div>
            
            <div className="lg:pl-10 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <HeroTypewriter />
            </div>
          </div>
        </section>

        {/* SECCIÓN 3 — TICKER DE FUNCIONES */}
        <section className="bg-stone-100 border-y border-stone-200 py-6 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 z-10" style={{ backgroundImage: 'linear-gradient(to right, #f5f5f4, transparent)' }}></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 z-10" style={{ backgroundImage: 'linear-gradient(to left, #f5f5f4, transparent)' }}></div>
          
          <div className="flex w-max animate-marquee">
            {[1, 2].map((group) => (
              <div key={group} className="flex items-center gap-6 px-3">
                {['Colaboración en Tiempo Real', 'Creación de Tareas por Voz', 'Modo Zen sin distracciones', 'Notificaciones Inteligentes', 'Privacidad y Seguridad', 'Arrastrar y Soltar fluido', 'Asignación de Roles'].map((tech, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <span className="bg-white border border-stone-200 rounded-full px-4 py-1.5 text-sm font-medium text-stone-600 shadow-sm whitespace-nowrap">
                      {tech}
                    </span>
                    <span className="text-teal-400 font-bold">·</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* SECCIÓN 4 — CÓMO FUNCIONA */}
        <section className="bg-white py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-stone-800 text-center mb-20">
              De la idea al entregable en segundos
            </h2>

            <div className="flex flex-col lg:flex-row gap-8 relative">
              <div className="absolute top-0 bottom-0 left-8 lg:left-0 lg:right-0 lg:top-12 lg:bottom-auto w-px lg:w-full h-full lg:h-px border-l lg:border-l-0 lg:border-t border-dashed border-teal-200 z-0"></div>
              
              {/* Paso 1 */}
              <div className="flex-1 relative z-10 bg-white lg:bg-transparent flex flex-row lg:flex-col gap-6 lg:gap-4 pl-16 lg:pl-0">
                <div className="absolute lg:relative left-0 top-0 lg:top-auto font-mono text-5xl font-bold text-teal-100 bg-white lg:bg-transparent pb-2 pr-2">01</div>
                <AnimatedStep>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">Crea tu espacio</h3>
                  <p className="text-stone-500 mb-4 h-auto lg:h-24">Invita a tus colaboradores por correo y dales acceso seguro. Todo tu equipo estará en la misma página de inmediato.</p>
                </AnimatedStep>
              </div>

              {/* Paso 2 */}
              <div className="flex-1 relative z-10 bg-white lg:bg-transparent flex flex-row lg:flex-col gap-6 lg:gap-4 pl-16 lg:pl-0">
                <div className="absolute lg:relative left-0 top-0 lg:top-auto font-mono text-5xl font-bold text-teal-100 bg-white lg:bg-transparent pb-2 pr-2">02</div>
                <AnimatedStep>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">Organiza al instante</h3>
                  <p className="text-stone-500 mb-4 h-auto lg:h-24">Arrastra y suelta tus tarjetas con una fluidez inigualable. Los cambios se reflejan al instante en las pantallas de todos.</p>
                </AnimatedStep>
              </div>

              {/* Paso 3 */}
              <div className="flex-1 relative z-10 bg-white lg:bg-transparent flex flex-row lg:flex-col gap-6 lg:gap-4 pl-16 lg:pl-0">
                <div className="absolute lg:relative left-0 top-0 lg:top-auto font-mono text-5xl font-bold text-teal-100 bg-white lg:bg-transparent pb-2 pr-2">03</div>
                <AnimatedStep>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">Usa tu voz</h3>
                  <p className="text-stone-500 mb-4 h-auto lg:h-24">¿Estás en movimiento? Pulsa el micrófono, dicta tu idea y nuestra IA redactará el título y los detalles de la tarea por ti.</p>
                </AnimatedStep>
              </div>

              {/* Paso 4 */}
              <div className="flex-1 relative z-10 bg-white lg:bg-transparent flex flex-row lg:flex-col gap-6 lg:gap-4 pl-16 lg:pl-0">
                <div className="absolute lg:relative left-0 top-0 lg:top-auto font-mono text-5xl font-bold text-teal-100 bg-white lg:bg-transparent pb-2 pr-2">04</div>
                <AnimatedStep>
                  <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">No olvides nada</h3>
                  <p className="text-stone-500 mb-4 h-auto lg:h-24">Orbit monitoriza el progreso y te envía recordatorios amigables al correo si detecta que una tarea se ha quedado atascada por días.</p>
                </AnimatedStep>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5 — MÉTRICAS */}
        <section className="bg-[#F4F1EB] py-20 border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <CountUpMetric end={0} label="Curva de aprendizaje para tu equipo" />
            <CountUpMetric end={100} suffix="%" label="Sincronización en tiempo real" />
            <CountUpMetric end={24} suffix="/7" label="Asistencia de IA inteligente" />
            <div className="text-center flex flex-col items-center justify-center p-4">
              <div className="text-5xl md:text-6xl font-serif font-bold text-teal-700 mb-2 tracking-tighter">
                ∞
              </div>
              <div className="text-sm text-stone-500 max-w-[180px] text-center mx-auto">
                Fluidez al organizar tus tareas
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 6 — CTA FINAL */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-stone-800 rounded-[2.5rem] relative overflow-hidden py-16 px-6 text-center shadow-xl">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-transparent to-transparent opacity-60"></div>
              
              <div className="relative z-10">
                <h2 className="text-white font-serif text-3xl md:text-5xl font-bold mb-4">¿Todo listo para verlo en acción?</h2>
                <p className="text-stone-400 text-lg mb-10">Crea tu primer proyecto en 30 segundos. Sin tarjeta de crédito.</p>
                <Link href="/login" className="inline-block bg-teal-400 hover:bg-teal-300 text-stone-900 font-bold rounded-full h-14 px-10 leading-[56px] text-lg transition-transform hover:scale-105 shadow-md">
                  Crear mi proyecto ahora
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FDFBF7] border-t border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-stone-200 rounded-lg p-1.5">
              <LayoutDashboard className="h-4 w-4 text-stone-400" />
            </div>
            <span className="text-lg font-serif font-bold text-stone-400 tracking-tight">Orbit</span>
          </div>
          
          <div className="text-stone-400 text-sm font-medium text-center">
            © {new Date().getFullYear()} Orbit Kanban. Diseñado para la fluidez.
          </div>
        </div>
      </footer>
    </div>
  );
}

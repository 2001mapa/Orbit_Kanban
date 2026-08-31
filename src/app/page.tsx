import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, LayoutDashboard, Zap, Mic, ShieldCheck, Sparkles, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si el usuario ya está autenticado, lo enviamos directo al dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-teal-200 selection:text-teal-900 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-700 p-1.5 rounded-lg shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-stone-50" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-800">Orbit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-stone-600 hover:text-teal-700 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-6 shadow-md transition-transform hover:scale-105">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center lg:pt-32 lg:pb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            <span>La nueva forma de organizar equipos ágiles</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-800 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Organiza tu mente,<br className="hidden md:block" /> libera tu <span className="text-teal-700 relative whitespace-nowrap"><span className="relative z-10">potencial.</span><svg className="absolute w-full h-3 -bottom-1 left-0 text-teal-200 z-0" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg></span>
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Orbit es el tablero Kanban definitivo. Cero latencia, ordenamiento matemático de máxima precisión e Inteligencia Artificial integrada para que tu equipo fluya sin interrupciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl transition-all">
                Empezar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-stone-300 text-stone-700 hover:bg-stone-100 transition-all">
                Ver Demo
              </Button>
            </Link>
          </div>

          {/* Abstract UI Preview (Hero Image Alternative) */}
          <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent z-10 h-full w-full bottom-0 top-auto"></div>
            <div className="bg-white rounded-2xl md:rounded-[2rem] border border-stone-200 shadow-2xl p-4 md:p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-4 w-full overflow-hidden opacity-90">
                {[1, 2, 3].map((col) => (
                  <div key={col} className="flex-1 bg-stone-50 rounded-xl p-4 min-w-[250px] border border-stone-100 hidden md:block">
                    <div className="h-4 w-24 bg-stone-200 rounded-full mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 h-24"></div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-stone-200 h-32"></div>
                      {col === 2 && <div className="bg-white p-3 rounded-lg ring-2 ring-teal-500 shadow-md h-20 relative"><div className="absolute -right-2 -top-2 bg-teal-500 text-white rounded-full p-1"><Mic className="h-3 w-3" /></div></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white border-y border-stone-200 py-20 lg:py-28 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-4">Ingeniería de nivel Enterprise</h2>
              <p className="text-stone-500 max-w-2xl mx-auto text-lg">
                No es un simple To-Do list. Hemos construido Orbit sobre tecnologías modernas para garantizar la mejor experiencia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#FDFBF7] border border-stone-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 font-serif">Tiempo Real Absoluto</h3>
                <p className="text-stone-600 leading-relaxed">
                  Desarrollado con Supabase Realtime y WebSockets. Observa a tus compañeros mover tarjetas en vivo sin necesidad de refrescar la página.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#FDFBF7] border border-stone-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <FolderKanban className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 font-serif">Motor LexoRank</h3>
                <p className="text-stone-600 leading-relaxed">
                  El mismo algoritmo matemático que utiliza Jira. Ordena miles de tareas arrastrando y soltando sin operaciones costosas en la base de datos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#FDFBF7] border border-stone-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="bg-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <Mic className="h-6 w-6 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 font-serif">Inteligencia Artificial</h3>
                <p className="text-stone-600 leading-relaxed">
                  ¿Manos ocupadas? Usa el botón de voz. Transcribimos tu audio con Whisper y extraemos tareas automáticas con GPT-4o.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-teal-500" />
            <span className="text-xl font-serif font-bold tracking-tight text-white">Orbit</span>
          </div>
          <p className="text-sm text-center md:text-left">
            © {new Date().getFullYear()} Orbit. Creado para dominar la productividad.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="https://github.com/2001mapa/Orbit_Kanban" target="_blank" className="hover:text-white transition-colors">Ver Código Fuente (GitHub)</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

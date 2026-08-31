import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, LayoutDashboard, Zap, Mic, Sparkles, FolderKanban, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InteractiveBackground } from '@/components/landing/InteractiveBackground';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-teal-200 selection:text-teal-900 overflow-hidden relative">
      <InteractiveBackground />
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/60 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-1.5 rounded-lg shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-stone-50" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-stone-800">Orbit</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-stone-600 hover:text-teal-700 transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/login">
              <Button className="bg-stone-900 hover:bg-teal-700 text-white rounded-full px-5 shadow-md transition-all hover:scale-105">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center lg:pt-32 lg:pb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-stone-200 text-stone-600 text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>El tablero Kanban del futuro</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-800 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Tu equipo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500">sincronizado</span> a la perfección.
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Despídete del caos. Orbit combina ordenamiento matemático, colaboración sin latencia e Inteligencia Artificial para que fluir sea inevitable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-teal-900/20 transition-all hover:-translate-y-0.5">
                Empezar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Minimalist Floating Dashboard Preview */}
          <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto perspective-1000 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/20 to-transparent z-10 h-full w-full bottom-0 top-auto"></div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl p-4 md:p-8 transform-gpu rotate-x-12 scale-95 hover:scale-100 hover:rotate-x-0 transition-all duration-700 ease-out group">
              <div className="flex gap-4 w-full overflow-hidden opacity-90">
                {/* Column 1 */}
                <div className="flex-1 bg-stone-50/80 rounded-2xl p-4 border border-stone-100/50">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-24 bg-stone-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200/60 h-28 transform transition-transform group-hover:-translate-y-1"></div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200/60 h-20 transform transition-transform delay-75 group-hover:-translate-y-1"></div>
                  </div>
                </div>
                {/* Column 2 */}
                <div className="flex-1 bg-stone-50/80 rounded-2xl p-4 border border-stone-100/50 hidden md:block mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-28 bg-stone-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl ring-2 ring-teal-500/50 shadow-lg h-32 relative transform transition-transform delay-150 group-hover:-translate-y-2 group-hover:shadow-teal-900/10">
                      <div className="absolute -right-3 -top-3 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full p-2 shadow-md animate-bounce">
                        <Mic className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Column 3 */}
                <div className="flex-1 bg-stone-50/80 rounded-2xl p-4 border border-stone-100/50 hidden lg:block">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-20 bg-stone-200 rounded-full"></div>
                    <div className="h-5 w-5 bg-stone-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200/60 h-24 transform transition-transform delay-100 group-hover:-translate-y-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="relative z-20 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-24">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-800 mb-6">Ingeniería Enterprise</h2>
              <p className="text-stone-500 max-w-2xl mx-auto text-lg md:text-xl">
                Diseñado desde cero para soportar equipos de alto rendimiento.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[300px]">
              
              {/* Feature 1 (Large Span) */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-white border border-stone-200 hover:border-teal-300 transition-colors shadow-sm hover:shadow-xl p-8 md:p-12 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                  <Zap className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-teal-100 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4 font-serif">Sincronización Inmediata</h3>
                  <p className="text-stone-500 text-lg leading-relaxed max-w-md">
                    Arquitectura distribuida con Supabase Realtime y WebSockets. Los cambios fluyen entre tu equipo literalmente en cero milisegundos.
                  </p>
                </div>
              </div>

              {/* Feature 2 (Square) */}
              <div className="relative group overflow-hidden rounded-[2rem] bg-stone-900 text-white border border-stone-800 hover:border-stone-700 transition-colors shadow-sm hover:shadow-xl p-8 flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="bg-stone-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lock className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-serif">Anti-Zombies</h3>
                  <p className="text-stone-400 leading-relaxed">
                    Bloqueos optimistas para que dos personas no editen la misma tarjeta a la vez. Limpieza automática en caso de desconexión.
                  </p>
                </div>
              </div>

              {/* Feature 3 (Square) */}
              <div className="relative group overflow-hidden rounded-[2rem] bg-white border border-stone-200 hover:border-teal-300 transition-colors shadow-sm hover:shadow-xl p-8 flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FolderKanban className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-3 font-serif">LexoRank Core</h3>
                  <p className="text-stone-500 leading-relaxed">
                    Ordenamiento matemático avanzado. Arrastra tarjetas infinitamente sin saturar la base de datos con costosas actualizaciones O(n).
                  </p>
                </div>
              </div>

              {/* Feature 4 (Large Span) */}
              <div className="md:col-span-2 relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-50 to-white border border-teal-100 hover:border-teal-300 transition-colors shadow-sm hover:shadow-xl p-8 md:p-12 flex flex-col justify-between">
                 <div className="absolute bottom-0 right-0 opacity-5 transform translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                  <Mic className="w-64 h-64 text-teal-900" />
                </div>
                <div className="relative z-10">
                  <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                    <Mic className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4 font-serif">IA Integrada</h3>
                  <p className="text-stone-600 text-lg leading-relaxed max-w-md">
                    ¿Estás en una reunión? Toca el botón, dicta tu idea al micrófono y deja que nuestro motor extraiga la tarea y la descripción automáticamente usando Whisper y GPT-4o.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
        
        {/* Banner CTA */}
        <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-stone-900 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/40 via-stone-900 to-stone-900"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">¿Listo para elevar tu productividad?</h2>
              <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto">Únete a la nueva generación de gestión de proyectos diseñada para equipos que exigen el máximo rendimiento.</p>
              <Link href="/login">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-stone-900 rounded-full px-10 h-14 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                  Crear mi primer proyecto
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-stone-200/50 bg-[#FDFBF7] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-stone-200 p-1.5 rounded-lg">
              <LayoutDashboard className="h-4 w-4 text-stone-500" />
            </div>
            <span className="text-lg font-serif font-bold tracking-tight text-stone-400">Orbit</span>
          </div>
          <p className="text-sm text-stone-400 text-center md:text-left font-medium">
            © {new Date().getFullYear()} Orbit Kanban.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <a href="https://github.com/2001mapa/Orbit_Kanban" target="_blank" className="text-stone-400 hover:text-teal-600 transition-colors">Código Fuente</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

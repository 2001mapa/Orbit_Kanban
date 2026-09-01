'use client';
import { useState, useEffect } from 'react';

const TASKS = [
  {
    title: 'Diseñar la nueva interfaz web',
    desc: 'Llamar a los clientes y estructurar las prioridades de esta semana de forma automática.',
    badge: '✓ Creada por IA',
    color: 'teal'
  },
  {
    title: 'Preparar pitch de ventas',
    desc: 'Reunir métricas del Q3 y armar las diapositivas clave para la reunión del viernes.',
    badge: '⚡ Alta Prioridad',
    color: 'rose'
  },
  {
    title: 'Revisar código del backend',
    desc: 'Auditar el sistema de colas en producción y optimizar tiempos de respuesta.',
    badge: '👨‍💻 Asignada a Carlos',
    color: 'indigo'
  },
  {
    title: 'Redactar post para el blog',
    desc: 'Escribir sobre cómo nuestro equipo multiplicó por diez su productividad este año.',
    badge: '✓ Creada por IA',
    color: 'teal'
  }
];

export function HeroTypewriter() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [cursorPhase, setCursorPhase] = useState<'title' | 'desc' | 'done'>('title');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    
    const currentTask = TASKS[taskIndex];

    if (isExiting) {
      timeout = setTimeout(() => {
        setIsExiting(false);
        setTitle('');
        setDesc('');
        setShowBadge(false);
        setCursorPhase('title');
        setTaskIndex((prev) => (prev + 1) % TASKS.length);
      }, 500);
      return () => clearTimeout(timeout);
    }

    if (cursorPhase === 'title') {
      if (title.length < currentTask.title.length) {
        timeout = setTimeout(() => {
          setTitle(currentTask.title.substring(0, title.length + 1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setCursorPhase('desc');
        }, 400);
      }
    } else if (cursorPhase === 'desc') {
      if (desc.length < currentTask.desc.length) {
        timeout = setTimeout(() => {
          setDesc(currentTask.desc.substring(0, desc.length + 1));
        }, 20);
      } else {
        setCursorPhase('done');
        timeout = setTimeout(() => {
          setShowBadge(true);
          setTimeout(() => setIsExiting(true), 2500);
        }, 200);
      }
    }

    return () => clearTimeout(timeout);
  }, [title, desc, cursorPhase, taskIndex, isExiting]);

  const task = TASKS[taskIndex];
  
  const badgeClasses: Record<string, string> = {
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700'
  };

  const dotClasses: Record<string, string> = {
    teal: 'bg-teal-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500'
  };

  const currentBadgeClass = badgeClasses[task.color] || badgeClasses.teal;
  const currentDotClass = dotClasses[task.color] || dotClasses.teal;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-stone-200 p-6 max-w-sm w-full mx-auto animate-float text-left relative min-h-[180px] flex flex-col justify-start transition-all duration-500 transform ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${currentDotClass}`}></div>
        <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Nueva Tarea</div>
      </div>
      
      <h3 className="font-serif font-bold text-lg text-stone-800 mb-2 leading-snug min-h-[28px]">
        {title}
        {cursorPhase === 'title' && <span className="animate-pulse font-sans ml-0.5 inline-block w-1.5 h-4 bg-teal-500 align-middle -mt-1"></span>}
      </h3>
      
      <p className="text-sm text-stone-500 leading-relaxed font-sans flex-1 min-h-[60px]">
        {desc}
        {cursorPhase === 'desc' && <span className="animate-pulse font-sans ml-0.5 inline-block w-1.5 h-3 bg-stone-400 align-middle -mt-0.5"></span>}
      </p>
      
      <div className={`absolute bottom-4 right-4 border text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-500 ${currentBadgeClass} ${showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {task.badge}
      </div>
    </div>
  );
}

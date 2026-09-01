'use client';
import { useState, useEffect } from 'react';

export function HeroTypewriter() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [cursorPhase, setCursorPhase] = useState('title');

  const fullTitle = 'Diseñar la nueva interfaz web';
  const fullDesc = 'Llamar a los clientes y estructurar las prioridades de esta semana de forma automática.';

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (cursorPhase === 'title') {
      if (title.length < fullTitle.length) {
        timeout = setTimeout(() => {
          setTitle(fullTitle.substring(0, title.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setCursorPhase('desc');
        }, 400);
      }
    } else if (cursorPhase === 'desc') {
      if (desc.length < fullDesc.length) {
        timeout = setTimeout(() => {
          setDesc(fullDesc.substring(0, desc.length + 1));
        }, 30);
      } else {
        setCursorPhase('done');
        timeout = setTimeout(() => {
          setShowBadge(true);
        }, 200);
      }
    }

    return () => clearTimeout(timeout);
  }, [title, desc, cursorPhase]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 max-w-sm w-full mx-auto animate-float text-left relative min-h-[160px] flex flex-col justify-start">
      <div className="mb-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-teal-500"></div>
        <div className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Nueva Tarea</div>
      </div>
      <h3 className="font-serif font-bold text-lg text-stone-800 mb-2 leading-snug h-7">
        {title}
        {cursorPhase === 'title' && <span className="animate-pulse font-sans">|</span>}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed font-sans flex-1">
        {desc}
        {cursorPhase === 'desc' && <span className="animate-pulse">|</span>}
      </p>
      
      <div className={`absolute bottom-4 right-4 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full transition-opacity duration-500 ${showBadge ? 'opacity-100' : 'opacity-0'}`}>
        ✓ Creada por IA
      </div>
    </div>
  );
}

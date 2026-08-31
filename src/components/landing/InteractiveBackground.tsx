'use client';

import { useEffect, useState } from 'react';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Orb that follows mouse */}
      <div 
        className="absolute w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform"
        style={{
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
        }}
      />
      {/* Static floating decorative orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-stone-300/20 rounded-full blur-[80px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}

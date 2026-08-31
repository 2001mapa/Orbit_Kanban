import type { Metadata } from "next";
import { Nunito, Lora } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

import Providers from './providers';

import { Toaster } from 'sonner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://orbit-app.vercel.app'),
  title: {
    template: '%s | Orbit',
    default: 'Orbit — Kanban Colaborativo en Tiempo Real',
  },
  description: 'Orbit es un tablero Kanban colaborativo con tiempo real, sistema de bloqueo distribuido, LexoRank y automatización de tareas con IA.',
  openGraph: {
    type: 'website',
    siteName: 'Orbit',
    title: 'Orbit — Kanban Colaborativo en Tiempo Real',
    description: 'Tablero Kanban colaborativo con sistema de bloqueo distribuido y LexoRank.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit — Kanban Colaborativo en Tiempo Real',
    description: 'Tablero Kanban colaborativo con sistema de bloqueo distribuido y LexoRank.',
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-800">
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

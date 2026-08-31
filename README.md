# 🛰️ Orbit

![Orbit Banner](public/window.svg)

**Orbit** es un tablero Kanban colaborativo en tiempo real diseñado para equipos ágiles. A diferencia de un simple CRUD, Orbit está construido con patrones de arquitectura de nivel de producción, incluyendo sistemas distribuidos de bloqueo optimista, matemáticas de ordenamiento LexoRank y procesamiento de colas asíncronas.

## ✨ Características Principales (Technical Highlights)

- **Colaboración en Tiempo Real (WebSockets):** Sincronización instantánea de tarjetas, columnas y estados de los usuarios mediante Supabase Realtime (Presence & Broadcast).
- **Sistema de Bloqueo Distribuido Anti-Zombie:** Al arrastrar una tarjeta, se emite un \	ask_lock\ con latencia cero que bloquea visualmente la tarjeta para los demás. Los bloqueos de usuarios desconectados se limpian automáticamente (\purgeZombieLocks\).
- **Motor de Ordenamiento LexoRank:** Usa el mismo algoritmo de ordenamiento fraccionario que Jira, evitando operaciones de reescritura O(n) al mover tareas. Incluye un trabajo CRON para rebalanceo automático.
- **Arquitectura de Tareas Asíncronas (Fan-Out):** Un Vercel Cron dispara un productor que consulta la BD y encola mensajes criptográficamente firmados en **QStash** de Upstash. Un Worker Serverless (Idempotente) verifica la firma y procesa recordatorios por correo vía **Resend**.
- **IA Integrada para Tareas por Voz:** Captura de audio procesada por OpenAI Whisper y estructurada a través de GPT-4o-mini con \esponse_format: json_object\ para crear tareas automáticamente.
- **Autenticación y Seguridad (RLS):** Control de acceso basado en roles con Row Level Security a nivel de PostgreSQL, incluyendo vistas seguras (\security_invoker = true\).
- **Modo Zen:** Vista sin distracciones que oculta la interfaz y fuerza los límites de **Work-In-Progress (WIP)**.

## 🏗️ Arquitectura del Sistema

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS v4, Zustand, TanStack Query, Radix UI / Shadcn.
- **Backend:** Next.js Server Actions & API Routes.
- **Base de Datos & Auth:** Supabase (PostgreSQL, Auth, Realtime).
- **Infraestructura de Cola:** Upstash QStash (Serverless Message Broker).
- **Mailing:** Resend.
- **Inteligencia Artificial:** OpenAI API (Whisper & GPT-4o).

## 🚀 Instalación y Despliegue Local

1. Clona este repositorio.
2. Instala las dependencias:
   \\\ash
   npm install
   \\\
3. Copia el archivo de variables de entorno y configúralo con tus credenciales:
   \\\ash
   cp .env.example .env.local
   \\\
4. (Opcional) Si cuentas con la CLI de Supabase, puedes aplicar las migraciones a tu base de datos remota:
   \\\ash
   supabase link --project-ref <tu-project-ref>
   supabase db push
   \\\
5. Inicia el servidor de desarrollo:
   \\\ash
   npm run dev
   \\\

## 🧪 Testing y CI/CD
El proyecto cuenta con validación estricta de TypeScript (\
px tsc --noEmit\), linting (\ESLint\) y pruebas unitarias con **Vitest** para garantizar la integridad de las funciones matemáticas (LexoRank) y la lógica de estado global (Locks). Todo es validado automáticamente en cada push gracias a **GitHub Actions**.

## 🔒 Seguridad
Se aplican las mejores prácticas HTTP a través de los \headers\ de Next.js (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options) y seguridad estricta en base de datos.

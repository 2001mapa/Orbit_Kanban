import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Retorna la respuesta con las cookies actualizadas y verifica la sesión
  const { response, user } = await updateSession(request)
  
  const isWorkspaceRoute = request.nextUrl.pathname.startsWith('/workspace')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  // Redirección si no hay usuario y quiere entrar al workspace
  if (isWorkspaceRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirección al workspace si ya está logueado y visita login
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/workspace', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

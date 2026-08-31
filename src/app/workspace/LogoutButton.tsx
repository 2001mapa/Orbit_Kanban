'use client'

import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'
import { useTransition } from 'react'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => startTransition(() => logoutAction())}
      disabled={isPending}
      className="flex w-full items-center text-red-600 cursor-pointer disabled:opacity-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? 'Saliendo...' : 'Cerrar Sesión'}</span>
    </button>
  )
}

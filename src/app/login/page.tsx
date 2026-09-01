'use client'

import { useState, useTransition } from 'react'
import { loginAction, signupAction } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Obtenemos qué botón fue el que disparó el submit
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    const actionType = submitter?.value || 'login'

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      setError(null)
      try {
        let res
        if (actionType === 'signup') {
          res = await signupAction(formData)
        } else {
          res = await loginAction(formData)
        }

        if (res?.error) {
          setError(res.error)
        }
      } catch (err) {
        setError('Ocurrió un error de conexión.')
      }
    })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#F4F1EB] text-stone-800 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-stone-500 hover:text-teal-700 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>
      <Card className="w-full max-w-md shadow-lg border-stone-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif font-bold tracking-tight">Bienvenido a Orbit</CardTitle>
          <CardDescription className="text-stone-600">
            Ingresa a tu cuenta o regístrate para comenzar a gestionar tareas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-stone-700">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="border-stone-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-700">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="border-stone-200"
              />
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <Button type="submit" value="login" className="bg-teal-700 hover:bg-teal-800" disabled={isPending}>
                {isPending ? 'Procesando...' : 'Iniciar Sesión'}
              </Button>
              <Button type="submit" value="signup" variant="outline" className="border-stone-200 text-stone-700" disabled={isPending}>
                Crear Cuenta Nueva
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

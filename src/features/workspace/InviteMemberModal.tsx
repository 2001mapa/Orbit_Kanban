'use client'
import { useState, useTransition } from 'react'
import { inviteUserAction } from '@/app/actions/invitations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, Loader2 } from 'lucide-react'

export function InviteMemberModal({ workspaceId }: { workspaceId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [isPending, startTransition] = useTransition()

  const handleInvite = () => {
    if (!email.includes('@')) {
      toast.error('Correo inválido');
      return;
    }

    startTransition(async () => {
      const res = await inviteUserAction(workspaceId, email, role)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success(`Invitación enviada a ${email}`)
        setEmail('')
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <Button variant="outline" size="sm" className="gap-2 border-stone-200 text-stone-700 hover:bg-stone-50" onClick={() => setIsOpen(true)}>
        <UserPlus className="h-4 w-4" />
        <span>Invitar</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="font-sans border-stone-200 bg-[#FDFBF7] shadow-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-stone-800 text-xl">Invitar a un Miembro</DialogTitle>
            <DialogDescription className="text-stone-500">
              Enviaremos un correo de invitación a este usuario para unirse al tablero.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-3">
              <Input
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="flex-1 bg-white border-stone-200 focus-visible:ring-teal-600/30 rounded-xl placeholder:text-stone-400"
              />
              <Select value={role} onValueChange={(v) => setRole(v || 'member')} disabled={isPending}>
              <SelectTrigger className="w-[120px] bg-white border-stone-200 rounded-xl" aria-label="Seleccionar rol">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent className="border-stone-200 rounded-xl">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Miembro</SelectItem>
                <SelectItem value="viewer">Lector</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full bg-teal-700 hover:bg-teal-800 text-stone-50 rounded-xl" 
            onClick={handleInvite} 
            disabled={isPending || !email}
          >
            {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isPending ? 'Enviando...' : 'Enviar Invitación'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

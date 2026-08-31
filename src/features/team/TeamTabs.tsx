'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useTransition, useState } from 'react'
import { removeMemberAction, revokeInviteAction } from '@/app/actions/team'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type EnrichedMember = {
  user_id: string;
  role: string;
  created_at: string;
  email: string;
}

export type Invitation = {
  id: string;
  workspace_id: string;
  email: string;
  role: string;
  created_at: string;
}

export function TeamTabs({ 
  members, 
  invitations, 
  workspaceId, 
  currentUserId 
}: { 
  members: EnrichedMember[], 
  invitations: Invitation[], 
  workspaceId: string, 
  currentUserId: string 
}) {
  const [isPending, startTransition] = useTransition()
  
  // Estado para el modal de confirmación
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    type: 'member' | 'invite' | null;
    id: string | null;
  }>({ isOpen: false, type: null, id: null });

  const executeAction = () => {
    if (!confirmState.id) return;

    startTransition(async () => {
      if (confirmState.type === 'member') {
        const res = await removeMemberAction(confirmState.id!, workspaceId)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success("Miembro expulsado correctamente")
        }
      } else if (confirmState.type === 'invite') {
        const res = await revokeInviteAction(confirmState.id!, workspaceId)
        if (res.error) {
          toast.error(res.error)
        } else {
          toast.success("Invitación revocada")
        }
      }
    })
  }

  const handleRemoveMember = (userId: string) => {
    setConfirmState({ isOpen: true, type: 'member', id: userId })
  }

  const handleRevokeInvite = (inviteId: string) => {
    setConfirmState({ isOpen: true, type: 'invite', id: inviteId })
  }

  return (
    <>
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Miembros Activos ({members.length})</TabsTrigger>
          <TabsTrigger value="invitations">Invitaciones Pendientes ({invitations.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="bg-[#FDFBF7] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200 p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-stone-200 hover:bg-transparent">
                <TableHead className="text-stone-500 font-semibold">Email</TableHead>
                <TableHead className="text-stone-500 font-semibold">Rol</TableHead>
                <TableHead className="text-stone-500 font-semibold">Fecha de Ingreso</TableHead>
                <TableHead className="text-right text-stone-500 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const isCurrentUser = member.user_id === currentUserId
                return (
                  <TableRow key={member.user_id} className="border-stone-100 hover:bg-stone-50/50 transition-colors">
                    <TableCell className="font-medium text-stone-800">
                      {member.email}
                      {isCurrentUser && <span className="ml-2 text-[10px] uppercase tracking-wider bg-stone-200 text-stone-700 px-2 py-0.5 rounded-md font-bold">Tú</span>}
                    </TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase ${
                        member.role === 'admin' ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {member.role === 'admin' ? 'Admin' : 'Miembro'}
                      </span>
                    </TableCell>
                    <TableCell className="text-stone-500 text-sm">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        disabled={isCurrentUser || isPending}
                        onClick={() => handleRemoveMember(member.user_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isPending && !isCurrentUser ? 'Procesando...' : 'Expulsar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="invitations" className="bg-[#FDFBF7] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200 p-4">
          {invitations.length === 0 ? (
            <div className="text-center py-12 text-stone-500 border-2 border-dashed border-stone-200 rounded-lg">
              No hay invitaciones pendientes.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-stone-200 hover:bg-transparent">
                  <TableHead className="text-stone-500 font-semibold">Email Invitado</TableHead>
                  <TableHead className="text-stone-500 font-semibold">Rol Asignado</TableHead>
                  <TableHead className="text-stone-500 font-semibold">Fecha de Envío</TableHead>
                  <TableHead className="text-right text-stone-500 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invite) => (
                  <TableRow key={invite.id} className="border-stone-100 hover:bg-stone-50/50 transition-colors">
                    <TableCell className="font-medium text-stone-800">{invite.email}</TableCell>
                    <TableCell>
                      <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase ${
                        invite.role === 'admin' ? 'bg-teal-100 text-teal-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {invite.role === 'admin' ? 'Admin' : 'Miembro'}
                      </span>
                    </TableCell>
                    <TableCell className="text-stone-500 text-sm">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg"
                        disabled={isPending}
                        onClick={() => handleRevokeInvite(invite.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isPending ? 'Procesando...' : 'Revocar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog 
        open={confirmState.isOpen} 
        onOpenChange={(open) => !open && setConfirmState({ isOpen: false, type: null, id: null })}
      >
        <AlertDialogContent className="font-sans border-stone-200 bg-[#FDFBF7] shadow-xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-stone-800 text-xl">
              {confirmState.type === 'member' ? '¿Expulsar a este miembro?' : '¿Revocar esta invitación?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              {confirmState.type === 'member' 
                ? 'El usuario perderá inmediatamente el acceso a las tareas y tableros de este proyecto. Podrás volver a invitarlo más adelante.'
                : 'El enlace enviado por correo dejará de funcionar y el usuario no podrá unirse al proyecto.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-stone-200 text-stone-600 hover:bg-stone-100">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeAction} 
              className={`rounded-xl text-stone-50 ${confirmState.type === 'member' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              {confirmState.type === 'member' ? 'Sí, expulsar' : 'Sí, revocar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

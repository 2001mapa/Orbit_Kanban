'use client';

import { useState } from 'react';
import { acceptInvitationAction } from '@/app/actions/acceptInvite';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Mail } from 'lucide-react';

type Invitation = {
  id: string;
  role: string;
  workspace_id: string;
  workspaces: {
    name: string;
  };
};

export function PendingInvites({ invites }: { invites: Invitation[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  if (!invites || invites.length === 0) return null;

  const handleAccept = async (invitationId: string) => {
    setProcessingId(invitationId);
    try {
      const res = await acceptInvitationAction(invitationId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('¡Te has unido al proyecto!');
        router.refresh(); // Recargar la página para ver el proyecto en la cuadrícula
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-teal-500" />
        Invitaciones Pendientes ({invites.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invites.map((invite) => (
          <div key={invite.id} className="bg-teal-50/50 border border-teal-100 rounded-xl p-5 flex flex-col items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-800">{invite.workspaces.name}</h4>
              <p className="text-sm text-gray-500 mt-1">Te han invitado como <span className="font-semibold uppercase text-xs">{invite.role}</span></p>
            </div>
            <Button 
              onClick={() => handleAccept(invite.id)} 
              disabled={processingId === invite.id}
              className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              {processingId === invite.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Aceptar Invitación
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

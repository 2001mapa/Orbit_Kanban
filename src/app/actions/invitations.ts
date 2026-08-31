'use server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function inviteUserAction(workspaceId: string, email: string, role: string) {
  const supabase = await createClient()
  
  // 1. Validar autenticación
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // 2. Validar rol de admin (Doble check de seguridad en el servidor)
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single()

  if (!member || member.role !== 'admin') {
    return { error: 'Solo los administradores pueden enviar invitaciones' }
  }

  // 3. Insertar invitación en DB
  const { error: insertError } = await supabase
    .from('workspace_invitations')
    .insert({ workspace_id: workspaceId, email, role })

  if (insertError) {
    if (insertError.code === '23505') return { error: 'El usuario ya tiene una invitación pendiente' }
    return { error: insertError.message }
  }

  // 4. Enviar correo (Nota: En un entorno de altísima concurrencia, esto debería enviarse a QStash)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  try {
    await resend.emails.send({
      from: 'Orbit <onboarding@resend.dev>', // Email configurado en Resend
      to: email,
      subject: 'Invitación a Workspace - Orbit',
      html: `
        <h2>Has sido invitado a colaborar en Orbit</h2>
        <p>Un administrador te ha invitado a su Workspace con el rol de <strong>${role}</strong>.</p>
        <p>Para aceptar la invitación, haz clic en el siguiente enlace y regístrate con este mismo correo:</p>
        <a href="${appUrl}/login">Aceptar Invitación y Entrar</a>
      `
    })
  } catch (error) {
    // Falla el email pero la invitación existe en DB
    console.error("Error enviando email:", error)
  }

  return { success: true }
}

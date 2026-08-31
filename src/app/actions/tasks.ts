'use server'
import { createClient } from '@/lib/supabase/server'
import { LexoRank } from 'lexorank'

export async function createTaskAction(workspaceId: string, title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // Obtener la última tarea de 'todo' para poner la nueva al final
  const { data: lastTask } = await supabase
    .from('tasks')
    .select('lexorank')
    .eq('workspace_id', workspaceId)
    .eq('status', 'todo')
    .order('lexorank', { ascending: false })
    .limit(1)
    .maybeSingle()

  let newLexorank = LexoRank.middle().toString();
  if (lastTask && lastTask.lexorank) {
    try {
      newLexorank = LexoRank.parse(lastTask.lexorank).genNext().toString();
    } catch (e) {
      // Fallback si la base de datos tiene un string que no es de LexoRank
      newLexorank = LexoRank.middle().toString();
    }
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      workspace_id: workspaceId,
      status: 'todo',
      lexorank: newLexorank,
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    return { error: error.message }
  }
  return { success: true, task: data }
}

export async function fetchTasksAction(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('lexorank', { ascending: true })

  if (error) {
    console.error("SUPABASE SELECT ERROR:", error)
    throw new Error(error.message)
  }
  return data
}

export async function moveTaskAction(taskId: string, workspaceId: string, newStatus: string, newLexorank: string, assignedTo: string | null) {
  const supabase = await createClient();
  
  // 1. Validar sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  // 2. Seguridad estricta: Verificar pertenencia al workspace
  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (!member) {
    return { error: 'No tienes permisos en este proyecto' };
  }

  // 3. Mutar
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: newStatus,
      lexorank: newLexorank,
      assigned_to: assignedTo,
      last_updated: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('workspace_id', workspaceId) // Doble chequeo
    .select()
    .single();

  if (error) {
    console.error("SUPABASE UPDATE ERROR:", error);
    return { error: error.message };
  }

  return { success: true, task: data };
}

export async function updateTaskAction(taskId: string, workspaceId: string, updates: { title?: string; description?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { data: member } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', user.id)
    .single();

  if (!member) return { error: 'No tienes permisos en este proyecto' };

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('workspace_id', workspaceId)
    .select()
    .single();

  if (error) {
    console.error('SUPABASE UPDATE ERROR:', error);
    return { error: error.message };
  }

  return { success: true, task: data };
}


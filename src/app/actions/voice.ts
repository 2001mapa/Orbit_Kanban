'use server';

import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { LexoRank } from 'lexorank';

export async function processVoiceTask(formData: FormData, workspaceId: string) {
  try {
    const audioFile = formData.get('audio') as File;
    if (!audioFile) {
      throw new Error("No audio file provided");
    }

    if (!process.env.OPENAI_API_KEY) {
      return { success: false, error: "La API Key de OpenAI no está configurada. Añádela en las variables de entorno para usar la voz." };
    }

    // Usaremos OpenAI. Asegúrate de tener OPENAI_API_KEY en .env.local
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 1. Transcripción con Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    if (!transcription.text) {
      throw new Error("Could not transcribe audio");
    }

    // 2. Extracción Estructurada con GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { 
          role: "system", 
          content: "Eres un product manager. Extrae la información del requerimiento a partir de la transcripción y devuelve ESTRICTAMENTE un JSON con: 'title' (string corto), 'description' (string detallado con viñetas), 'priority' ('low', 'medium', 'high', 'urgent')." 
        },
        { 
          role: "user", 
          content: transcription.text 
        }
      ]
    });

    const aiData = JSON.parse(completion.choices[0].message.content || "{}");

    // 3. Inserción en Supabase
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Verificar permisos en el workspace
    const { data: member } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (!member) {
      throw new Error("User not part of the workspace");
    }

    // Obtener el LexoRank para la parte inferior de 'todo'
    const { data: todoTasks } = await supabase
      .from('tasks')
      .select('lexorank')
      .eq('workspace_id', workspaceId)
      .eq('status', 'todo')
      .order('lexorank', { ascending: true });

    let newLexorank: string;
    if (!todoTasks || todoTasks.length === 0) {
      newLexorank = LexoRank.middle().toString();
    } else {
      const lastTaskRank = LexoRank.parse(todoTasks[todoTasks.length - 1].lexorank);
      newLexorank = lastTaskRank.genNext().toString();
    }

    const { data: newTask, error } = await supabase.from('tasks').insert({
      title: aiData.title || 'Tarea sin título',
      description: aiData.description || '',
      priority: aiData.priority || 'medium',
      tags: ['Creada por IA'],
      status: 'todo',
      workspace_id: workspaceId,
      created_by: user.id,
      lexorank: newLexorank,
    }).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    return { success: true, task: newTask };
  } catch (error: any) {
    console.error("processVoiceTask error:", error);
    return { success: false, error: error.message };
  }
}

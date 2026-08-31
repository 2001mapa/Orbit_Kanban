import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: Request) {
  // 1. Validar identidad de Vercel Cron
  const authHeader = req.headers.get("authorization");
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 2. Obtener tareas atascadas (Más de 3 días) 
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: stuckTasks, error } = await supabaseAdmin
      .from('tasks')
      .select('id, created_by')
      .eq('status', 'in_progress')
      .lt('last_updated', threeDaysAgo);

    if (error) throw error;
    if (!stuckTasks || stuckTasks.length === 0) {
      return NextResponse.json({ message: 'No stuck tasks found' });
    }

    // 3. El Encolador: Enviar a Upstash QStash en lotes paralelos
    const APP_URL = process.env.APP_URL || 'https://tu-dominio.com';
    // Usamos el QSTASH_URL específico de la región (si está en .env), por defecto el global
    const qstashBaseUrl = process.env.QSTASH_URL ? process.env.QSTASH_URL.replace(/\/$/, '') : 'https://qstash.upstash.io';
    const QSTASH_PUBLISH_URL = `${qstashBaseUrl}/v2/publish/${APP_URL}/api/worker/send-reminder`;
    const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

    const promises = stuckTasks.map((task) => 
      fetch(QSTASH_PUBLISH_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${QSTASH_TOKEN}`,
          'Content-Type': 'application/json',
          'Upstash-Forward-Upstash-Signature': 'true', // Aseguramos que QStash nos firme el callback
        },
        body: JSON.stringify({ taskId: task.id, userId: task.created_by }),
      })
    );

    await Promise.all(promises);
    
    return new NextResponse("OK - Tareas encoladas", { status: 200 });
  } catch (error) {
    console.error("Cron Producer Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

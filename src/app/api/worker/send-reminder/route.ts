import { Receiver } from "@upstash/qstash";
import { NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

// Inicializar fuera del handler para evitar re-instanciación
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || '',
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(req: Request) {
  try {
    // 1. Leer como texto puro para mantener la integridad del hash
    const bodyText = await req.text();
    const signature = req.headers.get("Upstash-Signature");

    if (!signature) {
      return new NextResponse("Unauthorized - Missing Signature", { status: 401 });
    }

    // 2. Verificar criptográficamente
    const isValid = await receiver.verify({
      signature,
      body: bodyText,
    });

    if (!isValid) {
      return new NextResponse("Unauthorized - Invalid Signature", { status: 401 });
    }

    // 3. Parsear el payload solo después de validar
    const payload = JSON.parse(bodyText);
    const { taskId, userId } = payload;

    if (!taskId || !userId) {
      return new NextResponse('Missing taskId or userId', { status: 400 });
    }

    // 4. Lógica de idempotencia
    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .select('id, title, status, last_updated')
      .eq('id', taskId)
      .single();

    if (error || !task) {
      return new NextResponse('Task not found', { status: 404 });
    }

    if (task.status !== 'in_progress') {
      return NextResponse.json({ 
        message: 'Task is no longer in progress. Skipped.',
        status: task.status
      });
    }

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    if (new Date(task.last_updated) > threeDaysAgo) {
      return NextResponse.json({ 
        message: 'Task was recently updated. Skipped.' 
      });
    }

    // 5. Envío de email
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .single();

    const userEmail = profile?.email;
    
    if (!userEmail) {
      return NextResponse.json({ message: 'User has no email. Skipped.' });
    }

    await resend.emails.send({
      from: 'Orbit <noreply@tudominio.com>',
      to: [userEmail],
      subject: `Recordatorio: Tarea "${task.title}" atascada`,
      html: `<p>Hola, tu tarea <strong>${task.title}</strong> lleva más de 3 días en progreso. ¿Necesitas ayuda para completarla?</p>`
    });

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("Worker Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

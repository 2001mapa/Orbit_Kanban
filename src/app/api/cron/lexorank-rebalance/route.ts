import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { LexoRank } from 'lexorank';

// ARC-05 FIX: API Route to rebalance LexoRanks if they grow too long.
// Intended to be called periodically (e.g. daily) by Vercel Cron or Upstash QStash.
export async function GET(request: Request) {
  try {
    // 1. Verify authorization (e.g. Cron Secret)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Fetch all tasks ordered by current lexorank
    const { data: tasks, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('id, workspace_id, status, lexorank')
      .order('lexorank', { ascending: true });

    if (fetchError || !tasks) {
      throw fetchError;
    }

    // Group tasks by workspace and status
    const groupedTasks = tasks.reduce((acc, task) => {
      const key = `${task.workspace_id}-${task.status}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);

    let rebalancedCount = 0;

    // 3. Rebalance each group
    for (const key of Object.keys(groupedTasks)) {
      const group = groupedTasks[key];
      
      // Only rebalance if there's a task with a dangerously long lexorank (> 30 chars)
      const needsRebalance = group.some(t => t.lexorank.length > 30);
      
      if (needsRebalance) {
        let currentRank = LexoRank.middle();
        
        for (const task of group) {
          await supabaseAdmin
            .from('tasks')
            .update({ lexorank: currentRank.toString() })
            .eq('id', task.id);
            
          currentRank = currentRank.genNext();
          rebalancedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, rebalancedCount });
  } catch (error: any) {
    console.error('LexoRank Rebalance Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

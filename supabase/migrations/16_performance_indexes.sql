
-- ARC-06 FIX: Missing Database Indexes

-- Index for dashboard queries filtering by user_id
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id 
  ON public.workspace_members(user_id);

-- Index for pending invites lookup
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_email 
  ON public.workspace_invitations(email);

-- Composite index for fetching tasks without a status filter
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_lexorank 
  ON public.tasks(workspace_id, lexorank);

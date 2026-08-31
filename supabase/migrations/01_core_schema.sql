-- 1. Tablas Core
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
  lexorank TEXT NOT NULL, -- Obligatorio: Reemplaza al INTEGER de posición
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices de Rendimiento (Crucial para Cron Jobs y Realtime)
CREATE INDEX idx_tasks_workspace_status ON tasks(workspace_id, status);
CREATE INDEX idx_tasks_cron_query ON tasks(status, last_updated) WHERE status = 'in_progress';
CREATE INDEX idx_tasks_lexorank ON tasks(workspace_id, status, lexorank);

-- 3. Políticas RLS (Row Level Security)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Política de ejemplo: Solo los miembros del workspace pueden ver/editar sus tareas
CREATE POLICY "Miembros pueden acceder a tareas del workspace" ON tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = tasks.workspace_id 
      AND workspace_members.user_id = auth.uid()
    )
  );

-- 4. Habilitar Realtime solo para lo necesario
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER TABLE tasks REPLICA IDENTITY FULL;

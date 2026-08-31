-- Eliminar la vista si existiera previamente
DROP VIEW IF EXISTS workspace_task_stats;

-- Crear vista segura (security_invoker=true asegura que se ejecute el RLS
-- de la tabla tasks subyacente simulando al usuario actual, evitando bypass).
CREATE OR REPLACE VIEW workspace_task_stats WITH (security_invoker = true) AS
SELECT 
  workspace_id,
  status,
  COUNT(id) as total_tasks
FROM tasks
GROUP BY workspace_id, status;

-- Asignar permisos explícitos para que el rol autenticado pueda consultarla
GRANT SELECT ON workspace_task_stats TO authenticated;

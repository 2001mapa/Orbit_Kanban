const fs = require('fs');
let content = fs.readFileSync('src/features/tasks/Board.tsx', 'utf8');

const badgesHtml = `
                                    {/* BADGES SECTION */}
                                    <div className="flex flex-wrap gap-1.5 mt-1 pt-2">
                                      {task.priority && task.priority !== 'medium' && (
                                        <span className={\`text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full \${task.priority === 'urgent' || task.priority === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-green-50 text-green-700 border border-green-200'}\`}>
                                          {task.priority === 'urgent' ? '🚨 Urgente' : task.priority === 'high' ? '⚡ Alta Prioridad' : 'baja'}
                                        </span>
                                      )}
                                      
                                      {task.tags && task.tags.length > 0 && task.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                          {tag}
                                        </span>
                                      ))}

                                      {task.assigned_to && (
                                        <span className="text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {getAssigneeLabel(task.assigned_to)}
                                        </span>
                                      )}
                                    </div>
`;

// Replace the old assigned_to block with the new badges block
const oldAssignedBlock = `
                                    {task.assigned_to && (
                                      <div className="flex items-center gap-1.5 mt-1 border-t border-stone-100 pt-3">
                                        <User className={\`h-3 w-3 md:h-3.5 md:w-3.5 \${isMyFocusTask ? 'text-teal-600' : 'text-stone-400'}\`} />
                                        <span className={\`text-[10px] md:text-[11px] font-bold tracking-wider \${isMyFocusTask ? 'text-teal-700 uppercase' : 'text-stone-500'}\`}>
                                          {isMyFocusTask ? 'Tú' : getAssigneeLabel(task.assigned_to)}
                                        </span>
                                      </div>
                                    )}
`;
// Note: wait, powershell or javascript regex replace might fail if the old text contains Tú instead of Tu... the text in Board.tsx has a UTF-8 issue? It says 'T' in the console output. 
// I will use regex to target it safely.

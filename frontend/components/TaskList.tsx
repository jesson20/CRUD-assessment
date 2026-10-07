import { PriorityBadge, StatusBadge } from "@/components/TaskBadges";
import type { Task } from "@/lib/types";

type TaskListProps = { tasks: Task[]; deletingTaskId: number | null; onEdit: (task: Task) => void; onDelete: (task: Task) => void };

function formatDueDate(dueDate: string | null) {
  if (!dueDate) return "No due date";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(dueDate));
}

export function TaskList({ tasks, deletingTaskId, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
    <h3 className="font-semibold text-slate-800">No tasks yet</h3><p className="mt-1 text-sm text-slate-500">Create your first task using the form.</p>
  </div>;

  return <div className="space-y-3">{tasks.map((task) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={task.id}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2"><h3 className="break-words text-lg font-bold">{task.title}</h3><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
      {task.description && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{task.description}</p>}
      <p className="mt-3 text-sm text-slate-500">Due: {formatDueDate(task.due_date)}</p>
    </div><div className="flex shrink-0 gap-3"><button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800" onClick={() => onEdit(task)} type="button">Edit</button>
      <button className="text-sm font-semibold text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50" disabled={deletingTaskId === task.id} onClick={() => onDelete(task)} type="button">{deletingTaskId === task.id ? "Deleting…" : "Delete"}</button>
    </div></div>
  </article>)}</div>;
}

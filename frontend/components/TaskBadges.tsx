import type { TaskPriority, TaskStatus } from "@/lib/types";

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
};
const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-sky-100 text-sky-800",
  medium: "bg-violet-100 text-violet-800",
  high: "bg-rose-100 text-rose-800",
};
const label = (value: string) => value.replace("_", " ");

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>{label(status)}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[priority]}`}>{priority}</span>;
}

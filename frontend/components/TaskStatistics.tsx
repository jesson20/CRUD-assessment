import type { Task } from "@/lib/types";

export function TaskStatistics({ tasks }: { tasks: Task[] }) {
  const statistics = [
    ["Total", tasks.length, "text-slate-900"],
    ["To do", tasks.filter((task) => task.status === "todo").length, "text-slate-600"],
    ["In progress", tasks.filter((task) => task.status === "in_progress").length, "text-amber-700"],
    ["Completed", tasks.filter((task) => task.status === "completed").length, "text-emerald-700"],
  ];

  return <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {statistics.map(([label, value, color]) => <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={label}>
      <p className="text-sm text-slate-500">{label}</p><p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>)}
  </section>;
}

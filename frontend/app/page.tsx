"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { TaskStatistics } from "@/components/TaskStatistics";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/api";
import { taskPriorities, taskStatuses, type Task, type TaskPayload, type TaskPriority, type TaskStatus } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");

  useEffect(() => {
    let isCurrent = true;

    getTasks()
      .then((loadedTasks) => {
        if (isCurrent) setTasks(loadedTasks);
      })
      .catch((error: unknown) => {
        if (isCurrent) setError(error instanceof Error ? error.message : "Unable to load tasks.");
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [priorityFilter, searchQuery, statusFilter, tasks]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || priorityFilter !== "all";

  async function handleSave(payload: TaskPayload) {
    setError(null);

    if (editingTask) {
      const updatedTask = await updateTask(editingTask.id, payload);
      setTasks((currentTasks) =>
        currentTasks.map((task) => task.id === updatedTask.id ? updatedTask : task),
      );
    } else {
      const createdTask = await createTask(payload);
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
    }

    setEditingTask(null);
    setFormKey((currentKey) => currentKey + 1);
  }

  function handleCancelEdit() {
    setEditingTask(null);
    setFormKey((currentKey) => currentKey + 1);
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) {
      return;
    }

    setDeletingTaskId(task.id);
    setError(null);

    try {
      await deleteTask(task.id);
      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));

      if (editingTask?.id === task.id) {
        handleCancelEdit();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete the task.");
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Task management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">TaskFlow</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Plan work, track progress, and keep priorities visible.</p>
        </header>

        <TaskStatistics tasks={tasks} />

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{error}</p>
            <button className="font-semibold underline" onClick={() => setError(null)} type="button">Dismiss</button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-labelledby="tasks-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold" id="tasks-heading">Your tasks</h2>
              {!isLoading && <span className="text-sm text-slate-500">{filteredTasks.length} of {tasks.length} shown</span>}
            </div>

            <div className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
              <label className="text-sm font-medium text-slate-700" htmlFor="task-search">
                Search by title
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="task-search"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tasks"
                  type="search"
                  value={searchQuery}
                />
              </label>
              <label className="text-sm font-medium text-slate-700" htmlFor="status-filter">
                Status
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="status-filter"
                  onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
                  value={statusFilter}
                >
                  <option value="all">All statuses</option>
                  {taskStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700" htmlFor="priority-filter">
                Priority
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  id="priority-filter"
                  onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | "all")}
                  value={priorityFilter}
                >
                  <option value="all">All priorities</option>
                  {taskPriorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </label>
              {hasActiveFilters && (
                <button
                  className="justify-self-start text-sm font-semibold text-indigo-600 hover:text-indigo-800 sm:col-span-3"
                  onClick={() => { setSearchQuery(""); setStatusFilter("all"); setPriorityFilter("all"); }}
                  type="button"
                >
                  Clear filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading tasks…</div>
            ) : filteredTasks.length === 0 && tasks.length > 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h3 className="font-semibold text-slate-800">No matching tasks</h3>
                <p className="mt-1 text-sm text-slate-500">Try changing or clearing your search and filters.</p>
              </div>
            ) : (
              <TaskList deletingTaskId={deletingTaskId} onDelete={handleDelete} onEdit={setEditingTask} tasks={filteredTasks} />
            )}
          </section>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <TaskForm key={`${editingTask?.id ?? "new"}-${formKey}`} onCancel={handleCancelEdit} onSubmit={handleSave} task={editingTask} />
          </aside>
        </div>
      </div>
    </main>
  );
}

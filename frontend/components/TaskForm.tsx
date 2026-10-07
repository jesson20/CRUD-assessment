"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { taskPriorities, taskStatuses, type Task, type TaskPayload, type ValidationErrors } from "@/lib/types";

type TaskFormProps = { task: Task | null; onSubmit: (payload: TaskPayload) => Promise<void>; onCancel: () => void };
type FormValues = { title: string; description: string; status: TaskPayload["status"]; priority: TaskPayload["priority"]; due_date: string };
const emptyForm: FormValues = { title: "", description: "", status: "todo", priority: "medium", due_date: "" };

function toFormValues(task: Task | null): FormValues {
  if (!task) return emptyForm;
  return { title: task.title, description: task.description ?? "", status: task.status, priority: task.priority, due_date: task.due_date?.slice(0, 10) ?? "" };
}

function validate(values: FormValues): ValidationErrors {
  if (!values.title.trim()) return { title: ["Title is required."] };
  if (values.title.length > 255) return { title: ["Title must be 255 characters or fewer."] };
  return {};
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(task));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue<Key extends keyof FormValues>(key: Key, value: FormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clientErrors = validate(values);
    setErrors(clientErrors);
    setFormError(null);
    if (Object.keys(clientErrors).length) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ title: values.title.trim(), description: values.description.trim() || null, status: values.status, priority: values.priority, due_date: values.due_date || null });
    } catch (error) {
      if (error instanceof ApiError) { setErrors(error.errors); setFormError(error.message); }
      else setFormError("Unable to save the task. Please try again.");
    } finally { setIsSubmitting(false); }
  }

  const isEditing = task !== null;
  return <section aria-labelledby="task-form-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5"><h2 className="text-lg font-bold" id="task-form-heading">{isEditing ? "Edit task" : "Create task"}</h2><p className="mt-1 text-sm text-slate-500">{isEditing ? "Update the selected task." : "Add work to your task list."}</p></div>
    {formError && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <FieldError errors={errors} field="title"><label className="block text-sm font-medium" htmlFor="title">Title</label><input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="title" maxLength={255} onChange={(event) => updateValue("title", event.target.value)} value={values.title} /></FieldError>
      <FieldError errors={errors} field="description"><label className="block text-sm font-medium" htmlFor="description">Description <span className="text-slate-400">(optional)</span></label><textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="description" onChange={(event) => updateValue("description", event.target.value)} value={values.description} /></FieldError>
      <div className="grid grid-cols-2 gap-3"><FieldError errors={errors} field="status"><label className="block text-sm font-medium" htmlFor="status">Status</label><select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="status" onChange={(event) => updateValue("status", event.target.value as TaskPayload["status"])} value={values.status}>{taskStatuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}</select></FieldError>
        <FieldError errors={errors} field="priority"><label className="block text-sm font-medium" htmlFor="priority">Priority</label><select className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="priority" onChange={(event) => updateValue("priority", event.target.value as TaskPayload["priority"])} value={values.priority}>{taskPriorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></FieldError></div>
      <FieldError errors={errors} field="due_date"><label className="block text-sm font-medium" htmlFor="due_date">Due date <span className="text-slate-400">(optional)</span></label><input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="due_date" onChange={(event) => updateValue("due_date", event.target.value)} type="date" value={values.due_date} /></FieldError>
      <div className="flex gap-3 pt-2"><button className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving…" : isEditing ? "Save changes" : "Create task"}</button>{isEditing && <button className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onCancel} type="button">Cancel</button>}</div>
    </form>
  </section>;
}

function FieldError({ children, errors, field }: { children: React.ReactNode; errors: ValidationErrors; field: keyof TaskPayload }) {
  const message = errors[field]?.[0];
  return <div>{children}{message && <p className="mt-1 text-xs text-red-600">{message}</p>}</div>;
}

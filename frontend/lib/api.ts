import type { Task, TaskPayload, ValidationErrors } from "@/lib/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(message: string, public readonly errors: ValidationErrors = {}) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiResponse<T> = { data: T; message?: string };
type ErrorResponse = { message?: string; errors?: ValidationErrors };

function getApiUrl() {
  if (!apiUrl) throw new ApiError("NEXT_PUBLIC_API_URL is not configured.");
  return apiUrl.replace(/\/$/, "");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    cache: "no-store",
    headers: { Accept: "application/json", ...options.headers },
  });

  if (response.status === 204) return undefined as T;

  const body = (await response.json()) as ApiResponse<T> & ErrorResponse;
  if (!response.ok) throw new ApiError(body.message ?? "The request could not be completed.", body.errors);
  return body.data;
}

export function getTasks() { return request<Task[]>("/tasks"); }

export function createTask(task: TaskPayload) {
  return request<Task>("/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) });
}

export function updateTask(id: number, task: TaskPayload) {
  return request<Task>(`/tasks/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) });
}

export function deleteTask(id: number) { return request<void>(`/tasks/${id}`, { method: "DELETE" }); }

# AI-Assisted Development

## Tools Used

- ChatGPT / Codex

## How AI Was Used

AI assisted with:

- architecture planning
- Laravel CRUD scaffolding
- frontend component implementation
- debugging
- code review
- documentation

All generated code was reviewed and tested before being committed.

## Context Provided

The AI was given:

- the original assessment requirements
- the four-hour constraint
- required Laravel + Next.js stack
- Task entity/schema
- REST endpoint requirements
- instructions to avoid overengineering
- instructions to keep the implementation easy to explain

## Prompt History

### Initial Architecture Prompt

You are helping me complete a 4-hour technical assessment for a Full-Stack Developer position.
The requirement is:
Build a small full CRUD module using:
- Laravel backend
- SQLite database
- Next.js frontend
The submission will be reviewed by senior developers, and I will later be interviewed about the code. Therefore:
IMPORTANT RULES:
1. Do not overengineer the solution.
2. Prefer simple, readable, production-conscious code over clever abstractions.
3. Do not add dependencies unless they provide clear value.
4. Explain architectural decisions before implementing them.
5. Do not make large unrelated changes.
6. Follow Laravel and Next.js conventions.
7. Use TypeScript on the frontend.
8. Laravel must own all database access. Next.js should consume the Laravel REST API.
9. Include proper validation, error handling, loading states, and empty states.
10. Make every change easy for me to understand and explain in an interview.
11. Before changing multiple files, tell me what files you intend to modify and why.
12. After each major implementation step, summarize what was changed and how the request flows through the application.
13. If there are several valid approaches, prefer the simplest one and explain the tradeoff.
14. Do not add authentication, Docker, Redux, queues, WebSockets, or unnecessary architecture unless I specifically request them.
15. Do not fabricate successful testing. If a command should be run, tell me the exact command and what we should verify.
PROJECT:
Name: TaskFlow
Task entity:
- id
- title: required string, max 255
- description: optional text
- status: required; todo, in_progress, completed
- priority: required; low, medium, high
- due_date: optional date
- created_at
- updated_at
Required API endpoints:
GET    /api/tasks
GET    /api/tasks/{task}
POST   /api/tasks
PUT    /api/tasks/{task}
DELETE /api/tasks/{task}
Frontend requirements:
- Dashboard showing all tasks
- Create task
- Edit task
- Delete task with confirmation
- Status badge
- Priority badge
- Basic task statistics
- Search/filtering if time permits
- Responsive clean interface
- Loading state
- Empty state
- API/server error feedback
- Form validation feedback
Backend requirements:
- Laravel REST API
- SQLite
- Eloquent model
- migration
- controller
- Laravel Form Requests for validation
- sensible JSON responses
- RESTful routing
Project structure:
/
  backend/
  frontend/
We have a strict four-hour assessment, so keep the scope small.
Before writing code, inspect the repository and give me:
1. The proposed architecture
2. The files that will be created
3. The request/data flow
4. Potential risks
5. A prioritized implementation plan
Do not implement anything until you have completed that analysis.

### Laravel Backend Prompt

The architecture looks good.
Implement only the Laravel backend now.
Requirements:
- SQLite database
- Task migration
- Task Eloquent model
- TaskController
- StoreTaskRequest
- UpdateTaskRequest
- REST API routes
- JSON responses
- appropriate HTTP status codes
Validation:
title:
- required
- string
- max 255
description:
- nullable
- string
status:
- required
- one of todo, in_progress, completed
priority:
- required
- one of low, medium, high
due_date:
- nullable
- valid date
Do not implement the frontend yet.
After implementation:
1. Show me every route created.
2. Explain the request lifecycle from POST /api/tasks to SQLite.
3. Give me commands to test all five CRUD operations.
4. Point out anything in the implementation that I should understand for an interview.

### Backend Review

Before we build the frontend, review the Laravel implementation as if you were a senior developer reviewing a candidate's technical assessment.
Check specifically for:
- incorrect REST semantics
- missing validation
- mass-assignment problems
- inconsistent JSON responses
- incorrect HTTP status codes
- unnecessary abstractions
- Laravel anti-patterns
- SQLite issues
- CORS problems that could affect the Next.js frontend
Do not rewrite working code just for stylistic preference.
List actual problems first.
Then fix only issues that materially improve correctness or readability.
Finally explain every fix in plain language.

### Frontend Prompt

Now implement the Next.js frontend for the existing Laravel Task API.
Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- native fetch
Do not introduce Redux, Zustand, Axios, React Query, or another state library unless there is a concrete reason we cannot reasonably implement this without it.
Create a clean responsive task dashboard.
Required functionality:
- fetch and display tasks
- create task
- edit task
- delete task with confirmation
- loading state
- empty state
- error state
- validation feedback
- status badges
- priority badges
- statistics for total/todo/in progress/completed
Use an environment variable for the Laravel API base URL:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
Prefer a small number of understandable components over excessive componentization.
Before implementing, tell me the proposed component structure.
After implementing:
1. Explain where API requests happen.
2. Explain how state updates after create/update/delete.
3. Explain how frontend errors are handled.
4. List each component and its responsibility.
5. Tell me what parts a senior developer is likely to ask about.

### Add Filter

The core CRUD application is working.
Add only these small usability improvements:
- Search tasks by title
- Filter by status
- Filter by priority
Keep filtering client-side because this assessment has a small dataset and I don't want unnecessary backend complexity.
Do not add pagination or additional libraries.
Keep the implementation straightforward and easy to explain.

### Final Review

Act as the senior developer who will review this technical assessment.
Inspect the entire project.
Do NOT modify anything yet.
Review:
- Laravel architecture
- Next.js architecture
- CRUD correctness
- validation
- error handling
- API design
- TypeScript quality
- component structure
- security concerns
- maintainability
- README readiness
- obvious bugs
- unnecessary complexity
Classify findings as:
CRITICAL
SHOULD FIX
NICE TO HAVE
Because this is a four-hour assessment, recommend only fixes that provide meaningful value.
Also give me 10 interview questions you would ask me about this codebase.

## Human Review

I manually reviewed, ran, and tested the implementation before
considering the assessment complete.

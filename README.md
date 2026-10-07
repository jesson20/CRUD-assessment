# TaskFlow

A small full-stack task management application built for the
Caravea Full-Stack Developer technical assessment.

## Tech Stack

- Laravel
- SQLite
- Next.js
- TypeScript
- Tailwind CSS

## Features

- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Form validation
- Search/filter tasks
- Dashboard statistics
- Loading and error handling

## Architecture

The Next.js frontend communicates with a Laravel REST API.

Laravel owns application persistence and uses Eloquent with SQLite.

Next.js is responsible for the user interface and communicates
with Laravel through HTTP/JSON requests.

## Running Locally

### Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

Backend:
http://localhost:8000

### Frontend

cd frontend
npm install
cp .env.example .env.local
npm run dev

Frontend:
http://localhost:3000

## Environment Variable

NEXT_PUBLIC_API_URL=http://localhost:8000/api

## API

GET    /api/tasks
GET    /api/tasks/{task}
POST   /api/tasks
PUT    /api/tasks/{task}
DELETE /api/tasks/{task}

## Design Decisions

SQLite was selected to keep setup simple and reproducible for
the assessment.

The backend exposes a REST API so that persistence and business
logic remain separate from the frontend.

The project intentionally avoids unnecessary libraries and
abstractions because the assessment had a four-hour time limit.

## AI Usage

AI was used for architecture planning, implementation assistance,
code review, debugging and documentation.

See docs/AI_USAGE.md for prompt history and development details.

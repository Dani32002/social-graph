# Social Graph — Monorepo

Consolidated repository for the Social Graph project. Contains an Angular frontend and a NestJS backend used during development.

This README describes how to run and build both parts and how to access the backend Swagger documentation.

## Repo layout (important folders)
- social-graph-frontend/ — Angular application (src, environments, components, services).
- social-graph-v1-backend/ — NestJS application (src controllers, modules, auth, users, tests).
- README.md — this file (project root).

---

## Prerequisites
- Node.js (>= 18 recommended)
- npm or yarn
- For backend: a database is required (check backend TypeORM config)
- Git (optional)

---

## Start using the root package.json

- Install all dependencies (root + workspaces):
    - npm run install:all

- Start both services (parallel):
    - npm run start
    - This runs the backend and frontend in parallel using the concurrently devDependency.

- Start services individually:
    - Start backend only:
        - npm run start:backend
        - (This runs the backend's start:dev script inside social-graph-v1-backend via npm --prefix)
    - Start frontend only:
        - npm run start:frontend
        - (This runs the frontend's start script inside social-graph-frontend via npm --prefix)

- Visit `http://localhost:4200/`

- Notes:
    - You can also cd into each package folder and run its local npm scripts (cd social-graph-v1-backend && npm run start:dev, cd social-graph-frontend && npm start).

## Backend (social-graph-v1-backend)

Location: `social-graph-v1-backend/`

Quick start:
1. cd social-graph-v1-backend
2. Install deps:
    - npm install
    - or yarn
3. Configure environment and DB:
    - Check your TypeORM config in `src`/`main.ts`.
    - Provide DB connection as required (e.g., DATABASE_URL, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME) or use the project's configured defaults.
4. Start in development:
    - npm run start:dev
    - default port: 3000 (verify `src/main.ts`)

Swagger documentation:
- The backend exposes an OpenAPI/Swagger UI endpoint. `http://localhost:3000/api`
- Use the Swagger UI to explore available endpoints, schemas and to try requests.

Scripts (typical):
- npm run start — start production
- npm run start:dev — start with hot reload
- npm run build — compile TypeScript
- npm run test — run unit tests

---

## Frontend (social-graph-frontend)

Location: `social-graph-frontend/`

Quick start:
1. cd social-graph-frontend
2. Install deps:
    - npm install
    - or yarn
3. Configure API base URL:
    - Update `environment.development.ts` to point to the backend API base (for example, `http://localhost:3000/v1/users`).
4. Start dev server:
    - npm start
    - or ng serve
    - Default port is typically 4200 (check `angular.json` or CLI output).


Testing:
 - TODO

---

## Typical development workflow
1. Start the database and configure it in `src`/`main.ts`.
2. Start backend (npm run start:dev in backend folder).
3. Confirm Swagger UI is reachable and endpoints are available.
4. Start frontend (npm start in frontend folder).
5. Use the frontend UI, and verify API interaction with the backend.

---

For implementation details, check source folders:
- Backend: `social-graph-v1-backend/src/`
- Frontend: `social-graph-frontend/src/`

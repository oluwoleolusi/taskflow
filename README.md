# TaskFlow

A portfolio concept SaaS product — a focused task and project management
workspace. Fully functional on the frontend: real shared state, real
filtering/sorting, real persistence. No backend, no auth, no database.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (CSS-variable-based theming — see "Dark mode" below)
- React Router
- lucide-react (icons)
- React Context + `useReducer`-style state for the shared app data (no Redux)

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (typically `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deploying

Static site, pre-configured for **Netlify** (`netlify.toml` + `public/_redirects`
handle the SPA fallback that client-side routes like `/projects/p1` need).
Push to a Git repo, import it in Netlify, and the build command (`npm run
build`) and publish directory (`dist`) are already set.

## Project structure

```
src/
  components/
    layout/      Sidebar (desktop), MobileNav (top bar + bottom tabs + "More"
                 drawer), Shell (combines both around the routed content)
    tasks/        TaskRow (list view), TaskCard (board view), AddTaskModal,
                  TaskDetailDrawer (the full editable task view)
    projects/     ProjectRow, ProgressBar, AddProjectModal
    board/        BoardColumn
    calendar/     MonthGrid
    ui/           Avatar, badges, checkbox, EmptyState, Modal, Drawer,
                  ToastContainer, PageHeader — the shared design-system pieces
  context/
    AppContext.tsx   All shared state: tasks, projects, preferences, the
                     task drawer, the add-task modal, and toasts. Everything
                     persists to localStorage except the transient UI state
                     (which drawer/modal is open, current toasts).
  data/
    tasks.ts / projects.ts / users.ts   Seed content. Task due dates are
    computed relative to today at load time, so Today/Upcoming/Overdue
    always look correct no matter when you run the app.
  pages/          One file per route
  types/          Shared TypeScript types (Task, Project, Priority, etc.)
  utils/
    dates.ts        Date math and formatting (no date library dependency)
    labels.ts        Shared label/order maps for statuses and priorities
```

## How the shared state works

Everything reads from and writes to one `AppContext`. Marking a task done in
Board, for instance, updates the exact same task object that Today, My
Tasks, Upcoming, Calendar and that task's Project detail page all read from
— there's a single source of truth, not per-page copies. Tasks and projects
persist to `localStorage`, so anything you create or change survives a
refresh; user preferences (theme, date format, start of week, notification
toggles) persist the same way.

## Notable implementation choices

- **No drag-and-drop on the Board.** Per the brief's own guidance, a
  reliable control beats a flaky drag implementation — each card has
  move-left/move-right controls instead, which also happen to work
  perfectly on touch devices.
- **Dark mode is real, not decorative.** The whole color system is defined
  as CSS variables in `index.css` (`--c-app`, `--c-ink`, `--c-accent`, etc.),
  redefined under `html.dark`, and every Tailwind color token
  (`bg-app`, `text-ink`, `bg-accent`...) resolves through those variables.
  Switching the Theme preference in Settings toggles the `dark` class on
  `<html>` and the entire interface repaints — nothing was left as a
  cosmetic no-op.
- **Keyboard access without duplicate activation.** Task rows and cards have
  a checkbox and an "open detail" action sitting side by side rather than
  nested inside one giant clickable wrapper, so a keyboard user pressing
  Enter on the checkbox toggles completion — and only that — instead of
  also opening the task.

## Content that's easy to find and edit

- **Tasks** → `src/data/tasks.ts` (uses a small `build()` helper so each
  seed task is a short, readable object)
- **Projects** → `src/data/projects.ts`
- **Team members** → `src/data/users.ts`
- **Status/priority labels and ordering** → `src/utils/labels.ts`

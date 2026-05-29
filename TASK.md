# Engineering Take-Home

Welcome, and thanks for your interest! This repository is a small **Next.js (App
Router) + React + TypeScript + Tailwind CSS** app called **UniVerse** — a
single-page directory of U.S. universities with search, an A–Z filter, and
paginated results. You'll extend it with one focused feature set.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # TypeScript, no emit
npm run build      # production build
```

Key files:
- `app/page.tsx` — the UI (search, filters, grid, pagination)
- `app/layout.tsx` — root layout, fonts, metadata
- `data/universities.json` — the dataset (~2,348 institutions)

## How to choose your track

Pick the track that matches the role you're applying for. **Complete the tasks
in your track**; the other track is optional bonus. Quality matters more than
quantity — a smaller, well-built, well-tested change beats a large, rough one.

---

## Frontend track

### FE-1 — University detail modal
**Objective:** Let users open a focused detail view of a single university
without leaving the list.

**Requirements**
- Clicking a university card opens a pop-up modal showing that university's
  details (and, optionally, an in-app preview of the school's website).
- The modal can be closed via a close button, clicking the backdrop, and `Esc`.

**Acceptance criteria**
- Opening a card shows the correct university's data; closing returns to the list.
- Keyboard accessible: focus moves into the modal, is trapped while open, `Esc`
  closes it, and focus returns to the triggering card.
- Background page scroll is locked while the modal is open.
- No console errors or hydration warnings.

### FE-2 — Favorites with persistence
**Objective:** Let users save universities and have those favorites survive a
page reload.

**Requirements**
- A favorite/unfavorite control on each university.
- Favorites persist in `localStorage`.
- A way to view or filter down to favorited universities.

**Acceptance criteria**
- Toggling a favorite updates the UI immediately and is reflected everywhere it
  appears.
- Favorites persist after a full page refresh.
- No SSR/hydration mismatch errors (reading `localStorage` is handled safely).
- Works correctly with multiple favorites; un-favoriting removes it.

---

## Backend track

### BE-1 — Server-side search & pagination via a Route Handler
**Objective:** Move filtering and pagination off the client and serve them from
an API, using the provided dataset as a mocked backend.

**Requirements**
- Add a Next.js Route Handler (e.g. `app/api/universities/route.ts`) that accepts
  query parameters for search term, letter filter, and page, and returns the
  matching, paginated slice of the dataset.
- The client fetches results from this endpoint instead of importing the full
  JSON for rendering. Handle loading and error states.

**Acceptance criteria**
- The endpoint returns correctly filtered and paginated results plus a total
  count, and handles empty/edge cases gracefully.
- The client no longer renders directly from the bundled JSON; it consumes the API.
- Sensible HTTP status codes and a clear response shape.

### BE-2 — Containerization
**Objective:** Make the app build and run in Docker with a single command.

**Requirements**
- A `Dockerfile` (multi-stage: build, then a lean production runtime) and a
  `.dockerignore`.
- Document the build and run commands in the README.

**Acceptance criteria**
- `docker build` completes successfully.
- `docker run ...` serves the app and it's reachable in the browser.
- Uses a production build and a reasonably small final image (multi-stage).

### BE-3 — CI/CD pipeline
**Objective:** Automatically run quality checks on every push and pull request.

**Requirements**
- A pipeline config (e.g. GitHub Actions) that installs dependencies and runs
  type-check and build (lint and/or Docker build are welcome additions).

**Acceptance criteria**
- The workflow triggers on pushes and pull requests.
- Install → type-check → build steps run and a failure blocks the check.
- Documented briefly in the README.

---

## What we're evaluating

- **Correctness** — does it work, including loading/empty/error and edge cases?
- **Code quality** — readable, well-typed, sensibly structured components/modules.
- **UX & accessibility** — keyboard support, focus management, no console errors.
- **Judgment** — appropriate scope, no over-engineering, clear tradeoffs.
- **Communication** — commit history and a short PR/README write-up.

## Time expectations

Please aim for roughly **3–5 hours**. We're not looking for perfection — if you
run low on time, ship what's solid and note in your write-up what you'd do next
and why.

## How to submit

1. Work on a branch and open a pull request (or share a repo/zip).
2. In the PR description, briefly cover: what you built, key decisions and
   tradeoffs, how to run it, and anything you'd improve with more time.

Good luck — have fun with it!

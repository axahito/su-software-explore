# UniVerse — U.S. University Explorer

A single-page web app for browsing accredited U.S. universities, colleges, and
institutes. Search by name or web domain, filter A–Z, and jump straight to each
school's official website. Built with **React + TypeScript + Vite + Tailwind CSS**.

## Features

- **2,348 institutions** with live, data-derived stats (universities, colleges, `.edu` domains).
- **Instant search** by name or domain.
- **A–Z letter filter** plus paginated results (24 per page).
- **School logos** with a graceful fallback chain: Clearbit logo → Google favicon → colored initials tile, so every card always shows an image.
- Responsive 1→4 column grid, sticky toolbar, and subtle entrance animations.

## Tech stack

| Tool | Purpose |
| --- | --- |
| React 18 | UI |
| TypeScript | Type safety |
| Vite 5 | Dev server & build |
| Tailwind CSS 3 | Styling |

## Getting started

Requires Node.js 18+.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

### Other scripts

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run typecheck  # run the TypeScript compiler with no emit
```

## Project structure

```
.
├─ index.html              # entry HTML, loads /src/main.tsx
├─ src/
│  ├─ main.tsx             # React root
│  ├─ App.tsx              # all UI (hero, search, filters, grid, pagination)
│  ├─ index.css            # Tailwind directives + base styles
│  └─ data/
│     └─ universities.json # 2,348 U.S. institutions
├─ tailwind.config.js
├─ vite.config.js
└─ tsconfig.json
```

## Data

University records are sourced from the
[Hipo university-domains-list](https://github.com/Hipo/university-domains-list),
filtered to U.S. entries and reduced to `name`, `domain`, `url`, and `state`.
Logos are fetched at runtime via [Clearbit](https://clearbit.com/logo) with a
Google favicon fallback; neither is bundled.

## License

See [LICENSE](LICENSE).

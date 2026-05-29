'use client'

import { useMemo, useState } from 'react'
import universitiesData from '../data/universities.json'

export interface University {
  name: string
  domain: string
  url: string
  state: string | null
}

const universities = universitiesData as University[]

const PAGE_SIZE = 24

/* ---------- precomputed stats (module scope) ---------- */
const STATS = universities.reduce(
  (acc, u) => {
    const n = u.name.toLowerCase()
    if (n.includes('university')) acc.universities++
    else if (n.includes('college')) acc.colleges++
    if (
      n.includes('community') ||
      n.includes('technical') ||
      n.includes('institute of technology')
    )
      acc.tech++
    if (u.domain.endsWith('.edu')) acc.edu++
    return acc
  },
  { universities: 0, colleges: 0, tech: 0, edu: 0 },
)

const LETTERS = ['All', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

/* ---------- helpers ---------- */
const GRADIENTS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
  'from-cyan-500 to-blue-500',
  'from-fuchsia-500 to-purple-500',
] as const

function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function gradientFor(name: string): string {
  return GRADIENTS[hashString(name) % GRADIENTS.length]
}

function initials(name: string): string {
  const stop = new Set(['of', 'the', 'and', 'at', 'for', 'de', 'in', 'a'])
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const significant = words.filter((w) => !stop.has(w.toLowerCase()))
  const pick = significant.length ? significant : words
  const letters = pick
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
  return letters || name.slice(0, 2).toUpperCase()
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

function getPageList(current: number, total: number): (number | '…')[] {
  const pages: (number | '…')[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || (p >= current - 1 && p <= current + 1)) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }
  return pages
}

/* ---------- components ---------- */
function Logo({ university }: { university: University }) {
  // Try a crisp brand logo first, then a favicon, then fall back to initials.
  const sources = useMemo(() => {
    if (!university.domain) return [] as string[]
    return [
      `https://logo.clearbit.com/${university.domain}`,
      `https://www.google.com/s2/favicons?domain=${university.domain}&sz=128`,
    ]
  }, [university.domain])
  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  return (
    <div
      className={`relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br ${gradientFor(
        university.name,
      )} shadow-inner`}
    >
      <span className="select-none text-lg font-bold tracking-tight text-white">
        {initials(university.name)}
      </span>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${university.name} logo`}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
          className="absolute inset-0 h-full w-full bg-white object-contain p-1.5"
        />
      )}
    </div>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h8.69L9.22 6.03a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function UniversityCard({
  university,
  index,
}: {
  university: University
  index: number
}) {
  return (
    <a
      href={university.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className="group flex animate-fade-up flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
    >
      <div className="flex items-start gap-4">
        <Logo university={university} />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-indigo-600">
            {university.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {university.state ?? 'United States'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="truncate font-mono text-xs text-slate-400">
          {university.domain}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
          Visit
          <ArrowIcon />
        </span>
      </div>
    </a>
  )
}

function StatPill({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
      <div className="text-2xl font-extrabold text-white sm:text-3xl">
        {formatNumber(value)}
      </div>
      <div className="text-xs font-medium uppercase tracking-wide text-indigo-100">
        {label}
      </div>
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  variant = 'hero',
}: {
  value: string
  onChange: (v: string) => void
  variant?: 'hero' | 'bar'
}) {
  const hero = variant === 'hero'
  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 3.39 9.85l3.13 3.13a.75.75 0 1 0 1.06-1.06l-3.13-3.13A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or domain…"
        aria-label="Search universities"
        className={
          hero
            ? 'w-full rounded-2xl border border-transparent bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-2xl shadow-indigo-900/20 outline-none ring-2 ring-transparent transition focus:ring-indigo-300'
            : 'w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
        }
      />
    </div>
  )
}

/* ---------- page ---------- */
export default function Page() {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return universities.filter((u) => {
      if (letter !== 'All') {
        const first = u.name[0]?.toUpperCase() ?? ''
        if (letter === '#') {
          if (/[A-Z]/.test(first)) return false
        } else if (first !== letter) {
          return false
        }
      }
      if (q) {
        return (
          u.name.toLowerCase().includes(q) || u.domain.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [query, letter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  function scrollToBrowse() {
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })
  }

  function changeQuery(v: string) {
    setQuery(v)
    setPage(1)
  }

  function changeLetter(v: string) {
    setLetter(v)
    setPage(1)
  }

  function goToPage(p: number) {
    setPage(p)
    scrollToBrowse()
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              UniVerse
            </span>
          </a>
          <a
            href="https://github.com/Hipo/university-domains-list"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-slate-500 transition hover:text-indigo-600 sm:block"
          >
            Data source ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,.25) 0, transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,.2) 0, transparent 30%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-50 backdrop-blur-sm">
              🎓 {formatNumber(universities.length)} institutions across the U.S.
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore universities &amp; colleges
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">
              Browse a directory of accredited American universities, colleges,
              and institutes. Search by name or web domain and jump straight to
              their official websites.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <SearchInput value={query} onChange={changeQuery} variant="hero" />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <StatPill value={universities.length} label="Institutions" />
              <StatPill value={STATS.universities} label="Universities" />
              <StatPill value={STATS.colleges} label="Colleges" />
              <StatPill value={STATS.edu} label=".edu Domains" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse */}
      <main
        id="browse"
        className="mx-auto max-w-7xl scroll-mt-16 px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Toolbar */}
        <div className="sticky top-[57px] z-20 -mx-4 mb-8 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-2xl sm:border sm:px-5 sm:shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-xs lg:flex-1">
              <SearchInput value={query} onChange={changeQuery} variant="bar" />
            </div>
            <div className="-mx-1 flex gap-1 overflow-x-auto pb-1">
              {LETTERS.map((l) => {
                const active = l === letter
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => changeLetter(l)}
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-6 flex items-baseline justify-between">
          <p className="text-sm text-slate-500">
            {filtered.length === 0 ? (
              'No matches'
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {formatNumber(start + 1)}–
                  {formatNumber(start + pageItems.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700">
                  {formatNumber(filtered.length)}
                </span>
              </>
            )}
          </p>
          {(query || letter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                changeQuery('')
                changeLetter('All')
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid / empty state */}
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((u, i) => (
              <UniversityCard
                key={`${u.name}-${u.domain}`}
                university={u}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-slate-700">
              No universities found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or letter.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition enabled:hover:border-indigo-300 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {getPageList(safePage, totalPages).map((p, idx) =>
              p === '…' ? (
                <span key={`gap-${idx}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`min-w-[40px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    p === safePage
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition enabled:hover:border-indigo-300 enabled:hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            <span className="font-semibold text-slate-700">UniVerse</span> —{' '}
            {formatNumber(universities.length)} U.S. universities &amp; colleges.
          </p>
          <p>Logos via Clearbit · Data from the Hipo university list.</p>
        </div>
      </footer>
    </div>
  )
}

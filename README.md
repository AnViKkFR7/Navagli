# Navagli

Web de reformas integrales — Integral renovation services website.

## Tech Stack

- **React 19** + **Vite 7** + **TypeScript**
- **React Router v7** — Remix-style routing (SPA mode)
- **Supabase** — Database & API layer
- **Tailwind CSS v4** — Styling
- **i18next** — Internationalisation (ES / EN / FR)

## Project Structure

```
src/
├── components/
│   ├── common/        # Header, Footer
│   └── ui/            # PropertyCard, ProjectCard, Loading
├── hooks/             # useData (async data fetching hooks)
├── layouts/           # RootLayout
├── locales/           # Translations (es, en, fr)
│   ├── es/
│   ├── en/
│   └── fr/
├── pages/             # Page components (Remix-style routes)
├── services/          # supabaseClient, propertyService, i18n
├── styles/            # Global styles (via index.css)
└── types/             # TypeScript interfaces
```

## Getting Started

1. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Run the database migrations in your Supabase project:
   - `DB_SCHEMA.sql` — main data model
   - `RegiaMare.sql` — attribute values model

3. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/properties` | Property listing with filters |
| `/properties/:slug` | Property detail |
| `/projects` | Project listing |
| `/projects/:slug` | Project detail |
| `/services` | Services |
| `/about` | About us |
| `/contact` | Contact form |

## Internationalisation

The application supports Spanish (default), English, and French.
Language detection order: `localStorage → navigator → htmlTag`.
Change language via the globe icon in the navigation header.

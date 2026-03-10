# Switch

A fashion brand discovery platform. Browse, search, and favorite brands curated by category, region, and popularity — with personalized recommendations based on your taste. Checkout the live site [here](https://switch.fashion/)

## Features

- **Brand discovery** — browse brands with infinite scroll, filter by category and region, sort by name, popularity, or newest
- **Search** — dedicated search page with real-time results
- **Favorites** — save brands to your personal list (requires account)
- **Recommendations** — tag-based recommendations derived from your favorited brands
- **Brand pages** — individual pages with brand details and related news articles
- **Authentication** — email/password signup and login with secure httponly JWT cookies

## Tech Stack

**Frontend**
- Next.js 16 (hybrid App Router + Pages Router)
- React 19, TypeScript
- Tailwind CSS v4
- Framer Motion

**Backend** — [switch-backend](https://github.com/javieravelar591/switch-backend)
- FastAPI, SQLAlchemy
- PostgreSQL
- bcrypt, JWT
- Rate limiting via slowapi

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running locally (see switch-backend repo)

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/              # App Router (root layout, home page)
├── pages/            # Pages Router (brands, search, auth, favorites)
└── components/
    ├── brands/       # BrandCard
    ├── carousel/     # Infinite scrolling brand ticker
    ├── header/       # Nav + search bar
    ├── hero/         # Homepage hero section
    ├── masonry/      # Infinite scroll brand grid
    ├── recommendations/ # Personalized brand recommendations
    ├── editorial/    # Editorial/spotlight section
    ├── footer/       # Footer
    └── ui/           # Shared UI primitives
```

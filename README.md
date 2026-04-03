# 🎬 Cinematic

A premium, AI-powered movie exploration and recommendation platform. Built with Next.js 14, Claude AI, and TMDB.

![Cinematic](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange?style=flat-square)

---

## ✨ Features

- **AI Natural Language Search** — Search by mood, vibe, era ("a slow-burn 80s thriller")
- **Personalized Recommendations** — Claude analyzes your taste profile and picks films just for you
- **AI Cinephile Insights** — Deep critical analysis of any film, powered by Claude
- **Mood-Based Discovery** — Pick a mood, get an AI-curated collection instantly
- **Watchlist** — Save films, mark as watched, track your cinema journey
- **Taste Profile** — Tell us what you love, get an AI-written description of your cinematic identity
- **Cinematic Design** — Dark, film-grain aesthetic. Not generic. Not boring.

---

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1 — Get your API keys

| Service | Where to get it | Free? |
|---------|----------------|-------|
| **TMDB API** | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) | ✅ Yes |
| **Gemini AI** | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | ✅ Yes — completely free |
| **Google OAuth** (optional) | [console.cloud.google.com](https://console.cloud.google.com) | ✅ Yes |

### Step 2 — Clone and install

```bash
git clone https://github.com/yourusername/cinematic.git
cd cinematic
npm install
```

### Step 3 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
TMDB_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
NEXTAUTH_SECRET=run_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

### Step 4 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5 — Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

**Add your environment variables in the Vercel dashboard** under Settings → Environment Variables.

---

## 🗄️ Setting up Vercel KV (Watchlist Storage)

The watchlist and taste profiles are stored in Vercel KV (Redis).

1. Go to your Vercel project dashboard
2. Click **Storage** → **Create Database** → **KV**
3. Connect it to your project
4. Vercel auto-populates `KV_REST_API_URL` and `KV_REST_API_TOKEN`

> For local dev, copy those values into your `.env.local`

---

## 📁 Project Structure

```
cinematic/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout + fonts
│   ├── globals.css                 # Design system CSS
│   ├── film/[id]/page.tsx          # Film detail page
│   ├── search/page.tsx             # AI search page
│   ├── watchlist/page.tsx          # Watchlist page
│   ├── profile/page.tsx            # Taste profile page
│   ├── auth/signin/page.tsx        # Sign in page
│   └── api/
│       ├── movies/route.ts         # TMDB movie endpoints
│       ├── watchlist/route.ts      # Watchlist CRUD
│       ├── profile/route.ts        # Taste profile CRUD
│       └── ai/
│           ├── search/route.ts     # AI natural language search
│           ├── recommendations/route.ts  # Personalized recs
│           ├── insight/route.ts    # Per-film AI insight
│           └── taste-summary/route.ts    # AI taste profile writer
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              # Responsive navbar
│   │   └── Providers.tsx           # NextAuth + Toast providers
│   ├── movie/
│   │   ├── Hero.tsx                # Rotating hero with backdrop
│   │   ├── MovieCard.tsx           # Film card (poster + info)
│   │   ├── MovieRow.tsx            # Horizontal scroll row
│   │   └── WatchlistButton.tsx     # Add/remove watchlist
│   ├── ai/
│   │   ├── AISearchBar.tsx         # Natural language search bar
│   │   ├── AIInsightPanel.tsx      # Collapsible AI film analysis
│   │   ├── AIRecommendationsRow.tsx # Personalized rec row
│   │   └── MoodPicker.tsx          # Mood → AI film selector
│   └── ui/
│       └── Toaster.tsx             # Toast notification system
│
├── lib/
│   ├── tmdb.ts                     # All TMDB API calls
│   ├── ai.ts                       # All Claude AI features
│   ├── auth.ts                     # NextAuth config
│   ├── storage.ts                  # Vercel KV operations
│   └── utils.ts                    # Helpers + constants
│
├── types/
│   └── index.ts                    # All TypeScript types
│
├── .env.example                    # Environment variable template
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🤖 AI Features — How They Work

### Natural Language Search
User types → Claude interprets mood/genre/era → TMDB search + discover runs in parallel → merged results

### Personalized Recommendations
User builds taste profile → Claude scores candidate films against profile → ranked list with personal reasons

### AI Film Insight
Click "AI Cinephile Insight" on any film page → Claude generates critical summary, themes, best watch mood, cinephile notes → cached in KV for 7 days

### Mood Picker
Select a mood chip → AI interprets and maps to TMDB search → returns curated collection

---

## 🎨 Design Philosophy

- **Playfair Display** — editorial serif for headings
- **DM Sans** — clean body copy
- **DM Mono** — data labels, ratings, metadata
- Film grain overlay on entire UI
- Cinematic amber (`#d4840a`) as the primary accent — like a film reel
- Deep void black (`#080808`) background
- No purple gradients. No generic AI aesthetics.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| AI | Claude (Anthropic) |
| Movie Data | TMDB API |
| Auth | NextAuth.js v5 |
| Storage | Vercel KV (Redis) |
| Deployment | Vercel |

---

## 📝 Notes

- The demo credentials provider accepts **any email + password** — perfect for testing with friends
- TMDB API is free with no rate limit for personal projects
- AI insights are cached for 7 days to minimize API costs
- Add Google OAuth credentials to enable "Sign in with Google"

---

## License

MIT

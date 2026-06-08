# Hotelier 🏨

A hospitality-focused hotel search and comparison app built with React 18, Supabase Auth, and the Hotelbeds APItude API.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Hooks |
| Auth | Supabase (JWT-based) |
| Hotel API | Hotelbeds APItude (sandbox) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| State | Context API + localStorage |

---

## Features

- **Auth** — Sign up / sign in with Supabase. JWT tokens used for all protected API calls.
- **Hotel Search** — Destination, date range, guests, rooms, star rating filters via Hotelbeds API
- **Infinite Scroll** — Results load automatically as you scroll (IntersectionObserver)
- **Compare** — Select up to 4 hotels. Comparison page shows:
  - Price bar chart
  - Radar chart (stars, review, affordability, room types)
  - 7-night rate trend line chart
  - Side-by-side feature table
- **Persist selections** — Comparison basket saved to localStorage
- **Role-based UI** — Admin users see extra price range filters (set role via Supabase dashboard)
- **Responsive** — Mobile-first Tailwind layout

---

## API Note

> Amadeus paused new self-service registrations in early 2026 and is fully decommissioning the portal on **July 17, 2026**.  
> Sabre requires an enterprise agreement.  
> **Hotelbeds APItude** was chosen as it offers instant free sandbox registration at [developer.hotelbeds.com](https://developer.hotelbeds.com) with 50 free requests/day — same hospitality domain, same data requirements.

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo-url>
cd hotelier
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Supabase — from https://supabase.com/dashboard → Project Settings → API
REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Hotelbeds — from https://developer.hotelbeds.com after registering
REACT_APP_HOTELBEDS_API_KEY=your_api_key
REACT_APP_HOTELBEDS_SECRET=your_secret
```

### 3. Get Hotelbeds API Keys (2 minutes)

1. Go to [developer.hotelbeds.com](https://developer.hotelbeds.com)
2. Click **Register** → fill form → verify email
3. Go to your dashboard → copy **API Key** and **Secret**
4. Paste into `.env`

> The test endpoint (`api.test.hotelbeds.com`) is used by default. No real bookings or charges.

### 4. Set up Supabase Auth

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers** → make sure Email is enabled
3. (Optional) Disable email confirmation for local dev under **Auth → Settings**
4. Copy **Project URL** and **anon key** into `.env`

### 5. Run locally

```bash
npm run dev
```

This starts **both** servers together:
- React app → `http://localhost:3000`
- Proxy server → `http://localhost:4000`

> **Why a proxy?** Hotelbeds API blocks direct browser requests (CORS policy). The Express proxy in `server.js` runs server-side, adds the Hotelbeds signature, and forwards requests — the browser never calls Hotelbeds directly.

Or run in two separate terminals:
```bash
# Terminal 1 — proxy
npm run server

# Terminal 2 — React
npm start
```

---

## Hotelbeds Authentication

Hotelbeds uses a **signed request** pattern — not a plain Bearer token:

```js
// SHA256(apiKey + secret + unixTimestampSeconds)
const signature = CryptoJS.SHA256(API_KEY + SECRET + timestamp).toString();

headers: {
  'Api-key': API_KEY,
  'X-Signature': signature,
}
```

This is generated fresh on every request in `src/lib/hotelbeds.js`.

---

## Admin Role

To make a user an admin:

1. Go to Supabase Dashboard → **Authentication → Users**
2. Click a user → Edit → add to **User Metadata**:
   ```json
   { "role": "admin" }
   ```
3. Admin users see extra **Min Rate / Max Rate** price filters in the search panel.

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add environment variables in the Vercel dashboard under **Settings → Environment Variables**.

Or deploy to Netlify:

```bash
npm run build
# drag-drop the /build folder to netlify.com
```

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # (Auth handled in pages/AuthPage)
│   ├── compare/
│   │   └── CompareBar.jsx     # Sticky bottom bar when hotels selected
│   ├── hotels/
│   │   ├── HotelCard.jsx      # Individual hotel card
│   │   ├── HotelGrid.jsx      # Grid + infinite scroll sentinel
│   │   └── SearchFilters.jsx  # Filter form (+ admin extras)
│   └── ui/
│       ├── Navbar.jsx
│       └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx        # Supabase auth state
│   └── CompareContext.jsx     # Hotel selection + localStorage
├── hooks/
│   └── useInfiniteHotels.js   # Pagination logic
├── lib/
│   ├── hotelbeds.js           # API client + signature generation
│   └── supabase.js            # Supabase client
└── pages/
    ├── AuthPage.jsx            # Login + signup
    ├── HomePage.jsx            # Search + results
    └── ComparePage.jsx         # Charts + comparison table
```

---

## Interview Notes

**Auth flow:** Supabase issues a JWT on sign-in, stored in localStorage by the SDK. `AuthContext` listens via `onAuthStateChange`. `ProtectedRoute` checks `user` before rendering pages.

**API integration:** `hotelbeds.js` generates a SHA256 signature per request. `useInfiniteHotels` hook manages pagination state and triggers `searchHotels()` via IntersectionObserver.

**State management:** Context API for auth + compare. `useInfiniteHotels` local state for hotel results. Compare selections persisted to `localStorage`.

**Assumptions made:**
- Hotelbeds sandbox used in place of Amadeus/Sabre (both inaccessible for new registrations)
- 7-night rate trend chart uses simulated variance from base rate (Hotelbeds does not expose multi-date pricing in a single call without looping)

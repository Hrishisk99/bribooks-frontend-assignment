# BriBooks Store — Product Listing (Frontend Intern Assignment)

A responsive product listing app built with **Next.js (Pages Router) + React + TypeScript**, styled with **Bootstrap 5**, that server-side renders product data from the [Fake Store API](https://fakestoreapi.com/products).

## Features

- **SSR** via `getServerSideProps` — product data is fetched on the server for the initial page load.
- **Responsive product grid** using Bootstrap's grid system (1 → 2 → 3 → 4 columns depending on viewport).
- **Product cards** showing image, title, price, category, and rating.
- **Search bar** that filters products by title on the client, with a **loading spinner** shown while filtering.
- **Pagination** (client-side) over the filtered results.
- **Product details page** (`/product/[id]`) using dynamic routing, also server-rendered.
- **TypeScript** throughout.
- **Unit tests** (Jest + React Testing Library) for `ProductCard`, `SearchBar`, and `Pagination`.
- Graceful error state if the API request fails.

## Tech stack

| Requirement | Used |
|---|---|
| React.js | ✅ |
| Next.js | ✅ (v14, Pages Router) |
| Bootstrap | ✅ v5 |
| Fetch API | ✅ native `fetch` |
| TypeScript (bonus) | ✅ |
| Dynamic product page (bonus) | ✅ `/product/[id]` |
| Pagination (bonus) | ✅ client-side |
| Unit tests (bonus) | ✅ Jest + RTL |

## Getting started

### Prerequisites

- Node.js 18.17+ (Next.js 14 requirement)
- npm

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Run tests

```bash
npm test
```

## Project structure

```
├── pages/
│   ├── _app.tsx            # Global app wrapper, imports Bootstrap CSS
│   ├── index.tsx            # Product listing page (SSR + search + pagination)
│   └── product/
│       └── [id].tsx         # Product details page (dynamic route, SSR)
├── components/
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── ProductCard.tsx
│   ├── Pagination.tsx
│   └── LoadingSpinner.tsx
├── types/
│   └── product.ts           # Shared Product/Rating TypeScript interfaces
├── styles/
│   └── globals.css          # Small custom styles layered on top of Bootstrap
├── __tests__/
│   ├── ProductCard.test.tsx
│   ├── SearchBar.test.tsx
│   └── Pagination.test.tsx
├── jest.config.js
└── jest.setup.js
```

## Assumptions made

- **"Loading spinner while data is being fetched (for client-side filtering)"** was interpreted as: since the Fake Store API returns all products in one call, filtering by title is done client-side against the already-fetched list. A small (300ms) artificial delay is added around the filter step purely so the spinner is visible and demonstrable — there's no second network call per keystroke, since the full catalog is small and already in memory. If a larger catalog required querying the API per search term, this would be swapped for a real request inside the same effect.
- **Pagination** is client-side (8 products per page) since the entire catalog is fetched in a single SSR request; this was explicitly allowed as an option ("client-side or server-side") in the brief.
- **Rating** is displayed whenever the API returns it (it does, for every product in this dataset), formatted as a star + average + review count.
- **"Add to cart"** on the product details page is a static/decorative button — the brief didn't ask for cart functionality, so it's left as a UI placeholder rather than wired to real state/checkout.
- Images are rendered with a plain `<img>` tag rather than `next/image` to keep the setup simple and avoid extra remote-image configuration friction; `next.config.js` already allowlists `fakestoreapi.com` if you'd prefer to switch to `next/image`.

## Live demo

Not deployed by default — to deploy, push this repo to GitHub and import it into [Vercel](https://vercel.com/new) (zero-config for Next.js) or Netlify.

## Submission

Per the assignment, send the GitHub repo link (or this project as a ZIP) along with this README to **hcm@bribooks.com**.

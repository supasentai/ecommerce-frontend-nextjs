# ecommerce-frontend-nextjs

Next.js 15 ecommerce frontend starter using the App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, TanStack Query, Zustand, React Hook Form, Zod, and Axios.

## Sprint 1

Products catalog is available with backend-powered listing and detail pages:

- `/products` - product grid with loading, error, empty, search, category filter, sort, and pagination states
- `/products/[slug]` - product detail page with name, price, description, category, stock, availability, and an Add to cart placeholder

The backend API must be running and reachable from `NEXT_PUBLIC_API_URL` for product data to load.

## Requirements

- Node.js 20+
- npm

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start the local development server
- `npm run lint` - run ESLint
- `npm run build` - create a production build
- `npm run format` - format files with Prettier
- `npm run format:check` - check formatting with Prettier

## Environment Variables

| Name | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API |

# ecommerce-frontend-nextjs

Next.js 15 ecommerce frontend starter using the App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, TanStack Query, Zustand, React Hook Form, Zod, and Axios.

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

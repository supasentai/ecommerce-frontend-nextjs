# Next.js E-commerce Frontend

## Overview

This repository contains the frontend for a full-stack e-commerce project. The application is built with Next.js, TypeScript, and Tailwind CSS, and consumes a NestJS REST API for product, authentication, and cart data.

The project demonstrates a practical storefront flow: browsing products, viewing product details, authenticating users, managing a cart, and completing a demo checkout experience.

Local development URLs:

- Frontend: [http://localhost:3001](http://localhost:3001)
- Backend API: [http://localhost:3000](http://localhost:3000)

## Features

- Product listing page with pagination, search, category filtering, and sorting
- Product detail page using backend product IDs
- Login and registration pages connected to the backend auth API
- Auth session storage with Zustand and localStorage for development
- Add to cart from the product detail page
- Authenticated cart page
- Increase and decrease cart item quantity
- Remove cart items
- Clear cart
- Cart item subtotal and cart total calculation
- Empty cart state
- Checkout page
- Checkout order summary
- Required-field validation for demo shipping information
- Mock place order success flow
- Clear cart after successful demo checkout
- Responsive layout with reusable UI primitives

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios
- ESLint
- Prettier

## Project Structure

```text
src/
|-- app/
|   |-- cart/
|   |-- checkout/
|   |-- login/
|   |-- products/
|   |   |-- [slug]/
|   |   `-- page.tsx
|   |-- register/
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components/
|   |-- layout/
|   |-- ui/
|   `-- providers.tsx
|-- features/
|   |-- auth/
|   |-- cart/
|   |-- checkout/
|   `-- products/
|-- hooks/
|-- lib/
|-- store/
`-- types/
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- Running backend API at `http://localhost:3000`

### Installation

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the frontend development server on port `3001`:

```bash
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001).

## Environment Variables

The frontend reads public runtime configuration from `.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

| Variable | Description | Default/example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the NestJS backend REST API | `http://localhost:3000` |

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server. Use `npm run dev -- --port 3001` when the backend is running on port `3000`.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run format
```

Formats the project with Prettier.

```bash
npm run format:check
```

Checks formatting without writing changes.

## Backend API

This frontend is designed to work with the companion NestJS backend API running locally at:

```text
http://localhost:3000
```

The frontend currently calls backend endpoints for:

- Product listing and product detail
- Category data for product filtering
- User login and registration
- Cart retrieval and cart item mutations

Important product API notes:

- Product listing uses `/products` with supported query parameters such as `page`, `limit`, `search`, `categoryId`, `sortBy`, and `sortOrder`.
- Product detail links use product IDs because the backend supports `GET /products/:id`.
- Slug lookup is not assumed by the frontend.

## User Flow

1. Start the backend API at `http://localhost:3000`.
2. Start the frontend at `http://localhost:3001`.
3. Open the product catalog at `/products`.
4. Search, filter, sort, and paginate products.
5. Open a product detail page.
6. Register or log in.
7. Add a product to the cart.
8. Open `/cart` to update quantities, remove items, clear the cart, or review totals.
9. Continue to `/checkout`.
10. Fill in the demo shipping form.
11. Place a mock order and return to products after success.

## Production Deployment

The frontend is deployed on Vercel and connects to the backend API deployed on Render.

### Production URLs

| Service      | URL                                                  |
| ------------ | ---------------------------------------------------- |
| Frontend App | `https://ecommerce-frontend-nextjs-peach.vercel.app` |
| Backend API  | `https://ecommerce-backend-api-ikyj.onrender.com`    |

### Vercel Configuration

Recommended Vercel settings:

```text
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

### Vercel Environment Variables

Add this environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-backend-api-ikyj.onrender.com
```

Apply it to:

```text
Production
Preview
Development
```

After changing `NEXT_PUBLIC_API_URL`, redeploy the frontend because Next.js embeds `NEXT_PUBLIC_` variables into the client bundle at build time.

### Local Development with Production Backend

To run the frontend locally while using the deployed Render backend, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-backend-api-ikyj.onrender.com
```

Then restart the dev server:

```bash
npm run dev
```

If the app still calls `http://localhost:3000`, clear the local Next.js cache and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Backend CORS Requirement

The backend Render service must allow the Vercel frontend origin.

Set this environment variable on Render:

```env
FRONTEND_URL=https://ecommerce-frontend-nextjs-peach.vercel.app
```

Then redeploy the backend service.

### Demo Login

Use one of the seeded backend accounts:

```text
Email: user1@example.com
Password: Password123!
```

Other demo accounts:

```text
admin@example.com / Password123!
user2@example.com / Password123!
```

### Production Verification Checklist

After deployment, test:

```text
/products
/products/<product-id>
/login
/cart
/checkout
```

Expected behavior:

1. Product listing loads from the Render backend.
2. Login succeeds with a seeded account.
3. Product detail pages use product IDs.
4. Authenticated users can add items to cart.
5. Cart and checkout pages can read authenticated cart data.

### Troubleshooting

If products fail to load:

1. Confirm the backend endpoint works:

```text
https://ecommerce-backend-api-ikyj.onrender.com/products
```

2. Confirm Vercel has:

```env
NEXT_PUBLIC_API_URL=https://ecommerce-backend-api-ikyj.onrender.com
```

3. Redeploy the frontend after editing Vercel environment variables.

If login sends requests to:

```text
http://localhost:3000/auth/login
```

then the frontend was built with the wrong API URL. Update `NEXT_PUBLIC_API_URL`, clear cache if local, and rebuild/redeploy.

If the browser shows a CORS error, update the backend Render `FRONTEND_URL` to the exact Vercel production URL and redeploy the backend.


## Future Improvements

- Replace demo checkout with real backend order creation
- Add order history for authenticated users
- Add production-ready payment integration
- Improve checkout validation with a shared schema
- Add product images and image optimization
- Add automated tests for product, cart, and checkout flows
- Rename the product detail route from `[slug]` to `[id]` for clearer intent
- Harden authentication for production, such as using HttpOnly cookies
- Add loading skeletons and error recovery for checkout

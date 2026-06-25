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

## Screenshots

Screenshots can be added later.

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

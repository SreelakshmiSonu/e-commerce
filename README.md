# sRee

A portfolio clothing storefront built with Next.js, React, TypeScript, Zustand, GraphQL Yoga, and PostgreSQL. Checkout creates a demo order in the database; it never collects payment.

## Run locally

1. Install PostgreSQL and create a database named `forma`, or use a hosted PostgreSQL database.
2. Set `DATABASE_URL` in `.env.local` to your PostgreSQL connection string.
3. Create and seed the tables, using the same connection string:

   ```sh
   psql "postgresql://postgres:password@localhost:5432/forma" -f db/schema.sql
   ```

4. Start the app:

   ```sh
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000). The app reads products and records demo orders through the GraphQL endpoint at `/api/graphql`. Keep the database URL in `.env.local`; never expose it with a `NEXT_PUBLIC_` prefix.

## Stack

- **Next.js + React + TypeScript** — app framework and UI
- **Zustand** — client-side cart state, persisted in local storage
- **GraphQL Yoga** — GraphQL API in a Next.js route handler
- **PostgreSQL** — product catalog and demo orders

There is no payment integration. The checkout mutation only stores a `DEMO` order and its line items.

# Tropijoy

Pure joy in every bite. Premium dehydrated fruits and fruit powders — built with Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion, and Zustand.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Order Emails (Resend)

Checkout submissions and newsletter leads are sent via [Resend](https://resend.com) through Server Actions in `app/actions/checkout.ts`.

1. Copy `.env.example` to `.env.local`.
2. Set `RESEND_API_KEY` to your Resend API key.
3. Set `ORDER_NOTIFICATION_EMAIL` to the address that should receive order notifications.

Without these variables configured, checkout and lead capture run in **demo mode**: the UI completes normally and shows a toast noting no email was actually sent.

## Project Structure

```
app/                 Next.js App Router pages, layout, server actions
components/ui/       Reusable primitives (Button, Badge, StarRating, Skeleton)
components/layout/   Header, Footer, Search modal
components/home/     Hero, macOS-style tabs showcase, About, Best Sellers
components/product/  Product cards, filters, shop grid
components/cart/      Cart drawer
components/checkout/  Multi-step checkout modal
store/               Zustand stores (cart, wishlist, filters)
data/products.json   Mock product database
lib/                 Types and shared utilities
```

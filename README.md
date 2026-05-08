# citizen-prep-pro

Plateforme de préparation à l'examen de citoyenneté française — [citizen-prep-pro.vercel.app](https://citizen-prep-pro.vercel.app)

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (auth, database, edge functions)
- **Stripe** (subscriptions)
- **Vercel** (hosting)

## Local development

```sh
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev
```

Create a `.env` file at the root with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_STRIPE_STANDARD_LINK=...
VITE_STRIPE_PREMIUM_LINK=...
VITE_STRIPE_STANDARD_PRODUCT_ID=...
VITE_STRIPE_PREMIUM_PRODUCT_ID=...
```

## Deploy

Pushes to `main` auto-deploy to Vercel. Environment variables are set in the Vercel dashboard.

## Supabase edge functions

```sh
supabase functions deploy
```

Secret keys for edge functions are managed via:

```sh
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
```

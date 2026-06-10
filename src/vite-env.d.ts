/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_STANDARD_LINK?: string;
  readonly VITE_STRIPE_PREMIUM_LINK?: string;
  readonly VITE_STRIPE_STANDARD_PRODUCT_ID?: string;
  readonly VITE_STRIPE_PREMIUM_PRODUCT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

---
description: How to run the dev server locally and preview the app
---

# Local Development

// turbo-all

1. Install dependencies (if needed):
```bash
npm install
```

2. Start the Vite dev server:
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser.

4. To build for production:
```bash
npm run build
```

5. To preview the production build:
```bash
npm run preview
```

## Environment Variables
Make sure `.env` exists with:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

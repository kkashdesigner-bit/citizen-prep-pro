---
description: How to add a new feature with subscription gating
---

# Adding a Gated Feature

## Overview
New features that should be restricted to paying users need both **frontend gating** (UI interception) and **backend protection** (server-side verification).

## Step 1: Decide the tier
| Feature Type | Required Tier |
|-------------|---------------|
| Basic learning content | Standard |
| Unlimited exams | Standard |
| Category Training | Premium |
| Translations in quiz | Premium |
| Video guides | Premium |

## Step 2: Frontend Gating

### Option A: Route-level gate (in page component)
```tsx
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionGate } from '@/components/SubscriptionGate';

const MyFeaturePage = () => {
  const { isPremium, loading } = useSubscription();
  const [showGate, setShowGate] = useState(false);

  if (!isPremium) {
    return <SubscriptionGate
      isOpen={true}
      onClose={() => navigate('/learn')}
      requiredTier="premium"
    />;
  }

  return <div>Premium content here...</div>;
};
```

### Option B: Button-level gate (inline)
```tsx
const handleClick = () => {
  if (!isPremium) {
    setShowGate(true);
    return;
  }
  // proceed with action
};
```

## Step 3: Backend Protection
For API calls serving premium data, verify the tier server-side:
```sql
-- In Supabase RPC or Edge Function
SELECT subscription_tier FROM public.profiles
WHERE id = auth.uid();
```

## Step 4: Add the i18n strings
Add all user-facing text to `LanguageContext.tsx` across all 6 languages.
Follow the `/add-translations` workflow.

## Step 5: Test the gate
1. Log in as a free user → should see the gate modal
2. Log in as a standard user → verify tier-appropriate access
3. Log in as a premium user → full access
4. Test unauthenticated → should redirect to `/auth`

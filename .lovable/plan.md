

## Learning-First Platform Redesign

This plan transforms the app from a quiz tool into a structured learning platform with a new `/learn` route as the core experience, a lesson system, and updated subscription tiers (Free / Standard / Premium).

---

### Phase 1: Database Schema

**New tables via migration:**

1. **`lessons`** table:
   - `id` (uuid, PK, default gen_random_uuid())
   - `category` (text, not null)
   - `level` (text, not null, default 'CSP')
   - `title` (text, not null)
   - `content` (text, not null)
   - `estimated_minutes` (integer, not null, default 10)
   - `order_index` (integer, not null, default 0)
   - `created_at` (timestamptz, default now())
   - RLS: authenticated users can SELECT

2. **`lesson_progress`** table:
   - `id` (uuid, PK, default gen_random_uuid())
   - `user_id` (uuid, not null)
   - `lesson_id` (uuid, references lessons(id) on delete cascade)
   - `status` (text, not null, default 'not_started') -- not_started, in_progress, completed
   - `score_last` (integer, nullable)
   - `updated_at` (timestamptz, default now())
   - unique(user_id, lesson_id)
   - RLS: users can SELECT/INSERT/UPDATE their own rows

3. **Update `profiles.subscription_tier`** allowed values conceptually from (free/tier_1/tier_2) to (free/standard/premium). No schema change needed since it is a text column -- just update the application logic.

**Seed lessons:** Insert ~15 starter lessons (3 per category) via the insert tool.

---

### Phase 2: Subscription Tier Refactor

**Files:** `src/hooks/useSubscription.ts`, `src/lib/subscriptionTiers.ts`

- Rename tier values: `tier_1` becomes `standard`, `tier_2` becomes `premium`
- Maintain backward compatibility: map old `tier_1`/`tier_2` and `is_subscribed` to new names
- Update `useSubscription` return: `isStandardOrAbove`, `isPremium`
- Update `TIER_LABELS`, badge config

**Access rules encoded:**

| Feature | Free | Standard | Premium |
|---------|------|----------|---------|
| Browse site | Yes | Yes | Yes |
| Learning dashboard | Yes | Yes | Yes |
| Demo exam (1 only) | Yes | Yes | Yes |
| Unlimited exams | No | Yes | Yes |
| Training mode | No | Yes | Yes |
| Progress tracking | No | Yes | Yes |
| Lessons | No | Yes | Yes |
| Learning path | No | Yes | Yes |
| Translation | No | No | Yes |
| Category training | No | No | Yes |

---

### Phase 3: New Route and Pages

**File:** `src/App.tsx`
- Add route `/learn` pointing to `LearningDashboard`
- Add route `/lesson/:id` pointing to `LessonPage`

**File:** `src/pages/LearningDashboard.tsx` (new)

Layout:
```text
+-----------------------------------------------+
| Welcome back, {username}!                      |
| "What would you like to study today?"          |
+-----------------------------------------------+
| CONTINUE LEARNING    | MY LEARNING PATH        |
| [Next lesson card]   | [Categories + progress] |
| [Resume button]      | [Progress bars]         |
| (locked for Free)    | (locked for Free)       |
+-----------------------------------------------+
| PRACTICE & TEST      | MY PROGRESS             |
| - Demo Exam          | - Lessons completed     |
| - Full Exam (Std+)   | - Accuracy %            |
| - Training (Std+)    | - Weak areas            |
| - Cat Train (Prem)   | (locked for Free)       |
+-----------------------------------------------+
```

Each card checks tier and shows SubscriptionGate modal if locked.

**File:** `src/pages/LessonPage.tsx` (new)
- Fetches lesson by ID from `lessons` table
- Shows title, content (rendered as markdown-like text), key points, estimated time
- "Mark Complete" button updates `lesson_progress`
- "Practice" button links to quiz with that category
- Locked for Free tier (redirect to gate)

---

### Phase 4: Update Navigation and Funnel

**File:** `src/components/Header.tsx`
- Replace "Dashboard" link with "Learn" link pointing to `/learn` (for authenticated users)
- Keep user dropdown with both "Learn" and "Account" (which goes to `/dashboard`)

**File:** `src/components/HeroSection.tsx`
- Change primary CTA from `/quiz?mode=study` to:
  - If logged in: `/learn`
  - If not logged in: `/auth`
- Update CTA label to use `t('hero.startLearning')`

**File:** `src/pages/Auth.tsx`
- After login redirect: change from `/dashboard` to `/learn`

**File:** `src/hooks/useAuth.ts`
- Update Google OAuth redirectTo from `/dashboard` to `/learn`

---

### Phase 5: Update Existing Dashboard

**File:** `src/pages/Dashboard.tsx`
- Repurpose as account/billing/analytics page
- Keep: user profile card, exam history, tier badge
- Remove: category training, level selector, video guides (these move to /learn)
- Add: link to `/learn` as primary action

---

### Phase 6: Quiz Access Control Updates

**File:** `src/pages/Quiz.tsx`
- Free tier: only allow 1 demo exam (check `sessionStorage` or profile `exam_history` length)
- Standard: unlimited exams + training mode
- Premium: add category training access
- Translation button already gated by tier -- update to check `isPremium` instead of `isTier2`

---

### Phase 7: Internationalization

**File:** `src/contexts/LanguageContext.tsx`

Add ~30 new translation keys across all 6 languages:
- `hero.startLearning` - "Start Learning"
- `learn.welcome` - "Welcome back, {name}!"
- `learn.subtitle` - "What would you like to study today?"
- `learn.continueLearning` - "Continue Learning"
- `learn.learningPath` - "My Learning Path"
- `learn.practiceTest` - "Practice & Test"
- `learn.myProgress` - "My Progress"
- `learn.demoExam` - "Demo Exam"
- `learn.fullExam` - "Full Exam"
- `learn.training` - "Training Mode"
- `learn.categoryTraining` - "Category Training"
- `learn.lessonsCompleted` - "Lessons Completed"
- `learn.accuracy` - "Accuracy"
- `learn.weakAreas` - "Weak Areas"
- `learn.resume` - "Resume"
- `learn.nextLesson` - "Next Lesson"
- `learn.markComplete` - "Mark Complete"
- `learn.practice` - "Practice"
- `learn.locked` - "Upgrade to unlock"
- `learn.estimatedTime` - "Estimated time"
- `nav.learn` - "Learn"
- `nav.account` - "Account"
- Plus additional keys for lesson page

---

### Phase 8: Pricing Section Update

**File:** `src/components/PricingSection.tsx`
- Show 3 tiers: Free (included by default), Standard, Premium
- Standard: 6.99/mo or 30.99/6mo
- Premium: 9.99/mo or 49.99/6mo
- Feature comparison list for each tier

---

### Phase 9: SubscriptionGate Update

**File:** `src/components/SubscriptionGate.tsx`
- Update to support `requiredTier: 'standard' | 'premium'`
- Show tier comparison with feature lists
- Update pricing display

---

### Summary of All Files

| File | Action |
|------|--------|
| `src/pages/LearningDashboard.tsx` | Create -- main learning hub |
| `src/pages/LessonPage.tsx` | Create -- individual lesson view |
| `src/App.tsx` | Edit -- add /learn and /lesson/:id routes |
| `src/hooks/useSubscription.ts` | Edit -- rename tiers to standard/premium |
| `src/lib/subscriptionTiers.ts` | Edit -- update labels and badges |
| `src/components/Header.tsx` | Edit -- nav links to /learn |
| `src/components/HeroSection.tsx` | Edit -- CTA routing logic |
| `src/pages/Auth.tsx` | Edit -- redirect to /learn |
| `src/hooks/useAuth.ts` | Edit -- OAuth redirect to /learn |
| `src/pages/Dashboard.tsx` | Edit -- slim down to account page |
| `src/pages/Quiz.tsx` | Edit -- tier-based access control |
| `src/components/SubscriptionGate.tsx` | Edit -- standard/premium support |
| `src/components/PricingSection.tsx` | Edit -- 3-tier display |
| `src/contexts/LanguageContext.tsx` | Edit -- add ~30 translation keys |
| Database migration | Create lessons + lesson_progress tables |


# GoCivique — Database Schema Reference

## Overview
The backend is a **Supabase PostgreSQL** instance with **Row Level Security (RLS)** enabled on all tables. Data is split between static educational content and dynamic user state.

---

## Tables

### `profiles` — User state & progression
Linked 1:1 to `auth.users(id)` with cascading deletion.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK, FK → auth.users) | Same as auth user ID |
| `display_name` | TEXT | Auto-populated from OAuth metadata |
| `avatar_url` | TEXT | Google profile picture |
| `is_subscribed` | BOOLEAN (default: false) | Legacy flag |
| `subscription_tier` | TEXT | `'free'`, `'standard'`, `'premium'` |
| `exam_history` | JSONB (default: `'[]'`) | Array of `ExamResult` objects |
| `used_questions` | UUID[] (default: `'{}'`) | Prevents repeat questions |
| `preferred_language` | TEXT (default: `'fr'`) | UI language |
| `created_at` | TIMESTAMPTZ | Auto |
| `updated_at` | TIMESTAMPTZ | Auto via trigger |

### `user_profile` — Persona-driven onboarding
Separate from `profiles` for persona/goal tracking.

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID (UNIQUE) | FK to auth user |
| `first_name` | TEXT | |
| `goal_type` | TEXT | `'naturalisation'`, `'carte_resident'`, `'csp'` |
| `level` | TEXT (default: `'beginner'`) | `'beginner'`, `'intermediate'`, `'advanced'` |
| `timeline` | TEXT | `'less_1_month'`, `'1_3_months'`, `'more_3_months'`, `'not_sure'` |
| `onboarding_completed` | BOOLEAN (default: false) | |

### `questions` — Civic exam question bank

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Or INTEGER (coexisting schemas) |
| `category` | TEXT (constrained) | One of 5 official domains |
| `subcategory` | TEXT | e.g., `'Symbole'`, `'Laïcité'` |
| `level` | TEXT | `'CSP'`, `'CR'`, `'Naturalisation'` |
| `question_text` | TEXT | French question text |
| `option_a` through `option_d` | TEXT | Four answer options |
| `correct_answer` | TEXT | Matches one option or letter key |
| `explanation` | TEXT | Pedagogical context |
| `language` | TEXT | Default `'fr'` |
| `question_translated` | TEXT | Translated question |
| `option_a_translated` through `option_d_translated` | TEXT | Translated options |

**Category Constraint** (latest migration):
```sql
CHECK (category IN (
  'Principles and values of the Republic',
  'Institutional and political system',
  'Rights and duties',
  'History, geography and culture',
  'Living in French society'
))
```

### `lessons` — Theoretical educational modules

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `category` | TEXT | Maps to 5+2 categories |
| `level` | TEXT | `'CSP'`, `'CR'`, `'Naturalisation'` |
| `title` | TEXT | Lesson title |
| `content` | TEXT | Markdown-compatible content |
| `estimated_minutes` | INTEGER | |
| `order_index` | INTEGER | Defines sequence |

### `lesson_progress` — User lesson tracking

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `lesson_id` | UUID (FK) | |
| `user_id` | UUID (FK) | |
| `status` | TEXT | `'locked'`, `'in_progress'`, `'completed'` |
| `score_last` | NUMERIC | Last quiz score |

### `learning_paths` — Parcours path definitions

| Column | Type |
|--------|------|
| `id` | UUID (PK) |
| `persona_goal` | TEXT |

### `classes` — Individual classes in a Parcours

| Column | Type |
|--------|------|
| `id` | UUID (PK) |
| `path_id` | UUID (FK → learning_paths) |
| `class_number` | INTEGER |
| `title` | TEXT |
| `description` | TEXT |
| `estimated_minutes` | INTEGER |

### `user_class_progress` — Progress through classes

| Column | Type |
|--------|------|
| `user_id` | UUID |
| `class_id` | UUID |
| `status` | TEXT |
| `score` | NUMERIC |
| `attempts_count` | INTEGER |
| `completed_at` | TIMESTAMPTZ |

### `user_roles` — Admin access control

| Column | Type |
|--------|------|
| `id` | UUID (PK) |
| `user_id` | UUID (FK, UNIQUE with role) |
| `role` | `app_role` ENUM | `'admin'` or `'user'` |

---

## RLS Policies Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `questions` | Anyone authenticated | Admin only | Admin only | Admin only |
| `profiles` | Own row (`auth.uid() = id`) | Own row | Own row | — |
| `user_profile` | Own row (`auth.uid() = user_id`) | Own row | Own row | — |
| `user_roles` | Admin only | Admin only | — | Admin only |
| `lesson_progress` | Own row | Own row | Own row | — |
| `user_class_progress` | Own row | Own row | Own row | — |

---

## Triggers & Functions

| Function | Purpose |
|----------|---------|
| `handle_new_user()` | Auto-creates `profiles` row on new `auth.users` signup |
| `update_updated_at_column()` | Auto-updates `updated_at` on any row modification |
| `has_role(user_id, role)` | Helper: checks if user has a specific `app_role` |

---

## JSONB Structures

### `profiles.exam_history` — Array of:
```typescript
{
  id: string;
  date: string;          // ISO timestamp
  score: number;         // e.g., 32
  totalQuestions: number; // e.g., 40
  passed: boolean;
  timeSpent: number;     // seconds
  categoryBreakdown: Record<string, { correct: number; total: number }>;
}
```

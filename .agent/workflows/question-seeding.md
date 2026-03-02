---
description: How to generate and seed civic exam questions into the database
---

# Question Generation & Seeding

## Step 1: Generate Questions
Use the Curriculum Agent skill (`.agent/skills/curriculum_agent/SKILL.md`) to generate questions.

Specify:
- **Category**: One of the 5 exact domain strings
- **Level**: `CSP`, `CR`, or `Naturalisation`
- **Quantity**: How many questions to generate

## Step 2: Validate Content
Before seeding, verify each question:
1. Category string matches one of the 5 official domains exactly
2. Level is one of: `CSP`, `CR`, `Naturalisation`
3. Exactly 4 answer options provided
4. `correct_answer` matches one option text exactly
5. Explanation cites a specific law, date, or constitutional article

## Step 3: Format as SQL
```sql
INSERT INTO public.questions (
  category, subcategory, level,
  question_text, option_a, option_b, option_c, option_d,
  correct_answer, explanation, language
) VALUES
(
  'Principles and values of the Republic',
  'Laïcité',
  'CSP',
  'Quelle loi a établi la séparation des Églises et de l''État ?',
  'La loi de 1905',
  'La loi de 1789',
  'La loi de 1945',
  'La loi de 1968',
  'La loi de 1905',
  'La loi du 9 décembre 1905 a instauré la séparation des Églises et de l''État.',
  'fr'
);
```

## Step 4: Apply via Supabase
Use the `execute_sql` MCP tool with project_id `jblhxpzqbbarpqstcbvq`.

## Step 5: Verify
```sql
SELECT count(*), category, level
FROM public.questions
GROUP BY category, level
ORDER BY category, level;
```

## CSV Alternative
For bulk imports, use semicolon-delimited CSV and the `scripts/map_csv.js` utility.

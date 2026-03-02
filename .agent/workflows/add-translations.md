---
description: How to add new translations to the i18n system
---

# Adding Translations

## UI Translations (LanguageContext)

### Step 1: Identify the key namespace
Keys follow the pattern `section.key`:
- `nav.home`, `pricing.feature1`, `learn.welcome`, `results.passThreshold`

### Step 2: Add to LanguageContext.tsx
Open `src/contexts/LanguageContext.tsx` and add the key in ALL 6 languages:

```typescript
'section.newKey': {
  fr: 'French text',
  en: 'English text',
  ar: 'Arabic text',    // RTL-compatible
  es: 'Spanish text',
  pt: 'Portuguese text',
  zh: 'Chinese text'
}
```

### Step 3: Variable tokens
If the string contains dynamic values, use `{variable}`:
```typescript
'learn.progress': {
  fr: 'Vous avez complété {count} leçons',
  en: 'You completed {count} lessons',
  ar: 'أكملت {count} دروس',
  es: 'Completaste {count} lecciones',
  pt: 'Você completou {count} lições',
  zh: '您已完成 {count} 节课'
}
```

### Step 4: Use in components
```tsx
const { t } = useLanguage();
// Simple:
<p>{t('section.newKey')}</p>
// With variable (manual replace):
<p>{t('learn.progress').replace('{count}', String(count))}</p>
```

## Question Translations (Database)
For civic exam question translations, update the `questions` table columns:
- `question_translated`
- `option_a_translated` through `option_d_translated`

These are premium-gated and served via `TranslateButton.tsx`.

## RTL Checklist (Arabic)
When adding Arabic translations:
- [ ] Text displays correctly in RTL context
- [ ] Layout margins/padding don't break (`ml-*` vs `mr-*`)
- [ ] Icons and navigation are properly mirrored
- [ ] Numbers remain LTR within RTL text

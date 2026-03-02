# GoCivique — Exam Rules & Content Strategy

## The 2026 Examen Civique

### Legal Context
Since **January 1, 2026**, the French Ministry of the Interior requires non-EU nationals to pass the **Examen Civique** for:
- **CSP** (Carte de Séjour Pluriannuelle) — multi-year residence permit
- **CR** (Carte de Résident) — 10-year resident card
- **Naturalisation** — full French citizenship

### Exam Parameters
| Parameter | Value |
|-----------|-------|
| Questions | 40 multiple-choice |
| Time limit | 45 minutes |
| Pass threshold | 80% (32/40 correct) |
| Language | French only |
| Format | Digital, administered by the government |

### Language Requirements (separate from exam)
| Permit | Level |
|--------|-------|
| CSP | A2 French |
| CR | B1 French |
| Naturalisation | B2 French |

---

## 5 Official Content Domains

These are the **exact strings** used in the database `category` column:

1. `Principles and values of the Republic` — Secularism, liberty, equality, fraternity, national symbols
2. `Institutional and political system` — President, Parliament, judiciary, local government
3. `Rights and duties` — Fundamental rights, voting, taxes, military service
4. `History, geography and culture` — Revolution, Republics, European Union, geography
5. `Living in French society` — Healthcare, education, employment, daily life

---

## Question Level Cascade Logic

This is critical for the quiz engine:

```
CSP exam       →  fetches questions WHERE level = 'CSP'
CR exam        →  fetches questions WHERE level IN ('CSP', 'CR')
Naturalisation →  fetches questions WHERE level IN ('CSP', 'CR', 'Naturalisation')
```

Each higher level **includes all lower-level questions** plus its own advanced content.

---

## Level Difficulty Guide

### CSP (Entry-Level)
- Basic republican values and daily societal norms
- Simple institutional facts (who is the President, what is Parliament)
- Everyday practical knowledge (emergency numbers, healthcare)

### CR (Intermediate)
- Complex institutional mechanics (how laws are passed, taxation)
- Detailed rights and duties of long-term residents
- Deeper historical knowledge (constitutional history)
- Regional/local government understanding

### Naturalisation (Advanced)
- Deep constitutional theory and philosophy
- Advanced historical knowledge (all five Republics in detail)
- International law and France's global role
- Expert-level understanding of all institutions

---

## Question Quality Standards

### Distractor Engineering
Every question must have **4 options**: 1 correct + 3 plausible distractors.
- Distractors must test **nuanced misunderstandings**, not trivial elimination
- Avoid "obviously wrong" options
- Each distractor should represent a common misconception

### Explanation Requirements
Every question needs a **pedagogical explanation** that:
- Cites the specific law, date, or constitutional article
- Explains WHY the answer is correct (not just WHAT)
- Is displayed to users in Study Mode for active learning

---

## Content Files

| File | Location | Purpose |
|------|----------|---------|
| `demo_questions.csv` | `/public/` | 20 offline demo questions (semicolon-delimited) |
| `questions_V2.csv` | `/public/` | Full question bank (~2MB) |
| `questions_mapped.csv` | `/public/` | Processed/mapped version (~2MB) |
| `seed-lessons.sql` | `/scripts/` | Lesson seeding template |
| `map_csv.js` | `/scripts/` | CSV processing utility |

### CSV Format
Questions use **semicolons** (`;`) as delimiters to avoid conflicts with commas in French text.

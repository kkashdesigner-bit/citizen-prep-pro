---
name: French Civic Exam Knowledge
description: Knowledge about how the French examen civique works, its structure, and preparation guidelines.
---

# French Civic Exam (Examen Civique)

The French Civic Exam evaluates an applicant's integration into French society, language proficiency, and knowledge of the Republic's values. It is tailored to different residency aspirations and requires specific knowledge thresholds.

## Levels & Goal Types
1. **CSP (Contrat d'Intégration Républicaine)**: 
   - Entry-level civic knowledge.
   - Questions focus on basic principles, daily life, and simple institutions.
   - Typically taken during the OFII integration process.
2. **CR (Carte de Résident / 10-year residency)**:
   - Intermediate level. 
   - Applicants taking the CR need to know everything from the CSP level plus more advanced rights, duties, and institutional knowledge.
   - **Questions pool**: `CR` + `CSP`.
3. **Naturalisation (French Citizenship)**:
   - Advanced level. 
   - Requires comprehensive knowledge of French history, culture, geography, institutions, and principles.
   - **Questions pool**: `Naturalisation` + `CR` + `CSP`.

## Official Categories Breakdown
The questions are strictly categorized into 5 official domains. When migrating or filtering databases, only the following literal strings must be used:
1. `Principles and values of the Republic`
2. `Institutional and political system`
3. `Rights and duties`
4. `History, geography and culture`
5. `Living in French society`

## System Behavior & Rules
- Users must be able to choose between the 3 main levels (CSP, CR, Naturalisation).
- The onboarding process must strictly funnel users into one of those 3 levels (no "I don't know" options).
- Training mock exams adapt strictly to the user's level (using the cascading logic mentioned above).
- Users can switch their target exam category at any time via their dashboard settings.
- Regardless of their exam goal, users can temporarily filter exams by any of the 5 domains above to focus their training on specific weaknesses, while still respecting their base exam goal level cascade.


**Phase 1: Planning**
1. Understand requirements and edge cases
2. Design database schema (if needed)
3. Plan API endpoints
4. Sketch component hierarchy

**Phase 2: Backend**
1. Create database migrations
2. Build API endpoints with validation
3. Write unit tests for business logic
4. Add API documentation

**Phase 3: Frontend**
1. Create React components
2. Implement state management
3. Connect to API endpoints
4. Add loading and error states
5. Ensure mobile responsiveness

**Phase 4: Polish**
1. Add integration tests
2. Optimize performance
3. Add accessibility features
4. Update documentation

Always work incrementally and test each phase before moving forward.

You are a ruthless code reviewer who never lets anything slide. Your job is to:
1. Review every line of code with extreme attention to detail
2. Identify security vulnerabilities (XSS, SQL injection, CSRF, etc.)
3. Point out performance bottlenecks
4. Suggest architectural improvements
5. Enforce best practices and coding standards
6. Never approve code that doesn't meet the highest standards

Be thorough, be strict, but be constructive. Explain WHY something is wrong and HOW to fix it.
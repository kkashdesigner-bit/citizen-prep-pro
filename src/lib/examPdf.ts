import { Question, getCorrectAnswerText } from '@/lib/types';

/** One question as rendered in an exam PDF. */
export interface ExamPdfItem {
    questionText: string;
    options: string[];
    selectedAnswer?: string;
    correctAnswer: string;
    category: string;
    explanation?: string;
}

export interface ExamPdfOptions {
    /** Heading shown at the top-left (the logo sits top-right). */
    title: string;
    /** Small grey line under the heading (score, date, question count…). */
    subtitle?: string;
    /** true → show the correct answer (green ✓) + explanations. false → blank exam. */
    withAnswers: boolean;
}

const esc = (s: unknown) =>
    String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Map raw DB questions into PDF items (no user answers — used for course fiches). */
export function questionsToExamItems(questions: Question[]): ExamPdfItem[] {
    return (questions || []).map(q => ({
        questionText: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correctAnswer: getCorrectAnswerText(q),
        category: q.category,
        explanation: q.explanation || '',
    }));
}

/**
 * Open a clean, GoCivique-branded print view of an exam and trigger the browser's
 * print-to-PDF dialog. The logo is fetched from the app origin and placed top-right.
 */
export function openExamPdf(items: ExamPdfItem[], opts: ExamPdfOptions): void {
    if (!items || items.length === 0) return;
    const { title, subtitle, withAnswers } = opts;
    const logo = `${window.location.origin}/gocivique-logo-examen-civique.png`;

    const blocks = items.map((it, i) => {
        const lis = (it.options || []).map((opt, oi) => {
            const letter = String.fromCharCode(65 + oi);
            if (!withAnswers) {
                return `<li>${letter}. ${esc(opt)}</li>`;
            }
            const isCorrect = String(opt).trim() === String(it.correctAnswer).trim();
            const isSel = it.selectedAnswer && String(opt).trim() === String(it.selectedAnswer).trim();
            const mark = isCorrect ? ' ✓' : (isSel ? ' ✗' : '');
            const style = isCorrect
                ? 'color:#067647;font-weight:700'
                : (isSel ? 'color:#b42318;font-weight:600' : 'color:#475467');
            return `<li style="${style}">${letter}. ${esc(opt)}${mark}</li>`;
        }).join('');
        const exp = withAnswers && it.explanation ? `<p class="exp">${esc(it.explanation)}</p>` : '';
        return `<div class="q"><p class="cat">${esc(it.category)}</p><p class="qt">${i + 1}. ${esc(it.questionText)}</p><ul>${lis}</ul>${exp}</div>`;
    }).join('');

    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
        body{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;max-width:760px;margin:0 auto;padding:32px;line-height:1.5}
        .head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin:0 0 6px}
        h1{color:#0055A4;font-size:22px;margin:0}
        .logo{height:44px;width:auto;object-fit:contain}
        .sub{color:#667085;font-size:13px;margin:0 0 20px}
        .acc{height:4px;background:linear-gradient(90deg,#0055A4 0 33%,#fff 33% 66%,#EF4135 66% 100%);margin:0 0 24px;border-radius:2px}
        .q{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin:0 0 12px;page-break-inside:avoid}
        .cat{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#0055A4;font-weight:700;margin:0 0 6px}
        .qt{font-weight:700;margin:0 0 8px;font-size:14px}
        ul{margin:0;padding-left:18px} li{margin:3px 0;font-size:13px}
        .exp{background:#eff6ff;border-radius:8px;padding:8px 10px;margin:8px 0 0;font-size:12px;color:#0055A4}
        .foot{margin-top:24px;color:#98a2b3;font-size:11px;text-align:center}
        @media print{body{padding:0 12px}}
    </style></head><body onload="setTimeout(function(){window.print()},300)">
        <div class="head"><h1>${esc(title)}</h1><img class="logo" src="${logo}" alt="GoCivique" onerror="this.style.display='none'"/></div>
        ${subtitle ? `<p class="sub">${esc(subtitle)}</p>` : ''}
        <div class="acc"></div>
        ${blocks}
        <p class="foot">gocivique.fr</p>
    </body></html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
}

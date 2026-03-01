import { Check, Flag, CircleDot } from 'lucide-react';

interface ExamNavigatorProps {
    totalQuestions: number;
    currentIndex: number;
    answers: Record<number, string>;
    questionIds: number[];
    flagged: Set<number>;
    onJump: (index: number) => void;
}

export default function ExamNavigator({
    totalQuestions,
    currentIndex,
    answers,
    questionIds,
    flagged,
    onJump,
}: ExamNavigatorProps) {
    const answeredCount = Object.keys(answers).length;
    const flaggedCount = flagged.size;
    const remainingCount = totalQuestions - answeredCount;

    return (
        <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Answered
                    </p>
                    <p className="text-2xl font-extrabold text-foreground">{String(answeredCount).padStart(2, '0')}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Flagged
                    </p>
                    <p className="text-2xl font-extrabold text-[#EF4135]">{String(flaggedCount).padStart(2, '0')}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Remaining
                    </p>
                    <p className="text-2xl font-extrabold text-foreground">{String(remainingCount).padStart(2, '0')}</p>
                </div>
            </div>

            {/* Navigator grid */}
            <div>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                    <CircleDot className="h-4 w-4 text-primary" />
                    Exam Navigator
                </h3>
                <div className="grid grid-cols-5 gap-2">
                    {questionIds.map((qId, idx) => {
                        const isCurrent = idx === currentIndex;
                        const isAnswered = answers[qId] !== undefined;
                        const isFlagged = flagged.has(qId);

                        let bgClass = 'bg-card text-muted-foreground border-border/60 hover:border-primary/40';
                        if (isCurrent) {
                            bgClass = 'bg-primary text-primary-foreground border-primary shadow-md';
                        } else if (isFlagged) {
                            bgClass = 'bg-card text-[#EF4135] border-[#EF4135]/50';
                        } else if (isAnswered) {
                            bgClass = 'bg-card text-primary border-primary/40';
                        }

                        return (
                            <button
                                key={qId}
                                onClick={() => onJump(idx)}
                                className={`relative h-10 w-full rounded-lg border-2 text-xs font-bold transition-all duration-200 hover:scale-105 ${bgClass}`}
                            >
                                {String(idx + 1).padStart(2, '0')}
                                {isFlagged && !isCurrent && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#EF4135] rounded-full border border-white" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    Current
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border-2 border-primary/40" />
                    Answered
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border-2 border-[#EF4135]/50 relative">
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#EF4135] rounded-full" />
                    </span>
                    Flagged
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm border-2 border-border/60" />
                    Unvisited
                </div>
            </div>

            {/* Study Tip */}
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
                    💡 Study Tip
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Take deep breaths and read each question carefully. Flag questions you're unsure about and come back to them at the end.
                </p>
            </div>
        </div>
    );
}

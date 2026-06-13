import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, Crown, Star } from 'lucide-react';

/**
 * Duolingo-style winding path for one module's classes.
 * Big tappable nodes zigzag down a centered column, connected by a snaking
 * SVG path. Node states: completed (emerald, crown if mastered), current
 * (pulsing blue + "Commencer" bubble), unlocked, locked.
 */

export interface PathClass {
    id: string;
    class_number: number;
    title: string;
    estimated_minutes: number | null;
}

interface ModulePathProps {
    classes: PathClass[];
    color: string;
    isUnlocked: (clazz: PathClass) => boolean;
    isCompleted: (clazz: PathClass) => boolean;
    scoreOf: (clazz: PathClass) => number;
    nextClassId?: string;
    onClassClick: (clazz: PathClass) => void;
    nextClassRef?: React.RefObject<HTMLDivElement | null>;
}

const ROW_H = 96;          // vertical distance between node centers
const AMP = 80;            // zigzag amplitude in px
const NODE = 64;           // node diameter

/** Horizontal offset of node i from the column center (gentle sine zigzag). */
function xOffset(i: number): number {
    return Math.round(Math.sin(i * 0.95) * AMP);
}

export default function ModulePath({
    classes, color, isUnlocked, isCompleted, scoreOf, nextClassId, onClassClick, nextClassRef,
}: ModulePathProps) {
    // Extra 56px at the bottom so the last node's label isn't clipped
    const height = classes.length * ROW_H + 56;

    // Snaking connector through all node centers (centered coordinate system, 0 = column middle)
    const pathD = useMemo(() => {
        if (classes.length < 2) return '';
        const pts = classes.map((_, i) => ({ x: xOffset(i), y: i * ROW_H + NODE / 2 + 8 }));
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const cur = pts[i];
            const midY = (prev.y + cur.y) / 2;
            d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
        }
        return d;
    }, [classes]);

    return (
        <div className="relative mx-auto" style={{ width: Math.min(360, AMP * 2 + NODE + 120), height }}>
            {/* Connector path */}
            <svg
                className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
                width={AMP * 2 + NODE}
                height={height - 56}
                viewBox={`${-(AMP + NODE / 2)} 0 ${AMP * 2 + NODE} ${height}`}
                aria-hidden="true"
            >
                <path d={pathD} fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round" />
                <path d={pathD} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" strokeDasharray="0.1 18" />
            </svg>

            {/* Nodes */}
            {classes.map((clazz, i) => {
                const completed = isCompleted(clazz);
                const unlocked = isUnlocked(clazz);
                const isNext = clazz.id === nextClassId;
                const score = scoreOf(clazz);
                const mastered = completed && score >= 86;
                const x = xOffset(i);

                return (
                    <div
                        key={clazz.id}
                        ref={isNext ? (nextClassRef as React.RefObject<HTMLDivElement>) : undefined}
                        className="absolute left-1/2 flex flex-col items-center"
                        style={{ top: i * ROW_H + 8, transform: `translateX(calc(-50% + ${x}px))` }}
                    >
                        {/* "Commencer" bubble above the current node */}
                        {isNext && unlocked && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: [0, -5, 0] }}
                                transition={{ y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
                                className="absolute -top-9 z-20 px-3 py-1 rounded-xl bg-white border-2 text-[11px] font-black uppercase tracking-wide shadow-md whitespace-nowrap"
                                style={{ borderColor: color, color }}
                            >
                                Commencer
                                <span
                                    className="absolute left-1/2 -bottom-[7px] -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-b-2 border-r-2"
                                    style={{ borderColor: color }}
                                />
                            </motion.div>
                        )}

                        {/* Node button */}
                        <motion.button
                            type="button"
                            whileHover={unlocked ? { scale: 1.08 } : {}}
                            whileTap={unlocked ? { scale: 0.92 } : {}}
                            onClick={() => onClassClick(clazz)}
                            aria-label={`Classe ${clazz.class_number} : ${clazz.title}`}
                            className={`relative z-10 flex items-center justify-center rounded-full border-b-4 transition-colors ${unlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            style={{
                                width: NODE,
                                height: NODE,
                                background: completed ? '#059669' : isNext && unlocked ? color : unlocked ? '#fff' : '#F3F4F6',
                                borderColor: completed ? '#047857' : isNext && unlocked ? 'rgba(0,0,0,0.25)' : unlocked ? '#D1D5DB' : '#E5E7EB',
                                boxShadow: isNext && unlocked ? `0 0 0 6px ${color}22, 0 6px 16px ${color}55` : '0 2px 6px rgba(0,0,0,0.08)',
                            }}
                        >
                            {isNext && unlocked && (
                                <span
                                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                                    style={{ background: color }}
                                />
                            )}
                            {completed ? (
                                mastered ? <Crown className="w-7 h-7 text-amber-300 fill-amber-300" /> : <Check className="w-8 h-8 text-white" strokeWidth={3.5} />
                            ) : !unlocked ? (
                                <Lock className="w-6 h-6 text-gray-300" />
                            ) : isNext ? (
                                <Play className="w-7 h-7 text-white fill-white ml-1" />
                            ) : (
                                <Star className="w-6 h-6" style={{ color }} />
                            )}

                            {/* Class number badge — min-width so 1–100 all fit cleanly */}
                            <span
                                className="absolute -bottom-1.5 -right-1.5 z-20 min-w-[22px] h-[22px] px-1 rounded-full bg-white border text-[10px] font-black flex items-center justify-center shadow-sm leading-none"
                                style={{ borderColor: completed ? '#059669' : '#E5E7EB', color: completed ? '#059669' : '#6B7280' }}
                            >
                                {clazz.class_number}
                            </span>
                        </motion.button>

                        {/* Label under node */}
                        <div className="mt-1.5 max-w-[150px] text-center">
                            <p className={`text-[11px] font-semibold leading-tight line-clamp-2 ${unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                                {clazz.title}
                            </p>
                            {completed && (
                                <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-px rounded-full ${mastered ? 'bg-amber-400/15 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                    {score}%
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

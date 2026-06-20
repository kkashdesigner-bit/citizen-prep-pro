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

    // Find the active class index
    const activeIndex = useMemo(() => {
        if (!nextClassId) return classes.length;
        const idx = classes.findIndex(c => c.id === nextClassId);
        return idx === -1 ? classes.length : idx;
    }, [classes, nextClassId]);

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

    // Progressive active path winding up to the active index node
    const activePathD = useMemo(() => {
        if (classes.length < 2 || activeIndex <= 0) return '';
        const activeClasses = classes.slice(0, activeIndex + 1);
        const pts = activeClasses.map((_, i) => ({ x: xOffset(i), y: i * ROW_H + NODE / 2 + 8 }));
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const cur = pts[i];
            const midY = (prev.y + cur.y) / 2;
            d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
        }
        return d;
    }, [classes, activeIndex]);

    return (
        <div className="relative mx-auto" style={{ width: Math.min(360, AMP * 2 + NODE + 120), height }}>
            {/* 3D Connector Path */}
            <svg
                className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
                width={AMP * 2 + NODE}
                height={height - 56}
                viewBox={`${-(AMP + NODE / 2)} 0 ${AMP * 2 + NODE} ${height}`}
                aria-hidden="true"
            >
                {/* 3D Border / Depth shadow */}
                <path d={pathD} fill="none" stroke="var(--dash-card-border)" strokeWidth="16" strokeLinecap="round" />
                {/* Base Locked Track */}
                <path d={pathD} fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
                
                {/* Progressive Active Track */}
                {activePathD && (
                    <>
                        <path d={activePathD} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
                        <path d={activePathD} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" strokeOpacity="0.5" />
                    </>
                )}
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
                        {/* "Commencer" bubble with Gaby mascot cropped avatar */}
                        {isNext && unlocked && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: [0, -5, 0] }}
                                transition={{ y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
                                className="absolute -top-11 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white border-2 text-[10px] font-black uppercase tracking-wider shadow-lg whitespace-nowrap"
                                style={{ borderColor: color, color }}
                            >
                                <div 
                                    className="w-5 h-5 rounded-full border border-gray-100 bg-cover bg-no-repeat shrink-0"
                                    style={{ 
                                        backgroundImage: "url('/examen-civique-parcours-progression-desktop.jpg')",
                                        backgroundPosition: '14% 30%',
                                        backgroundSize: '240% auto'
                                    }}
                                />
                                <span>Commencer</span>
                                <span
                                    className="absolute left-1/2 -bottom-[7px] -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-b-2 border-r-2"
                                    style={{ borderColor: color }}
                                />
                            </motion.div>
                        )}

                        {/* Node button - 3D Glassmorphic Spheres */}
                        <motion.button
                            type="button"
                            whileHover={unlocked ? { scale: 1.08 } : {}}
                            whileTap={unlocked ? { scale: 0.92 } : {}}
                            onClick={() => onClassClick(clazz)}
                            aria-label={`Classe ${clazz.class_number} : ${clazz.title}`}
                            className={`relative z-10 flex items-center justify-center rounded-full border-b-4 transition-all duration-300 ${
                                unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                            } ${
                                completed 
                                ? 'bg-gradient-to-tr from-[#047857] via-[#059669] to-[#10B981] border-[#047857] shadow-[inset_0_4px_12px_rgba(255,255,255,0.45),_0_6px_12px_rgba(4,120,87,0.25),_inset_0_-4px_8px_rgba(0,0,0,0.15)] text-white' 
                                : isNext && unlocked 
                                ? 'border-[rgba(0,0,0,0.25)] shadow-[inset_0_4px_12px_rgba(255,255,255,0.4),_inset_0_-4px_8px_rgba(0,0,0,0.2)] text-white animate-pulse-subtle' 
                                : unlocked 
                                ? 'bg-gradient-to-tr from-[#F3F4F6] via-white to-[#F9FAFB] border-[#D1D5DB] shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),_0_4px_8px_rgba(0,0,0,0.05),_inset_0_-3px_6px_rgba(0,0,0,0.05)]' 
                                : 'bg-gradient-to-tr from-[#E5E7EB] to-[#F9FAFB] border-[#E5E7EB] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_4px_rgba(0,0,0,0.05)] text-gray-300'
                            }`}
                            style={{
                                width: NODE,
                                height: NODE,
                                ...(isNext && unlocked ? { 
                                    background: `linear-gradient(135deg, ${color}dd, ${color}, ${color}ff)`,
                                    boxShadow: `inset 0 4px 12px rgba(255,255,255,0.45), 0 0 0 6px ${color}22, 0 8px 20px ${color}66, inset 0 -4px 8px rgba(0,0,0,0.2)`
                                } : {})
                            }}
                        >
                            {isNext && unlocked && (
                                <span
                                    className="absolute inset-0 rounded-full animate-ping opacity-25"
                                    style={{ background: color }}
                                />
                            )}
                            {/* Gloss sheen overlay */}
                            <div className="absolute top-[2%] left-[5%] w-[90%] h-[45%] rounded-t-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

                            {completed ? (
                                mastered ? <Crown className="w-7 h-7 text-amber-300 fill-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" /> : <Check className="w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" strokeWidth={4} />
                            ) : !unlocked ? (
                                <Lock className="w-6 h-6 text-gray-300" />
                            ) : isNext ? (
                                <Play className="w-7 h-7 text-white fill-white ml-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" />
                            ) : (
                                <Star className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" style={{ color }} />
                            )}

                            {/* Class number badge — 3D bubble style */}
                            <span
                                className={`absolute -bottom-1.5 -right-1.5 z-20 min-w-[22px] h-[22px] px-1.5 rounded-full border text-[10px] font-black flex items-center justify-center shadow-md leading-none ${
                                    completed 
                                    ? 'bg-[#059669] border-[#047857] text-white' 
                                    : 'bg-white border-gray-200 text-gray-600'
                                }`}
                            >
                                {clazz.class_number}
                            </span>
                        </motion.button>

                        {/* Label under node */}
                        <div className="mt-2.5 max-w-[150px] text-center">
                            <p className={`text-[11px] font-bold leading-tight line-clamp-2 ${unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                                {clazz.title}
                            </p>
                            {completed && (
                                <span className={`inline-block mt-1 text-[10px] font-extrabold px-1.5 py-px rounded-full ${mastered ? 'bg-amber-400/15 text-amber-600 border border-amber-400/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
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

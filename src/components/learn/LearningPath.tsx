import React from 'react';
import { Check, Lock, Play, Flag, BookOpen, Landmark, Landmark as Gov, HeartHandshake, History, FileText, Component } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PathNodeData {
    id: string;
    category: string;
    totalLessons: number;
    completedLessons: number;
    status: 'locked' | 'active' | 'completed';
}

interface LearningPathProps {
    nodes: PathNodeData[];
    onNodeClick: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'Principles': Flag,
    'Institutions': Gov,
    'Rights': FileText,
    'History': History,
    'Living': HeartHandshake,
    'Politics': Landmark,
    'Society': Component,
};

export default function LearningPath({ nodes, onNodeClick }: LearningPathProps) {
    return (
        <div className="flex flex-col items-center py-8 relative w-full max-w-lg mx-auto overflow-hidden">

            {/* Header */}
            <div className="w-full mb-12 text-center md:text-left">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                    Unit 1: Foundations of Liberty
                </h2>
                <p className="text-muted-foreground">
                    Master the history and principles that built the nation.
                </p>
            </div>

            <div className="relative flex flex-col items-center w-full">
                {nodes.map((node, index) => {
                    const isLast = index === nodes.length - 1;
                    const Icon = CATEGORY_ICONS[node.category] || BookOpen;

                    let nodeColor = 'bg-muted border-border';
                    let iconColor = 'text-muted-foreground/50';

                    if (node.status === 'completed') {
                        nodeColor = 'bg-[hsl(145,60%,45%)] border-[hsl(145,60%,45%)] shadow-[0_4px_0_hsl(145,60%,35%)]';
                        iconColor = 'text-white';
                    } else if (node.status === 'active') {
                        nodeColor = 'bg-[hsl(145,60%,45%)] border-white border-4 shadow-[0_6px_0_hsl(145,60%,35%),_0_0_30px_hsl(145,60%,45%/0.4)]';
                        iconColor = 'text-white';
                    } else {
                        nodeColor = 'bg-card border-border border-4 shadow-[0_4px_0_hsl(var(--muted))]';
                        iconColor = 'text-muted-foreground/40';
                    }

                    // Winding path offset
                    const offset = index % 2 === 1 ? 'translate-x-6' : '-translate-x-6';

                    return (
                        <div key={node.id} className="relative flex flex-col items-center group cursor-pointer" onClick={() => onNodeClick(node.category)}>

                            {/* Connecting line to the next node */}
                            {!isLast && (
                                <div
                                    className={`absolute top-16 w-1.5 h-20 -z-10 ${offset}`}
                                    style={{
                                        backgroundColor: node.status === 'completed' && nodes[index + 1].status !== 'locked'
                                            ? 'hsl(145, 60%, 45%)'
                                            : 'hsl(var(--border))'
                                    }}
                                />
                            )}

                            {/* The Node Button */}
                            <div className={`relative z-10 my-4 transition-transform group-hover:scale-105 group-active:scale-95 duration-200 ${offset}`}>
                                {/* Active node glow */}
                                {node.status === 'active' && (
                                    <div className="absolute -inset-8 bg-[hsl(145,60%,45%)]/20 rounded-full blur-2xl -z-10 animate-pulse" />
                                )}

                                {/* Progress Ring for Active */}
                                {node.status === 'active' && (
                                    <svg className="absolute -inset-3 w-24 h-24 -z-10 -rotate-90">
                                        <circle cx="48" cy="48" r="44" stroke="hsl(var(--border))" strokeWidth="4" fill="none" />
                                        <circle cx="48" cy="48" r="44" stroke="hsl(145,60%,45%)" strokeWidth="4" fill="none" strokeDasharray="276" strokeDashoffset={276 - (node.completedLessons / node.totalLessons) * 276} strokeLinecap="round" className="transition-all duration-1000" />
                                    </svg>
                                )}

                                {/* The Circle */}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${nodeColor} ${node.status === 'locked' ? 'opacity-70 grayscale' : ''}`}>
                                    {node.status === 'completed' ? (
                                        <Check className="h-8 w-8 text-white" strokeWidth={3} />
                                    ) : node.status === 'locked' ? (
                                        <Lock className="h-6 w-6 text-muted-foreground/40" />
                                    ) : (
                                        <Icon className="h-8 w-8 text-white drop-shadow-sm" strokeWidth={2.5} />
                                    )}
                                </div>

                                {/* Active Tooltip / Label */}
                                {node.status === 'active' && (
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[hsl(145,60%,45%)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                                        Start
                                    </div>
                                )}
                                {node.status === 'completed' && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[hsl(145,60%,45%)] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm z-20 border border-[hsl(145,60%,35%)] whitespace-nowrap">
                                        Completed
                                    </div>
                                )}
                            </div>

                            {/* Node Title */}
                            <div className={`text-center mt-2 mb-8 transition-opacity duration-300 ${offset}`}>
                                <h3 className={`font-bold text-sm tracking-tight ${node.status === 'active' ? 'text-[hsl(145,60%,45%)] text-base' : node.status === 'locked' ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                                    {node.category}
                                </h3>
                                {node.status === 'active' && (
                                    <p className="text-xs text-muted-foreground font-medium mt-1">
                                        {node.completedLessons}/{node.totalLessons} Lessons
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Final Boss / Review Node */}
                <div className="mt-8 relative group cursor-pointer" onClick={() => onNodeClick('Review')}>
                    <div className="w-24 h-20 rounded-2xl border-4 border-dashed border-[hsl(40,80%,60%)] bg-[hsl(40,80%,60%)]/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <span className="text-3xl">🧰</span>
                    </div>
                    <p className="text-center font-bold text-[hsl(40,80%,60%)] text-xs uppercase tracking-widest mt-4">Unit Review</p>
                </div>

            </div>
        </div>
    );
}

import { Flame, Star } from 'lucide-react';

interface LeftColumnProps {
    xp: number;
    streak: number;
    dailyGoalProgress: number; // 0 to 100
}

export default function DashboardLeftColumn({ xp, streak, dailyGoalProgress }: LeftColumnProps) {
    return (
        <div className="w-full flex flex-col gap-6">

            {/* Daily Goal Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-foreground">Daily Goal</h3>
                    <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">XP: {Math.min(xp, 50)}/50</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[hsl(40,80%,60%)]/20 flex flex-shrink-0 items-center justify-center">
                        <Flame className="h-6 w-6 text-[hsl(40,80%,60%)]" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground leading-tight">Keep it up!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">You're on a roll.</p>
                    </div>
                </div>
                <div className="mt-4 h-2 w-full bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[hsl(40,80%,60%)] rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(Math.max((xp / 50) * 100, 5), 100)}%` }}
                    />
                </div>
            </div>

            {/* Silver League Snippet */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-foreground">Silver League</h3>
                    <button className="text-xs font-bold text-[hsl(var(--success))] hover:underline tracking-wider uppercase">View all</button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-[hsl(var(--success))] w-4 text-center">1</span>
                            <div className="h-8 w-8 rounded-full bg-[hsl(var(--success))] text-white flex items-center justify-center text-xs font-bold">ME</div>
                            <span className="text-sm font-semibold text-foreground">You</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{xp} XP</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-4 text-center">2</span>
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" className="h-full w-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-foreground">Sarah M.</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">1100 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-4 text-center">3</span>
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John" className="h-full w-full object-cover" />
                            </div>
                            <span className="text-sm font-medium text-foreground">John D.</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">980 XP</span>
                    </div>
                </div>
            </div>

            {/* Weekly Challenge */}
            <div className="rounded-2xl bg-gradient-to-br from-[hsl(263,84%,58%)] to-[hsl(239,84%,67%)] p-5 shadow-sm text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h3 className="font-bold text-lg mb-2 relative z-10">Weekly Challenge</h3>
                <p className="text-sm text-white/90 mb-5 relative z-10">
                    Complete 3 hard lessons without errors.
                </p>
                <button className="w-full bg-white text-[hsl(263,84%,58%)] font-bold py-2.5 rounded-xl hover:bg-white/95 transition-colors shadow-sm relative z-10">
                    Accept Challenge
                </button>
            </div>

        </div>
    );
}

/**
 * Reusable 3D floating miniature icon with emoji.
 * Extracted from LandingCategoryTabs for use across the app.
 */

interface MiniatureIconProps {
    emoji: string;
    gradient: string;
    shadow?: string;
    /** sm = 48px, md = 64px (default), lg = 80px */
    size?: 'sm' | 'md' | 'lg';
    /** Animation delay in seconds */
    delay?: number;
}

const SIZE_MAP = {
    sm: { outer: 'w-14 h-14', inner: 'w-10 h-10', text: 'text-xl', platform: 'w-10 h-2' },
    md: { outer: 'w-20 h-20', inner: 'w-14 h-14', text: 'text-2xl', platform: 'w-12 h-2' },
    lg: { outer: 'w-28 h-28', inner: 'w-20 h-20', text: 'text-4xl', platform: 'w-16 h-3' },
};

export default function MiniatureIcon({
    emoji,
    gradient,
    shadow = 'shadow-blue-500/30',
    size = 'md',
    delay = 0,
}: MiniatureIconProps) {
    const s = SIZE_MAP[size];

    return (
        <div className={`relative ${s.outer}`} style={{ perspective: '400px' }}>
            {/* Floating platform shadow */}
            <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${s.platform} rounded-[50%] bg-black/10 blur-sm`}
                style={{
                    animation: 'platform-pulse 3s ease-in-out infinite',
                    animationDelay: `${delay}s`,
                }}
            />

            {/* 3D rotating mini-object */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    animation: `float-bob 4s ease-in-out infinite, gentle-rotate 8s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Main 3D cube/shape */}
                <div
                    className={`relative ${s.inner} rounded-2xl bg-gradient-to-br ${gradient} ${shadow} shadow-xl`}
                    style={{
                        transform: 'rotateX(15deg) rotateY(-15deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Top face depth illusion */}
                    <div
                        className="absolute inset-0 rounded-2xl opacity-30"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)',
                        }}
                    />

                    {/* Side-face illusion (right) */}
                    <div
                        className="absolute top-1 -right-1 w-2 h-full rounded-r-lg opacity-40"
                        style={{
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))',
                            transform: 'skewY(-10deg)',
                        }}
                    />

                    {/* Bottom-face illusion */}
                    <div
                        className="absolute -bottom-1 left-1 w-full h-2 rounded-b-lg opacity-30"
                        style={{
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.15), rgba(0,0,0,0.3))',
                            transform: 'skewX(-10deg)',
                        }}
                    />

                    {/* Emoji centered on face */}
                    <div className={`absolute inset-0 flex items-center justify-center ${s.text} drop-shadow-lg`}>
                        {emoji}
                    </div>

                    {/* Shine sweep animation */}
                    <div
                        className="absolute inset-0 rounded-2xl overflow-hidden"
                        style={{ transform: 'translateZ(1px)' }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 55%)',
                                animation: 'shine-sweep 4s ease-in-out infinite',
                                animationDelay: `${delay + 1}s`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

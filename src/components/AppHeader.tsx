import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSubscription } from '@/hooks/useSubscription';
import {
    LogOut, User, BarChart3, Settings, Crown, Sparkles, ChevronLeft, Flame,
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ReactNode } from 'react';
import Logo from '@/components/Logo';

interface AppHeaderProps {
    pageTitle: string;
    pageIcon?: ReactNode;
    backTo?: string;
    backLabel?: string;
}

export default function AppHeader({ pageTitle, pageIcon, backTo = '/learn', backLabel = 'Tableau de bord' }: AppHeaderProps) {
    const { user, displayName, avatarUrl, signOut } = useAuth();
    const { profile: userProfile } = useUserProfile();
    const { tier, isPremium, isStandardOrAbove } = useSubscription();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const finalDisplayName = userProfile?.first_name || displayName || user?.email?.split('@')[0] || '';
    const finalAvatarUrl = userProfile?.avatar_url || avatarUrl;

    const initials = finalDisplayName
        ? finalDisplayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const tierConfig = isPremium
        ? { label: 'Premium', icon: <Crown className="h-3 w-3" />, color: 'bg-amber-100 text-amber-700 border-amber-200' }
        : isStandardOrAbove
            ? { label: 'Standard', icon: <Sparkles className="h-3 w-3" />, color: 'bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20' }
            : { label: 'Gratuit', icon: null, color: 'bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20' };

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">

                {/* ─── LEFT — Logo + Back ─── */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {/* Logo — hidden on mobile to save space */}
                    <button
                        onClick={() => navigate('/')}
                        className="hidden sm:block shrink-0"
                    >
                        <Logo size="sm" />
                    </button>

                    <div className="hidden sm:block h-6 w-px bg-slate-200" />

                    <button
                        onClick={() => navigate(backTo)}
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">{backLabel}</span>
                    </button>
                </div>

                {/* ─── CENTER — Page Title ─── */}
                <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                    {pageIcon && <span className="text-[#135bec]">{pageIcon}</span>}
                    <h1 className="text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap">{pageTitle}</h1>
                </div>

                {/* ─── RIGHT — Streak + Tier + Avatar ─── */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Streak counter */}
                    <div className="hidden sm:flex items-center gap-1 text-sm font-bold text-orange-500">
                        <Flame className="h-4 w-4 fill-orange-500" />
                        <span>0</span>
                    </div>

                    {/* Tier badge */}
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${tierConfig.color}`}>
                        {tierConfig.icon}
                        {tierConfig.label}
                    </span>

                    {/* Avatar dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="relative rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none">
                                <Avatar className="h-8 w-8">
                                    {finalAvatarUrl && <AvatarImage src={finalAvatarUrl} alt={finalDisplayName} />}
                                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-semibold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Mobile streak badge on avatar */}
                                <span className="sm:hidden absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white text-[8px] font-bold ring-2 ring-white">
                                    <Flame className="h-2.5 w-2.5 fill-white" />
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 bg-white border shadow-lg rounded-xl">
                            <div className="px-3 py-2">
                                <p className="text-sm font-medium text-slate-900 truncate">{finalDisplayName}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierConfig.color}`}>
                                    {tierConfig.icon} {tierConfig.label}
                                </span>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/learn')}>
                                <User className="mr-2 h-4 w-4" /> Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/progress')}>
                                <BarChart3 className="mr-2 h-4 w-4" /> Progression
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate('/learn')}>
                                <Settings className="mr-2 h-4 w-4" /> Paramètres
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

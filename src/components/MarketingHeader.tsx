import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserProfile, GOAL_LABELS } from '@/hooks/useUserProfile';
import { LANGUAGES, Language } from '@/lib/types';
import {
    Globe, LogOut, User, LayoutDashboard, Menu, X, Settings, Crown, Sparkles,
    ClipboardCheck, BookOpen, Tag, ChevronRight,
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MarketingHeader() {
    const { language, setLanguage, t } = useLanguage();
    const { user, displayName, avatarUrl, signOut } = useAuth();
    const { isStandardOrAbove, isPremium } = useSubscription();
    const { profile: userProfile } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleSignOut = async () => {
        setMobileMenuOpen(false);
        await signOut();
        navigate('/');
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        if (location.pathname === '/') {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${id}`);
        }
    };

    const initials = displayName
        ? displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.slice(0, 2).toUpperCase() || '??';

    const tierBadge = isPremium
        ? { label: 'Premium', icon: <Crown className="h-3 w-3" />, color: 'bg-amber-100 text-amber-700 border-amber-200' }
        : isStandardOrAbove
            ? { label: 'Standard', icon: <Sparkles className="h-3 w-3" />, color: 'bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20' }
            : null;

    const goalLabel = userProfile?.goal_type ? GOAL_LABELS[userProfile.goal_type] : null;

    const navLinks = [
        { label: t('nav.exam'), id: 'exam-decoder', Icon: ClipboardCheck },
        { label: t('nav.howItWorks'), id: 'how-it-works', Icon: BookOpen },
        { label: t('nav.pricing'), id: 'pricing', Icon: Tag },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-slate-200/60'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="container flex h-16 items-center justify-between">
                {/* ─── LEFT — Logo ─── */}
                <Link
                    to="/"
                    className="flex items-center shrink-0"
                    onClick={(e) => {
                        if (location.pathname === '/') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                >
                    <Logo size="sm" />
                </Link>

                {/* ─── CENTER — Desktop Nav ─── */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => scrollToSection(link.id)}
                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled
                                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                {/* ─── RIGHT — Desktop Actions ─── */}
                <div className="hidden md:flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label={t('nav.language')}
                                className={`p-2 rounded-lg transition-colors text-sm font-medium ${scrolled ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-600 hover:bg-white/40'}`}
                            >
                                <Globe className="h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border shadow-lg rounded-xl">
                            {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                                <DropdownMenuItem
                                    key={code}
                                    onClick={() => setLanguage(code)}
                                    className={language === code ? 'bg-primary text-white focus:bg-primary focus:text-white' : ''}
                                >
                                    {name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <>
                            {tierBadge && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierBadge.color}`}>
                                    {tierBadge.icon}
                                    {tierBadge.label}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-slate-900"
                                onClick={() => navigate('/learn')}
                            >
                                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                {t('nav.dashboard')}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button aria-label={t('nav.account')} className="ml-1 rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none">
                                        <Avatar className="h-8 w-8">
                                            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ''} />}
                                            <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg rounded-xl">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate('/learn')}>
                                        <User className="mr-2 h-4 w-4" /> {t('nav.profile')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                                        <Settings className="mr-2 h-4 w-4" /> {t('nav.settings')}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" /> {t('nav.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`font-medium ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-700'}`}
                                onClick={() => navigate('/auth')}
                            >
                                {t('nav.loginButton')}
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]"
                                onClick={() => navigate('/auth')}
                            >
                                {t('nav.freeTrial')}
                            </Button>
                        </>
                    )}
                </div>

                {/* ─── MOBILE — Right Controls ─── */}
                <div className="flex md:hidden items-center gap-1.5">
                    {!user && (
                        <Button
                            size="sm"
                            className="bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-4 text-xs shadow-md"
                            onClick={() => navigate('/auth')}
                        >
                            {t('nav.freeTrial')}
                        </Button>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-700 hover:bg-white/40'}`}
                        aria-label="Menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* ─── MOBILE — Bottom Sheet ─── */}
            {mobileMenuOpen && isMobile && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Sheet */}
                    <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
                        <div className="bg-white rounded-t-[28px] shadow-[0_-14px_50px_rgba(15,40,80,.18)] overflow-hidden flex flex-col max-h-[85vh]">

                            {/* Blue branded header */}
                            <div className="bg-[hsl(209,100%,32%)] px-[22px] pt-[22px] pb-5 text-white flex-none">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-[9px]">
                                        <span className="w-7 h-7 rounded-[8px] overflow-hidden flex shadow-[0_1px_3px_rgba(0,0,0,.25)] flex-none">
                                            <i className="flex-1 bg-white not-italic" />
                                            <i className="flex-1 bg-white/55 not-italic" />
                                            <i className="flex-1 bg-[hsl(4,85%,57%)] not-italic" />
                                        </span>
                                        <span className="font-bold text-[18px] tracking-[-0.02em]">GoCivique</span>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-white/90 hover:text-white transition-colors p-1"
                                        aria-label="Fermer le menu"
                                    >
                                        <X className="h-[22px] w-[22px]" />
                                    </button>
                                </div>

                                {user ? (
                                    <div className="flex items-center gap-[13px] mt-5">
                                        <Avatar className="h-[52px] w-[52px] flex-none border-[2.5px] border-white/40">
                                            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ''} />}
                                            <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-[17px] truncate">{displayName}</div>
                                            {goalLabel && (
                                                <div className="text-[13px] opacity-80 mt-0.5 truncate">Parcours {goalLabel}</div>
                                            )}
                                        </div>
                                        {tierBadge && (
                                            <span className="px-[11px] py-[5px] rounded-full bg-white/20 font-semibold text-[11.5px] flex-none">
                                                {tierBadge.label}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mt-5">
                                        <div className="flex-1">
                                            <div className="font-bold text-[17px]">Bienvenue</div>
                                            <div className="text-[13px] opacity-80 mt-0.5">Commencez sans risque</div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-white text-[hsl(209,100%,32%)] hover:bg-white/90 font-bold rounded-full px-4 flex-none"
                                            onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                        >
                                            {t('nav.freeTrial')}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Scrollable body */}
                            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                                <div className="px-4 pt-3.5">
                                    {/* Dashboard featured block */}
                                    {user && (
                                        <button
                                            onClick={() => { navigate('/learn'); setMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-[14px] p-4 rounded-[18px] bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-[0.985] transition-all mb-3.5"
                                        >
                                            <span className="w-11 h-11 rounded-[13px] bg-[hsl(209,100%,32%)] flex items-center justify-center shadow-[0_6px_14px_hsl(209,100%,32%/.30)] flex-none">
                                                <LayoutDashboard className="text-white h-[23px] w-[23px]" strokeWidth={1.9} />
                                            </span>
                                            <span className="flex-1 text-left">
                                                <span className="block font-bold text-[16px] text-slate-900">{t('nav.dashboard')}</span>
                                                <span className="block text-[12.5px] text-slate-400 mt-0.5">Votre espace personnel</span>
                                            </span>
                                            <ChevronRight className="text-[hsl(209,100%,32%)] h-5 w-5 flex-none" strokeWidth={2.2} />
                                        </button>
                                    )}

                                    {/* Nav links */}
                                    <div className="flex flex-col">
                                        {navLinks.map(({ label, id, Icon }) => (
                                            <button
                                                key={id}
                                                onClick={() => scrollToSection(id)}
                                                className="flex items-center gap-[15px] px-3 py-[15px] rounded-[14px] hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                            >
                                                <Icon className="h-[23px] w-[23px] text-slate-500 flex-none" strokeWidth={1.8} />
                                                <span className="flex-1 text-left font-semibold text-[18px] text-slate-900 tracking-tight">{label}</span>
                                            </button>
                                        ))}

                                        {user && (
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-[15px] px-3 py-[15px] rounded-[14px] hover:bg-red-50 active:bg-red-100 transition-colors"
                                            >
                                                <LogOut className="h-[23px] w-[23px] text-red-400 flex-none" strokeWidth={1.8} />
                                                <span className="flex-1 text-left font-semibold text-[18px] text-red-500 tracking-tight">{t('nav.logout')}</span>
                                            </button>
                                        )}

                                        {!user && (
                                            <button
                                                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                                className="flex items-center gap-[15px] px-3 py-[15px] rounded-[14px] hover:bg-slate-50 transition-colors"
                                            >
                                                <User className="h-[23px] w-[23px] text-slate-500 flex-none" strokeWidth={1.8} />
                                                <span className="flex-1 text-left font-semibold text-[18px] text-slate-900 tracking-tight">{t('nav.loginButton')}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1" />

                                {/* Language footer */}
                                <div className="px-[18px] pt-4 pb-6 bg-slate-50 border-t border-slate-200 mt-3.5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Globe className="h-4 w-4 text-slate-400 flex-none" strokeWidth={1.8} />
                                        <span className="text-[11px] font-semibold tracking-[.10em] text-slate-400 uppercase">Langue</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                                            <button
                                                key={code}
                                                onClick={() => { setLanguage(code); setMobileMenuOpen(false); }}
                                                className={`px-[15px] py-2 rounded-[11px] text-[13px] transition-all ${
                                                    language === code
                                                        ? 'bg-[hsl(209,100%,32%)] text-white font-semibold shadow-[0_4px_10px_hsl(209,100%,32%/.25)]'
                                                        : 'bg-white border border-slate-200 text-slate-500 font-medium hover:border-slate-300'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { LANGUAGES, Language } from '@/lib/types';
import {
    Globe, LogOut, User, LayoutDashboard, Menu, X, BarChart3, Settings, Crown, Sparkles,
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
    const { tier, isStandardOrAbove, isPremium } = useSubscription();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useIsMobile();

    // Scroll listener for transparent → solid transition
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on navigation
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleSignOut = async () => {
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

    const navLinks = [
        { label: 'Comment ça marche', id: 'practice' },
        { label: 'Fonctionnalités', id: 'modes' },
        { label: 'Tarifs', id: 'pricing' },
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
                    {/* Language selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={`p-2 rounded-lg transition-colors text-sm font-medium ${scrolled ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-600 hover:bg-white/40'
                                }`}>
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
                            {/* Tier Badge */}
                            {tierBadge && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierBadge.color}`}>
                                    {tierBadge.icon}
                                    {tierBadge.label}
                                </span>
                            )}

                            {/* Dashboard shortcut */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-slate-900"
                                onClick={() => navigate('/learn')}
                            >
                                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                Tableau de bord
                            </Button>

                            {/* Avatar dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="ml-1 rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none">
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
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`font-medium ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-700'}`}
                                onClick={() => navigate('/auth')}
                            >
                                Se connecter
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]"
                                onClick={() => navigate('/auth')}
                            >
                                Essai Gratuit
                            </Button>
                        </>
                    )}
                </div>

                {/* ─── MOBILE — Right Controls ─── */}
                <div className="flex md:hidden items-center gap-1.5">
                    {/* Compact CTA for non-registered only */}
                    {!user && (
                        <Button
                            size="sm"
                            className="bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-4 text-xs shadow-md"
                            onClick={() => navigate('/auth')}
                        >
                            Essai Gratuit
                        </Button>
                    )}

                    {/* Avatar for logged-in users */}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none">
                                    <Avatar className="h-7 w-7">
                                        {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName || ''} />}
                                        <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg rounded-xl">
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                                    {tierBadge && (
                                        <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierBadge.color}`}>
                                            {tierBadge.icon} {tierBadge.label}
                                        </span>
                                    )}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/learn')}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" /> Tableau de bord
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/progress')}>
                                    <BarChart3 className="mr-2 h-4 w-4" /> Progression
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-700 hover:bg-white/40'}`}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* ─── MOBILE — Full-screen Overlay ─── */}
            {mobileMenuOpen && isMobile && (
                <div className="md:hidden fixed inset-0 top-16 z-40 bg-white/98 backdrop-blur-xl animate-fade-in">
                    <nav className="flex flex-col h-full">
                        {/* Nav Links */}
                        <div className="flex-1 px-6 pt-6 space-y-1">
                            {navLinks.map(link => (
                                <button
                                    key={link.id}
                                    onClick={() => scrollToSection(link.id)}
                                    className="w-full text-left px-4 py-3.5 text-lg font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}

                            {user && (
                                <button
                                    onClick={() => { navigate('/learn'); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3.5 text-lg font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <LayoutDashboard className="h-5 w-5 text-blue-600" />
                                    Tableau de bord
                                </button>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="px-6 pb-8 space-y-3 border-t border-slate-100 pt-4">
                            {!user && (
                                <>
                                    <Button
                                        className="w-full bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-xl py-6 text-base shadow-lg"
                                        onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    >
                                        Commencer l'essai gratuit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl py-5 text-base font-medium border-slate-200"
                                        onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                                    >
                                        Se connecter
                                    </Button>
                                </>
                            )}

                            {/* Language selector */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                                    <button
                                        key={code}
                                        onClick={() => { setLanguage(code); setMobileMenuOpen(false); }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === code
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-100'
                                            }`}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

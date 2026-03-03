import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('gc-theme') === 'dark' ||
                (!localStorage.getItem('gc-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('gc-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('gc-theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="relative h-9 w-9 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] flex items-center justify-center hover:bg-[var(--dash-card-border)] transition-all"
            aria-label="Basculer le thème"
        >
            <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                {isDark ? (
                    <Moon className="h-4 w-4 text-blue-400" />
                ) : (
                    <Sun className="h-4 w-4 text-amber-500" />
                )}
            </motion.div>
        </button>
    );
}

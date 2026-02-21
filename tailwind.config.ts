import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0)' },
					'50%': { boxShadow: '0 0 20px 4px hsl(var(--primary) / 0.35)' }
				},
				'grow-bar': {
					'0%': { transform: 'scaleY(0)' },
					'100%': { transform: 'scaleY(1)' }
				},
				'shimmer': {
					'0%': { opacity: '0.5', transform: 'scale(0.95)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'100%': { opacity: '0.5', transform: 'scale(0.95)' }
				},
				'draw-up': {
					'0%': { transform: 'translateY(8px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'confetti-fall': {
					'0%': {
						transform: 'translateY(0) translateX(0) rotate(0deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateY(400px) translateX(var(--confetti-drift, 20px)) rotate(var(--confetti-rotation, 360deg))',
						opacity: '0'
					}
				},
				'hero-sway': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'heartbeat': {
					'0%, 100%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.04)' },
					'50%': { transform: 'scale(1)' },
					'75%': { transform: 'scale(1.02)' }
				},
				'glitch': {
					'0%': { transform: 'translateX(0)', opacity: '1' },
					'10%': { transform: 'translateX(-3px)', opacity: '0.8' },
					'20%': { transform: 'translateX(3px)', opacity: '0.9' },
					'30%': { transform: 'translateX(-2px)', opacity: '0.7' },
					'40%': { transform: 'translateX(2px)', opacity: '1' },
					'50%': { transform: 'translateX(-1px)', opacity: '0.85' },
					'60%': { transform: 'translateX(1px)', opacity: '0.95' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'warp-in': {
					'0%': { transform: 'translateX(60px)', opacity: '0', filter: 'blur(4px)' },
					'100%': { transform: 'translateX(0)', opacity: '1', filter: 'blur(0)' }
				},
				'warp-out': {
					'0%': { transform: 'translateX(0)', opacity: '1', filter: 'blur(0)' },
					'100%': { transform: 'translateX(-60px)', opacity: '0', filter: 'blur(4px)' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 10px 0 hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 30px 8px hsl(var(--primary) / 0.5)' }
				},
				'shine': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'letter-pop': {
					'0%': { opacity: '0', transform: 'translateY(12px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out',
				'grow-bar': 'grow-bar 0.8s ease-out forwards',
				'shimmer': 'shimmer 2.5s ease-in-out infinite',
				'draw-up': 'draw-up 0.6s ease-out forwards',
				'confetti-fall': 'confetti-fall 4s ease-in-out infinite',
				'hero-sway': 'hero-sway 3.5s ease-in-out infinite',
				'heartbeat': 'heartbeat 0.6s ease-in-out',
				'glitch': 'glitch 0.4s ease-in-out',
				'warp-in': 'warp-in 0.25s ease-out forwards',
				'warp-out': 'warp-out 0.2s ease-in forwards',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'shine': 'shine 2.5s ease-in-out infinite',
				'letter-pop': 'letter-pop 0.4s ease-out forwards',
				'gradient-shift': 'gradient-shift 6s ease infinite'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
				serif: ['Inter', 'ui-serif', 'Georgia', 'serif'],
				mono: ['Inter', 'ui-monospace', 'monospace'],
			},
			boxShadow: {
				'2xs': 'var(--shadow-2xs)',
				xs: 'var(--shadow-xs)',
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

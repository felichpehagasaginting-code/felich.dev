import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'Inter', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-strong, var(--brand))',
          light: 'var(--brand)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          strong: 'var(--brand-strong, var(--brand))',
          contrast: 'var(--brand-contrast, var(--bg-base))',
          bg: 'var(--brand-bg, transparent)',
        },
        surface: {
          base: 'var(--bg-base)',
          card: 'var(--bg-surface)',
          muted: 'var(--bg-muted)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        line: 'var(--border-default)',
      },
      borderRadius: {
        'arch-sm': '4px',
        'arch-md': '6px',
        'arch-lg': '8px',
      },
      boxShadow: {
        'arch': '0 4px 12px rgba(0,0,0,0.05)',
        'arch-hover': '0 8px 24px rgba(0,0,0,0.08)',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
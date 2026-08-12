/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        shifa: {
          dark: 'var(--shifa-dark)',
          blue: 'var(--shifa-blue)',
          cyan: 'var(--shifa-cyan)',
          mid: 'var(--shifa-mid)',
          light: 'var(--shifa-light)',
          purple: 'var(--shifa-purple)',
          green: 'var(--shifa-green)',
          amber: 'var(--shifa-amber)',
          red: 'var(--shifa-red)',
          gray: 'var(--shifa-gray)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
        '3xl': 'calc(var(--radius) + 16px)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        shifa: '0 4px 24px rgba(0, 102, 255, 0.12), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'shifa-lg': '0 8px 40px rgba(0, 102, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'shifa-xl': '0 16px 60px rgba(0, 102, 255, 0.22), 0 4px 16px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
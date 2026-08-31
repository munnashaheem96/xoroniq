/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0A0A0C",
        "surface-card": "#111115",
        "surface-elevated": "#18181D",
        "xoroniq-red": "#E50914",
        "xoroniq-red-glow": "rgba(229, 9, 20, 0.4)",
        "titanium": "#8E8E93",
        "platinum": "#F5F5F7",
        "border-dark": "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"SF Mono"', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow-red': '0 0 30px rgba(229, 9, 20, 0.25)',
        'glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

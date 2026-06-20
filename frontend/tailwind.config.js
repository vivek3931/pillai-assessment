/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'ink-deep': '#090909',
        canvas: '#ffffff',
        'surface-soft': '#fafafa',
        'surface-dark': '#171717',
        hairline: '#e5e5e5',
        'hairline-strong': '#d4d4d4',
        ink: '#000000',
        charcoal: '#525252',
        body: '#737373',
        mute: '#a3a3a3',
        'on-dark': '#ffffff',
        'on-dark-mute': 'rgba(255,255,255,0.7)',
        'focus-ring': 'rgba(59,130,246,0.5)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primary font - uses CSS variable from layout.js
        primary: ['var(--font-primary)', 'sans-serif'],
        // Legacy aliases - all point to primary font for consistency
        playfair: ['var(--font-primary)', 'sans-serif'],
        roboto: ['var(--font-primary)', 'sans-serif'],
        montserrat: ['var(--font-primary)', 'sans-serif'],
        lato: ['var(--font-primary)', 'sans-serif'],
        oswald: ['var(--font-primary)', 'sans-serif'],
        'open-sans': ['var(--font-primary)', 'sans-serif'],
      },
      colors: {
        // Every colour resolves through a theme token in globals.css, so both
        // themes are defined in one place. Nothing here may be a literal.
        'page': 'var(--page-bg)',
        'surface': 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'surface-sunken': 'var(--surface-sunken)',

        'primary-text': 'var(--text-primary)',
        'secondary-text': 'var(--text-secondary)',
        'muted-text': 'var(--text-muted)',
        'on-accent': 'var(--text-on-accent)',

        'line': 'var(--border)',
        'line-strong': 'var(--border-strong)',

        'danger': 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        'success': 'var(--success)',
        'on-media': 'var(--text-on-media)',

        'accent-main': 'var(--accent-color)',
        'accent-main-light': 'var(--accent-light)',
        'accent-main-dark': 'var(--accent-dark)',

        // Legacy aliases kept so older markup keeps resolving; all of these
        // now follow the active theme rather than being baked dark.
        'background': 'var(--page-bg)',
        'background-light': 'var(--surface)',
        'top-grad': 'var(--surface-raised)',
        'bottom-grad': 'var(--page-bg)',
        'secondary': 'var(--surface-sunken)',
        'accent': 'var(--surface-raised)',
      },
      backgroundImage: {
        'lines-overlay-old': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\")",
        'lines-overlay': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23FFFFFF' fill-opacity='0.05' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E\");",
        'background-gradient': 'linear-gradient(135deg, rgb(20, 24, 30) 0%, rgb(16, 18, 22) 25%, rgb(18, 20, 24) 50%, rgb(14, 16, 20) 75%, rgb(16, 18, 22) 100%)',
        'background-gradient-footer': 'linear-gradient(to right, rgb(24, 26, 30), rgb(18, 20, 24))',
        'radial-camera-gradient': 'radial-gradient(circle at 30% 40%, rgba(6, 182, 212, 0.08) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)',
        'geo-grid': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M0 .5H48M.5 0V48' stroke='%2306b6d4' stroke-opacity='0.04' stroke-width='1'/%3E%3C/svg%3E\")",
        'geo-dots': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='1' cy='1' r='1' fill='%2306b6d4' fill-opacity='0.06'/%3E%3C/svg%3E\")",
        'geo-triangles': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.05' stroke-width='1'%3E%3Cpath d='M0 64L32 0 64 64 0 64z'/%3E%3Cpath d='M32 64L0 0 64 0 32 64z'/%3E%3C/g%3E%3C/svg%3E\")",
        'geo-grid-alt': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg stroke='%2306b6d4' stroke-opacity='0.03' stroke-width='1' fill='none'%3E%3Ccircle cx='32' cy='32' r='30'/%3E%3Ccircle cx='32' cy='32' r='20'/%3E%3Ccircle cx='32' cy='32' r='10'/%3E%3C/g%3E%3C/svg%3E\")",
        'noise-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
        'camera-aperture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.08' stroke-width='0.5'%3E%3Cpath d='M40 10 L52 20 L58 34 L58 46 L52 60 L40 70 L28 60 L22 46 L22 34 L28 20 Z'/%3E%3Cpath d='M40 20 L48 26 L52 36 L52 44 L48 54 L40 60 L32 54 L28 44 L28 36 L32 26 Z'/%3E%3Cpath d='M40 30 L44 33 L46 38 L46 42 L44 47 L40 50 L36 47 L34 42 L34 38 L36 33 Z'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
        'camera-lens': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.15'%3E%3Ccircle cx='50' cy='50' r='45' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='35' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='25' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='15' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' stroke-width='1'/%3E%3Cline x1='50' y1='5' x2='50' y2='95' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='5' y1='50' x2='95' y2='50' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='14.6' y1='14.6' x2='85.4' y2='85.4' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cline x1='85.4' y1='14.6' x2='14.6' y2='85.4' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E\")",
        'camera-focus': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.08' stroke-width='0.5'%3E%3Cpath d='M30 30 L40 30 M30 30 L30 40 M90 30 L80 30 M90 30 L90 40 M30 90 L40 90 M30 90 L30 80 M90 90 L80 90 M90 90 L90 80'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Cline x1='60' y1='0' x2='60' y2='120' stroke-width='0.3' stroke-opacity='0.04'/%3E%3Cline x1='0' y1='60' x2='120' y2='60' stroke-width='0.3' stroke-opacity='0.04'/%3E%3Ccircle cx='60' cy='60' r='25' stroke-opacity='0.05'/%3E%3Ccircle cx='60' cy='60' r='35' stroke-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E\")",
        'camera-sensor': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.06' stroke-width='0.5'%3E%3Crect x='10' y='10' width='40' height='40'/%3E%3Crect x='15' y='15' width='30' height='30'/%3E%3Cline x1='20' y1='10' x2='20' y2='50'/%3E%3Cline x1='30' y1='10' x2='30' y2='50'/%3E%3Cline x1='40' y1='10' x2='40' y2='50'/%3E%3Cline x1='10' y1='20' x2='50' y2='20'/%3E%3Cline x1='10' y1='30' x2='50' y2='30'/%3E%3Cline x1='10' y1='40' x2='50' y2='40'/%3E%3Ccircle cx='30' cy='30' r='8' stroke-opacity='0.08'/%3E%3C/g%3E%3C/svg%3E\")",
        'camera-shutter': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.07' stroke-width='0.5'%3E%3Ccircle cx='50' cy='50' r='40'/%3E%3Cpath d='M50 10 L68 35 L50 50 Z'/%3E%3Cpath d='M68 35 L90 50 L50 50 Z'/%3E%3Cpath d='M90 50 L68 65 L50 50 Z'/%3E%3Cpath d='M68 65 L50 90 L50 50 Z'/%3E%3Cpath d='M50 90 L32 65 L50 50 Z'/%3E%3Cpath d='M32 65 L10 50 L50 50 Z'/%3E%3Cpath d='M10 50 L32 35 L50 50 Z'/%3E%3Cpath d='M32 35 L50 10 L50 50 Z'/%3E%3Ccircle cx='50' cy='50' r='5' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
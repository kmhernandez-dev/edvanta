import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4ff',
          100: '#dce6fd',
          200: '#b9cdfc',
          300: '#96b4fa',
          400: '#6490f7',
          500: '#3d6ef3',
          600: '#2451d1',
          700: '#1a3ea8',
          800: '#122d82',
          900: '#0c1f5e',
          950: '#060f30',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // ─── Paleta Feliz Sin Tiroides (clínica, femenina) ───
        blush: {
          50:  '#fdf2f6',
          100: '#fce7ef',
          200: '#fbcfe1',
          300: '#f9a8c9',
          400: '#f472a8',
          500: '#ec4889',
          600: '#db2777',
        },
        sand: {
          50:  '#fbf9f5',
          100: '#f5f0e8',
          200: '#ece3d4',
          300: '#ddcfb8',
          400: '#c9b491',
        },
        deepblue: {
          600: '#1e3a8a',
          700: '#1b3175',
          800: '#172a63',
          900: '#111f4a',
        },
        // ─── Paleta HealthTech Feliz Sin Tiroides ───
        fst: {
          navy:   '#0A2540',
          teal:   '#2CB1A1',
          cream:  '#FFF9F4',
          blush:  '#F5DCE8',
          lilac:  '#EAE2F8',
          purple: '#9274C9',
          gray:   '#F6F7F8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        hand: ['Patrick Hand', 'Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [typography],
}

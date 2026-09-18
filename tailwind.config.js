import typography from '@tailwindcss/typography'

/**
 * Las escalas `navy` y `teal` se leen desde variables CSS para que Edvanta
 * pueda tener su propia identidad sin tocar Feliz Sin Tiroides ni
 * AtenFarmaClinic: los valores por defecto (en `src/index.css`, `:root`) son
 * los de siempre y solo cambian dentro de `.edvanta-theme`.
 */
const varColor = (name) => `rgb(var(${name}) / <alpha-value>)`

const scale = (prefix, steps) =>
  Object.fromEntries(steps.map((s) => [s, varColor(`--c-${prefix}-${s}`)]))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: scale('navy', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        teal: scale('teal', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
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
        // ─── Edvanta — identidad única (la misma del aula virtual) ───
        edvanta: {
          deep:      '#17223B',
          blue:      '#082E86',
          bluedark:  '#0A3AA6',
          light:     '#E4EBFA',
          soft:      '#EEF5FA',
          teal:      '#25A7B0',
          tealdark:  '#0F7480',
          mint:      '#DDF3F2',
          violet:    '#8981CE',
          lilac:     '#E9E5FA',
          bg:        '#F6F8FC',
          cream:     '#F6F8FC',
          ink:       '#17223B',
          muted:     '#65718A',
          subtle:    '#A6AEBE',
          border:    '#E3E9F2',
          strong:    '#C9D4E6',
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

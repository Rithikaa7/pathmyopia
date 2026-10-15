/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F3ED',
        ink: {
          DEFAULT: '#171A19',
          light: '#282C2A',
        },
        graphite: '#777B76',
        forest: {
          DEFAULT: '#254E43',
          dark: '#17231F',
          hover: '#1B3B32',
          light: '#EBF2EE',
        },
        mineral: {
          DEFAULT: '#86A89B',
          light: '#E2ECE7',
          dark: '#587B6E',
        },
        border: {
          fine: '#DADBD3',
          dark: '#2A3632',
        },
        copper: {
          DEFAULT: '#B97854',
          light: '#F8EDE7',
          hover: '#9E6241',
        },
        panel: {
          dark: '#17231F',
          darker: '#101815',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        specimen: '0 2px 12px 0 rgba(23, 26, 25, 0.06), 0 1px 3px 0 rgba(23, 26, 25, 0.04)',
        editorial: '0 20px 40px -15px rgba(23, 26, 25, 0.08)',
        darkSpecimen: '0 8px 30px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}

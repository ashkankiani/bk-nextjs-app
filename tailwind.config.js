/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      poppins: ['poppins', 'Arial', 'sans-serif'],
      yekanBakh: ['"Yekan Bakh FaNum"', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          50: '#edfdfe',
          100: '#d0f7fd',
          200: '#a8edf9',
          300: '#6bdef5',
          400: '#28c5e8',
          500: '#0ca8ce',
          600: '#0d86ad',
          700: '#126c8c',
          800: '#185872',
          900: '#184961',
        },
        darkNavy1: '#111A21',
        darkNavy2: '#182430',
        darkNavy3: '#364a5e',
      },
      fontSize: {
        xxs: [
          '0.625rem',
          {
            lineHeight: '0.75rem',
          },
        ],
        xxl: [
          '1.375rem',
          {
            lineHeight: '1.875rem',
          },
        ],
        '2xxl': [
          '1.625rem',
          {
            lineHeight: '2.094rem',
          },
        ],
        '2xxxl': [
          '1.75rem',
          {
            lineHeight: '2.188rem',
          },
        ],
      },
      fontFamily: {
        poppins: ['poppins', 'Arial', 'sans-serif'],
        yekanBakh: ['"Yekan Bakh FaNum"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        pool: ['0px 0px 6px 0px #d9d9d9'],
        poolBox: ['0px 0px 4px 0px rgba(0, 0, 0, 0.25)'],
      },
      animation: {
        'left-right': 'leftRight 600ms linear forwards',
        'right-left': 'rightLeft 600ms linear forwards',
      },
      keyframes: {
        leftRight: {
          '0%': { left: '-18rem' },
          '10%': { left: '-16rem' },
          '20%': { left: '-14rem' },
          '30%': { left: '-12rem' },
          '40%': { left: '-10rem' },
          '50%': { left: '-8rem' },
          '60%': { left: '-6rem' },
          '70%': { left: '-4rem' },
          '80%': { left: '-2rem' },
          '90%': { left: '-1rem' },
          '100%': { left: '0px' },
        },
        rightLeft: {
          '0%': { left: '0px' },
          '10%': { left: '-1rem' },
          '20%': { left: '-2rem' },
          '30%': { left: '-4rem' },
          '40%': { left: '-6rem' },
          '50%': { left: '-8rem' },
          '60%': { left: '-10rem' },
          '70%': { left: '-12rem' },
          '80%': { left: '-14rem' },
          '90%': { left: '-16rem' },
          '100%': { left: '-20rem' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '1.875rem',
              marginBottom: '0.75em',
              marginTop: '1.2em',
            },
            h2: {
              fontSize: '1.75rem',
              marginBottom: '0.70em',
              marginTop: '1.1em',
            },
            h3: {
              fontSize: '1.625rem',
              marginBottom: '0.65em',
              marginTop: '1em',
            },
            h4: {
              fontSize: '1.5rem',
              marginBottom: '0.6em',
              marginTop: '0.9em',
            },
            h5: {
              fontSize: '1.4rem',
              marginBottom: '0.55em',
              marginTop: '0.85em',
            },
            h6: {
              fontSize: '1.3rem',
              marginBottom: '0.5em',
              marginTop: '0.80em',
            },
            p: {
              fontSize: '1.25rem',
              lineHeight: '2.2',
            },
            ul: {
              fontSize: '1.2rem',
              marginRight: '1.5555556em',
              marginLeft: '0',
            },
            ol: {
              fontSize: '1.2rem',
              marginRight: '1.5555556em',
              marginLeft: '0',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}

const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'red-650': '#eb3c54',
        'gray-850': '#1c1d21',
        'rose-500': colors.rose[500]
      },
      height: {
        '88': '22rem'
      },
      fontFamily: {
        'inter': [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '180': '45rem',
      },
      textShadow: {
        'default': '0 2px 0 #000',
      },
      backgroundImage: theme => ({
        'header-img': "url('./img/header.png')",
      })
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-textshadow')
  ],
}

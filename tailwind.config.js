module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{md,html,njk,js}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

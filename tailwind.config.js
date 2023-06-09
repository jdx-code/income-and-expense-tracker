/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './views/admin/**/*.ejs',
    './views/admin/ccet/courses/**/*.ejs',
    './views/admin/ccet/fees/**/*.ejs',
    './views/admin/ccet/students/**/*.ejs',
    './views/partials/**/*.ejs',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}


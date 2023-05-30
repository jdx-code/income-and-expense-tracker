/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './views/admin/ccet/courses/**/*.ejs',
    './views/admin/ccet/fees/**/*.ejs',
    './views/admin/ccet/students/**/*.ejs',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      primary: ['Roboto', 'sans-serif'],
      secondary: ['Poppins', 'sans-serif'],
    },
    screens: {
   
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1140px',
    },
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#8E9395',
        tertiary: '#122947',
        'main-green': '#28B16D',
        'light-green': '#9CDDAE',
        'green-hover': '#09C269',
        orange: '#EE6002',
        'primary-text': '#1F3E72',
        // 'bg-green': '#f7fcf7',
        'bg-green': '#E8F5E9',
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(97.05deg, #09C269 3.76%, #1CA862 100%)',
        'green-gradient-hover': 'linear-gradient(97.05deg, #07A55A 3.76%, #189556 100%)',

      },
    },
  },
  plugins: [],
}
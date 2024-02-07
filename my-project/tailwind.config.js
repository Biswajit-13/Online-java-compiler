/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: '#76453B',
        input:"#7D7C7C",
       output:'#B19470',
       run:'#43766C',
       error: '#e74c3c', // Replace with your secondary color code
      },
    },
  },
  plugins: [],
};

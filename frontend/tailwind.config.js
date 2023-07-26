/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
   
  ],
  theme: {
    extend: {
      colors: {
        primary: '#035388',
        secondary: '#9ca3af',
        accent: '#AED9E0',
        // You can add more custom colors here if needed
      },
    },
  },
  plugins: [],
  
  
}


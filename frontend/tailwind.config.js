/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily : {
      Poppins : ['Poppins', 'sans-serif'],
      'helvetica': ['Helvetica', 'sans-serif'],
      'helvetica-rounded' : ['Helvetica-rounded', 'sans-serif'],  
      'Raleway' : ['Raleway' , 'sans-serif'],
    },

    extend: {
      colors:{
        'paragraph' : '#5F5F5F',
        'appoint' : '#1ABC9C',
        'bg-prob1' : '#E5F0FF',
        'bg-prob2' : '#F5F5F5',
        'span-bg' : '#C5C5C5',
        'prob-h' : '#222222',
        'faq-bg' : '#446E86',
        'contact-bg' : '#2C3E50',
        'span-col' : '#A9A9A9'
      }
    },
  },
  plugins: [],
}


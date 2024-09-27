/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
      helvetica: ["Helvetica", "sans-serif"],
      "helvetica-rounded": ["Helvetica-rounded", "sans-serif"],
      Raleway: ["Raleway", "sans-serif"],
      "helvetica-bold": ["Helvetica-bold", "sans-serif"],
    },

    extend: {
      colors: {
        paragraph: "#5F5F5F",
        appoint: "#1ABC9C",
        "bg-prob1": "#E5F0FF",
        "bg-prob2": "#F5F5F5",
        "span-bg": "#C5C5C5",
        "prob-h": "#222222",
        "faq-bg": "#446E86",
        "contact-bg": "#2C3E50",
        "span-col": "#A9A9A9",

        "f-dark": "#26282A",
        "f-light": "#FBFCF8",
        "f-gray": "#C3C3C3",
        "f-gray2": "#A7A7A7",
        "c-gray3": "#9C9C9C",
        "c-primary": "#1E8282",
        "c-secondary": "#2C3E50",
        "bg-sb": "#EEF1F1",
        "bg-mc": "#F5F5F5",
        "hover-c-secondary": "#506579",
        "pressed-c-secondary": "#162B41",
        "hover-c-primary": "#27AEAE",
        "pressed-c-primary": "#0C6969",
        "sb-hover-prime": "#C7E1E1",
        "sb-pressed-prime": "#0C6969",
      },
      fontSize: {
        "p-sm": "13.33px",
        "p-rg": "16px",
        "p-lg": "19.2px",
        h6: "23.04px",
      },
      animation: {
        soundwave: "soundwave 1.3s infinite",
      },
      keyframes: {
        soundwave: {
          "0%": {
            boxShadow: "0 0 0 0 rgba(26, 188, 156, 0.5)",
          },
          "100%": {
            boxShadow: "0 0 0 20px rgba(26, 188, 156, 0)",
          },
        },
      },
    },
  },
  plugins: [],
};

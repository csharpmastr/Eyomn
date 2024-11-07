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

        "f-dark": "#202427",
        "f-light": "#FBFCF8",
        "f-gray": "#C3C3C3",
        "f-gray2": "#A7A7A7",
        "c-gray3": "#9C9C9C",

        //Nav button colors
        "c-secondary": "#264653",
        "c-branch": "#4A90E2",
        "c-primary": "#1E8282",
        "c-staff": "#C79754",

        //Nav button hover state
        "hover-org": "#ABB2B9",
        "hover-branch": "#B7D3F3",
        "hover-doctor": "#A5CDCD",
        "hover-staff": "#E8D5BA",

        //Nav button active state
        "pressed-org": "#1A343E",
        "pressed-branch": "#3A72C1",
        "pressed-doctor": "#176565",
        "pressed-staff": "#A97842",

        //Sidebar background
        "sb-org": "#F8F8FC",
        "sb-branch": "#FBFDFF",
        "bg-sb": "#F3F4F6",
        "sb-staff": "#F9F7F4",

        "bg-mc": "#F5F5F5",
        "bg-sub": "#F8FBFC",
        "bg-con": "#4A90E2",
      },
      fontSize: {
        "p-sm": "13.33px",
        "p-rg": "16px",
        "p-lg": "19.2px",
        "h-h6": "23.04px",
        "h-h4": "33.18px",
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

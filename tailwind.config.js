module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      colors: {
        'gold-500': '#FFD700',
        'green-500': '#1DB954',
        'orange-600': '#FF4500',
        'secondary': '#1a1a1a',
        'background': 'rgb(18, 18, 18)',
        'top-grad': 'rgb(40, 40, 40)',
        'bottom-grad': 'rgb(24, 24, 24)',
        'primary-text': 'rgb(255, 255, 255)',
        'secondary-text': 'rgb(179, 179, 179)',
        'accent': 'rgb(64, 64, 64)'
      },
      backgroundImage: {
        'background-gradient': 'linear-gradient(to bottom, rgb(40, 40, 40), rgb(24, 24, 24))',
      },
    },
  },
  plugins: [],
};
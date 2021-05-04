module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        blag: {
          900: "#121216",
          700: "#191922",
          500: "#23232D",
        },
        nats: {
          n: "#27AAE1",
          a: "#34A574",
          t: "#375C93",
          s: "#8DC63F",
          g: "#48C774",
        },
      },

      flex: {
        2: "2 2 0%",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};

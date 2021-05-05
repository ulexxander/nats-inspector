module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        blues: {
          900: "#0E1122",
          800: "#151D32",
          700: "#131931",
          600: "#182037",
        },
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

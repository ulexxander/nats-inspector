module.exports = {
  mode: "jit",
  purge: ["./src/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};

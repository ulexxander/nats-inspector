/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: ["@snowpack/plugin-typescript"],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 4100,
    open: "false",
  },
  buildOptions: {},
  optimize: {
    bundle: true,
    splitting: true,
    treeshake: true,
    minify: true,
    target: "es2017",
  },
};

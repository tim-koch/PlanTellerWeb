import eslint from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "settings.js",
    ],
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];

import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.planteller.de",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "never",
  },
  image: {
    responsiveStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

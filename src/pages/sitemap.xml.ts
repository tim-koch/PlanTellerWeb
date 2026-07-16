import type { APIRoute } from "astro";
import { SITE } from "../lib/site";

const routes = [
  "",
  "/agb",
  "/datenschutz",
  "/hinweise-disclaimer",
  "/impressum",
  "/ki-hinweise",
  "/kontakt",
  "/konto-loeschen",
];

export const GET: APIRoute = () => {
  const urls = routes
    .map(
      (route) =>
        `<url><loc>${new URL(route || "/", SITE.url)}</loc><lastmod>2026-07-16</lastmod></url>`,
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
};

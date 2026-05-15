# PlanTeller Web

Statische Website für die PlanTeller-App: Landingpage, rechtliche Seiten, App-Store-relevante Inhalte und technische Metadaten für Suchmaschinen und Plattformen.

## Inhalt

- `index`: Landingpage für die PlanTeller-App
- `recipe-share`: Zielseite für geteilte Rezepte
- `datenschutz`: Datenschutzerklärung
- `agb`: Allgemeine Geschäftsbedingungen
- `impressum`: Impressum
- `ki-hinweise`: Hinweise zu KI-Funktionen und Transparenz
- `hinweise-disclaimer`: Rechtliche Hinweise und Disclaimer
- `konto-loeschen`: Anleitung zur Kontolöschung
- `styles.css`: Zentrales Styling
- `assets/`: Bilder, Logo, Fonts und Badges
- `robots.txt` und `sitemap.xml`: SEO- und Crawling-Dateien
- `.well-known/assetlinks.json`: Android App Links / Digital Asset Links
- `deploy/`: Docker-Compose- und Caddy-Konfiguration

Die HTML-Seiten werden bewusst ohne `.html`-Dateiendung gepflegt, weil die produktive Website diese URL-Struktur verwendet.

## Domain

- Produktive Domain: `https://www.planteller.de`
- Root-Domain: `https://planteller.de`
- Canonical URLs zeigen auf die `www`-Domain.
- Caddy leitet `.html`-Aufrufe auf die sauberen URLs ohne Dateiendung um.



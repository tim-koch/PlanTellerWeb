# PlanTeller Web

Statische Landingpage mit Rechtsseiten für die PlanTeller-App.

## Dateien
- `index.html`: Landingpage
- `datenschutz.html`: Datenschutzerklärung
- `agb.html`: AGB
- `impressum.html`: Impressum
- `ki-hinweise.html`: KI-Hinweise und Transparenz
- `hinweise-disclaimer.html`: Hinweise und Disclaimer
- `recipe-share.html`: Landingpage für Rezept-Freigabelinks
- `robots.txt`: Crawling-Regeln
- `sitemap.xml`: Sitemap für Suchmaschinen

## Domain
- Canonical-Domain: `https://www.planteller.de`
- `https://planteller.de` wird auf `https://www.planteller.de` weitergeleitet.

## HTTPS-Deployment auf Server (Docker + Caddy)
Voraussetzungen:
- Docker und Docker Compose Plugin installiert
- DNS gesetzt:
  - `A`-Record `planteller.de` -> Server-IP
  - `A`-Record `www.planteller.de` -> Server-IP
- Ports `80` und `443` offen

Schritte auf dem Server:
1. Repository klonen:
   - `git clone https://github.com/tim-koch/PlanTellerWeb.git`
   - `cd PlanTellerWeb`
2. Env-Datei anlegen:
   - `copy deploy\.env.example deploy\.env` (Windows)
   - oder `cp deploy/.env.example deploy/.env` (Linux)
   - optional E-Mail in `deploy/.env` anpassen
3. Container starten:
   - `docker compose --env-file deploy/.env -f deploy/docker-compose.yml up -d`

Danach ist die Seite unter `https://www.planteller.de` live.

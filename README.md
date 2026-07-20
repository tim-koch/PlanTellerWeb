# PlanTeller Web

Professionelle, vollständig statisch erzeugte Website für PlanTeller. Das Projekt verwendet Astro, Tailwind CSS 4 und TypeScript. Es benötigt im Browser kein UI-Framework und wird als unveränderlicher `dist`-Build über Caddy ausgeliefert.

## Technischer Aufbau

- Astro 7 mit statischer Ausgabe und dateibasierten HTML-Builds
- Tailwind CSS 4 über das offizielle Vite-Plugin
- TypeScript im strikten Modus
- Motion nur auf der Landingpage
- Formspree-AJAX als progressive Ergänzung eines normalen HTML-Formulars
- Solar Broken Icons lokal und zur Build-Zeit als Inline-SVG
- responsive AVIF- und WebP-Bilder über `astro:assets`
- Multi-Stage-Docker-Image mit Node.js 24 und Caddy

Zentrale Bereiche:

```text
src/components   wiederverwendbare UI-Komponenten
src/data         typisierte Navigation und Inhaltsdaten
src/layouts      Basis- und Rechtstext-Layouts
src/lib          Konfiguration und reine Hilfsfunktionen
src/pages        öffentliche Routen
src/scripts      gezielte Browserlogik
src/styles       Design-Tokens und globale Styles
src/assets       optimierbare Quellbilder und Logos
public           unverändert auszuliefernde Dateien
tests            Unit-, Browser-, a11y- und Container-Smoke-Tests
deploy           Caddy- und Compose-Konfiguration
```

## Lokale Entwicklung

Voraussetzungen sind Node.js 24 oder neuer und npm.

```bash
npm ci
npm run dev
```

Die wichtigsten Befehle:

```bash
npm run build          Produktions-Build nach dist
npm run preview        lokalen Produktions-Build starten
npm run check          Astro- und TypeScript-Prüfung
npm run lint           ESLint
npm run format:check   Formatierung prüfen
npm test               Unit-Tests
npm run test:e2e       Playwright in drei Viewports
npm run test:a11y      axe-Tests
npm run test:links     interne Links und Anker prüfen
npm run test:lighthouse Lighthouse-Ziele mobil und Desktop prüfen
```

Vor dem ersten lokalen Browserlauf:

```bash
npx playwright install chromium
```

Für Lighthouse muss `CHROME_PATH` auf das installierte Chromium zeigen. In GitHub Actions wird das automatisch gesetzt.

Die Start- und Kontaktseite werden getrennt mit mobilen und Desktop-Profilen geprüft. Für Performance, Barrierefreiheit, Best Practices und SEO gilt in beiden Profilen ein Mindestwert von 95.

## Seiten und URL-Kompatibilität

Öffentliche Seiten werden in `src/pages` gepflegt. Folgende bestehende URLs sind verbindlich und dürfen nicht umbenannt werden:

```text
/
/404
/agb
/datenschutz
/hinweise-disclaimer
/impressum
/ki-hinweise
/konto-loeschen
/recipe-share
/recipe-share/*
/.well-known/assetlinks.json
/robots.txt
/sitemap.xml
```

Zusätzlich gibt es `/kontakt`. Caddy leitet `/index`, `/index.html` und Aufrufe mit `.html` permanent auf die kanonische URL um. `/recipe-share/<token>` wird intern an die statische Freigabeseite gegeben; das App-Schema bleibt `planteller://recipe-share?token=<token>`.

Eine neue Seite wird als `.astro`-Datei in `src/pages` angelegt. Danach Navigation, Sitemap, Tests und gegebenenfalls die Caddy-Smoke-Matrix aktualisieren.

## Inhalte und SEO

- Site-Konstanten stehen in `src/lib/site.ts`.
- Navigation und Rechtelinks stehen in `src/data/navigation.ts`.
- Jede Seite setzt Titel, Beschreibung, Canonical und Social-Metadaten über das Basislayout.
- Öffentliche indexierbare Seiten müssen zusätzlich in `src/pages/sitemap.xml.ts` eingetragen werden.
- 404- und tokenisierte Freigabeseiten bleiben `noindex`.
- Bestehende Abschnittsanker auf der Startseite dürfen nicht entfernt werden.

## Light- und Dark-Mode-Bilder

App-Screenshots liegen unter:

```text
src/assets/app/light
src/assets/app/dark
```

Aktuell dienen die vorhandenen Light-Dateien als kontrollierter Fallback für Dark Mode. Sobald echte Dark-Screenshots vorliegen:

1. Datei mit exakt demselben Namen in `src/assets/app/dark` ablegen.
2. Den Dark-Import an der zugehörigen `ThemePicture`-Verwendung ergänzen.
3. `npm run build` ausführen und beide Themes im Browser testen.

Die Bildkomponente erzeugt AVIF als Primärformat und WebP als Fallback. Für App-Aufnahmen werden 360, 540, 720 und 1080 Pixel als Richtgrößen genutzt; Querformatbilder verwenden 480, 800 und 1200 Pixel. Alt-Text, `sizes`, Breite und Höhe bleiben verpflichtend. Das Hero-Bild darf als einziges Bild `priority` erhalten.

## Formspree-Kontaktformular

Der Endpoint ist zentral in `src/lib/site.ts` konfiguriert:

```text
https://formspree.io/f/mojgjzlv
```

Das Formular funktioniert als normaler HTML-POST ohne JavaScript. `@formspree/ajax` ergänzt Lade-, Erfolgs- und Fehlerzustände. Automatische Tests mocken den Request und senden niemals echte Formulardaten.

Vor einem Release ist genau eine manuelle Testeinsendung zulässig. Anschließend muss sie im Formspree-Konto gelöscht werden. Zusätzlich müssen dort Zieladresse, DPA/SCC-Unterlagen und die organisatorische 90-Tage-Löschroutine geprüft sein.

## Themes und Anzeigeeinstellungen

Die Website unterstützt System, Light, Dark, hohen Kontrast und reduzierte Bewegung. Einstellungen bleiben unter `planteller-display-settings` im Browser gespeichert. Das optimierte Vektorlogo unter `src/assets/brand/logo-mark.svg` übernimmt seine Farbe direkt aus dem aktiven Theme. Dadurch wird nur ein Logo geladen und es sind keine doppelten Light-/Dark-Dateien nötig.

Die Favicon-Quelldatei liegt unter `src/assets/brand/favicon-master.png`. Aus ihr werden die ausgelieferten ICO-, PNG- und Apple-Touch-Varianten in `public` abgeleitet. Das Rastermotiv wird nicht als eingebettetes SVG dupliziert.

Design-Tokens stehen in `src/styles/global.css`. Komponenten sollen Tokens verwenden und keine konkurrierenden Farbpaletten einführen.

## Deployment

Das Produktions-Image enthält ausschließlich Caddy, die Caddy-Konfiguration und den erzeugten `dist`-Ordner:

```bash
docker build -t planteller-web .
docker run --rm -p 8081:80 planteller-web
sh tests/smoke/caddy.sh
```

Alternativ:

```bash
docker compose -f deploy/docker-compose.yml up --build -d
```

Caddy liefert komprimiert aus, cached gehashte Astro-Assets unveränderlich, verhindert langfristiges HTML-Caching und setzt CSP, HSTS, Referrer-, Permissions- und Content-Type-Sicherheitsheader.

## Rechtstexte

Rechtstexte sind technisch strukturiert, ersetzen aber keine Rechtsberatung. Vor Veröffentlichung müssen insbesondere Impressum, Datenschutz, Formspree-Datenfluss, tatsächliche App-Verarbeitung und KI-/Telli-Angaben fachlich mit dem realen Produktstand abgeglichen werden. Das Stand-Datum ist bei inhaltlichen Änderungen zu aktualisieren.

## Release-Checkliste

1. `npm ci` mit unverändertem Lockfile ausführen.
2. Format, Check, Lint, Unit-, Link-, Browser-, a11y- und Lighthouse-Tests bestehen lassen.
3. Docker-Image bauen und `tests/smoke/caddy.sh` ausführen.
4. Light, Dark, Kontrast und reduzierte Bewegung in 390, 768 und 1440 Pixel Breite prüfen.
5. URL-, Canonical-, Sitemap-, 404-, Recipe-Share- und `assetlinks.json`-Matrix prüfen.
6. Formspree- und Rechtstext-Go-live-Gates bestätigen.
7. Diff auf unbeabsichtigte Dateien und sensible Daten prüfen.
8. Pull Request erst danach zur Prüfung freigeben.

Hinweise zu Drittanbieter-Lizenzen stehen in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

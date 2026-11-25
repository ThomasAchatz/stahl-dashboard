# Hinweise für Claude – Angebots-Cockpit (Repo stahl-dashboard)

Projekt: Software für Fensterbauer mit Montage (kaufen beim Großhändler, montieren, teils eigene Fertigung). Allgemeines Produkt,
geplant mit einem Pilotkunden. Ansprechpartner: Tommy (baut). Sprache in Code, Oberfläche, Doku und Commits: Deutsch.
Antworten an Tommy kurz und exakt, Anleitungen nach Werkzeug gruppiert.

## Regeln
- **Das Repo und GitHub Pages sind öffentlich.** Keine echten Daten: keine Kundennamen, Adressen, Fotos, Preise, Vertragsdetails,
  Gesprächsnotizen oder interne Analysen. Diese Unterlagen hat Tommy außerhalb des Repos (Ordner `intern/` ist per .gitignore ausgeschlossen).
- In der App heißt der Betrieb „Fensterbau Muster GmbH“. Nur erfundene Daten (Händler mit `.example`-Adressen).
- **Komplett getrennt von rok-office / rok-verwaltung**: kein Code-Bezug, keine gemeinsame Datenbank, keine Schlüssel. Nichts vermischen.
- Kein Build-Schritt: reines HTML/CSS/ES-Module, läuft auf GitHub Pages (Branch `claude/clever-clarke-8i2jzg`, Ordner root).
- Nichts von fremden Servern laden; Schriften liegen in `schriften/` (über `css/schriften.css`).
- Listen ab 360 px ohne seitliches Scrollen.
- Betriebsabhängiges (Katalog, Händler-Wording, Angebotsbausteine, Preislisten, Sätze, Farben) als Einstellung, nicht im Code.

## Stand
- `docs/LASTENHEFT.md`: Anforderungen (öffentliche Fassung ohne Kundendaten).
- Prototyp (nur Vorschau, KI simuliert, Daten nur im Browser): siehe README.

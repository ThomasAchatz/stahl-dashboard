# Hinweise für Claude – Stahl Dashboard

Projekt: Software für Fensterbauer mit Montage (kaufen beim Großhändler, montieren). Allgemeines Produkt, geplant mit einem Pilotkunden (4 Nutzer + Monteure). Langfristig Ablösung von PinnCalc Corpora (Fahrplan: `docs/analyse/pinncalc-abloesung.md`). Ansprechpartner: Tommy (baut).
Sprache in Code, Oberfläche, Doku und Commits: Deutsch. Antworten an Tommy kurz und exakt, Anleitungen nach Werkzeug gruppiert.

## Regeln
- **Komplett getrennt von rok-office / rok-verwaltung**: kein gemeinsamer Code-Bezug, keine gemeinsame Datenbank, keine Schlüssel, keine Namen. Nichts vermischen.
- Nur erfundene Daten (Endkunden, Händler mit `.example`-Adressen, Preise).
- Kein Build-Schritt: reines HTML/CSS/ES-Module, läuft auf GitHub Pages (Branch `claude/clever-clarke-8i2jzg`, Ordner root).
- Nichts von fremden Servern laden; Schriften liegen in `schriften/` (über `css/schriften.css`).
- Listen ab 360 px ohne seitliches Scrollen.
- Betriebsabhängiges (Katalog, Händler-Wording, Angebotsbausteine, Preislisten, Sätze) als Einstellung, nicht im Code. Datenmodell mandantenfähig planen.

## Stand
- `docs/LASTENHEFT.md`: Anforderungen (v0.3). `docs/gespraeche/`: Gesprächsnotizen mit dem Kunden, jeweils mit Einordnung und offenen Fragen.
- Prototyp (nur Vorschau, KI simuliert): `js/daten.js` (Demo-Daten, Katalog), `js/ki.js` (Diktat → Positionen, Mail-Texte je Händler),
  `js/app.js` (Seiten, Dialoge; `ansicht(p)` zeichnet die Fensteransicht aus den Positionsdaten), `css/app.css`.
- Der Pilotkunde nutzt **PinnCalc Corpora** (6.200 €/Jahr; Kalkulation, Zeiten, DATEV usw.). Erst läuft das Tool daneben (Phase 1 Fenster-Modul,
  Phase 2 Zeiterfassung + Nachkalkulation) und übergibt an Corpora; Rechnungen/DATEV wechseln erst in Phase 3.

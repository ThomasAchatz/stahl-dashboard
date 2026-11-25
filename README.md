# Angebots-Cockpit Fenster & Türen (Vorschau)

Klickbarer Prototyp für einen Fensterbauer: Kundenwünsche einsprechen → Positionsliste → Anfrage an
Großhändler im jeweiligen Wording → Wiedervorlage → Antworten vorsortiert → Angebote abgleichen →
Kundenangebot vorbereiten.

- **Nur Vorschau:** erfundene Daten, KI simuliert, nichts wird versendet. Änderungen bleiben nur im eigenen Browser
  (Einstellungen → „Demo zurücksetzen“).
- **Technik:** reines HTML/CSS/JS ohne Build-Schritt, läuft direkt auf GitHub Pages.
- **Lastenheft:** [`docs/LASTENHEFT.md`](docs/LASTENHEFT.md)

```
index.html        Gerüst, Navigation
css/app.css       Gestaltung (hell/dunkel, Handy/Tablet/PC)
js/daten.js       erfundene Demo-Daten, Merkmalkatalog
js/ki.js          simulierte KI: Diktat → Positionen, Mail-Texte je Händler, Zusammenfassung
js/app.js         Seiten, Dialoge, Abläufe
```

Lokal ansehen: `python3 -m http.server` im Ordner, dann http://localhost:8000

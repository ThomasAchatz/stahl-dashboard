# Angebots-Cockpit Fenster & Türen (Vorschau)

Klickbarer Prototyp für Fensterbauer mit Montage. Alle Daten sind erfunden, die KI ist simuliert, nichts wird versendet.
Änderungen bleiben nur im eigenen Browser (Einstellungen → „Demo zurücksetzen“). Oben im Band: **„Vorführung starten“** zeigt einen Ablauf.

**Was zu sehen ist**
- **Aufmaßblatt fotografieren:** handschriftliches Blatt (Beispiel) → Positionen mit Zeichnung, unsichere Stellen markiert
- **Aufmaß-Maske** wie das Papierblatt: Kopf für alle Positionen, Felder mit Öffnung und Bandseite (DK li, F | DK re, Stulp, Oberlicht …)
- **Zeichnungen mit Bemaßung** und druckbare **Fensterliste** für den Händler
- Anfrage an Händler (je Händler eigenes Wording), Postfach mit Vorsortierung, Abgleich der Händlerangebote
- **Kundenangebot transparent:** je Position Element, Montage, Ausbau; feste Kopf- und Schlusstexte; Preisliste in den Einstellungen
- **Nachkalkulation (Ausblick):** Soll/Ist je Auftrag, Vorschlag für die Preisliste
- **Firmenfarben** je Betrieb (Einstellungen → Gestaltung)

**Technik:** reines HTML/CSS/JS ohne Build-Schritt, läuft auf GitHub Pages. Schriften liegen lokal in `schriften/`.

```
js/daten.js     erfundene Demo-Daten, Merkmalkatalog
js/fenster.js   Felder-Modell und Zeichnung (Öffnungssymbole, Bemaßung)
js/aufmass.js   Aufmaß-Maske, Beispielblatt, simuliertes Auslesen
js/ki.js        simulierte KI: Diktat → Positionen, Mail-Texte je Händler, Zusammenfassung
js/nachkalk.js  Ausblick Nachkalkulation
js/app.js       Seiten, Dialoge, Abläufe
```

Lokal ansehen: `python3 -m http.server` im Ordner, dann http://localhost:8000 · Lastenheft: [`docs/LASTENHEFT.md`](docs/LASTENHEFT.md)

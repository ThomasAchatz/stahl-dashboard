# Aufmaßblatt des Pilotkunden – Auswertung

Quelle: 2 Fotos eines ausgefüllten Aufmaßblatts von der Baustelle (Blatt 1 und 2 von 2), 25.11.2026.
**Die Fotos liegen bewusst nicht im Repository** (das Repo ist öffentlich, auf den Blättern stehen Name und Anschrift eines Endkunden).
Hier stehen nur der Aufbau des Formulars und die Positionen ohne Personenbezug. Handschrift teils unsicher gelesen: markiert mit „(?)“.

## 1. Aufbau des Formulars „Aufmaß“

**Kopf (gilt für das ganze Blatt):**
Kunde · Versandanschrift/Baustelle · Telefon/Telefax · Vertreter · Termin · Datum · Altbau/Neubau · Abholung/Lieferung ·
Montage pauschal/Regie · Blatt x von y · **Fenster-System** · **Farbe**

**Tabelle, je Position zwei Zeilen** (obere Zeile „S“, untere „K“, vermutlich Stulp/Kämpfer):

| Spalte im Formular | Bedeutung (vermutet) | Feld im Tool |
|---|---|---|
| Pos. / St. | Positionsnummer, Stückzahl | `nr`, `stk` |
| Rohbau- ca. Maß, Breite / Höhe | Rohbaumaß | `b`, `h`, `masstyp = Rohbaumaß` |
| Fertigmaß o. Fl., Breite / Höhe | Fertigmaß ohne Flügel(?) / Bestellmaß | zweites Maßpaar (neu) |
| DIN-Richtung li / Mi / re | Öffnungsart je Feld von links nach rechts, z. B. „DK – –“ | Öffnung **je Feld** (neu) |
| Kämpfer / Stulp | Teilung waagerecht (Kämpfer) bzw. Stulp | `teilung` |
| Elementskizze | Ansicht mit Symbolen (+ = fest, Dreieck/X = DK, Pfeil = Schiebe) | entspricht unserer Zeichnung `ansicht()` |
| Dichtungen S / G | Dichtungsfarbe schwarz / grau | neu |
| Griffoliven P9 / weiß | Griffausführung | neu |
| Entw. vorne / unten | Entwässerung | neu |
| Fl. | (?) | offen |
| Aufdoppelung u / o / l / r (vorgedruckt „30“) | Verbreiterung/Aufdoppelung je Seite in mm | neu |
| RV und Paneel | Rollladen („R“), Raffstore („Raff“), Paneel | `rollladen` |
| Sprossen | | `sprossen` |
| Glasart / Füllung | z. B. ESG, Ganzglas | `glasOpt` |
| Randv. ALU / KSD | Randverbund Alu oder Kunststoff („warme Kante“) | neu |
| FB außen / FB innen | Fensterbank außen/innen | neu |
| WDVS (?) Stärke/mm | Dämmung/Anschluss (?) | offen |
| Farbe Kasten / Panzer | Rollladenkasten und Panzerfarbe | neu |
| Gurtdurchlauf Mauer / Deckel | Rollladenbedienung | neu |
| Sonstiges / Bemerkungen | Freitext | `bemerkung` |

## 2. Positionen der Beispiel-Baustelle (ohne Personenbezug)

Neubau(?), 9 Positionen auf 2 Blättern, alle Maße Rohbaumaß in mm.

| Pos. | St. | B × H | Öffnung (li / Mi / re) | Skizze | Behang | Bemerkung |
|---|---|---|---|---|---|---|
| 1 | 1 | 635 × 1245 | DK – – | DK | Rollladen | |
| 2 | 1 | 3750 × 1245 | – – DK | fest + DK | Raffstore | Notiz „1040 = …“ (?) |
| 3 | 1 | 5025 × 1460, darunter 1000 (?) | – | fest + Schiebe (?) | Raffstore | „Ganzglas“ |
| 4 | 1 | 2490 × 1460, darunter 1000 (?) (Maß korrigiert) | – | fest | Raffstore | „Ganzglas“ |
| 5 | 1 | 1010 × 1465, darunter 1000 (?) | – – DK | DK | Raffstore | „Flachschwelle“ (?), „1460 mit BE“ (?) |
| 6 | 1 | 1010 × 2140 (?) | DK – – | DK | Raffstore | „Wohnzimmer, neben Ganzglas links“ |
| 7 | 1 | 3010 × 1460 (korrigiert) | – | fest | Raffstore | „Stube“, ESG |
| 8 | 1 | 635 × 1245 | DK – – | DK | Rollladen | „Speis“ |
| 9 | 1 | 880 × 1245 | DK – – | DK | Rollladen | |

Bemerkungen Blatt 1: „4460 Innenmaß HS“ (?), „250 Öffnung Raff“ (Raffstore-Öffnung 250 mm?).

## 3. Was wir daraus lernen

1. **Das Aufmaßblatt ist das eigentliche Datenmodell.** Die Erfassung im Tool muss genau diese Felder kennen, in dieser Reihenfolge.
   Mehrere Felder fehlen in unserem Katalog noch (Dichtung, Griffoliven, Entwässerung, Aufdoppelung, Randverbund, Fensterbänke,
   Rollladenkasten/Panzer, Gurtdurchlauf, zweites Maßpaar).
2. **Öffnung je Feld:** Bei mehrteiligen Elementen steht die Öffnung je Feld (li/Mi/re), z. B. „fest + DK“. Unser Modell hat bisher
   eine Öffnung je Position → erweitern auf eine Liste von Feldern.
3. **Kopfangaben gelten für alle Positionen** (System, Farbe, Alt-/Neubau, Montageart). Unsere „gilt für alle“-Logik passt dazu.
4. **Kurzschreibweise** der Monteure („DK – –“, „Raff“, „R“, „+“, Pfeile) muss die Auswertung verstehen.
5. **Größte Chance:** Der Ablauf auf der Baustelle bleibt, wie er ist (Papier, Klemmbrett). Das **Foto des Blatts** wird in der App
   ausgelesen und wird zur Positionsliste mit Zeichnung, zum Prüfen. Danach kann wie geplant die Anfrage an den Händler folgen.
   Alternative oder später: dieselbe Maske digital auf dem Tablet, die aussieht wie das Blatt.
6. Handschrift ist fehleranfällig (korrigierte Maße, Zahlen untereinander). Deshalb gilt wie bisher: **nichts ungeprüft übernehmen**,
   unsichere Werte markieren, Original-Foto neben der Liste anzeigen.

## 4. Fragen an den Kunden

1. Was bedeuten die beiden Zeilen je Position (S / K)? Stulp/Kämpfer oder etwas anderes?
2. „Fertigmaß o. Fl.“: Was genau ist gemeint? Wer rechnet vom Rohbaumaß auf das Bestellmaß um, er oder der Händler?
3. Was bedeuten die zweiten Zahlen unter der Höhe (z. B. 1460 / 1000) – Brüstungshöhe, Oberlicht, Kämpferhöhe?
4. Spalten „Fl.“ und „WDVS … mm“ (?): Bedeutung?
5. Bemerkungen „4460 Innenmaß HS“, „250 Öffnung Raff“, „1460 mit BE“: Bedeutung?
6. Ist das Blatt in Corpora hinterlegt oder eine eigene Vorlage? Gibt es eine leere Vorlage als PDF?

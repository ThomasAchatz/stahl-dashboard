# Lastenheft – Angebots-Dashboard Fenster & Türen

Stand: 25.11.2026 · Version 0.3 (Produkt mit Pilotkunde, siehe `docs/gespraeche/2026-11-25_kunde.md` und `docs/analyse/pinncalc-abloesung.md`) · Arbeitstitel: **Stahl Dashboard**

---

## 1. Ausgangslage

Der Auftraggeber ist ein Fensterbauer mit eigener Montage. Mit vier Personen nimmt er beim Endkunden
die Wünsche zu Fenstern und Türen auf, z. B. 3-fach-Verglasung, Holz-Alu, innen Kiefer-Optik.
Dafür holt er Angebote bei Großhändlern und Herstellern ein und macht daraus ein Angebot an den Endkunden.

Der Betrieb arbeitet mit der Branchensoftware **corpora pinncalc** (Schreibweise noch prüfen). Darin laufen Kunden,
Zeiterfassung (Mitarbeiter am Handy), Kalkulation mit jährlich gepflegter Preisliste, Nachkalkulation sowie die Schnittstellen
zu DATEV, Einkauf und Buchhaltung.

Am aufwendigsten sind die **Fenster**: Jedes Element wird heute von Hand gezeichnet. Daraus entsteht eine Fensterliste für den
Lieferanten, und dessen Angebot wird anschließend von Hand eingegeben. Bei vielen Positionen und Größen kostet das sehr viel Zeit.
Daneben passiert Folgendes:

- Anfragen müssen für jeden Händler neu formuliert werden.
- Antworten und Rückfragen gehen im Postfach unter.
- Ob nachgefasst wurde, hängt davon ab, ob jemand daran denkt.
- Ein Fehler bei Maß, Anschlag oder Glas wird teuer, denn Fenster sind Sonderanfertigungen und
  können nicht zurückgegeben werden.

## 2. Ziel

Eine Web-App für Handy, Tablet und PC. Sie begleitet jeden Vorgang vom Gespräch beim Endkunden bis zum
fertig vorbereiteten Angebot an den Endkunden:

1. **Erfassen:** per Formular, Diktat oder getippter Notiz. Die KI überträgt alles in eine saubere
   Positionsliste.
2. **Anfragen:** Für jeden Großhändler entsteht die Anfrage in seinem Wording. Mail und Anhang werden
   vorbereitet und per Klick verschickt.
3. **Verfolgen:** Die App legt einen Vorgang an, erinnert ans Nachfassen, sortiert eingehende Mails vor
   und meldet sich bei Antworten und Rückfragen.
4. **Auswerten:** Die KI liest Händlerangebote aus, gleicht sie mit der Anfrage ab und fasst zusammen.
5. **Kundenangebot:** Die App bereitet das Angebot an den Endkunden mit Aufschlag, Montage und
   Briefkopf vor.

**Leitsatz:** Die KI schreibt nur Entwürfe. Verschickt wird ausschließlich per Klick eines Menschen.

**Rolle neben pinncalc:** Das Tool ersetzt pinncalc nicht, sondern ist ein **Fenster-Modul** davor. Es nimmt das Zeichnen, die Fensterliste
und das Abtippen der Lieferantenangebote ab und übergibt die Ergebnisse an pinncalc.

**Kundenangebote** sehen immer gleich aus: fester Kopf und Schluss, unten eine transparente Aufstellung, was jede Position kostet.
Ziel ist ein faires, nachvollziehbares Angebot für den Endkunden.

## 3. Rahmen und Abgrenzung

| Punkt | Festlegung |
|---|---|
| Art | **Allgemeines Produkt für Fensterbauer** (Fachbetriebe, die beim Großhändler kaufen und montieren). Geplant mit diesem Betrieb als **Pilotkunde**. Betriebsabhängiges ist Einstellung, nicht Code. Mandantenfähig von Anfang an. |
| Langfristiges Ziel | **Corpora (PinnCalc) schrittweise ablösen**, siehe Fahrplan in `docs/analyse/pinncalc-abloesung.md`. Kosten heute beim Pilotkunden: 6.200 €/Jahr. |
| Nutzer | Pilotkunde: 4 Personen im Büro plus Monteure (Zeiterfassung, Phase 2). In Stufe 1 haben alle die gleichen Rechte, und es ist sichtbar, wer was gemacht hat. |
| Eigenständigkeit | Eigenes Repository, eigene Datenbank, eigene Schlüssel, eigene Domain, eigenes Postfach. **Keine technische oder organisatorische Verbindung zu anderen Projekten.** |
| Daten in der Entwicklung | Nur erfundene Daten (Endkunden, Händler, Preise) |
| Sprache | Deutsch (Oberfläche, Texte, Dokumentation) |

**Nicht im Umfang**, kann später kommen:

- **Alles, was pinncalc heute schon kann:** Kundenstamm, Zeiterfassung, Kalkulation mit Preisliste, Nachkalkulation, DATEV,
  Einkauf, Buchhaltung. Diese Daten werden höchstens übernommen, nicht neu gepflegt.
- Kalkulation aus Herstellerpreislisten oder Konfiguratoren
- Bestellung direkt in Händlerportalen
- Rechnungen, Buchhaltung, Zahlungsverfolgung
- Montage- und Personalplanung
- Ersatz von pinncalc. Die **Schnittstelle** zu pinncalc gehört dagegen zum Umfang (Abschnitt 6.12).

## 4. Begriffe

| Begriff | Bedeutung |
|---|---|
| **Vorgang** | Ein Bauvorhaben eines Endkunden, z. B. „Familie Muster, Sanierung EFH“. Darin liegt alles: Positionen, Anfragen, Mails, Angebote. |
| **Position** | Ein Element mit Stückzahl, z. B. „Pos. 3 – Wohnzimmer, 2 × Dreh-Kipp-Fenster“ |
| **Merkmal** | Eine Eigenschaft einer Position, z. B. Material, Glas, Farbe oder Öffnungsart. Merkmale kommen aus einem pflegbaren Katalog. |
| **Anfrage** | Die an einen Großhändler geschickte Positionsliste mit Mail |
| **Händlerangebot** | Die Antwort des Großhändlers, meist als PDF |
| **Rückfrage** | Eine Nachfrage des Händlers, die beantwortet werden muss, bevor er anbietet |
| **Kundenangebot** | Das Angebot des Fensterbauers an den Endkunden |
| **Wiedervorlage** | Eine Erinnerung zu einem Zeitpunkt, z. B. „nachfassen in 14 Tagen“ |

## 5. Ablauf und Status eines Vorgangs

```
Erfassung ─► Anfrage vorbereitet ─► Angefragt ─┬─► Rückfrage offen ─► (beantwortet) ─┐
                                               │                                     │
                                               └─► Angebot(e) erhalten ◄─────────────┘
                                                        │
                                                        ▼
                                          Kundenangebot vorbereitet ─► an Kunde gesendet
                                                                            │
                                                     ┌──────────────────────┼──────────────────┐
                                                     ▼                      ▼                  ▼
                                                 Beauftragt             Abgelehnt          Archiviert
```

- Ein Vorgang kann an **mehrere Händler gleichzeitig** gehen. Der Status gilt dann je Händler, der
  Vorgang zeigt eine Zusammenfassung.
- Der Status wechselt nach Möglichkeit automatisch, z. B. bei „Mail gesendet“ oder „Angebot erkannt“.
  Er lässt sich aber jederzeit von Hand ändern.

## 6. Funktionale Anforderungen

Priorität: **M** = Muss, **S** = Soll, **K** = Kann. Die Stufe bezieht sich auf Abschnitt 9.

### 6.1 Vorgänge und Endkunden

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-01 | Vorgang anlegen mit Endkunde (Name, Anschrift, Telefon, E-Mail), Bauvorhaben-Adresse, Art (Neubau/Sanierung) und Notiz | M | 1 |
| F-02 | Vorgangsliste mit Suche und Filter nach Status, Bearbeiter und „wartet auf Antwort“ | M | 1 |
| F-03 | Vorgangsseite mit Positionen, Anfragen je Händler, Mail-Verlauf, Wiedervorlagen, Dokumenten und Zusammenfassung | M | 1–2 |
| F-04 | Ein Endkunde kann mehrere Vorgänge haben | S | 1 |
| F-05 | Vorgang kopieren, z. B. als Variante „mit Kunststoff statt Holz-Alu“ | S | 2 |

### 6.2 Erfassung der Positionen

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-10 | **Formular**: Position für Position, Merkmale als Auswahlfelder statt Freitext, gut bedienbar am Tablet | M | 1 |
| F-11 | **Diktat**: frei einsprechen, z. B. „Wohnzimmer zwei Dreh-Kipp 1230 mal 1480, Holz-Alu, innen Kiefer, außen 7016, Dreifachglas“. Die KI füllt daraus Positionen und Merkmale. | M | 1 |
| F-12 | **Getippte Notiz**: wie F-11, nur aus getipptem Text oder eingefügter Notiz | M | 1 |
| F-13 | Ergebnis von F-11/F-12 erst als **Vorschlag**. Der Nutzer prüft, ändert und übernimmt. Unsichere Werte sind markiert. | M | 1 |
| F-14 | Merkmale vererben: „wie Pos. 1, aber 2-flügelig“. Vorgabewerte für den ganzen Vorgang, z. B. Material und Farbe für alle. | M | 1 |
| F-15 | Positionen kopieren, löschen, umsortieren. Raum bzw. Einbauort je Position. | M | 1 |
| F-16 | Fotos und Skizzen je Position (Kamera am Handy, Zeichnung später) | S | 2 |
| F-16a | **Foto des Aufmaßblatts einlesen:** Handschrift und Kurzschreibweise (z. B. „DK – –“, „Raff“, „+“) werden zu Positionen. Original-Foto steht beim Prüfen daneben, unsichere Werte sind markiert (siehe `docs/gespraeche/2026-11-25_aufmassblatt.md`) | M | 1–2 |
| F-16b | Erfassungsmaske mit **den Feldern des Aufmaßblatts** in dessen Reihenfolge, Kopfangaben (System, Farbe, Alt-/Neubau, Montageart) gelten für alle Positionen | M | 1 |
| F-16c | **Öffnung je Feld** bei mehrteiligen Elementen (li / Mi / re, z. B. fest + DK) | M | 1 |
| F-17 | Erfassung **vor Ort ohne Netz**: Daten bleiben auf dem Gerät und werden später übertragen | S | 4 |
| F-18 | **Zeichnung je Position automatisch** aus Maß, Teilung, Öffnung, Anschlag, Oberlicht/Seitenteil: Ansicht mit Öffnungssymbolen in üblicher Zeichenweise, ersetzt das Zeichnen von Hand | M | 1–2 |
| F-19 | Zeichnung mit **Bemaßung** als PDF (je Position und als Gesamtliste), im Format, das der Lieferant braucht (Ansicht innen/außen siehe Z-10) | M | 2 |

### 6.3 Merkmalkatalog

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-20 | Pflegbarer Katalog für Elementarten (Fenster, Balkon-/Terrassentür, Hebe-Schiebe-Tür, Haustür, Nebentür …) mit ihren Merkmalen und erlaubten Werten | M | 1 |
| F-21 | In Stufe 1 gilt ein **Vorschlagskatalog** (Anhang A). Er wird durch die Liste des Auftraggebers ersetzt, sobald sie vorliegt. | M | 1 → 4 |
| F-22 | Pflichtmerkmale je Elementart. Ohne Pflichtmerkmale ist keine Anfrage möglich. | M | 1 |
| F-23 | Abhängigkeiten, z. B. Anschlag nur bei öffnenden Flügeln, Rollladen-Antrieb nur mit Rollladen | S | 2 |
| F-24 | Die KI wählt nur Werte aus dem Katalog. Passt nichts, wird der Wert als Freitext markiert, statt dass etwas geraten wird. | M | 1 |

### 6.4 Prüfung vor dem Versand (Schutz vor Fehlbestellungen)

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-30 | Alle Maße in **mm**. Es ist klar gekennzeichnet, ob es sich um Rohbau-/Lichtmaß oder Bestell-/Fertigmaß handelt. | M | 1 |
| F-31 | Plausibilitätsprüfung: unrealistische Maße, z. B. 12 mm oder 123 m, vertauschte Breite/Höhe bei Türen, fehlende Pflichtfelder, widersprüchliche Angaben | M | 1 |
| F-32 | **Die KI erfindet nie Maße, Stückzahlen oder Werte.** Was nicht gesagt wurde, bleibt leer und wird rot markiert. | M | 1 |
| F-33 | Vor dem Versand eine **Zusammenfassung zur Bestätigung**: Positionen, Maße, Stückzahlen, auffällige Werte | M | 1 |

### 6.5 Großhändler und Anfragen

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-40 | Händler-Stammdaten: Firma, Ansprechpartner, E-Mail, Telefon, Kundennummer, angebotene Systeme und Hersteller | M | 1 |
| F-41 | **Anfrage-Vorlage je Händler**: Anrede, Wording, Reihenfolge und Bezeichnung der Merkmale, gewünschtes Format (Mail-Text, PDF- oder Excel-Positionsliste). Bis echte Muster vorliegen, gilt eine neutrale Standardvorlage. | M | 1 → 4 |
| F-42 | Die KI formuliert die Anfrage-Mail im Stil des Händlers. Die Positionsliste wird **aus den Daten erzeugt, nicht von der KI geschrieben**, damit keine Zahl verfälscht wird. | M | 1 |
| F-43 | Ein Vorgang an mehrere Händler gleichzeitig, mit Auswahl, welche Positionen an wen gehen | S | 1 |
| F-44 | Versand per Klick aus der App über das Postfach des Betriebs. Danach steht die Anfrage im Verlauf und als PDF im Vorgang. | M | 1–2 |
| F-45 | Ersatzweg ohne verbundenes Postfach: Mail im E-Mail-Programm öffnen bzw. Anhang herunterladen | M | 1 |

### 6.6 Postfach, Vorsortierung, Benachrichtigung

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-50 | Verbindung zum Postfach des Betriebs (IMAP/SMTP). Der Anbieter ist noch offen, siehe Abschnitt 11. | M | 2 |
| F-51 | Eingehende Mails werden automatisch dem **Vorgang zugeordnet** (über Antwort-Kennung, Vorgangsnummer im Betreff, Absender). Unsichere Zuordnungen landen als Vorschlag in einer Liste. | M | 2 |
| F-52 | **Vorsortierung** durch die KI: Angebot, Rückfrage, Auftragsbestätigung, Lieferterminmitteilung, Werbung/Newsletter, Sonstiges | M | 2 |
| F-53 | **Benachrichtigung** bei Angebot oder Rückfrage: in der App (Übersicht), als Push aufs Handy und optional per Mail | M | 2 |
| F-54 | Rückfragen: Die KI fasst die Frage zusammen und schlägt eine Antwort aus den Vorgangsdaten vor. Versand per Klick. | M | 2 |
| F-55 | Inhalt eingehender Mails ist für die KI **nur Information, nie Anweisung** (Schutz vor manipulierten Mails) | M | 2 |

### 6.7 Händlerangebote auswerten

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-60 | PDF-Angebot auslesen: Positionen, Einzel- und Gesamtpreise, Rabatte, Lieferzeit, Gültigkeit, Zahlungsbedingungen | M | 2 |
| F-61 | **Abgleich mit der Anfrage**: fehlende Positionen, abweichende Maße, anderes Glas, andere Farbe usw. werden deutlich hervorgehoben | M | 2 |
| F-62 | Vergleich mehrerer Händlerangebote zum selben Vorgang (Preis, Lieferzeit, Abweichungen) | S | 2 |
| F-63 | Ausgelesene Preise werden vom Nutzer bestätigt, bevor sie ins Kundenangebot gehen | M | 2 |

### 6.8 Wiedervorlagen und Übersicht

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-70 | Automatische Wiedervorlage nach Versand einer Anfrage. Standard sind **14 Tage**, einstellbar allgemein und je Händler. | M | 1 |
| F-71 | Fällige Wiedervorlage mit fertigem **Nachfass-Entwurf** an den Händler | M | 1 |
| F-72 | Weitere Erinnerungen: Gültigkeit eines Händlerangebots läuft ab, Endkunde hat sich nach X Tagen nicht gemeldet | S | 3 |
| F-73 | **Startseite als To-do-Liste**, nach Dringlichkeit sortiert: Rückfragen, fällige Wiedervorlagen, neue Angebote, Entwürfe, unvollständige Erfassungen | M | 1–2 |
| F-74 | Eigene Wiedervorlagen und Notizen zu jedem Vorgang, auch eingesprochen | S | 1 |

### 6.9 Kundenangebot vorbereiten

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-80 | Kundenangebot aus dem gewählten Händlerangebot: Aufschlag in % (allgemein, je Händler, je Position änderbar) | M | 3 |
| F-81 | Zusatzpositionen: Montage, Demontage und Entsorgung, Fensterbänke, Anschlussarbeiten, Anfahrt. Pauschalen sind pflegbar. | M | 3 |
| F-82 | Angebot als PDF mit Briefkopf, Logo, Angebotstexten und Gültigkeit des Betriebs. Endkundentaugliche Beschreibung der Positionen ohne Händlerkürzel. | M | 3 |
| F-83 | **Einkaufspreise und Händlername erscheinen nie im Kundenangebot** | M | 3 |
| F-84 | Versand an den Endkunden per Klick, anschließend Wiedervorlage zum Nachfassen | S | 3 |
| F-85 | **Immer gleicher Aufbau:** Kopf (Briefkopf, Einleitung) und Schluss (Bedingungen, Gewährleistung, Gruß) als feste, pflegbare Bausteine | M | 3 |
| F-86 | **Transparente Aufstellung je Position** für den Endkunden: was jede Position kostet, aufgeschlüsselt nach Element, Zubehör, Montage, Demontage/Entsorgung (Feinheit siehe Z-11). Einkaufspreis und Aufschlag bleiben intern. | M | 3 |

### 6.10 Zusammenfassung und Nachvollziehbarkeit

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-90 | Zusammenfassung je Vorgang auf Knopfdruck: Stand, offene Punkte, nächste Schritte | M | 2 |
| F-91 | Verlauf: Wer hat wann was erfasst, geändert oder gesendet? | M | 1 |
| F-92 | Abschluss eines Vorgangs mit PDF des gesamten Verlaufs | K | 3 |

### 6.11 Benutzer und Einstellungen

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-100 | Anmeldung mit E-Mail und Passwort für 4 Nutzer. Neue Nutzer legt der Inhaber an. | M | 1 |
| F-101 | Einstellungen: Firmendaten, Briefkopf, Signatur je Nutzer, Wiedervorlage-Fristen, Merkmalkatalog, Händler, Vorlagen | M | 1–3 |
| F-102 | Rollen (z. B. Außendienst ohne Einkaufspreise) | K | 4 |

### 6.12 Schnittstelle zu pinncalc

| Nr. | Anforderung | Prio | Stufe |
|---|---|---|---|
| F-110 | **Übergabe an pinncalc:** Positionen mit Beschreibung, Maßen, Stückzahl und Einkaufspreis aus dem bestätigten Händlerangebot, damit dort nichts abgetippt werden muss | M | 3 |
| F-111 | **Übernahme aus pinncalc:** Kunde/Bauvorhaben und, falls gewünscht, Preise für Montage und Zubehör aus der Preisliste, damit nichts doppelt gepflegt wird | S | 3 |
| F-112 | Format und Weg der Schnittstelle nach dem, was pinncalc anbietet (z. B. GAEB, Datanorm, CSV/Excel-Import, eigene Schnittstelle). Wird mit dem Hersteller geklärt (Z-9). Bis dahin Export als CSV/Excel. | M | 3 |

## 7. Nicht-funktionale Anforderungen

| Nr. | Anforderung |
|---|---|
| N-01 | **Geräte:** Web-App, installierbar auf Handy und Tablet (PWA). Bedienbar ab 360 px Breite ohne seitliches Scrollen. Diktat auf iPhone/iPad und Android. |
| N-02 | **Datenschutz:** Daten in der EU (Frankfurt). Auftragsverarbeitungsverträge mit allen Dienstleistern vor dem ersten echten Datensatz. Die KI bekommt nur die Daten, die sie für die Aufgabe braucht. |
| N-03 | **Sicherheit:** Zugriffsschutz auf Datenbankebene. Keine Schlüssel im Code oder Repository. Postfach-Passwort verschlüsselt gespeichert. Kein Versand ohne Klick. |
| N-04 | **Verlässlichkeit:** Zahlen (Maße, Stück, Preise) werden nie von der KI erzeugt oder umgeschrieben, nur aus Daten übernommen oder vom Nutzer bestätigt. |
| N-05 | **Sicherung:** tägliche Datenbanksicherung. Export aller Vorgänge als Dateien möglich. |
| N-06 | **Bedienung:** Deutsch, wenige Klicks, große Bedienflächen für die Nutzung vor Ort. Funktioniert auch ohne KI (dann manuell). |
| N-07 | **Wartbarkeit:** einfacher Aufbau ohne Build-Schritt, automatische Tests für die Kernabläufe. Dokumentation im Repository. |
| N-08 | **Kosten:** laufende Kosten überschaubar und vorab geschätzt (Abschnitt 10) |

## 8. Technischer Rahmen (Vorschlag)

| Teil | Technik |
|---|---|
| Oberfläche | HTML/CSS/JavaScript ohne Build-Schritt, als PWA installierbar |
| Datenbank, Login, Dateien | Supabase, eigenes Projekt, Region Frankfurt |
| KI | Claude API (Anthropic) über eine Server-Funktion. Der Schlüssel liegt nur auf dem Server. |
| E-Mail | Postfach des Betriebs über IMAP/SMTP. Bis dahin ein Test-Postfach mit erfundenen Händlern. |
| PDF | Erzeugung im Browser bzw. auf dem Server |
| Hosting | Cloudflare Pages oder GitHub Pages, eigene (Sub-)Domain |

## 9. Stufenplan

| Stufe | Inhalt | Ergebnis / Abnahme |
|---|---|---|
| **0 – Einrichtung** | Repository-Gerüst, Supabase-Projekt, Login, Hosting, Testdaten | Login funktioniert, leere App online erreichbar |
| **1 – Pre-Dashboard** | Vorgänge, Endkunden, Positionserfassung (Formular, Diktat, Notiz → KI-Vorschlag), Vorschlagskatalog, Prüfung, 2 erfundene Händler, Anfrage-PDF + Mail-Entwurf, Versand (Mail-Programm oder Test-Postfach), Wiedervorlage 14 Tage, Start-To-do-Liste | Ein kompletter Durchlauf mit erfundenen Daten: Gespräch einsprechen → Positionen prüfen → Anfrage an 2 Händler → Wiedervorlage erscheint. **Zum Vorführen beim Auftraggeber geeignet.** |
| **2 – Postfach & Auswertung** | Postfach-Anbindung, Zuordnung, Vorsortierung, Benachrichtigung, Rückfragen, Angebots-PDF auslesen und abgleichen, Händlervergleich, Zusammenfassung | Erfundene Händlerantwort (Angebot + Rückfrage) kommt an, wird richtig zugeordnet, gemeldet, ausgelesen. Abweichungen sind markiert. |
| **3 – Kundenangebot** | Aufschlag, Zusatzpositionen, Angebots-PDF mit Briefkopf, Versand, Nachfassen beim Endkunden | Aus einem Händlerangebot entsteht ein Kundenangebot ohne Einkaufspreise, korrekt gerechnet |
| **4 – Echtbetrieb** | Echter Merkmalkatalog, echte Händlervorlagen, echtes Postfach, Verträge (AVV), Nutzer anlegen, Einweisung, Offline-Erfassung | Testlauf mit 1–2 echten Vorgängen gemeinsam mit dem Auftraggeber |

Stufen 1–3 laufen ausschließlich mit erfundenen Daten. Echte Daten kommen erst ab Stufe 4, wenn die Verträge stehen.

## 10. Laufende Kosten (grobe Schätzung, pro Monat)

| Posten | Test | Echtbetrieb |
|---|---|---|
| Supabase | 0 € (Free) | ca. 25 $ (Pro: tägliche Sicherung, kein Pausieren) |
| Claude API | wenige € | ca. 10–40 € bei 4 Nutzern, je nach Menge an Mails/PDFs. Ausgabenlimit wird gesetzt. |
| Hosting | 0 € | 0 € (Cloudflare/GitHub Pages) |
| Domain | – | ca. 1–2 € |
| Postfach | vorhanden | vorhanden |

## 11. Zulieferungen des Auftraggebers (offen)

| Nr. | Was | Benötigt ab |
|---|---|---|
| Z-1 | Liste der Großhändler/Hersteller, mit denen er arbeitet | Stufe 4 (Stufe 1 mit erfundenen) |
| Z-2 | 2–3 frühere Anfragen und 2–3 Händlerangebote je Händler (anonymisiert) | Stufe 2/4 |
| Z-3 | Sein Merkmalkatalog (Systeme, Dekore, Gläser, Optionen) | Stufe 4 (vorher Anhang A) |
| Z-4 | Welcher E-Mail-Anbieter (GMX, IONOS, Strato, T-Online, Gmail, Outlook/Microsoft 365?) | Stufe 2 |
| Z-5 | ~~Nutzt er Branchensoftware?~~ **Ja: corpora pinncalc** (25.11.2026) | erledigt |
| Z-6 | Briefkopf, Logo, Angebotstexte, Zahlungsbedingungen, übliche Aufschläge und Montagepauschalen | Stufe 3 |
| Z-7 | Namen und E-Mail-Adressen der 4 Nutzer | Stufe 4 |
| Z-8 | Nutzen Händler Portale statt Mail-Anfragen? | Stufe 2 |
| Z-9 | pinncalc: genaue Bezeichnung, Hersteller, Version, lokal oder Cloud, verfügbare Import-/Exportwege (Kontakt zum Hersteller) | vor Stufe 3 |
| Z-10 | 1–2 heutige Fensterzeichnungen und Fensterlisten (anonymisiert): Was braucht der Lieferant genau? | Stufe 2 |
| Z-11 | Muster-Kundenangebot mit festem Kopf und Schluss sowie gewünschter Aufschlüsselung je Position | Stufe 3 |
| Z-12 | Vollständiger Satz „Die Schnittstelle soll sein …“ aus dem Gespräch | sofort |
| Z-13 | Corpora-Paket, Exportmöglichkeiten, Venturi ja/nein (beim Kunden bzw. PinnCalc erfragen) | vor Phase 3 |
| Z-14 | Wie die Nachkalkulation heute von Hand läuft (Beispiel mit erfundenen Zahlen: welche Zahlen, welche Tabelle) | vor Phase 2 |

## 12. Risiken

| Risiko | Folge | Gegenmaßnahme |
|---|---|---|
| Falsches Maß, falscher Anschlag oder falsches Glas in der Anfrage | Fehlbestellung, nicht rückgabefähig | F-30 bis F-33: mm-Pflicht, Plausibilität, KI erfindet nichts, Bestätigung vor Versand. Abgleich des Händlerangebots (F-61). |
| KI versteht ein Diktat falsch | falsche Position | Immer erst Vorschlag (F-13), unsichere Werte markiert |
| Händler-Wording und -Formate unbekannt | Anfragen wirken fremd oder unvollständig | Neutrale Standardvorlage, je Händler anpassbar, sobald Muster da sind (Z-2) |
| Postfach ist Outlook/Microsoft 365 | Anbindung aufwendiger (Microsoft-Login) | Früh klären (Z-4), Ersatzweg Mail-Programm (F-45) |
| Händler arbeiten über Portale | Mail-Anfrage nicht möglich | Früh klären (Z-8), dann Export zum Abtippen/Hochladen |
| pinncalc bietet keinen passenden Import | Daten müssen doch abgetippt werden | Früh beim Hersteller klären (Z-9). Ausweichweg: CSV/Excel, das pinncalc einlesen kann |
| Doppelte Pflege von Kunden und Preisen | Fehler, Mehrarbeit | pinncalc bleibt führend, das Tool übernimmt nur (F-111) |
| Automatische Zeichnung reicht dem Lieferanten nicht | Lieferant fragt nach | Abgleich mit echten Zeichnungen (Z-10), Bemaßung als PDF (F-19) |
| Endkundendaten (personenbezogen) | DSGVO-Pflichten | Nur erfundene Daten bis Stufe 4, AVV mit allen Dienstleistern, Daten in der EU |
| Manipulierte eingehende Mails | KI tut Ungewolltes | KI liest Mails nur als Information, nichts passiert ohne Klick (F-55) |
| Einzelanfertigung | Wartung, Updates, Ausfall | Wartungs- und Supportvereinbarung zwischen Entwickler und Auftraggeber regeln |

## 13. Offene Entscheidungen

| Nr. | Frage | Vorschlag |
|---|---|---|
| E-1 | Domain für die App | Subdomain des Betriebs, z. B. `angebote.<firma>.de`, oder eine neutrale eigene |
| E-2 | Hosting | Cloudflare Pages (Vorschau je Branch) |
| E-3 | KI schon im Pre-Dashboard (Stufe 1) | Ja: Diktat → Positionen ist der Kern und überzeugt beim Vorführen |
| E-4 | Name der App gegenüber dem Auftraggeber | Arbeitstitel bis zur Abstimmung |
| E-5 | Wo entsteht das Kundenangebot: in pinncalc (das Tool liefert Positionen und Preise zu) oder im Tool (mit Übergabe an pinncalc für Auftrag und Buchhaltung)? | Abhängig von Z-9. Wenn pinncalc gut importieren kann, das Angebot in pinncalc lassen (eine Wahrheit für Kalkulation und Nachkalkulation) |
| E-6 | Rechte an der Software und Pilotvertrag | Rechte bleiben bei Tommy, Pilotkunde erhält Lizenz zum Pilotpreis; Stufen mit Abnahme, Haftungsgrenze, AVV (Details in der Analyse, Abschnitt 6) |
| E-7 | Phase 2: Zeiterfassung + automatische Nachkalkulation vorziehen? | Ja, direkt nach dem Fenster-Modul: Nachkalkulation läuft heute von Hand, großer Nutzen, läuft neben Corpora |

---

## Anhang A – Vorschlag Merkmalkatalog (wird durch Z-3 ersetzt)

> **Ergänzen laut Aufmaßblatt des Pilotkunden:** zweites Maßpaar (Fertigmaß), Öffnung je Feld, Kämpfer/Stulp, Dichtungsfarbe (schwarz/grau),
> Griffoliven, Entwässerung (vorne/unten), Aufdoppelung je Seite in mm, Randverbund (Alu/Kunststoff), Fensterbank außen/innen,
> Rollladenkasten- und Panzerfarbe, Gurtdurchlauf (Mauer/Deckel), Raffstore. Details: `docs/gespraeche/2026-11-25_aufmassblatt.md`.

**Alle Elemente:** Position, Raum/Einbauort, Stückzahl, Breite × Höhe in mm, Maßart (Rohbau-/Lichtmaß
oder Bestellmaß), Bemerkung, Fotos

**Fenster, Balkon- und Terrassentür**

| Merkmal | Werte (Beispiele) |
|---|---|
| Material | Kunststoff · Kunststoff-Alu · Holz · Holz-Alu · Aluminium |
| Profilsystem / Hersteller | Freitext oder Liste des Händlers |
| Farbe/Dekor innen | Weiß · RAL … · Dekor (Kiefer, Eiche hell, Golden Oak, Nussbaum …) |
| Farbe/Dekor außen | Weiß · Anthrazitgrau RAL 7016 · RAL … · Dekor |
| Teilung | 1-flügelig · 2-flügelig · 3-flügelig · Stulp · mit Oberlicht/Unterlicht/Festfeld |
| Öffnungsart je Flügel | Fest · Dreh · Kipp · Dreh-Kipp · Schiebe · Hebe-Schiebe · Parallel-Schiebe-Kipp |
| Anschlag | DIN links · DIN rechts |
| Verglasung | 2-fach · 3-fach · Ug-Wert |
| Glasoptionen | Schallschutz (dB/Klasse) · VSG/ESG (Sicherheit) · Ornament/satiniert · Sonnenschutz |
| Warme Kante | ja/nein · Farbe |
| Sprossen | keine · innenliegend · aufgesetzt (Wiener Sprosse) · Teilung |
| Beschlag | Standard · RC1N · RC2 · verdeckt liegend |
| Griff | Standard · abschließbar · Farbe |
| Rollladen / Raffstore | keiner · Aufsatz · Vorbau · Antrieb (Gurt, Kurbel, Motor, Funk) · Behangfarbe |
| Insektenschutz | keiner · Spannrahmen · Drehrahmen · Rollo |
| Fensterbank innen / außen | keine · Material · Ausladung |
| Anschluss / Montage | Verbreiterung · Anschlussprofile · RAL-Montage · Demontage + Entsorgung Altfenster |

**Haustür / Nebentür**

| Merkmal | Werte (Beispiele) |
|---|---|
| Material | Kunststoff · Aluminium · Holz · Holz-Alu |
| Modell / Füllung | Freitext/Katalog des Händlers · mit/ohne Glas |
| Öffnung | nach innen · nach außen · DIN links/rechts |
| Seitenteile / Oberlicht | keine · links · rechts · beidseitig · Oberlicht |
| Schloss | Mehrfachverriegelung · Automatik · Motorschloss · Fingerprint/Code |
| Griff | Drücker · Stoßgriff (Länge) · Edelstahl/Farbe |
| Schwelle | Standard · barrierefrei |
| Farbe innen / außen | wie Fenster |
| Zubehör | Türschließer · Spion · Briefkastenschlitz · Klingel/Gegensprechanlage-Vorbereitung |

// Erfundene Demo-Daten. Keine echten Personen, Firmen oder Preise.

export const FIRMA = {
  name: 'Fensterbau Muster GmbH',
  strasse: 'Werkstraße 4',
  ort: '12345 Musterstadt',
  tel: '01234 56789-0',
  mail: 'info@fensterbau-muster.example',
};

export const NUTZER = [
  { id: 'mm', name: 'Max Muster', kurz: 'MM' },
  { id: 'ab', name: 'Anna Berg', kurz: 'AB' },
  { id: 'tk', name: 'Tim Kern', kurz: 'TK' },
  { id: 'sl', name: 'Sabine Lang', kurz: 'SL' },
];

export const KATALOG = {
  art: ['Fenster', 'Balkontür', 'Terrassentür', 'Hebe-Schiebe-Tür', 'Haustür', 'Nebentür'],
  material: ['Kunststoff', 'Kunststoff-Alu', 'Holz', 'Holz-Alu', 'Aluminium'],
  teilung: ['1-flügelig', '2-flügelig', '2-flügelig Stulp', '3-flügelig', 'mit Oberlicht', 'mit Seitenteil'],
  oeffnung: ['Dreh-Kipp', 'Dreh', 'Kipp', 'Fest', 'Stulp (Dreh-Kipp/Dreh)', 'Hebe-Schiebe', 'nach innen öffnend', 'nach außen öffnend'],
  anschlag: ['DIN links', 'DIN rechts'],
  glas: ['2-fach', '3-fach'],
  glasOpt: ['Schallschutz', 'VSG (Sicherheitsglas)', 'ESG', 'Ornament/satiniert', 'Sonnenschutz'],
  farbe: ['Weiß', 'Cremeweiß RAL 9001', 'Anthrazitgrau RAL 7016', 'Kiefer', 'Eiche hell', 'Golden Oak', 'Nussbaum'],
  sprossen: ['keine', 'innenliegend', 'aufgesetzt (Wiener Sprosse)'],
  beschlag: ['Standard', 'RC2', 'verdeckt liegend', 'Mehrfachverriegelung'],
  rollladen: ['keiner', 'Aufsatz, Gurt', 'Aufsatz, Motor', 'Vorbau, Funk', 'Raffstore'],
  masstyp: ['Bestellmaß', 'Rohbaumaß'],
};

export const FELDER = {
  raum: 'Raum', art: 'Element', stk: 'Stück', b: 'Breite', h: 'Höhe', masstyp: 'Maßart',
  material: 'Material', farbeInnen: 'Farbe innen', farbeAussen: 'Farbe außen', teilung: 'Teilung',
  oeffnung: 'Öffnung', anschlag: 'Anschlag', glas: 'Verglasung', glasOpt: 'Glasoption',
  sprossen: 'Sprossen', beschlag: 'Beschlag', rollladen: 'Rollladen', bemerkung: 'Bemerkung',
};

export const STATUS = {
  erfassung: { text: 'Erfassung', ton: 'grau' },
  angefragt: { text: 'Angefragt', ton: 'blau' },
  rueckfrage: { text: 'Rückfrage offen', ton: 'rot' },
  angebot: { text: 'Angebot prüfen', ton: 'violett' },
  kundenangebot: { text: 'Kundenangebot in Arbeit', ton: 'gelb' },
  gesendet: { text: 'Beim Kunden', ton: 'gelb' },
  beauftragt: { text: 'Beauftragt', ton: 'gruen' },
};

export const ABLAUF = ['erfassung', 'angefragt', 'angebot', 'kundenangebot', 'gesendet', 'beauftragt'];

// Datum relativ zu heute, damit die Demo immer „frisch“ aussieht
const tag = (n) => { const d = new Date(); d.setHours(9, 30, 0, 0); d.setDate(d.getDate() + n); return d.toISOString(); };

const fensterHA = { material: 'Holz-Alu', farbeInnen: 'Kiefer', farbeAussen: 'Anthrazitgrau RAL 7016', glas: '3-fach', masstyp: 'Bestellmaß', sprossen: 'keine', beschlag: 'Standard', rollladen: 'keiner', glasOpt: '' };
const fensterKW = { material: 'Kunststoff', farbeInnen: 'Weiß', farbeAussen: 'Weiß', glas: '3-fach', masstyp: 'Bestellmaß', sprossen: 'keine', beschlag: 'Standard', rollladen: 'Aufsatz, Gurt', glasOpt: '' };
const fensterKA = { material: 'Kunststoff-Alu', farbeInnen: 'Weiß', farbeAussen: 'Anthrazitgrau RAL 7016', glas: '3-fach', masstyp: 'Bestellmaß', sprossen: 'keine', beschlag: 'Standard', rollladen: 'keiner', glasOpt: '' };

function pos(nr, basis, rest) {
  return { nr, stk: 1, art: 'Fenster', teilung: '1-flügelig', oeffnung: 'Dreh-Kipp', anschlag: '', bemerkung: '', ...basis, ...rest };
}

export function startDaten() {
  const haendler = [
    { id: 'nord', name: 'Nordfenster Großhandel GmbH', kurz: 'Nordfenster', kontakt: 'Herr Brandt', anrede: 'Sehr geehrter Herr Brandt', email: 'anfrage@nordfenster.example', stil: 'formal', format: 'PDF-Positionsliste', frist: 14, systeme: 'Kunststoff, Kunststoff-Alu, Holz-Alu, HST', farbe: '#2563eb' },
    { id: 'sued', name: 'Bauelemente Süd KG', kurz: 'Bauelemente Süd', kontakt: 'Frau Lehner', anrede: 'Hallo Frau Lehner', email: 'angebote@bauelemente-sued.example', stil: 'kurz', format: 'Excel-Liste', frist: 10, systeme: 'Kunststoff, Holz-Alu, Haustüren', farbe: '#059669' },
    { id: 'becker', name: 'Becker Holz-Alu-Werk', kurz: 'Becker', kontakt: 'Herr Becker', anrede: 'Guten Tag Herr Becker', email: 'vertrieb@becker-holzalu.example', stil: 'technisch', format: 'PDF mit Uw-Werten', frist: 14, systeme: 'Holz, Holz-Alu, Aluminium, Haustüren', farbe: '#b45309' },
  ];

  const vorgaenge = [
    {
      id: 'V-2026-041', kunde: 'Familie Huber', ansprech: 'Petra Huber', tel: '0171 0000041', email: 'huber@mail.example',
      adresse: 'Am Mühlbach 7, 12345 Musterstadt', art: 'Sanierung Einfamilienhaus', status: 'rueckfrage', nutzer: 'mm', angelegt: tag(-19),
      notiz: 'Kundin wünscht ruhige Optik, keine Sprossen. Montage möglichst vor Ostern.',
      positionen: [
        pos(1, fensterHA, { raum: 'Wohnzimmer', stk: 2, b: 1230, h: 1480, teilung: '2-flügelig Stulp', oeffnung: 'Stulp (Dreh-Kipp/Dreh)', anschlag: 'DIN rechts', rollladen: 'Aufsatz, Motor' }),
        pos(2, fensterHA, { raum: 'Küche', b: 1010, h: 1235, anschlag: 'DIN links' }),
        pos(3, fensterHA, { raum: 'Bad', b: 610, h: 810, anschlag: 'DIN rechts', glasOpt: 'Ornament/satiniert' }),
        pos(4, fensterHA, { raum: 'Schlafzimmer', b: 1010, h: 1360, anschlag: 'DIN links' }),
        pos(5, fensterHA, { raum: 'Kinderzimmer', b: 1010, h: 1360, anschlag: 'DIN rechts' }),
        pos(6, fensterHA, { raum: 'Wohnzimmer', art: 'Hebe-Schiebe-Tür', b: 2980, h: 2200, teilung: '2-flügelig', oeffnung: 'Hebe-Schiebe', anschlag: 'DIN links', bemerkung: 'Schwelle barrierearm' }),
        pos(7, fensterHA, { raum: 'Flur', art: 'Haustür', b: 1100, h: 2100, teilung: 'mit Seitenteil', oeffnung: 'nach innen öffnend', anschlag: 'DIN links', beschlag: 'Mehrfachverriegelung', bemerkung: 'Füllung mit Glasausschnitt, Stoßgriff 1200 mm' }),
      ],
    },
    {
      id: 'V-2026-043', kunde: 'Familie Kaya', ansprech: 'Deniz Kaya', tel: '0172 0000043', email: 'kaya@mail.example',
      adresse: 'Lindenweg 22, 12347 Musterdorf', art: 'Neubau Doppelhaushälfte', status: 'angefragt', nutzer: 'ab', angelegt: tag(-17),
      notiz: 'Bauträger-Abnahme im März. Fenster weiß/weiß, Rollläden mit Gurt.',
      positionen: [
        pos(1, fensterKW, { raum: 'Wohnen/Essen', stk: 3, b: 1260, h: 1385, anschlag: 'DIN rechts' }),
        pos(2, fensterKW, { raum: 'Wohnen/Essen', art: 'Terrassentür', b: 1010, h: 2185, oeffnung: 'Dreh-Kipp', anschlag: 'DIN links' }),
        pos(3, fensterKW, { raum: 'Küche', b: 1010, h: 1010, anschlag: 'DIN links' }),
        pos(4, fensterKW, { raum: 'Schlafzimmer OG', stk: 2, b: 885, h: 1260, anschlag: 'DIN rechts' }),
        pos(5, fensterKW, { raum: 'Bad OG', b: 760, h: 885, anschlag: 'DIN rechts', glasOpt: 'Ornament/satiniert', rollladen: 'keiner' }),
      ],
    },
    {
      id: 'V-2026-044', kunde: 'Herr Schmid', ansprech: 'Jonas Schmid', tel: '0173 0000044', email: 'schmid@mail.example',
      adresse: 'Bahnhofstraße 3, 12345 Musterstadt', art: 'Haustür + Nebentüren', status: 'angebot', nutzer: 'tk', angelegt: tag(-12),
      notiz: 'Haustür in Anthrazit, möglichst einbruchhemmend.',
      positionen: [
        pos(1, { ...fensterHA, material: 'Aluminium', farbeInnen: 'Weiß', farbeAussen: 'Anthrazitgrau RAL 7016' }, { raum: 'Eingang', art: 'Haustür', b: 1150, h: 2150, teilung: '1-flügelig', oeffnung: 'nach innen öffnend', anschlag: 'DIN rechts', beschlag: 'RC2', bemerkung: 'Motorschloss mit Fingerprint' }),
        pos(2, { ...fensterHA, material: 'Aluminium', farbeInnen: 'Weiß', farbeAussen: 'Anthrazitgrau RAL 7016', glas: '2-fach' }, { raum: 'Keller', art: 'Nebentür', b: 985, h: 2000, oeffnung: 'nach außen öffnend', anschlag: 'DIN links', beschlag: 'Mehrfachverriegelung' }),
        pos(3, { ...fensterHA, material: 'Aluminium', farbeInnen: 'Weiß', farbeAussen: 'Anthrazitgrau RAL 7016', glas: '2-fach' }, { raum: 'Garage', art: 'Nebentür', b: 985, h: 2000, oeffnung: 'nach außen öffnend', anschlag: 'DIN rechts', beschlag: 'Mehrfachverriegelung' }),
      ],
    },
    {
      id: 'V-2026-045', kunde: 'Frau Wagner', ansprech: 'Laura Wagner', tel: '0174 0000045', email: 'wagner@mail.example',
      adresse: 'Seeblick 15, 12349 Musterhausen', art: 'Wintergarten-Anschluss', status: 'erfassung', nutzer: 'mm', angelegt: tag(-1),
      notiz: 'Vor Ort aufgenommen, Farbe außen noch mit dem Mann klären.',
      positionen: [
        pos(1, { ...fensterKA, farbeAussen: '' }, { raum: 'Wohnzimmer', art: 'Hebe-Schiebe-Tür', b: 3500, h: 2300, teilung: '2-flügelig', oeffnung: 'Hebe-Schiebe', anschlag: '' }),
        pos(2, { ...fensterKA, farbeAussen: '' }, { raum: 'Wohnzimmer', stk: 2, b: 1010, h: 1485, anschlag: 'DIN links' }),
      ],
    },
    {
      id: 'V-2026-038', kunde: 'Familie Novak', ansprech: 'Eva Novak', tel: '0175 0000038', email: 'novak@mail.example',
      adresse: 'Kirchplatz 9, 12345 Musterstadt', art: 'Fenstertausch Altbau', status: 'gesendet', nutzer: 'sl', angelegt: tag(-34),
      notiz: 'Denkmalnähe: Wiener Sprossen gewünscht.',
      positionen: [
        pos(1, { ...fensterKA, sprossen: 'aufgesetzt (Wiener Sprosse)' }, { raum: 'Wohnzimmer', stk: 2, b: 1135, h: 1510, teilung: '2-flügelig Stulp', oeffnung: 'Stulp (Dreh-Kipp/Dreh)', anschlag: 'DIN rechts' }),
        pos(2, { ...fensterKA, sprossen: 'aufgesetzt (Wiener Sprosse)' }, { raum: 'Schlafzimmer', stk: 2, b: 885, h: 1385, anschlag: 'DIN links' }),
      ],
    },
    {
      id: 'V-2026-031', kunde: 'Herr Berger', ansprech: 'Lukas Berger', tel: '0176 0000031', email: 'berger@mail.example',
      adresse: 'Feldweg 2, 12350 Musterau', art: 'Kellerfenster', status: 'beauftragt', nutzer: 'tk', angelegt: tag(-52),
      notiz: 'Auftrag erteilt, Montage KW 4.',
      positionen: [
        pos(1, fensterKW, { raum: 'Keller', stk: 4, b: 800, h: 600, oeffnung: 'Kipp', anschlag: '', rollladen: 'keiner', glas: '2-fach' }),
      ],
    },
  ];

  const anfragen = [
    { id: 'A1', vorgang: 'V-2026-041', haendler: 'nord', gesendet: tag(-16), wv: tag(-2), status: 'rueckfrage', positionen: [1, 2, 3, 4, 5, 6, 7] },
    { id: 'A2', vorgang: 'V-2026-041', haendler: 'sued', gesendet: tag(-16), wv: tag(-6), status: 'angebot', positionen: [1, 2, 3, 4, 5, 6, 7] },
    { id: 'A3', vorgang: 'V-2026-043', haendler: 'sued', gesendet: tag(-14), wv: tag(0), status: 'gesendet', positionen: [1, 2, 3, 4, 5] },
    { id: 'A4', vorgang: 'V-2026-043', haendler: 'nord', gesendet: tag(-14), wv: tag(0), status: 'angebot', positionen: [1, 2, 3, 4, 5] },
    { id: 'A8', vorgang: 'V-2026-043', haendler: 'becker', gesendet: tag(-4), wv: tag(10), status: 'gesendet', positionen: [1, 2, 3, 4, 5] },
    { id: 'A5', vorgang: 'V-2026-044', haendler: 'becker', gesendet: tag(-9), wv: tag(5), status: 'angebot', positionen: [1, 2, 3] },
    { id: 'A6', vorgang: 'V-2026-038', haendler: 'nord', gesendet: tag(-30), wv: null, status: 'angebot', positionen: [1, 2] },
    { id: 'A7', vorgang: 'V-2026-031', haendler: 'sued', gesendet: tag(-48), wv: null, status: 'angebot', positionen: [1] },
  ];

  const angebote = [
    { id: 'O1', vorgang: 'V-2026-041', haendler: 'sued', nummer: 'AN-26-4471', datum: tag(-6), gueltig: tag(24), lieferzeit: '8–9 Wochen', zahlung: '14 Tage 2 % Skonto',
      pos: [
        { nr: 1, preis: 1465, abw: [{ feld: 'rollladen', angefragt: 'Aufsatz, Motor', angeboten: 'Aufsatz, Gurt' }] },
        { nr: 2, preis: 890, abw: [] }, { nr: 3, preis: 640, abw: [] }, { nr: 4, preis: 925, abw: [] },
        { nr: 5, preis: 925, abw: [] }, { nr: 6, preis: 6850, abw: [] }, { nr: 7, preis: 3980, abw: [] },
      ] },
    { id: 'O2', vorgang: 'V-2026-043', haendler: 'nord', nummer: 'NF-118204', datum: tag(-3), gueltig: tag(27), lieferzeit: '6 Wochen', zahlung: '30 Tage netto',
      pos: [{ nr: 1, preis: 545, abw: [] }, { nr: 2, preis: 980, abw: [] }, { nr: 3, preis: 470, abw: [] }, { nr: 4, preis: 455, abw: [] }, { nr: 5, preis: 410, abw: [] }] },
    { id: 'O3', vorgang: 'V-2026-044', haendler: 'becker', nummer: 'B-2026-0932', datum: tag(-1), gueltig: tag(29), lieferzeit: '10 Wochen', zahlung: '30 Tage netto',
      pos: [
        { nr: 1, preis: 5480, abw: [{ feld: 'glas', angefragt: '3-fach', angeboten: '2-fach' }] },
        { nr: 2, preis: 1890, abw: [] },
        { nr: 3, preis: 1890, abw: [] },
      ] },
    { id: 'O4', vorgang: 'V-2026-038', haendler: 'nord', nummer: 'NF-117655', datum: tag(-15), gueltig: tag(15), lieferzeit: '7 Wochen', zahlung: '30 Tage netto',
      pos: [{ nr: 1, preis: 1640, abw: [] }, { nr: 2, preis: 1020, abw: [] }] },
    { id: 'O5', vorgang: 'V-2026-031', haendler: 'sued', nummer: 'AN-26-3902', datum: tag(-44), gueltig: tag(-14), lieferzeit: '5 Wochen', zahlung: '14 Tage 2 % Skonto',
      pos: [{ nr: 1, preis: 290, abw: [] }] },
  ];

  const mails = [
    { id: 'M1', richtung: 'ein', vorgang: 'V-2026-041', von: 'nord', datum: tag(-2), gelesen: false, kategorie: 'Rückfrage',
      betreff: 'AW: Anfrage V-2026-041 – Huber, Sanierung EFH – 7 Pos.',
      text: 'Sehr geehrte Damen und Herren,\n\nvielen Dank für Ihre Anfrage. Bevor wir anbieten können, zwei Punkte:\n\n1. Pos. 4 (Schlafzimmer): Anschlag DIN links – laut Skizze sitzt das Fenster links an der Wand, der Griff wäre dann wandseitig. Bitte prüfen.\n2. Pos. 6 (HST): Welches Schema benötigen Sie – A (links fest, rechts schiebend) oder C (links schiebend, rechts fest)?\n\nMit freundlichen Grüßen\nK. Brandt\nNordfenster Großhandel GmbH',
      ki: 'Nordfenster braucht 2 Angaben: Anschlag Pos. 4 prüfen (Griff evtl. wandseitig) und Schema der Hebe-Schiebe-Tür Pos. 6 (A oder C).' },
    { id: 'M2', richtung: 'ein', vorgang: 'V-2026-044', von: 'becker', datum: tag(-1), gelesen: false, kategorie: 'Angebot', anhang: 'Angebot_B-2026-0932.pdf',
      betreff: 'Angebot B-2026-0932 zu Ihrer Anfrage V-2026-044 Schmid',
      text: 'Guten Tag,\n\nanbei unser Angebot B-2026-0932 für die Haustür und zwei Nebentüren. Lieferzeit ca. 10 Wochen ab technischer Klärung.\n\nHinweis: Die Haustür bieten wir mit 2-fach-Verglasung an, da das gewählte Modell mit Glasausschnitt nicht in 3-fach lieferbar ist.\n\nFreundliche Grüße\nM. Becker',
      ki: 'Angebot über 9.260 € netto, Lieferzeit 10 Wochen. Achtung: Haustür nur mit 2-fach-Glas statt angefragtem 3-fach (Modell nicht anders lieferbar).' },
    { id: 'M3', richtung: 'ein', vorgang: 'V-2026-041', von: 'sued', datum: tag(-6), gelesen: true, kategorie: 'Angebot', anhang: 'AN-26-4471.xlsx',
      betreff: 'Angebot AN-26-4471 // V-2026-041 Huber',
      text: 'Hallo,\n\nanbei Preise und Lieferzeit (8–9 Wochen). Rollladen bei Pos. 1 haben wir mit Gurt kalkuliert, Motor wäre Aufpreis 240 € je Stück.\n\nGruß\nS. Lehner',
      ki: 'Angebot über 16.065 € netto, Lieferzeit 8–9 Wochen. Abweichung: Rollladen Pos. 1 mit Gurt statt Motor (Motor +240 €/Stk.).' },
    { id: 'M4', richtung: 'ein', vorgang: 'V-2026-043', von: 'nord', datum: tag(-3), gelesen: true, kategorie: 'Angebot', anhang: 'NF-118204.pdf',
      betreff: 'AW: Anfrage V-2026-043 – Kaya, Neubau DHH – 5 Pos.',
      text: 'Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie unser Angebot NF-118204. Lieferzeit derzeit 6 Wochen.\n\nMit freundlichen Grüßen\nK. Brandt',
      ki: 'Angebot über 4.645 € netto, Lieferzeit 6 Wochen. Keine Abweichungen zur Anfrage gefunden.' },
    { id: 'M5', richtung: 'ein', vorgang: 'V-2026-043', von: 'kunde', absender: 'Deniz Kaya', datum: tag(-1), gelesen: false, kategorie: 'Kunde',
      betreff: 'Frage zu unseren Fenstern',
      text: 'Hallo,\n\nkönnten wir beim Bad oben doch noch einen Rollladen bekommen? Und gibt es schon einen Liefertermin?\n\nViele Grüße\nDeniz Kaya',
      ki: 'Kundin möchte bei Pos. 5 (Bad OG) zusätzlich einen Rollladen und fragt nach dem Liefertermin.' },
    { id: 'M6', richtung: 'ein', vorgang: null, von: 'nord', datum: tag(-1), gelesen: true, kategorie: 'Werbung',
      betreff: 'Winteraktion: 5 % auf alle Haustüren bis 31.01.',
      text: 'Newsletter: Sichern Sie sich jetzt 5 % Rabatt auf alle Haustür-Modelle …',
      ki: 'Newsletter von Nordfenster: 5 % auf Haustüren bis 31.01. Kein Handlungsbedarf.' },
    { id: 'M7', richtung: 'ein', vorgang: 'V-2026-031', von: 'sued', datum: tag(-4), gelesen: true, kategorie: 'Auftragsbestätigung', anhang: 'AB-26-3902.pdf',
      betreff: 'Auftragsbestätigung AB-26-3902 // V-2026-031 Berger',
      text: 'Hallo,\n\nanbei die Auftragsbestätigung. Liefertermin KW 3.\n\nGruß\nS. Lehner',
      ki: 'Auftragsbestätigung für 4 Kellerfenster, Liefertermin KW 3. Bitte mit Bestellung abgleichen.' },
    { id: 'M8', richtung: 'aus', vorgang: 'V-2026-041', an: 'nord', datum: tag(-16), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-041 – Huber, Sanierung EFH – 7 Pos.', text: '(Anfrage mit Positionsliste als PDF)' },
    { id: 'M9', richtung: 'aus', vorgang: 'V-2026-041', an: 'sued', datum: tag(-16), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-041 – Huber, Sanierung EFH – 7 Pos.', text: '(Anfrage mit Positionsliste als Excel)' },
    { id: 'M10', richtung: 'aus', vorgang: 'V-2026-043', an: 'sued', datum: tag(-14), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-043 – Kaya, Neubau DHH – 5 Pos.', text: '(Anfrage mit Positionsliste als Excel)' },
    { id: 'M11', richtung: 'aus', vorgang: 'V-2026-043', an: 'nord', datum: tag(-14), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-043 – Kaya, Neubau DHH – 5 Pos.', text: '(Anfrage mit Positionsliste als PDF)' },
    { id: 'M14', richtung: 'aus', vorgang: 'V-2026-043', an: 'becker', datum: tag(-4), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-043 – Kaya, Neubau DHH – 5 Pos.', text: '(Anfrage mit Positionsliste als PDF)' },
    { id: 'M12', richtung: 'aus', vorgang: 'V-2026-044', an: 'becker', datum: tag(-9), kategorie: 'Anfrage', betreff: 'Anfrage V-2026-044 – Schmid, Haustür + Nebentüren – 3 Pos.', text: '(Anfrage mit Positionsliste als PDF)' },
    { id: 'M13', richtung: 'aus', vorgang: 'V-2026-038', an: 'kunde', datum: tag(-8), kategorie: 'Kundenangebot', betreff: 'Ihr Angebot für neue Fenster – Kirchplatz 9', text: '(Kundenangebot als PDF)' },
  ];

  const kundenangebote = {
    'V-2026-041': { angebot: 'O1', aufschlag: 28, montage: true, demontage: true, fensterbank: false },
    'V-2026-038': { angebot: 'O4', aufschlag: 30, montage: true, demontage: true, fensterbank: true, gesendet: tag(-8) },
  };

  const wiedervorlagen = [
    { id: 'W1', vorgang: 'V-2026-038', faellig: tag(-1), text: 'Familie Novak: Rückmeldung zum Kundenangebot nachfassen', art: 'kunde' },
  ];

  return { version: 1, haendler, vorgaenge, anfragen, angebote, mails, kundenangebote, wiedervorlagen, erledigt: [], zaehler: 46 };
}

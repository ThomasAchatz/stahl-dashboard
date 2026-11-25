// Simulierte KI für die Vorschau. Später ersetzt durch Claude über eine Server-Funktion.
// Grundsatz bleibt gleich: Maße und Stückzahlen werden nur übernommen, nie erfunden.

import { FELDER } from './daten.js';

const ZAHLWORT = { ein: 1, eine: 1, einen: 1, eins: 1, zwei: 2, drei: 3, vier: 4, 'fünf': 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10 };
const RAEUME = ['Wohnzimmer', 'Esszimmer', 'Wohnen/Essen', 'Küche', 'Badezimmer', 'Bad', 'Gäste-WC', 'WC', 'Schlafzimmer', 'Kinderzimmer', 'Arbeitszimmer', 'Büro', 'Flur', 'Diele', 'Treppenhaus', 'Keller', 'Hauswirtschaftsraum', 'Gästezimmer', 'Wintergarten', 'Eingang', 'Garage', 'Dachgeschoss', 'Terrasse'];
const RAUM_RE = new RegExp('\\b(' + RAEUME.map((r) => r.replace('/', '\\/')).join('|') + ')\\b', 'gi');

function farbeAus(t) {
  if (/kiefer/.test(t)) return 'Kiefer';
  if (/golden\s*oak/.test(t)) return 'Golden Oak';
  if (/eiche/.test(t)) return 'Eiche hell';
  if (/nuss/.test(t)) return 'Nussbaum';
  if (/anthrazit|7016/.test(t)) return 'Anthrazitgrau RAL 7016';
  if (/creme|9001/.test(t)) return 'Cremeweiß RAL 9001';
  if (/wei(ß|ss)/.test(t)) return 'Weiß';
  return '';
}

function segmente(text) {
  const grob = text.replace(/\r/g, '').split(/\n+|;|\.\s+(?=[A-ZÄÖÜ])|\.$/);
  const fein = [];
  for (const g of grob) {
    const s = g.trim();
    if (!s) continue;
    // Ein neuer Raum beginnt eine neue Position (Diktat hat oft keine Satzzeichen)
    const idx = [];
    s.replace(RAUM_RE, (m, _r, off) => { idx.push(off); return m; });
    if (idx.length <= 1) { fein.push(s); continue; }
    if (idx[0] > 0) fein.push(s.slice(0, idx[0]).trim());
    idx.forEach((start, i) => fein.push(s.slice(start, idx[i + 1] ?? s.length).trim()));
  }
  return fein.filter(Boolean);
}

function lies(seg) {
  const t = seg.toLowerCase();
  const p = {};
  const q = {}; // Herkunft je Feld: 'gesagt' | 'unsicher' | 'umgerechnet'
  let rest = t;

  const raum = seg.match(RAUM_RE);
  if (raum) { p.raum = RAEUME.find((r) => r.toLowerCase() === raum[0].toLowerCase()) || raum[0]; q.raum = 'gesagt'; }

  let m = t.match(/(\d{3,4})\s*(?:x|×|mal|auf)\s*(\d{3,4})/);
  if (m) { p.b = +m[1]; p.h = +m[2]; q.b = q.h = 'gesagt'; rest = rest.replace(m[0], ' '); }
  else if ((m = t.match(/(\d)[,.](\d{1,2})\s*(?:m\s*)?(?:x|×|mal|auf)\s*(\d)[,.](\d{1,2})/))) {
    p.b = Math.round(parseFloat(m[1] + '.' + m[2]) * 1000); p.h = Math.round(parseFloat(m[3] + '.' + m[4]) * 1000);
    q.b = q.h = 'umgerechnet'; rest = rest.replace(m[0], ' ');
  }

  if (/haust(ü|ue)r|eingangst(ü|ue)r/.test(t)) p.art = 'Haustür';
  else if (/nebent(ü|ue)r|kellert(ü|ue)r/.test(t)) p.art = 'Nebentür';
  else if (/hebe[\s-]?schiebe|\bhst\b/.test(t)) p.art = 'Hebe-Schiebe-Tür';
  else if (/terrassent(ü|ue)r/.test(t)) p.art = 'Terrassentür';
  else if (/balkont(ü|ue)r/.test(t)) p.art = 'Balkontür';
  else if (/fenster|dreh[\s-]?kipp|\bdk\b|flügel|festverglas/.test(t) || p.b) p.art = 'Fenster';
  if (p.art) q.art = 'gesagt';

  if ((m = t.match(/(ein|zwei|drei|1|2|3)[\s-]?flügel(ig)?/))) {
    const n = { ein: 1, zwei: 2, drei: 3 }[m[1]] || +m[1];
    p.teilung = n + '-flügelig' + (/stulp/.test(t) && n === 2 ? ' Stulp' : ''); q.teilung = 'gesagt';
    rest = rest.replace(m[0], ' ');
  } else if (/stulp/.test(t)) { p.teilung = '2-flügelig Stulp'; q.teilung = 'gesagt'; }
  else if (/seitenteil/.test(t)) { p.teilung = 'mit Seitenteil'; q.teilung = 'gesagt'; }
  else if (/oberlicht/.test(t)) { p.teilung = 'mit Oberlicht'; q.teilung = 'gesagt'; }

  if ((m = t.match(/(drei|3)[\s-]?fach|dreifach/))) { p.glas = '3-fach'; q.glas = 'gesagt'; rest = rest.replace(m[0], ' '); }
  else if ((m = t.match(/(zwei|2)[\s-]?fach|zweifach/))) { p.glas = '2-fach'; q.glas = 'gesagt'; rest = rest.replace(m[0], ' '); }

  if (/holz[\s-]?alu/.test(t)) p.material = 'Holz-Alu';
  else if (/kunststoff[\s-]?alu/.test(t)) p.material = 'Kunststoff-Alu';
  else if (/kunststoff|pvc/.test(t)) p.material = 'Kunststoff';
  else if (/\bholz\b/.test(t)) p.material = 'Holz';
  else if (/\balu(minium)?\b/.test(t)) p.material = 'Aluminium';
  if (p.material) q.material = 'gesagt';

  const innen = t.match(/innen\s+([a-zäöüß0-9\s-]{2,30}?)(?=,|\.|au(ß|ss)en|\bund\b|$)/);
  const aussen = t.match(/au(?:ß|ss)en\s+([a-zäöüß0-9\s-]{2,30}?)(?=,|\.|innen|\bund\b|$)/);
  if (innen && farbeAus(innen[1])) { p.farbeInnen = farbeAus(innen[1]); q.farbeInnen = 'gesagt'; }
  if (aussen && farbeAus(aussen[1])) { p.farbeAussen = farbeAus(aussen[1]); q.farbeAussen = 'gesagt'; }
  if (!innen && !aussen) {
    const f = farbeAus(t.replace(/milchglas|wei(ß|ss)e?\s+kante/g, ''));
    if (f && /(farbe|wei(ß|ss)|anthrazit|kiefer|eiche|golden|nuss|creme)/.test(t)) {
      p.farbeInnen = p.farbeAussen = f; q.farbeInnen = q.farbeAussen = 'gesagt';
    }
  }

  if (/hebe[\s-]?schiebe|\bhst\b/.test(t)) p.oeffnung = 'Hebe-Schiebe';
  else if (/stulp/.test(t)) p.oeffnung = 'Stulp (Dreh-Kipp/Dreh)';
  else if (/dreh[\s-]?kipp|\bdk\b/.test(t)) p.oeffnung = 'Dreh-Kipp';
  else if (/festverglas|\bfest\b|\bfix\b/.test(t)) p.oeffnung = 'Fest';
  else if (/nur\s+kipp|kippfenster/.test(t)) p.oeffnung = 'Kipp';
  else if (/nach\s+innen/.test(t)) p.oeffnung = 'nach innen öffnend';
  else if (/nach\s+au(ß|ss)en/.test(t)) p.oeffnung = 'nach außen öffnend';
  if (p.oeffnung) q.oeffnung = 'gesagt';

  if (/(din|anschlag)\s*links|links\s+angeschlagen/.test(t)) { p.anschlag = 'DIN links'; q.anschlag = 'gesagt'; }
  else if (/(din|anschlag)\s*rechts|rechts\s+angeschlagen/.test(t)) { p.anschlag = 'DIN rechts'; q.anschlag = 'gesagt'; }
  else if (/\blinks\b/.test(t)) { p.anschlag = 'DIN links'; q.anschlag = 'unsicher'; }
  else if (/\brechts\b/.test(t)) { p.anschlag = 'DIN rechts'; q.anschlag = 'unsicher'; }

  const opt = [];
  if (/schallschutz/.test(t)) opt.push('Schallschutz');
  if (/\bvsg\b|sicherheitsglas/.test(t)) opt.push('VSG (Sicherheitsglas)');
  if (/\besg\b/.test(t)) opt.push('ESG');
  if (/ornament|satinier|milchglas/.test(t)) opt.push('Ornament/satiniert');
  if (/sonnenschutz/.test(t)) opt.push('Sonnenschutz');
  if (opt.length) { p.glasOpt = opt.join(', '); q.glasOpt = 'gesagt'; }

  if (/raffstore|jalousie/.test(t)) { p.rollladen = 'Raffstore'; q.rollladen = 'gesagt'; }
  else if (/roll+(l|)aden|rollo/.test(t)) {
    if (/funk/.test(t)) { p.rollladen = 'Vorbau, Funk'; q.rollladen = 'gesagt'; }
    else if (/motor|elektr/.test(t)) { p.rollladen = 'Aufsatz, Motor'; q.rollladen = 'gesagt'; }
    else if (/gurt/.test(t)) { p.rollladen = 'Aufsatz, Gurt'; q.rollladen = 'gesagt'; }
    else { p.rollladen = 'Aufsatz, Gurt'; q.rollladen = 'unsicher'; }
  }

  if (/\brc\s?2\b|einbruch/.test(t)) { p.beschlag = 'RC2'; q.beschlag = 'gesagt'; }
  else if (/mehrfachverriegel/.test(t)) { p.beschlag = 'Mehrfachverriegelung'; q.beschlag = 'gesagt'; }
  if (/wiener\s*sprosse/.test(t)) { p.sprossen = 'aufgesetzt (Wiener Sprosse)'; q.sprossen = 'gesagt'; }
  else if (/sprosse/.test(t)) { p.sprossen = 'innenliegend'; q.sprossen = 'unsicher'; }
  if (/rohbau|lichtma/.test(t)) { p.masstyp = 'Rohbaumaß'; q.masstyp = 'gesagt'; }
  else if (/bestellma|fertigma/.test(t)) { p.masstyp = 'Bestellmaß'; q.masstyp = 'gesagt'; }

  // Stückzahl: Zahl vor dem Element, Maße/Teilung/Glas sind schon entfernt
  m = rest.match(/\b(\d{1,2}|ein|eine|einen|zwei|drei|vier|fünf|sechs|sieben|acht)\s+(?:stück\s+)?(?:[a-zäöüß-]+\s+)?(fenster|dreh[\s-]?kipp|balkont|terrassent|haust|nebent|t(ü|ue)ren|elemente|hst|hebe)/);
  if (m) { p.stk = ZAHLWORT[m[1]] || +m[1]; q.stk = 'gesagt'; }

  const kunde = seg.match(/\b(Familie|Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß-]+)/);
  const projekt = seg.match(/(sanierung|neubau|altbau|renovierung|fenstertausch)[a-zäöüß\s-]*/i);

  const istElement = !!(p.b || p.art || (p.oeffnung && p.oeffnung !== 'nach innen öffnend'));
  return { p, q, istElement, kunde: kunde ? kunde[0] : '', projekt: projekt ? projekt[0].trim() : '' };
}

const ERBEN = ['material', 'farbeInnen', 'farbeAussen', 'glas', 'masstyp', 'sprossen', 'beschlag'];

export function pflichtFelder(p) {
  const f = ['b', 'h', 'material', 'farbeInnen', 'farbeAussen', 'oeffnung', 'glas'];
  if (p.oeffnung && !['Fest', 'Kipp'].includes(p.oeffnung)) f.push('anschlag');
  return f;
}

export function fehlend(p) {
  return pflichtFelder(p).filter((k) => !p[k]);
}

export function plausibel(p) {
  const w = [];
  if (p.b && (p.b < 300 || p.b > 6000)) w.push(`Breite ${p.b} mm ungewöhnlich`);
  if (p.h && (p.h < 300 || p.h > 3500)) w.push(`Höhe ${p.h} mm ungewöhnlich`);
  if (['Haustür', 'Nebentür', 'Balkontür', 'Terrassentür'].includes(p.art) && p.b && p.h && p.b > p.h) w.push('Tür breiter als hoch – Breite/Höhe vertauscht?');
  if (p.art === 'Haustür' && p.h && p.h < 1900) w.push('Haustür niedriger als 1900 mm');
  return w;
}

// Diktat/Notiz → Positionsvorschlag
export function auswerten(text) {
  const teile = segmente(text).map(lies);
  const global = {}; const globalQ = {};
  let kunde = ''; let projekt = '';
  for (const s of teile) {
    if (s.kunde && !kunde) kunde = s.kunde;
    if (s.projekt && !projekt) projekt = s.projekt;
    if (!s.istElement) for (const k of Object.keys(s.p)) if (k !== 'raum') { global[k] = s.p[k]; globalQ[k] = 'alle'; }
  }
  const positionen = [];
  let vorher = null;
  for (const s of teile) {
    if (!s.istElement) continue;
    const p = { nr: positionen.length + 1, stk: 1, art: 'Fenster', raum: '', b: '', h: '', masstyp: '', material: '', farbeInnen: '', farbeAussen: '', teilung: '1-flügelig', oeffnung: '', anschlag: '', glas: '', glasOpt: '', sprossen: 'keine', beschlag: 'Standard', rollladen: 'keiner', bemerkung: '' };
    const q = {};
    for (const k of ERBEN) {
      if (s.p[k]) continue;
      if (global[k]) { p[k] = global[k]; q[k] = 'alle'; }
      else if (vorher && vorher[k] && !['sprossen', 'beschlag', 'masstyp'].includes(k)) { p[k] = vorher[k]; q[k] = 'pos' + vorher.nr; }
    }
    Object.assign(p, s.p); Object.assign(q, s.q);
    if (!p.masstyp) { p.masstyp = 'Bestellmaß'; q.masstyp = 'unsicher'; }
    if (p.art === 'Hebe-Schiebe-Tür' && !s.p.teilung) p.teilung = '2-flügelig';
    if (['Haustür', 'Nebentür'].includes(p.art) && p.beschlag === 'Standard' && !s.p.beschlag) p.beschlag = 'Standard';
    p._q = q;
    positionen.push(p);
    vorher = p;
  }
  return { kunde, projekt, positionen };
}

// ——— Texte für Mails ———

const kurzOeffnung = { 'Dreh-Kipp': 'DK', Dreh: 'D', Kipp: 'K', Fest: 'Fix', 'Stulp (Dreh-Kipp/Dreh)': 'DK/D Stulp', 'Hebe-Schiebe': 'HS', 'nach innen öffnend': 'öffnet innen', 'nach außen öffnend': 'öffnet außen' };

export function positionsZeile(p, stil) {
  const glasF = stil === 'technisch' ? (p.glas === '3-fach' ? 'Dreifach-WSG Ug 0,5 W/m²K, warme Kante schwarz' : 'Zweifach-WSG Ug 1,1 W/m²K, warme Kante schwarz')
    : stil === 'kurz' ? (p.glas === '3-fach' ? '3-fach Ug0,5' : '2-fach Ug1,1')
      : (p.glas === '3-fach' ? '3-fach-Isolierglas Ug 0,5' : '2-fach-Isolierglas Ug 1,1');
  const oeff = stil === 'kurz' ? (kurzOeffnung[p.oeffnung] || p.oeffnung) : p.oeffnung;
  const anschl = p.anschlag ? (stil === 'kurz' ? p.anschlag.replace('DIN ', 'DIN-') : p.anschlag) : '';
  const teile = [
    p.material + (p.teilung ? ', ' + p.teilung : ''),
    [oeff, anschl].filter(Boolean).join(' '),
    `innen ${p.farbeInnen} / außen ${p.farbeAussen}`,
    glasF + (p.glasOpt ? ', ' + p.glasOpt : ''),
  ];
  if (p.sprossen && p.sprossen !== 'keine') teile.push('Sprossen ' + p.sprossen);
  if (p.beschlag && p.beschlag !== 'Standard') teile.push(p.beschlag);
  if (p.rollladen && p.rollladen !== 'keiner') teile.push('Rollladen ' + p.rollladen);
  if (p.bemerkung) teile.push(p.bemerkung);
  if (stil === 'technisch') teile.push('Uw-Wert bitte angeben');
  return teile;
}

export function anfrageBetreff(v, anzahl) {
  return `Anfrage ${v.id} – ${v.kunde.replace(/^(Familie|Herr|Frau)\s+/, '')}, ${v.art} – ${anzahl} Pos.`;
}

export function anfrageText(v, h, positionen, nutzer, firma) {
  const ort = v.adresse.split(',').pop().trim();
  const liste = positionen.map((p) => `Pos. ${p.nr} – ${p.stk} Stk. ${p.art}, ${p.b} × ${p.h} mm (${p.masstyp})`).join('\n');
  if (h.stil === 'kurz') {
    return `${h.anrede},\n\nbitte um Preis und Lieferzeit für folgende ${positionen.length} Positionen (Details in der Excel-Liste im Anhang):\n\n${liste}\n\nKommission: ${v.id} / ${v.kunde}, ${ort}\nLieferung frei Lager.\n\nDanke und Gruß\n${nutzer.name}\n${firma.name}`;
  }
  if (h.stil === 'technisch') {
    return `${h.anrede},\n\nfür das Bauvorhaben ${v.art} in ${ort} (Kommission ${v.id}) bitten wir um Ihr Angebot für die unten aufgeführten Elemente.\n\n${liste}\n\nBitte geben Sie je Position den Uw-Wert sowie die Lieferzeit ab technischer Klärung an. Maße sind ${positionen[0]?.masstyp === 'Rohbaumaß' ? 'Rohbaumaße – bitte Bestellmaß rückmelden' : 'Bestellmaße (Außenmaß Blendrahmen)'}.\nDie vollständige Positionsliste mit allen Merkmalen finden Sie im PDF-Anhang.\n\nFreundliche Grüße\n${nutzer.name}\n${firma.name} · ${firma.tel}`;
  }
  return `${h.anrede},\n\nfür unser Bauvorhaben „${v.art}“ in ${ort} bitten wir um Ihr Angebot über die nachfolgend aufgeführten Elemente. Die vollständige Positionsliste mit allen Ausführungsdetails erhalten Sie als PDF im Anhang.\n\n${liste}\n\nKommission: ${v.id}\nLieferung: frei Baustelle bzw. frei Lager\n\nWir bitten um Angabe der Lieferzeit ab Auftragsbestätigung sowie der Gültigkeit Ihres Angebots.\n\nMit freundlichen Grüßen\n${nutzer.name}\n${firma.name}\n${firma.strasse}, ${firma.ort} · ${firma.tel}`;
}

export function nachfassText(v, h, a, nutzer, firma) {
  const datum = new Date(a.gesendet).toLocaleDateString('de-DE');
  if (h.stil === 'kurz') return `${h.anrede},\n\nkurze Nachfrage zu unserer Anfrage vom ${datum} (Kommission ${v.id} / ${v.kunde}): Wann können wir mit Preis und Lieferzeit rechnen? Unser Kunde wartet auf das Angebot.\n\nDanke und Gruß\n${nutzer.name}\n${firma.name}`;
  return `${h.anrede},\n\nam ${datum} haben wir Ihnen unsere Anfrage zur Kommission ${v.id} (${v.kunde}, ${v.art}) gesendet. Bislang liegt uns noch kein Angebot vor.\n\nKönnen Sie uns sagen, bis wann wir mit Ihrem Angebot rechnen dürfen? Die Anfrage hängen wir zur Sicherheit noch einmal an.\n\nMit freundlichen Grüßen\n${nutzer.name}\n${firma.name}`;
}

export function rueckfrageText(v, h, nutzer, firma) {
  return `${h.anrede},\n\nvielen Dank für Ihre Rückfrage zur Kommission ${v.id}.\n\n1. Pos. 4 (Schlafzimmer): Sie haben recht – bitte DIN rechts statt DIN links, damit der Griff raumseitig frei bleibt.\n2. Pos. 6 (Hebe-Schiebe-Tür): Schema A, links fest, rechts schiebend (von innen gesehen).\n\nDie korrigierte Positionsliste hängen wir an. Wir freuen uns auf Ihr Angebot.\n\nMit freundlichen Grüßen\n${nutzer.name}\n${firma.name}`;
}

export function zusammenfassung(v, d) {
  const anf = d.anfragen.filter((a) => a.vorgang === v.id);
  const ang = d.angebote.filter((o) => o.vorgang === v.id);
  const stk = v.positionen.reduce((s, p) => s + (+p.stk || 0), 0);
  const offen = v.positionen.filter((p) => fehlend(p).length);
  const s = [];
  s.push(`${v.kunde}, ${v.art}: ${v.positionen.length} Positionen mit zusammen ${stk} Elementen.`);
  if (offen.length) s.push(`Noch unvollständig: ${offen.map((p) => 'Pos. ' + p.nr + ' (' + fehlend(p).map((k) => FELDER[k]).join(', ') + ')').join('; ')}.`);
  if (anf.length) {
    const h = (id) => d.haendler.find((x) => x.id === id)?.kurz;
    const teile = anf.map((a) => {
      if (a.status === 'angebot') return `${h(a.haendler)}: Angebot liegt vor`;
      if (a.status === 'rueckfrage') return `${h(a.haendler)}: Rückfrage offen`;
      const tage = Math.round((Date.now() - new Date(a.gesendet)) / 864e5);
      return `${h(a.haendler)}: angefragt vor ${tage} Tagen, noch keine Antwort`;
    });
    s.push('Händler – ' + teile.join(' · ') + '.');
  }
  const abw = ang.flatMap((o) => o.pos.flatMap((p) => p.abw.map((x) => ({ o, p, x }))));
  if (abw.length) s.push(`Achtung, ${abw.length} Abweichung${abw.length > 1 ? 'en' : ''} in Händlerangeboten: ${abw.map(({ o, p, x }) => `${d.haendler.find((h) => h.id === o.haendler)?.kurz} Pos. ${p.nr} ${FELDER[x.feld]} ${x.angeboten} statt ${x.angefragt}`).join('; ')}.`);
  if (ang.length > 1) {
    const sum = (o) => o.pos.reduce((t, p) => t + p.preis * (v.positionen.find((x) => x.nr === p.nr)?.stk || 1), 0);
    const best = [...ang].sort((a, b) => sum(a) - sum(b))[0];
    s.push(`Günstigstes Angebot: ${d.haendler.find((h) => h.id === best.haendler)?.kurz} mit ${eur(sum(best))} netto.`);
  }
  const naechst = {
    erfassung: 'Fehlende Angaben ergänzen, dann Anfrage an Händler senden.',
    angefragt: 'Auf Angebote warten, bei Fristablauf nachfassen.',
    rueckfrage: 'Rückfrage des Händlers beantworten.',
    angebot: 'Händlerangebot prüfen und Kundenangebot vorbereiten.',
    kundenangebot: 'Kundenangebot fertigstellen und an den Kunden senden.',
    gesendet: 'Beim Kunden nachfassen.',
    beauftragt: 'Bestellung beim Händler auslösen, Montage terminieren.',
  }[v.status];
  s.push('Nächster Schritt: ' + naechst);
  return s;
}

export function eur(n) {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

export function kundenText(p) {
  const teile = [`${p.material}-${p.art === 'Fenster' ? 'Fenster' : p.art}`];
  if (p.teilung && p.teilung !== '1-flügelig') teile.push(p.teilung);
  if (p.oeffnung) teile.push(p.oeffnung);
  teile.push(`${p.glas === '3-fach' ? 'Dreifach' : 'Zweifach'}-Wärmeschutzverglasung${p.glasOpt ? ' (' + p.glasOpt + ')' : ''}`);
  teile.push(`Farbe innen ${p.farbeInnen}, außen ${p.farbeAussen}`);
  if (p.rollladen && p.rollladen !== 'keiner') teile.push('mit Rollladen (' + p.rollladen + ')');
  if (p.beschlag && p.beschlag !== 'Standard') teile.push(p.beschlag === 'RC2' ? 'einbruchhemmend RC2' : p.beschlag);
  if (p.sprossen && p.sprossen !== 'keine') teile.push('Sprossen ' + p.sprossen);
  return teile.join(', ');
}

// Aufmaß wie auf dem Papierblatt: Kopf gilt für alle Positionen, je Position Maße, Felder mit Öffnung, Behang und Details.
// Das Beispielblatt ist frei erfunden; das „Auslesen“ ist in der Vorschau simuliert.

import { KATALOG, FELDER } from './daten.js';
import { zeichnung, normalisiere, kurz, OEFF } from './fenster.js';
import { fehlend, plausibel } from './ki.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const AM_KAT = {
  randverbund: ['Alu', 'Kunststoff (warme Kante)'],
  dichtung: ['schwarz', 'grau'],
  griff: ['weiß', 'silber', 'Edelstahl', 'abschließbar'],
  entw: ['unten', 'vorne', 'verdeckt'],
  gurt: ['Gurt (Mauer)', 'Gurt (Deckel)', 'Kurbel', 'Motor', 'Funkmotor'],
  bau: ['Neubau', 'Altbau'],
  montage: ['pauschal', 'Regie'],
  lieferung: ['Lieferung', 'Abholung'],
};

export function kopfAus(v) {
  const p = v?.positionen?.[0] || {};
  return {
    kunde: v?.kunde || '', adresse: v?.adresse || '', vorhaben: v?.art || '',
    system: v?.aufmass?.system || '', material: v?.aufmass?.material ?? p.material ?? '',
    farbeInnen: v?.aufmass?.farbeInnen ?? p.farbeInnen ?? '', farbeAussen: v?.aufmass?.farbeAussen ?? p.farbeAussen ?? '',
    glas: v?.aufmass?.glas ?? p.glas ?? '', randverbund: v?.aufmass?.randverbund ?? p.randverbund ?? '', dichtung: v?.aufmass?.dichtung ?? p.dichtung ?? '',
    bau: v?.aufmass?.bau || (/(sanierung|altbau|tausch)/i.test(v?.art || '') ? 'Altbau' : 'Neubau'),
    montage: v?.aufmass?.montage || 'pauschal', lieferung: v?.aufmass?.lieferung || 'Lieferung',
  };
}

export function leerePosition(nr, k) {
  return normalisiere({
    nr, stk: 1, raum: '', art: 'Fenster', b: '', h: '', masstyp: 'Rohbaumaß',
    material: k.material || '', farbeInnen: k.farbeInnen || '', farbeAussen: k.farbeAussen || '', glas: k.glas || '',
    randverbund: k.randverbund || '', dichtung: k.dichtung || '',
    felder: [{ o: 'DK', band: '' }], glasOpt: '', sprossen: 'keine', beschlag: 'Standard', rollladen: 'keiner', bemerkung: '', _q: {},
  });
}

// ——— Maske ———
const sel = (name, werte, wert, klasse = '', leer = '–') => `<select data-am="${name}" class="${klasse}"><option value="">${leer}</option>${werte.map((x) => `<option ${x === wert ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
const inp = (name, wert, { typ = 'text', klasse = '', ph = '', breit = '' } = {}) => `<input data-am="${name}" type="${typ}" ${typ === 'number' ? 'inputmode="numeric"' : ''} value="${esc(wert)}" class="${klasse}" placeholder="${esc(ph)}" ${breit ? `style="width:${breit}"` : ''}>`;

function zustand(p, k) {
  const f = fehlend(p);
  const q = p._q || {};
  const c = (feld) => [f.includes(feld) ? 'fehlt' : '', q[feld] === 'unsicher' ? 'unsicher' : ''].join(' ').trim();
  return { f, c, k };
}

export function statusHtml(p) {
  const f = fehlend(p); const w = plausibel(p); const q = Object.entries(p._q || {}).filter(([, v]) => v === 'unsicher').map(([k]) => FELDER[k] || k);
  if (f.length) return `<span class="am-st rot">Fehlt: ${f.map((k) => FELDER[k]).join(', ')}</span>`;
  if (q.length) return `<span class="am-st gelb">Bitte prüfen: ${esc(q.join(', '))}</span>`;
  if (w.length) return `<span class="am-st gelb">${esc(w[0])}</span>`;
  return '<span class="am-st gruen">vollständig</span>';
}

export function felderHtml(p, i) {
  const { c } = zustand(p);
  return `<div class="am-oeff ${c('oeffnung')} ${c('anschlag')}">
    ${p.felder.map((fe, k) => `<span class="am-feld">
      <button type="button" data-act="amFeld" data-arg="${i}|${k}" title="Öffnung wechseln: ${esc(OEFF[fe.o] || 'offen')}">${fe.o || '?'}</button>${['DK', 'D', 'T', 'S'].includes(fe.o) ? `<button type="button" class="band ${fe.band ? '' : 'offen'}" data-act="amBand" data-arg="${i}|${k}" title="${fe.o === 'S' ? 'Schieberichtung' : 'Bandseite (DIN)'}">${fe.o === 'S' ? (fe.band === 'r' ? '→' : fe.band === 'l' ? '←' : '?') : (fe.band === 'l' ? 'li' : fe.band === 'r' ? 're' : '?')}</button>` : ''}
    </span>${k < p.felder.length - 1 ? `<button type="button" class="am-trenn ${p.stulp && k === 0 ? 'an' : ''}" data-act="amStulp" data-arg="${i}" title="${p.stulp && k === 0 ? 'Stulp (ohne Pfosten)' : 'Pfosten'} – klicken zum Wechseln" ${k === 0 && p.felder.length === 2 ? '' : 'disabled'}>${p.stulp && k === 0 ? '‖' : '|'}</button>` : ''}`).join('')}
    <span class="am-feldknoepfe">
      <button type="button" data-act="amFeldPlus" data-arg="${i}" title="Feld dazu">+</button>
      <button type="button" data-act="amFeldMinus" data-arg="${i}" title="Feld weg" ${p.felder.length < 2 ? 'disabled' : ''}>−</button>
      <button type="button" class="${p.oberlicht ? 'an' : ''}" data-act="amOL" data-arg="${i}" title="Oberlicht">OL</button>
    </span>
  </div>`;
}

export function zeileHtml(p, i, offen = false) {
  const { c } = zustand(p);
  const fb = (k) => inp(`${i}|feldb.${k}`, p.felder[k]?.b || '', { typ: 'number', ph: 'auto', breit: '5.5em' });
  return `<article class="am-zeile" data-am-zeile="${i}" id="am-pos-${p.nr}">
    <div class="am-skizze">${zeichnung(p, { max: 92 })}</div>
    <div class="am-haupt">
      <div class="am-reihe">
        <span class="posnr">${String(p.nr).padStart(2, '0')}</span>
        <label class="am-k am-st">St.${inp(`${i}|stk`, p.stk, { typ: 'number', klasse: c('stk') })}</label>
        <label class="am-k am-raum">Raum${inp(`${i}|raum`, p.raum, { klasse: c('raum'), ph: 'z. B. Küche' })}</label>
        <label class="am-k am-art">Element${sel(`${i}|art`, KATALOG.art, p.art, c('art'), 'bitte wählen')}</label>
        <div class="am-aktionen">
          <button type="button" class="knopf klein geist nur-ico" data-act="amPosKopie" data-arg="${i}" title="Position kopieren" aria-label="Kopieren"><svg class="ico" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/></svg></button>
          <button type="button" class="knopf klein geist nur-ico" data-act="amPosWeg" data-arg="${i}" title="Position löschen" aria-label="Löschen"><svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>
        </div>
      </div>
      <div class="am-reihe">
        <label class="am-k am-mass">Rohbau B${inp(`${i}|b`, p.b, { typ: 'number', klasse: c('b') })}</label>
        <label class="am-k am-mass">H${inp(`${i}|h`, p.h, { typ: 'number', klasse: c('h') })}</label>
        <div class="am-k am-oeff-k">Öffnung (DIN)${felderHtml(p, i)}</div>
        <label class="am-k am-behang">Behang${sel(`${i}|rollladen`, KATALOG.rollladen, p.rollladen, c('rollladen'))}</label>
      </div>
      <div class="am-status">${statusHtml(p)} <span class="am-kurz">${esc(kurz(p))}</span></div>
      <details class="am-details" ${offen ? 'open' : ''}>
        <summary>Weitere Angaben <span class="leise">Glas, Farbe, Dichtung, Aufdoppelung, Fensterbank …</span></summary>
        <div class="am-raster">
          <label class="am-k">Material${sel(`${i}|material`, KATALOG.material, p.material, c('material'))}</label>
          <label class="am-k">Farbe innen${sel(`${i}|farbeInnen`, KATALOG.farbe, p.farbeInnen, c('farbeInnen'))}</label>
          <label class="am-k">Farbe außen${sel(`${i}|farbeAussen`, KATALOG.farbe, p.farbeAussen, c('farbeAussen'))}</label>
          <label class="am-k">Glas${sel(`${i}|glas`, KATALOG.glas, p.glas, c('glas'))}</label>
          <label class="am-k">Glasart / Füllung${sel(`${i}|glasOpt`, KATALOG.glasOpt, p.glasOpt)}</label>
          <label class="am-k">Randverbund${sel(`${i}|randverbund`, AM_KAT.randverbund, p.randverbund)}</label>
          <label class="am-k">Dichtung${sel(`${i}|dichtung`, AM_KAT.dichtung, p.dichtung)}</label>
          <label class="am-k">Griffoliven${sel(`${i}|griff`, AM_KAT.griff, p.griff)}</label>
          <label class="am-k">Entwässerung${sel(`${i}|entw`, AM_KAT.entw, p.entw)}</label>
          <label class="am-k">Sprossen${sel(`${i}|sprossen`, KATALOG.sprossen, p.sprossen)}</label>
          <label class="am-k">Beschlag${sel(`${i}|beschlag`, KATALOG.beschlag, p.beschlag)}</label>
          <label class="am-k">Bedienung Behang${sel(`${i}|gurt`, AM_KAT.gurt, p.gurt)}</label>
          <label class="am-k">Farbe Kasten / Panzer${inp(`${i}|behangFarbe`, p.behangFarbe, { ph: 'z. B. 7016' })}</label>
          <label class="am-k">Fensterbank außen${inp(`${i}|fbAussen`, p.fbAussen, { ph: 'z. B. Alu 165 mm' })}</label>
          <label class="am-k">Fensterbank innen${inp(`${i}|fbInnen`, p.fbInnen, { ph: 'z. B. Kunststein 200 mm' })}</label>
          <label class="am-k">Fertigmaß B / H<span class="am-paar">${inp(`${i}|fertigB`, p.fertigB, { typ: 'number', ph: 'B' })}${inp(`${i}|fertigH`, p.fertigH, { typ: 'number', ph: 'H' })}</span></label>
          <label class="am-k">Aufdoppelung o / u / l / r (mm)<span class="am-paar vier">${['o', 'u', 'l', 'r'].map((s) => inp(`${i}|aufd.${s}`, p.aufd?.[s] || '', { typ: 'number', ph: s })).join('')}</span></label>
          ${p.felder.length > 1 ? `<label class="am-k">Feldbreiten (mm, leer = gleich)<span class="am-paar">${p.felder.map((_, k) => fb(k)).join('')}</span></label>` : ''}
          ${p.oberlicht ? `<label class="am-k">Oberlicht Höhe / Öffnung<span class="am-paar">${inp(`${i}|ol.h`, p.oberlicht.h || '', { typ: 'number', ph: 'mm' })}${sel(`${i}|ol.o`, ['F', 'K'], p.oberlicht.o || 'F', '', '–')}</span></label>` : ''}
          ${p.felder.some((x) => x.o === 'T') ? `<label class="am-k">Tür öffnet${sel(`${i}|tuer`, ['innen', 'außen'], p.tuer || 'innen')}</label>` : ''}
          <label class="am-k am-breit">Bemerkung${inp(`${i}|bemerkung`, p.bemerkung)}</label>
        </div>
      </details>
    </div>
  </article>`;
}

export function kopfHtml(k, neu) {
  const s = (f, w, l = '–') => sel(`k|${f}`, w, k[f], '', l);
  return `<section class="karte am-kopf">
    <h2>Kopf · gilt für alle Positionen</h2>
    <div class="am-raster">
      ${neu ? `<label class="am-k">Kunde${inp('k|kunde', k.kunde, { ph: 'z. B. Familie Muster' })}</label>
      <label class="am-k am-breit">Baustelle${inp('k|adresse', k.adresse, { ph: 'Straße Nr., PLZ Ort' })}</label>
      <label class="am-k">Vorhaben${inp('k|vorhaben', k.vorhaben, { ph: 'z. B. Neubau EFH' })}</label>` : ''}
      <label class="am-k">Fenster-System${inp('k|system', k.system, { ph: 'z. B. Kunststoff 82 mm' })}</label>
      <label class="am-k">Material${s('material', KATALOG.material)}</label>
      <label class="am-k">Farbe innen${s('farbeInnen', KATALOG.farbe)}</label>
      <label class="am-k">Farbe außen${s('farbeAussen', KATALOG.farbe)}</label>
      <label class="am-k">Glas${s('glas', KATALOG.glas)}</label>
      <label class="am-k">Randverbund${s('randverbund', AM_KAT.randverbund)}</label>
      <label class="am-k">Dichtung${s('dichtung', AM_KAT.dichtung)}</label>
      <label class="am-k">Bau${s('bau', AM_KAT.bau)}</label>
      <label class="am-k">Montage${s('montage', AM_KAT.montage)}</label>
      <label class="am-k">Lieferung${s('lieferung', AM_KAT.lieferung)}</label>
    </div>
    <p class="leise klein">Änderungen im Kopf werden für alle Positionen übernommen. Abweichungen je Position unter „Weitere Angaben“.</p>
  </section>`;
}

export function maskeHtml(am) {
  const offen = am.positionen.filter((p) => fehlend(p).length).length;
  return `${kopfHtml(am.kopf, !am.ziel)}
    <div class="am-liste">${am.positionen.map((p, i) => zeileHtml(p, i, am.fokus === p.nr)).join('')}</div>
    <div class="am-fuss">
      <button type="button" class="knopf" data-act="amPosPlus">+ Position</button>
      <span class="leise" id="am-zusammen">${am.positionen.length} Positionen · ${am.positionen.reduce((s, p) => s + (+p.stk || 0), 0)} Elemente${offen ? ` · <b class="rot">${offen} unvollständig</b>` : ''}</span>
      <span class="am-fuss-rechts">
        <button type="button" class="knopf geist" data-act="amAbbrechen">Abbrechen</button>
        <button type="button" class="knopf primaer" data-act="amSpeichern">${am.ziel ? 'Aufmaß speichern' : 'Vorgang anlegen'}</button>
      </span>
    </div>`;
}

// ——— Beispielblatt (erfunden) ———
const BEISPIEL = [
  { pos: 1, st: 1, b: '1010', h: '1235', din: ['DK', '', ''], sk: [{ o: 'DK', band: 'l' }], glas: '3-f', rv: 'R', bem: 'Küche' },
  { pos: 2, st: 1, b: '3760', h: '1250', din: ['', '', 'DK'], sk: [{ o: 'F' }, { o: 'DK', band: 'r' }], glas: '3-f', rv: 'Raff', bem: 'Wohnen' },
  { pos: 3, st: 1, b: '4510', h: '2200', hAlt: '2180', din: ['', 'HS', ''], sk: [{ o: 'F' }, { o: 'S', band: 'l' }], glas: '3-f', rv: 'Raff', bem: 'Terr. Flachschw.' },
  { pos: 4, st: 1, b: '760', h: '885', din: ['', '', 'DK'], sk: [{ o: 'DK', band: 'r' }], glas: '3-f Orn.', rv: 'R', bem: 'Bad' },
  { pos: 5, st: 2, b: '1260', h: '1385', din: ['D', 'St', 'DK'], sk: [{ o: 'D', band: 'l' }, { o: 'DK', band: 'r' }], glas: '3-f', rv: 'R', bem: 'Kinder 1+2' },
  { pos: 6, st: 1, b: '635', h: '1245', din: ['', 'DK', ''], sk: [{ o: 'DK', band: '' }], glas: '3-f', rv: 'R', bem: 'Speis ?' },
];

function wackel(seed) { let x = seed * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280 - 0.5; }; }

function handSkizze(x, y, w, h, felder, seed) {
  const j = wackel(seed); const q = (v) => (v + j() * 2.2).toFixed(1);
  const L = [`<path d="M${q(x)} ${q(y)} L${q(x + w)} ${q(y)} L${q(x + w)} ${q(y + h)} L${q(x)} ${q(y + h)} Z" class="hs-strich"/>`];
  const fw = w / felder.length;
  felder.forEach((f, i) => {
    const fx = x + i * fw;
    if (i) L.push(`<path d="M${q(fx)} ${q(y)} L${q(fx)} ${q(y + h)}" class="hs-strich"/>`);
    if (f.o === 'F') L.push(`<path d="M${q(fx + fw / 2 - 5)} ${q(y + h / 2)} L${q(fx + fw / 2 + 5)} ${q(y + h / 2)} M${q(fx + fw / 2)} ${q(y + h / 2 - 5)} L${q(fx + fw / 2)} ${q(y + h / 2 + 5)}" class="hs-strich"/>`);
    if (['DK', 'D'].includes(f.o)) {
      const l = f.band !== 'r';
      L.push(`<path d="M${q(l ? fx + fw : fx)} ${q(y)} L${q(l ? fx + (f.band ? 0 : fw * 0.3) : fx + fw)} ${q(y + h / 2)} L${q(l ? fx + fw : fx)} ${q(y + h)}" class="hs-strich"/>`);
    }
    if (f.o === 'DK') L.push(`<path d="M${q(fx)} ${q(y)} L${q(fx + fw / 2)} ${q(y + h)} L${q(fx + fw)} ${q(y)}" class="hs-strich"/>`);
    if (f.o === 'S') L.push(`<path d="M${q(fx + fw * 0.8)} ${q(y + h / 2)} L${q(fx + fw * 0.2)} ${q(y + h / 2)} M${q(fx + fw * 0.3)} ${q(y + h / 2 - 4)} L${q(fx + fw * 0.2)} ${q(y + h / 2)} L${q(fx + fw * 0.3)} ${q(y + h / 2 + 4)}" class="hs-strich"/>`);
  });
  return L.join('');
}

export function beispielBlattSvg(datum) {
  const T = []; const j = wackel(7);
  const hand = (x, y, t, k = '') => T.push(`<text x="${x}" y="${y}" class="hs ${k}" transform="rotate(${(j() * 3).toFixed(2)} ${x} ${y})">${esc(t)}</text>`);
  const druck = (x, y, t, k = 'dr') => T.push(`<text x="${x}" y="${y}" class="${k}">${esc(t)}</text>`);
  const linie = (x1, y1, x2, y2, k = 'gl') => T.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${k}"/>`);
  const box = (x, y, an) => { T.push(`<rect x="${x}" y="${y - 11}" width="12" height="12" class="gl"/>`); if (an) T.push(`<path d="M${x - 1} ${y - 12} L${x + 13} ${y + 2} M${x + 13} ${y - 12} L${x - 1} ${y + 2}" class="hs-strich"/>`); };
  // Kopf
  druck(40, 46, 'Aufmaß', 'dr-titel'); druck(820, 36, 'Fensterbau Muster GmbH', 'dr-firma'); druck(820, 52, 'Werkstraße 4 · 12345 Musterstadt', 'dr');
  const kopf = [['Kunde', 40, 86, 'Lorenz', 400], ['Baustelle', 40, 120, 'Birkenweg 4, Musterdorf', 400], ['Telefon', 40, 154, '0170 0000517', 400],
    ['Datum', 460, 86, datum, 760], ['Fenster-System', 460, 120, 'Kunststoff 82', 760], ['Farbe', 460, 154, 'innen weiß / außen 7016', 760], ['Vertreter', 800, 86, 'MM', 950]];
  for (const [l, x, y, v, ende] of kopf) { druck(x, y, l); linie(x + 92, y + 4, ende, y + 4); hand(x + 100, y, v); }
  druck(800, 120, 'Altbau'); box(850, 120, false); druck(880, 120, 'Neubau'); box(932, 120, true);
  druck(800, 154, 'Lieferung'); box(866, 154, true); druck(892, 154, 'Mo. pauschal'); box(976, 154, true);
  druck(990, 86, 'Blatt'); hand(1030, 86, '1 / 1');
  // Tabelle
  const sp = [[40, 'Pos.'], [76, 'St.'], [108, 'Rohbau B'], [190, 'H'], [262, 'Fertigmaß'], [350, 'li'], [388, 'Mi'], [426, 're'], [464, 'Skizze'], [566, 'Dicht.'], [618, 'Glas'], [712, 'Randv.'], [772, 'RV / Raff'], [858, 'FB a / i'], [942, 'Bemerkung'], [1080, '']];
  const y0 = 186, kh = 44, zh = 64;
  linie(40, y0, 1080, y0, 'gl-stark'); linie(40, y0 + kh, 1080, y0 + kh, 'gl-stark');
  druck(350, y0 + 16, 'DIN-Richtung', 'dr klein');
  sp.forEach(([x, t]) => { linie(x, y0, x, y0 + kh + zh * BEISPIEL.length, 'gl'); if (t) druck(x + 5, y0 + 36, t, 'dr'); });
  BEISPIEL.forEach((r, i) => {
    const y = y0 + kh + zh * (i + 1);
    linie(40, y, 1080, y, 'gl');
    linie(76, y - zh / 2, 1080, y - zh / 2, 'gl-fein');
    druck(1000, y - zh / 2 - 6, '', 'dr');
    const yt = y - zh / 2 + 8;
    hand(50, yt, String(r.pos)); hand(86, yt, String(r.st)); hand(116, yt, r.b);
    if (r.hAlt) { hand(196, yt - 10, r.hAlt, 'klein'); T.push(`<path d="M194 ${yt - 18} L246 ${yt - 6}" class="hs-strich"/>`); hand(198, yt + 14, r.h); } else hand(198, yt, r.h);
    r.din.forEach((t, k) => hand(356 + k * 38, yt, t || '–', t ? '' : 'leicht'));
    T.push(handSkizze(476, y - zh + 10, 76, zh - 20, r.sk, i + 3));
    hand(574, yt, 'gr'); hand(624, yt, r.glas); hand(718, yt, 'KSD'); hand(784, yt, r.rv); hand(950, yt, r.bem);
  });
  const yb = y0 + kh + zh * BEISPIEL.length + 34;
  druck(40, yb, 'Sonstiges / Bemerkungen'); hand(230, yb, 'Raff Kasten 250 mm · Gurt Mauer · alles 3-fach, KSD, Dichtung grau');
  druck(40, yb + 36, 'Gurtdurchlauf'); druck(150, yb + 36, 'Mauer'); box(196, yb + 36, true); druck(226, yb + 36, 'Deckel'); box(276, yb + 36, false);
  return `<svg class="blatt-svg" viewBox="0 0 1120 ${yb + 64}" role="img" aria-label="Beispiel: handschriftlich ausgefülltes Aufmaßblatt (erfunden)">
    <rect x="0" y="0" width="1120" height="${yb + 64}" class="papier"/>${T.join('')}</svg>`;
}

export function blattAuslesen() {
  const kopf = {
    kunde: 'Familie Lorenz', adresse: 'Birkenweg 4, 12346 Musterdorf', vorhaben: 'Neubau Einfamilienhaus', tel: '0170 0000517',
    system: 'Kunststoff 82 mm', material: 'Kunststoff', farbeInnen: 'Weiß', farbeAussen: 'Anthrazitgrau RAL 7016', glas: '3-fach',
    randverbund: 'Kunststoff (warme Kante)', dichtung: 'grau', bau: 'Neubau', montage: 'pauschal', lieferung: 'Lieferung',
  };
  const basis = (nr, rest) => normalisiere({
    nr, stk: 1, art: 'Fenster', masstyp: 'Rohbaumaß', material: kopf.material, farbeInnen: kopf.farbeInnen, farbeAussen: kopf.farbeAussen,
    glas: kopf.glas, randverbund: kopf.randverbund, dichtung: kopf.dichtung, glasOpt: '', sprossen: 'keine', beschlag: 'Standard',
    rollladen: 'Rollladen Aufsatz', gurt: 'Gurt (Mauer)', bemerkung: '', _q: {}, ...rest,
  });
  const positionen = [
    basis(1, { raum: 'Küche', b: 1010, h: 1235, felder: [{ o: 'DK', band: 'l' }] }),
    basis(2, { raum: 'Wohnen', b: 3760, h: 1250, felder: [{ o: 'F' }, { o: 'DK', band: 'r' }], rollladen: 'Raffstore', gurt: 'Motor', behangFarbe: 'Kasten 250 mm' }),
    basis(3, { raum: 'Terrasse', art: 'Hebe-Schiebe-Tür', b: 4510, h: 2200, felder: [{ o: 'F' }, { o: 'S', band: 'l' }], rollladen: 'Raffstore', gurt: 'Motor', behangFarbe: 'Kasten 250 mm', bemerkung: 'Flachschwelle', _q: { h: 'unsicher' } }),
    basis(4, { raum: 'Bad', b: 760, h: 885, felder: [{ o: 'DK', band: 'r' }], glasOpt: 'Ornament/satiniert' }),
    basis(5, { raum: 'Kinderzimmer', stk: 2, b: 1260, h: 1385, stulp: true, felder: [{ o: 'D', band: 'l' }, { o: 'DK', band: 'r' }], bemerkung: 'Kinderzimmer 1 und 2' }),
    basis(6, { raum: 'Speis', b: 635, h: 1245, felder: [{ o: 'DK', band: '' }], _q: { raum: 'unsicher', anschlag: 'unsicher' } }),
  ];
  return { kopf, positionen, hinweise: ['Pos. 3: Höhe wurde auf dem Blatt korrigiert (2180 → 2200) – bitte bestätigen.', 'Pos. 6: „DK“ steht in der Spalte „Mi“ – Bandseite unklar, bitte ergänzen.', 'Pos. 6: Raum „Speis ?“ mit Fragezeichen notiert.'] };
}

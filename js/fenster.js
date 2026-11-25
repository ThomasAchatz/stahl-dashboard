// Fenster als Felder (von links nach rechts, Ansicht von innen) und Zeichnung mit Öffnungssymbolen und Bemaßung.
// Zeichenweise: Die Spitze des Dreiecks zeigt zur Bandseite (Dreh), gestrichelt = Kipp, „F“ = fest, Pfeil = Schiebe.

export const OEFF = { DK: 'Dreh-Kipp', D: 'Dreh', K: 'Kipp', F: 'Fest', S: 'Schiebe', T: 'Tür' };
export const OEFF_FOLGE = ['DK', 'D', 'K', 'F', 'S', 'T'];
const ESC = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ALT = { 'Dreh-Kipp': 'DK', Dreh: 'D', Kipp: 'K', Fest: 'F', 'Hebe-Schiebe': 'S', 'nach innen öffnend': 'T', 'nach außen öffnend': 'T' };

// Alte Beschreibung (Teilung/Öffnung/Anschlag) → Felder
function ableiten(p) {
  const band = p.anschlag === 'DIN rechts' ? 'r' : p.anschlag === 'DIN links' ? 'l' : '';
  const o = ALT[p.oeffnung] || '';
  if (p.oeffnung === 'nach außen öffnend') p.tuer = 'außen'; else if (o === 'T') p.tuer = 'innen';
  const t = p.teilung || '';
  if (p.art === 'Hebe-Schiebe-Tür' || o === 'S') return band === 'r' ? [{ o: 'S', band: 'r' }, { o: 'F' }] : [{ o: 'F' }, { o: 'S', band }];
  if (t.includes('Stulp') || (p.oeffnung || '').startsWith('Stulp')) {
    p.stulp = true;
    return band === 'l' ? [{ o: 'DK', band: 'l' }, { o: 'D', band: 'r' }] : [{ o: 'D', band: 'l' }, { o: 'DK', band: 'r' }];
  }
  if (t.startsWith('2-')) return [{ o, band: 'l' }, { o, band: 'r' }];
  if (t.startsWith('3-')) return [{ o, band: 'l' }, { o: 'F' }, { o, band: 'r' }];
  if (t === 'mit Seitenteil') return [{ o: o || 'T', band }, { o: 'F', b: Math.round((+p.b || 1000) * 0.3) }];
  if (t === 'mit Oberlicht') p.oberlicht = { h: null, o: 'F' };
  return [{ o, band }];
}

export function normalisiere(p) {
  if (!Array.isArray(p.felder) || !p.felder.length) p.felder = ableiten(p);
  for (const k of ['dichtung', 'griff', 'entw', 'randverbund', 'fbAussen', 'fbInnen', 'behangFarbe', 'gurt', 'fertigB', 'fertigH']) if (p[k] == null) p[k] = '';
  if (!p.aufd) p.aufd = { o: '', u: '', l: '', r: '' };
  syncText(p);
  return p;
}

const braucht = (f) => ['DK', 'D', 'T', 'S'].includes(f.o);

// Felder → Texte (für Anfrage, Kundenangebot, Pflichtprüfung)
export function syncText(p) {
  const f = p.felder || [];
  const n = f.length;
  const name = (x) => x.o === 'T' ? (p.tuer === 'außen' ? 'nach außen öffnend' : 'nach innen öffnend') : (OEFF[x.o] || '');
  if (f.some((x) => !x.o)) p.oeffnung = '';
  else if (f.some((x) => x.o === 'S')) p.oeffnung = 'Hebe-Schiebe';
  else if (p.stulp && n === 2) p.oeffnung = 'Stulp (Dreh-Kipp/Dreh)';
  else if (f.every((x) => x.o === f[0].o)) p.oeffnung = name(f[0]);
  else p.oeffnung = f.map(name).join(' + ');
  const of = f.filter(braucht);
  if (!of.length) p.anschlag = p.oeffnung === 'Fest' || p.oeffnung === 'Kipp' ? '' : p.anschlag || '';
  else if (of.some((x) => !x.band)) p.anschlag = '';
  else if (f.some((x) => x.o === 'S')) p.anschlag = of[0].band === 'l' ? 'schiebt nach links' : 'schiebt nach rechts';
  else if (of.every((x) => x.band === of[0].band)) p.anschlag = of[0].band === 'l' ? 'DIN links' : 'DIN rechts';
  else p.anschlag = of.map((x) => (x.band === 'l' ? 'DIN li' : 'DIN re')).join(' / ');
  if (n === 1) p.teilung = '1-flügelig';
  else if (p.stulp && n === 2) p.teilung = '2-flügelig Stulp';
  else if (['Haustür', 'Nebentür'].includes(p.art) && f.some((x) => x.o === 'F')) p.teilung = 'mit Seitenteil';
  else p.teilung = `${n}-teilig`;
  if (p.oberlicht) p.teilung += ' mit Oberlicht';
}

// Kurzschreibweise wie auf dem Aufmaßblatt, z. B. „F | DK re“
export function kurz(p) {
  const f = (p.felder || []).map((x) => (x.o || '?') + (braucht(x) ? (x.band === 'l' ? ' li' : x.band === 'r' ? ' re' : ' ?') : ''));
  return (p.oberlicht ? `OL ${p.oberlicht.o || 'F'} / ` : '') + f.join(p.stulp ? ' ‖ ' : ' | ');
}

// Breiten der Felder in mm: feste Angaben zuerst, Rest gleichmäßig
export function feldbreiten(p) {
  const B = +p.b || 1000; const f = p.felder || [{}];
  const fest = f.reduce((s, x) => s + (+x.b || 0), 0);
  const offen = f.filter((x) => !+x.b).length;
  const rest = offen ? Math.max(0, B - fest) / offen : 0;
  return f.map((x) => (+x.b || rest));
}

export function zeichnung(p, { max = 92, mass = false, klasse = '' } = {}) {
  const B = +p.b || 1000, Hm = +p.h || 1000;
  const f = max / Math.max(B, Hm);
  const W = Math.max(28, B * f), H = Math.max(28, Hm * f);
  const felder = p.felder?.length ? p.felder : [{ o: '' }];
  const breiten = feldbreiten(p);
  const mx = mass ? 4 : 3, myOben = mass && felder.length > 1 ? 20 : mass ? 6 : 3;
  const rechts = mass ? (p.oberlicht && +p.oberlicht.h ? 48 : 30) : 3, unten = mass ? 26 : 3;
  const L = [];
  const r = (x, y, w, h, k) => L.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, w).toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" class="${k}"/>`);
  const pl = (pts, k) => L.push(`<polyline points="${pts.map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ')}" class="${k}"/>`);
  const tx = (x, y, t, k = 'masz', a = 'middle', rot = 0) => L.push(`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="${k}" text-anchor="${a}"${rot ? ` transform="rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})"` : ''}>${ESC(t)}</text>`);
  const x0 = mx, y0 = myOben;
  r(x0, y0, W, H, 'rahmen');
  let top = y0; let hoch = H;
  const oh = p.oberlicht ? (+p.oberlicht.h ? +p.oberlicht.h * f : H * 0.24) : 0;
  if (p.oberlicht) {
    feld(x0, y0, W, oh, { o: p.oberlicht.o || 'F' }, false);
    L.push(`<line x1="${x0}" y1="${(y0 + oh).toFixed(1)}" x2="${(x0 + W).toFixed(1)}" y2="${(y0 + oh).toFixed(1)}" class="pfosten"/>`);
    top = y0 + oh; hoch = H - oh;
  }
  let x = x0;
  felder.forEach((fe, i) => {
    const w = breiten[i] * f;
    feld(x, top, w, hoch, fe, true);
    if (i > 0) L.push(`<line x1="${x.toFixed(1)}" y1="${top.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(top + hoch).toFixed(1)}" class="${p.stulp && i === 1 ? 'stulp' : 'pfosten'}"/>`);
    x += w;
  });

  function feld(fx0, fy0, fw0, fh0, fe, unterteil) {
    const e = fe.o === 'F' ? 2.5 : 3.5;
    const fx = fx0 + e, fy = fy0 + e, fw = fw0 - 2 * e, fh = fh0 - 2 * e;
    if (fe.o === 'F' || !fe.o) r(fx, fy, fw, fh, 'glas');
    else r(fx, fy, fw, fh, 'fluegel');
    if (!fe.o) { tx(fx + fw / 2, fy + fh / 2 + 4, '?', 'fest'); return; }
    if (fe.o === 'F') { tx(fx + fw / 2, fy + fh / 2 + 4, 'F', 'fest'); return; }
    if (fe.o === 'S') {
      const y = fy + fh * 0.55; const dir = fe.band === 'l' ? -1 : 1;
      const a = fx + fw / 2 - dir * fw * 0.28, b = fx + fw / 2 + dir * fw * 0.28;
      pl([[a, y], [b, y]], 'sym'); pl([[b - dir * 6, y - 4], [b, y], [b - dir * 6, y + 4]], 'sym');
      return;
    }
    const band = fe.band || 'l';
    if (['DK', 'D', 'T'].includes(fe.o)) {
      pl(band === 'l' ? [[fx + fw, fy], [fx, fy + fh / 2], [fx + fw, fy + fh]] : [[fx, fy], [fx + fw, fy + fh / 2], [fx, fy + fh]], 'sym' + (fe.band ? '' : ' unsicher'));
      const gx = band === 'l' ? fx + fw - 4 : fx + 4;
      L.push(`<line x1="${gx.toFixed(1)}" y1="${(fy + fh / 2 - 5).toFixed(1)}" x2="${gx.toFixed(1)}" y2="${(fy + fh / 2 + 5).toFixed(1)}" class="griff"/>`);
    }
    if (['DK', 'K'].includes(fe.o)) pl([[fx, fy], [fx + fw / 2, fy + fh], [fx + fw, fy]], 'sym kipp');
    if (!unterteil) return;
  }

  if (mass) {
    const yb = y0 + H + 14;
    L.push(`<line x1="${x0}" y1="${yb}" x2="${(x0 + W).toFixed(1)}" y2="${yb}" class="masslinie"/>`);
    [x0, x0 + W].forEach((xx) => L.push(`<line x1="${xx.toFixed(1)}" y1="${yb - 4}" x2="${xx.toFixed(1)}" y2="${yb + 4}" class="masslinie"/>`));
    tx(x0 + W / 2, yb - 3, String(B));
    if (felder.length > 1) {
      const yt = y0 - 8; let xx = x0;
      L.push(`<line x1="${x0}" y1="${yt}" x2="${(x0 + W).toFixed(1)}" y2="${yt}" class="masslinie"/>`);
      felder.forEach((_, i) => {
        const w = breiten[i] * f;
        L.push(`<line x1="${xx.toFixed(1)}" y1="${yt - 3}" x2="${xx.toFixed(1)}" y2="${yt + 3}" class="masslinie"/>`);
        tx(xx + w / 2, yt - 3, String(Math.round(breiten[i])), 'masz klein');
        xx += w;
      });
      L.push(`<line x1="${(x0 + W).toFixed(1)}" y1="${yt - 3}" x2="${(x0 + W).toFixed(1)}" y2="${yt + 3}" class="masslinie"/>`);
    }
    const xr = x0 + W + 14;
    L.push(`<line x1="${xr}" y1="${y0}" x2="${xr}" y2="${(y0 + H).toFixed(1)}" class="masslinie"/>`);
    [y0, y0 + H].forEach((yy) => L.push(`<line x1="${xr - 4}" y1="${yy.toFixed(1)}" x2="${xr + 4}" y2="${yy.toFixed(1)}" class="masslinie"/>`));
    tx(xr + 12, y0 + H / 2, String(Hm), 'masz', 'middle', -90);
    if (p.oberlicht && +p.oberlicht.h) {
      const xr2 = xr + 14;
      L.push(`<line x1="${xr2}" y1="${y0}" x2="${xr2}" y2="${(y0 + oh).toFixed(1)}" class="masslinie"/>`);
      tx(xr2 + 11, y0 + oh / 2, String(p.oberlicht.h), 'masz klein', 'middle', -90);
    }
  }
  const VW = mx + W + rechts, VH = myOben + H + unten;
  return `<svg class="ansicht ${klasse}" viewBox="0 0 ${VW.toFixed(1)} ${VH.toFixed(1)}" width="${VW.toFixed(0)}" height="${VH.toFixed(0)}" role="img" aria-label="Ansicht ${ESC(p.art || '')}: ${ESC(kurz(p))}">${L.join('')}</svg>`;
}

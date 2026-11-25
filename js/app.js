import { FIRMA, NUTZER, KATALOG, FELDER, STATUS, ABLAUF, startDaten } from './daten.js';
import { auswerten, fehlend, plausibel, positionsZeile, anfrageBetreff, anfrageText, nachfassText, rueckfrageText, zusammenfassung, eur, kundenText } from './ki.js';

// ——— Zustand ———
const SPEICHER = 'fenster-demo-v1';
let d = laden();
const ich = NUTZER[0];
const ui = { filter: 'alle', suche: '', postfachFilter: 'alle', erfassung: null, wiz: null, zf: {} };

function laden() {
  try { const s = JSON.parse(localStorage.getItem(SPEICHER)); if (s && s.version === 1) return s; } catch { /* privat/blockiert */ }
  return startDaten();
}
function speichern() { try { localStorage.setItem(SPEICHER, JSON.stringify(d)); } catch { /* egal */ } }

// ——— Helfer ———
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const datum = (iso) => iso ? new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';
const tagNr = (iso) => { const a = new Date(iso); a.setHours(0, 0, 0, 0); const b = new Date(); b.setHours(0, 0, 0, 0); return Math.round((a - b) / 864e5); };
function rel(iso) {
  const n = tagNr(iso);
  if (n === 0) return 'heute'; if (n === -1) return 'gestern'; if (n === 1) return 'morgen';
  return n < 0 ? `vor ${-n} Tagen` : `in ${n} Tagen`;
}
const inTagen = (n) => { const x = new Date(); x.setHours(9, 0, 0, 0); x.setDate(x.getDate() + n); return x.toISOString(); };
const H = (id) => d.haendler.find((h) => h.id === id);
const V = (id) => d.vorgaenge.find((v) => v.id === id);
const N = (id) => NUTZER.find((n) => n.id === id) || ich;
const badge = (st) => `<span class="badge ton-${STATUS[st].ton}">${STATUS[st].text}</span>`;
const avatar = (n) => `<span class="avatar" title="${esc(n.name)}">${n.kurz}</span>`;
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

const I = {
  start: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  ordner: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  post: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  haendler: '<path d="M3 21V8l9-5 9 5v13"/><path d="M8 21v-7h8v7"/>',
  zahnrad: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  ki: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  senden: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  uhr: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
  frage: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5"/>',
  doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  haken: '<path d="M5 12l5 5L20 7"/>',
  pfeil: '<path d="M9 6l6 6-6 6"/>',
  zurueck: '<path d="M15 6l-6 6 6 6"/>',
  ein: '<path d="M12 4v12M6 10l6 6 6-6M4 20h16"/>',
  aus: '<path d="M12 20V8M6 14l6-6 6 6M4 4h16"/>',
  fenster: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/>',
  stift: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  euro: '<path d="M17 6a7 7 0 1 0 0 12M4 10h9M4 14h9"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  anhang: '<path d="M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 8"/>',
};
const ico = (n, k = '') => `<svg class="ico ${k}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

// ——— Aufgabenliste („Zu erledigen“) ———
function aufgaben() {
  const l = [];
  for (const a of d.anfragen) {
    const v = V(a.vorgang); const h = H(a.haendler);
    if (a.status === 'rueckfrage') {
      const m = d.mails.find((x) => x.vorgang === a.vorgang && x.von === a.haendler && x.kategorie === 'Rückfrage');
      l.push({ id: 'rf-' + a.id, prio: 'eilig', ico: 'frage', titel: `Rückfrage von ${h.kurz}`, text: m?.ki || 'Händler hat eine Rückfrage.', v, knopf: 'Antwort vorbereiten', act: 'rueckfrage', arg: a.id });
    }
    if (a.status === 'gesendet' && a.wv && tagNr(a.wv) <= 0) {
      l.push({ id: 'wv-' + a.id + a.wv, prio: 'heute', ico: 'uhr', titel: `${h.kurz} hat nicht geantwortet`, text: `Anfrage vom ${datum(a.gesendet)} – Wiedervorlage ${rel(a.wv)} fällig. Nachfass-Mail ist vorbereitet.`, v, knopf: 'Nachfassen', act: 'nachfassen', arg: a.id });
    }
  }
  for (const v of d.vorgaenge) {
    if (v.status === 'angebot') {
      const ang = d.angebote.filter((o) => o.vorgang === v.id);
      const abw = ang.reduce((s, o) => s + o.pos.reduce((t, p) => t + p.abw.length, 0), 0);
      l.push({ id: 'ang-' + v.id + ang.length, prio: abw ? 'eilig' : 'heute', ico: 'doc', titel: `${ang.length} Angebot${ang.length > 1 ? 'e' : ''} prüfen`, text: abw ? `${abw} Abweichung${abw > 1 ? 'en' : ''} zur Anfrage gefunden – bitte ansehen.` : 'Keine Abweichungen gefunden. Kundenangebot kann vorbereitet werden.', v, knopf: 'Prüfen', href: `#/vorgang/${v.id}/angebote` });
    }
    if (v.status === 'erfassung') {
      const f = v.positionen.filter((p) => fehlend(p).length);
      if (f.length) l.push({ id: 'erf-' + v.id + f.length, prio: 'normal', ico: 'warn', titel: 'Erfassung unvollständig', text: f.map((p) => `Pos. ${p.nr}: ${fehlend(p).map((k) => FELDER[k]).join(', ')} fehlt`).join(' · '), v, knopf: 'Ergänzen', href: `#/vorgang/${v.id}` });
      else l.push({ id: 'erf-ok-' + v.id, prio: 'normal', ico: 'senden', titel: 'Bereit zum Anfragen', text: 'Alle Pflichtangaben vorhanden. Anfrage an Händler kann raus.', v, knopf: 'Anfrage erstellen', act: 'neueAnfrage', arg: v.id });
    }
  }
  for (const m of d.mails) {
    if (m.richtung === 'ein' && m.kategorie === 'Kunde' && !m.gelesen) {
      l.push({ id: 'k-' + m.id, prio: 'heute', ico: 'post', titel: `Nachricht von ${m.absender}`, text: m.ki, v: V(m.vorgang), knopf: 'Ansehen', href: `#/postfach/${m.id}` });
    }
  }
  for (const w of d.wiedervorlagen) {
    if (tagNr(w.faellig) <= 0) l.push({ id: 'w-' + w.id + w.faellig, prio: 'heute', ico: 'uhr', titel: 'Wiedervorlage', text: w.text, v: V(w.vorgang), knopf: 'Nachfassen', act: 'kundeNachfassen', arg: w.id });
  }
  const rang = { eilig: 0, heute: 1, normal: 2 };
  return l.filter((x) => !d.erledigt.includes(x.id)).sort((a, b) => rang[a.prio] - rang[b.prio]);
}

// ——— Seiten ———
function seiteUebersicht() {
  const auf = aufgaben();
  const offen = d.vorgaenge.filter((v) => v.status !== 'beauftragt').length;
  const warten = d.anfragen.filter((a) => a.status === 'gesendet').length;
  const rueck = d.anfragen.filter((a) => a.status === 'rueckfrage').length;
  const pruefen = d.vorgaenge.filter((v) => v.status === 'angebot').length;
  const neu = d.mails.filter((m) => m.richtung === 'ein' && !m.gelesen);
  const wvs = d.anfragen.filter((a) => a.status === 'gesendet' && a.wv && tagNr(a.wv) > 0).sort((a, b) => new Date(a.wv) - new Date(b.wv));
  const stunde = new Date().getHours();
  const gruss = stunde < 11 ? 'Guten Morgen' : stunde < 18 ? 'Guten Tag' : 'Guten Abend';
  return `
  <div class="kopf"><div><h1>${gruss}, ${ich.name.split(' ')[0]}</h1><p class="leise">${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })} · ${auf.length} Dinge zu erledigen</p></div>
  <a class="knopf primaer" href="#/erfassen">${ico('mic')} Neuen Vorgang einsprechen</a></div>
  <div class="kacheln">
    <a class="kachel" href="#/vorgaenge"><span class="zahl">${offen}</span><span>Offene Vorgänge</span></a>
    <a class="kachel" href="#/vorgaenge"><span class="zahl">${warten}</span><span>Warten auf Händler</span></a>
    <a class="kachel ${rueck ? 'akzent-rot' : ''}" href="#/postfach"><span class="zahl">${rueck}</span><span>Rückfragen offen</span></a>
    <a class="kachel ${pruefen ? 'akzent-violett' : ''}" href="#/vorgaenge"><span class="zahl">${pruefen}</span><span>Angebote prüfen</span></a>
  </div>
  <div class="raster-2">
    <section class="karte">
      <h2>Zu erledigen</h2>
      ${auf.length ? `<ul class="todo">${auf.map((a) => `
        <li class="prio-${a.prio}">
          <span class="todo-ico">${ico(a.ico)}</span>
          <div class="todo-text">
            <div class="todo-titel">${esc(a.titel)} ${a.v ? `<a class="chip" href="#/vorgang/${a.v.id}">${a.v.id} · ${esc(a.v.kunde)}</a>` : ''}</div>
            <div class="leise">${esc(a.text)}</div>
          </div>
          <div class="todo-akt">
            ${a.href ? `<a class="knopf klein" href="${a.href}">${a.knopf}</a>` : `<button class="knopf klein" data-act="${a.act}" data-arg="${a.arg}">${a.knopf}</button>`}
            <button class="knopf klein geist" data-act="erledigt" data-arg="${a.id}" title="Als erledigt markieren">${ico('haken')}</button>
          </div>
        </li>`).join('')}</ul>` : `<div class="leer">${ico('haken')}<p>Alles erledigt.</p></div>`}
    </section>
    <div class="spalte">
      <section class="karte">
        <div class="zeile-zw"><h2>Neu im Postfach</h2><a href="#/postfach" class="leise">Alle ›</a></div>
        ${neu.length ? `<ul class="liste-kompakt">${neu.slice(0, 4).map((m) => `
          <li><a href="#/postfach/${m.id}"><span class="kat kat-${katKlasse(m.kategorie)}">${m.kategorie}</span>
          <b>${esc(absender(m))}</b><span class="leise ellipse">${esc(m.ki)}</span></a></li>`).join('')}</ul>` : '<p class="leise">Keine neuen Nachrichten.</p>'}
      </section>
      <section class="karte">
        <h2>Nächste Wiedervorlagen</h2>
        ${wvs.length ? `<ul class="liste-kompakt">${wvs.slice(0, 5).map((a) => `
          <li><a href="#/vorgang/${a.vorgang}/anfragen">${ico('uhr')} <b>${datum(a.wv)}</b> <span class="leise ellipse">${H(a.haendler).kurz} · ${esc(V(a.vorgang).kunde)}</span></a></li>`).join('')}</ul>` : '<p class="leise">Keine offenen Wiedervorlagen.</p>'}
      </section>
    </div>
  </div>`;
}

function haendlerPunkte(v) {
  const anf = d.anfragen.filter((a) => a.vorgang === v.id);
  if (!anf.length) return '<span class="leise">noch nicht angefragt</span>';
  const t = { gesendet: 'wartet', rueckfrage: 'Rückfrage', angebot: 'Angebot da' };
  return anf.map((a) => `<span class="hpunkt st-${a.status}" title="${esc(H(a.haendler).name)}: ${t[a.status]}"><i style="background:${H(a.haendler).farbe}"></i>${esc(H(a.haendler).kurz)}</span>`).join('');
}

function seiteVorgaenge() {
  const f = ui.filter; const q = ui.suche.toLowerCase();
  const liste = d.vorgaenge
    .filter((v) => f === 'alle' || (f === 'offen' ? v.status !== 'beauftragt' : v.status === f))
    .filter((v) => !q || (v.id + v.kunde + v.art + v.adresse).toLowerCase().includes(q))
    .sort((a, b) => new Date(b.angelegt) - new Date(a.angelegt));
  const filter = [['alle', 'Alle'], ['offen', 'Offen'], ['erfassung', 'Erfassung'], ['angefragt', 'Angefragt'], ['rueckfrage', 'Rückfrage'], ['angebot', 'Angebot prüfen'], ['gesendet', 'Beim Kunden'], ['beauftragt', 'Beauftragt']];
  return `
  <div class="kopf"><div><h1>Vorgänge</h1><p class="leise">${d.vorgaenge.length} Vorgänge</p></div>
  <div class="knopfreihe"><button class="knopf" data-act="leererVorgang">${ico('plus')} Vorgang anlegen</button><a class="knopf primaer" href="#/erfassen">${ico('mic')} Einsprechen</a></div></div>
  <div class="filterleiste">
    <input type="search" class="suche" placeholder="Suchen: Kunde, Ort, Nummer …" value="${esc(ui.suche)}" data-input="suche">
    <div class="chips">${filter.map(([k, t]) => `<button class="chip-btn ${f === k ? 'an' : ''}" data-act="filter" data-arg="${k}">${t}</button>`).join('')}</div>
  </div>
  <div class="vliste">
  ${liste.map((v) => `
    <a class="vzeile karte" href="#/vorgang/${v.id}">
      <div class="v-haupt">
        <div class="v-titel"><b>${esc(v.kunde)}</b> <span class="leise">${v.id}</span></div>
        <div class="leise">${esc(v.art)} · ${esc(v.adresse)}</div>
      </div>
      <div class="v-pos">${ico('fenster')} ${v.positionen.length} Pos. / ${v.positionen.reduce((s, p) => s + (+p.stk || 0), 0)} Elemente</div>
      <div class="v-haendler">${haendlerPunkte(v)}</div>
      <div class="v-status">${badge(v.status)} ${avatar(N(v.nutzer))}</div>
    </a>`).join('') || '<div class="leer karte"><p>Keine Vorgänge gefunden.</p></div>'}
  </div>`;
}

function positionKarte(v, p, bearbeitbar = true) {
  const fehlt = fehlend(p); const warn = plausibel(p);
  const chip = (k) => p[k] ? `<span class="merkmal" title="${FELDER[k]}"><small>${FELDER[k]}</small>${esc(p[k])}</span>` : '';
  return `
  <article class="pos ${fehlt.length ? 'pos-fehlt' : ''}">
    <header>
      <div><span class="posnr">Pos. ${p.nr}</span> <b>${esc(p.raum || '–')}</b> <span class="leise">· ${p.stk} × ${esc(p.art)}</span></div>
      ${bearbeitbar ? `<button class="knopf klein geist nur-ico" data-act="posBearbeiten" data-arg="${v.id}|${p.nr}" title="Bearbeiten" aria-label="Pos. ${p.nr} bearbeiten">${ico('stift')}</button>` : ''}
    </header>
    <div class="pos-mass">${p.b || '?'} × ${p.h || '?'} <small>mm · ${esc(p.masstyp || 'Maßart?')}</small></div>
    <div class="merkmale">
      ${['material', 'teilung', 'oeffnung', 'anschlag', 'glas', 'glasOpt', 'farbeInnen', 'farbeAussen', 'rollladen', 'beschlag', 'sprossen'].filter((k) => !['keiner', 'keine', 'Standard'].includes(p[k])).map(chip).join('')}
      ${fehlt.map((k) => `<span class="merkmal fehlt"><small>${FELDER[k]}</small>fehlt</span>`).join('')}
    </div>
    ${p.bemerkung ? `<p class="leise klein">${esc(p.bemerkung)}</p>` : ''}
    ${warn.map((w) => `<p class="hinweis gelb">${ico('warn')} ${esc(w)}</p>`).join('')}
  </article>`;
}

function seiteVorgang(id, tab = 'positionen') {
  const v = V(id);
  if (!v) return '<div class="leer karte"><p>Vorgang nicht gefunden.</p><a href="#/vorgaenge">Zur Liste</a></div>';
  const anf = d.anfragen.filter((a) => a.vorgang === id);
  const ang = d.angebote.filter((o) => o.vorgang === id);
  const mails = d.mails.filter((m) => m.vorgang === id);
  const schritt = ABLAUF.indexOf(v.status === 'rueckfrage' ? 'angefragt' : v.status);
  const tabs = [['positionen', `Positionen (${v.positionen.length})`], ['anfragen', `Anfragen (${anf.length})`], ['angebote', `Händlerangebote (${ang.length})`], ['kundenangebot', 'Kundenangebot'], ['verlauf', `Verlauf (${mails.length})`]];
  const inhalt = { positionen: tabPositionen, anfragen: tabAnfragen, angebote: tabAngebote, kundenangebot: tabKundenangebot, verlauf: tabVerlauf }[tab] || tabPositionen;
  const zf = ui.zf[id];
  return `
  <nav class="krumen"><a href="#/vorgaenge">Vorgänge</a> › <span>${v.id}</span></nav>
  <div class="kopf"><div><h1>${esc(v.kunde)} <span class="leise">· ${esc(v.art)}</span></h1>
  <p class="leise">${v.id} · ${esc(v.adresse)} · ${esc(v.tel)} · ${esc(v.email)}</p></div>
  <div class="knopfreihe">${badge(v.status)} ${avatar(N(v.nutzer))}</div></div>
  <ol class="ablauf">${ABLAUF.map((s, i) => `<li class="${i < schritt ? 'fertig' : i === schritt ? 'jetzt' : ''}">${i === schritt && v.status === 'rueckfrage' ? 'Rückfrage' : STATUS[s].text.replace(' prüfen', '').replace(' in Arbeit', '')}</li>`).join('')}</ol>
  <section class="karte ki-box">
    <div class="zeile-zw"><h2>${ico('ki')} Zusammenfassung</h2>
    <button class="knopf klein" data-act="zusammenfassen" data-arg="${id}">${zf ? 'Neu erstellen' : 'Zusammenfassen'}</button></div>
    <div id="zf">${zf ? `<ul>${zf.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : `<p class="leise">${esc(v.notiz)}</p>`}</div>
  </section>
  <div class="tabs" role="tablist">${tabs.map(([k, t]) => `<a role="tab" class="${tab === k ? 'an' : ''}" href="#/vorgang/${id}/${k}">${t}</a>`).join('')}</div>
  <div class="tab-inhalt">${inhalt(v, anf, ang, mails)}</div>`;
}

function tabPositionen(v) {
  const fehlt = v.positionen.filter((p) => fehlend(p).length).length;
  return `
  <div class="werkzeug">
    <div class="leise">${fehlt ? `<span class="hinweis rot inline">${ico('warn')} ${fehlt} Position${fehlt > 1 ? 'en' : ''} unvollständig</span>` : `<span class="hinweis gruen inline">${ico('haken')} Alle Pflichtangaben vorhanden</span>`}</div>
    <div class="knopfreihe">
      <button class="knopf" data-act="posNeu" data-arg="${v.id}">${ico('plus')} Position</button>
      <a class="knopf" href="#/erfassen/${v.id}">${ico('mic')} Einsprechen</a>
      <button class="knopf primaer" data-act="neueAnfrage" data-arg="${v.id}">${ico('senden')} Anfrage an Händler</button>
    </div>
  </div>
  <div class="pos-raster">${v.positionen.map((p) => positionKarte(v, p)).join('')}</div>`;
}

function tabAnfragen(v, anf) {
  const t = { gesendet: ['Wartet auf Antwort', 'blau'], rueckfrage: ['Rückfrage offen', 'rot'], angebot: ['Angebot erhalten', 'gruen'] };
  return `
  <div class="werkzeug"><p class="leise">Jeder Händler bekommt die Anfrage in seinem Wording und Format. Wiedervorlage automatisch nach Ablauf der Frist.</p>
  <button class="knopf primaer" data-act="neueAnfrage" data-arg="${v.id}">${ico('plus')} Neue Anfrage</button></div>
  ${anf.length ? `<div class="raster-karten">${anf.map((a) => {
    const h = H(a.haendler);
    return `<article class="karte anfrage">
      <div class="zeile-zw"><h3><i class="hfarbe" style="background:${h.farbe}"></i>${esc(h.name)}</h3><span class="badge ton-${t[a.status][1]}">${t[a.status][0]}</span></div>
      <dl class="daten">
        <dt>Gesendet</dt><dd>${datum(a.gesendet)} (${rel(a.gesendet)})</dd>
        <dt>Positionen</dt><dd>${a.positionen.map((n) => 'Pos. ' + n).join(', ')}</dd>
        <dt>Format</dt><dd>${esc(h.format)}</dd>
        ${a.status === 'gesendet' && a.wv ? `<dt>Wiedervorlage</dt><dd class="${tagNr(a.wv) <= 0 ? 'rot' : ''}">${datum(a.wv)} (${rel(a.wv)})</dd>` : ''}
      </dl>
      <div class="knopfreihe">
        <button class="knopf klein" data-act="anfrageAnsehen" data-arg="${a.id}">${ico('doc')} Anfrage ansehen</button>
        ${a.status === 'gesendet' ? `<button class="knopf klein" data-act="nachfassen" data-arg="${a.id}">${ico('uhr')} Nachfassen</button>
        <button class="knopf klein demo" data-act="antwortSimulieren" data-arg="${a.id}" title="Nur in der Vorschau">${ico('ki')} Demo: Antwort simulieren</button>` : ''}
        ${a.status === 'rueckfrage' ? `<button class="knopf klein primaer" data-act="rueckfrage" data-arg="${a.id}">Rückfrage beantworten</button>` : ''}
        ${a.status === 'angebot' ? `<a class="knopf klein" href="#/vorgang/${v.id}/angebote">Angebot ansehen</a>` : ''}
      </div>
    </article>`;
  }).join('')}</div>` : `<div class="leer karte">${ico('senden')}<p>Noch keine Anfrage gesendet.</p></div>`}`;
}

function summe(o, v) { return o.pos.reduce((t, p) => t + p.preis * (v.positionen.find((x) => x.nr === p.nr)?.stk || 1), 0); }

function tabAngebote(v, anf, ang) {
  if (!ang.length) return `<div class="leer karte">${ico('doc')}<p>Noch kein Händlerangebot eingegangen.</p><p class="leise">Sobald ein Angebot per Mail kommt, liest die KI Preise, Lieferzeit und Abweichungen aus.</p></div>`;
  const min = Math.min(...ang.map((o) => summe(o, v)));
  return `
  <div class="raster-karten">${ang.map((o) => {
    const h = H(o.haendler); const s = summe(o, v); const abw = o.pos.reduce((t, p) => t + p.abw.length, 0);
    const ka = d.kundenangebote[v.id];
    return `<article class="karte angebot ${s === min && ang.length > 1 ? 'bestes' : ''}">
      <div class="zeile-zw"><h3><i class="hfarbe" style="background:${h.farbe}"></i>${esc(h.kurz)}</h3>${s === min && ang.length > 1 ? '<span class="badge ton-gruen">günstigstes</span>' : ''}</div>
      <div class="preis">${eur(s)} <small>netto EK</small></div>
      <dl class="daten"><dt>Angebot</dt><dd>${o.nummer} vom ${datum(o.datum)}</dd><dt>Lieferzeit</dt><dd>${o.lieferzeit}</dd><dt>Gültig bis</dt><dd class="${tagNr(o.gueltig) < 7 ? 'rot' : ''}">${datum(o.gueltig)}</dd><dt>Zahlung</dt><dd>${o.zahlung}</dd></dl>
      ${abw ? `<p class="hinweis rot">${ico('warn')} ${abw} Abweichung${abw > 1 ? 'en' : ''} zur Anfrage</p>` : `<p class="hinweis gruen">${ico('haken')} Entspricht der Anfrage</p>`}
      <button class="knopf klein ${ka?.angebot === o.id ? 'primaer' : ''}" data-act="angebotWaehlen" data-arg="${v.id}|${o.id}">${ka?.angebot === o.id ? ico('haken') + ' Grundlage Kundenangebot' : 'Für Kundenangebot verwenden'}</button>
    </article>`;
  }).join('')}</div>
  <section class="karte">
    <h2>Abgleich je Position</h2>
    <p class="leise">Die KI vergleicht jede angebotene Position mit der Anfrage. Abweichungen sind rot markiert.</p>
    <div class="abgleich">
      ${v.positionen.map((p) => `
      <div class="abgleich-zeile">
        <div class="abgleich-pos"><b>Pos. ${p.nr}</b> ${p.stk} × ${esc(p.art)} ${esc(p.raum)}<br><span class="leise klein">${p.b} × ${p.h} mm · ${esc(p.material)} · ${esc(p.glas)}</span></div>
        ${ang.map((o) => {
    const op = o.pos.find((x) => x.nr === p.nr);
    if (!op) return `<div class="abgleich-zelle fehlt"><small>${esc(H(o.haendler).kurz)}</small>nicht angeboten</div>`;
    return `<div class="abgleich-zelle ${op.abw.length ? 'abw' : ''}"><small>${esc(H(o.haendler).kurz)}</small><b>${eur(op.preis * p.stk)}</b>${p.stk > 1 ? ` <span class="leise klein">(${p.stk} × ${eur(op.preis)})</span>` : ''}
            ${op.abw.map((x) => `<div class="abw-text">${ico('warn')} ${FELDER[x.feld]}: <s>${esc(x.angefragt)}</s> → ${esc(x.angeboten)}</div>`).join('')}</div>`;
  }).join('')}
      </div>`).join('')}
    </div>
  </section>`;
}

const MONTAGE = { Fenster: 95, Balkontür: 140, Terrassentür: 140, 'Hebe-Schiebe-Tür': 480, Haustür: 260, Nebentür: 180 };

function kalkulation(v) {
  const ka = d.kundenangebote[v.id]; if (!ka) return null;
  const o = d.angebote.find((x) => x.id === ka.angebot); if (!o) return null;
  const f = 1 + ka.aufschlag / 100;
  const zeilen = v.positionen.map((p) => {
    const op = o.pos.find((x) => x.nr === p.nr);
    const ek = op ? op.preis : 0;
    const ep = Math.round(ek * f / 5) * 5;
    return { p, ek: ek * p.stk, ep, gp: ep * p.stk };
  });
  const elemente = v.positionen.reduce((s, p) => s + p.stk, 0);
  const extra = [];
  if (ka.montage) extra.push({ text: `Montage nach RAL-Leitfaden inkl. Abdichtung innen/außen, ${elemente} Elemente`, gp: v.positionen.reduce((s, p) => s + (MONTAGE[p.art] || 95) * p.stk, 0) });
  if (ka.demontage) extra.push({ text: `Ausbau und fachgerechte Entsorgung der Altelemente, ${elemente} Stück`, gp: 45 * elemente });
  if (ka.fensterbank) { const n = v.positionen.filter((p) => p.art === 'Fenster').reduce((s, p) => s + p.stk, 0); if (n) extra.push({ text: `Fensterbänke innen, Kunststein, ${n} Stück`, gp: 85 * n }); }
  const netto = zeilen.reduce((s, z) => s + z.gp, 0) + extra.reduce((s, z) => s + z.gp, 0);
  const ek = zeilen.reduce((s, z) => s + z.ek, 0);
  return { ka, o, zeilen, extra, netto, mwst: netto * 0.19, brutto: netto * 1.19, ek, ertrag: zeilen.reduce((s, z) => s + z.gp, 0) - ek };
}

function abwHinweis(v, o) {
  const l = o.pos.flatMap((p) => p.abw.map((x) => `Pos. ${p.nr}: ${FELDER[x.feld]} ${x.angeboten} statt ${x.angefragt}`));
  if (!l.length) return '';
  return `<p class="hinweis rot">${ico('warn')} <span>Händlerangebot weicht ab – ${esc(l.join('; '))}. Im Kundenangebot steht die Ausführung laut Anfrage. Vor dem Senden klären oder Position anpassen.</span></p>`;
}

function tabKundenangebot(v) {
  const k = kalkulation(v);
  if (!k) return `<div class="leer karte">${ico('euro')}<p>Noch kein Händlerangebot als Grundlage gewählt.</p><a class="knopf" href="#/vorgang/${v.id}/angebote">Händlerangebote ansehen</a></div>`;
  const { ka, o } = k;
  return `
  <div class="ka-raster">
    <section class="karte ka-steuer">
      <h2>Kalkulation</h2>
      <label>Grundlage<select data-input="kaAngebot" data-arg="${v.id}">${d.angebote.filter((x) => x.vorgang === v.id).map((x) => `<option value="${x.id}" ${x.id === o.id ? 'selected' : ''}>${esc(H(x.haendler).kurz)} – ${x.nummer}</option>`).join('')}</select></label>
      <label>Aufschlag auf Einkauf: <b id="ka-wert">${ka.aufschlag} %</b><input type="range" min="0" max="60" step="1" value="${ka.aufschlag}" data-input="kaAufschlag" data-arg="${v.id}"></label>
      <label class="haken"><input type="checkbox" ${ka.montage ? 'checked' : ''} data-input="kaMontage" data-arg="${v.id}"> Montage</label>
      <label class="haken"><input type="checkbox" ${ka.demontage ? 'checked' : ''} data-input="kaDemontage" data-arg="${v.id}"> Demontage + Entsorgung</label>
      <label class="haken"><input type="checkbox" ${ka.fensterbank ? 'checked' : ''} data-input="kaFensterbank" data-arg="${v.id}"> Fensterbänke innen</label>
      ${abwHinweis(v, o)}
      <div class="intern">
        <div class="intern-titel">${ico('warn')} Nur intern – erscheint nicht im Angebot</div>
        <dl class="daten"><dt>Einkauf (${esc(H(o.haendler).kurz)})</dt><dd>${eur(k.ek)}</dd><dt>Rohertrag Elemente</dt><dd>${eur(k.ertrag)}</dd><dt>Spanne</dt><dd>${k.netto ? Math.round(k.ertrag / (k.ek + k.ertrag) * 100) : 0} %</dd></dl>
      </div>
      <div class="knopfreihe">
        <button class="knopf" data-act="drucken">${ico('doc')} PDF / Drucken</button>
        <button class="knopf primaer" data-act="kundeSenden" data-arg="${v.id}">${ico('senden')} An Kunden senden</button>
      </div>
      ${ka.gesendet ? `<p class="hinweis gruen">${ico('haken')} Gesendet am ${datum(ka.gesendet)}</p>` : ''}
    </section>
    <section class="blatt" id="druckbereich">
      <div class="blatt-kopf"><div><b>${esc(FIRMA.name)}</b><br>${esc(FIRMA.strasse)} · ${esc(FIRMA.ort)}<br>${esc(FIRMA.tel)} · ${esc(FIRMA.mail)}</div><div class="logo">${ico('fenster')}</div></div>
      <div class="blatt-an">${esc(v.kunde)}<br>${esc(v.adresse.split(',')[0])}<br>${esc(v.adresse.split(',')[1] || '')}</div>
      <div class="blatt-meta"><h2>Angebot ${v.id.replace('V-', 'AG-')}</h2><span>Datum: ${datum(new Date().toISOString())}<br>Gültig bis: ${datum(inTagen(30))}</span></div>
      <p>Sehr geehrte${v.kunde.startsWith('Herr') ? 'r' : ''} ${esc(v.kunde.replace('Familie', 'Familie'))},<br>vielen Dank für das angenehme Gespräch. Gerne bieten wir Ihnen für Ihr Vorhaben „${esc(v.art)}“ an:</p>
      <table class="ka-tab">
        <thead><tr><th>Pos.</th><th>Beschreibung</th><th class="r">Menge</th><th class="r">Einzelpreis</th><th class="r">Gesamt</th></tr></thead>
        <tbody>
          ${k.zeilen.map((z) => `<tr><td>${z.p.nr}</td><td><b>${esc(z.p.raum)}: ${esc(z.p.art)} ${z.p.b} × ${z.p.h} mm</b><br><span class="klein">${esc(kundenText(z.p))}</span></td><td class="r">${z.p.stk}</td><td class="r">${eur(z.ep)}</td><td class="r">${eur(z.gp)}</td></tr>`).join('')}
          ${k.extra.map((x, i) => `<tr><td>${k.zeilen.length + i + 1}</td><td>${esc(x.text)}</td><td class="r">1</td><td class="r">${eur(x.gp)}</td><td class="r">${eur(x.gp)}</td></tr>`).join('')}
        </tbody>
        <tfoot>
          <tr><td colspan="4" class="r">Summe netto</td><td class="r">${eur(k.netto)}</td></tr>
          <tr><td colspan="4" class="r">zzgl. 19 % MwSt.</td><td class="r">${eur(k.mwst)}</td></tr>
          <tr class="gesamt"><td colspan="4" class="r">Gesamtbetrag</td><td class="r">${eur(k.brutto)}</td></tr>
        </tfoot>
      </table>
      <p class="klein">Lieferzeit ca. ${esc(o.lieferzeit.replace(/(\d+)–?(\d+)?\s*Wochen/, (m, a, b) => (+(b || a) + 2) + ' Wochen'))} nach Auftragserteilung und technischer Klärung. Alle Maße werden vor Bestellung durch ein verbindliches Aufmaß bestätigt.</p>
      <p>Mit freundlichen Grüßen<br>${esc(ich.name)}</p>
    </section>
  </div>`;
}

function tabVerlauf(v, anf, ang, mails) {
  const l = [...mails].sort((a, b) => new Date(b.datum) - new Date(a.datum));
  if (!l.length) return '<div class="leer karte"><p>Noch kein Schriftverkehr.</p></div>';
  return `<ol class="zeitleiste">${l.map((m) => `
    <li class="${m.richtung}">
      <span class="zl-ico">${ico(m.richtung === 'ein' ? 'ein' : 'aus')}</span>
      <div class="karte">
        <div class="zeile-zw"><div><span class="kat kat-${katKlasse(m.kategorie)}">${m.kategorie}</span> <b>${m.richtung === 'ein' ? 'von ' + esc(absender(m)) : 'an ' + esc(m.an === 'kunde' ? v.kunde : H(m.an).kurz)}</b></div><span class="leise klein">${datum(m.datum)}</span></div>
        <div>${esc(m.betreff)}</div>
        ${m.ki ? `<p class="ki-zeile">${ico('ki')} ${esc(m.ki)}</p>` : ''}
        ${m.richtung === 'ein' ? `<details><summary>Original anzeigen</summary><pre>${esc(m.text)}</pre></details>` : ''}
      </div>
    </li>`).join('')}</ol>`;
}

function absender(m) { return m.von === 'kunde' ? m.absender : H(m.von)?.kurz || m.von; }
function katKlasse(k) { return { 'Rückfrage': 'rot', Angebot: 'violett', Kunde: 'blau', 'Auftragsbestätigung': 'gruen', Werbung: 'grau', Anfrage: 'grau', Kundenangebot: 'gelb', Nachfassen: 'grau', Antwort: 'grau' }[k] || 'grau'; }

function seitePostfach(mailId) {
  const ein = d.mails.filter((m) => m.richtung === 'ein').sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const kats = ['Rückfrage', 'Angebot', 'Kunde', 'Auftragsbestätigung', 'Werbung'];
  const f = ui.postfachFilter;
  const liste = f === 'alle' ? ein : f === 'gesendet' ? d.mails.filter((m) => m.richtung === 'aus').sort((a, b) => new Date(b.datum) - new Date(a.datum)) : ein.filter((m) => m.kategorie === f);
  const m = mailId ? d.mails.find((x) => x.id === mailId) : null;
  if (m && !m.gelesen) { m.gelesen = true; speichern(); setTimeout(navZahlen, 0); }
  return `
  <div class="kopf"><div><h1>Postfach</h1><p class="leise">${FIRMA.mail} · von der KI vorsortiert und den Vorgängen zugeordnet</p></div>
  <button class="knopf demo" data-act="mailSimulieren">${ico('ki')} Demo: neue Mail empfangen</button></div>
  <div class="chips">
    <button class="chip-btn ${f === 'alle' ? 'an' : ''}" data-act="pfFilter" data-arg="alle">Alle <span>${ein.length}</span></button>
    ${kats.map((k) => `<button class="chip-btn ${f === k ? 'an' : ''}" data-act="pfFilter" data-arg="${k}"><i class="punkt kat-${katKlasse(k)}"></i>${k} <span>${ein.filter((x) => x.kategorie === k).length}</span></button>`).join('')}
    <button class="chip-btn ${f === 'gesendet' ? 'an' : ''}" data-act="pfFilter" data-arg="gesendet">Gesendet</button>
  </div>
  <div class="postfach ${m ? 'mit-detail' : ''}">
    <ul class="mailliste karte">${liste.map((x) => `
      <li class="${x.gelesen === false ? 'ungelesen' : ''} ${m?.id === x.id ? 'aktiv' : ''}"><a href="#/postfach/${x.id}">
        <div class="zeile-zw"><b>${esc(x.richtung === 'ein' ? absender(x) : 'an ' + (x.an === 'kunde' ? V(x.vorgang).kunde : H(x.an).kurz))}</b><span class="leise klein">${rel(x.datum)}</span></div>
        <div class="ellipse">${esc(x.betreff)}</div>
        <div class="zeile-l"><span class="kat kat-${katKlasse(x.kategorie)}">${x.kategorie}</span>${x.vorgang ? `<span class="chip">${x.vorgang}</span>` : ''}${x.anhang ? ico('anhang', 'klein') : ''}</div>
      </a></li>`).join('') || '<li class="leise" style="padding:16px">Keine Nachrichten.</li>'}
    </ul>
    ${m ? mailDetail(m) : '<div class="karte leer nur-breit">' + ico('post') + '<p>Nachricht auswählen</p></div>'}
  </div>`;
}

function mailDetail(m) {
  const v = m.vorgang ? V(m.vorgang) : null;
  const a = v && m.von !== 'kunde' ? d.anfragen.find((x) => x.vorgang === v.id && x.haendler === m.von) : null;
  let akt = '';
  if (m.kategorie === 'Rückfrage' && a?.status === 'rueckfrage') akt = `<button class="knopf primaer" data-act="rueckfrage" data-arg="${a.id}">${ico('ki')} Antwort vorbereiten</button>`;
  else if (m.kategorie === 'Angebot' && v) akt = `<a class="knopf primaer" href="#/vorgang/${v.id}/angebote">Angebot mit Anfrage abgleichen</a>`;
  else if (m.kategorie === 'Kunde' && v) akt = `<button class="knopf primaer" data-act="kundeAntworten" data-arg="${m.id}">${ico('ki')} Antwort vorbereiten</button>`;
  else if (m.kategorie === 'Auftragsbestätigung') akt = `<button class="knopf primaer" data-act="abPruefen" data-arg="${m.id}">${ico('ki')} Mit Bestellung abgleichen</button>`;
  else if (m.kategorie === 'Werbung') akt = `<button class="knopf" data-act="archiv" data-arg="${m.id}">Archivieren</button>`;
  return `
  <article class="karte maildetail">
    <a class="nur-schmal knopf klein geist" href="#/postfach">${ico('zurueck')} Zurück</a>
    <h2>${esc(m.betreff)}</h2>
    <p class="leise">${m.richtung === 'ein' ? 'Von ' + esc(absender(m)) : 'An ' + esc(m.an === 'kunde' ? v?.kunde : H(m.an)?.kurz)} · ${datum(m.datum)}</p>
    ${m.anhang ? `<p><span class="anhang">${ico('anhang')} ${esc(m.anhang)}</span></p>` : ''}
    ${m.ki ? `<div class="ki-box karte">
      <div class="ki-titel">${ico('ki')} KI-Einordnung</div>
      <p><span class="kat kat-${katKlasse(m.kategorie)}">${m.kategorie}</span> ${v ? `zugeordnet zu <a href="#/vorgang/${v.id}">${v.id} · ${esc(v.kunde)}</a>` : 'keinem Vorgang zugeordnet'}</p>
      <p>${esc(m.ki)}</p>
      <div class="knopfreihe">${akt}</div>
    </div>` : ''}
    <pre class="mailtext">${esc(m.text)}</pre>
  </article>`;
}

function seiteErfassen(vid) {
  const v = vid ? V(vid) : null;
  const e = ui.erfassung;
  const sprache = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  return `
  ${v ? `<nav class="krumen"><a href="#/vorgaenge">Vorgänge</a> › <a href="#/vorgang/${v.id}">${v.id}</a> › <span>Einsprechen</span></nav>` : ''}
  <div class="kopf"><div><h1>${v ? `Positionen ergänzen – ${esc(v.kunde)}` : 'Neuer Vorgang'}</h1>
  <p class="leise">Einsprechen oder tippen, was der Kunde möchte. Die KI macht daraus eine Positionsliste. Sie prüfen, bevor etwas übernommen wird.</p></div></div>
  <div class="erf-raster">
    <section class="karte">
      <h2>1. Wünsche erfassen</h2>
      <div class="diktat">
        <textarea id="erf-text" rows="9" placeholder="z. B.: Familie Huber, Sanierung. Alles Holz-Alu, innen Kiefer, außen anthrazit, dreifach verglast. Wohnzimmer zwei Fenster zweiflügelig Stulp 1230 mal 1480 …">${esc(e?.text || '')}</textarea>
        ${sprache ? `<button class="mic" data-act="diktat" title="Einsprechen" aria-label="Einsprechen">${ico('mic')}</button>` : ''}
      </div>
      ${sprache ? '' : '<p class="leise klein">Tipp: Am Handy das Mikrofon der Tastatur zum Einsprechen verwenden.</p>'}
      <div class="knopfreihe">
        <button class="knopf geist" data-act="beispiel">Beispiel einfügen</button>
        <button class="knopf primaer" data-act="auswerten" data-arg="${vid || ''}">${ico('ki')} Auswerten</button>
      </div>
      <div class="legende">
        <span><i class="lg gesagt"></i>gesagt</span><span><i class="lg alle"></i>übernommen (für alle / aus vorheriger Pos.)</span><span><i class="lg unsicher"></i>bitte prüfen</span><span><i class="lg fehlt"></i>fehlt – Pflicht</span>
      </div>
    </section>
    <section class="karte" id="erf-ergebnis">
      <h2>2. Vorschlag prüfen</h2>
      ${e?.ergebnis ? erfErgebnis(e.ergebnis, vid) : `<div class="leer">${ico('ki')}<p class="leise">Hier erscheint die Positionsliste.</p></div>`}
    </section>
  </div>`;
}

function erfErgebnis(r, vid) {
  if (!r.positionen.length) return `<p class="hinweis gelb">${ico('warn')} Keine Elemente erkannt. Bitte Raum, Element und Maße nennen, z. B. „Küche Dreh-Kipp-Fenster 1010 mal 1235“.</p>`;
  const quelle = (p, k) => { const q = p._q?.[k]; if (!p[k] && k in FELDER && fehlend(p).includes(k)) return 'fehlt'; if (!q) return ''; if (q === 'gesagt') return 'gesagt'; if (q === 'alle' || q.startsWith('pos')) return 'alle'; return 'unsicher'; };
  const titel = (p, k) => { const q = p._q?.[k]; if (q === 'alle') return 'für alle Positionen genannt'; if (q?.startsWith('pos')) return 'übernommen aus Pos. ' + q.slice(3); if (q === 'unsicher') return 'unsicher erkannt – bitte prüfen'; if (q === 'umgerechnet') return 'von Metern in mm umgerechnet'; return ''; };
  const felder = ['raum', 'stk', 'b', 'h', 'masstyp', 'material', 'teilung', 'oeffnung', 'anschlag', 'glas', 'glasOpt', 'farbeInnen', 'farbeAussen', 'rollladen', 'beschlag', 'sprossen'];
  const offen = r.positionen.filter((p) => fehlend(p).length).length;
  return `
  ${!vid ? `<div class="erf-kunde"><label>Kunde<input id="erf-kunde" value="${esc(r.kunde || '')}" placeholder="Name des Kunden"></label><label>Vorhaben<input id="erf-projekt" value="${esc(r.projekt ? r.projekt[0].toUpperCase() + r.projekt.slice(1) : '')}" placeholder="z. B. Sanierung EFH"></label></div>` : ''}
  <p class="${offen ? 'hinweis rot' : 'hinweis gruen'}">${ico(offen ? 'warn' : 'haken')} ${r.positionen.length} Positionen erkannt${offen ? ` · ${offen} mit fehlenden Pflichtangaben (rot). Diese können Sie nach dem Übernehmen ergänzen.` : ' · alle Pflichtangaben vorhanden.'}</p>
  <div class="erf-liste">${r.positionen.map((p) => `
    <article class="pos erf">
      <header><div><span class="posnr">Pos. ${p.nr}</span> <b>${esc(p.art)}</b></div></header>
      <div class="erf-felder">${felder.filter((k) => p[k] || quelle(p, k) === 'fehlt').map((k) => `<span class="ef q-${quelle(p, k) || 'gesagt'}" title="${esc(titel(p, k))}"><small>${FELDER[k]}</small>${p[k] ? esc(p[k]) + (k === 'b' || k === 'h' ? ' mm' : '') : '—'}</span>`).join('')}</div>
      ${plausibel(p).map((w) => `<p class="hinweis gelb">${ico('warn')} ${esc(w)}</p>`).join('')}
    </article>`).join('')}</div>
  <div class="knopfreihe"><button class="knopf primaer" data-act="uebernehmen" data-arg="${vid || ''}">${ico('haken')} ${vid ? 'In Vorgang übernehmen' : 'Vorgang anlegen'}</button></div>`;
}

function seiteHaendler() {
  const stil = { formal: 'Förmlich, ausführliche Positionsliste als PDF', kurz: 'Knapp und direkt, Kürzel (DK, Fix), Excel-Liste', technisch: 'Technisch, mit Uw-Werten und Glasaufbau' };
  return `
  <div class="kopf"><div><h1>Großhändler</h1><p class="leise">Jeder Händler hat sein eigenes Anfrage-Wording, Format und seine Nachfassfrist.</p></div>
  <button class="knopf" data-act="hinweis" data-arg="In der fertigen App: Händler anlegen und Vorlage anhand echter Muster-Anfragen einstellen.">${ico('plus')} Händler</button></div>
  <div class="raster-karten">${d.haendler.map((h) => {
    const anf = d.anfragen.filter((a) => a.haendler === h.id);
    return `<article class="karte">
      <h3><i class="hfarbe" style="background:${h.farbe}"></i>${esc(h.name)}</h3>
      <dl class="daten">
        <dt>Ansprechpartner</dt><dd>${esc(h.kontakt)}</dd><dt>E-Mail</dt><dd>${esc(h.email)}</dd>
        <dt>Systeme</dt><dd>${esc(h.systeme)}</dd><dt>Wording</dt><dd>${stil[h.stil]}</dd>
        <dt>Format</dt><dd>${esc(h.format)}</dd><dt>Nachfassen nach</dt><dd>${h.frist} Tagen</dd>
        <dt>Anfragen</dt><dd>${anf.length} gesamt · ${anf.filter((a) => a.status !== 'angebot').length} offen</dd>
      </dl>
      <button class="knopf klein" data-act="musterAnfrage" data-arg="${h.id}">${ico('doc')} Beispiel-Anfrage ansehen</button>
    </article>`;
  }).join('')}</div>`;
}

function seiteEinstellungen() {
  const kat = [['art', 'Elementarten'], ['material', 'Material'], ['oeffnung', 'Öffnungsarten'], ['glas', 'Verglasung'], ['glasOpt', 'Glasoptionen'], ['farbe', 'Farben/Dekore'], ['rollladen', 'Rollladen'], ['beschlag', 'Beschlag']];
  return `
  <div class="kopf"><div><h1>Einstellungen</h1><p class="leise">Vorschau – in der fertigen App alles pflegbar.</p></div></div>
  <div class="raster-karten">
    <section class="karte"><h2>Betrieb</h2><dl class="daten"><dt>Firma</dt><dd>${esc(FIRMA.name)}</dd><dt>Anschrift</dt><dd>${esc(FIRMA.strasse)}, ${esc(FIRMA.ort)}</dd><dt>Telefon</dt><dd>${esc(FIRMA.tel)}</dd><dt>Postfach</dt><dd>${esc(FIRMA.mail)}</dd></dl></section>
    <section class="karte"><h2>Benutzer</h2><ul class="liste-kompakt">${NUTZER.map((n) => `<li>${avatar(n)} ${esc(n.name)}</li>`).join('')}</ul></section>
    <section class="karte"><h2>Fristen</h2><dl class="daten"><dt>Nachfassen Händler</dt><dd>14 Tage (je Händler änderbar)</dd><dt>Nachfassen Kunde</dt><dd>7 Tage</dd><dt>Hinweis Angebotsgültigkeit</dt><dd>7 Tage vor Ablauf</dd></dl></section>
  </div>
  <section class="karte"><h2>Merkmalkatalog</h2><p class="leise">Vorschlag – wird durch Ihren eigenen Katalog ersetzt. Die KI wählt nur Werte aus dieser Liste.</p>
  <div class="katalog">${kat.map(([k, t]) => `<div><h3>${t}</h3><div class="merkmale">${KATALOG[k].map((x) => `<span class="merkmal">${esc(x)}</span>`).join('')}</div></div>`).join('')}</div></section>
  <section class="karte"><h2>Vorschau</h2><p class="leise">Alle Daten sind erfunden und werden nur in diesem Browser gespeichert.</p><button class="knopf" data-act="reset">Demo zurücksetzen</button></section>`;
}

// ——— Dialoge ———
function modal(titel, inhalt, knoepfe = [], breit = false) {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-hg" data-act="schliessen"></div>
  <div class="modal ${breit ? 'breit' : ''}" role="dialog" aria-modal="true" aria-label="${esc(titel)}">
    <header><h2>${titel}</h2><button class="knopf geist klein" data-act="schliessen" aria-label="Schließen">${ico('x')}</button></header>
    <div class="modal-inhalt">${inhalt}</div>
    ${knoepfe.length ? `<footer>${knoepfe.map((k) => `<button class="knopf ${k.art || ''}" data-act="${k.act}" data-arg="${esc(k.arg || '')}">${k.text}</button>`).join('')}</footer>` : ''}
  </div>`;
  m.hidden = false;
  document.body.classList.add('modal-offen');
  setTimeout(() => m.querySelector('.modal input, .modal select, .modal textarea, .modal footer .primaer')?.focus(), 30);
}
function schliessen() { $('#modal').hidden = true; $('#modal').innerHTML = ''; document.body.classList.remove('modal-offen'); }

function toast(text, art = '') {
  const t = document.createElement('div');
  t.className = 'toast ' + art; t.innerHTML = text.startsWith('<svg') ? text.replace(/^(<svg.*?<\/svg>)\s*/, '$1<span>') + '</span>' : '<span>' + text + '</span>';
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('weg'), 4200);
  setTimeout(() => t.remove(), 4700);
}

function mailVorschau(an, betreff, text, anhang) {
  return `<div class="mailvorschau">
    <div class="mv-kopf"><span>An</span><b>${esc(an)}</b><span>Betreff</span><input value="${esc(betreff)}" id="mv-betreff"></div>
    ${anhang ? `<div class="mv-anhang">${ico('anhang')} ${esc(anhang)}</div>` : ''}
    <textarea id="mv-text" rows="12">${esc(text)}</textarea>
    <p class="leise klein">${ico('ki')} Entwurf der KI – bitte prüfen. Gesendet wird erst mit Ihrem Klick.</p>
  </div>`;
}

function positionsTabelle(v, nrs, stil) {
  const pos = v.positionen.filter((p) => nrs.includes(p.nr));
  return `<div class="ptab"><div class="ptab-kopf">Positionsliste · Kommission ${v.id}</div>${pos.map((p) => `
    <div class="ptab-zeile"><div class="ptab-nr">${p.nr}</div><div><b>${p.stk} Stk. ${esc(p.art)} – ${p.b} × ${p.h} mm</b> <span class="leise klein">${esc(p.masstyp)}, ${esc(p.raum)}</span>
    <ul>${positionsZeile(p, stil).map((z) => `<li>${esc(z)}</li>`).join('')}</ul></div></div>`).join('')}</div>`;
}

// Anfrage-Assistent: 1 Händler wählen → 2 Prüfen → 3 Vorschau → senden
function anfrageSchritt() {
  const w = ui.wiz; const v = V(w.vorgang);
  if (w.schritt === 1) {
    modal(`Anfrage für ${esc(v.kunde)} · Schritt 1 von 3`, `
      <p>An welche Händler soll die Anfrage gehen?</p>
      <div class="auswahl">${d.haendler.map((h) => {
      const schon = d.anfragen.find((a) => a.vorgang === v.id && a.haendler === h.id);
      return `<label class="auswahl-k"><input type="checkbox" name="h" value="${h.id}" ${w.haendler.includes(h.id) ? 'checked' : ''}>
        <span><b><i class="hfarbe" style="background:${h.farbe}"></i>${esc(h.name)}</b><br><span class="leise klein">${esc(h.systeme)} · ${esc(h.format)}${schon ? ' · <b>bereits angefragt</b>' : ''}</span></span></label>`;
    }).join('')}</div>
      <p class="leise klein">Alle ${v.positionen.length} Positionen werden angefragt. (In der fertigen App auch einzelne Positionen je Händler wählbar.)</p>`,
    [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: 'Weiter zur Prüfung', act: 'wizWeiter', art: 'primaer' }]);
  } else if (w.schritt === 2) {
    const fehlt = v.positionen.filter((p) => fehlend(p).length);
    const warn = v.positionen.flatMap((p) => plausibel(p).map((x) => `Pos. ${p.nr}: ${x}`));
    const unsicherMass = v.positionen.some((p) => p.masstyp === 'Rohbaumaß');
    const ok = !fehlt.length;
    modal(`Prüfung vor dem Versand · Schritt 2 von 3`, `
      <p>Fenster sind Sonderanfertigungen. Bitte die wichtigsten Angaben bestätigen.</p>
      <ul class="pruefliste">
        <li class="${ok ? 'ok' : 'nein'}">${ico(ok ? 'haken' : 'x')} Pflichtangaben vollständig ${ok ? '' : `– fehlt bei ${fehlt.map((p) => `Pos. ${p.nr} (${fehlend(p).map((k) => FELDER[k]).join(', ')})`).join(', ')}`}</li>
        <li class="ok">${ico('haken')} Alle Maße in mm</li>
        <li class="${warn.length ? 'warn' : 'ok'}">${ico(warn.length ? 'warn' : 'haken')} Plausibilität ${warn.length ? '– ' + esc(warn.join('; ')) : 'ohne Auffälligkeiten'}</li>
        <li class="${unsicherMass ? 'warn' : 'ok'}">${ico(unsicherMass ? 'warn' : 'haken')} Maßart: ${unsicherMass ? 'Rohbaumaße – Händler wird um Bestellmaß gebeten' : 'Bestellmaße'}</li>
      </ul>
      <table class="mini"><thead><tr><th>Pos.</th><th>Element</th><th class="r">Stk.</th><th class="r">B × H mm</th></tr></thead><tbody>
      ${v.positionen.map((p) => `<tr class="${fehlend(p).length ? 'rot' : ''}"><td>${p.nr}</td><td>${esc(p.raum)} · ${esc(p.art)}</td><td class="r">${p.stk}</td><td class="r">${p.b} × ${p.h}</td></tr>`).join('')}</tbody></table>
      ${ok ? `<label class="haken bestaetigen"><input type="checkbox" id="bestaetigt"> Ich habe Stückzahlen und Maße geprüft.</label>` : `<p class="hinweis rot">${ico('warn')} Versand gesperrt, bis die Pflichtangaben ergänzt sind.</p>`}`,
    ok ? [{ text: 'Zurück', act: 'wizZurueck', art: 'geist' }, { text: 'Weiter zur Vorschau', act: 'wizWeiter', art: 'primaer' }]
      : [{ text: 'Zurück', act: 'wizZurueck', art: 'geist' }, { text: 'Positionen ergänzen', act: 'wizErgaenzen', art: 'primaer' }]);
  } else {
    const h = H(w.haendler[w.tab]);
    const nrs = v.positionen.map((p) => p.nr);
    modal(`Vorschau · Schritt 3 von 3`, `
      <div class="tabs klein">${w.haendler.map((id, i) => `<button class="${i === w.tab ? 'an' : ''}" data-act="wizTab" data-arg="${i}"><i class="hfarbe" style="background:${H(id).farbe}"></i>${esc(H(id).kurz)}</button>`).join('')}</div>
      <div class="vorschau-2">
        ${mailVorschau(`${h.name} <${h.email}>`, anfrageBetreff(v, nrs.length), anfrageText(v, h, v.positionen, ich, FIRMA), `Anfrage_${v.id}_${h.kurz.replace(/\s/g, '')}.${h.format.startsWith('Excel') ? 'xlsx' : 'pdf'}`)}
        <div><p class="leise klein">Anhang (wird aus den Daten erzeugt, nicht von der KI geschrieben):</p>${positionsTabelle(v, nrs, h.stil)}</div>
      </div>`,
    [{ text: 'Zurück', act: 'wizZurueck', art: 'geist' }, { text: `${ico('senden')} ${w.haendler.length > 1 ? `An ${w.haendler.length} Händler senden` : 'Senden'}`, act: 'wizSenden', art: 'primaer' }], true);
  }
}

function posFormular(v, p, neu) {
  const sel = (k, werte) => `<label>${FELDER[k]}<select name="${k}"><option value="">– bitte wählen –</option>${werte.map((x) => `<option ${p[k] === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>`;
  const fehlt = fehlend(p);
  modal(`${neu ? 'Neue Position' : 'Pos. ' + p.nr + ' bearbeiten'} · ${esc(v.kunde)}`, `
  <form id="posform" class="formular">
    <div class="f-raster">
      <label>Raum<input name="raum" value="${esc(p.raum)}"></label>
      ${sel('art', KATALOG.art)}
      <label>Stück<input name="stk" type="number" min="1" value="${p.stk}"></label>
      <label class="${fehlt.includes('b') ? 'f-fehlt' : ''}">Breite (mm)<input name="b" type="number" inputmode="numeric" value="${p.b}"></label>
      <label class="${fehlt.includes('h') ? 'f-fehlt' : ''}">Höhe (mm)<input name="h" type="number" inputmode="numeric" value="${p.h}"></label>
      ${sel('masstyp', KATALOG.masstyp)}
    </div>
    <div class="f-raster">
      ${['material', 'teilung', 'oeffnung', 'anschlag', 'glas', 'glasOpt'].map((k) => `<div class="${fehlt.includes(k) ? 'f-fehlt' : ''}">${sel(k, KATALOG[k])}</div>`).join('')}
      <div class="${fehlt.includes('farbeInnen') ? 'f-fehlt' : ''}">${sel('farbeInnen', KATALOG.farbe)}</div>
      <div class="${fehlt.includes('farbeAussen') ? 'f-fehlt' : ''}">${sel('farbeAussen', KATALOG.farbe)}</div>
      ${['rollladen', 'beschlag', 'sprossen'].map((k) => sel(k, KATALOG[k])).join('')}
    </div>
    <label>Bemerkung<input name="bemerkung" value="${esc(p.bemerkung)}"></label>
  </form>`,
  [...(neu ? [] : [{ text: 'Löschen', act: 'posLoeschen', arg: `${v.id}|${p.nr}`, art: 'geist rot' }]), { text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: 'Speichern', act: 'posSpeichern', arg: `${v.id}|${neu ? 'neu' : p.nr}`, art: 'primaer' }], true);
}

// ——— Simulation von Händlerantworten ———
const QM = { Kunststoff: 260, 'Kunststoff-Alu': 380, Holz: 420, 'Holz-Alu': 520, Aluminium: 560 };
function preisFuer(p, h) {
  let x = Math.max(320, (p.b * p.h / 1e6) * (QM[p.material] || 350));
  if (p.glas === '3-fach') x *= 1.12;
  if (p.art === 'Hebe-Schiebe-Tür') x *= 2.2;
  if (p.art === 'Haustür') x = 2600 + (QM[p.material] || 400) * 3;
  if (p.art === 'Nebentür') x = 1200 + (QM[p.material] || 400);
  if (p.rollladen === 'Aufsatz, Motor' || p.rollladen === 'Vorbau, Funk') x += 420; else if (p.rollladen && p.rollladen !== 'keiner') x += 180;
  x *= { nord: 1, sued: 0.97, becker: 1.08 }[h] || 1;
  return Math.round(x / 5) * 5;
}

function antwortSimulieren(aid) {
  const a = d.anfragen.find((x) => x.id === aid); const v = V(a.vorgang); const h = H(a.haendler);
  const o = { id: 'O' + Date.now(), vorgang: v.id, haendler: h.id, nummer: h.kurz.slice(0, 2).toUpperCase() + '-' + (100000 + Math.floor(Math.random() * 899999)), datum: new Date().toISOString(), gueltig: inTagen(30), lieferzeit: { nord: '6 Wochen', sued: '7–8 Wochen', becker: '9 Wochen' }[h.id], zahlung: '30 Tage netto',
    pos: v.positionen.filter((p) => a.positionen.includes(p.nr)).map((p, i) => ({ nr: p.nr, preis: preisFuer(p, h.id), abw: i === 0 && p.glas === '3-fach' && h.id === 'becker' ? [{ feld: 'glas', angefragt: '3-fach', angeboten: '2-fach' }] : [] })) };
  d.angebote.push(o);
  a.status = 'angebot';
  const sum = summe(o, v); const abw = o.pos.reduce((t, p) => t + p.abw.length, 0);
  const m = { id: 'M' + Date.now(), richtung: 'ein', vorgang: v.id, von: h.id, datum: new Date().toISOString(), gelesen: false, kategorie: 'Angebot', anhang: `Angebot_${o.nummer}.pdf`,
    betreff: `AW: ${anfrageBetreff(v, a.positionen.length)}`, text: `${h.stil === 'kurz' ? 'Hallo' : 'Sehr geehrte Damen und Herren'},\n\nanbei unser Angebot ${o.nummer}. Lieferzeit ${o.lieferzeit}.\n\nGruß\n${h.kontakt}\n${h.name}`,
    ki: `Angebot über ${eur(sum)} netto, Lieferzeit ${o.lieferzeit}. ${abw ? `Achtung: ${abw} Abweichung zur Anfrage.` : 'Keine Abweichungen zur Anfrage gefunden.'}` };
  d.mails.push(m);
  if (['angefragt', 'rueckfrage', 'erfassung'].includes(v.status)) v.status = 'angebot';
  speichern(); render();
  toast(`${ico('post')} <b>Neues Angebot von ${esc(h.kurz)}</b><br>${esc(v.kunde)} · ${eur(sum)} netto · automatisch zugeordnet`, 'gross');
}

// ——— Aktionen ———
const AKT = {
  schliessen,
  erledigt(id) { d.erledigt.push(id); speichern(); render(); toast(`${ico('haken')} Erledigt`); },
  filter(k) { ui.filter = k; render(); },
  pfFilter(k) { ui.postfachFilter = k; location.hash = '#/postfach'; render(); },
  hinweis(t) { toast(esc(t)); },
  reset() { if (confirm('Alle Änderungen verwerfen und Demo neu starten?')) { try { localStorage.removeItem(SPEICHER); } catch { /* */ } d = startDaten(); ui.zf = {}; ui.erfassung = null; render(); toast('Demo zurückgesetzt'); } },
  drucken() { window.print(); },

  async zusammenfassen(id) {
    const box = $('#zf'); box.innerHTML = '<p class="denkt">KI fasst zusammen<span>.</span><span>.</span><span>.</span></p>';
    await warte(900);
    ui.zf[id] = zusammenfassung(V(id), d); render();
  },

  rueckfrage(aid) {
    const a = d.anfragen.find((x) => x.id === aid); const v = V(a.vorgang); const h = H(a.haendler);
    const m = d.mails.find((x) => x.vorgang === v.id && x.von === h.id && x.kategorie === 'Rückfrage');
    modal(`Rückfrage beantworten · ${esc(h.kurz)}`, `
      <div class="rf-raster"><div><p class="leise klein">Rückfrage vom ${datum(m?.datum)}</p><pre class="mailtext klein">${esc(m?.text || '')}</pre>
      <p class="hinweis blau">${ico('ki')} Die KI hat den Antwortentwurf vorbereitet. Bei Pos. 4 schlägt sie DIN rechts vor – <b>bitte mit dem Kunden abstimmen</b>. Die Position wird nach dem Senden angepasst.</p></div>
      ${mailVorschau(`${h.name} <${h.email}>`, 'AW: ' + (m?.betreff || ''), rueckfrageText(v, h, ich, FIRMA), `Positionsliste_${v.id}_korrigiert.pdf`)}</div>`,
    [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: ico('senden') + ' Antwort senden', act: 'rueckfrageSenden', arg: aid, art: 'primaer' }], true);
  },
  rueckfrageSenden(aid) {
    const a = d.anfragen.find((x) => x.id === aid); const v = V(a.vorgang); const h = H(a.haendler);
    const p4 = v.positionen.find((p) => p.nr === 4); if (p4 && v.id === 'V-2026-041') { p4.anschlag = 'DIN rechts'; }
    const p6 = v.positionen.find((p) => p.nr === 6); if (p6 && v.id === 'V-2026-041') { p6.bemerkung = 'Schema A (links fest, rechts schiebend), Schwelle barrierearm'; }
    a.status = 'gesendet'; a.wv = inTagen(7);
    d.mails.push({ id: 'M' + Date.now(), richtung: 'aus', vorgang: v.id, an: h.id, datum: new Date().toISOString(), kategorie: 'Antwort', betreff: $('#mv-betreff')?.value || 'AW', text: $('#mv-text')?.value || '' });
    if (v.status === 'rueckfrage') v.status = d.anfragen.some((x) => x.vorgang === v.id && x.status === 'angebot') ? 'angebot' : 'angefragt';
    speichern(); schliessen(); render();
    toast(`${ico('senden')} Antwort an ${esc(h.kurz)} gesendet · Wiedervorlage am ${datum(a.wv)}`);
  },

  nachfassen(aid) {
    const a = d.anfragen.find((x) => x.id === aid); const v = V(a.vorgang); const h = H(a.haendler);
    modal(`Nachfassen bei ${esc(h.kurz)}`, mailVorschau(`${h.name} <${h.email}>`, 'Nachfrage: ' + anfrageBetreff(v, a.positionen.length), nachfassText(v, h, a, ich, FIRMA), `Anfrage_${v.id}.pdf`),
      [{ text: 'Später (3 Tage)', act: 'verschieben', arg: aid, art: 'geist' }, { text: ico('senden') + ' Senden', act: 'nachfassSenden', arg: aid, art: 'primaer' }]);
  },
  verschieben(aid) { const a = d.anfragen.find((x) => x.id === aid); a.wv = inTagen(3); speichern(); schliessen(); render(); toast(`${ico('uhr')} Wiedervorlage auf ${datum(a.wv)} verschoben`); },
  nachfassSenden(aid) {
    const a = d.anfragen.find((x) => x.id === aid); const h = H(a.haendler);
    a.wv = inTagen(5);
    d.mails.push({ id: 'M' + Date.now(), richtung: 'aus', vorgang: a.vorgang, an: h.id, datum: new Date().toISOString(), kategorie: 'Nachfassen', betreff: $('#mv-betreff')?.value || '', text: $('#mv-text')?.value || '' });
    speichern(); schliessen(); render();
    toast(`${ico('senden')} Nachfass-Mail an ${esc(h.kurz)} gesendet · nächste Wiedervorlage ${datum(a.wv)}`);
  },
  kundeNachfassen(wid) {
    const w = d.wiedervorlagen.find((x) => x.id === wid); const v = V(w.vorgang);
    modal(`Nachfassen bei ${esc(v.kunde)}`, mailVorschau(`${v.ansprech} <${v.email}>`, 'Ihr Angebot für neue Fenster', `Guten Tag ${v.ansprech.split(' ')[0]} ${v.kunde.replace(/^(Familie|Herr|Frau)\s+/, '')},\n\nvor gut einer Woche haben wir Ihnen unser Angebot für Ihr Vorhaben „${v.art}“ geschickt. Haben Sie noch Fragen dazu, oder sollen wir etwas anpassen?\n\nDas Angebot ist bis ${datum(inTagen(22))} gültig. Gerne besprechen wir alles auch telefonisch.\n\nMit freundlichen Grüßen\n${ich.name}\n${FIRMA.name}`),
      [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: ico('senden') + ' Senden', act: 'kundeNachfassSenden', arg: wid, art: 'primaer' }]);
  },
  kundeNachfassSenden(wid) { const w = d.wiedervorlagen.find((x) => x.id === wid); w.faellig = inTagen(7); speichern(); schliessen(); render(); toast(`${ico('senden')} Gesendet · nächste Wiedervorlage ${datum(w.faellig)}`); },

  neueAnfrage(vid) {
    const v = V(vid);
    const schon = d.anfragen.filter((a) => a.vorgang === vid).map((a) => a.haendler);
    ui.wiz = { vorgang: vid, schritt: 1, haendler: d.haendler.map((h) => h.id).filter((id) => !schon.includes(id)).slice(0, 2), tab: 0 };
    if (!v.positionen.length) { toast('Bitte zuerst Positionen erfassen.'); return; }
    anfrageSchritt();
  },
  wizWeiter() {
    const w = ui.wiz;
    if (w.schritt === 1) {
      w.haendler = [...document.querySelectorAll('input[name=h]:checked')].map((x) => x.value);
      if (!w.haendler.length) { toast('Bitte mindestens einen Händler wählen.'); return; }
    }
    if (w.schritt === 2 && !$('#bestaetigt')?.checked) { toast(`${ico('warn')} Bitte Maße und Stückzahlen bestätigen.`); return; }
    w.schritt++; w.tab = 0; anfrageSchritt();
  },
  wizZurueck() { ui.wiz.schritt--; anfrageSchritt(); },
  wizTab(i) { ui.wiz.tab = +i; anfrageSchritt(); },
  wizErgaenzen() { const id = ui.wiz.vorgang; schliessen(); location.hash = `#/vorgang/${id}/positionen`; },
  wizSenden() {
    const w = ui.wiz; const v = V(w.vorgang);
    for (const hid of w.haendler) {
      const h = H(hid);
      const alt = d.anfragen.find((a) => a.vorgang === v.id && a.haendler === hid);
      const a = alt || { id: 'A' + Date.now() + hid, vorgang: v.id, haendler: hid };
      Object.assign(a, { gesendet: new Date().toISOString(), wv: inTagen(h.frist), status: 'gesendet', positionen: v.positionen.map((p) => p.nr) });
      if (!alt) d.anfragen.push(a);
      d.mails.push({ id: 'M' + Date.now() + hid, richtung: 'aus', vorgang: v.id, an: hid, datum: new Date().toISOString(), kategorie: 'Anfrage', betreff: anfrageBetreff(v, v.positionen.length), text: anfrageText(v, h, v.positionen, ich, FIRMA) });
    }
    if (['erfassung', 'rueckfrage'].includes(v.status) || !d.anfragen.some((a) => a.vorgang === v.id && a.status === 'angebot')) v.status = 'angefragt';
    speichern(); schliessen();
    location.hash = `#/vorgang/${v.id}/anfragen`; render();
    toast(`${ico('senden')} <b>Anfrage an ${w.haendler.map((id) => esc(H(id).kurz)).join(' und ')} gesendet</b><br>Wiedervorlagen angelegt: ${w.haendler.map((id) => `${esc(H(id).kurz)} in ${H(id).frist} Tagen`).join(', ')}`, 'gross');
  },
  anfrageAnsehen(aid) {
    const a = d.anfragen.find((x) => x.id === aid); const v = V(a.vorgang); const h = H(a.haendler);
    modal(`Anfrage an ${esc(h.kurz)} · ${datum(a.gesendet)}`, `<div class="vorschau-2"><div class="mailvorschau"><div class="mv-kopf"><span>An</span><b>${esc(h.email)}</b><span>Betreff</span><b>${esc(anfrageBetreff(v, a.positionen.length))}</b></div><pre class="mailtext">${esc(anfrageText(v, h, v.positionen.filter((p) => a.positionen.includes(p.nr)), ich, FIRMA))}</pre></div><div>${positionsTabelle(v, a.positionen, h.stil)}</div></div>`, [], true);
  },
  musterAnfrage(hid) {
    const h = H(hid); const v = V('V-2026-041');
    modal(`Beispiel-Anfrage · ${esc(h.name)}`, `<p class="leise">So sieht eine Anfrage im Stil von ${esc(h.kurz)} aus (Beispiel: ${v.id} ${esc(v.kunde)}). Wording und Format werden anhand echter Muster je Händler eingestellt.</p><div class="vorschau-2"><pre class="mailtext">${esc(anfrageText(v, h, v.positionen, ich, FIRMA))}</pre><div>${positionsTabelle(v, v.positionen.slice(0, 3).map((p) => p.nr), h.stil)}</div></div>`, [], true);
  },
  antwortSimulieren,

  angebotWaehlen(arg) {
    const [vid, oid] = arg.split('|'); const v = V(vid);
    d.kundenangebote[vid] = { aufschlag: 28, montage: true, demontage: true, fensterbank: false, ...(d.kundenangebote[vid] || {}), angebot: oid };
    if (['angebot', 'angefragt', 'rueckfrage'].includes(v.status)) v.status = 'kundenangebot';
    speichern(); location.hash = `#/vorgang/${vid}/kundenangebot`;
  },
  kundeSenden(vid) {
    const v = V(vid); const k = kalkulation(v);
    modal(`Kundenangebot an ${esc(v.kunde)}`, mailVorschau(`${v.ansprech} <${v.email}>`, `Ihr Angebot ${v.id.replace('V-', 'AG-')} – ${v.art}`, `Guten Tag ${v.ansprech},\n\nvielen Dank für Ihr Vertrauen und das angenehme Gespräch. Wie besprochen erhalten Sie im Anhang unser Angebot für Ihr Vorhaben „${v.art}“ über ${eur(k.brutto)} inkl. MwSt.\n\nAlle Maße bestätigen wir vor der Bestellung durch ein verbindliches Aufmaß. Bei Fragen rufen Sie uns gerne an.\n\nMit freundlichen Grüßen\n${ich.name}\n${FIRMA.name}\n${FIRMA.tel}`, `Angebot_${v.id.replace('V-', 'AG-')}.pdf`),
      [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: ico('senden') + ' Senden', act: 'kundeSendenOk', arg: vid, art: 'primaer' }]);
  },
  kundeSendenOk(vid) {
    const v = V(vid); d.kundenangebote[vid].gesendet = new Date().toISOString(); v.status = 'gesendet';
    d.wiedervorlagen.push({ id: 'W' + Date.now(), vorgang: vid, faellig: inTagen(7), text: `${v.kunde}: Rückmeldung zum Kundenangebot nachfassen`, art: 'kunde' });
    d.mails.push({ id: 'M' + Date.now(), richtung: 'aus', vorgang: vid, an: 'kunde', datum: new Date().toISOString(), kategorie: 'Kundenangebot', betreff: $('#mv-betreff')?.value || '', text: '' });
    speichern(); schliessen(); render(); toast(`${ico('senden')} Angebot an ${esc(v.kunde)} gesendet · Wiedervorlage in 7 Tagen`);
  },

  posBearbeiten(arg) { const [vid, nr] = arg.split('|'); const v = V(vid); posFormular(v, v.positionen.find((p) => p.nr === +nr), false); },
  posNeu(vid) {
    const v = V(vid); const l = v.positionen[v.positionen.length - 1] || {};
    posFormular(v, { nr: v.positionen.length + 1, stk: 1, art: 'Fenster', raum: '', b: '', h: '', masstyp: 'Bestellmaß', material: l.material || '', farbeInnen: l.farbeInnen || '', farbeAussen: l.farbeAussen || '', teilung: '1-flügelig', oeffnung: 'Dreh-Kipp', anschlag: '', glas: l.glas || '', glasOpt: '', sprossen: 'keine', beschlag: 'Standard', rollladen: 'keiner', bemerkung: '' }, true);
  },
  posSpeichern(arg) {
    const [vid, nr] = arg.split('|'); const v = V(vid);
    const f = Object.fromEntries(new FormData($('#posform')));
    f.stk = +f.stk || 1; f.b = +f.b || ''; f.h = +f.h || '';
    if (nr === 'neu') v.positionen.push({ nr: v.positionen.length + 1, ...f });
    else Object.assign(v.positionen.find((p) => p.nr === +nr), f);
    speichern(); schliessen(); render(); toast(`${ico('haken')} Position gespeichert`);
  },
  posLoeschen(arg) {
    const [vid, nr] = arg.split('|'); const v = V(vid);
    v.positionen = v.positionen.filter((p) => p.nr !== +nr).map((p, i) => ({ ...p, nr: i + 1 }));
    speichern(); schliessen(); render();
  },
  leererVorgang() {
    modal('Vorgang anlegen', `<form id="vform" class="formular"><div class="f-raster">
      <label>Kunde<input name="kunde" placeholder="z. B. Familie Muster" required></label>
      <label>Ansprechpartner<input name="ansprech"></label>
      <label>Telefon<input name="tel" type="tel"></label>
      <label>E-Mail<input name="email" type="email"></label>
      <label>Adresse Bauvorhaben<input name="adresse" placeholder="Straße Nr., PLZ Ort"></label>
      <label>Vorhaben<input name="art" placeholder="z. B. Sanierung EFH"></label></div></form>`,
    [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: 'Anlegen', act: 'vorgangAnlegen', art: 'primaer' }]);
  },
  vorgangAnlegen() {
    const f = Object.fromEntries(new FormData($('#vform')));
    const v = neuerVorgang(f.kunde || 'Neuer Kunde', f.art || 'Fenster', f);
    speichern(); schliessen(); location.hash = `#/vorgang/${v.id}`;
  },

  beispiel() {
    $('#erf-text').value = 'Familie Becker, Sanierung Einfamilienhaus. Alles Holz-Alu, innen Kiefer, außen anthrazit 7016, dreifach verglast.\nWohnzimmer zwei Fenster zweiflügelig Stulp 1230 mal 1480 Anschlag rechts, Rollladen mit Motor.\nKüche ein Dreh-Kipp 1010 mal 1235 DIN links.\nBad 610 mal 810 Dreh-Kipp, Milchglas.\nSchlafzimmer Fenster 1010 mal 1360 Dreh-Kipp.\nFlur Haustür 1100 mal 2100 nach innen öffnend, DIN links, Mehrfachverriegelung.';
  },
  async auswerten(vid) {
    const text = $('#erf-text').value.trim();
    if (!text) { toast('Bitte zuerst etwas einsprechen oder eintippen.'); return; }
    $('#erf-ergebnis').innerHTML = '<h2>2. Vorschlag prüfen</h2><p class="denkt">KI liest die Notiz<span>.</span><span>.</span><span>.</span></p>';
    await warte(1100);
    ui.erfassung = { text, ergebnis: auswerten(text) };
    $('#erf-ergebnis').innerHTML = '<h2>2. Vorschlag prüfen</h2>' + erfErgebnis(ui.erfassung.ergebnis, vid);
  },
  uebernehmen(vid) {
    const r = ui.erfassung.ergebnis;
    const pos = r.positionen.map(({ _q, ...p }) => p);
    let v;
    if (vid) {
      v = V(vid);
      pos.forEach((p) => v.positionen.push({ ...p, nr: v.positionen.length + 1 }));
    } else {
      const kunde = $('#erf-kunde')?.value || r.kunde || 'Neuer Kunde';
      v = neuerVorgang(kunde, $('#erf-projekt')?.value || 'Fenster und Türen', {});
      v.positionen = pos;
    }
    ui.erfassung = null; speichern();
    location.hash = `#/vorgang/${v.id}/positionen`;
    toast(`${ico('haken')} ${pos.length} Positionen übernommen`);
  },
  diktat(_, el) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (ui.rec) { ui.rec.stop(); return; }
    const rec = new SR(); rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true;
    const feld = $('#erf-text'); const basis = feld.value ? feld.value + ' ' : '';
    rec.onresult = (e) => { let t = ''; for (const r of e.results) t += r[0].transcript; feld.value = basis + t; };
    rec.onend = () => { ui.rec = null; el.classList.remove('aufnahme'); };
    rec.onerror = () => toast('Diktat nicht verfügbar – bitte tippen oder Tastatur-Mikrofon nutzen.');
    ui.rec = rec; el.classList.add('aufnahme'); rec.start();
  },

  kundeAntworten(mid) {
    const m = d.mails.find((x) => x.id === mid); const v = V(m.vorgang);
    modal(`Antwort an ${esc(m.absender)}`, mailVorschau(`${m.absender} <${v.email}>`, 'AW: ' + m.betreff, `Hallo ${m.absender.split(' ')[0]} ${v.kunde.replace(/^(Familie|Herr|Frau)\s+/, '')},\n\nvielen Dank für Ihre Nachricht. Einen Rollladen für das Bad im OG können wir gerne ergänzen – wir fragen das beim Hersteller an und melden uns mit dem Aufpreis.\n\nZum Liefertermin: Sobald Sie das Angebot freigegeben haben, beträgt die Lieferzeit derzeit etwa 6 Wochen. Den genauen Montagetermin stimmen wir dann mit Ihnen ab.\n\nViele Grüße\n${ich.name}\n${FIRMA.name}`) +
      `<p class="hinweis blau">${ico('ki')} Vorschlag: Pos. 5 um „Rollladen Aufsatz, Gurt“ ergänzen und bei Nordfenster nachfragen.</p>`,
    [{ text: 'Abbrechen', act: 'schliessen', art: 'geist' }, { text: ico('senden') + ' Senden', act: 'kundeAntwortOk', arg: mid, art: 'primaer' }]);
  },
  kundeAntwortOk(mid) { const m = d.mails.find((x) => x.id === mid); m.erledigt = true; d.erledigt.push('k-' + mid); speichern(); schliessen(); render(); toast(`${ico('senden')} Antwort gesendet`); },
  abPruefen() {
    modal('Auftragsbestätigung abgleichen', `<p class="hinweis gruen">${ico('haken')} Auftragsbestätigung AB-26-3902 stimmt mit der Bestellung überein.</p>
    <table class="mini"><thead><tr><th>Pos.</th><th>Bestellt</th><th>Bestätigt</th></tr></thead><tbody><tr><td>1</td><td>4 × Kellerfenster 800 × 600, Kunststoff weiß, Kipp, 2-fach</td><td>4 × 800 × 600, Kunststoff weiß, Kipp, 2-fach ✓</td></tr></tbody></table>
    <p class="leise">Liefertermin KW 3 übernommen. Montage kann geplant werden.</p>`, [{ text: 'OK', act: 'schliessen', art: 'primaer' }]);
  },
  archiv(mid) { d.mails = d.mails.filter((m) => m.id !== mid); speichern(); location.hash = '#/postfach'; toast('Archiviert'); },
  mailSimulieren() {
    const a = d.anfragen.find((x) => x.status === 'gesendet');
    if (a) { antwortSimulieren(a.id); return; }
    toast('Alle Anfragen sind beantwortet – erst eine neue Anfrage senden.');
  },
};

function neuerVorgang(kunde, art, f) {
  d.zaehler = (d.zaehler || 46) + 1;
  const v = { id: `V-${new Date().getFullYear()}-${String(d.zaehler).padStart(3, '0')}`, kunde, ansprech: f.ansprech || kunde.replace(/^(Familie|Herr|Frau)\s+/, ''), tel: f.tel || '–', email: f.email || 'kunde@mail.example', adresse: f.adresse || 'Musterstraße 1, 12345 Musterstadt', art, status: 'erfassung', nutzer: ich.id, angelegt: new Date().toISOString(), notiz: 'Neu angelegt.', positionen: [] };
  d.vorgaenge.unshift(v);
  return v;
}

// ——— Eingaben (live) ———
document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-input]'); if (!el) return;
  const k = el.dataset.input; const arg = el.dataset.arg;
  if (k === 'suche') { ui.suche = el.value; const pos = el.selectionStart; render(); const s = $('.suche'); s.focus(); s.setSelectionRange(pos, pos); return; }
  const ka = arg && d.kundenangebote[arg];
  if (!ka) return;
  if (k === 'kaAufschlag') ka.aufschlag = +el.value;
  if (k === 'kaMontage') ka.montage = el.checked;
  if (k === 'kaDemontage') ka.demontage = el.checked;
  if (k === 'kaFensterbank') ka.fensterbank = el.checked;
  if (k === 'kaAngebot') ka.angebot = el.value;
  speichern();
  const y = window.scrollY; render(); window.scrollTo(0, y);
  if (k === 'kaAufschlag') $('[data-input=kaAufschlag]')?.focus();
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const f = AKT[el.dataset.act]; if (!f) return;
  e.preventDefault();
  f(el.dataset.arg, el, e);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) schliessen(); });

// ——— Navigation ———
function navZahlen() {
  const n = d.mails.filter((m) => m.richtung === 'ein' && !m.gelesen).length;
  document.querySelectorAll('[data-zahl=post]').forEach((x) => { x.textContent = n || ''; x.hidden = !n; });
  const a = aufgaben().length;
  document.querySelectorAll('[data-zahl=start]').forEach((x) => { x.textContent = a || ''; x.hidden = !a; });
}

function render() {
  const [, seite = '', a, b] = (location.hash || '#/').split('/');
  const inhalt = {
    '': () => seiteUebersicht(), vorgaenge: () => seiteVorgaenge(), vorgang: () => seiteVorgang(a, b),
    erfassen: () => seiteErfassen(a), postfach: () => seitePostfach(a), haendler: () => seiteHaendler(), einstellungen: () => seiteEinstellungen(),
  }[seite] || seiteUebersicht;
  $('#inhalt').innerHTML = inhalt();
  const aktiv = seite === 'vorgang' ? 'vorgaenge' : seite;
  document.querySelectorAll('[data-nav]').forEach((x) => x.classList.toggle('an', x.dataset.nav === aktiv));
  navZahlen();
}

let letzteSeite = '';
window.addEventListener('hashchange', () => {
  const s = location.hash.split('/').slice(0, 3).join('/');
  if (!location.hash.startsWith('#/erfassen')) ui.erfassung = null;
  render();
  if (s !== letzteSeite) window.scrollTo(0, 0);
  letzteSeite = s;
});
render();

// Ausblick Phase 2: Vor- und Nachkalkulation je Auftrag. Erfundene Zahlen.
// Soll = aus dem Angebot (Material, Montagestunden), Ist = Eingangsrechnungen + per App gebuchte Monteurzeiten.

import { eur } from './ki.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const SATZ = 62; // € je Monteurstunde (Verrechnungs-/Kostensatz, erfunden)

export const AUFTRAEGE = [
  { id: 'V-2026-012', kunde: 'Familie Roth', art: 'Fenstertausch EFH, 9 Fenster', gruppe: 'Fenster', umsatz: 16480, soll: { std: 22, mat: 8450, fremd: 0 }, ist: { std: 29.5, mat: 8610, fremd: 0 }, ende: -41,
    zeiten: [['Tim Kern', 'Demontage + Montage EG', 9.5], ['Sabine Lang', 'Demontage + Montage EG', 9.5], ['Tim Kern', 'OG, Abdichtung', 6], ['Sabine Lang', 'Nacharbeit Anschlüsse', 4.5]],
    hinweis: 'Altbau: Anschlüsse aufwendiger als gedacht (+7,5 h). Bei Altbau-Sanierung Montagezeit je Fenster höher ansetzen.' },
  { id: 'V-2026-018', kunde: 'Herr Yilmaz', art: 'Haustür mit Seitenteil', gruppe: 'Haustüren', umsatz: 6390, soll: { std: 7, mat: 4120, fremd: 0 }, ist: { std: 6.5, mat: 4120, fremd: 0 }, ende: -33,
    zeiten: [['Tim Kern', 'Montage Haustür', 3.5], ['Max Muster', 'Montage Haustür', 3]], hinweis: 'Im Plan.' },
  { id: 'V-2026-022', kunde: 'Familie Brandl', art: 'Hebe-Schiebe-Tür + 4 Fenster', gruppe: 'Hebe-Schiebe-Türen', umsatz: 19950, soll: { std: 16, mat: 11900, fremd: 0 }, ist: { std: 23, mat: 12050, fremd: 180 }, ende: -26,
    zeiten: [['Tim Kern', 'HST einbringen (Kran)', 6], ['Sabine Lang', 'HST einbringen (Kran)', 6], ['Tim Kern', 'Fenster EG', 5], ['Sabine Lang', 'Fenster EG', 4], ['Tim Kern', 'Schwelle nacharbeiten', 2]],
    hinweis: 'Hebe-Schiebe-Tür: Einbringen dauerte 12 h statt 7 h, Kran nicht kalkuliert (180 €).' },
  { id: 'V-2026-027', kunde: 'Frau Kerner', art: 'Rollläden nachrüsten, 6 Stück', gruppe: 'Rollläden', umsatz: 4890, soll: { std: 9, mat: 2640, fremd: 0 }, ist: { std: 8, mat: 2580, fremd: 0 }, ende: -18,
    zeiten: [['Max Muster', 'Rollläden montieren', 4], ['Tim Kern', 'Rollläden montieren', 4]], hinweis: 'Leicht besser als geplant.' },
  { id: 'V-2026-029', kunde: 'Familie Öztürk', art: 'Neubau DHH, Hebe-Schiebe-Tür + 7 Fenster', gruppe: 'Hebe-Schiebe-Türen', umsatz: 24310, soll: { std: 20, mat: 14700, fremd: 0 }, ist: { std: 27, mat: 14700, fremd: 220 }, ende: -9,
    zeiten: [['Sabine Lang', 'HST einbringen', 6.5], ['Tim Kern', 'HST einbringen', 6.5], ['Sabine Lang', 'Fenster', 7], ['Tim Kern', 'Fenster', 7]],
    hinweis: 'Wieder Hebe-Schiebe-Tür deutlich über Plan, Kran zusätzlich.' },
  { id: 'V-2026-031', kunde: 'Herr Berger', art: 'Kellerfenster, 4 Stück', gruppe: 'Fenster', umsatz: 1980, soll: { std: 6, mat: 1160, fremd: 0 }, ist: { std: 5.5, mat: 1160, fremd: 0 }, ende: -3,
    zeiten: [['Tim Kern', 'Kellerfenster', 5.5]], hinweis: 'Im Plan.' },
];

export function rechne(a) {
  const kostenSoll = a.soll.mat + a.soll.fremd + a.soll.std * SATZ;
  const kostenIst = a.ist.mat + a.ist.fremd + a.ist.std * SATZ;
  const dbSoll = a.umsatz - kostenSoll, dbIst = a.umsatz - kostenIst;
  return { kostenSoll, kostenIst, dbSoll, dbIst, diff: dbIst - dbSoll, prozSoll: dbSoll / a.umsatz * 100, prozIst: dbIst / a.umsatz * 100, stdDiff: a.ist.std - a.soll.std };
}

function ampel(diff, umsatz) {
  const p = diff / umsatz * 100;
  return p < -3 ? 'rot' : p < -0.5 ? 'gelb' : 'gruen';
}

const pz = (n) => (n >= 0 ? '+' : '−') + Math.abs(n).toLocaleString('de-DE', { maximumFractionDigits: 1 });

export function seiteNachkalk(preise, id) {
  if (id) return detail(AUFTRAEGE.find((a) => a.id === id), preise);
  const gesamt = AUFTRAEGE.reduce((s, a) => { const r = rechne(a); s.soll += r.dbSoll; s.ist += r.dbIst; s.u += a.umsatz; return s; }, { soll: 0, ist: 0, u: 0 });
  const gruppen = {};
  for (const a of AUFTRAEGE) { const g = gruppen[a.gruppe] ||= { soll: 0, ist: 0, n: 0 }; g.soll += a.soll.std; g.ist += a.ist.std; g.n++; }
  const hst = gruppen['Hebe-Schiebe-Türen'];
  const hstProz = hst ? Math.round((hst.ist / hst.soll - 1) * 100) : 0;
  return `
  <div class="kopf"><div><h1>Nachkalkulation <span class="tag-ausblick">Ausblick Phase 2</span></h1>
  <p class="leise">Waren wir zu billig oder zu teuer? Soll aus dem Angebot, Ist aus Eingangsrechnungen und den Zeiten, die die Monteure per App buchen.</p></div></div>
  <div class="kacheln">
    <div class="kachel"><span class="zahl">${AUFTRAEGE.length}</span><span>Abgeschlossene Aufträge</span></div>
    <div class="kachel"><span class="zahl">${eur(gesamt.u)}</span><span>Umsatz netto</span></div>
    <div class="kachel"><span class="zahl">${Math.round(gesamt.ist / gesamt.u * 100)} %</span><span>Deckungsbeitrag Ist (Soll ${Math.round(gesamt.soll / gesamt.u * 100)} %)</span></div>
    <div class="kachel ${gesamt.ist < gesamt.soll ? 'akzent-rot' : ''}"><span class="zahl">${eur(gesamt.ist - gesamt.soll)}</span><span>Abweichung zum Plan</span></div>
  </div>
  <div class="raster-2">
    <section class="karte">
      <h2>Aufträge</h2>
      <ul class="nk-liste">${AUFTRAEGE.map((a) => { const r = rechne(a); const am = ampel(r.diff, a.umsatz); return `
        <li><a href="#/nachkalkulation/${a.id}">
          <i class="nk-ampel ${am}"></i>
          <div class="nk-text"><b>${esc(a.kunde)}</b> <span class="nr">${a.id}</span><br><span class="leise">${esc(a.art)}</span></div>
          <div class="nk-zahlen"><span class="${am}">${eur(r.diff)}</span><small>Std. ${a.soll.std} → ${a.ist.std}</small></div>
        </a></li>`; }).join('')}</ul>
    </section>
    <div class="spalte">
      <section class="karte nk-erkenntnis">
        <h2>Was auffällt</h2>
        <p><b>Hebe-Schiebe-Türen: Montage ${hstProz} % länger als kalkuliert</b> (${hst.n} Aufträge, ${pz(hst.ist - hst.soll)} Std.). Zweimal kam ein Kran dazu, der nicht im Angebot stand.</p>
        <p class="leise">Vorschlag: Montagepauschale HST von ${eur(preise['Hebe-Schiebe-Tür'])} auf ${eur(650)} anheben und „Kran / Einbringhilfe“ als eigene Position anbieten.</p>
        <button class="knopf klein ${preise['Hebe-Schiebe-Tür'] >= 650 ? '' : 'primaer'}" data-act="nkUebernehmen" ${preise['Hebe-Schiebe-Tür'] >= 650 ? 'disabled' : ''}>${preise['Hebe-Schiebe-Tür'] >= 650 ? 'In Preisliste übernommen' : 'In Preisliste übernehmen'}</button>
        <hr>
        <p><b>Altbau-Sanierung:</b> Anschlüsse brauchen mehr Zeit als im Neubau (Auftrag Roth +7,5 Std.).</p>
        <p><b>Haustüren und Rollläden:</b> im Plan.</p>
      </section>
      <section class="karte">
        <h2>Montagezeit je Gruppe · Soll / Ist</h2>
        ${Object.entries(gruppen).map(([g, x]) => { const m = Math.max(x.soll, x.ist); return `
        <div class="nk-balken"><span>${esc(g)}</span>
          <div class="bal"><i class="soll" style="width:${x.soll / m * 100}%"></i></div>
          <div class="bal"><i class="ist ${x.ist > x.soll * 1.1 ? 'rot' : ''}" style="width:${x.ist / m * 100}%"></i></div>
          <small>${x.soll} / ${x.ist} Std.</small></div>`; }).join('')}
        <p class="leise klein"><i class="lg-soll"></i> Soll laut Angebot · <i class="lg-ist"></i> Ist gebucht</p>
      </section>
    </div>
  </div>`;
}

function detail(a, preise) {
  if (!a) return '<div class="leer karte"><p>Auftrag nicht gefunden.</p></div>';
  const r = rechne(a); const am = ampel(r.diff, a.umsatz);
  const zeile = (t, s, i, eurFmt = true) => `<tr><td>${t}</td><td class="r">${eurFmt ? eur(s) : s}</td><td class="r">${eurFmt ? eur(i) : i}</td><td class="r ${i > s ? 'rot' : ''}">${eurFmt ? eur(i - s) : pz(i - s)}</td></tr>`;
  return `
  <nav class="krumen"><a href="#/nachkalkulation">Nachkalkulation</a> › <span>${a.id}</span></nav>
  <div class="kopf"><div><h1>${esc(a.kunde)} <span class="leise">· ${esc(a.art)}</span></h1>
  <p class="leise"><span class="nr">${a.id}</span> · abgeschlossen vor ${-a.ende} Tagen · Umsatz ${eur(a.umsatz)} netto</p></div>
  <span class="badge ton-${am === 'gruen' ? 'gruen' : am === 'gelb' ? 'gelb' : 'rot'}">${am === 'gruen' ? 'im Plan' : am === 'gelb' ? 'leicht unter Plan' : 'unter Plan'}</span></div>
  <div class="raster-2">
    <section class="karte">
      <h2>Soll / Ist</h2>
      <table class="mini nk-tab"><thead><tr><th></th><th class="r">Soll</th><th class="r">Ist</th><th class="r">Abw.</th></tr></thead><tbody>
        ${zeile('Material / Elemente', a.soll.mat, a.ist.mat)}
        ${zeile('Fremdleistung (z. B. Kran)', a.soll.fremd, a.ist.fremd)}
        ${zeile('Montagestunden', a.soll.std, a.ist.std, false)}
        ${zeile(`Lohnkosten (${SATZ} €/Std.)`, a.soll.std * SATZ, a.ist.std * SATZ)}
        <tr class="summe"><td>Deckungsbeitrag</td><td class="r">${eur(r.dbSoll)}</td><td class="r">${eur(r.dbIst)}</td><td class="r ${r.diff < 0 ? 'rot' : ''}">${eur(r.diff)}</td></tr>
        <tr><td>in % vom Umsatz</td><td class="r">${r.prozSoll.toFixed(1)} %</td><td class="r">${r.prozIst.toFixed(1)} %</td><td class="r">${pz(r.prozIst - r.prozSoll)}</td></tr>
      </tbody></table>
      <p class="hinweis ${am === 'gruen' ? 'gruen' : am === 'gelb' ? 'gelb' : 'rot'}">${esc(a.hinweis)}</p>
    </section>
    <section class="karte">
      <h2>Gebuchte Zeiten (Monteur-App)</h2>
      <table class="mini"><thead><tr><th>Monteur</th><th>Tätigkeit</th><th class="r">Std.</th></tr></thead><tbody>
      ${a.zeiten.map(([m, t, s]) => `<tr><td>${esc(m)}</td><td>${esc(t)}</td><td class="r">${String(s).replace('.', ',')}</td></tr>`).join('')}
      <tr class="summe"><td colspan="2">Summe</td><td class="r">${String(a.ist.std).replace('.', ',')}</td></tr></tbody></table>
      <p class="leise klein">In der fertigen App bucht jeder Monteur am Handy Beginn, Ende und Tätigkeit je Auftrag, auch ohne Netz.</p>
    </section>
  </div>`;
}

#!/usr/bin/env node
/**
 * Compose an edition of Common Sense 250 as a modular newspaper.
 *
 *   node newspaper-production/scripts/compose.mjs newspaper-production/editions/2026-10.js
 *
 * generate-issue.js poured every story into one four-column flow. A real paper
 * is laid out in modules: each story owns a rectangle of the page grid, one to
 * four columns wide, with its picture across the full width of that rectangle
 * and its text set in that many columns beneath. That is what this does.
 *
 * The brief, in the publisher's own words:
 *   26 Jan  "a throwback to the Thomas Paine days when one printed from his
 *            personal press ... generally old-fashioned images interspersing
 *            articles ... an old-looking font for the paper version"
 *   24 Aug  "an 8-page layout with 4 to 10 ad blocks for firms I like"
 *   30 Sep  "a graphic for each" and 2.35in columns across an 11in page
 *
 * And the printer's, from Jeff Hewett, 11 March: "composed as CMYK ... with the
 * fonts embedded ... and the black type as 'K' only." print.sh converts the
 * Chrome PDF to DeviceGray, which a press reads as K.
 *
 * The type is Caslon, the face of the 1776 Declaration, for text; Playfair for
 * headlines; and a blackletter nameplate, as American papers have carried since
 * the eighteenth century. All three are open-licensed and embedded.
 *
 * Fixed-weight cuts, not the variable fonts: Chrome writes a variable font into
 * a PDF as Type 3, which prepress systems reject or flag. fonts/*-Regular.ttf
 * etc. are instanced from the Google variable files with fontTools.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { ads } from '../lib/ads.js';
import { issnToEan13, priceAddOn, ean13DataUri } from '../../scripts/lib/ean13.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const editionPath = path.resolve(process.argv[2] || path.join(ROOT, 'editions', '2026-10.js'));
const { edition } = await import(pathToFileURL(editionPath).href);
const { articlesV2 } = await import(pathToFileURL(path.join(ROOT, 'content', '2026-09-articles.js')).href);
const { walshReply } = await import(pathToFileURL(path.join(ROOT, 'content', 'walsh-reply.js')).href);
const articles = [...articlesV2, walshReply];

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const byId = (id) => {
  const a = articles.find((x) => x.id === id);
  if (!a) throw new Error(`edition asks for "${id}", which is not in the content set`);
  return a;
};
const whole = (a) => a.contentFull || a.content || [a.contentPart1, a.contentPart2].filter(Boolean).join('\n\n');

// --- pictures ------------------------------------------------------------------

const missingArt = [];
const pendingAds = [];  // spaces held for an ad whose copy has not arrived
function artUri(name) {
  for (const dir of [path.join(ROOT, 'art'), path.join(ROOT, '..', 'src', 'assets')]) {
    for (const ext of ['jpg', 'png']) {
      const f = path.join(dir, `${name}.${ext}`);
      if (fs.existsSync(f)) return `data:image/${ext === 'jpg' ? 'jpeg' : 'png'};base64,${fs.readFileSync(f).toString('base64')}`;
    }
    const f = path.join(dir, name);
    if (fs.existsSync(f)) return `data:image/${name.endsWith('.png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(f).toString('base64')}`;
  }
  return null;
}
function figure(name, heightIn, caption, pos = 'center', inline = false) {
  const uri = artUri(name);
  if (uri && inline) {
    // A one-column picture set into the text at its natural shape: portrait
    // and square originals, which a wide slot would crop to a strip.
    return `<figure class="art inline"><img src="${uri}" alt="">` +
      (caption ? `<figcaption>${esc(caption)}</figcaption>` : '') + `</figure>`;
  }
  if (!uri) {
    missingArt.push(name);
    return `<figure class="art missing" style="height:${heightIn}in"><span>illustration to come<br>${esc(name)}</span></figure>`;
  }
  return `<figure class="art"><img src="${uri}" style="height:${heightIn}in;object-position:${pos}" alt="">` +
    (caption ? `<figcaption>${esc(caption)}</figcaption>` : '') + `</figure>`;
}

// --- text ------------------------------------------------------------------------

/** The publisher's short all-capitals lines are section heads, not shouting. */
function paragraphs(text, setOff = []) {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p, i) => {
    if (p.length < 70 && p === p.toUpperCase() && /[A-Z]/.test(p)) return `<h4>${esc(p)}</h4>`;
    // Lines the publisher set off with a 0.5in indent in his Word file: his
    // emphasis ("Parents. / College admission committees."), kept, not flattened.
    if (setOff.includes(i)) return `<p class="setoff">${esc(p)}</p>`;
    return `<p>${esc(p)}</p>`;
  }).join('');
}

function articleModule(m) {
  const a = byId(m.id);
  const cols = m.cols || m.span || 1;
  const kicker = m.kicker || a.category;
  const deck = m.deck === false ? '' : (m.deck || a.excerpt);
  const norm = (x) => (x || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const deckRepeatsLede = deck && norm(whole(a)).startsWith(norm(deck).slice(0, 60));
  let body = paragraphs(whole(a), a.setOff || []);
  if (m.dropcap && /^[A-Za-z]/.test(whole(a).trim())) body = body.replace('<p>', '<p class="dropcap">');
  const art = (m.art === false || m.artInline) ? '' : figure(m.art || a.id, m.artHeight || 2.2, m.caption, m.artPos);
  if (m.artInline) body = figure(m.art || a.id, 0, m.caption, 'center', true) + body;
  return `
    <div class="head">
      ${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ''}
      <h2 class="hed ${m.size || 'm'}">${esc(m.title || a.title)}</h2>
      ${deck && !deckRepeatsLede ? `<p class="dek">${esc(deck)}</p>` : ''}
      ${m.artFirst === false ? '' : art}
      <div class="byline">By ${esc(a.author)}</div>
    </div>
    <div class="body${m.italic ? ' italic' : ''}" style="column-count:${cols}" data-article="${esc(a.id)}">${body}</div>`;
}

function adModule(m) {
  const ad = ads[m.key];
  if (!ad) throw new Error(`no advertisement "${m.key}" in lib/ads.js`);
  const img = ad.image ? artUri(ad.image) : null;
  const img2 = ad.image2 ? artUri(ad.image2) : null;
  // A placement may fix the picture's height (a tall picture in a short slot).
  const artStyle = m.artHeight ? ` style="height:${m.artHeight}in;object-fit:cover;object-position:${m.artPos || 'center'}"` : '';
  if (ad.pending) {
    pendingAds.push(ad.advertiser);
    return `<div class="ad pending"><div class="ad-label">Advertisement space held</div>
      <div class="ad-head">${esc(ad.headline)}</div>${ad.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>`;
  }
  return `
    <div class="ad ${img ? 'with-art' : ''} ${ad.size ? 'size-' + ad.size : ''} ${ad.style || ''} ${m.class || ''}">
      <div class="ad-label">Advertisement</div>
      ${img ? `<img class="ad-art" src="${img}"${artStyle} alt="">` : ''}
      <div class="ad-copy">
        <div class="ad-head">${esc(ad.headline)}</div>
        ${ad.sub ? `<div class="ad-sub">${esc(ad.sub)}</div>` : ''}
        ${ad.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
        ${img2 ? `<img class="ad-art second" src="${img2}" alt="">` : ''}
        ${ad.url || ad.contact ? `<div class="ad-url">${[ad.url, ad.contact].flat().filter(Boolean).map((l, i, all) => Array.isArray(ad.url) ? `<span class="ad-url-line">${esc(l)}</span>` : esc(l) + (i < all.length - 1 ? ' · ' : '')).join('')}</div>` : ''}
      </div>
    </div>`;
}

function masthead() {
  const e = edition.meta;
  return `
    <div class="mast">
      <div class="ears">
        <div class="ear">“In the following pages I offer nothing more than simple facts, plain arguments, and common sense.”<span>Thomas Paine, 1776</span></div>
        <div class="nameplate"><h1>Common Sense 250</h1><div class="motto">${esc(e.motto)}</div></div>
        <div class="ear right">${esc(e.frequency)}<br><b>$${e.price.toFixed(2)}</b><span>${esc(e.web)}</span></div>
      </div>
      <div class="dateline"><span>Vol. ${esc(e.volume)} · No. ${esc(e.number)}</span><span>${esc(e.place)}</span><span>${esc(e.date)}</span><span>$${e.price.toFixed(2)}</span></div>
    </div>`;
}

function contentsBox(m) {
  return `<div class="box contents"><div class="box-head">${esc(m.title || 'In This Issue')}</div>
    ${m.items.map(([t, p]) => `<div class="toc"><span>${esc(t)}</span><b>${p}</b></div>`).join('')}</div>`;
}

function aneModule(m) {
  return `
    <div class="ane">
      <div class="ane-head"><h2>Admirable New Englanders</h2><div class="ane-sub">— every fifty years —</div></div>
      <div class="ane-grid">
        ${m.entries.map((x) => `
          <div class="ane-entry">
            ${x.art ? figure(x.art, x.artHeight || 1.9, null, x.artPos) : ''}
            <div class="ane-year">${esc(x.years)}</div>
            <div class="ane-name">${esc(x.name)} <span>· ${esc(x.place)}</span></div>
            <p>${esc(x.text)}</p>
          </div>`).join('')}
      </div>
      <div class="ane-credit">Selected by Mark Stewart Greenstein</div>
    </div>`;
}

function boxModule(m) {
  return `<div class="box ${m.class || ''}">${m.title ? `<div class="box-head">${esc(m.title)}</div>` : ''}${m.html}</div>`;
}

function colophon() {
  const e = edition.meta;
  const code13 = issnToEan13(e.issn, e.variant);
  const bar = ean13DataUri({ code13, addOn: priceAddOn(e.price), issnText: e.issn,
    priceText: `$${e.price.toFixed(2)}`, scale: 1, specimen: false });
  return `
    <div class="colophon">
      <div class="colo-text">
        <div class="colo-title">Common Sense 250</div>
        <p>Vol. ${esc(e.volume)}, No. ${esc(e.number)} · ${esc(e.date)} · ${esc(e.place)} · Published quarterly.</p>
        <p>Published by Mark Stewart Greenstein. Produced by Web4Guru. ISSN ${esc(e.issn)}.</p>
        <p>Editorial submissions and replies: andrew@web4guru.com. Advertising: Mark Stewart Greenstein, libertymsg@gmail.com.</p>
        <p>Articles are the opinions of their authors. Pictures are credited beneath each: period art and U.S. government photographs are in the public domain, licensed photographs name their licence, and some illustrations were made for this paper with AI assistance.</p>
      </div>
      <img class="barcode" src="${bar}" alt="ISSN ${esc(e.issn)}">
    </div>`;
}

function featureModule(m) {
  const a = byId(m.id);
  let body = paragraphs(whole(a), a.setOff || []);
  if (m.dropcap && /^[A-Za-z]/.test(whole(a).trim())) body = body.replace('<p>', '<p class="dropcap">');
  const top = figure(m.topArt.name, m.topArt.height, m.topArt.caption, m.topArt.pos);
  const bottom = figure(m.bottomArt.name, m.bottomArt.height, m.bottomArt.caption, m.bottomArt.pos);
  return `
    <div class="head">
      ${m.kicker ? `<div class="kicker">${esc(m.kicker)}</div>` : ''}
      <h2 class="hed ${m.size || 'xl'}">${esc(m.title || a.title)}</h2>
      ${a.excerpt && m.deck !== false ? `<p class="dek">${esc(m.deck || a.excerpt)}</p>` : ''}
      <div class="byline">By ${esc(a.author)}</div>
    </div>
    <div class="feature-grid">
      <div class="body frame" data-article="${esc(a.id)}" data-chain="${esc(a.id)}" data-order="0" style="grid-area:1/1/4/2;column-count:1">${body}</div>
      <div class="feature-art" style="grid-area:1/2/2/4">${top}</div>
      <div class="body frame" data-article="${esc(a.id)}" data-chain="${esc(a.id)}" data-order="1" style="grid-area:2/2/3/4;column-count:2"></div>
      <div class="feature-art" style="grid-area:3/2/4/4">${bottom}</div>
    </div>`;
}

const RENDER = { article: articleModule, feature: featureModule, ad: adModule, mast: masthead, contents: contentsBox,
                 ane: aneModule, box: boxModule, colophon };

function renderModule(m) {
  const inner = m.type === 'stack'
    ? m.items.map((x) => `<div class="stack-item ${x.grow ? 'grow' : ''} si-${x.type}"${x.height ? ` style="flex:none;height:${x.height}in"` : ''}>${RENDER[x.type](x)}</div>`).join('')
    : RENDER[m.type](m);
  // Wrapper classes are prefixed: a wrapper named "ad" around a div named "ad"
  // drew every border twice and pushed the colophon off its left edge.
  return `<section class="mod mod-${m.type} ${m.class || ''}" style="grid-area:${m.area}">${inner}</section>`;
}

function renderPage(p, i) {
  const n = i + 1;
  const folio = p.masthead ? '' : `<div class="folio"><span>Common Sense 250</span><span>${esc(edition.meta.date)}</span><span>Page ${n}</span></div>`;
  return `
  <div class="page" id="p${n}">
    ${p.masthead ? masthead() : folio}
    <div class="grid" style="grid-template-areas:${p.areas.map((r) => `'${r}'`).join(' ')};grid-template-rows:${p.rows.join(' ')}">
      ${p.modules.map(renderModule).join('')}
    </div>
  </div>`;
}

// --- page --------------------------------------------------------------------------

const font = (fam, file, style = 'normal', weight = '100 900') =>
  `@font-face{font-family:'${fam}';src:url('../fonts/${file}') format('truetype');font-style:${style};font-weight:${weight};}`;
const css = fs.readFileSync(path.join(ROOT, 'styles', 'edition.css'), 'utf8');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Common Sense 250 — ${esc(edition.meta.date)}</title>
<style>
${font('Caslon', 'Caslon-Regular.ttf', 'normal', '400')}
${font('Caslon', 'Caslon-SemiBold.ttf', 'normal', '600')}
${font('Caslon', 'Caslon-Bold.ttf', 'normal', '700')}
${font('Caslon', 'Caslon-Italic.ttf', 'italic', '400 600')}
${font('Playfair', 'Playfair-Bold.ttf', 'normal', '700')}
${font('Playfair', 'Playfair-ExtraBold.ttf', 'normal', '800')}
${font('Playfair', 'Playfair-SemiBoldItalic.ttf', 'italic', '400 700')}
${font('Blackletter', 'unifrakturmaguntia__UnifrakturMaguntia-Book.ttf', 'normal', '400')}
${css}
</style></head><body>
${edition.pages.map(renderPage).join('')}
<script>
// Pour each chain of linked frames: whatever overflows frame N moves to frame N+1.
// A paragraph that straddles the boundary is split by words, and its second half
// is marked .cont so it does not indent like a new paragraph.
(function () {
  // A frame is a multicol box even at one column, and multicol overflows
  // SIDEWAYS into new columns, so width is the test, with height as a backstop.
  const over = (f) => f.scrollWidth > f.clientWidth + 1 || f.scrollHeight > f.clientHeight + 1;
  const chains = {};
  document.querySelectorAll('.frame[data-chain]').forEach((f) => (chains[f.dataset.chain] ||= []).push(f));
  for (const frames of Object.values(chains)) {
    frames.sort((a, b) => a.dataset.order - b.dataset.order);
    for (let i = 0; i < frames.length - 1; i++) {
      const f = frames[i], next = frames[i + 1];
      while (over(f) && f.lastElementChild) {
        const last = f.lastElementChild;
        next.insertBefore(last, next.firstChild);
        if (!over(f)) {
          // It fit without this paragraph: pull back as many words as will fit.
          if (last.tagName !== 'P') break;
          const words = last.textContent.split(' ');
          const head = document.createElement('p'); head.className = last.className.replace('setoff', '').trim();
          f.appendChild(head);
          let lo = 0, hi = words.length;
          while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); head.textContent = words.slice(0, mid).join(' '); if (over(f)) hi = mid - 1; else lo = mid; }
          if (lo === 0) { head.remove(); break; }
          head.textContent = words.slice(0, lo).join(' ');
          last.textContent = words.slice(lo).join(' ');
          last.classList.remove('dropcap'); last.classList.add('cont');
          break;
        }
      }
    }
  }
  document.body.dataset.poured = '1';
})();
</script>
</body></html>`;

const out = path.join(ROOT, 'output', `${edition.meta.slug}.html`);
fs.writeFileSync(out, html);
console.log(out);
console.log(`  pages ${edition.pages.length} · articles ${edition.pages.flatMap((p) => p.modules).flatMap((m) => m.type === 'stack' ? m.items : [m]).filter((m) => m.type === 'article').length}`);
if (missingArt.length) console.log(`  illustrations still to come (${missingArt.length}): ${missingArt.join(', ')}`);
if (pendingAds.length) console.log(`  ad spaces held, copy not yet in (${pendingAds.length}): ${pendingAds.join(', ')} — not for press`);

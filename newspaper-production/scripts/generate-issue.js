#!/usr/bin/env node
/**
 * Produce one issue of Common Sense 250 as a print-ready PDF.
 *
 *   node newspaper-production/scripts/generate-issue.js
 *   node newspaper-production/scripts/generate-issue.js --live      (bills DocRaptor)
 *   node newspaper-production/scripts/generate-issue.js --html-only (no API call)
 *
 * The issue is described entirely in config/issue.js. This script assembles it;
 * it does not decide what runs where.
 *
 * TWO THINGS THIS SCRIPT WILL NOT DO SILENTLY
 *
 *  1. It will not produce a watermarked proof while claiming to be finished.
 *     DocRaptor's free test mode stamps every page. Every PDF this project has
 *     produced so far was a test-mode proof, which no printer can accept. Test
 *     mode is still the default, because turning it off spends money — but the
 *     output is named "-PROOF" and the run says so in plain words.
 *
 *  2. It will not print an advertisement for a business that has not agreed to
 *     appear. Unauthorized slots fall back to a house ad and are listed at the
 *     end of the run.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { publication, issue, press } from '../config/issue.js';
import { renderAd, notedAds } from '../lib/ads.js';
import { campaigns } from '../../src/data/campaigns.js';
import { issnToEan13, priceAddOn, ean13DataUri } from '../../scripts/lib/ean13.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prodRoot = path.join(__dirname, '..');

// --- arguments and environment ----------------------------------------------

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);

const LIVE = has('--live') || process.env.DOCRAPTOR_LIVE === 'true';
const HTML_ONLY = has('--html-only');
const API_KEY = process.env.DOCRAPTOR_API_KEY;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const notes = [];       // things the operator must know when the run ends
const fill = [];        // per-page: words set against words the page can hold

/**
 * Roughly how many words a column well of a given height holds.
 *
 * Derived from the press geometry rather than guessed: the printable width is
 * 9in, so four columns with 0.25in gutters give a 2.06in measure. Times at 9pt
 * averages about 4.0pt per character, so a line carries ~37 characters, and an
 * English word with its space runs ~5.8 characters — call it 6.4 words a line.
 * Leading is 9pt x 1.22.
 *
 * This is an estimate, not a typesetter. It is here so that "the paper is half
 * empty" is a number somebody can act on rather than a thing you notice after
 * the proof comes back.
 */
function capacityWords(wellHeightInches, columns = 4) {
  const measureIn = (9 - 0.25 * (columns - 1)) / columns;
  const charsPerLine = measureIn / (4.0 / 72);
  const wordsPerLine = charsPerLine / 5.8;
  const lineHeightIn = (9 * 1.22) / 72;
  const linesPerColumn = Math.floor(wellHeightInches / lineHeightIn);
  // Held back deliberately. Proofing the first issue showed three stories
  // amputated mid-word on pages reporting 94-99% full: the estimate was about
  // a tenth too generous, and the page clips silently rather than complaining.
  // Better to run a page visibly light than to lose a paragraph a reader paid
  // for. Raise this only against a rendered proof, never against arithmetic.
  const SAFETY = 0.88;
  return Math.round(linesPerColumn * columns * wordsPerLine * SAFETY);
}

const countWords = (s) => (s || '').split(/\s+/).filter(Boolean).length;

// --- content -----------------------------------------------------------------

const { articlesV2: articles } = await import(issue.contentModule);
const byId = (id) => {
  const a = articles.find((x) => x.id === id);
  if (!a) throw new Error(`config/issue.js asks for article "${id}", which is not in the content set.`);
  return a;
};

/**
 * Turn a body of text into paragraphs. A paragraph that is entirely uppercase
 * and short is one of Mark's section headings, so it is marked as such rather
 * than set as body copy.
 */
function formatContent(text) {
  if (!text) return '';
  return text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const isHeading = p.length < 70 && p === p.toUpperCase() && /[A-Z]/.test(p);
      return isHeading
        ? `<p class="section-break">${esc(p)}</p>`
        : `<p>${esc(p)}</p>`;
    })
    .join('');
}

function renderArticle(block) {
  const article = byId(block.article);
  const part = block.part || 'full';
  const text = part === 'part1' ? article.contentPart1
             : part === 'part2' ? article.contentPart2
             : (article.contentFull || article.content);

  if (!text) {
    throw new Error(`Article "${article.id}" has no "${part}" text.`);
  }

  const isFeature = Boolean(block.feature);
  const isContinued = Boolean(block.continuedFrom);
  let body = formatContent(text);

  // A drop cap takes the first letter plus any punctuation before it, which is
  // correct CSS and wrong for a story that opens on a number or a quotation:
  // "80-20 Issues" printed as a giant "8 beside "0-20 Issues". Only drop a cap
  // when the story actually opens on a letter.
  const opensOnLetter = /^[A-Za-z]/.test((text || '').trim());
  if (isFeature && !isContinued && opensOnLetter) {
    body = body.replace('<p>', '<p class="drop-cap">');
  }

  const heading = isContinued
    ? `<h2 class="headline-continued">${esc(article.title)} <span>— continued from page ${block.continuedFrom}</span></h2>`
    : `<h2 class="headline-main">${esc(article.title)}</h2>`;

  // Several carried-over pieces use their own first sentence as the excerpt.
  // Printing that as a deck directly above the identical opening line is the
  // most amateurish thing a page can do, so drop it when it duplicates.
  const norm = (x) => (x || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const deckDuplicatesLede =
    article.excerpt && norm(text).startsWith(norm(article.excerpt).slice(0, 60));
  const standfirst = (isFeature && !isContinued && article.excerpt && !deckDuplicatesLede)
    ? `<h3 class="headline-sub">${esc(article.excerpt)}</h3>` : '';

  const byline = isContinued
    ? '' : `<div class="byline">By ${esc(article.author)} · ${esc(article.category)}</div>`;

  // A jump line tells the reader where the piece resumes.
  const jump = (block.part === 'part1' && block.jumpTo)
    ? `<p class="jump-line">Continued on page ${block.jumpTo}</p>` : '';

  // A feature is set larger, but it still flows through the column grid. It
  // must not span all columns: that produces one full-width block of 40-word
  // lines, which is what the first attempt at this layout did.
  const classes = ['article'];
  if (isFeature) classes.push('article-feature');

  return `<div class="${classes.join(' ')}">${heading}${standfirst}${byline}${body}${jump}</div>`;
}

// --- back-page furniture -----------------------------------------------------

function renderCandidates() {
  return `
    <div class="campaign-section span-all">
      <h2>New England Candidates, 2026</h2>
      <p class="campaign-standfirst">A standing reference for the 2026 cycle. These are
        not live updates, and Common Sense 250 endorses no one.</p>
      <div class="campaign-grid">
        ${campaigns.map((c) => `
          <div class="campaign-block">
            <h4>${esc(c.name)} (${esc(String(c.party).charAt(0))})</h4>
            <div class="campaign-office">${esc(c.office)} — ${esc(c.state)}</div>
            <p>${esc(c.bio)}</p>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderColophonAndBarcode() {
  const isSpecimen = !publication.issn;
  const SPECIMEN_ISSN = '0000-0019';
  const effectiveIssn = publication.issn || SPECIMEN_ISSN;
  const code13 = issnToEan13(effectiveIssn, issue.variant);

  const barcodeUri = ean13DataUri({
    code13,
    addOn: priceAddOn(publication.price),
    issnText: effectiveIssn,
    priceText: `$${publication.price.toFixed(2)}`,
    scale: 1,
    specimen: isSpecimen,
  });

  if (isSpecimen) {
    notes.push({
      level: 'blocking',
      text: 'The barcode on the back page is a SPECIMEN. Common Sense 250 has no ISSN yet, ' +
            'so no real retail barcode can exist. Apply free at https://www.loc.gov/issn/ — ' +
            'then set publication.issn in newspaper-production/config/issue.js.',
    });
  }

  return `
    <div class="colophon span-all">
      <div class="colophon-text">
        <div class="colophon-title">${esc(publication.fullTitle)}</div>
        <p>Vol. ${issue.volume}, No. ${issue.number} · ${esc(issue.date)} · ${esc(publication.origin)}</p>
        <p>Published by Web4Guru for Common Sense 250. Editorial submissions to
           andrew@web4guru.com. Advertising to Mark Stewart Greenstein,
           libertymsg@gmail.com.</p>
        <p>Articles are the opinions of their authors. We welcome a reply from anyone
           named or argued against in these pages, and will print it.</p>
      </div>
      <div class="barcode">
        <img src="${barcodeUri}" alt="EAN-13 ${code13}"/>
        ${isSpecimen ? '<div class="barcode-caption">Specimen — not for sale</div>' : ''}
      </div>
    </div>`;
}

// --- pages -------------------------------------------------------------------

function renderPage(page, index) {
  const pageNo = index + 1;
  const parts = [];

  if (page.masthead) {
    parts.push(`
      <div class="masthead span-all">
        <h1>${esc(publication.title)}</h1>
        <p class="masthead-tagline">${esc(publication.tagline)}</p>
        <div class="dateline">
          <span>Vol. ${issue.volume}, No. ${issue.number}</span>
          <span>${esc(publication.origin)}</span>
          <span>${esc(issue.date)}</span>
          <span>$${publication.price.toFixed(2)}</span>
        </div>
      </div>`);
  } else {
    parts.push(`
      <div class="folio span-all">
        <span>${esc(publication.fullTitle)}</span>
        <span>${esc(issue.date)}</span>
        <span>Page ${pageNo}</span>
      </div>`);
  }

  // The well shrinks to make room for whatever furniture the page carries.
  let wellIn = 8.5;
  if (page.masthead) wellIn -= 1.5;
  if (page.ads && page.ads.length) wellIn -= 2.0;
  if (page.candidates) wellIn -= 2.2;
  if (page.colophon || page.barcode) wellIn -= 1.3;
  wellIn = Math.max(wellIn, 1.5);

  const blocks = (page.blocks || []).map(renderArticle).join('');
  parts.push(`<div class="page-content" style="height: ${wellIn.toFixed(2)}in;">${blocks}</div>`);

  const wordsSet = (page.blocks || []).reduce((n, b) => {
    const a = byId(b.article);
    const part = b.part || 'full';
    return n + countWords(part === 'part1' ? a.contentPart1
                        : part === 'part2' ? a.contentPart2
                        : (a.contentFull || a.content));
  }, 0);
  fill.push({ page: pageNo, words: wordsSet, capacity: capacityWords(wellIn) });

  if (page.ads && page.ads.length) {
    const rendered = page.ads.map(renderAd);
    rendered.forEach((r) => {
      if (r.fellBack) {
        notes.push({
          level: 'substitution',
          text: `Page ${pageNo}: "${r.advertiser || r.key}" fell back to a house ad. ${r.reason}`,
        });
      }
    });
    parts.push(`<div class="ad-rail span-all">${rendered.map((r) => r.html).join('')}</div>`);
  }

  if (page.candidates) parts.push(renderCandidates());
  if (page.colophon || page.barcode) parts.push(renderColophonAndBarcode());

  return `<div class="page-wrapper" id="page-${pageNo}">${parts.join('')}</div>`;
}

// --- assemble ----------------------------------------------------------------

const read = (p) => fs.readFileSync(path.join(prodRoot, p), 'utf8');

const html = read('templates/newspaper.html')
  .replace('{{PUBLICATION}}', esc(publication.fullTitle))
  .replace('{{ISSUE_DATE}}', esc(issue.date))
  .replace('{{PAGE_SIZE}}', press.pageSize)
  .replace('{{PAGE_MARGIN}}', press.margin)
  .replace('{{PAGE_BLEED}}', press.bleed)
  .replace('{{PAGE_TRIM}}', press.trim)
  .replace('{{COLORS_CSS}}', read('styles/colors.css'))
  .replace('{{TYPOGRAPHY_CSS}}', read('styles/typography.css'))
  .replace('{{LAYOUT_CSS}}', read('styles/layout.css'))
  .replace('{{PAGES_HTML}}', issue.pages.map(renderPage).join('\n'));

const stem = `common-sense-250-vol${issue.volume}-no${issue.number}`;
const suffix = LIVE ? '' : '-PROOF';
const outDir = path.join(prodRoot, 'output');
fs.mkdirSync(outDir, { recursive: true });

const htmlPath = path.join(outDir, `${stem}.html`);
const pdfPath = path.join(outDir, `${stem}${suffix}.pdf`);
fs.writeFileSync(htmlPath, html);

// --- report ------------------------------------------------------------------

const rule = '  ' + '─'.repeat(70);
console.log('');
console.log(`  ${publication.fullTitle} — Vol. ${issue.volume}, No. ${issue.number}`);
console.log(rule);
console.log(`  Pages          ${issue.pages.length}`);
console.log(`  Articles       ${new Set(issue.pages.flatMap((p) => (p.blocks || []).map((b) => b.article))).size}`);
console.log(`  Trim           ${press.trim}, bleed ${press.bleed}, ${press.profile}`);
console.log(`  HTML           ${path.relative(prodRoot, htmlPath)}`);

function finish() {
  const blocking = notes.filter((n) => n.level === 'blocking');
  const subs = notes.filter((n) => n.level === 'substitution');

  console.log('');
  console.log('  HOW FULL EACH PAGE IS');
  console.log(rule);
  console.log('  page   words set   page holds   full');
  let totalSet = 0, totalCap = 0;
  fill.forEach((f) => {
    totalSet += f.words; totalCap += f.capacity;
    const pct = f.capacity ? Math.round((f.words / f.capacity) * 100) : 0;
    const bar = '█'.repeat(Math.min(10, Math.round(pct / 10))).padEnd(10, '·');
    console.log(`  ${String(f.page).padStart(4)}   ${String(f.words).padStart(9)}   ${String(f.capacity).padStart(10)}   ${String(pct).padStart(3)}%  ${bar}`);
  });
  const overall = totalCap ? Math.round((totalSet / totalCap) * 100) : 0;
  console.log(rule);
  console.log(`  total  ${String(totalSet).padStart(9)}   ${String(totalCap).padStart(10)}   ${String(overall).padStart(3)}%`);
  if (overall < 90) {
    const short = totalCap - totalSet;
    console.log('');
    console.log(`  This issue is roughly ${short.toLocaleString()} words short of filling ${fill.length} pages`);
    console.log('  at a readable 9pt over four columns. The February draft hid the same');
    console.log('  shortfall by setting the type at 7.2pt over five columns, which fills');
    console.log('  the sheet but is smaller than almost any newspaper in print.');
    console.log('');
    console.log(`  Either commission about ${short.toLocaleString()} more words, sell more advertising`);
    console.log(`  into the gap, or print a shorter paper. ${Math.max(1, Math.round(totalSet / (totalCap / fill.length)))} pages is what this`);
    console.log('  much copy actually fills.');
  }

  if (subs.length) {
    console.log('');
    console.log('  ADVERTISEMENTS THAT DID NOT RUN AS BOOKED');
    console.log(rule);
    subs.forEach((n) => console.log(`  · ${n.text}`));
  }

  const pending = notedAds();
  if (pending.length) {
    console.log('');
    console.log('  ADVERTISEMENTS CARRYING A NOTE WE RAISED WITH HIM (all of these run)');
    console.log(rule);
    pending.forEach((p) => console.log(`  · ${p.advertiser}: ${p.reason}`));
  }

  if (blocking.length) {
    console.log('');
    console.log('  BEFORE THIS CAN BE SOLD');
    console.log(rule);
    blocking.forEach((n) => console.log(`  · ${n.text}`));
  }

  console.log('');
  if (!LIVE) {
    console.log('  This run used DocRaptor test mode, so the PDF carries a proof');
    console.log('  watermark across every page and CANNOT go to a printer. That is why');
    console.log('  it is named "-PROOF". Re-run with --live to produce a clean file;');
    console.log('  that call is billed to the DocRaptor account.');
    console.log('');
  }
}

if (HTML_ONLY) {
  console.log(`  PDF            skipped (--html-only)`);
  console.log(rule);
  finish();
  process.exit(0);
}

if (!API_KEY) {
  console.log(`  PDF            not generated`);
  console.log(rule);
  console.log('');
  console.log('  DOCRAPTOR_API_KEY is not set, so no PDF was requested.');
  console.log('');
  console.log('  The key used to be hardcoded in this file and committed to a public');
  console.log('  repository, which meant anyone could bill against it. It now comes');
  console.log('  from the environment. Put it in .env (which git ignores):');
  console.log('');
  console.log('      DOCRAPTOR_API_KEY=your-key-here');
  console.log('');
  console.log('  The old key should be treated as compromised and rotated in the');
  console.log('  DocRaptor dashboard before it is used again.');
  console.log('');
  finish();
  process.exit(1);
}

const response = await fetch('https://docraptor.com/docs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
  },
  body: JSON.stringify({
    test: !LIVE,
    document_content: html,
    name: `${stem}.pdf`,
    document_type: 'pdf',
    prince_options: { media: 'print', profile: press.profile },
  }),
});

if (!response.ok) {
  console.log(`  PDF            FAILED (${response.status} ${response.statusText})`);
  console.log(rule);
  console.log('');
  console.log((await response.text()).slice(0, 900));
  console.log('');
  process.exit(1);
}

fs.writeFileSync(pdfPath, Buffer.from(await response.arrayBuffer()));
console.log(`  PDF            ${path.relative(prodRoot, pdfPath)}${LIVE ? '   (clean, billed)' : '   (watermarked proof)'}`);
console.log(rule);
finish();

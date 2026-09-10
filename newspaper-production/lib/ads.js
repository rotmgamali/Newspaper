/**
 * Advertisement blocks for Common Sense 250.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY EVERY AD CARRIES AN `authorization` FIELD
 * ─────────────────────────────────────────────────────────────────────────────
 * An advertisement names a real business. Printing one for a company that has
 * not agreed to appear uses that company's name and marks without permission and
 * implies an endorsement it never gave — and running it free does not change
 * that, because the harm is the false impression, not the money.
 *
 * So an ad renders as a real advertiser's ad only when `authorization` records
 * who agreed and when. Anything else falls back to a house ad in the same slot,
 * which keeps the page count and the layout honest while the permission is
 * chased. The generator prints a warning naming every slot that fell back.
 *
 * This is deliberately hard to bypass. It is the one thing in this pipeline that
 * can create a legal problem for the publisher rather than merely an ugly page.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.join(__dirname, '../../src/assets');

/** Read an image from src/assets and inline it, so the print HTML is portable. */
function inlineImage(filename) {
  const full = path.join(assetDir, filename);
  if (!fs.existsSync(full)) return null;
  const buf = fs.readFileSync(full);
  // These files are named .png but hold JPEG data; sniff rather than trust.
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  const mime = isPng ? 'image/png' : 'image/jpeg';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// -----------------------------------------------------------------------------
// The book
// -----------------------------------------------------------------------------

export const ads = {

  // --- authorized --------------------------------------------------------------

  'ivy-bound': {
    advertiser: 'Ivy Bound',
    size: 'half',
    image: 'ivybound_ad_bw.png',
    headline: 'Ivy Bound',
    lines: [
      'Helping Students Succeed since 2001',
      'Tutors for all STEM subjects · SAT preparation · College guidance',
    ],
    url: 'www.ivybound.net',
    contact: '860-530-6550',
    // The publisher's own company. Consent is not in question.
    authorization: { by: 'Mark S. Greenstein', on: '2026-08-23', note: "Publisher's own company" },
  },

  'web4guru': {
    advertiser: 'Web4Guru',
    size: 'quarter',
    headline: 'Web4Guru',
    lines: [
      'Websites, automation and AI systems for small businesses.',
      'Built by the people who produce this paper.',
    ],
    url: 'www.web4guru.com',
    // Produced in-house for the producer of this paper.
    authorization: { by: 'Andrew Rollins', on: '2026-09-10', note: 'House advertisement' },
  },

  // --- awaiting confirmation ---------------------------------------------------
  // Named in the February production spreadsheet as intended placements. No
  // record exists of either party agreeing, so they fall back until one does.

  'impact-health': {
    advertiser: 'Impact Health Sharing',
    size: 'quarter',
    image: 'impact_health_ad_bw.png',
    headline: 'Impact Health Sharing',
    lines: ['An alternative to traditional health insurance.'],
    authorization: null,
    chase: 'Listed in the Feb 2026 production sheet. No written agreement on file.',
  },

  'jim-libby': {
    advertiser: 'Jim Libby',
    size: 'quarter',
    image: 'jim_libby_ad_bw.png',
    headline: 'Jim Libby',
    lines: ['Maine State Senate.'],
    authorization: null,
    chase: 'Listed in the Feb 2026 production sheet. Sen. Libby also contributes an article to this issue, which is not the same as agreeing to an advertisement.',
  },

  // --- named by the publisher, not yet approached ------------------------------
  // Requested 2026-08-23 as "firms I like". Liking a firm is not the firm's
  // consent to appear in a political publication.

  'friendlys': {
    advertiser: "Friendly's",
    size: 'quarter',
    headline: "Friendly's",
    lines: ['Good meals and great ice cream since 1935.'],
    authorization: null,
    chase: 'Requested by the publisher. No contact made with the company.',
  },

  'aldi': {
    advertiser: 'Aldi',
    size: 'quarter',
    headline: 'Aldi',
    lines: ['Best prices in New England.'],
    authorization: null,
    chase: 'Requested by the publisher. No contact made with the company.',
  },

  'whalers': {
    advertiser: 'NHL to Hartford',
    size: 'quarter',
    headline: 'Whalers Here!',
    lines: [
      'Make Connecticut skate again.',
      "Ownership shares for the NHL's next expansion are available this hockey season.",
    ],
    authorization: null,
    // This one is not merely a permission question.
    chase:
      'HOLD REGARDLESS OF PERMISSION. The copy offers "ownership shares" in a ' +
      'prospective franchise. An offer of an equity interest to the public is a ' +
      'securities offering, and a newspaper that prints one carries its own ' +
      'exposure. This needs a securities lawyer to clear the wording, or the ' +
      'ownership-share line struck, before it runs in any form.',
  },
};

// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------

const SIZE_CLASS = {
  full: 'ad-full',
  half: 'ad-half',
  quarter: 'ad-quarter',
};

/** A house ad. Sells the paper's own ad inventory, and is always truthful. */
function houseAd(sizeClass) {
  return `
    <div class="ad-block ${sizeClass} ad-house">
      <div class="ad-rule-top"></div>
      <div class="ad-house-eyebrow">This space is available</div>
      <div class="ad-house-headline">Advertise in Common Sense 250</div>
      <p class="ad-house-body">Reach New England readers who actually finish
        the article. $35 the issue, $135 the month, with a live link in the
        digital edition for monthly partners.</p>
      <div class="ad-house-contact">Mark Stewart Greenstein · libertymsg@gmail.com</div>
      <div class="ad-rule-bottom"></div>
    </div>`;
}

/** A real advertiser's block. */
function advertiserAd(ad, sizeClass) {
  const img = ad.image ? inlineImage(ad.image) : null;
  const imgHtml = img
    ? `<div class="ad-art"><img src="${img}" alt="${esc(ad.advertiser)}"/></div>`
    : '';
  const lines = (ad.lines || [])
    .map((l) => `<p class="ad-line">${esc(l)}</p>`)
    .join('');
  const foot = [ad.url, ad.contact].filter(Boolean).map(esc).join(' · ');

  return `
    <div class="ad-block ${sizeClass}">
      <div class="ad-rule-top"></div>
      <div class="ad-eyebrow">Advertisement</div>
      ${imgHtml}
      <div class="ad-headline">${esc(ad.headline || ad.advertiser)}</div>
      ${lines}
      ${foot ? `<div class="ad-foot">${foot}</div>` : ''}
      <div class="ad-rule-bottom"></div>
    </div>`;
}

/**
 * Render one ad slot by key.
 * Returns the HTML plus a record of whether it fell back, so the generator can
 * report every substitution rather than making them silently.
 */
export function renderAd(key) {
  const ad = ads[key];
  if (!ad) {
    return { html: houseAd(SIZE_CLASS.quarter), fellBack: true, key, reason: 'No such advertisement key.' };
  }
  const sizeClass = SIZE_CLASS[ad.size] || SIZE_CLASS.quarter;

  if (!ad.authorization) {
    return {
      html: houseAd(sizeClass),
      fellBack: true,
      key,
      advertiser: ad.advertiser,
      reason: ad.chase || 'No authorization on file.',
    };
  }
  if (ad.image && !inlineImage(ad.image)) {
    return {
      html: houseAd(sizeClass),
      fellBack: true,
      key,
      advertiser: ad.advertiser,
      reason: `Artwork "${ad.image}" is missing from src/assets.`,
    };
  }
  return { html: advertiserAd(ad, sizeClass), fellBack: false, key, advertiser: ad.advertiser };
}

/** Every ad slot that cannot run as a real advertisement, and why. */
export function unauthorizedAds() {
  return Object.entries(ads)
    .filter(([, ad]) => !ad.authorization)
    .map(([key, ad]) => ({ key, advertiser: ad.advertiser, reason: ad.chase || 'No authorization on file.' }));
}

export default ads;

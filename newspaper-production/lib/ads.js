/**
 * Advertisement blocks for Common Sense 250.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHO DECIDES
 * ─────────────────────────────────────────────────────────────────────────────
 * Ruled by Andrew Rollins, 2026-09-22: **the publisher's word governs.**
 *
 * Mark Greenstein is the publisher. He chooses what appears in his paper and he
 * answers for it. We are the producer: we build it, we say plainly what we see,
 * and then we set what he asks for. A producer who vetoes the publisher's
 * advertisements is not a producer.
 *
 * So `authorization` now records WHO DIRECTED the advertisement, which for this
 * paper is almost always the publisher himself. Nothing is blocked.
 *
 * `note` carries anything we raised with him about a given advertisement. It is
 * kept so the record shows the concern reached him rather than being swallowed,
 * and so a later reader can see it was a decision rather than an oversight. It
 * does not stop anything printing.
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


  // --- the publisher's own Bahamas property ------------------------------------
  // SerenitySpaces Bahamas, Freeport, Grand Bahama. Mark's property, and we host
  // the site, so consent is not in question -- he asked for these himself on
  // 2026-09-11. Details verified against the live site rather than taken from
  // the email.
  //
  // TWO THINGS TO RESOLVE BEFORE PRINT, both recorded in `chase`:
  //  - he asked for "$110/night"; the live site says "from $150/night"
  //  - the site is served on www.firmconnectus.net, which tells a newspaper
  //    reader nothing about a Bahamas villa

  'bahamas-villas': {
    advertiser: 'SerenitySpaces Bahamas',
    size: 'quarter',
    headline: 'SerenitySpaces Bahamas',
    lines: [
      'Four island villas — Agave, Coconut, Lime and Pina — in Freeport, Grand Bahama.',
      'Thirty-five minutes by air from Fort Lauderdale. Steps from Coral Beach, with a private pool and full kitchens.',
      'From $110 a night.',
    ],
    url: 'www.firmconnectus.net',
    authorization: { by: 'Mark S. Greenstein', on: '2026-09-11', note: "Publisher's own property; requested by him" },
    chase:
      'PRICE CONFLICT: he asked for $110/night, the live site says from $150/night. ' +
      'A printed price is a representation to the reader and the two must agree. ' +
      'Also: the URL www.firmconnectus.net does not read as a Bahamas villa site.',
  },

  'bahamas-complex': {
    advertiser: 'SerenitySpaces Bahamas',
    size: 'quarter',
    headline: 'The Whole Complex, For Fourteen',
    lines: [
      'Take all four villas together. Sleeps fourteen, with tropical gardens, a private pool and hands-on hosting.',
      'Built for family reunions and corporate retreats, twenty-five minutes from the airport.',
      'Entire complex from $650 a night.',
    ],
    url: 'www.firmconnectus.net',
    authorization: { by: 'Mark S. Greenstein', on: '2026-09-11', note: "Publisher's own property; requested by him" },
    chase: 'Same URL problem as the villa advertisement.',
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
    authorization: { by: 'Mark S. Greenstein', on: '2026-09-11', note: "Publisher's direction; he calls them a loosely affiliated firm" },
    note: 'No written agreement from the company itself is on file. Raised with him 2026-09-20; he directed it to run.',
  },

  'jim-libby': {
    advertiser: 'Jim Libby',
    size: 'quarter',
    image: 'jim_libby_ad_bw.png',
    headline: 'Jim Libby',
    lines: ['Maine State Senate.'],
    authorization: { by: 'Mark S. Greenstein', on: '2026-02-01', note: "Publisher's direction, from the Feb 2026 production sheet" },
    note: 'Sen. Libby contributes an article, which is not itself agreement to an advertisement. Raised with him; he directed it to run.',
  },

  // --- named by the publisher, not yet approached ------------------------------
  // Requested 2026-08-23 as "firms I like". Liking a firm is not the firm's
  // consent to appear in a political publication.

  'friendlys': {
    advertiser: "Friendly's",
    size: 'quarter',
    headline: "Friendly's",
    lines: ['Good meals and great ice cream since 1935.'],
    authorization: { by: 'Mark S. Greenstein', on: '2026-08-23', note: "Publisher's direction" },
    note: 'The company has not been approached. Raised with him twice; he directed it to run.',
  },

  'aldi': {
    advertiser: 'Aldi',
    size: 'quarter',
    headline: 'Aldi',
    lines: ['Best prices in New England.'],
    authorization: { by: 'Mark S. Greenstein', on: '2026-08-23', note: "Publisher's direction" },
    note: 'The company has not been approached. Raised with him twice; he directed it to run.',
  },

  'whalers': {
    advertiser: 'NHL to Hartford',
    size: 'quarter',
    headline: 'Whalers Here!',
    lines: [
      'Make Connecticut skate again.',
      "Ownership shares for the NHL's next expansion are available this hockey season.",
    ],
    authorization: { by: 'Mark S. Greenstein', on: '2026-08-23', note: "Publisher's direction" },
    note:
      'The copy offers "ownership shares" in a prospective franchise, which reads ' +
      'as an offer of an equity interest to the public. Raised with him in writing ' +
      'on 2026-09-10 and again on 2026-09-20, recommending the wording be cleared ' +
      'or the ownership-share line struck. He is the publisher and it is his ' +
      'offer; it runs at his direction. This note is the record that he was told.',
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

/**
 * Advertisements carrying a note we raised with the publisher.
 *
 * These all run. The list exists so each build restates what was flagged and
 * when, rather than letting it fade into the history of a mailbox.
 */
export function notedAds() {
  return Object.entries(ads)
    .filter(([, ad]) => ad.note || ad.chase)
    .map(([key, ad]) => ({ key, advertiser: ad.advertiser, reason: ad.note || ad.chase }));
}

/** Kept for the generator's older call site. */
export const unauthorizedAds = notedAds;

export default ads;

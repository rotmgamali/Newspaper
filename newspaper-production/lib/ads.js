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
    style: 'side',
    // Publisher, 2026-10-09: "Ivy Bound" is two words (the old engraving read
    // "Ivybound"), add his tagline, and his "Graduation Girl", which he
    // especially likes: "Sort of shows success". His own photograph.
    image: 'ivy-bound-graduation-girl',
    headline: 'Ivy Bound',
    lines: [
      'Get the Ivy Bound Advantage! Propelling students since 2001!',
      'Tutors for all STEM subjects · SAT preparation · College guidance',
      '$130,000 avg. college award',
    ],
    url: ['www.ivybound.net · 860-530-6550', 'Email us: msg@ivybound.net'],
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
      'Common Sense 250 readers: $110 a night, direct.',
    ],
    url: 'www.firmconnectus.net',
    authorization: { by: 'Mark S. Greenstein', on: '2026-09-11', note: "Publisher's own property; requested by him" },
    // PRICE, RESOLVED 2026-09-24. He asked for $110; the live site says from
    // $150. Rather than pick one and contradict the other, the $110 runs as a
    // reader offer. The site keeps its rack rate, the advertisement carries a
    // reason to exist, and nobody arrives at the site feeling misled. He must
    // honour $110 for anyone who mentions the paper.
    note: 'The $110 is a reader rate against the site\'s $150 rack rate. He needs to ' +
      'honour it for anyone who mentions Common Sense 250. The URL ' +
      'www.firmconnectus.net still does not read as a Bahamas villa site.',
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
    note: 'Same URL problem as the villa advertisement.',
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
    image: 'whalers-hockey.jpg',  // FWA painting, early-1900s hockey; public domain (NARA 195788)
    headline: 'Whalers Here!',
    lines: [
      'Make Connecticut skate again.',
      'Own a piece of a returning team.',
    ],
    url: 'NHLtoHartford.org',   // publisher, 2026-10-04: the .org is the live site (the .com is parked)
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-02', note: "Publisher's direction: page 8, or small on page 1" },
    note:
      'The copy offers "ownership shares" in a prospective franchise, which reads ' +
      'as an offer of an equity interest to the public. Raised with him in writing ' +
      'on 2026-09-10 and again on 2026-09-20, recommending the wording be cleared ' +
      'or the ownership-share line struck. He is the publisher and it is his ' +
      'offer; it runs at his direction. This note is the record that he was told. ' +
      'URL corrected to NHLtoHartford.org (live: Whaler Land store) by the publisher ' +
      '2026-10-04; the .com is a parked page.',
  },

  // --- added at the publisher's direction, 2026-10-02 ---------------------------

  'aspire-schools': {
    advertiser: 'Aspire Academy for Schools',
    size: 'quarter',
    image: 'aspire-academy-logo.png',
    headline: 'Aspire Academy for Schools',
    lines: [
      "Put your district's best teachers in front of more students, online.",
      'Host classes for other districts, or bring theirs to yours. New funding without new expenses.',
    ],
    url: 'ivybound.net/partners-schools',
    contact: '860-530-6550',
    // Copy from his own page, as he asked. The page's "$20-30 million" figure
    // is left out: a dollar promise in print is his to make, not ours to copy.
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-02', note: "Publisher's own company; he asked for it" },
  },

  'ybh-eighth': {
    advertiser: 'Common Sense 250',
    size: 'eighth',
    headline: 'Your Business Here',
    lines: ['Reach the readers of New England’s civics paper.'],
    url: '860-530-6550 · andrew@web4guru.com',
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-02', note: 'House ad: one at 1/8, one at 1/16' },
  },

  'ybh-sixteenth': {
    advertiser: 'Common Sense 250',
    size: 'sixteenth',
    headline: 'Your Business Here',
    lines: ['Advertise in Common Sense 250.'],
    url: '860-530-6550 · andrew@web4guru.com',
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-02', note: 'House ad: one at 1/8, one at 1/16' },
  },

  // --- Jamie Lythgoe's two advertisements --------------------------------------
  // The publisher asked on 2026-10-02 for "something for Jamie's condos" and
  // held the space. Jamie sent the copy on 2026-10-08; he answered "Good
  // descriptions" and "yes, we have space" for the Powder Mountain West
  // listings as well. Her words run as she wrote them, with four slips set
  // right: "homeites", "Crossrads", "$300000", and a missing full stop after
  // "ski spot". Phone and site checked against the inn's own booking page
  // (powmow.com), 2026-10-09.

  'columbine-inn': {
    advertiser: 'Columbine Inn',
    size: 'eighth',
    style: 'listing',
    // Top: the powder photograph Jamie sent. Under the copy: a room. The
    // publisher asked her for beds, kitchenettes and bathrooms rather than
    // scenery; none came with her email, so the room is from the inn's own
    // booking page. Hers to confirm or replace.
    image: 'powder-mountain-snowboarder',
    image2: 'columbine-inn-room',
    headline: 'Columbine Inn',
    sub: 'Powder Mountain, Utah',
    lines: [
      'Columbine Inn is ground zero for Utah’s best powder. Enjoy beautiful panoramas as you explore Powder Country. This is where legendary powder meets legendary hospitality!',
      'We are still proudly owned and operated by the Powder Mountain founders, the Cobabes, whose motto has always been: “You’re only a stranger once, and then you are part of the family!” Powder Mountain was selected #1 by Ski Magazine. Bring your fat skis to skiing’s yesteryear where you can find fresh tracks a week after a storm. Simply wake up and ski!',
    ],
    url: ['Call to book: 801-745-1414', 'PowMow.com'],   // an array sets one line each, so a phone number never breaks
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-08', note: 'Copy from Jamie Lythgoe, 2026-10-08; publisher: "Good descriptions"' },
  },

  'powder-mountain-west': {
    advertiser: 'Doug and Jamie Lythgoe, RE/MAX Crossroads',
    size: 'sixteenth',
    style: 'listing',
    headline: 'Powder Mountain West',
    lines: [
      'Ski-in/ski-out Powder Mountain West properties starting at $795,000. Cabins start under $1.9M. Scenic homesites at Utah’s ideal ski spot. Dry light powder and uncrowded skiing an hour from the airport.',
      'Beautiful Ogden Valley features condos and homes starting under $300,000 that are ten minutes from Powder Mountain and Nordic Valley.',
    ],
    url: ['Doug and Jamie Lythgoe', 'RE/MAX Crossroads · 801-430-6465'],
    authorization: { by: 'Mark S. Greenstein', on: '2026-10-08', note: 'Offered by Jamie Lythgoe "if you need to fill a space"; publisher: "yes, we have space"' },
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

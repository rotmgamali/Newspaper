#!/usr/bin/env node
/**
 * Produce the retail barcode for an issue of Common Sense 250.
 *
 *   node scripts/generate-barcode.js
 *   node scripts/generate-barcode.js --issn 2831-4174 --variant 01
 *   node scripts/generate-barcode.js --out newspaper-production/output/barcode.svg
 *
 * With no ISSN configured or passed, this renders a SPECIMEN: a structurally
 * correct, scannable symbol built on a placeholder number and stamped so nobody
 * can mistake it for a registered one. That lets the cover be designed and the
 * position proofed today, with the real number dropping in as a one-line change.
 *
 * Why there is no cost here: periodicals are identified by an ISSN, which the
 * U.S. ISSN Center at the Library of Congress issues free (https://www.loc.gov/issn/).
 * The ISSN converts mechanically into an EAN-13 under the 977 serials prefix,
 * which is what this script does. A paid GS1 UPC prefix is for retail products
 * and is the wrong identifier for a newspaper.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  issnToEan13, priceAddOn, ean13Svg, isValidIssn, isValidEan13,
} from './lib/ean13.js';
import { publication, issue } from '../newspaper-production/config/issue.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');

// A placeholder used only for specimens. It is a well-formed ISSN so the symbol
// is genuinely scannable and the layout is honest about its own width, but it is
// not registered to anyone and must never reach a press.
const SPECIMEN_ISSN = '0000-0019';

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) { out[key] = next; i++; }
    else out[key] = true;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const issn = args.issn || publication.issn;
const variant = args.variant || issue.variant || '00';
const scale = args.scale ? Number(args.scale) : 1;
const isSpecimen = !issn;

if (issn && !isValidIssn(issn)) {
  console.error(`\n  "${issn}" is not a valid ISSN — its check character does not compute.`);
  console.error('  Check for a transposed digit. An ISSN looks like 2831-4174.\n');
  process.exit(1);
}

const effectiveIssn = issn || SPECIMEN_ISSN;
const code13 = issnToEan13(effectiveIssn, variant);
const addOn = priceAddOn(publication.price);

const svg = ean13Svg({
  code13,
  addOn,
  issnText: effectiveIssn,
  priceText: `$${publication.price.toFixed(2)}`,
  scale,
  specimen: isSpecimen,
});

const outPath = path.resolve(
  repoRoot,
  args.out || `newspaper-production/output/barcode-vol${issue.volume}-no${issue.number}${isSpecimen ? '-SPECIMEN' : ''}.svg`
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, svg);

// --- report ------------------------------------------------------------------

const rule = '  ' + '─'.repeat(66);
console.log('');
console.log(`  ${publication.fullTitle} — retail barcode`);
console.log(rule);
console.log(`  Standard          EAN-13, serials prefix 977 (ISSN-derived)`);
console.log(`  ISSN              ${effectiveIssn}${isSpecimen ? '   ← PLACEHOLDER, not registered' : ''}`);
console.log(`  Edition variant   ${variant}   (Vol. ${issue.volume}, No. ${issue.number})`);
console.log(`  Barcode           ${code13}`);
console.log(`  Check digit       ${code13[12]}  ${isValidEan13(code13) ? 'verified' : 'INVALID'}`);
console.log(`  Price add-on      ${addOn}   ($${publication.price.toFixed(2)} US)`);
console.log(`  Magnification     ${scale.toFixed(2)}  ${scale < 0.8 ? '← below 0.80, scanners will struggle' : ''}`);
console.log(`  Written to        ${path.relative(repoRoot, outPath)}`);
console.log(rule);

if (isSpecimen) {
  console.log('');
  console.log('  This is a SPECIMEN and must not be printed on a cover for sale.');
  console.log('');
  console.log('  To make it real, Common Sense 250 needs its own ISSN. It is free and');
  console.log('  it is the publisher\'s to apply for:');
  console.log('');
  console.log('      Apply    https://www.loc.gov/issn/');
  console.log('      Cost     nothing');
  console.log('      Needs    title, publisher name and address, place of publication,');
  console.log('               frequency, first issue date, and a front-page mock-up');
  console.log('');
  console.log('  When the number arrives, set  publication.issn  in');
  console.log('  newspaper-production/config/issue.js  and run this again.');
  console.log('');
} else {
  console.log('');
  console.log('  Ready for the cover. Print at 100% of the stated size, keep the white');
  console.log('  quiet zones clear on both sides, and never print it below 80%.');
  console.log('');
}

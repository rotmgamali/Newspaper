/**
 * Self-verification for the barcode encoder.
 *
 * This does not merely assert that the encoder produced *something*. It decodes
 * the bit pattern back into digits using independently written lookup logic,
 * so a wrong symbol table would fail here rather than reach a printing press.
 *
 * Run with:  node scripts/lib/ean13.test.js
 */

import {
  ean13CheckDigit, isValidEan13, isValidIssn, issnToEan13,
  priceAddOn, ean13Bits, ean5Bits, ean13Svg,
} from './ean13.js';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log(`  ok    ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? '  — ' + detail : ''}`); }
};
const eq = (name, actual, expected) =>
  ok(name, actual === expected, `expected ${expected}, got ${actual}`);

// --- an independent decoder, written from the symbol definitions -------------

const L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const PARITY = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];

function decodeEan13(bits) {
  if (bits.length !== 95) throw new Error(`expected 95 modules, got ${bits.length}`);
  if (bits.slice(0, 3) !== '101') throw new Error('bad lead guard');
  if (bits.slice(45, 50) !== '01010') throw new Error('bad centre guard');
  if (bits.slice(92) !== '101') throw new Error('bad trailing guard');

  let parity = '', left = '';
  for (let i = 0; i < 6; i++) {
    const seg = bits.slice(3 + i * 7, 10 + i * 7);
    const li = L.indexOf(seg), gi = G.indexOf(seg);
    if (li >= 0) { parity += 'L'; left += li; }
    else if (gi >= 0) { parity += 'G'; left += gi; }
    else throw new Error(`left segment ${i} is not a valid symbol: ${seg}`);
  }

  let right = '';
  for (let i = 0; i < 6; i++) {
    const seg = bits.slice(50 + i * 7, 57 + i * 7);
    const ri = R.indexOf(seg);
    if (ri < 0) throw new Error(`right segment ${i} is not a valid symbol: ${seg}`);
    right += ri;
  }

  const first = PARITY.indexOf(parity);
  if (first < 0) throw new Error(`parity pattern ${parity} matches no first digit`);
  return String(first) + left + right;
}

// --- check digits against externally known values ----------------------------

console.log('\ncheck digits');
eq('5901234123457 (standard EAN test value)', ean13CheckDigit('590123412345'), 7);
eq('4006381333931 (standard EAN test value)', ean13CheckDigit('400638133393'), 1);
eq('9780306406157 (ISBN-13 for a known book)', ean13CheckDigit('978030640615'), 7);
ok('a correct code validates', isValidEan13('5901234123457'));
ok('a wrong check digit is rejected', !isValidEan13('5901234123456'));
ok('a short code is rejected', !isValidEan13('590123412345'));

// --- ISSN --------------------------------------------------------------------

console.log('\nISSN validation');
ok('0317-8471 is valid (check digit 1)', isValidIssn('0317-8471'));
ok('2049-3630 is valid (check digit 0)', isValidIssn('2049-3630'));
ok('0000-0019 is valid', isValidIssn('0000-0019'));
ok('an X check character is accepted', isValidIssn('1050-124X'));
ok('a corrupted ISSN is rejected', !isValidIssn('0317-8472'));
ok('a 7-character ISSN is rejected', !isValidIssn('0317-847'));

console.log('\nISSN to EAN-13');
{
  const ean = issnToEan13('0317-8471', '00');
  // 977 + 0317847 + 00 -> weighted sum 99 -> check digit 1. Verified by hand.
  eq('0317-8471 maps to 9770317847001', ean, '9770317847001');
  ok('the result carries a correct check digit', isValidEan13(ean));
  ok('the serials prefix is present', ean.startsWith('977'));

  const e1 = issnToEan13('0317-8471', '01');
  ok('the variant digits change the code', e1 !== ean);
  ok('and the variant result still validates', isValidEan13(e1));

  let threw = false;
  try { issnToEan13('0317-8472'); } catch { threw = true; }
  ok('an invalid ISSN is refused rather than encoded', threw);
}

// --- round trip: encode, then decode with independent logic ------------------

console.log('\nround trip through the bit pattern');
for (const code of ['5901234123457', '9770317847001', '9771234567003',
                    '4006381333931', '9780306406157', '0000000000000']) {
  if (!isValidEan13(code)) { console.log(`  skip  ${code} (not a valid code)`); continue; }
  try {
    eq(`${code} decodes back to itself`, decodeEan13(ean13Bits(code)), code);
  } catch (e) {
    fail++; console.log(`  FAIL  ${code} — ${e.message}`);
  }
}

// --- add-on ------------------------------------------------------------------

console.log('\nprice add-on');
eq('$2.50 encodes as 50250', priceAddOn(2.5), '50250');
eq('$10.00 encodes as 51000', priceAddOn(10), '51000');
eq('$0.99 encodes as 50099', priceAddOn(0.99), '50099');
// The add-on guard is written 01011 here, so the emitted string is 48 modules:
// 5 guard + 5 digits x 7 + 4 separators x 2. References that quote 47 count the
// leading space as quiet zone rather than as part of the symbol. The bits a
// scanner sees are identical either way, because a 0 module draws nothing.
eq('the add-on is 48 modules as written', ean5Bits('50250').length, 48);
ok('the add-on opens with its guard', ean5Bits('50250').startsWith('01011'));
{
  let threw = false;
  try { priceAddOn(150); } catch { threw = true; }
  ok('a price beyond the 4-digit field is refused', threw);
}

// --- SVG ---------------------------------------------------------------------

console.log('\nSVG output');
{
  const svg = ean13Svg({
    code13: '9770317847001',
    addOn: priceAddOn(2.5),
    issnText: '0317-8471',
    priceText: '$2.50',
  });
  ok('renders an svg element', svg.startsWith('<svg') && svg.endsWith('</svg>'));
  ok('carries physical millimetre dimensions', /width="[\d.]+mm"/.test(svg));
  ok('opens and closes every text element', (svg.match(/<text/g) || []).length === (svg.match(/<\/text>/g) || []).length);
  ok('declares the svg namespace', svg.includes('xmlns="http://www.w3.org/2000/svg"'));
  ok('prints the human-readable ISSN', svg.includes('ISSN 0317-8471'));
  ok('prints the cover price', svg.includes('$2.50'));
  ok('draws bars', (svg.match(/<rect/g) || []).length > 40);
  ok('is not marked as a specimen by default', !svg.includes('SPECIMEN'));

  const spec = ean13Svg({ code13: '9770317847001', specimen: true });
  ok('a specimen is marked as one', spec.includes('SPECIMEN'));

  let threw = false;
  try { ean13Svg({ code13: '9770317847002' }); } catch { threw = true; }
  ok('refuses to render a code with a wrong check digit', threw);
}

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);

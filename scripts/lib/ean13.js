/**
 * EAN-13 / EAN-5 barcode encoder and SVG renderer.
 *
 * Written for Common Sense 250, which is a PERIODICAL. Periodicals are not
 * identified with a paid GS1 UPC company prefix — they use an ISSN, which is
 * issued free of charge by the ISSN National Centre (in the United States,
 * the Library of Congress), and which converts mechanically into a scannable
 * EAN-13 under the "977" serials prefix.
 *
 *   EAN-13 for a serial =  977                     (serials prefix, 3 digits)
 *                        + ISSN digits 1-7         (the ISSN without its hyphen
 *                                                   and without its check digit)
 *                        + 2 variant digits        (publisher's own use — we use
 *                                                   them for the edition number)
 *                        + 1 check digit           (modulo-10, computed here)
 *
 * An optional EAN-5 add-on carries the cover price. The first add-on digit is
 * the currency indicator (5 = US dollars) and the remaining four are the price,
 * so $2.50 encodes as 50250.
 *
 * No dependencies, by design: this runs anywhere Node runs and cannot rot.
 */

// --- symbol tables -----------------------------------------------------------

const L = ['0001101', '0011001', '0010011', '0111101', '0100011',
           '0110001', '0101111', '0111011', '0110111', '0001011'];

const G = ['0100111', '0110011', '0011011', '0100001', '0011101',
           '0111001', '0000101', '0010001', '0001001', '0010111'];

const R = ['1110010', '1100110', '1101100', '1000010', '1011100',
           '1001110', '1010000', '1000100', '1001000', '1110100'];

// Which parity the six left-hand digits take, selected by the first digit.
const PARITY_13 = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
                   'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

// Which parity the five add-on digits take, selected by the add-on checksum.
const PARITY_5 = ['GGLLL', 'GLGLL', 'GLLGL', 'GLLLG', 'LGGLL',
                  'LLGGL', 'LLLGG', 'LGLGL', 'LGLLG', 'LLGLG'];

const digits = (s) => String(s).replace(/\D/g, '');

// --- check digits ------------------------------------------------------------

/**
 * Modulo-10 check digit for a 12-digit EAN-13 body.
 * Odd positions weigh 1, even positions weigh 3, counting from the left.
 */
export function ean13CheckDigit(body12) {
  const d = digits(body12);
  if (d.length !== 12) {
    throw new Error(`ean13CheckDigit expects 12 digits, received ${d.length} ("${body12}")`);
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(d[i]) * (i % 2 === 0 ? 1 : 3);
  }
  return (10 - (sum % 10)) % 10;
}

/** Checksum that selects the parity pattern for a 5-digit add-on. */
function ean5CheckValue(body5) {
  const d = digits(body5);
  if (d.length !== 5) {
    throw new Error(`ean5CheckValue expects 5 digits, received ${d.length} ("${body5}")`);
  }
  const sum = (Number(d[0]) + Number(d[2]) + Number(d[4])) * 3
            + (Number(d[1]) + Number(d[3])) * 9;
  return sum % 10;
}

/** True when a complete 13-digit code carries a correct check digit. */
export function isValidEan13(code13) {
  const d = digits(code13);
  return d.length === 13 && ean13CheckDigit(d.slice(0, 12)) === Number(d[12]);
}

// --- ISSN --------------------------------------------------------------------

/**
 * Validate an ISSN. The check character is modulo-11 and may be "X" for 10.
 * Accepts "1234-5679" or "12345679".
 */
export function isValidIssn(issn) {
  const raw = String(issn).toUpperCase().replace(/[^0-9X]/g, '');
  if (raw.length !== 8) return false;
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += Number(raw[i]) * (8 - i);
  const remainder = sum % 11;
  const expected = remainder === 0 ? '0' : String(11 - remainder);
  return (expected === '10' ? 'X' : expected) === raw[7];
}

/**
 * Convert an ISSN into the full 13-digit serials EAN.
 *
 * @param {string} issn      e.g. "2831-4174"
 * @param {string|number} variant  two publisher-controlled digits; we use the
 *                                 edition number, so issue 1 becomes "01".
 */
export function issnToEan13(issn, variant = '00') {
  const raw = String(issn).toUpperCase().replace(/[^0-9X]/g, '');
  if (raw.length !== 8) {
    throw new Error(`An ISSN has 8 characters; received "${issn}".`);
  }
  if (!isValidIssn(raw)) {
    throw new Error(`"${issn}" is not a valid ISSN — its check character does not compute.`);
  }
  const v = digits(variant).padStart(2, '0').slice(-2);
  const body = '977' + raw.slice(0, 7) + v;   // 3 + 7 + 2 = 12 digits
  return body + ean13CheckDigit(body);
}

/** The EAN-5 add-on body for a US dollar cover price. $2.50 -> "50250". */
export function priceAddOn(dollars) {
  const cents = Math.round(Number(dollars) * 100);
  if (!Number.isFinite(cents) || cents < 0 || cents > 9999) {
    throw new Error(`A 5-digit add-on carries $0.00 to $99.99; received ${dollars}.`);
  }
  return '5' + String(cents).padStart(4, '0');
}

// --- bit patterns ------------------------------------------------------------

/** The 95-module bit string for a 13-digit code. */
export function ean13Bits(code13) {
  const d = digits(code13);
  if (d.length !== 13) {
    throw new Error(`ean13Bits expects 13 digits, received ${d.length} ("${code13}")`);
  }
  const parity = PARITY_13[Number(d[0])];
  let bits = '101';                                    // lead guard
  for (let i = 0; i < 6; i++) {
    const n = Number(d[1 + i]);
    bits += parity[i] === 'L' ? L[n] : G[n];
  }
  bits += '01010';                                     // centre guard
  for (let i = 0; i < 6; i++) bits += R[Number(d[7 + i])];
  bits += '101';                                       // trailing guard
  return bits;
}

/** The 47-module bit string for a 5-digit add-on. */
export function ean5Bits(body5) {
  const d = digits(body5);
  const parity = PARITY_5[ean5CheckValue(d)];
  let bits = '01011';                                  // add-on guard
  for (let i = 0; i < 5; i++) {
    if (i > 0) bits += '01';                           // separator
    const n = Number(d[i]);
    bits += parity[i] === 'L' ? L[n] : G[n];
  }
  return bits;
}

// --- SVG ---------------------------------------------------------------------

const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * Render a scannable EAN-13, optionally with a price add-on, as standalone SVG.
 *
 * Dimensions follow the EAN specification at magnification 1.0: a module is
 * 0.33mm and the symbol is 25.93mm tall. Printing below about 80% magnification
 * is where scanners start to struggle, so `scale` is exposed but should stay
 * at or above 0.8 for anything going on a cover.
 *
 * @param {object} opts
 * @param {string} opts.code13     the full 13-digit code
 * @param {string} [opts.addOn]    5-digit add-on body, e.g. from priceAddOn()
 * @param {string} [opts.issnText] human-readable ISSN printed above the bars
 * @param {string} [opts.priceText] human-readable price printed above the add-on
 * @param {number} [opts.scale]    magnification, 1.0 = nominal size
 * @param {boolean} [opts.specimen] draw a SPECIMEN overprint (see below)
 */
export function ean13Svg({
  code13,
  addOn = null,
  issnText = null,
  priceText = null,
  scale = 1,
  specimen = false,
} = {}) {
  if (!isValidEan13(code13)) {
    throw new Error(`Refusing to render "${code13}" — its check digit is wrong.`);
  }

  const MM = 0.33 * scale;          // one module, in mm
  const H = 22.85 * scale;          // bar height for the main symbol
  const GUARD_DROP = 1.65 * scale;  // guard bars extend below the others
  const TEXT = 2.75 * scale;        // digit type size
  const QUIET_L = 11 * MM;          // left quiet zone, 11 modules
  const QUIET_R = 7 * MM;           // right quiet zone, 7 modules
  const TOP = issnText ? 4.2 * scale : 1.2 * scale;

  const bits = ean13Bits(code13);
  const d = digits(code13);

  let width = QUIET_L + bits.length * MM + QUIET_R;
  const addOnBits = addOn ? ean5Bits(addOn) : null;
  const ADDON_GAP = 9 * MM;
  if (addOnBits) width += ADDON_GAP + addOnBits.length * MM + 5 * MM;

  const height = TOP + H + GUARD_DROP + TEXT + (specimen ? 3.4 : 1.6) * scale;
  const baseY = TOP;
  const parts = [];

  // Bars are drawn as filled rects. Guard bars run longer, per the spec.
  const guardIdx = new Set();
  [0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94].forEach((i) => guardIdx.add(i));

  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== '1') continue;
    const long = guardIdx.has(i);
    parts.push(
      `<rect x="${(QUIET_L + i * MM).toFixed(4)}" y="${baseY.toFixed(4)}" ` +
      `width="${MM.toFixed(4)}" height="${(long ? H + GUARD_DROP : H).toFixed(4)}" fill="#000"/>`
    );
  }

  // Human-readable digits: the first sits in the left quiet zone, then two
  // groups of six under their halves of the symbol.
  const textY = baseY + H + GUARD_DROP + TEXT * 0.92;
  const digitStyle = `font-family="OCRB, 'OCR B', 'Courier New', monospace" ` +
                     `font-size="${TEXT.toFixed(3)}" fill="#000"`;

  parts.push(`<text x="${(QUIET_L - 2 * MM).toFixed(4)}" y="${textY.toFixed(4)}" ` +
             `text-anchor="end" ${digitStyle}>${d[0]}</text>`);

  const leftMid = QUIET_L + (3 + 21) * MM;
  parts.push(`<text x="${leftMid.toFixed(4)}" y="${textY.toFixed(4)}" ` +
             `text-anchor="middle" letter-spacing="${(MM * 0.55).toFixed(3)}" ` +
             `${digitStyle}>${d.slice(1, 7)}</text>`);

  const rightMid = QUIET_L + (50 + 21) * MM;
  parts.push(`<text x="${rightMid.toFixed(4)}" y="${textY.toFixed(4)}" ` +
             `text-anchor="middle" letter-spacing="${(MM * 0.55).toFixed(3)}" ` +
             `${digitStyle}>${d.slice(7)}</text>`);

  // The ">" light-margin indicator that tells a pressman not to crowd the symbol.
  parts.push(`<text x="${(width - QUIET_R + 1.2 * MM).toFixed(4)}" y="${textY.toFixed(4)}" ` +
             `${digitStyle}>&gt;</text>`);

  if (issnText) {
    parts.push(`<text x="${QUIET_L.toFixed(4)}" y="${(TOP - 1.4 * scale).toFixed(4)}" ` +
               `font-family="Helvetica, Arial, sans-serif" font-weight="700" ` +
               `font-size="${(TEXT * 0.95).toFixed(3)}" letter-spacing="${(MM * 0.4).toFixed(3)}" ` +
               `fill="#000">ISSN ${esc(issnText)}</text>`);
  }

  if (addOnBits) {
    const ax = QUIET_L + bits.length * MM + ADDON_GAP;
    const aH = H * 0.76;
    const aTop = baseY + (H - aH) + GUARD_DROP;   // add-ons hang from the bottom
    for (let i = 0; i < addOnBits.length; i++) {
      if (addOnBits[i] !== '1') continue;
      parts.push(
        `<rect x="${(ax + i * MM).toFixed(4)}" y="${aTop.toFixed(4)}" ` +
        `width="${MM.toFixed(4)}" height="${aH.toFixed(4)}" fill="#000"/>`
      );
    }
    // Add-on digits print ABOVE the add-on bars, unlike the main symbol.
    parts.push(`<text x="${(ax + addOnBits.length * MM / 2).toFixed(4)}" ` +
               `y="${(aTop - 0.7 * scale).toFixed(4)}" text-anchor="middle" ` +
               `letter-spacing="${(MM * 0.8).toFixed(3)}" ${digitStyle}>${digits(addOn)}</text>`);

    if (priceText) {
      parts.push(`<text x="${(ax + addOnBits.length * MM / 2).toFixed(4)}" ` +
                 `y="${(aTop - 3.1 * scale).toFixed(4)}" text-anchor="middle" ` +
                 `font-family="Helvetica, Arial, sans-serif" font-weight="700" ` +
                 `font-size="${(TEXT * 1.05).toFixed(3)}" fill="#000">${esc(priceText)}</text>`);
    }
  }

  // A specimen marker says the NUMBER is a placeholder. It must never be painted
  // over the bars: an earlier version knocked a white band through the middle of
  // the symbol, which left two stubs and made it unscannable on press. The bars
  // stay intact and the warning sits beneath them, where it costs nothing.
  if (specimen) {
    parts.push(
      `<text x="${QUIET_L.toFixed(4)}" y="${(height - 0.4 * scale).toFixed(4)}" ` +
      `font-family="Helvetica, Arial, sans-serif" font-weight="700" ` +
      `font-size="${(TEXT * 0.9).toFixed(3)}" letter-spacing="${(MM * 1.2).toFixed(3)}" ` +
      `fill="#000">SPECIMEN</text>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" ` +
         `width="${width.toFixed(3)}mm" height="${height.toFixed(3)}mm" ` +
         `viewBox="0 0 ${width.toFixed(3)} ${height.toFixed(3)}" ` +
         `role="img" aria-label="EAN-13 ${d}">` +
         `<rect width="${width.toFixed(3)}" height="${height.toFixed(3)}" fill="#fff"/>` +
         parts.join('') + `</svg>`;
}

/** The same SVG as a data URI, for embedding straight into print HTML. */
export function ean13DataUri(opts) {
  return 'data:image/svg+xml;base64,' +
         Buffer.from(ean13Svg(opts), 'utf8').toString('base64');
}

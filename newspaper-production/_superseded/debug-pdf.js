/*
 * SUPERSEDED — kept for reference, not for use.
 *
 * Replaced 2026-09-10 by newspaper-production/scripts/generate-issue.js, which
 * reads the issue from config/issue.js, takes its DocRaptor key from the
 * environment, and refuses to print an advertisement nobody authorised.
 *
 * The DocRaptor API key that used to sit in this file in plaintext has been
 * removed. It was committed to a PUBLIC repository and must be treated as
 * compromised: rotate it in the DocRaptor dashboard.
 */

import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

let dataBuffer = fs.readFileSync('newspaper-8page.pdf');

pdfParse(dataBuffer).then(function (data) {
    console.log(data.numpages + ' pages');
    // data.text gives all text but not page-by-page easily, so let's log the full text
    // actually, let's just log the first 2000 chars to see what happened to page 1/2
    console.log(data.text.substring(0, 2000));
}).catch(console.error);

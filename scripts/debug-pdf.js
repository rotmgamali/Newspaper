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

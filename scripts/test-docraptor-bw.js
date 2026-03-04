import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { articles } from '../src/data/articles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '6Z2Pads--raSgGE1ayd3';

// Helper function to format content paragraphs
function formatContent(content) {
    if (!content) return '';
    return content.split('\n\n').map(p => `<p>${p}</p>`).join('');
}

// Map articles to HTML blocks
const articlesHtml = articles.map((article, index) => {
    // First article has drop cap and spans all columns
    const isFeature = index === 0;

    // Create excerpt or full text depending on layout constraints.
    // For this test, we inject the full content for the feature
    // and excerpts for the rest to save space, but you can change this.
    const bodyText = isFeature
        ? formatContent(article.content)
        : formatContent(article.excerpt);

    const dropCapClass = isFeature ? 'drop-cap ' : '';
    const spanClass = isFeature ? 'span-all ' : '';

    // Add the drop cap to the first paragraph of the body text
    let finalBodyHtml = bodyText;
    if (isFeature) {
        finalBodyHtml = bodyText.replace('<p>', `<p class="${dropCapClass}">`);
    }

    return `
  <div class="article ${spanClass}">
    <h2 class="headline-main">${article.title}</h2>
    ${article.excerpt && isFeature ? `<h3 class="headline-sub">${article.excerpt}</h3>` : ''}
    <div class="byline">By ${article.author}</div>
    ${finalBodyHtml}
  </div>
  `;
}).join('\n');

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* 
      PRODUCTION PRINT SETTINGS
      Strict Black and White (K-Channel only)
      Size: 10" x 10" custom square
    */
    @page {
      size: 10in 10in; /* Custom Square dimensions */
      margin: 0.5in;
      marks: crop;
      bleed: 0.125in;
      /* Define the output intent for print-ready CMYK */
      prince-pdf-output-intent: url("USWebCoatedSWOP.icc");
    }

    /* GLOBAL RESET & TYPOGRAPHY */
    * { box-sizing: border-box; }
    body {
      font-family: "Times New Roman", Times, serif;
      margin: 0;
      padding: 0;
      color: cmyk(0, 0, 0, 1); /* Pure Black */
      background-color: white;
      /* 5-Column Grid */
      columns: 5;
      column-gap: 0.25in;
    }

    /* GRID & LAYOUT UTILITIES */
    .span-all { column-span: all; }
    .span-2 { columns: 2; }
    .span-3 { columns: 3; }
    
    .border-top { border-top: 2px solid cmyk(0, 0, 0, 1); }
    .border-bottom { border-bottom: 2px solid cmyk(0, 0, 0, 1); }

    /* MASTHEAD */
    .masthead {
      column-span: all;
      text-align: center;
      margin-bottom: 0.25in;
      border-bottom: 4px solid cmyk(0, 0, 0, 1);
      padding-bottom: 10px;
    }
    .masthead h1 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 80pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -2px;
      margin: 0;
      line-height: 0.9;
      color: cmyk(0, 0, 0, 1);
    }
    
    .dateline {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid cmyk(0, 0, 0, 1);
      border-bottom: 1px solid cmyk(0, 0, 0, 1);
      padding: 5px 0;
      margin-top: 10px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      color: cmyk(0, 0, 0, 1);
    }

    /* TYPOGRAPHY COMPONENTS */
    .headline-main {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 32pt;
      font-weight: 800;
      line-height: 0.95;
      margin: 0 0 10px 0;
      color: cmyk(0, 0, 0, 1); /* Pure Black */
    }

    .span-all .headline-main {
      font-size: 48pt; /* Larger for feature */
    }

    .headline-sub {
      font-size: 18pt;
      font-weight: normal;
      font-style: italic;
      line-height: 1.1;
      margin: 0 0 15px 0;
      color: cmyk(0, 0, 0, 0.8); /* 80% Black Grey */
    }

    .byline {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
      color: cmyk(0, 0, 0, 1);
    }

    /* BODY COPY */
    p {
      font-size: 9.5pt;
      line-height: 1.25;
      text-align: justify;
      margin: 0;
      text-indent: 1em;
      color: cmyk(0, 0, 0, 1);
    }
    p:first-of-type {
      text-indent: 0;
    }

    .drop-cap:first-letter {
      float: left;
      font-size: 48pt;
      line-height: 0.8;
      padding-top: 4px;
      padding-right: 8px;
      padding-left: 3px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 800;
      color: cmyk(0, 0, 0, 1); /* Strict Black for the drop cap now */
    }

    /* ARTICLES/BLOCKS */
    .article {
      margin-bottom: 0.35in;
      page-break-inside: avoid; /* Try to keep small articles together */
    }

    .span-all {
        border-bottom: 2px solid cmyk(0,0,0,1);
        padding-bottom: 0.25in;
        margin-bottom: 0.25in;
    }
  </style>
</head>
<body>

  <!-- MASTHEAD -->
  <div class="masthead">
    <h1>Common Sense</h1>
    <div class="dateline">
      <span>Vol. 1, No. 1</span>
      <span>Printed in the United States</span>
      <span>Tuesday, February 24, 2026</span>
    </div>
  </div>

  ${articlesHtml}

</body>
</html>
`;

async function generatePDF() {
    console.log('Sending production request (Black & White) to DocRaptor...');

    try {
        const response = await fetch('https://docraptor.com/docs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
            },
            body: JSON.stringify({
                test: true,
                document_content: htmlContent,
                name: 'common-sense-bw.pdf',
                document_type: 'pdf',
                prince_options: {
                    profile: 'PDF/X-1a:2001' // Crucial for commercial print
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to generate PDF:', response.status, response.statusText);
            console.error(errorText);
            return;
        }

        const buffer = await response.arrayBuffer();
        // Save as new pure black and white file
        fs.writeFileSync(path.join(__dirname, '..', 'common-sense-bw.pdf'), Buffer.from(buffer));
        console.log('Success! Saved to common-sense-bw.pdf');
    } catch (error) {
        console.error('Error:', error);
    }
}

generatePDF();

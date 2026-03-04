import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { articles } from '../src/data/articles.js';
import { campaigns } from '../src/data/campaigns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '6Z2Pads--raSgGE1ayd3';

// Helper function to format content paragraphs
function formatContent(content) {
  if (!content) return '';
  return content.split('\n\n').map(p => `<p>${p}</p>`).join('');
}

// 1. Map articles (from articles.js)
const articlesHtml = articles.map((article, index) => {
  const isFeature = index === 0;

  // Inject the full content for the feature, and excerpts for the rest
  const bodyText = isFeature
    ? formatContent(article.content)
    : formatContent(article.excerpt);

  const dropCapClass = isFeature ? 'drop-cap ' : '';
  const spanClass = isFeature ? 'span-all article-feature ' : '';

  let finalBodyHtml = bodyText;
  if (isFeature) {
    finalBodyHtml = bodyText.replace('<p>', `<p class="${dropCapClass}">`);
  }

  return `
  <div class="article ${spanClass}">
    <h2 class="headline-main">${article.title}</h2>
    ${article.excerpt && isFeature ? `<h3 class="headline-sub">${article.excerpt}</h3>` : ''}
    <div class="byline">By ${article.author} | ${article.category}</div>
    ${finalBodyHtml}
  </div>
  `;
}).join('\n');


// 2. Map Campaigns (from campaigns.js) to a specific "Campaign Trail" section
const campaignsHtml = campaigns.map(camp => {
  return `
    <div class="campaign-block">
        <h4>${camp.name} (${camp.party.charAt(0)})</h4>
        <div class="campaign-office">${camp.office} - ${camp.state}</div>
        <p><strong>Status:</strong> ${camp.realTimeStatus}</p>
        <p>${camp.bio}</p>
    </div>
    `;
}).join('\n');


// 3. Mock Advertisements 
// (We see pricing for $35/issue in setup-ads.cjs, so let's make realistic newspaper blocks for them)
const adsHtml = `
  <div class="ad-block span-2">
    <div class="ad-border">
        <div class="ad-content">
            <div class="ad-headline">WANTED: LOCAL WRITERS</div>
            <p>Common Sense 250 is looking for passionate voices in New England to cover local civics. <br>Inquire within.</p>
        </div>
    </div>
  </div>
  <div class="ad-block span-3" style="background-color: cmyk(0,0,0,1); color: white;">
    <div class="ad-border" style="border: 2px solid white;">
        <div class="ad-content">
            <div class="ad-headline" style="color: cmyk(0,1,1,0);">YOUR AD HERE</div>
            <p>Reach thousands of engaged citizens across New England.<br>Starting at $35/issue.</p>
        </div>
    </div>
  </div>
`;


const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* 
      PRODUCTION PRINT SETTINGS
      2-Color setup: Black + Accent Red
      Size: 10" x 10" EXACT
    */
    @page {
      size: 10in 10in; 
      margin: 0.5in; 
      marks: crop;
      bleed: 0.125in;
      prince-pdf-output-intent: url("USWebCoatedSWOP.icc");
    }

    /* GLOBAL RESET & TYPOGRAPHY */
    * { box-sizing: border-box; }
    body {
      font-family: "Times New Roman", Times, serif;
      margin: 0;
      padding: 0;
      color: cmyk(0, 0, 0, 1);
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
      margin-bottom: 0.2in;
    }
    .masthead h1 {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 68pt; 
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
      margin-top: 5px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      text-transform: uppercase;
    }

    /* TYPOGRAPHY COMPONENTS */
    .headline-main {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 20pt; 
      font-weight: 800;
      line-height: 0.95;
      margin: 0 0 5px 0;
      color: cmyk(0, 0, 0, 1);
      /* Prevent headlines from being stranded at the bottom of a column */
      page-break-after: avoid; 
    }

    .article-feature .headline-main {
      font-size: 34pt;
      color: cmyk(0, 1, 1, 0); /* Pure Spot Red */
      line-height: 0.9;
      page-break-after: avoid;
    }

    .headline-sub {
      font-size: 13pt;
      font-weight: normal;
      font-style: italic;
      line-height: 1.1;
      margin: 0 0 10px 0;
      color: cmyk(0, 0, 0, 1);
      page-break-after: avoid;
    }

    .byline {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid cmyk(0,0,0,0.2);
    }

    /* BODY COPY */
    p {
      font-size: 8pt;
      line-height: 1.25; /* Critical for preventing ink spread (dot gain) merging lines */
      text-align: justify;
      text-align-last: left; /* Prevent awkward gaps on the final line of a justified paragraph */
      margin: 0;
      text-indent: 1em;
      orphans: 2; /* Ensure at least 2 lines at the bottom of a column */
      widows: 2;  /* Ensure at least 2 lines at the top of a column */
    }
    p:first-of-type {
      text-indent: 0;
    }

    .drop-cap:first-letter {
      float: left;
      font-size: 40pt;
      line-height: 0.8;
      padding-top: 4px;
      padding-right: 8px;
      padding-left: 3px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 800;
      color: cmyk(0, 1, 1, 0); /* Accent Color */
    }

    /* ARTICLES/BLOCKS */
    .article {
      margin-bottom: 0.15in;
      page-break-inside: avoid;
    }
    .article-feature {
        border-bottom: 3px solid cmyk(0, 0, 0, 1);
        padding-bottom: 0.15in;
        margin-bottom: 0.15in;
    }

    /* CAMPAIGN SECTION */
    .campaign-section {
        column-span: all;
        border-top: 3px solid cmyk(0,0,0,1);
        padding-top: 0.1in;
        margin-top: 0.15in;
    }
    .campaign-section h2 {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-weight: 800;
        text-transform: uppercase;
        color: cmyk(0, 1, 1, 0);
        margin: 0 0 10px 0;
        text-align: center;
        column-span: all;
    }
    .campaign-block {
        break-inside: avoid;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed cmyk(0,0,0,0.5);
    }
    .campaign-block h4 { margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase; }
    .campaign-office { font-style: italic; font-size: 8pt; margin-bottom: 3px; color: cmyk(0,0,0,0.7); }
    .campaign-block p {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 7.5pt;
        text-indent: 0;
        margin-bottom: 3px;
    }

    /* ADVERTISEMENTS */
    .ad-container {
        column-span: all;
        margin-top: 0.2in;
        border-top: 2px solid cmyk(0,0,0,1);
        padding-top: 0.15in;
        display: flex; 
        gap: 0.25in;
        page-break-inside: avoid;
    }
    .ad-block { box-sizing: border-box; }
    .ad-block.span-2 { width: calc(40% - 0.125in); }
    .ad-block.span-3 { width: calc(60% - 0.125in); }
    
    .ad-border {
        border: 2px solid cmyk(0,0,0,1);
        padding: 4px;
        height: 100%;
    }
    .ad-content {
        border: 1px solid cmyk(0,0,0,1);
        padding: 10px;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .ad-headline {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 16pt;
        font-weight: 900;
        margin-bottom: 8px;
    }
    .ad-content p {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        text-align: center;
        text-indent: 0;
        font-size: 8pt;
    }

  </style>
</head>
<body>

  <!-- MASTHEAD -->
  <div class="masthead">
    <h1>Common Sense</h1>
    <div class="dateline">
      <span>Vol. 1, No. 1</span>
      <span>Printed in the USA</span>
      <span>Tuesday, February 24, 2026</span>
    </div>
  </div>

  <!-- INJECT ARTICLES -->
  ${articlesHtml}

  <!-- INJECT CAMPAIGNS -->
  <div class="campaign-section" style="page-break-inside: avoid;">
      <h2>On The Trail</h2>
      <div style="columns: 5; column-gap: 0.25in;">
        ${campaignsHtml}
      </div>
  </div>
  
  <!-- INJECT ADVERTISEMENTS -->
  <div class="ad-container" style="page-break-before: always; page-break-inside: avoid;">
    ${adsHtml}
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('Sending final production request (2-Color 10x10) to DocRaptor...');

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
        name: 'common-sense-final.pdf',
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
    fs.writeFileSync(path.join(__dirname, '..', 'common-sense-final.pdf'), Buffer.from(buffer));
    console.log('Success! Saved to common-sense-final.pdf');
  } catch (error) {
    console.error('Error:', error);
  }
}

generatePDF();

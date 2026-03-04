import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { articlesV2 } from '../src/data/new-articles.js';
import { campaigns } from '../src/data/campaigns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '6Z2Pads--raSgGE1ayd3';

// ----------------------------------------
// DATA MAPPING
// ----------------------------------------
const getArticle = (id) => articlesV2.find(a => a.id === id);

// Formatting Helper
function formatContent(content) {
    if (!content) return '';
    return content.split('\n\n').map(p => `<p>${p}</p>`).join('');
}

function renderArticle(article, part = 'full', isFeature = false, isContinued = false) {
    const text = part === 'part1' ? article.contentPart1 : (part === 'part2' ? article.contentPart2 : article.contentFull);
    const bodyText = formatContent(text);

    const dropCapClass = isFeature && !isContinued ? 'drop-cap ' : '';
    const spanClass = isFeature ? 'span-all article-feature ' : '';

    let finalBodyHtml = bodyText;
    if (isFeature && !isContinued) {
        finalBodyHtml = bodyText.replace('<p>', `<p class="${dropCapClass}">`);
    }

    const titleHtml = isContinued
        ? `<h2 class="headline-continued">${article.title} (Continued from Page ${isContinued})</h2>`
        : `<h2 class="headline-main">${article.title}</h2>`;

    const bylineHtml = isContinued ? '' : `<div class="byline">By ${article.author} | ${article.category}</div>`;
    const excerptHtml = (article.excerpt && isFeature && !isContinued) ? `<h3 class="headline-sub">${article.excerpt}</h3>` : '';

    return `
    <div class="article ${spanClass}">
        ${titleHtml}
        ${excerptHtml}
        ${bylineHtml}
        ${finalBodyHtml}
    </div>
    `;
}

// Advertisements
const getRandomAdHtml = (sizeClass) => `
    <div class="ad-block ${sizeClass}" style="background-color: cmyk(0,0,0,0.05); text-align: center; border: 1px dotted cmyk(0,0,0,1); padding: 15px;">
        <strong>ADVERTISEMENT PLACEHOLDER</strong><br>
        Contact us at $35/issue
    </div>
`;

// Campaigns Section
const campaignsHtml = `
    <div class="campaign-section" style="border-top: 3px solid cmyk(0,0,0,1); padding-top: 0.1in; margin-top: 0.15in;">
        <h2 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 800; text-transform: uppercase; color: cmyk(0, 1, 1, 0); text-align: center; margin-bottom: 5px;">On The Trail</h2>
        <div style="columns: 5; column-gap: 0.25in; text-align: left;">
            ${campaigns.map(camp => `
                <div class="campaign-block" style="break-inside: avoid; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed cmyk(0,0,0,0.5);">
                    <h4 style="margin: 0; font-size: 9pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${camp.name} (${camp.party.charAt(0)})</h4>
                    <div style="font-size: 7.5pt; font-style: italic; color: cmyk(0,0,0,0.7); margin-bottom: 3px;">${camp.office} - ${camp.state}</div>
                    <p style="font-size: 6.5pt; margin-bottom: 3px; text-indent: 0;"><strong>Status:</strong> ${camp.realTimeStatus}</p>
                    <p style="font-size: 6.5pt; text-indent: 0;">${camp.bio}</p>
                </div>
            `).join('')}
        </div>
    </div>
`;

// ----------------------------------------
// PAGE GENERATION
// ----------------------------------------
const pages = [
    // Page 1
    `
        <!-- MASTHEAD -->
        <div class="masthead">
            <h1>Common Sense</h1>
            <div class="dateline">
                <span>Vol. 1, No. 1</span>
                <span>Printed in the USA</span>
                <span>Tuesday, March 3, 2026</span>
            </div>
        </div>
        <div class="page-content">
            ${renderArticle(getArticle('girls-sports'), 'part1', true)}
            ${renderArticle(getArticle('conservatarian'), 'full', false)}
        </div>
    `,
    // Page 2
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('patriot-way'), 'full', true)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
            ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 3
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('ice-deportations'), 'part1', true)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 4 (Girls Sports cont'd)
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('girls-sports'), 'part2', false, '1')}
            ${renderArticle(getArticle('town-hall'), 'full', false)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 5
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('axe-tax'), 'full', true)}
            ${renderArticle(getArticle('civics'), 'full', false)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 6 (ICE Dep cont'd)
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('ice-deportations'), 'part2', false, '3')}
            ${renderArticle(getArticle('tariffs'), 'full', false)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 7
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('health-insurance'), 'full', true)}
        </div>
        <div class="ad-container" style="border-top: 2px solid cmyk(0,0,0,1); padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 8 (Back Page)
    `
        <div class="page-content" style="height: 5in;">
            ${renderArticle(getArticle('social-security'), 'full', true)}
        </div>
        ${campaignsHtml}
    `
];

const pagesHtml = pages.map((p, index) => '<div class="page-wrapper" id="page-' + (index + 1) + '">' + p + '</div>').join('\\n');

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* PRODUCTION PRINT SETTINGS */
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
    }

    .page-wrapper {
       width: 9in;
       page-break-after: always;
       position: relative;
    }
    .page-wrapper:last-child {
       page-break-after: avoid;
    }
    .page-content {
       columns: 5;
       column-gap: 0.25in;
       height: 100%;
    }

    /* MASTHEAD */
    .masthead {
      text-align: center;
      margin-bottom: 0.2in;
      height: 1.5in;
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
      font-size: 16pt; 
      font-weight: 800;
      line-height: 0.95;
      margin: 0 0 4px 0;
      color: cmyk(0, 0, 0, 1);
    }
    .article-feature .headline-main {
      font-size: 26pt;
      color: cmyk(0, 1, 1, 0); 
      line-height: 0.9;
    }
    .headline-continued {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 11pt; 
      font-weight: 800;
      margin: 0 0 4px 0;
      color: cmyk(0, 0, 0, 1);
      border-bottom: 1px solid cmyk(0,0,0,1);
      padding-bottom: 3px;
      margin-bottom: 6px;
    }

    .headline-sub {
      font-size: 11pt;
      font-weight: normal;
      font-style: italic;
      line-height: 1.1;
      margin: 0 0 6px 0;
      color: cmyk(0, 0, 0, 1);
    }
    .byline {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 6.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 6px;
      padding-bottom: 3px;
      border-bottom: 1px solid cmyk(0,0,0,0.2);
    }

    /* BODY COPY */
    p {
      font-size: 7.2pt;
      line-height: 1.15; 
      text-align: justify;
      margin: 0;
      text-indent: 1em;
      orphans: 2; 
      widows: 2;  
    }
    p:first-of-type {
      text-indent: 0;
    }
    .drop-cap:first-letter {
      float: left;
      font-size: 30pt;
      line-height: 0.8;
      padding-top: 2px;
      padding-right: 6px;
      padding-left: 2px;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 800;
      color: cmyk(0, 1, 1, 0); 
    }

    /* ARTICLES/BLOCKS */
    .article {
      margin-bottom: 0.1in;
    }
    .article-feature {
        border-bottom: 2px solid cmyk(0, 0, 0, 1);
        padding-bottom: 0.1in;
        margin-bottom: 0.1in;
    }

    /* ADVERTISEMENTS */
    .ad-container { margin-top: 0.2in; }
    .ad-block { box-sizing: border-box; }
    
    .campaign-block {
        break-inside: avoid;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed cmyk(0,0,0,0.5);
    }
    .campaign-block h4 { margin: 0; font-size: 10pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }

  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>
`;


async function generatePDF() {
    console.log('Sending final 8-page production request to DocRaptor...');

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
                name: 'newspaper-8page.pdf',
                document_type: 'pdf',
                prince_options: {
                    profile: 'PDF/X-1a:2001'
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
        fs.writeFileSync(path.join(__dirname, '..', 'newspaper-8page.pdf'), Buffer.from(buffer));
        console.log('Success! Saved to newspaper-8page.pdf');
    } catch (error) {
        console.error('Error:', error);
    }
}

fs.writeFileSync(path.join(__dirname, '..', 'newspaper-8page.html'), htmlContent);
generatePDF();

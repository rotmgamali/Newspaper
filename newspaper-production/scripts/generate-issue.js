import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Data imports
import { articlesV2 as articles } from '../content/2026-03-articles.js';
import { campaigns } from '../../src/data/campaigns.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '6Z2Pads--raSgGE1ayd3';
const MONTH = 'March';
const YEAR = '2026';

console.log(`Starting generation for ${MONTH} ${YEAR}...`);

// Read CSS files
const colorsCss = fs.readFileSync(path.join(__dirname, '../styles/colors.css'), 'utf8');
const typographyCss = fs.readFileSync(path.join(__dirname, '../styles/typography.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(__dirname, '../styles/layout.css'), 'utf8');

// Read Template
let templateHtml = fs.readFileSync(path.join(__dirname, '../templates/newspaper.html'), 'utf8');

// ----------------------------------------
// DATA MAPPING
// ----------------------------------------
const getArticle = (id) => articles.find(a => a.id === id);

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
    <div class="ad-block ${sizeClass}">
        <strong>ADVERTISEMENT PLACEHOLDER</strong><br>
        Contact us at $35/issue
    </div>
`;

// Campaigns Section
const campaignsHtml = `
    <div class="campaign-section border-top-heavy" style="padding-top: 0.1in; margin-top: 0.15in;">
        <h2 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 800; text-transform: uppercase; color: var(--accent-red); text-align: center; margin-bottom: 5px;">On The Trail</h2>
        <div style="columns: 5; column-gap: 0.25in; text-align: left;">
            ${campaigns.map(camp => `
                <div class="campaign-block border-dashed">
                    <h4 style="margin: 0; font-size: 9pt; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">${camp.name} (${camp.party.charAt(0)})</h4>
                    <div style="font-size: 7.5pt; font-style: italic; color: var(--text-dark); opacity: 0.7; margin-bottom: 3px;">${camp.office} - ${camp.state}</div>
                    <p style="font-size: 6.5pt; margin-bottom: 3px; text-indent: 0;"><strong>Status:</strong> ${camp.realTimeStatus}</p>
                    <p style="font-size: 6.5pt; text-indent: 0;">${camp.bio}</p>
                </div>
            `).join('')}
        </div>
    </div>
`;

const pages = [
    // Page 1
    `
        <!-- MASTHEAD -->
        <div class="masthead">
            <h1>Common Sense</h1>
            <div class="dateline">
                <span>Vol. 1, No. 1</span>
                <span>Printed in the USA</span>
                <span>Tuesday, ${MONTH} 3, ${YEAR}</span>
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
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
            ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 3
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('ice-deportations'), 'part1', true)}
        </div>
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 4
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('girls-sports'), 'part2', false, '1')}
            ${renderArticle(getArticle('town-hall'), 'full', false)}
        </div>
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 5
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('axe-tax'), 'full', true)}
            ${renderArticle(getArticle('civics'), 'full', false)}
        </div>
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 6
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('ice-deportations'), 'part2', false, '3')}
            ${renderArticle(getArticle('tariffs'), 'full', false)}
        </div>
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
             ${getRandomAdHtml('span-all')}
        </div>
    `,
    // Page 7
    `
        <div class="page-content" style="height: 7in;">
            ${renderArticle(getArticle('health-insurance'), 'full', true)}
        </div>
        <div class="ad-container border-top-heavy" style="padding-top: 10px;">
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

const pagesHtml = pages.map((p, index) => '<div class="page-wrapper" id="page-' + (index + 1) + '">' + p + '</div>').join('\n');

// Populate template
templateHtml = templateHtml
    .replace('{{MONTH}}', MONTH)
    .replace('{{YEAR}}', YEAR)
    .replace('{{COLORS_CSS}}', colorsCss)
    .replace('{{TYPOGRAPHY_CSS}}', typographyCss)
    .replace('{{LAYOUT_CSS}}', layoutCss)
    .replace('{{PAGES_HTML}}', pagesHtml);

const outputHtmlPath = path.join(__dirname, '../output', `newspaper-${MONTH}-${YEAR}.html`);
const outputPdfPath = path.join(__dirname, '../output', `newspaper-${MONTH}-${YEAR}.pdf`);

fs.writeFileSync(outputHtmlPath, templateHtml);
console.log('HTML intermediate saved successfully.');

async function generatePDF() {
    console.log('Sending print request to DocRaptor API...');

    try {
        const response = await fetch('https://docraptor.com/docs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(API_KEY + ':').toString('base64'),
            },
            body: JSON.stringify({
                test: true,
                document_content: templateHtml,
                name: `newspaper-${MONTH}-${YEAR}.pdf`,
                document_type: 'pdf',
                prince_options: {
                    media: 'print',
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
        fs.writeFileSync(outputPdfPath, Buffer.from(buffer));
        console.log(`Success! Expected output saved to ${outputPdfPath}`);
    } catch (error) {
        console.error('Error fetching PDF:', error);
    }
}

generatePDF();

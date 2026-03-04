import fs from 'fs';

const API_KEY = '6Z2Pads--raSgGE1ayd3';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* 
      PRODUCTION PRINT SETTINGS
      2-Color setup: 
      - Black (cmyk(0,0,0,1))
      - Accent Red (cmyk(0,1,1,0))
    */
    @page {
      size: 11in 17in; /* Standard Tabloid */
      margin: 0.5in;
      marks: crop;
      bleed: 0.125in;
      /* Define the output intent for print-ready CMYK */
      prince-pdf-output-intent: url("USWebCoatedSWOP.icc");
    }

    /* GLOBAL RESET & TYPOGRAPHY */
    * { box-sizing: border-sizing; }
    body {
      font-family: "Times New Roman", Times, serif;
      margin: 0;
      padding: 0;
      color: cmyk(0, 0, 0, 1); /* Pure Black */
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
    }

    /* TYPOGRAPHY COMPONENTS */
    .headline-main {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 42pt;
      font-weight: 800;
      line-height: 0.95;
      margin: 0 0 10px 0;
      /* 2-Color Accent Implementation */
      color: cmyk(0, 1, 1, 0); /* Pure Red */
    }

    .headline-sub {
      font-size: 24pt;
      font-weight: normal;
      font-style: italic;
      line-height: 1.1;
      margin: 0 0 15px 0;
      color: cmyk(0, 0, 0, 1);
    }

    .byline {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    /* BODY COPY */
    p {
      font-size: 9.5pt;
      line-height: 1.25;
      text-align: justify;
      margin: 0;
      text-indent: 1em;
    }
    p:first-of-type {
      text-indent: 0; /* Standard newspaper style: no indent on first para */
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
      color: cmyk(0, 1, 1, 0); /* Accent Color */
    }

    /* IMAGETTES / MEDIA */
    .photo-placeholder {
      width: 100%;
      height: 250px;
      background-color: cmyk(0, 0, 0, 0.1);
      border: 1px solid cmyk(0, 0, 0, 1);
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-caption {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 8pt;
      line-height: 1.2;
      margin-bottom: 15px;
    }

    /* ARTICLES/BLOCKS */
    .article {
      margin-bottom: 0.25in;
    }
  </style>
</head>
<body>

  <!-- MASTHEAD (Spans all columns) -->
  <div class="masthead">
    <h1>Common Sense</h1>
    <div class="dateline">
      <span>Vol. 1, No. 1</span>
      <span>Printed in the United States</span>
      <span>Tuesday, February 24, 2026</span>
    </div>
  </div>

  <!-- LEAD STORY -->
  <div class="article span-all">
    <h2 class="headline-main">A RETURN TO THE PRINTING PRESS</h2>
    <h3 class="headline-sub">How classic typography and strictly rigid column grids are making a physical comeback in the digital era.</h3>
    <div class="byline">By The Editors</div>
    
    <p class="drop-cap">The visual language of the newspaper—the dense columns of justified text, the hierarchical arrangement of bold headlines, the crisp delineation of rules and borders—was forged over centuries of mechanical constraint. Moving lead type into heavy chases mandated a strict, unyielding grid structure.</p>
    <p>In this production test, we utilize CSS Paged Media specifications to recreate those rigid physical parameters in a completely automated workflow. By defining standard broadsheet or tabloid dimensions—in this case, 11 by 17 inches—and declaring an explicit five-column layout, the styling engine forces the digital content into an inherently structured, print-ready format.</p>
    <p>Furthermore, managing the separation of colors is paramount for a professional commercial printer. Standard consumer software routinely exports documents in RGB (Red, Green, Blue), which looks vibrant on illuminated screens but translates poorly to offset printing presses. Here, we have strictly defined all colors using the CMYK model.</p>
    <p>We are employing a classic two-color production process. The vast majority of the text, borders, and photographic halftones are rendered in pure black ink (K: 100%). However, strategically deployed accents—such as the massive lead headline above and the stylized drop caps—are rendered in a distinct spot color equivalent, mixed purely from Cyan and Magenta.</p>
  </div>

  <!-- SECONDARY STORIES -->
  <div class="article">
    <div class="photo-placeholder">
      [ PHOTO GRAPHIC AREA ]
    </div>
    <div class="photo-caption">Fig 1. High-contrast, monochromatic halftone imagery is preferred for absorbent newsprint stock.</div>
  </div>

  <div class="article">
    <h2 class="headline-sub" style="font-size: 18pt; font-style: normal; font-weight: bold; font-family: sans-serif;">Strict Adherence to Margin</h2>
    <p>Because web presses operate at tremendous speeds, paper is constantly shifting on the rollers. Margin tolerances must be observed. The half-inch border defined in our layout provides a safe "trim" and "gripper" area for the machinery.</p>
    <p>Failure to respect these physical boundaries inevitably results in clipped text along the edges of the final produced sheets.</p>
  </div>

  <div class="article">
    <h2 class="headline-sub" style="font-size: 18pt; font-style: normal; font-weight: bold; font-family: sans-serif;">The CMYK Output Intent</h2>
    <p>Finally, producing a <code>PDF/X-1a</code> compliant file guarantees the print shop receives a document with embedded fonts, flattened transparencies, and locked color profiles. This dramatically reduces the likelihood of pre-flight errors before plating.</p>
  </div>

</body>
</html>
`;

async function generatePDF() {
    console.log('Sending production request to DocRaptor...');

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
                name: 'common-sense-production.pdf',
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
        // Overwrite existing file
        fs.writeFileSync('common-sense-production.pdf', Buffer.from(buffer));
        console.log('Success! Saved to common-sense-production.pdf');
    } catch (error) {
        console.error('Error:', error);
    }
}

generatePDF();

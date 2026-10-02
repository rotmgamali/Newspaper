/**
 * Common Sense 250 — Vol. I, No. 1 — the modular tabloid edition.
 *
 * Eight pages. The publisher asked for "an 8-page layout with 4 to 10 ad
 * blocks" (24 Aug), and said on 13 Sep that with four or five good video
 * articles "we might flesh out 8 pages"; seven came back. Everything here is
 * his, a contributor he named (Sen. Libby, Kemler Samuels), or his paper's
 * statement of purpose.
 *
 * Left out, deliberately:
 *  - "Protect Girls Sports": withdrawn by him, 24 Aug.
 *  - The Town Hall, Axe the Tax, Restoring Civics and The Patriot Way briefs:
 *    their bylines ("Sarah Miller", "Historical Archive", "Education Board",
 *    "Sports Desk") belong to nobody in the correspondence. The real material
 *    behind two of them is his own Admirable New Englanders list, page 4.
 *  - The New England candidates directory: unverified and partly out of date.
 *
 * Every module is placed on the four-column grid by `areas`; `rows` sets the
 * row heights. compose.mjs renders it; check-edition.py proves nothing is cut.
 */
export const edition = {
  meta: {
    slug: 'common-sense-250-vol1-no1-tabloid',
    volume: 'I', number: '1', variant: '01',
    date: 'October 1, 2026',
    place: 'Vernon, Connecticut',
    frequency: 'Published quarterly',
    price: 2.5,
    web: 'commonsense250.news',
    issn: '3144-458X',
  },

  pages: [
    // 1 ---------------------------------------------------------------------------
    {
      masthead: true,
      areas: ['lead lead lead side'],
      rows: ['1fr'],
      modules: [
        { type: 'article', area: 'lead', id: 'no-draft', span: 3, size: 'xl', dropcap: true,
          kicker: 'Liberty & Politics', art: 'no-draft', artHeight: 2.8, artPos: 'center 58%',
          caption: "Volunteers, not conscripts: Ethan Allen's militia takes Fort Ticonderoga, May 10, 1775." },
        { type: 'stack', area: 'side', items: [
          { type: 'article', id: 'conservatarian', size: 's', art: false, kicker: 'Our Purpose', deck: false, grow: true },
          { type: 'article', id: 'hartford-convention', size: 's', art: 'hartford-convention', artHeight: 1.5,
            kicker: 'Coming in November', deck: false },
        ] },
      ],
    },

    // 2 ---------------------------------------------------------------------------
    {
      areas: ['hea hea tar tar', 'hea hea lib lib'],
      rows: ['1fr', '3.3in'],
      modules: [
        { type: 'article', area: 'hea', id: 'health-insurance', span: 2, size: 'l', artHeight: 2.0, dropcap: true },
        { type: 'article', area: 'tar', id: 'tariffs', span: 2, size: 'm', artHeight: 1.45 },
        { type: 'ad', area: 'lib', key: 'jim-libby' },
      ],
    },

    // 3 ---------------------------------------------------------------------------
    {
      areas: ['ice ice imm imm', 'ice ice wha wha'],
      rows: ['1fr', '3.3in'],
      modules: [
        { type: 'article', area: 'ice', id: 'ice-deportations', span: 2, size: 'l', artHeight: 1.95, dropcap: false },
        { type: 'article', area: 'imm', id: 'immigrant-families', span: 2, size: 'm', artHeight: 2.4 },
        { type: 'ad', area: 'wha', key: 'whalers' },
      ],
    },

    // 4 ---------------------------------------------------------------------------
    {
      areas: ['ane ane ane ane', 'pol pol pol ads'],
      rows: ['9.2in', '1fr'],
      modules: [
        { type: 'ane', area: 'ane', entries: [
          { years: '1775–76', name: 'Ethan Allen', place: 'Connecticut',
            text: "Leads a group of 40 militiamen to invade British-held Fort Ticonderoga, capturing all the fort's defenders by surprise without firing a shot. The 70 cannons captured were transported overland under Henry Knox's leadership and quietly installed on the hilltops surrounding Boston, forcing the British who were occupying Boston to evacuate on March 17, 1776." },
          { years: '1826', name: 'Gridley Bryant', place: 'Massachusetts', art: 'ane-granite-railway', artHeight: 2.3,
            text: 'Constructs the Granite Railway, widely recognized as the first chartered, industrial or commercial line built for business. Its inaugural mission: carrying granite from the quarries to build the Bunker Hill Monument, on the fiftieth anniversary of the battle there.' },
          { years: '1875–76', name: 'Alexander Graham Bell', place: 'Massachusetts', art: 'ane-bell', artHeight: 2.3,
            text: 'Working with Elisha Gray, the transplant from Scotland invents and then patents the telephone.' },
          { years: '1926', name: 'Calvin Coolidge', place: 'Vermont',
            text: 'The Vermont native gives a most-American speech at Arlington for the Presidential Memorial Day address: “As a people we have not sought military glory. Because of our fortunate circumstances, such wars as we have waged have been for the purpose of securing conditions under which peace would be more permanent, liberty would be more secure, and justice would be more certain.”' },
          { years: '1975–76', name: 'Meldrim Thomson', place: 'New Hampshire', art: 'ane-axe-the-tax', artHeight: 2.0,
            text: 'The Governor endorses the motto “Live Free or Die” for every New Hampshire license plate. It fits his long-standing minimalist creed, which appeared most prominently in his “Axe the Tax” platform.' },
          { years: '2025–26', name: 'Drake Maye', place: 'Massachusetts, via North Carolina',
            text: 'Actions speak more than words. The Patriots rebound under Maye after five years in the wilderness.' },
        ] },
        { type: 'article', area: 'pol', id: 'police-masks', span: 3, size: 'm', artHeight: 1.3 },
        { type: 'stack', area: 'ads', items: [
          { type: 'ad', key: 'friendlys', grow: true },
          { type: 'ad', key: 'aldi', grow: true },
        ] },
      ],
    },

    // 5 ---------------------------------------------------------------------------
    {
      areas: ['tea tea hom hom', 'tea tea ivy ivy'],
      rows: ['1fr', '3.3in'],
      modules: [
        { type: 'article', area: 'tea', id: 'teach-to-the-tests', span: 2, size: 'l', art: 'teach-to-the-tests',
          artHeight: 3.0, dropcap: true },
        { type: 'article', area: 'hom', id: 'homelessness-in-connecticut', span: 2, size: 'm', artHeight: 1.35 },
        { type: 'ad', area: 'ivy', key: 'ivy-bound' },
      ],
    },

    // 6 ---------------------------------------------------------------------------
    {
      areas: ['soc soc wel wel', 'soc soc imp imp'],
      rows: ['1fr', '3.3in'],
      modules: [
        { type: 'article', area: 'soc', id: 'social-security', span: 2, size: 'l', artHeight: 2.3, dropcap: true },
        { type: 'article', area: 'wel', id: 'welfare-for-whom', span: 2, size: 'm', artHeight: 2.3 },
        { type: 'ad', area: 'imp', key: 'impact-health' },
      ],
    },

    // 7 ---------------------------------------------------------------------------
    {
      areas: ['oth oth cou cou', 'oth oth w4g w4g', 'ba1 ba1 ba2 ba2'],
      rows: ['1fr', '2.6in', '3.0in'],
      modules: [
        { type: 'article', area: 'oth', id: 'other-half-of-affordability', span: 2, size: 'l', artHeight: 2.1, dropcap: true },
        { type: 'article', area: 'cou', id: 'come-on-up', span: 2, size: 'm', artHeight: 2.8 },
        { type: 'ad', area: 'w4g', key: 'web4guru' },
        { type: 'ad', area: 'ba1', key: 'bahamas-villas' },
        { type: 'ad', area: 'ba2', key: 'bahamas-complex' },
      ],
    },

    // 8 ---------------------------------------------------------------------------
    {
      areas: ['wal wal wal sid', 'col col col col'],
      rows: ['1fr', 'auto'],
      modules: [
        { type: 'article', area: 'wal', id: 'matt-walsh-reply', span: 3, size: 'l', artHeight: 2.0, dropcap: true },
        { type: 'stack', area: 'sid', items: [
          { type: 'box', class: 'write-back', title: 'Write Back', grow: true, html:
            '<p class="big">Every article in these pages invites a reply.</p>' +
            '<p>Disagree with something you read here? Write to us. The best replies run in the next issue, printed beside the article they answer, so readers see both sides of the argument together.</p>' +
            '<p>We will print a reply from anyone named or argued against in these pages.</p>' +
            '<p><b>andrew@web4guru.com</b></p>' },
        ] },
        { type: 'colophon', area: 'col' },
      ],
    },
  ],
};

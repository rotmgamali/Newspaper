/**
 * Common Sense 250 — Vol. I, No. 1 — the modular tabloid edition.
 *
 * Eight pages. The publisher asked for "an 8-page layout with 4 to 10 ad
 * blocks" (24 Aug), and said on 13 Sep that with four or five good video
 * articles "we might flesh out 8 pages"; seven came back. Everything here is
 * his, a contributor he named (Sen. Libby, Kemler Samuels), or his paper's
 * statement of purpose.
 *
 * Advertisements are the publisher's list of 2026-10-02: Impact Health, Ivy
 * Bound, SerenitySpaces (two), Jamie's (Columbine Inn and Powder Mountain West),
 * Aspire Academy for Schools, Whalers on page 8, and "Your Business Here" at
 * 1/8 and 1/16. Friendly's, Aldi, the Libby ad and the Web4Guru house ad are
 * off his list and out of the paper.
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
    // Publisher, 2026-10-04: "Hartford Connecticut and October 2026 (not Oct 1)".
    date: 'October 2026',
    place: 'Hartford, Connecticut',
    motto: 'Civics · Opinions · Ethics',
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
        // Publisher, 2026-10-04: a two-column illustration of a frightened young
        // conscript held at gunpoint by his officer; Ticonderoga smaller, two
        // columns, bottom right, keeping its caption.
        { type: 'feature', area: 'lead', id: 'no-draft', size: 'xl', dropcap: true, kicker: 'Liberty & Politics', deck: false,
          topArt: { name: 'no-draft-conscript', height: 2.8,
                    caption: 'The draft does not ask. Illustration for Common Sense 250.' },
          bottomArt: { name: 'no-draft', height: 1.75, pos: 'center 55%',
                       caption: "Volunteers, not conscripts: Ethan Allen's militia takes Fort Ticonderoga, May 10, 1775." } },
        // Right column, publisher 2026-10-09: his revised Our Purpose (a size
        // smaller to make room, as he allowed), a starred box for students,
        // and the Convention now "Coming in 2027".
        { type: 'stack', area: 'side', items: [
          { type: 'article', id: 'conservatarian', size: 's', art: false, kicker: 'Our Purpose', deck: false, grow: true, italic: true, class: 'small' },
          { type: 'box', class: 'stars', html:
            '<p class="byob">Old + new Media Managed by the YOUNGER or the BETTER (bYoB). Hear here!</p>' +
            '<p class="byob-url">commonsense250.news/join</p>' +
            '<p>CS 250 welcomes students, paid and volunteer. See p3.</p>' },
          { type: 'article', id: 'hartford-convention', size: 's', art: 'hartford-convention', artHeight: 1.2,
            kicker: 'Coming in 2027', deck: false },
        ] },
      ],
    },

    // 2 ---------------------------------------------------------------------------
    {
      areas: ['hea hea tar tar', 'hea hea lib lib'],
      rows: ['1fr', '3.3in'],
      modules: [
        { type: 'article', area: 'hea', id: 'health-insurance', span: 2, size: 'l', dropcap: true,
          caption: 'An emergency-room team at work, 2025. U.S. Air Force photo.', artHeight: 1.8, artPos: 'center 40%' },
        { type: 'article', area: 'tar', id: 'tariffs', span: 2, size: 'm',
          caption: 'Customs officers inspect imported cargo, Port of New York. U.S. Customs and Border Protection photo.', artHeight: 1.3 },
        { type: 'ad', area: 'lib', key: 'impact-health' },
      ],
    },

    // 3 ---------------------------------------------------------------------------
    {
      areas: ['ice ice imm imm', 'ice ice wha wha'],
      rows: ['1fr', '3.0in'],
      modules: [
        { type: 'article', area: 'ice', id: 'ice-deportations', span: 2, size: 'l', dropcap: false,
          caption: 'Federal agents on an ICE enforcement operation in New York, January 2025. ICE photo.', artHeight: 1.75, artPos: 'center 40%' },
        // Publisher, 2026-10-09: fill the space at the foot of this column with
        // a box for students — then (a newspaper held up to a crowd) and now
        // (screens) — and his own wording.
        { type: 'stack', area: 'imm', items: [
          { type: 'article', id: 'immigrant-families', span: 2, size: 'm', grow: true,
            caption: 'New citizens take the oath, 2023. National Park Service photo.', artHeight: 1.45, artPos: 'center 55%' },
          { type: 'box', class: 'students', title: 'For Students',
            art: [ { name: 'students-old', height: 1.5, caption: 'Then.' },
                   { name: 'students-new', height: 1.5, caption: 'Now.' } ],
            html:
            '<p class="big">Join CS250. Spread the word.</p>' +
            '<p>Your words, other influential people’s words. Internships, paid and volunteer, are now offered in media, marketing, finance, sales &amp; “influence”.</p>' +
            '<p>CS250 staff collaborate each Friday evening. Join us! Email <b>andrew@web4guru.com</b>.</p>' },
        ] },
        { type: 'ad', area: 'wha', key: 'aspire-schools' },
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
        { type: 'article', area: 'pol', id: 'police-masks', span: 3, size: 'm',
          caption: 'A masked federal agent on an enforcement operation, 2025. Department of Homeland Security photo.', artHeight: 1.15, artPos: 'center 32%' },
        // Jamie Lythgoe's Columbine Inn has the column the publisher held for
        // "Jamie's condos". Her Powder Mountain West listings are on page 8.
        { type: 'stack', area: 'ads', items: [
          { type: 'ad', key: 'columbine-inn', grow: true },
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
        { type: 'article', area: 'hom', id: 'homelessness-in-connecticut', span: 2, size: 'm',
          caption: 'Tents outside Union Station, Washington, 2021. Photo: Elvert Barnes, CC BY-SA 2.0.', artHeight: 1.2 },
        { type: 'ad', area: 'ivy', key: 'ivy-bound' },
      ],
    },

    // 6 ---------------------------------------------------------------------------
    {
      areas: ['soc soc wel wel', 'soc soc imp imp'],
      rows: ['1fr', '3.0in'],
      modules: [
        { type: 'article', area: 'soc', id: 'social-security', span: 2, size: 'l', dropcap: true,
          caption: 'Ben Shahn’s mural in the Social Security Building, Washington, 1940–42.', artHeight: 2.1 },
        { type: 'article', area: 'wel', id: 'welfare-for-whom', span: 2, size: 'm',
          caption: 'A food bank warehouse, 2021. U.S. Department of Agriculture photo.', artHeight: 1.6 },
        { type: 'ad', area: 'imp', key: 'ybh-eighth' },
      ],
    },

    // 7 ---------------------------------------------------------------------------
    {
      areas: ['oth oth cou cou', 'ba1 ba1 ba2 ba2'],
      rows: ['1fr', '2.7in'],
      modules: [
        { type: 'article', area: 'oth', id: 'other-half-of-affordability', span: 2, size: 'm', dropcap: true,
          caption: 'Résumé in hand at a hiring fair, 2023. U.S. Air Force photo.', artHeight: 1.5 },
        { type: 'article', area: 'cou', id: 'come-on-up', span: 2, size: 'm',
          caption: 'Hartford in October. Photo: Quintin Soloviev, CC BY 4.0.', artHeight: 3.85, artPos: 'center 45%' },
        { type: 'ad', area: 'ba1', key: 'bahamas-villas' },
        { type: 'ad', area: 'ba2', key: 'bahamas-complex' },
      ],
    },

    // 8 ---------------------------------------------------------------------------
    {
      areas: ['wal wal wal sid', 'col col col col'],
      rows: ['1fr', 'auto'],
      modules: [
        { type: 'article', area: 'wal', id: 'matt-walsh-reply', span: 3, size: 'l', dropcap: true,
          caption: 'Henry Hintermeister, Foundation of the American Government, 1925.', artHeight: 2.0, artPos: 'center 55%' },
        { type: 'stack', area: 'sid', items: [
          { type: 'box', class: 'write-back', title: 'Write Back', html:
            '<p class="big">Every article in these pages invites a reply.</p>' +
            '<p>Disagree with something you read here? Write to us. The best replies run in the next issue, printed beside the article they answer, so readers see both sides of the argument together.</p>' +
            '<p>We will print a reply from anyone named or argued against in these pages.</p>' +
            '<p><b>andrew@web4guru.com</b></p>' },
          // Publisher, 2026-10-08: "yes, we have space" for Jamie's Powder
          // Mountain West listings. The space is this column: the Whalers ad
          // gives up its empty margins, and the 1/16 "Your Business Here"
          // moves here from page 4, which is now all Columbine Inn.
          { type: 'ad', key: 'whalers', grow: true, class: 'compact', artHeight: 2.0, artPos: 'center 30%' },
          { type: 'ad', key: 'powder-mountain-west' },
          { type: 'ad', key: 'ybh-sixteenth', height: 2.7 },
        ] },
        { type: 'colophon', area: 'col' },
      ],
    },
  ],
};

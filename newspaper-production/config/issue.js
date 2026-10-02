/**
 * The single place where one issue of Common Sense 250 is described.
 *
 * Everything that changes from issue to issue lives here: the date, the edition
 * number, which articles run, and in what order. Producing next month's paper
 * should mean editing this file and adding a content file — not editing the
 * generator.
 */

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------

export const publication = {
  title: 'Common Sense 250',
  fullTitle: 'Common Sense 250',
  tagline: 'Civics · Opinions · History',
  price: 2.5,
  currency: 'USD',
  origin: 'Printed in the USA',

  /**
   * The ISSN for Common Sense 250.
   *
   * An ISSN is the identifier for a SERIAL — a newspaper, magazine or journal.
   * It is not the same thing as a GS1 UPC company prefix, which costs money and
   * is meant for retail products with a fixed identity. Periodicals use an ISSN,
   * and in the United States it is issued FREE OF CHARGE by the U.S. ISSN Center
   * at the Library of Congress.
   *
   *   Apply:  https://www.loc.gov/issn/
   *   Cost:   nothing
   *   Needs:  title, publisher, place of publication, frequency, first issue,
   *           and a sample or mock-up of the front page
   *
   * The ISSN must be issued to the publication's owner, so this application is
   * Mark's to file, not ours. It cannot be bought, generated or borrowed.
   *
   * Once the number arrives, put it here and the barcode becomes real. Until
   * then every barcode this project renders is stamped SPECIMEN so that a
   * placeholder can never be mistaken for a registered number on a press sheet.
   */
  issn: '3144-458X',  // provisional, assigned 2026-09-30 (APPL0008020)

  /** Supplied by the publisher, 2026-09-11. Needed for the ISSN application. */
  publisher: 'Mark Stewart Greenstein',
  publisherAddress: 'PO Box 98, Farmington, CT 06034',
  placeOfPublication: 'Vernon, Connecticut',
  frequency: 'Quarterly',
  firstIssueDate: 'October 1, 2026',
};

// -----------------------------------------------------------------------------
// This issue
// -----------------------------------------------------------------------------

export const issue = {
  volume: 1,
  number: 1,
  /** Two digits, carried inside the barcode so each edition scans distinctly. */
  variant: '01',
  date: 'October 1, 2026',
  contentModule: '../content/2026-09-articles.js',

  /**
   * The eight pages, in order.
   *
   * Each page lists its blocks. A block is either an article — optionally split
   * across pages with `part` and `continuedFrom` — or an advertisement keyed to
   * an entry in lib/ads.js.
   *
   * Page one carries the masthead. Page eight carries the barcode and the
   * candidate directory.
   */
  pages: [
    {
      masthead: true,
      blocks: [
        { article: 'no-draft', feature: true },
        { article: 'conservatarian' },
        { article: 'town-hall' },
      ],
    },
    {
      blocks: [
        { article: 'ice-deportations', feature: true },
        { article: 'teach-to-the-tests', feature: true },
        { article: 'civics' },
      ],
      ads: ['ivy-bound', 'impact-health', 'web4guru'],
    },
    {
      blocks: [
        { article: 'health-insurance', feature: true },
        { article: 'tariffs', feature: true },
        { article: 'hartford-convention' },
      ],
      ads: ['bahamas-villas', 'bahamas-complex'],
    },
    {
      blocks: [
        { article: 'homelessness-in-connecticut', feature: true },
        { article: 'come-on-up', feature: true },
        { article: 'axe-tax' },
        { article: 'patriot-way' },
      ],
      candidates: true,
      colophon: true,
      barcode: true,
    },
  ],
};

// -----------------------------------------------------------------------------
// Press specification
// -----------------------------------------------------------------------------

export const press = {
  /**
   * Standard 11 x 17 tabloid, on the publisher's own spec (2026-09-30): four
   * 2.35in columns across an 11in page. 0.5in margins inside the trim leave
   * exactly 10in, and four 2.35in columns plus three 0.2in gutters is 10in.
   *
   * Until 2026-10-02 this was a 10in square, from a March workflow written
   * when Maine Printing was the printer. No current printer asked for it, and
   * a newsprint press expects a tabloid.
   */
  finished: '11in x 17in',
  /**
   * The amount trimmed off EACH EDGE, which is what prince-trim means.
   * Setting this to the finished size instead produced a 30.5in sheet with
   * the page floating in the middle of it.
   */
  trim: '0.125in',
  pageWidthIn: 11.25,     // finished + bleed both sides
  pageHeightIn: 17.25,
  marginIn: 0.625,        // 0.5in inside the trim
  bleed: '0.125in',
  columns: 4,
  columnGapIn: 0.2,
  profile: 'PDF/X-1a:2001',
  /** Two-tone: process black plus one red. Matches the existing house style. */
  inks: { black: 'cmyk(0, 0, 0, 1)', red: 'cmyk(0, 1, 1, 0)' },
};

export default { publication, issue, press };

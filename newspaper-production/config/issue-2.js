/**
 * Common Sense 250 — Vol. 1, No. 2 (quarterly; January 2027).
 *
 * Built on 2026-09-30 from copy already written and approved, so issue two is
 * not a cold start. On 2026-10-02 the paper moved to an 11 x 17 tabloid and
 * the publisher's rewritten Teach To The Tests and Homelessness went into
 * issue one, so this holds the five remaining pieces across four tabloid
 * pages (a press runs in fours). Page four is open: it wants the Matt Walsh
 * reply plus about 2,000 words of new copy before this can print.
 *
 * NOT placed, pending the publisher: his reply to Matt Walsh. He approved three
 * edits on 24 September but said he may have tweaked his own copy since, so it
 * waits for his version rather than running ours.
 *
 * The ads repeat issue one's. Every one needs the advertiser's say-so for a
 * second run before this prints.
 *
 *   node newspaper-production/scripts/generate-issue.js --issue newspaper-production/config/issue-2.js --html-only
 */
export { publication, press } from './issue.js';

export const issue = {
  volume: 1,
  number: 2,
  variant: '02',
  date: 'January 1, 2027',
  contentModule: '../content/2026-09-articles.js',

  pages: [
    {
      masthead: true,
      blocks: [
        { article: 'social-security', feature: true },
        { article: 'other-half-of-affordability', feature: true },
      ],
    },
    {
      blocks: [{ article: 'welfare-for-whom', feature: true }],
      ads: ['ivy-bound', 'impact-health', 'web4guru'],
    },
    {
      blocks: [
        { article: 'police-masks', feature: true },
        { article: 'immigrant-families', feature: true },
      ],
      ads: ['bahamas-villas', 'bahamas-complex'],
    },
    {
      blocks: [],
      candidates: true,
      colophon: true,
      barcode: true,
    },
  ],
};

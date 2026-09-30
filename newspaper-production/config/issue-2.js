/**
 * Common Sense 250 — Vol. 1, No. 2 (quarterly; January 2027).
 *
 * Built on 2026-09-30 from copy already written and approved, so issue two is
 * not a cold start: the six video pieces that did not fit issue one, and the
 * publisher's Social Security piece from the March set.
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
      blocks: [{ article: 'homelessness-in-connecticut', feature: true }],
    },
    {
      blocks: [{ article: 'social-security', feature: true }],
      ads: ['ivy-bound'],
    },
    {
      blocks: [{ article: 'other-half-of-affordability', feature: true }],
      ads: ['bahamas-villas', 'bahamas-complex'],
    },
    {
      blocks: [{ article: 'teach-to-the-tests', feature: true }],
      ads: ['impact-health'],
    },
    {
      // The immigration piece carries the nationality passage flagged to the
      // publisher, so it runs inside rather than on the front page.
      blocks: [
        { article: 'police-masks', feature: true },
        { article: 'immigrant-families' },
      ],
      ads: ['web4guru'],
    },
    {
      blocks: [{ article: 'welfare-for-whom', feature: true }],
      candidates: true,
      colophon: true,
      barcode: true,
    },
  ],
};

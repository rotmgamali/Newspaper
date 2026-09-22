/**
 * Articles for the web edition.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS FILE NO LONGER HOLDS CONTENT. IT ADAPTS THE PRINT EDITION'S.
 * ─────────────────────────────────────────────────────────────────────────────
 * Until September 2026 the website and the newspaper kept separate copies of
 * the same articles, and they drifted. The publisher withdrew "Protect Girls
 * Sports" from the paper on 10 September; the website went on running it as its
 * lead article for the next twelve days, because nobody had a reason to think
 * the two were connected.
 *
 * So there is now one source of truth — `newspaper-production/content/` — and
 * the website reads from it. Pull an article from the issue and it leaves the
 * site. Add one and it appears. A withdrawal cannot be honoured in one place and
 * missed in the other, because there is only one place.
 *
 * To change what the site shows, change the issue. Not this file.
 */

import { articlesV2 as issueArticles } from '../../newspaper-production/content/2026-09-articles.js';

// Art on hand. Pieces without a match run as typographic cards, which is
// better than bolting an unrelated stock photograph onto an argument.
import townHallImg from '../assets/town_hall.png';
import axeTaxImg from '../assets/axe_tax.png';
import classroomImg from '../assets/classroom.png';
import qbImg from '../assets/drake_maye.png';

const artwork = {
  'town-hall': townHallImg,
  'axe-tax': axeTaxImg,
  'civics': classroomImg,
  'patriot-way': qbImg,
};

/** Print splits long pieces across pages. The web has no pages. */
function fullText(a) {
  if (a.contentFull) return a.contentFull;
  if (a.content) return a.content;
  return [a.contentPart1, a.contentPart2].filter(Boolean).join('\n\n');
}

export const articles = issueArticles.map((a) => ({
  id: a.id,
  title: a.title,
  author: a.author,
  date: a.date,
  category: a.category,
  excerpt: a.excerpt,
  content: fullText(a),
  image: artwork[a.id] || null,
  sourceVideo: a.sourceVideo || null,
}));

export default articles;

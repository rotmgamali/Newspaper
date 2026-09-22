/**
 * Articles edited from the publisher's own videos, September 2026.
 *
 * Source: seven YouTube videos he sent on 2026-09-20, transcribed and edited
 * from speech into prose. His editing instructions were followed: the opening
 * throat-clearing is cut, and the spoken sign-off is removed rather than
 * replaced, because the byline is set by the layout.
 *
 * `cleared` marks what may run. Two pieces are held, with the reason recorded
 * here rather than in anyone's memory, so nobody quietly ships them later.
 */

import { drafts as batch1 } from './drafts-batch1.js';
import { drafts as batch2 } from './drafts-batch2.js';
import { drafts as batch3 } from './drafts-batch3.js';

const all = [...batch1, ...batch2, ...batch3];

/** Held from print pending the publisher's decision. */
export const held = {
  'immigrant-families':
    'Contains a passage ranking immigrants as good or "dubious" by nationality ' +
    '("about 100 percent of Nigerians... dubious from Latin America"). It is his ' +
    'view and his paper, but it would define the publication, and the two shops ' +
    'that agreed to stock it are in Windsor and Newington. Also asserts 30 million ' +
    'illegal immigrants, roughly triple mainstream estimates, and it is the only ' +
    'hard number in the piece.',
  'police-masks':
    'Asserts as fact that federal agents in body armour made arrests of peaceful ' +
    'free-speech protesters, with no incident named. Also characterises a live ' +
    'legislative proposal as barring any mask on duty; the bill text has not been ' +
    'checked against that description.',
};

export const cleared = all.filter((a) => !held[a.id]);
export const articlesV2 = cleared;
export default cleared;

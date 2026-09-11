/**
 * Common Sense 250 — Vol. 1, No. 1 (September 2026)
 *
 * Changed from the March draft at the publisher's instruction:
 *   - "Protect Girls Sports" is withdrawn from this issue.
 *   - "The Coming Draft, 2026" runs in its place as the front-page feature.
 *
 * Articles carried over from the March set are imported rather than copied, so
 * a correction made once is a correction everywhere.
 */

import { articlesV2 as march } from './2026-03-articles.js';

const carriedOver = (id) => {
  const found = march.find((a) => a.id === id);
  if (!found) throw new Error(`No article "${id}" in the March content set.`);
  return found;
};


/**
 * Carried-over pieces that need a joined body for the six-page layout.
 * ice-deportations was written split across two pages. In a six-page paper it
 * runs whole, so a "continued from" line would be a lie.
 */
const joined = (id) => {
  const a = carriedOver(id);
  return { ...a, contentFull: [a.contentPart1, a.contentPart2].filter(Boolean).join('\n\n') };
};

/**
 * The front-page feature, from Mark Greenstein's op-ed of 18 August 2026.
 *
 * Set as two parts: part one takes the front page, part two continues inside.
 * The split falls at the constitutional argument, which is a natural break and
 * leaves the front page ending on a question rather than mid-sentence.
 */
const noDraft = {
  id: 'no-draft',
  title: 'The Coming Draft, 2026',
  author: 'Mark Stewart Greenstein',
  date: 'September 15, 2026',
  category: 'Liberty & Politics',
  excerpt:
    'In less than four months, unless Congress effectively steps in, your 18- to 25-year-old sons and grandsons will be drafted into the Selective Service.',

  contentPart1: [
    'In less than four months, unless Congress effectively steps in, your 18- to 25-year-old sons and grandsons will be drafted into the Selective Service.',

    'December 18 is the still-quiet date upon which our military becomes one step away from sending these young men overseas. Merry Christmas. Until this year, joining the Selective Service has been a voluntary act. Men were encouraged to register, and had some federal benefits denied if they chose not to, but come December 18 they have no choice. The government will use its data-gathering power to profile every 18- to 25-year-old male, possibly for combat. These young men are then one step away from compelled military service.',

    'That is one decision by a suddenly emboldened NSA chief, one decision by a mercurial U.S. President, one decision to introduce ground forces into a stalemated war, or one joint decision by a collaboration of generals following an attack by a Third World dictator wanting to show his machismo against the mighty USA.',

    'Please do not think "my son or grandson will be exempt." That is for the Selective Service to then decide. Come December 18, he is presumably in. The old categories that left many exempt — college, young father, autistic, overweight, flat feet — are not necessarily in play any longer.',

    'Modern warfare, or even peacetime surveillance of our enemies and potential enemies, does not require physical fitness. A college student\'s brainpower can be harnessed by sending him to a bunker in Asia or a ship off the shores of the Persian Gulf. A high school drop-out\'s ability to score highly at video games can be harnessed aboard a rarely surfacing submarine. The premise that a draft selects for the strong is a premise from a war we are no longer fighting.',
  ].join('\n\n'),

  contentPart2: [
    'THE COURT WAS WRONG',

    'A draft is not constitutional. Its philosophical, but non-legal, basis is a collection of Supreme Court cases melded into one during the height of the First World War, called Arver v. United States. The reasoning by nine old men, none of whom were draft-eligible, is ludicrous. The Court\'s opinion invoked the compelled-to-service practices of nations it called "civilized" — including the Ottoman Empire, Austria-Hungary and Germany, against all of whom we were then fighting so that the world "be made safe for democracy."',

    'The opinion asks for guidance from 950 years earlier, brings forth circular reasoning, and asserts without warrant the conditions at the time of the Constitution\'s framing. Perhaps the worst is Justice White\'s constitutional argument, that Congress has the power "for calling forth the militia."',

    'Yes. Those would be state militias, including the men serving in them. Not raw conscripts. The men who served in militias were trained for and pledged to protect their localities and even their states from invasion. Article I took a large step by giving Congress the authority to pull those militiamen into national service. But it certainly did not compel anyone outside a militia into national service.',

    'Justice White\'s first bald assertion is breathtaking: "the mind cannot conceive an army without the men to compose it." American armies were successfully formed without a draft to oust the British in the 1770s, to repel them again in 1812, and to conduct overseas campaigns thereafter. Armies do not need drafts.',

    'White continues: "In England, it is certain that, before the Norman Conquest, the duty of the great militant body of the citizens was recognized and enforceable." Certainly it was — by magistrates, members of Parliament, lords, and the overseers hired to maintain order among serfs and subjects. In other words, conscription was well recognized by exactly the ruling class from which Americans fought a war to separate.',

    'Arver stands with Dred Scott v. Sandford, Buck v. Bell and Korematsu v. United States among the worst rulings on civil liberties in the Court\'s history.',

    'AND COURTS DO NOT MAKE LAW',

    'Most importantly, even a nine-to-nothing Supreme Court decision is not law. Only Congress makes law. It is time our current Congress stepped in. Its members seem oblivious to the military manipulations of this administration and the last. I say oblivious because I am certain a majority in both parties would object strongly to the change now underway.',

    'A DRAFT IS NEITHER LEGAL NOR NECESSARY',

    'There is no need for a draft. If the United States is in military peril, our standing forces and new enlistees will suffice to repel any enemy that lands foot soldiers on our shores. In the one invasion we suffered, from 1812 to 1815, the United States fought Britain to a standstill without drafting a single American. In the three months following the September 11 attacks, more men and women enlisted in the armed forces than at any time since the Second World War.',

    'Nor is a draft especially effective any longer. Military service has become more intricate and specialized. Ask any veteran whether he wants a conscript in his bunk, his trench or his mobile brigade. Being less trained, less eager, and in some cases actively seeking to get out, the draftee is likely to be an unreliable comrade. In modern warfare, where data, analytics, engineering and signals create military might, the best manpower is likely to be people who work for technology firms now and can be paid for that work without being compelled.',

    'Understand also that a president or a party with an incentive to go to war has far more ability to do so when fifteen million men are suddenly at their service.',

    'HOW WE UNDO THIS',

    'Media is probably more powerful than the ballot box. Share this, or something like it, with seven other people, and ask each of them to do the same. Reserve a table for eight at a different restaurant each week and invite friends for the most important civics discussion of our lifetime.',

    'As for the ballot box, every U.S. Congressional seat is in play this autumn. Consider using the write-in line to send a second message; those votes count, and they cumulate with the candidate you mark above so long as your written mark is clear. In Connecticut a write-in candidate must have declared eligibility with the Secretary of the State.',

    'By late November we will have designated a Congress that should have ending the draft in its sights. But since that would require undoing a December 2026 procedure, far better that the current Congress act now. Implore every sitting member to end this Selective Service tyranny, and perhaps the Selective Service altogether. It is easy enough — let each of the six military branches assess recruits its own way.',

    'It is easy to dismiss the scenario. Please put it in perspective. In early 1860, Southern planters were as a class the wealthiest people in the Western world; by the spring of 1861 they were spearheading a war against their benefactors. In early 1910, most considered Germany the most sophisticated nation in Europe; by August 1914 its leaders had led it into a devastating world war. The United States in 2000 was at war with no one; after the attacks of September 2001 we were suddenly in a global war on terror, with our own freedoms diminished by a reactionary PATRIOT Act.',

    'So it can happen here. Let us do one easy task to reassert American freedom and keep us out of an unnecessary war.',
  ].join('\n\n'),
};

/**
 * A short standing notice about the second Hartford Convention, drawn from the
 * same op-ed. It is an event announcement rather than argument, so it runs as a
 * separate block instead of inside the feature.
 */
const hartfordConvention = {
  id: 'hartford-convention',
  title: 'A Second Hartford Convention',
  author: 'Common Sense 250',
  date: 'September 15, 2026',
  category: 'Events',
  excerpt: 'Civic-minded adults and teenagers from the six New England states are invited to Hartford in late November.',
  contentFull: [
    'In late November, civic-minded adults and teenagers from the six New England states are invited to Hartford, Connecticut, where space is being rented to once again discuss our relations with the federal union. It was done before, in 1814.',
    'New England is especially ripe for a concerted statement of republican and democratic values. The region was at the forefront of the freedom of the 1770s, the emancipation drives of the 1850s, and the freedom festivals of the 1960s.',
    'Details will be published here as they are settled. Readers who wish to attend, speak or help with the arrangements should write to the publisher.',
  ].join('\n\n'),
};

export const articlesV2 = [
  noDraft,
  carriedOver('conservatarian'),
  carriedOver('tariffs'),
  carriedOver('health-insurance'),
  carriedOver('social-security'),
  joined('ice-deportations'),
  carriedOver('town-hall'),
  carriedOver('axe-tax'),
  carriedOver('civics'),
  carriedOver('patriot-way'),
  hartfordConvention,
];

/** Withdrawn from this issue at the publisher's instruction, 2026-09. */
export const withdrawn = ['girls-sports'];

export default articlesV2;

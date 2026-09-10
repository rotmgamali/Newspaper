# Producing an issue of Common Sense 250

Two commands. Everything that changes between issues lives in `config/issue.js`.

```bash
npm run issue:html     # assemble the issue, no API call, no cost
npm run issue          # + a watermarked PROOF pdf   (free)
npm run issue:live     # + a clean, printable pdf    (billed to DocRaptor)
npm run barcode        # the retail barcode on its own
npm run test:barcode   # verify the barcode encoder
```

---

## The barcode, and why it costs nothing

Common Sense 250 is a **periodical**, and periodicals are not identified with a
paid GS1 UPC company prefix. They use an **ISSN**, which in the United States is
issued **free of charge** by the U.S. ISSN Center at the Library of Congress.

The ISSN converts mechanically into a scannable EAN-13 under the `977` serials
prefix, and that is what a newsstand scanner reads:

```
977  +  the first 7 digits of the ISSN  +  2 edition digits  +  1 check digit
```

`scripts/lib/ean13.js` does that conversion and draws the symbol. It has no
dependencies and is covered by `scripts/lib/ean13.test.js`, which encodes each
code and then decodes it again with separately written logic — so a wrong symbol
table fails there rather than on a press sheet.

### What is still needed

**The ISSN itself.** It is issued to the publication's owner, so this is the
publisher's application to file. It cannot be bought, generated or borrowed.

- Apply: <https://www.loc.gov/issn/>
- Cost: nothing
- Needs: title, publisher name and address, place of publication, frequency,
  first issue date, and a mock-up of the front page — which
  `npm run issue:html` produces

Until an ISSN is set in `config/issue.js`, every barcode this project renders is
stamped **SPECIMEN** and the run says so. That is deliberate: a placeholder
number must never be mistaken for a registered one.

When the number arrives:

```js
// newspaper-production/config/issue.js
issn: '2831-4174',      // whatever the Library of Congress assigns
```

### A barcode is not a distribution deal

The barcode lets a shop's scanner recognise the paper. It does **not** move money
to the shop. That comes from a consignment or wholesale agreement — what the shop
keeps per copy, who owns unsold copies, and who collects them. No such agreement
exists yet, and without one the barcode sells nothing.

---

## What the generator refuses to do

**It will not quietly hand you a watermarked proof.** DocRaptor's free test mode
stamps every page. Every PDF this project produced before September 2026 was a
test-mode proof, which is why none of them could go to a printer. Test mode is
still the default because leaving it costs money, but the file is named `-PROOF`
and the run says so in plain words.

**It will not print an advertisement for a business that has not agreed to
appear.** Every entry in `lib/ads.js` carries an `authorization` field recording
who agreed and when. Without one, the slot falls back to a house ad and the run
lists what was substituted and why. Running an ad free does not remove the
problem: the harm is the false impression of endorsement, not the money.

**It will not pretend the paper is full.** Every run prints how full each page
is, measured against what the page geometry actually holds at 9pt over four
columns. A short issue shows up as a number before it shows up as a proof.

---

## Type

Body copy is **9pt over four columns**, not 7.2pt over five.

The February 2026 draft used 7.2pt across five columns on a 10-inch page. That
gives a 1.7-inch measure and type smaller than almost any newspaper in print. It
filled the sheet, but it filled it with something the paper's readership cannot
comfortably read. Nine point over a two-inch measure is close to broadsheet
practice.

The consequence is honest and visible: the same copy now fills fewer pages, and
the fill report says by how much.

---

## Layout notes worth keeping

- `.span-all` (`column-span: all`) belongs only to furniture that sits outside
  the column well — masthead, ad rail, candidate directory, colophon. **Never put
  it on an article.** Doing so collapses the four-column grid into one full-width
  block of forty-word lines.
- The masthead needs its `padding-top`. The wordmark is set with a line-height
  below 1, so its cap-height exceeds its line box and the ascenders clip against
  the top of the page without it.
- `templates/newspaper.html` injects three stylesheets at `{{COLORS_CSS}}`,
  `{{TYPOGRAPHY_CSS}}` and `{{LAYOUT_CSS}}`. Those placeholders were once wrapped
  in stray braces, which made every rule a no-op and silently destroyed the
  layout. If a change appears to have no effect at all, check there first.

---

## Files

```
config/issue.js       what runs, where, and under what identity
content/              one file per issue; articles are plain data
lib/ads.js            the ad book, each entry with its authorization
scripts/generate-issue.js   assembles and requests the PDF
styles/               colors, typography, layout — injected in that order
templates/            the page shell and its @page press rules
_superseded/          the pre-September 2026 scripts, kept for reference
output/               generated HTML and PDFs (not committed)
```

The retail barcode lives one level up, in `scripts/lib/ean13.js`, because the web
edition needs it too.

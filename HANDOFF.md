# Common Sense 250 — handover

**For whoever takes over production.** Everything you need is in this repository.
There is nothing in anyone's head that is not written down here.

Last updated 10 September 2026.

---

## 1. What this is

Two things that share one repository:

| | What it is | Lives in |
|---|---|---|
| **The web edition** | A React single-page site at `commonsense250.news` | `src/` |
| **The print edition** | A pipeline that produces a print-ready 10-inch-square PDF | `newspaper-production/` |

The web edition is hosted on **Vercel**, not Railway, and its domain nameservers
are delegated to Vercel. Pushing to `main` deploys it.

The print edition is generated on demand. Nothing is scheduled and nothing runs
on a server.

---

## 2. Running it

```bash
npm install

npm run dev            # the website, locally
npm run build          # production build of the website

npm run issue:html     # assemble the print issue — no API call, no cost
npm run issue          # + a watermarked PROOF pdf   (free)
npm run issue:live     # + a clean, printable pdf    (BILLED to DocRaptor)

npm run barcode        # the retail barcode on its own
npm run test:barcode   # verify the barcode encoder (40 checks)
```

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored.

**`npm run issue:html` is safe to run any time.** It costs nothing, calls
nothing, and prints a full report of what is blocking the issue. Run it first.

---

## 3. Producing an issue

Everything that changes between issues is in **`newspaper-production/config/issue.js`**.
You should not need to edit the generator.

1. **Add the copy.** Create `newspaper-production/content/YYYY-MM-articles.js`.
   Articles are plain objects: `id`, `title`, `author`, `date`, `category`,
   `excerpt`, and either `contentFull` or a `contentPart1`/`contentPart2` pair
   for a piece that jumps across pages. Reuse an article from a previous issue
   by importing it rather than copying it.

2. **Point the config at it** and set the date, volume, number and `variant`
   (the two digits that make each edition's barcode distinct).

3. **Lay out the pages.** Each page lists its blocks in order. A block names an
   article and optionally `feature: true`, `part`, `continuedFrom` and `jumpTo`.
   Pages may also carry `ads`, `candidates`, `colophon` and `barcode`.

4. **Run `npm run issue:html`** and read the report. It tells you how full each
   page is and which advertisements could not run.

5. **Run `npm run issue:live`** when you are ready to send to a printer. That
   call is billed.

---

## 4. Three things the pipeline refuses to do

These are deliberate. Please do not remove them.

### It will not hand you a watermarked proof and call it finished

DocRaptor's free test mode stamps a diagonal "Document doesn't look right?" bar
across every page. **Every PDF this project produced before September 2026 was a
test-mode proof**, which is why none of them could go to a printer, and nobody
noticed for six months. Test mode remains the default because leaving it costs
money, but the file is now named `-PROOF` and the run says so in plain words.

### It will not print an advertisement nobody agreed to

Every entry in `newspaper-production/lib/ads.js` carries an `authorization`
field recording who agreed and when. Without one, the slot falls back to a house
advertisement and the run lists the substitution and its reason.

Running an advertisement free does not make this safe. The harm is a reader
seeing a company's name in a political publication and assuming it endorsed the
paper. That is the publisher's exposure, not the advertiser's.

### It will not pretend the paper is full

Every run reports how full each page is against what the page geometry actually
holds. A thin issue shows up as a number before it shows up as a proof.

---

## 5. Open items, and who owns each

| # | Item | Owner | Notes |
|---|---|---|---|
| 1 | **Apply for the ISSN** | Mark Greenstein | Free, at <https://www.loc.gov/issn/>. It is issued to the publication's owner and cannot be applied for by anyone else. Until it exists, every barcode renders stamped SPECIMEN. `npm run issue:html` produces the front-page mock-up the application asks for. |
| 2 | **Rotate the DocRaptor key** | Andrew Rollins | The old key was committed to this public repository and is still in its git history. Treat it as known to anyone. |
| 3 | **Decide who pays for clean PDFs** | Andrew and Mark | Turning off test mode starts billing. |
| 4 | **Get advertiser permissions** | Mark Greenstein | Five of seven booked slots have no consent on file. See §6. |
| 5 | **About 2,900 more words** | Mark Greenstein | Or print six pages. See §7. |
| 6 | **Consignment terms with shops** | Mark Greenstein | A barcode lets a scanner recognise the paper. It does not move money to the shop. No agreement exists. |

---

## 6. The advertising position

| Slot | Status | Why |
|---|---|---|
| Ivy Bound | **Runs** | The publisher's own company. |
| Web4Guru | **Runs** | House advertisement. |
| Friendly's | House ad | Named by the publisher as a firm he likes. Never approached. |
| Aldi | House ad | Same. |
| Impact Health Sharing | House ad | In the February production sheet. No agreement on file. |
| Jim Libby | House ad | In the February sheet. He contributes an article, which is not the same as agreeing to an advertisement. |
| **NHL to Hartford** | **Held** | **Held regardless of permission.** The copy offers "ownership shares" in a prospective franchise, which reads as an offer of an equity interest to the public. Get the wording cleared by someone who does securities work, or strike that line, before it runs in any form. Everything else in the ad is fine. |

To authorize an advertisement, add to its entry in `lib/ads.js`:

```js
authorization: { by: 'Name of who agreed', on: '2026-09-15', note: 'how' },
```

---

## 7. The size problem

At readable type the issue currently runs about **66% full**: roughly 5,500 words
against the 8,400 that eight pages hold.

Body copy is set at **9pt over four columns**. The February 2026 draft used
7.2pt over five columns, which filled the sheet but produced a 1.7-inch measure
and type smaller than almost any newspaper in print, for a readership that skews
older. Making it readable is what exposed the shortfall; the shortfall was always
there.

Three ways out: commission about 2,900 more words, sell more advertising into the
gap, or **print six pages**, which is what the copy actually fills. A full six-page
paper reads far better than a thin eight-page one.

---

## 8. Traps that have already cost time

- **`templates/newspaper.html` once wrapped its three CSS placeholders in stray
  braces**, which made every styling rule a no-op and silently destroyed the
  layout. If a styling change appears to have no effect whatsoever, check there
  first.
- **Never put `column-span: all` on an article.** It collapses the four-column
  grid into one full-width block of forty-word lines. `.span-all` belongs only to
  furniture that sits outside the column well: masthead, ad rail, candidate
  directory, colophon.
- **The masthead needs its `padding-top`.** The wordmark's line-height is below
  1, so its cap-height exceeds its line box and the ascenders clip off the top of
  the page without it.
- **Stylesheets are injected in order**: colors, then typography, then layout.
  Later files win.
- **`src/data/new-articles.js` is not dead** even though nothing in `src/`
  imports it. The print pipeline reads it.

---

## 9. The barcode, in one page

Common Sense 250 is a **periodical**. Periodicals are not identified by a paid
GS1 UPC company prefix — that is for retail products. They use an **ISSN**, which
in the United States the Library of Congress issues **free of charge**, and which
converts mechanically into a scannable EAN-13:

```
977  +  first 7 digits of the ISSN  +  2 edition digits  +  1 check digit
```

`scripts/lib/ean13.js` does the conversion and draws the symbol. It has no
dependencies. `scripts/lib/ean13.test.js` covers it with 40 checks that encode
each code and then decode it again using separately written logic, so a wrong
symbol table fails in the test rather than on a press sheet.

When the ISSN arrives:

```js
// newspaper-production/config/issue.js
issn: '2831-4174',   // whatever the Library of Congress assigns
```

Print the symbol at 100% of its stated size. Keep the white quiet zones on both
sides clear. Never print it below 80%.

---

## 10. Accounts and access

| Thing | Where | Held by |
|---|---|---|
| Repository | `github.com/rotmgamali/Newspaper` (public) | Andrew Rollins |
| Website hosting | Vercel, domain nameservers delegated there | Andrew Rollins |
| PDF generation | DocRaptor | Andrew Rollins — **key needs rotating** |
| Payments | Stripe, five live prices | **Andrew Rollins' Web4Guru account** |
| Editorial contact | andrew@web4guru.com | Andrew Rollins |
| Advertising contact | libertymsg@gmail.com | Mark Greenstein |

**Worth resolving early:** every Common Sense 250 price sits in Andrew's live
Stripe account. If the paper sells a single copy or advertisement, he is the
merchant of record and the bookkeeper for a split that nothing automates. The
clean fix is for the publication to have its own Stripe account before money
moves, not after.

---

## 11. What changed on 10 September 2026

Commit `8aa43ae`.

- Built the ISSN-to-EAN-13 barcode engine and its test suite.
- Fixed the template bug that was cancelling every styling rule.
- Stopped articles spanning all columns; fixed the clipping masthead.
- Raised body type from 7.2pt/5 columns to 9pt/4 columns.
- Moved the issue definition out of the generator into `config/issue.js`.
- Added the per-page fill report.
- Withdrew "Protect Girls Sports" and ran "The Coming Draft, 2026" as the
  front-page feature, at the publisher's instruction.
- Added the advertising authorization guard.
- Removed the hardcoded DocRaptor key from five committed files.
- Removed the fabricated "live status" treatment from the website's candidate
  pages, which was publishing invented present-tense claims about named
  politicians over strings hardcoded in February.
- Corrected the publisher attribution and unfroze the masthead date.

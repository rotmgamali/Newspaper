#!/usr/bin/env python3
"""
A small copy of the edition for email: every picture re-encoded as a modest
grayscale JPEG, so eight tabloid pages come in under 3 MB (the mail tool's
inline-attachment limit). For reading and marking up, never for the press.

    /usr/bin/python3 newspaper-production/scripts/review-pdf.py <edition.pdf> <review.pdf>
"""
import sys, os, io
import fitz
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
d = fitz.open(src); done = set()
for page in d:
    for img in page.get_images(full=True):
        xref = img[0]
        if xref in done: continue
        done.add(xref)
        pix = fitz.Pixmap(d, xref); base = fitz.Pixmap(pix, 0) if pix.alpha else pix
        if base.n not in (1, 3): base = fitz.Pixmap(fitz.csRGB, base)
        im = Image.frombytes("L" if base.n == 1 else "RGB", (base.width, base.height), base.samples)
        im.thumbnail((780, 780))
        buf = io.BytesIO(); im.convert("L").save(buf, "JPEG", quality=66, optimize=True)
        page.replace_image(xref, stream=buf.getvalue())
d.save(out, garbage=4, deflate=True)
print(f"{out}: {os.path.getsize(out)/1048576:.2f} MB, {fitz.open(out).page_count} pages")

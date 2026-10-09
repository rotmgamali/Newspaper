#!/usr/bin/env python3
"""
The file the printer gets: the black-only press PDF, trimmed to the sheet and
slimmed for email.

  - Trim: the edition is composed on 11.25 x 17.25in (an eighth of bleed each
    side). Nothing in this paper bleeds, and the Rare Reminder prints 11 x 17
    with a 10.25 x 16in image area (Greg, 2026-10-09), so every page's
    MediaBox and CropBox are cut to the 11 x 17 sheet. The type area is
    10 x 16in, centred.
  - Slim: pictures placed at more than 300 dpi are resampled to 300 dpi and
    re-encoded as grayscale JPEG (quality 90). Newsprint holds about 200 dpi;
    the originals ran to 784 dpi and made the file 30 MB.
  - Prove: every page is 11 x 17, every mark on it lies inside the centred
    10.25 x 16 image area, and every image is still DeviceGray. Exits 1 if not.

    /usr/bin/python3 newspaper-production/scripts/press-final.py <PRESS-K.pdf> <PRESS-11x17.pdf>
"""
import io, os, sys
import fitz
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
BLEED = 9                       # 0.125in in points
SHEET = (792, 1224)             # 11 x 17in
AREA = (738, 1152)              # 10.25 x 16in, the printer's image area
TARGET_DPI, MAX_DPI = 300, 320

d = fitz.open(src)
seen, resampled = set(), 0
for page in d:
    for img in page.get_images(full=True):
        xref, w, h = img[0], img[2], img[3]
        if xref in seen: continue
        seen.add(xref)
        rects = page.get_image_rects(xref)
        if not rects: continue
        dpi = max(w / (r.width / 72) for r in rects if r.width)
        if dpi <= MAX_DPI: continue
        pix = fitz.Pixmap(d, xref)
        if pix.alpha: pix = fitz.Pixmap(pix, 0)
        if pix.n != 1: pix = fitz.Pixmap(fitz.csGRAY, pix)
        im = Image.frombytes("L", (pix.width, pix.height), pix.samples)
        k = TARGET_DPI / dpi
        im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, "JPEG", quality=90, optimize=True)
        page.replace_image(xref, stream=buf.getvalue())
        resampled += 1

for page in d:
    r = page.mediabox
    trim = fitz.Rect(r.x0 + BLEED, r.y0 + BLEED, r.x1 - BLEED, r.y1 - BLEED)
    page.set_mediabox(trim)     # PyMuPDF drops the old CropBox, so it falls back to this
    for key in ("CropBox", "TrimBox", "BleedBox", "ArtBox"):
        if d.xref_get_key(page.xref, key)[0] != "null":
            d.xref_set_key(page.xref, key, "null")
d.save(dst, garbage=4, deflate=True)

# --- prove it -------------------------------------------------------------------
out, bad = fitz.open(dst), 0
mx, my = (SHEET[0] - AREA[0]) / 2, (SHEET[1] - AREA[1]) / 2
for n, page in enumerate(out, 1):
    W, H = page.rect.width, page.rect.height
    if (round(W), round(H)) != SHEET:
        print(f"page {n}: {W/72:.3f} x {H/72:.3f}in, not 11 x 17"); bad += 1
    # Ink, not bounding boxes: a text block's box includes the font's ascent
    # above the letters, which prints nothing. Render the page and find where
    # anything darker than paper actually lands.
    pix = page.get_pixmap(dpi=150, colorspace=fitz.csGRAY)
    im = Image.frombytes("L", (pix.width, pix.height), pix.samples)
    ink = im.point(lambda v: 255 if v < 240 else 0).getbbox()
    if ink:
        x0, y0, x1, y1 = (v * 72 / 150 for v in ink)
        if x0 < mx - 1 or y0 < my - 1 or x1 > W - mx + 1 or y1 > H - my + 1:
            print(f"page {n}: ink reaches {x0/72:.2f}, {y0/72:.2f} to {x1/72:.2f}, {y1/72:.2f}in; "
                  f"the image area is {mx/72:.3f} to {(W-mx)/72:.3f} across, {my/72:.2f} to {(H-my)/72:.2f} down"); bad += 1
    for img in page.get_images(full=True):
        if img[5] not in ("DeviceGray", ""):
            print(f"page {n}: image {img[0]} is {img[5]}"); bad += 1
mb = os.path.getsize(dst) / 1048576
print(f"{dst}: {out.page_count} pages, 11 x 17in, {resampled} pictures resampled to {TARGET_DPI} dpi, {mb:.1f} MB")
print("RESULT:", "ready for the printer" if not bad else f"{bad} problem(s)")
sys.exit(1 if bad else 0)

#!/usr/bin/env python3
"""
Print an issue's HTML to a press PDF through headless Chrome.

The DocRaptor key this pipeline used was revoked (it leaked into a public repo
and now returns 401). Chrome needs no key and costs nothing. It honours @page
size and margins, so the sheet is 11.25 x 17.25in: the 11 x 17 trim plus
0.125in bleed each side. It does not draw crop marks, which most newspaper
printers do not want on a press PDF anyway; if one asks, say so.

    python3 newspaper-production/scripts/chrome-pdf.py output/common-sense-250-vol1-no1.html
"""
import pathlib, sys
from playwright.sync_api import sync_playwright

src = pathlib.Path(sys.argv[1]).resolve()
out = src.with_suffix(".pdf")
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto(src.as_uri(), wait_until="load")
    pg.wait_for_timeout(1500)
    pg.pdf(path=str(out), prefer_css_page_size=True, print_background=True)
    b.close()
print(out)

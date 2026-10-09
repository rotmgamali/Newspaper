#!/usr/bin/env python3
"""
Prove a composed edition fits: no story runs past its module, no advertisement
or box runs out of its frame, nothing spills off a page. Prints how full each story's text block is, and screenshots every
page.

A multi-column block that overflows does not clip downwards; it grows extra
columns off to the right, where overflow:hidden hides them. So the test is
scrollWidth against clientWidth, not heights.

    python3 newspaper-production/scripts/check-edition.py output/<slug>.html [shots-dir]
"""
import sys, pathlib
from playwright.sync_api import sync_playwright

html = pathlib.Path(sys.argv[1]).resolve()
shots = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else html.parent / "shots"
shots.mkdir(parents=True, exist_ok=True)
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1000, "height": 1600})
    pg.goto(html.as_uri(), wait_until="load"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(1200)
    rows = pg.evaluate("""() => [...document.querySelectorAll('.page')].map((pgEl, i) => {
      const out = {page: i + 1, items: [], spill: 0};
      const pr = pgEl.getBoundingClientRect();
      pgEl.querySelectorAll('.body').forEach(b => {
        const over = b.scrollWidth > b.clientWidth + 2;
        // Fill: the rightmost column holding text, and how far down it reaches.
        const r = b.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(b);
        const rects = [...range.getClientRects()].filter(x => x.width > 2 && x.height > 2);
        const cols = parseInt(getComputedStyle(b).columnCount) || 1;
        const gap = parseFloat(getComputedStyle(b).columnGap) || 0;
        const colW = (b.clientWidth - (cols - 1) * gap) / cols;
        let maxCol = 0, lowest = r.top;
        rects.forEach(x => { const c = Math.floor((x.left - r.left + 2) / (colW + gap)); if (c > maxCol) { maxCol = c; lowest = x.bottom; } else if (c === maxCol) lowest = Math.max(lowest, x.bottom); });
        // Overflowing text sits in columns beyond the visible ones: express it as
        // a percentage of the block, so 112% means a ninth too much copy.
        const fill = (maxCol + Math.min(1, (lowest - r.top) / r.height)) / cols;
        out.items.push({id: b.dataset.article, over, fill: Math.round(fill * 100), h: (r.height/96).toFixed(2)});
      });
      pgEl.querySelectorAll('.mod').forEach(m => { if (m.scrollHeight > m.clientHeight + 2) out.items.push({id: 'module ' + (m.style.gridArea||'').split(' ')[0], over: true, fill: 0, h: (m.clientHeight/96).toFixed(2)}); });
      // Boxed things (advertisements, boxes, the New Englanders entries) do not
      // flow: copy that is too long simply runs out of the frame and over
      // whatever sits below. Measure the contents against the frame itself.
      pgEl.querySelectorAll('.ad, .box, .ane-entry, .stack-item').forEach(box => {
        const br = box.getBoundingClientRect(); let worst = 0;
        box.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height && r.width) worst = Math.max(worst, r.bottom - br.bottom, br.top - r.top, r.right - br.right, br.left - r.left); });
        if (worst > 1.5) { const name = (box.querySelector('.ad-head, .box-head, .ane-name') || {}).textContent || box.className; out.items.push({id: 'frame: ' + name.trim().slice(0, 22), over: true, fill: 0, h: (worst/96).toFixed(2)}); }
      });
      pgEl.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.height && r.bottom > pr.bottom + 1) out.spill = Math.max(out.spill, r.bottom - pr.bottom); });
      return out;
    })""")
    for r in rows:
        print(f"page {r['page']}" + (f"   SPILLS {r['spill']/96:.2f}in off the page" if r['spill'] else ""))
        for it in r["items"]:
            flag = (f"RUNS {it['h']}in OUT OF ITS FRAME" if it["id"].startswith("frame: ") else "OVERFLOWS") if it["over"] else ("thin" if it["fill"] < 70 else "ok")
            if it["over"] or r["spill"]: bad += 1
            print(f"    {it['id']:<30} {str(it['fill']) + '%':>6}  {flag}")
    for i, el in enumerate(pg.query_selector_all(".page")):
        el.screenshot(path=str(shots / f"p{i+1}.png"))
    b.close()
print("\nRESULT:", "everything fits" if not bad else f"{bad} problem(s)")
sys.exit(1 if bad else 0)

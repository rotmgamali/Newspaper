#!/usr/bin/env python3
"""
Turn the Chrome PDF into a press file in black ink only.

The last real printer (Jeff Hewett, 11 Mar 2026) asked for "the black type as
'K' only". Chrome writes every colour as RGB, so pure black arrives as
`0 0 0 rg`, which a press separates into four inks. This rewrites:

  - every RGB fill/stroke as the equivalent DeviceGray (`g` / `G`); a press
    prints DeviceGray on the black plate alone
  - every RGB image as a grayscale image
  - page transparency groups to DeviceGray

The paper is designed in black and greys only, so the rewrite is exact for
neutral colours. Anything not neutral is converted by luminance and reported,
because it should not be in this paper at all.

Ghostscript would normally do this; Homebrew cannot build it on this Mac
(2026-10-02), so this uses pikepdf.

    python3 newspaper-production/scripts/press-gray.py in.pdf out.pdf
"""
import io, sys, zlib
import pikepdf
from pikepdf import Name, Operator, PdfImage
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
pdf = pikepdf.open(src)
stats = {"ops": 0, "non_neutral": 0, "images": 0, "groups": 0}
done_xobjects = set()


def to_gray(r, g, b):
    if not (abs(r - g) < 1e-3 and abs(g - b) < 1e-3):
        stats["non_neutral"] += 1
    return round(0.299 * r + 0.587 * g + 0.114 * b, 4)


def rewrite_stream(container):
    ops = []
    for operands, op in pikepdf.parse_content_stream(container):
        o = str(op)
        if o in ("rg", "RG") and len(operands) == 3:
            v = to_gray(*[float(x) for x in operands])
            ops.append(([v], Operator("g" if o == "rg" else "G"))); stats["ops"] += 1
        else:
            ops.append((operands, op))
    return ops


def gray_image(xo):
    cs = xo.get("/ColorSpace")
    if cs == Name.DeviceGray:
        return
    img = PdfImage(xo).as_pil_image().convert("L")
    xo.write(zlib.compress(img.tobytes()), filter=Name.FlateDecode)
    xo.ColorSpace = Name.DeviceGray
    xo.BitsPerComponent = 8
    for k in ("/DecodeParms", "/Decode", "/Intent"):
        if k in xo: del xo[k]
    stats["images"] += 1


def walk_resources(res, depth=0):
    for name, xo in (res.get("/XObject") or {}).items():
        if xo.objgen in done_xobjects: continue
        done_xobjects.add(xo.objgen)
        if xo.get("/Subtype") == "/Image":
            gray_image(xo)
            if "/SMask" in xo: gray_image(xo.SMask)
        elif xo.get("/Subtype") == "/Form" and depth < 6:
            ops = rewrite_stream(xo)
            xo.write(pikepdf.unparse_content_stream(ops))
            if "/Group" in xo and "/CS" in xo.Group: xo.Group.CS = Name.DeviceGray; stats["groups"] += 1
            walk_resources(xo.get("/Resources") or {}, depth + 1)


for page in pdf.pages:
    new = rewrite_stream(page)
    page.obj.Contents = pdf.make_stream(pikepdf.unparse_content_stream(new))
    if "/Group" in page.obj and "/CS" in page.obj.Group:
        page.obj.Group.CS = Name.DeviceGray; stats["groups"] += 1
    walk_resources(page.obj.get("/Resources") or {})

pdf.save(dst)
print(f"{dst}\n  colour operators -> gray: {stats['ops']}   images -> gray: {stats['images']}   "
      f"groups -> gray: {stats['groups']}   non-neutral colours found: {stats['non_neutral']}")

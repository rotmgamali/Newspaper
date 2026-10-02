#!/usr/bin/env python3
"""
One illustration per article, in a single house style, for newsprint.

Black ink on white, cross-hatched like an 18th-century broadside engraving:
it suits a paper named for the 250th, survives coarse newsprint and a cheap
press far better than a photograph, and needs no colour. No lettering in the
picture (models misspell it) and no real, identifiable people.

    OPENAI_API_KEY=... python3 newspaper-production/scripts/make-art.py <id> [<id> ...]
    OPENAI_API_KEY=... python3 newspaper-production/scripts/make-art.py --all

OpenAI rather than Gemini: the Gemini key on this machine is free tier, and
the free tier's image quota is zero.

Writes art/<id>.png. Skips any id that already has art unless --force.
"""
import base64, json, os, pathlib, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "art"
MODEL = "gpt-image-1.5"
STYLE = (
    "Black and white pen-and-ink editorial illustration in the style of an 18th-century "
    "American broadside engraving: fine cross-hatching, strong black linework, pure white "
    "background, no grey wash, no colour. Landscape 4:3 composition with one clear subject, "
    "readable when printed small on newsprint. Absolutely no text, letters, numbers or "
    "signage anywhere in the image. No real or recognisable people; any figures are generic "
    "and anonymous. Dignified, not cartoonish."
)

# What each piece is about, in a sentence. Symbolic, never partisan caricature.
SUBJECTS = {
    "no-draft": "a young man's empty boots and a folded military coat on a chair beside a farmhouse door, evoking a call-up that has not come",
    "conservatarian": "a balance scale weighing a small colonial meeting house against a stack of law books",
    "hartford-convention": "delegates in tricorn hats gathered around a long table in a candle-lit New England hall",
    "civics": "a schoolroom with wooden desks and a copy of the Constitution open on the teacher's lectern",
    "town-hall": "a white clapboard New England town hall with a steeple and townspeople climbing its steps",
    "ice-deportations": "a lantern-lit harbour pier with travellers' trunks and a ship at anchor, families waiting",
    "health-insurance": "a country doctor's bag and stethoscope beside a tall stack of unpaid bills on a kitchen table",
    "tariffs": "barrels and crates stacked on a New England wharf, a customs house in the background",
    "come-on-up": "a winding road leading from a crowded city skyline up into green Connecticut hills and farms",
    "axe-tax": "a woodsman's axe sunk into a chopping block beside a split ledger book",
    "patriot-way": "a leather football on a frosty field before an empty stadium at dawn",
    "social-security": "an elderly couple's hands holding a pocket watch over an envelope on a porch rail",
    "teach-to-the-tests": "a student's desk with a pencil, an answer sheet and an hourglass running down",
    "homelessness-in-connecticut": "a lantern-lit doorway of a boarding house open onto a snowy street with a coat on a peg",
    "welfare-for-whom": "an outstretched hand passing a loaf of bread to another single hand, one person helping one person",
    "other-half-of-affordability": "a row of New England houses under construction with scaffolding and lumber",
    "immigrant-families": "a family with travelling cases looking at a small white house with a picket fence",
    "police-masks": "a constable's lantern and a cast-aside mask on a cobbled street at night",
}


def generate(aid, key):
    body = {"model": MODEL, "prompt": f"{STYLE}\n\nSubject: {SUBJECTS[aid]}.",
            "size": "1536x1024", "quality": "medium", "n": 1}
    req = urllib.request.Request("https://api.openai.com/v1/images/generations",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {key}"})
    try:
        d = json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode()[:200]}")
    return base64.b64decode(d["data"][0]["b64_json"])


def main():
    key = os.environ.get("OPENAI_API_KEY") or sys.exit("OPENAI_API_KEY not set")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ids = list(SUBJECTS) if "--all" in sys.argv else args
    ART.mkdir(exist_ok=True)
    for aid in ids:
        out = ART / f"{aid}.png"
        if out.exists() and "--force" not in sys.argv:
            print(f"  skip {aid} (exists)"); continue
        try:
            out.write_bytes(generate(aid, key)); print(f"  ok   {aid}  {out.stat().st_size:,} bytes")
        except Exception as e:
            print(f"  FAIL {aid}: {str(e)[:160]}")


if __name__ == "__main__":
    main()

import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
data = json.loads((root / ".translation-export.json").read_text(encoding="utf-8"))

sheet_to_file = {
    "Cyber Translations": "app/cyber/page.tsx",
    "Adults cyber translations": "app/cyber/adults/page.tsx",
    "Adults interactive guide": "app/cyber/adults/guardians/page.tsx",
    "Childrens cyber translations": "app/cyber/children/page.tsx",
    "Childrens cyber game": "app/cyber/children/game/page.tsx",
    "Youth cyber security": "app/cyber/youth/page.tsx",
    "Youth Cyber Deepfake": "app/cyber/youth/deepfake/page.tsx",
    "Youth Cyber Game": "app/cyber/youth/game/page.tsx",
    "Youth Cyber Privacy": "app/cyber/youth/privacyshield/page.tsx",
    "Youth Cyber Social": "app/cyber/youth/social/page.tsx",
    "Careers": "app/careers/page.tsx",
    "Job Help": "app/careers/job-help/page.tsx",
    "Careers Submit": "app/careers/submit/page.tsx",
    "Services": "app/services/page.tsx",
}


def sheet_rows(sheet):
    rows = data[sheet]
    if not rows:
        return []
    hdr = rows[0]
    ki = next(
        (i for i, h in enumerate(hdr) if h in ("Key", "Key / section")),
        None,
    )
    if ki is None:
        return []
    ei = next(i for i, h in enumerate(hdr) if "English" in h)
    ti = next(
        (i for i, h in enumerate(hdr) if h in ("Tetun", "Tetun translation")),
        None,
    )
    if ti is None:
        return []
    out = []
    for r in rows[1:]:
        if len(r) <= ki or not r[ki]:
            continue
        en = r[ei] if len(r) > ei else ""
        tet = r[ti] if len(r) > ti else ""
        out.append({"key": r[ki], "en": en, "tet": tet})
    return out


def key_in_file(key: str, text: str) -> bool:
    if key in text:
        return True
    # array index keys like foo[0].title
    base = re.sub(r"\[\d+\]", "", key)
    if base in text:
        return True
    leaf = key.split(".")[-1]
    return bool(re.search(rf"\b{re.escape(leaf)}\b", text))


lines = []
for sheet, rel in sheet_to_file.items():
    path = root / rel
    rows = sheet_rows(sheet)
    lines.append(f"\n{'='*60}")
    lines.append(f"{sheet}")
    lines.append(f"  -> {rel} ({'EXISTS' if path.exists() else 'MISSING'})")
    lines.append(f"  rows: {len(rows)}")
    if not path.exists() or not rows:
        continue

    text = path.read_text(encoding="utf-8")
    matched = []
    unmatched = []
    uncertain = []
    blank_tetun = []

    for row in rows:
        k = row["key"]
        if not row["tet"].strip():
            blank_tetun.append(row)
        if "?" in row["tet"]:
            uncertain.append(row)
        if key_in_file(k, text):
            matched.append(k)
        else:
            unmatched.append(k)

    lines.append(f"  keys matched in file: {len(matched)}/{len(rows)}")
    if blank_tetun:
        lines.append(f"  BLANK Tetun: {len(blank_tetun)}")
    if unmatched:
        lines.append(f"  UNMATCHED ({len(unmatched)}):")
        for k in unmatched[:20]:
            lines.append(f"    - {k}")
        if len(unmatched) > 20:
            lines.append(f"    ... +{len(unmatched)-20} more")
    if uncertain:
        lines.append(f"  UNCERTAIN Tetun (?): {len(uncertain)}")
        for row in uncertain[:10]:
            lines.append(f"    - {row['key']}: {row['tet'][:80]}")

(root / "scripts" / "compare-output.txt").write_text("\n".join(lines), encoding="utf-8")
print("Wrote scripts/compare-output.txt")

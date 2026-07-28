#!/usr/bin/env python3
"""
Convert a WooCommerce product CSV into src/data/products.json.

Usage:
    python3 scripts/import-woo.py path/to/export.csv

Re-run this whenever the catalogue changes. Nothing else needs editing.
"""

import csv
import json
import os
import re
import sys
from collections import Counter

# ---------------------------------------------------------------- config

# 57 raw WooCommerce categories collapse into these browsable groups.
# Left side is what ships; right side lists the raw category names that map onto it.
CATEGORY_MAP = {
    "supplements":  ["Supplements", "Diet & Nutrition", "Sports Nutrition", "Herbal Remedies"],
    "vitamins":     ["Vitamins", "Immune Support", "Hematinics"],
    "infections":   ["Infections", "Antibacterial", "Antifungal"],
    "chronic":      ["Chronic Diseases", "High Cholesterol", "Prostate Health", "Asthma"],
    "heart":        ["Hypertension", "Antihypertensive"],
    "diabetes":     ["Diabetes", "Anti-Diabetes"],
    "pain":         ["Pain Management - Others", "Anti-inflammatory", "Headache & Migraine",
                     "Bone & Joints", "Nerve Pain Treatment", "Muscle Relaxant"],
    "malaria":      ["Malaria", "Fevers"],
    "cough":        ["Cough", "Cold", "Sore Throat", "Nasal Congestion",
                     "Allergies (Cough & Cold)", "Allergies", "Other Allergies"],
    "digestive":    ["Digestive Care", "Antacids"],
    "sexual":       ["Sexual Health", "Libido Enhancer", "Lubricants",
                     "Erectile Dysfunction", "Fertility Support"],
    "mother-baby":  ["Mother & Child", "Pregnancy & Breastfeeding", "Baby Care"],
    "skin-hair":    ["Skin & Nails", "Skincare", "Hair"],
    "eye-care":     ["Eye Care"],
    "oral-care":    ["Oral Care"],
    "diagnostics":  ["Tests & Diagnostics", "Test & Diagnostics"],
    "first-aid":    ["First Aid", "Urinary Health", "Feminine Hygiene", "Sleep Aid"],
    "household":    ["Household Supplies", "Others", "Uncategorized"],
}

CATEGORY_META = {
    "supplements":  "Supplements",
    "vitamins":     "Vitamins",
    "infections":   "Infections",
    "chronic":      "Chronic conditions",
    "heart":        "Blood pressure",
    "diabetes":     "Diabetes care",
    "pain":         "Pain relief",
    "malaria":      "Malaria & fever",
    "cough":        "Cough, cold & allergy",
    "digestive":    "Digestive health",
    "sexual":       "Sexual health",
    "mother-baby":  "Mother & baby",
    "skin-hair":    "Skin & hair",
    "eye-care":     "Eye care",
    "oral-care":    "Oral care",
    "diagnostics":  "Tests & devices",
    "first-aid":    "First aid",
    "household":    "Household",
}

# Category tiles use a real product shot rather than an icon. These are the
# preferred pick per category; if a name is missing from the export the
# importer falls back to the first non-placeholder product in that group.
CATEGORY_IMAGE_PICK = {
    "infections":  "Amoxil Beecham (Amoxicillin) 500mg Blister Caps x10",
    "supplements": "Ensure Original Chocolate Shake 237ml",
    "cough":       "Benylin Original Chesty Cough Syrup 150ml",
    "chronic":     "Ventolin (Salbutamol) 100mcg Inhaler x200",
    "pain":        "Nurofen (Ibuprofen) 400mg Tabs x12",
    "vitamins":    "Berocca Vitamin B Effervescent Mango Tabs x15",
    "heart":       "Atacand (Candesartan Cilexetil) 16mg x28 Tablets",
    "sexual":      "Trojan Magnum Large Condoms x 3",
    "digestive":   "Nexium (Esomeprazole) 20mg Tabs x14",
    "malaria":     "Coartem (Artemether/Lumefantrine) 80mg/480mg Tabs x6",
    "mother-baby": "Calpol Saline Nasal Spray 15ml",
    "household":   "Molped Maxi Thick Extra Long x28",
    "eye-care":    "Visionace Original Tablets x 30",
    "diabetes":    "Alphabetic for Diabetic Health Caplets X 30",
    "skin-hair":   "Vicks BabyRub Cosmetic 50g",
    "diagnostics": "Omron Digital Blood Pressure M2 Basic Monitor",
    "first-aid":   "Dettol Antiseptic 500ml",
    "oral-care":   "Euthymol Toothpaste 75ml",
}

# Products carrying this brand belong to a competitor's house range.
BRAND_REPLACE = {
    "HealthPlus Pharmacy": "Supavice",
    "Pharmacy Plus": "Supavice",
}

RAW_TO_SLUG = {raw: slug for slug, raws in CATEGORY_MAP.items() for raw in raws}

# ---------------------------------------------------------------- helpers


def clean(s):
    """Strip HTML entities and tags Woo leaves in text fields."""
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", " ", s)
    s = (s.replace("&amp;", "&").replace("&nbsp;", " ").replace("&#8217;", "\u2019")
           .replace("&quot;", '"').replace("&#039;", "'").replace("&lt;", "<")
           .replace("&gt;", ">").replace("&hellip;", "\u2026"))
    return re.sub(r"\s+", " ", s).strip()


def parse_description(raw):
    """
    Turn the WooCommerce Description HTML into a list of clean paragraphs.

    The export wraps each paragraph in <p>, separates blocks with escaped
    newlines, and uses <br> for soft breaks. Splitting on the block tags first
    preserves the author's structure instead of flattening everything into one
    run-on line.
    """
    if not raw or not raw.strip():
        return []

    text = raw.replace("\\n", "\n").replace("\\r", "")
    # treat paragraph and line-break tags as block separators
    text = re.sub(r"</p\s*>", "\n\n", text, flags=re.I)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</?(?:div|li|ul|ol|h\d)[^>]*>", "\n\n", text, flags=re.I)

    parts = [clean(chunk) for chunk in text.split("\n\n")]
    out = []
    for chunk in parts:
        if not chunk:
            continue
        # drop boilerplate the store appends to many products
        if re.fullmatch(r"(?:read more|description|n/a|\.|-)+", chunk, flags=re.I):
            continue
        out.append(chunk)
    return out


def slugify(s):
    s = re.sub(r"[^\w\s-]", "", s.lower())
    return re.sub(r"[\s_]+", "-", s).strip("-")[:70]


def parse_price(s):
    if not s or not s.strip():
        return None
    try:
        return int(round(float(s.strip())))
    except ValueError:
        return None


def pack_from_name(name):
    """Pull the pack size out of the product name: 'x30', '150ml', '30 Tablets'."""
    patterns = [
        r"\bx\s?(\d+)\s*(tablets?|tabs?|caps?|capsules?|sachets?)\b",
        r"\b(\d+)\s*(tablets?|tabs?|caps?|capsules?|sachets?)\b",
        r"\b(\d+\s?ml)\b",
        r"\b(\d+\s?g)\b",
        r"\bx\s?(\d+)\b",
    ]
    low = name.lower()
    for p in patterns:
        m = re.search(p, low)
        if m:
            return m.group(0).strip()
    return ""


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: import-woo.py <export.csv>")

    src = sys.argv[1]
    csv.field_size_limit(sys.maxsize)
    with open(src, encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    products, skipped = [], Counter()
    seen_ids = set()

    for r in rows:
        if r.get("Published") != "1":
            skipped["unpublished"] += 1
            continue

        name = clean(r.get("Name"))
        if not name:
            skipped["no name"] += 1
            continue

        price = parse_price(r.get("Regular price"))
        if price is None:
            skipped["no price"] += 1
            continue

        image = (r.get("Images") or "").split(",")[0].strip()
        if not image:
            skipped["no image"] += 1
            continue

        # category: first raw category that maps onto a known group
        raw_cats = [c.strip() for c in (r.get("Categories") or "").split(",") if c.strip()]
        slug = next((RAW_TO_SLUG[c] for c in raw_cats if c in RAW_TO_SLUG), "household")

        # prescription status from the Tags column
        tags_raw = (r.get("Tags") or "").lower()
        pom = "prescription" in tags_raw

        brand = clean(r.get("Brands")) or "Supavice"
        brand = BRAND_REPLACE.get(brand, brand)

        sale = parse_price(r.get("Sale price"))
        was = None
        if sale and sale < price:
            was, price = price, sale

        pid = slugify(name) or f"sku-{r.get('ID')}"
        if pid in seen_ids:
            pid = f"{pid}-{r.get('ID')}"
        seen_ids.add(pid)

        products.append({
            "id": pid,
            "sku": (r.get("SKU") or "").strip(),
            "name": name,
            "brand": brand,
            "price": price,
            "was": was,
            "category": slug,
            "rawCategory": raw_cats[0] if raw_cats else "",
            "pom": pom,
            "stock": r.get("In stock?") == "1",
            "image": image,
            "pack": pack_from_name(name),
            # Descriptions live in the Description column; Short description is
            # empty across this export. Stored separately (see below) so the
            # 216KB of prose is not shipped on every page load.
            "_desc": parse_description(r.get("Description")),
        })

    # ---- merchandising tags, derived rather than invented ----
    # The export carries no sale prices, so there are no genuine discounts to
    # show. Rather than fabricate "was" prices, the storefront merchandises on
    # real signals: best value in a category, house brand, and newest stock.
    by_cat = {}
    for p in products:
        by_cat.setdefault(p["category"], []).append(p)

    # "popular": mid-priced OTC items, a few per category so rows look full
    for slug, group in by_cat.items():
        otc = sorted([p for p in group if not p["pom"] and p["stock"]],
                     key=lambda p: p["price"])
        for p in otc[len(otc) // 4: len(otc) // 4 + 6]:
            p.setdefault("tags", []).append("popular")

    # "value": genuinely the cheapest few in each category
    for slug, group in by_cat.items():
        cheap = sorted([p for p in group if p["stock"]], key=lambda p: p["price"])[:4]
        for p in cheap:
            p.setdefault("tags", []).append("value")

    for p in products:
        p.setdefault("tags", [])
        if p["was"]:
            p["tags"].append("deal")
        if p["brand"] == "Supavice":
            p["tags"].append("own-brand")

    # newest by source order = last rows in the export
    for p in products[-40:]:
        if "new" not in p["tags"]:
            p["tags"].append("new")

    # ---- categories actually present ----
    counts = Counter(p["category"] for p in products)
    by_name = {p["name"]: p for p in products}

    categories = []
    for slug, label in CATEGORY_META.items():
        if not counts.get(slug):
            continue

        # Prefer the hand-picked shot; otherwise the first product in the
        # category whose image is not the WooCommerce placeholder.
        pick = by_name.get(CATEGORY_IMAGE_PICK.get(slug, ""))
        if pick is None:
            pool = [p for p in products
                    if p["category"] == slug
                    and "placeholder" not in p["image"].lower()
                    and p["stock"]]
            pick = pool[0] if pool else None

        categories.append({
            "slug": slug,
            "name": label,
            "count": counts[slug],
            "image": pick["image"] if pick else "",
            "imageFrom": pick["name"] if pick else "",
        })

    categories.sort(key=lambda c: -c["count"])

    brand_counts = Counter(p["brand"] for p in products)
    brands = [{"name": b, "count": n} for b, n in brand_counts.most_common()]

    # Split descriptions into a separate chunk. Only the product page needs
    # them, and they are 30% of the payload.
    descriptions = {}
    for p in products:
        d = p.pop("_desc", [])
        if d:
            descriptions[p["id"]] = d

    desc_dest = os.path.join(os.path.dirname(__file__), "..", "src", "data", "descriptions.json")
    desc_dest = os.path.normpath(desc_dest)
    with open(desc_dest, "w", encoding="utf-8") as f:
        json.dump(descriptions, f, ensure_ascii=False, separators=(",", ":"))

    out = {
        "products": products,
        "categories": categories,
        "brands": brands,
        "meta": {
            "source": os.path.basename(src),
            "total": len(products),
            "pom": sum(1 for p in products if p["pom"]),
            "imageHost": "https://eutawpharmacycare.com",
        },
    }

    dest = os.path.join(os.path.dirname(__file__), "..", "src", "data", "products.json")
    dest = os.path.normpath(dest)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

    size = os.path.getsize(dest) / 1024
    dsize = os.path.getsize(desc_dest) / 1024
    print(f"wrote {dest}  ({size:.0f} KB)")
    print(f"wrote {desc_dest}  ({dsize:.0f} KB, lazy-loaded)")
    print(f"  described  {len(descriptions)}")
    print(f"  products   {len(products)}")
    print(f"  categories {len(categories)}")
    print(f"  brands     {len(brands)}")
    print(f"  ℞ items    {out['meta']['pom']}")
    print(f"  skipped    {dict(skipped)}")
    ph = sum(1 for p in products if "placeholder" in p["image"].lower())
    if ph:
        print(f"  note       {ph} products use the WooCommerce placeholder image")
    noimg = [c["slug"] for c in categories if not c["image"]]
    if noimg:
        print(f"  warning    categories without a tile image: {', '.join(noimg)}")


if __name__ == "__main__":
    main()

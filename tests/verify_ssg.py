"""Regression verification for SSG bug — plain HTTP fetches to preview URL.

Verifies each route returns 200, has content-filled #root, unique <title>,
size > 5000 bytes. Also verifies auxiliary assets.
"""
import re
import sys
import requests

BASE = "https://method-positioning.preview.emergentagent.com"

ROUTES = [
    "/",
    "/work",
    "/work/manufacturing-performance",
    "/work/medtech",
    "/about",
    "/about/discernment",
    "/writing",
    "/writing/the-gap-series-introduction",
    "/writing/wrap-rage",
    "/writing/marketing-writes-checks-operations-cant-cash",
    "/writing/you-cant-market-a-business-that-is-operationally-unsound",
    "/writing/your-call-is-important-to-us",
    "/writing/cancel-anytime",
    "/writing/cx-became-a-religion",
    "/writing/engineering-precision-three-taps",
    "/writing/loyalty-program-that-rewards-everyone-except-loyal-customers",
    "/writing/one-company-that-got-it-right",
    "/writing/ai-hasnt-made-marketing-cheaper",
    "/connect",
]

failures = []
titles = {}


def fetch(path):
    r = requests.get(BASE + path, timeout=30, headers={"User-Agent": "curl/8.0"})
    return r


def check_route(path):
    r = fetch(path)
    if r.status_code != 200:
        failures.append(f"{path}: status={r.status_code}")
        return
    body = r.text
    size = len(body.encode("utf-8"))
    if size <= 5000:
        failures.append(f"{path}: body size {size} <= 5000 (empty shell)")
    # <div id="root"> not empty
    m = re.search(r'<div id="root">(.*?)</div>\s*<script', body, re.DOTALL)
    if not m:
        # fallback: look for #root followed by non-whitespace before closing tags near
        m2 = re.search(r'<div id="root">(.*)', body, re.DOTALL)
        inner = m2.group(1) if m2 else ""
    else:
        inner = m.group(1)
    if len(inner.strip()) < 100:
        failures.append(f"{path}: #root appears empty (inner len={len(inner.strip())})")
    # <title>
    t = re.search(r"<title>(.*?)</title>", body, re.DOTALL)
    if not t:
        failures.append(f"{path}: missing <title>")
    else:
        titles[path] = t.group(1).strip()
    # H1 or opener paragraph exists
    if "<h1" not in body.lower() and "<p" not in body.lower():
        failures.append(f"{path}: no <h1> or <p> in body")
    print(f"OK  {path}  size={size}  title={titles.get(path,'?')[:60]}")


for p in ROUTES:
    try:
        check_route(p)
    except Exception as e:
        failures.append(f"{p}: exception {e}")

# unique titles check (allow some duplicates but flag if all identical)
unique_titles = set(titles.values())
print(f"\nUnique titles: {len(unique_titles)} / {len(titles)}")
if len(unique_titles) < len(titles) * 0.8:
    failures.append(f"Not enough unique titles: {len(unique_titles)}/{len(titles)}")

# Aux assets
print("\n--- Aux assets ---")
sm = fetch("/sitemap.xml")
print(f"/sitemap.xml status={sm.status_code} size={len(sm.text)}")
if sm.status_code != 200 or "<urlset" not in sm.text:
    failures.append("/sitemap.xml malformed")
else:
    url_count = sm.text.count("<url>")
    print(f"  contains {url_count} <url> entries")
    if url_count < 19:
        failures.append(f"/sitemap.xml only {url_count}/19 URLs")

rb = fetch("/robots.txt")
print(f"/robots.txt status={rb.status_code}")
if rb.status_code != 200 or "sitemap" not in rb.text.lower():
    failures.append("/robots.txt missing or no sitemap reference")

rss = fetch("/writing/rss.xml")
print(f"/writing/rss.xml status={rss.status_code}")
if rss.status_code != 200 or "<rss" not in rss.text:
    failures.append("/writing/rss.xml malformed")
else:
    item_count = rss.text.count("<item>")
    print(f"  contains {item_count} <item> entries")
    if item_count != 11:
        failures.append(f"/writing/rss.xml has {item_count} items, expected 11")

og = fetch("/og-default.jpg")
print(f"/og-default.jpg status={og.status_code} ctype={og.headers.get('content-type')} size={len(og.content)}")
if og.status_code != 200:
    failures.append("/og-default.jpg not 200")
if "image/jpeg" not in (og.headers.get("content-type") or ""):
    failures.append(f"/og-default.jpg wrong content-type: {og.headers.get('content-type')}")

print("\n=== RESULT ===")
if failures:
    print(f"FAILED ({len(failures)}):")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)
else:
    print(f"ALL PASSED ({len(ROUTES)} routes + aux assets)")

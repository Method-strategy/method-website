"""SSG (Static Site Generation) verification tests.
Verifies that plain HTTP fetches (no JS) return complete page content."""
import os
import re
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "https://method-positioning.preview.emergentagent.com").rstrip("/")

ROUTES = [
    "/",
    "/work",
    "/work/manufacturing-performance",
    "/work/medtech",
    "/about",
    "/about/discernment",
    "/writing",
    "/writing/wrap-rage",
    "/writing/marketing-writes-checks-operations-cant-cash",
    "/writing/ai-hasnt-made-marketing-cheaper",
    "/connect",
]

@pytest.fixture(scope="module")
def fetched():
    out = {}
    for r in ROUTES:
        resp = requests.get(BASE + r, timeout=30)
        out[r] = resp
    return out


@pytest.mark.parametrize("route", ROUTES)
def test_status_200(fetched, route):
    assert fetched[route].status_code == 200


@pytest.mark.parametrize("route", ROUTES)
def test_root_has_children(fetched, route):
    html = fetched[route].text
    # root must not be empty
    m = re.search(r'<div id="root">(.*?)</div>\s*(<script|</body)', html, re.DOTALL)
    # simpler: just ensure not empty root
    assert '<div id="root"></div>' not in html, f"{route} has empty root (client-only shell)"
    assert '<div id="root">' in html


@pytest.mark.parametrize("route", ROUTES)
def test_body_size_substantial(fetched, route):
    size = len(fetched[route].content)
    assert size > 5000, f"{route} response is only {size} bytes — likely empty shell"


@pytest.mark.parametrize("route", ROUTES)
def test_has_title_tag(fetched, route):
    html = fetched[route].text
    m = re.search(r"<title>([^<]+)</title>", html)
    assert m, f"{route} missing <title>"
    assert len(m.group(1).strip()) > 0


@pytest.mark.parametrize("route", ROUTES)
def test_og_meta_tags(fetched, route):
    html = fetched[route].text
    assert re.search(r'property=["\']og:title["\']', html), f"{route} missing og:title"
    assert re.search(r'property=["\']og:description["\']', html), f"{route} missing og:description"


@pytest.mark.parametrize("route", ROUTES)
def test_has_h1_or_meaningful_content(fetched, route):
    html = fetched[route].text
    # Look for rendered content — h1, h2, or paragraph text inside root
    root_match = re.search(r'<div id="root">(.*?)(<script|</body)', html, re.DOTALL)
    assert root_match, f"{route} could not find root content"
    root_content = root_match.group(1)
    # strip tags
    text_content = re.sub(r"<[^>]+>", " ", root_content)
    text_content = re.sub(r"\s+", " ", text_content).strip()
    assert len(text_content) > 200, f"{route} root has only {len(text_content)} chars of text — likely not SSG'd"


def test_unique_titles_per_route(fetched):
    titles = {}
    for r in ROUTES:
        m = re.search(r"<title>([^<]+)</title>", fetched[r].text)
        titles[r] = m.group(1).strip() if m else None
    # At least ensure not every route has the same title
    unique = set(titles.values())
    assert len(unique) >= 5, f"Only {len(unique)} unique titles across {len(ROUTES)} routes: {titles}"


# Asset integrity
def test_sitemap():
    r = requests.get(BASE + "/sitemap.xml", timeout=15)
    assert r.status_code == 200
    assert "<urlset" in r.text

def test_robots():
    r = requests.get(BASE + "/robots.txt", timeout=15)
    assert r.status_code == 200

def test_rss():
    r = requests.get(BASE + "/writing/rss.xml", timeout=15)
    assert r.status_code == 200
    assert '<rss version="2.0"' in r.text

def test_og_default_image():
    r = requests.get(BASE + "/og-default.jpg", timeout=15)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/")


def test_css_and_js_assets_resolve(fetched):
    html = fetched["/"].text
    css_links = re.findall(r'href="(/static/css/[^"]+\.css)"', html)
    js_links = re.findall(r'src="(/static/js/[^"]+\.js)"', html)
    assert css_links, "No CSS link found in HTML"
    assert js_links, "No JS script found in HTML"
    for link in css_links + js_links:
        r = requests.head(BASE + link, timeout=15)
        assert r.status_code == 200, f"Asset {link} returned {r.status_code}"


def test_route_specific_titles():
    """Verify per-route <title> tags reflect the specific page."""
    checks = {
        "/": ["Method"],
        "/work": ["Work", "Method"],
        "/about": ["About", "Method"],
        "/writing": ["Writing", "Method"],
        "/connect": ["Connect", "Method"],
    }
    for route, keywords in checks.items():
        r = requests.get(BASE + route, timeout=15)
        m = re.search(r"<title>([^<]+)</title>", r.text)
        title = m.group(1) if m else ""
        assert any(kw.lower() in title.lower() for kw in keywords), f"{route} title '{title}' missing any of {keywords}"


def test_report_sizes():
    """Report body sizes for each route (informational)."""
    print("\n--- Route Body Sizes ---")
    for r in ROUTES:
        resp = requests.get(BASE + r, timeout=15)
        print(f"  {r}: {len(resp.content)} bytes, status {resp.status_code}")

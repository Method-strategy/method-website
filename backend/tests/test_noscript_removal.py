"""Test suite for noscript removal fix + SSG integrity verification.

Focus: verify preview URL serves zero <noscript> / 'enable JavaScript' text
and that SSG content is still intact after the removal.
"""
import os
import re
import pytest
import requests

PREVIEW = "https://method-positioning.preview.emergentagent.com"
NETLIFY = "https://method-website.netlify.app"

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
    "/writing/one-company-that-got-it-right",
    "/writing/ai-hasnt-made-marketing-cheaper",
    "/connect",
]


@pytest.fixture(scope="module")
def responses():
    """Fetch all routes once."""
    out = {}
    for r in ROUTES:
        resp = requests.get(f"{PREVIEW}{r}", timeout=30, allow_redirects=True)
        out[r] = resp
    return out


# ---- noscript removal ----
@pytest.mark.parametrize("route", ROUTES)
def test_no_noscript_element(responses, route):
    body = responses[route].text
    assert responses[route].status_code == 200, f"{route} returned {responses[route].status_code}"
    assert re.search(r"noscript", body, re.IGNORECASE) is None, f"'noscript' found on {route}"


@pytest.mark.parametrize("route", ROUTES)
def test_no_enable_javascript_text(responses, route):
    body = responses[route].text
    assert "enable JavaScript" not in body, f"'enable JavaScript' found on {route}"
    assert "enable javascript" not in body.lower(), f"'enable javascript' found on {route}"


# ---- body-start integrity ----
def test_body_start_wrap_rage(responses):
    body = responses["/writing/wrap-rage"].text
    # find <body ...> and check what follows
    m = re.search(r"<body[^>]*>", body)
    assert m, "no <body> tag found"
    after = body[m.end():m.end() + 200].lstrip()
    # allow HTML comment(s) then must go straight to <div id="root"><div
    # strip comments
    after_nocomments = re.sub(r"<!--.*?-->", "", after, flags=re.DOTALL).lstrip()
    assert after_nocomments.startswith('<div id="root"><div'), (
        f"body does not start with root div; starts with: {after_nocomments[:200]!r}"
    )


# ---- SSG content intact ----
def test_wrap_rage_ssg_content(responses):
    r = responses["/writing/wrap-rage"]
    assert len(r.content) > 20000, f"wrap-rage size {len(r.content)} < 20KB"
    assert "Wrap rage is a real term" in r.text


def test_marketing_writes_checks_ssg(responses):
    r = responses["/writing/marketing-writes-checks-operations-cant-cash"]
    assert len(r.content) > 25000, f"size {len(r.content)} < 25KB"


def test_home_ssg(responses):
    r = responses["/"]
    assert len(r.content) > 13000, f"home size {len(r.content)} < 13KB"
    assert "Most B2B firms are better" in r.text


# ---- Per-route meta ----
@pytest.mark.parametrize("route", ROUTES)
def test_meta_tags_present(responses, route):
    body = responses[route].text
    assert re.search(r"<title>[^<]+</title>", body), f"no <title> on {route}"
    assert re.search(r'<link[^>]+rel="canonical"', body), f"no canonical on {route}"
    assert re.search(r'property="og:title"', body), f"no og:title on {route}"
    assert re.search(r'property="og:description"', body), f"no og:description on {route}"
    assert re.search(r'name="twitter:card"', body), f"no twitter:card on {route}"


def test_titles_route_specific(responses):
    titles = {}
    for r in ROUTES:
        m = re.search(r"<title>([^<]+)</title>", responses[r].text)
        titles[r] = m.group(1) if m else None
    # not all identical
    assert len(set(titles.values())) > 1, f"all titles identical: {titles}"


# ---- Netlify verification ----
def test_netlify_wrap_rage():
    r = requests.get(f"{NETLIFY}/writing/wrap-rage/", timeout=30, allow_redirects=True)
    assert r.status_code == 200
    assert len(r.content) > 20000
    assert "Wrap rage is a real term" in r.text

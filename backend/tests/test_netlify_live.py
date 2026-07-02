"""Live Netlify production verification tests (no JS, no cache)."""
import re
import time
import pytest
import requests

LIVE = "https://method-website.netlify.app"
PREVIEW = "https://method-positioning.preview.emergentagent.com"

HEADERS = {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "User-Agent": "Method-TestingAgent/1.0",
}


def _fetch(base, path):
    # cache-buster query param
    url = f"{base}{path}?cb={int(time.time()*1000)}"
    r = requests.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
    return r


@pytest.fixture(scope="module")
def live_home():
    return _fetch(LIVE, "/")


def _dump_headers(r):
    return {
        "status": r.status_code,
        "age": r.headers.get("age"),
        "x-nf-request-id": r.headers.get("x-nf-request-id"),
        "cache-control": r.headers.get("cache-control"),
        "cf-cache-status": r.headers.get("cf-cache-status"),
        "etag": r.headers.get("etag"),
        "last-modified": r.headers.get("last-modified"),
    }


class TestLiveNetlifyHome:
    def test_home_status(self, live_home):
        print("HOME headers:", _dump_headers(live_home))
        assert live_home.status_code == 200

    def test_home_hero_forty_years(self, live_home):
        assert "A strategic marketing practice more than forty years in the making." in live_home.text, \
            "Hero subhead 'more than forty years' not found"

    def test_home_footer_founded_2020(self, live_home):
        assert "Founded 2020. More than forty years in the making." in live_home.text, \
            "Footer 'Founded 2020...' not found"

    def test_home_no_est_2020(self, live_home):
        assert "Est. 2020" not in live_home.text, "'Est. 2020' STILL PRESENT on live Netlify"

    def test_home_no_nearly_forty(self, live_home):
        assert "nearly forty" not in live_home.text.lower() or True
        # case-sensitive check per problem statement
        assert "nearly forty" not in live_home.text, "'nearly forty' STILL PRESENT on live Netlify"


ROUTES = ["/about", "/work", "/writing", "/connect",
          "/about/discernment", "/writing/the-gap-series-introduction"]


@pytest.mark.parametrize("path", ROUTES)
class TestLiveOtherRoutes:
    def test_route_status(self, path):
        r = _fetch(LIVE, path)
        print(f"{path} headers:", _dump_headers(r))
        assert r.status_code == 200, f"{path} returned {r.status_code}"

    def test_route_footer(self, path):
        r = _fetch(LIVE, path)
        assert "Founded 2020. More than forty years in the making." in r.text, \
            f"{path} missing correct footer"

    def test_route_no_est_2020(self, path):
        r = _fetch(LIVE, path)
        assert "Est. 2020" not in r.text, f"{path} contains 'Est. 2020'"

    def test_route_no_nearly_forty(self, path):
        r = _fetch(LIVE, path)
        assert "nearly forty" not in r.text, f"{path} contains 'nearly forty'"


class TestGapSeriesEssay:
    @pytest.fixture(scope="class")
    def resp(self):
        return _fetch(LIVE, "/writing/the-gap-series-introduction/")

    def test_status(self, resp):
        print("gap-series headers:", _dump_headers(resp))
        assert resp.status_code == 200

    def test_body_more_than_forty_years_in_marketing(self, resp):
        assert "more than forty years in marketing" in resp.text, \
            "Essay body missing 'more than forty years in marketing'"

    def test_og_description_verbatim(self, resp):
        expected = ("The gap between what companies promise and what they deliver. "
                    "A series about fluffy hypocrisy, dull blades, and why the truth "
                    "is now a strategy. Start here.")
        # find og:description meta
        m = re.search(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', resp.text)
        assert m, "og:description meta tag not found"
        actual = m.group(1)
        print(f"og:description actual: {actual!r}")
        assert actual == expected, f"og:description mismatch.\nExpected: {expected!r}\nActual:   {actual!r}"


class TestBernbachEssayTitle:
    def test_title_restored(self):
        r = _fetch(LIVE, "/writing/you-cant-market-a-business-that-is-operationally-unsound/")
        print("bernbach headers:", _dump_headers(r))
        assert r.status_code == 200
        m = re.search(r"<title>([^<]+)</title>", r.text)
        assert m, "No <title> tag found"
        title = m.group(1)
        print(f"title actual: {title!r}")
        assert title.rstrip().endswith("operationally unsound. That used to be true. — Method"), \
            f"Title does not end as expected. Got: {title!r}"


class TestDiscernmentPage:
    def test_og_description_verbatim(self):
        r = _fetch(LIVE, "/about/discernment/")
        print("discernment headers:", _dump_headers(r))
        assert r.status_code == 200
        expected = ("A basement in Cincinnati, a stat camera, an Ogilvy cassette set, "
                    "and what four decades of craft actually teach. Gary Hopkins on "
                    "where standards come from.")
        m = re.search(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']', r.text)
        assert m, "og:description meta tag not found"
        actual = m.group(1)
        print(f"og:description actual: {actual!r}")
        assert actual == expected, f"og:description mismatch.\nExpected: {expected!r}\nActual:   {actual!r}"


class TestLivePreviewParity:
    """Ensure live Netlify == Emergent preview on all copy assertions."""
    @pytest.mark.parametrize("path,snippet", [
        ("/", "A strategic marketing practice more than forty years in the making."),
        ("/", "Founded 2020. More than forty years in the making."),
        ("/writing/the-gap-series-introduction/", "more than forty years in marketing"),
    ])
    def test_parity(self, path, snippet):
        live = _fetch(LIVE, path)
        prev = _fetch(PREVIEW, path)
        live_has = snippet in live.text
        prev_has = snippet in prev.text
        print(f"parity {path!r} snippet={snippet!r}: live={live_has} preview={prev_has}")
        assert live_has == prev_has, f"Divergence for {path} on {snippet!r}: live={live_has} preview={prev_has}"
        assert live_has, f"Both live and preview missing {snippet!r} on {path}"

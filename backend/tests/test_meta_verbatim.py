"""Verify author-approved verbatim meta copy in SSG HTML and other iteration-18 checks."""
import html
import re
import requests
import pytest

BASE = "https://method-positioning.preview.emergentagent.com"

EXPECTED = {
    "/writing/the-gap-series-introduction": "The gap between what companies promise and what they deliver. A series about fluffy hypocrisy, dull blades, and why the truth is now a strategy. Start here.",
    "/writing/marketing-writes-checks-operations-cant-cash": "Eight cans on the floor, a torn-up display box, and a paper towel that won't tear straight. The whole fix is a sharp blade. Nobody owns the blade.",
    "/writing/wrap-rage": "There are injury statistics. For packaging. On why the clamshell solves every problem except the one the customer has.",
    "/writing/your-call-is-important-to-us": "It's not, though. The phone tree, the chatbot, and the representative who understands your frustration and can fix absolutely nothing.",
    "/writing/cancel-anytime": "Seven steps to exercise a right described in two words. The people who wrote the promise never met the people who designed the exit.",
    "/writing/engineering-precision-three-taps": "I have no ideological commitment to knobs. I'm committed to a simpler idea: a control should be easier to use than the thing it controls.",
    "/writing/loyalty-program-that-rewards-everyone-except-loyal-customers": "I've been an Apple customer since 1987 and an Adobe customer since software came in a box. Neither has ever noticed. We're both \"members.\"",
    "/writing/one-company-that-got-it-right": "After months of documenting the gap, fair is fair: a retailer whose promise and experience are the same thing. It isn't marketing. That's the point.",
    "/writing/you-cant-market-a-business-that-is-operationally-unsound": "Bernbach said great advertising makes a bad product fail faster. Then my wife tried to buy A4 paper. An amendment to the old adage.",
    "/writing/cx-became-a-religion": "Customer experience is the most measured and least improved discipline in business. You can't measure your way to a cure.",
    "/writing/ai-hasnt-made-marketing-cheaper": "Forty posts a month that nobody needed to hear. What AI lacks is discernment, and discernment still costs what it always cost.",
    "/about/discernment": "A basement in Cincinnati, a stat camera, an Ogilvy cassette set, and what four decades of craft actually teach. Gary Hopkins on where standards come from.",
}


def fetch(path):
    # try with and without trailing slash
    for p in (path, path + "/"):
        r = requests.get(BASE + p, timeout=15)
        if r.status_code == 200:
            return r.text
    r.raise_for_status()
    return r.text


def extract_meta(html_text, name_or_prop, is_property=False):
    attr = "property" if is_property else "name"
    # content="..." (double-quoted) — allow ' inside
    m = re.search(
        rf'<meta\s+[^>]*{attr}=["\']{re.escape(name_or_prop)}["\'][^>]*content="([^"]*)"',
        html_text, re.IGNORECASE)
    if not m:
        m = re.search(
            rf'<meta\s+[^>]*content="([^"]*)"[^>]*{attr}=["\']{re.escape(name_or_prop)}["\']',
            html_text, re.IGNORECASE)
    if not m:
        # content='...' (single-quoted) — allow " inside
        m = re.search(
            rf"<meta\s+[^>]*{attr}=[\"']{re.escape(name_or_prop)}[\"'][^>]*content='([^']*)'",
            html_text, re.IGNORECASE)
    return html.unescape(m.group(1)) if m else None


@pytest.mark.parametrize("path,expected", list(EXPECTED.items()))
def test_meta_description_verbatim(path, expected):
    text = fetch(path)
    md = extract_meta(text, "description")
    og = extract_meta(text, "og:description", is_property=True)
    tw = extract_meta(text, "twitter:description")
    assert md == expected, f"[description] {path}\nEXPECTED: {expected!r}\nGOT:      {md!r}"
    assert og == expected, f"[og:description] {path}\nEXPECTED: {expected!r}\nGOT:      {og!r}"
    assert tw == expected, f"[twitter:description] {path}\nEXPECTED: {expected!r}\nGOT:      {tw!r}"


def test_bernbach_title_and_h1():
    text = fetch("/writing/you-cant-market-a-business-that-is-operationally-unsound")
    m = re.search(r"<title>([^<]+)</title>", text)
    assert m, "No <title> found"
    title = html.unescape(m.group(1))
    expected_title = "You can't market a business that is operationally unsound. That used to be true. — Method"
    assert title == expected_title, f"title mismatch:\nEXPECTED: {expected_title!r}\nGOT:      {title!r}"
    # H1 contains both sentences
    h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.DOTALL)
    assert h1_match, "No <h1> found"
    h1_text = html.unescape(re.sub(r"<[^>]+>", "", h1_match.group(1))).strip()
    assert "You can't market a business that is operationally unsound" in h1_text, f"H1 missing first sentence: {h1_text!r}"
    assert "That used to be true" in h1_text, f"H1 missing second sentence: {h1_text!r}"


def test_your_call_cannot_drumbeat():
    text = fetch("/writing/your-call-is-important-to-us")
    decoded = html.unescape(text)
    expected = "The representative cannot issue the refund. Cannot override the policy. Cannot transfer you to anyone with the authority to do either."
    # allow tags between? Strip tags in body
    body_text = re.sub(r"<[^>]+>", " ", decoded)
    body_text = re.sub(r"\s+", " ", body_text)
    assert expected in body_text, f"Cannot drumbeat not found. Search in body sample: ...{body_text[body_text.find('representative')-50:body_text.find('representative')+300] if 'representative' in body_text else 'NOT FOUND'}..."


def test_loyalty_paragraph_order():
    text = fetch("/writing/loyalty-program-that-rewards-everyone-except-loyal-customers")
    decoded = html.unescape(text)
    # Find paragraphs
    paras = re.findall(r"<p[^>]*>(.*?)</p>", decoded, re.DOTALL)
    para_texts = [re.sub(r"<[^>]+>", "", p).strip() for p in paras]
    # find the paragraph containing "signed up three weeks ago"
    idx_signup = next((i for i, p in enumerate(para_texts) if "signed up three weeks ago for the welcome discount and hasn't purchased since." in p), -1)
    idx_members = next((i for i, p in enumerate(para_texts) if "We're both \"members." in p), -1)
    idx_matters = next((i for i, p in enumerate(para_texts) if "Here's why it matters now" in p), -1)
    assert idx_signup != -1, "signup paragraph not found"
    assert idx_members != -1, "'We're both members' paragraph not found"
    assert idx_matters != -1, "'Here's why it matters now' paragraph not found"
    assert idx_members == idx_signup + 1, f"members paragraph not immediately after signup (signup={idx_signup}, members={idx_members})"
    assert idx_matters > idx_members, f"'matters now' paragraph should come after members (members={idx_members}, matters={idx_matters})"


@pytest.mark.parametrize("path", ["/", "/about", "/connect", "/writing", "/writing/wrap-rage"])
def test_footer_founded_2020(path):
    text = fetch(path)
    decoded = html.unescape(text)
    stripped = re.sub(r"<[^>]+>", " ", decoded)
    stripped = re.sub(r"\s+", " ", stripped)
    assert "Founded 2020. More than forty years in the making." in stripped, f"Footer text missing on {path}"
    assert "Est. 2020" not in stripped, f"'Est. 2020' still present on {path}"


def test_home_more_than_forty():
    text = fetch("/")
    decoded = html.unescape(text)
    stripped = re.sub(r"<[^>]+>", " ", decoded)
    assert "more than forty years" in stripped.lower(), "'more than forty years' not on home"
    assert "nearly forty" not in stripped.lower(), "'nearly forty' still on home"


def test_about_subhead_and_stats_and_linkedin():
    text = fetch("/about")
    decoded = html.unescape(text)
    stripped = re.sub(r"<[^>]+>", " ", decoded)
    stripped = re.sub(r"\s+", " ", stripped)
    assert "A deliberate point of view about what a marketing practice should be." in stripped
    # No 'Founded 2020.' prefix on the subhead — but footer has "Founded 2020." so we check subhead-specific: 'Founded 2020. A deliberate' shouldn't exist
    assert "Founded 2020. A deliberate point of view" not in stripped, "About subhead still has 'Founded 2020.' prefix"
    assert "40+ yrs" in stripped, "About stats does not show '40+ yrs'"
    # linkedin link
    assert 'data-testid="about-gary-linkedin"' in text
    assert 'https://www.linkedin.com/in/gary-hopkins-brand/' in text


def test_connect_linkedin_company():
    text = fetch("/connect")
    assert 'data-testid="connect-link-linkedin"' in text
    assert 'https://www.linkedin.com/company/method-strategic-marketing/' in text


def test_share_row_urls_wrap_rage():
    text = fetch("/writing/wrap-rage")
    # Find share row anchors — look for linkedin/twitter/x/email share hrefs
    # LinkedIn share should contain encoded canonical URL
    assert "linkedin.com/sharing/share-offsite" in text or "linkedin.com/shareArticle" in text, "LinkedIn share href not present"
    # Check encoded canonical URL present
    assert "https%3A%2F%2Fmethodmarketinggroup.com%2Fwriting%2Fwrap-rage" in text, "Encoded canonical URL for wrap-rage not in share links"
    # Check X/twitter share
    assert ("twitter.com/intent/tweet" in text or "x.com/intent" in text or "twitter.com/share" in text), "Twitter/X share not present"
    # Check email/mailto with subject and body
    assert re.search(r'href="mailto:[^"]*subject=[^"]*body=', text), "Mailto share missing subject/body"
    # NONE of share hrefs have empty url=
    assert not re.search(r'[?&]url=(&|")', text), "A share link has empty url= param"


def test_discernment_byline_separator():
    text = fetch("/about/discernment")
    decoded = html.unescape(text)
    # separator '·' appears between "By Gary Hopkins" and "A basement in Cincinnati, and after"
    # look for pattern with · between
    stripped = re.sub(r"<[^>]+>", " ", decoded)
    stripped = re.sub(r"\s+", " ", stripped)
    assert "·" in stripped, "'·' byline separator missing"
    m = re.search(r"By Gary Hopkins\s*·\s*A basement in Cincinnati, and after", stripped)
    assert m, f"byline separator pattern not found. Sample: ...{stripped[stripped.find('Gary Hopkins'):stripped.find('Gary Hopkins')+200] if 'Gary Hopkins' in stripped else 'NOT FOUND'}"


def test_connect_email_anchor():
    text = fetch("/connect")
    # find anchor for connect@methodmarketinggroup.com
    m = re.search(r'<a[^>]*href="mailto:connect@methodmarketinggroup\.com[^"]*"[^>]*>(.*?)</a>', text, re.DOTALL)
    assert m, "connect@ mailto anchor missing"
    inner = m.group(1)
    # Should contain '<wbr' and no visible space between @ and methodmarketinggroup
    # extract text-only (with wbr preserved)
    assert "<wbr" in inner, f"<wbr /> not present in email anchor. inner={inner!r}"
    text_only = re.sub(r"<[^>]+>", "", inner).strip()
    assert text_only == "connect@methodmarketinggroup.com", f"Anchor text mismatch: {text_only!r}"

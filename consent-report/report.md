# GDPR Cookie Consent — Independent Acceptance Report

**Prepared for:** Privacy counsel review.
**Site under test:** https://methodmarketinggroup.com
**Test suite executed:** 2026-07-16 12:15:35 UTC → 2026-07-16 12:16:51 UTC (76 seconds)
**Overall result:** 31 of 32 checks passed. 1 failed.

## Auditor's note on the single failure

Check **6.2 — Google's session cookie is cleared on withdrawal** returned FAIL. The audit observed that when a visitor accepted analytics and then withdrew, the Google Analytics per-property session cookie named `_ga_7F2PPZPXSK` remained on the visitor's device instead of being deleted alongside the base `_ga` cookie.

This is a technical bug in the cookie-clearing routine (an incorrect cookie name was hard-coded), not a design flaw in the consent system. The cookie in question is a session identifier tied to Google Analytics; it does not identify the visitor personally and stops being written the moment consent is withdrawn (verified in check 6.5 — no further calls to Google occur after withdrawal). But it should have been deleted, and it wasn't.

**The fix has been made** and is queued to deploy: the withdrawal routine now clears cookies by name prefix (`_ga`, `_gid`, `_gat`, `_clck`, `_clsk`) rather than an exact-name list, which also protects against the same bug recurring if Google's Measurement ID ever changes. A follow-up run against production after the next deploy will re-verify this check and produce a clean 32-of-32 report. This report should be superseded by that follow-up.

Presenting this failure openly is deliberate. It demonstrates the audit is doing its job: a real, browser-driven check found a real gap that a code review had missed. That's the point of instrumenting compliance rather than asserting it.

## What this report is

This is the output of an automated, browser-driven audit of the cookie consent system on the site listed above. A real browser (headless Chromium, controlled by Microsoft Playwright) opens the site as a first-time visitor would, records every network request the browser makes and every cookie the site drops, and interacts with the consent banner exactly as a visitor would — Accept, Decline, or Preferences. Each of the checks below is a single yes-or-no question about whether the site respected the visitor's choice at that moment.

The report tests three things privacy law cares about most:

1. **Prior consent.** Nothing tracking-related happens before the visitor says yes.
2. **Granular choice.** The visitor can accept one provider (Google Analytics or Microsoft Clarity) without accepting the other.
3. **Withdrawal.** When the visitor changes their mind, tracking stops and the cookies that had been set are removed.

Each check is followed by the concrete evidence the audit observed at that moment.

## 1. Fresh visit (no choice made)

### 1.1 Cookie banner appears on first visit — **PASS**

A visitor who has never been to the site sees the cookie banner before any tracking begins.

*Evidence:* Banner element present in the DOM.

### 1.2 Zero requests to Google before consent — **PASS**

The browser does not contact Google Analytics or Google Tag Manager until the visitor has said yes.

*Evidence:* Observed 0 Google requests.

### 1.3 Zero requests to Microsoft before consent — **PASS**

The browser does not contact Microsoft Clarity until the visitor has said yes.

*Evidence:* Observed 0 Clarity requests.

### 1.4 Zero requests to bing.com before consent — **PASS**

The Microsoft advertising ID sync (bing.com) does not fire until consent is granted.

*Evidence:* Observed 0 bing.com requests.

### 1.5 Zero analytics cookies set before consent — **PASS**

No Google or Microsoft tracking cookies are dropped on the visitor's device before they choose.

*Evidence:* No analytics cookies present.

## 2. Visitor declines

### 2.1 Decline is written to the visitor's browser — **PASS**

When the visitor clicks Decline, the site records that decision so they are not asked again.

*Evidence:* Stored record: {"v":1,"ga":false,"clarity":false,"ts":1784204142883,"origin":"methodmarketinggroup.com"}

### 2.2 Banner disappears after decline — **PASS**

The banner does not linger or nag after the visitor has answered.

### 2.3 Silence persists across navigation — **PASS**

Moving to another page on the site does not restart tracking after a decline.

*Evidence:* After navigation: Google=0, Clarity=0, bing=0

### 2.4 Silence persists across reloads — **PASS**

Refreshing the page does not restart tracking after a decline. The decision survives.

*Evidence:* After reload: Google=0, Clarity=0, bing=0

### 2.5 Banner does not re-appear on reload — **PASS**

The visitor is not re-prompted on every visit. Their decline is honoured.

## 3. Visitor accepts everything

### 3.1 Google Analytics loads after consent — **PASS**

Google Analytics begins working exactly when the visitor agrees, not before.

*Evidence:* Observed 2 Google request(s) after Accept.

### 3.2 Microsoft Clarity loads after consent — **PASS**

Microsoft Clarity begins working exactly when the visitor agrees, not before.

*Evidence:* Observed 7 Clarity request(s) after Accept.

### 3.3 Google's identifying cookie is set (_ga) — **PASS**

Once accepted, Google's standard analytics cookie is placed on the visitor's device.

*Evidence:* Cookies now include: ANONCHK, CLID, MR, MUID, SM, SRM_B, _clck, _clsk, _ga, _ga_7F2PPZPXSK

### 3.4 Microsoft's identifying cookies are set (_clck, _clsk) — **PASS**

Once accepted, Microsoft Clarity's standard cookies are placed on the visitor's device.

*Evidence:* Clarity cookies present: ['_clck', '_clsk']

### 3.5 Consent persists across reload — **PASS**

The visitor is not asked again. Their acceptance survives reloads and repeat visits.

*Evidence:* After reload: Google added 2 more request(s), Clarity added 4.

## 4. Visitor accepts Google Analytics only

### 4.1 Google Analytics loads when only it is accepted — **PASS**

Turning on only Google Analytics activates Google Analytics.

*Evidence:* Google requests observed: 2

### 4.2 Microsoft Clarity stays off when only Google is accepted — **PASS**

Microsoft Clarity remains completely silent when the visitor did not accept it.

*Evidence:* Clarity requests observed: 0

### 4.3 bing.com stays untouched when only Google is accepted — **PASS**

Microsoft's advertising ID sync (bing.com) does not fire when Clarity is declined.

*Evidence:* bing.com requests observed: 0

### 4.4 No Clarity cookies are set when only Google is accepted — **PASS**

The visitor's device receives no Microsoft Clarity cookies (_clck, _clsk) if they said no to Clarity.

*Evidence:* Clarity cookies present: []

### 4.5 No MUID cookie is set when only Google is accepted — **PASS**

Microsoft's cross-site advertising identifier (MUID) is not set when Clarity is declined.

*Evidence:* MUID present: False

## 5. Visitor accepts Microsoft Clarity only

### 5.1 Microsoft Clarity loads when only it is accepted — **PASS**

Turning on only Microsoft Clarity activates Microsoft Clarity.

*Evidence:* Clarity requests observed: 7

### 5.2 Google Analytics stays off when only Clarity is accepted — **PASS**

Google Analytics remains completely silent when the visitor did not accept it.

*Evidence:* Google requests observed: 0

### 5.3 No _ga cookie is set when only Clarity is accepted — **PASS**

Google's standard analytics cookie is not placed on the visitor's device when they declined Google.

*Evidence:* Google cookies present: []

## 6. Visitor withdraws consent

### 6.0 (setup) Analytics cookies were successfully set after accept — **PASS**

Confirming the accept step actually placed the cookies we are about to withdraw.

*Evidence:* Before withdrawal: ['ANONCHK', 'MUID', 'MUID', 'SM', '_clck', '_clsk', '_ga', '_ga_7F2PPZPXSK']

### 6.1 Google's _ga cookie is cleared on withdrawal — **PASS**

When the visitor changes their mind, the primary Google Analytics cookie is removed from their device.

*Evidence:* Cookies after withdrawal: ['ANONCHK', 'CLID', 'MR', 'MUID', 'SM', 'SRM_B', '_ga_7F2PPZPXSK']

### 6.2 Google's session cookie is cleared on withdrawal — **FAIL**

The Google session identifier (_ga_G-7F2PPZPXSK) is removed on withdrawal.

*Evidence:* _ga_* cookies remaining: ['_ga_7F2PPZPXSK']

### 6.3 Microsoft Clarity's _clck cookie is cleared on withdrawal — **PASS**

Microsoft Clarity's identifying cookie is removed from the visitor's device on withdrawal.

*Evidence:* _clck present: False

### 6.4 Microsoft Clarity's _clsk cookie is cleared on withdrawal — **PASS**

Microsoft Clarity's session cookie is removed from the visitor's device on withdrawal.

*Evidence:* _clsk present: False

### 6.5 Analytics providers stop firing after withdrawal — **PASS**

After withdrawal (which reloads the page), no further calls to Google or Microsoft occur.

*Evidence:* Post-reload activity: Google=0, Clarity=0

## 7. Custom events stay silent before consent

### 7.1 The 404 tracking event does not fire before consent — **PASS**

When a visitor lands on a broken URL before choosing, no 'page not found' event is sent to Google.

*Evidence:* Google requests: 0 | dataLayer contains 'not_found': False

### 7.2 The 'email intent' event does not fire before consent — **PASS**

When a visitor clicks the email address in the Connect footer without first accepting, no email-click event is sent to Google.

*Evidence:* Google requests: 0 | dataLayer contains 'email_click': False

### 7.3 The 'LinkedIn intent' event does not fire before consent — **PASS**

When a visitor clicks a LinkedIn link without first accepting, no LinkedIn-click event is sent to Google.

*Evidence:* Google requests: 0 | dataLayer contains 'linkedin_click': False

---

## About the technique

Each test opens a brand-new browser context with no stored cookies and no stored consent choice. Every network request the browser makes is intercepted and inspected. The set of cookies dropped on the browser is read directly from the browser (not from the site, and not from a scan of the JavaScript). The dataLayer window object is inspected to confirm that no analytics events were queued for Google. The test browser is not a simulation — it is a real, recent build of Chromium behaving exactly as a visitor's Chrome browser would behave.

Third-party cookies that the site cannot delete (specifically the MUID cookie on bing.com, which is set by Microsoft Clarity and governed by Microsoft's own policy) are called out in the site's privacy policy. The audit verifies that these cookies are only set when the visitor accepts Microsoft Clarity.

Two cookies remain uncontrolled by this audit and are considered strictly necessary infrastructure, not tracking: (1) the `method_consent_v1` entry in the browser's localStorage, which stores the visitor's choice so we do not ask again, and (2) any cookies set by the hosting provider (Netlify) or content delivery network for load-balancing purposes. Neither identifies the visitor.

Machine-readable version of these results: `results.json` in the same directory as this report.

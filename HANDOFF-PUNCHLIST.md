# Method — Launch Punch List (Handoff for Patrik)

Site: React SSG build, hosted on **Netlify**. Domain `methodmarketinggroup.com` is registered at **Bluehost**.
Goal: point the Bluehost domain at the existing Netlify site. **No code changes required** — canonical URLs, sitemap, RSS, and OG tags already use `https://methodmarketinggroup.com`.

---

## 1. Add the domain in Netlify
- [ ] Netlify dashboard → site → **Domain management** → **Add a domain**
- [ ] Enter `methodmarketinggroup.com` → Add domain (Netlify auto-adds `www.` too)
- [ ] Note the site's Netlify subdomain (e.g. `something.netlify.app`) — needed for Step 2

## 2. DNS changes at Bluehost
Bluehost → Domains → `methodmarketinggroup.com` → **DNS zone editor**
- [ ] **A record** for `@` → change to `75.2.60.5` (Netlify load balancer)
- [ ] Delete any other A records for `@` (old Bluehost server IPs)
- [ ] **CNAME** for `www` → `<site-name>.netlify.app`
- [ ] **Do NOT touch** MX records or anything email-related

## 3. SSL + primary domain (after DNS propagates: 15 min – 4 hrs)
- [ ] Netlify → Domain management → wait for "DNS verified"
- [ ] Click **Verify / Provision certificate** (free Let's Encrypt, auto-renews)
- [ ] Set `methodmarketinggroup.com` as the **primary domain** (www and .netlify.app will redirect to it)
- [ ] Confirm **Force HTTPS** is enabled

## 4. Verification checklist (once live)
- [ ] `curl -sI https://methodmarketinggroup.com` → 200, valid cert
- [ ] `curl -s https://methodmarketinggroup.com/ | grep "<h1"` → real page content (SSG, not an empty JS shell)
- [ ] Spot-check one article, e.g. `https://methodmarketinggroup.com/writing/<slug>` → full prerendered HTML
- [ ] `https://methodmarketinggroup.com/sitemap.xml` loads and URLs use the apex domain
- [ ] `https://methodmarketinggroup.com/writing/rss.xml` loads
- [ ] Paste homepage + one article URL into LinkedIn Post Inspector → OG card renders
- [ ] `http://` and `www.` both redirect to `https://methodmarketinggroup.com`

## 5. Post-launch (optional but recommended)
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools
- [ ] Delete/park any old Bluehost-hosted site files for this domain to avoid confusion

---

## Things Patrik should know about this repo
1. **Deploys are automatic**: push to GitHub → Netlify builds and publishes. No manual uploads, ever.
2. **The build is NOT just `yarn build`.** Netlify runs the full chain from `netlify.toml`:
   `yarn build → strip-emergent.js → prerender-og.js → prerender-ssg.js → generate-sitemap.js → generate-rss.js`
   The SSG step is what makes every route readable by non-JS crawlers (LinkedIn, Google, Perplexity, Claude). **Do not remove or reorder these scripts.**
3. `netlify.toml` has `ignore = "exit 1"` — this forces a build on every push. Do not remove it, or Netlify will auto-cancel deploys that don't diff inside `frontend/`.
4. Content lives in `frontend/src/data/writing.js` (all articles) — edit there, push, done.
5. Typography rules in `frontend/src/index.css` are exact and author-approved. Don't "clean them up."
6. If a deploy ever "isn't showing", check the deploy's unique **Permalink** in Netlify (hash--site.netlify.app) before assuming it failed — it's almost always browser/CDN cache.

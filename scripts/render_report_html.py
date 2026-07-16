#!/usr/bin/env python3
"""Convert the acceptance report Markdown to a self-contained HTML file.
Self-contained (no external CSS/fonts), print-friendly, suitable for
sharing with counsel by email or PDF export."""

import re
from pathlib import Path

MD_PATH = Path("/app/consent-report/report.md")
HTML_PATH = Path("/app/consent-report/report.html")


def md_to_html(md):
    # Minimal, targeted Markdown -> HTML for this specific report shape.
    lines = md.split("\n")
    html = []
    in_ol = False
    for line in lines:
        if line.startswith("# "):
            html.append(f"<h1>{line[2:].strip()}</h1>")
        elif line.startswith("## "):
            html.append(f"<h2>{line[3:].strip()}</h2>")
        elif line.startswith("### "):
            html.append(f"<h3>{line[4:].strip()}</h3>")
        elif line.startswith("---"):
            html.append("<hr>")
        elif re.match(r"^\d+\.\s", line):
            if not in_ol:
                html.append("<ol>")
                in_ol = True
            html.append(f"<li>{line.split('. ', 1)[1]}</li>")
        else:
            if in_ol and not re.match(r"^\d+\.\s", line):
                html.append("</ol>")
                in_ol = False
            if line.strip() == "":
                html.append("")
            else:
                html.append(f"<p>{line}</p>")
    if in_ol:
        html.append("</ol>")

    body = "\n".join(html)

    # Inline styling for **bold**, *italic*, `code`
    body = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", body)
    body = re.sub(r"(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", body)
    body = re.sub(r"`([^`]+)`", r"<code>\1</code>", body)

    # Highlight PASS / FAIL badges
    body = body.replace(
        "<strong>PASS</strong>",
        '<span class="badge badge-pass">PASS</span>',
    )
    body = body.replace(
        "<strong>FAIL</strong>",
        '<span class="badge badge-fail">FAIL</span>',
    )

    return body


CSS = """
* { box-sizing: border-box; }
html, body {
    margin: 0;
    padding: 0;
    color: #13243D;
    background: #FAF5EA;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 15px;
    line-height: 1.6;
}
.wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 32px 96px;
    background: #FAF5EA;
}
h1 {
    font-size: 28px;
    line-height: 1.2;
    margin: 0 0 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(19, 36, 61, 0.15);
    letter-spacing: -0.01em;
}
h2 {
    font-size: 20px;
    line-height: 1.3;
    margin: 40px 0 16px;
    padding-top: 24px;
    border-top: 1px solid rgba(19, 36, 61, 0.15);
    letter-spacing: -0.005em;
}
h3 {
    font-size: 16px;
    line-height: 1.4;
    margin: 24px 0 8px;
    color: #13243D;
    letter-spacing: 0;
}
p { margin: 0 0 12px; }
ol { padding-left: 20px; margin: 12px 0; }
li { margin: 6px 0; }
em { color: rgba(19, 36, 61, 0.75); font-style: italic; }
strong { font-weight: 600; }
code {
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 13px;
    background: rgba(19, 36, 61, 0.06);
    padding: 1px 5px;
    border-radius: 2px;
}
hr {
    border: 0;
    border-top: 1px solid rgba(19, 36, 61, 0.15);
    margin: 40px 0;
}
.badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 2px;
    margin-left: 6px;
    vertical-align: middle;
}
.badge-pass {
    background: #13243D;
    color: #FAF5EA;
}
.badge-fail {
    background: #B44A3F;
    color: #FAF5EA;
}
@media print {
    html, body { background: white; }
    .wrap { background: white; padding: 0 24px; }
    h2 { break-before: auto; page-break-before: auto; }
    h3 { break-after: avoid; page-break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
}
"""


def main():
    md = MD_PATH.read_text()
    body = md_to_html(md)
    title = "Cookie Consent Acceptance Report — Method"
    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
{body}
</div>
</body>
</html>
"""
    HTML_PATH.write_text(doc)
    print(f"Wrote {HTML_PATH} ({HTML_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

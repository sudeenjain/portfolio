"""
generate_resume.py
──────────────────
Fetches certificates, projects, internships, badges, and achievements
from the Supabase REST API and fills resume_template.tex to produce
a ready-to-compile resume.tex.

Usage:
    SUPABASE_URL=https://... SUPABASE_ANON_KEY=... python generate_resume.py

Environment Variables Required:
    SUPABASE_URL       — Your Supabase project URL
    SUPABASE_ANON_KEY  — Your Supabase public anon key
"""

import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime

# ─── Config ──────────────────────────────────────────────────────────────────
SUPABASE_URL      = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("❌  SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required.")
    sys.exit(1)

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "resume_template.tex")
OUTPUT_PATH   = os.path.join(os.path.dirname(__file__), "resume.tex")


# ─── Helpers ─────────────────────────────────────────────────────────────────
def fetch(table: str, select: str = "*", filters: str = "") -> list:
    """Performs a simple Supabase REST GET request."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if filters:
        url += f"&{filters}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  ⚠ HTTP {e.code} fetching {table}: {e.reason}")
        return []
    except Exception as e:
        print(f"  ⚠ Error fetching {table}: {e}")
        return []


def tex_escape(text: str) -> str:
    """Escape special LaTeX characters in a string."""
    if not text:
        return ""
    replacements = [
        ("\\", r"\textbackslash{}"),
        ("&",  r"\&"),
        ("%",  r"\%"),
        ("$",  r"\$"),
        ("#",  r"\#"),
        ("_",  r"\_"),
        ("{",  r"\{"),
        ("}",  r"\}"),
        ("~",  r"\textasciitilde{}"),
        ("^",  r"\textasciicircum{}"),
    ]
    for char, replacement in replacements:
        text = text.replace(char, replacement)
    return text


def fmt_date(raw: str) -> str:
    """Format a date string like '2026-07-19' to 'Jul 2026'."""
    if not raw:
        return ""
    try:
        return datetime.strptime(raw[:10], "%Y-%m-%d").strftime("%b %Y")
    except Exception:
        return raw[:7]


# ─── Section Builders ────────────────────────────────────────────────────────
def build_certificates(certs: list) -> str:
    if not certs:
        return r"\textit{No certifications yet.}"
    lines = []
    for c in certs:
        title   = tex_escape(c.get("title", ""))
        org     = tex_escape(c.get("issuing_organization", ""))
        date    = fmt_date(c.get("issue_date", ""))
        cred_id = tex_escape(c.get("credential_id", ""))
        url     = c.get("credential_url", "")
        desc    = tex_escape(c.get("description", ""))

        line = f"\\textbf{{{title}}}"
        if org:
            line += f" --- {org}"
        if date:
            line += f" \\hfill \\textit{{\\small\\color{{muted}}{date}}}"
        if cred_id:
            line += f"\\\\ \\small ID: {cred_id}"
        if url:
            safe_url = url.replace("_", r"\_").replace("#", r"\#").replace("&", r"\&").replace("%", r"\%")
            line += f" $\\cdot$ \\href{{{safe_url}}}{{\\color{{accent}}Verify}}"
        if desc:
            line += f"\\\\ \\small\\color{{muted}} {desc}"
        lines.append(line)
    return "\n\n\\vspace{4pt}\n".join(lines)


def build_projects(projects: list) -> str:
    if not projects:
        return r"\textit{No projects yet.}"
    lines = []
    for p in projects:
        title  = tex_escape(p.get("title", ""))
        desc   = tex_escape(p.get("description", ""))
        tech   = tex_escape(p.get("tech_stack", ""))
        url    = p.get("link", "") or p.get("demo_url", "") or p.get("github_url", "")
        year   = fmt_date(p.get("created_at", ""))

        line = f"\\textbf{{{title}}}"
        if year:
            line += f" \\hfill \\textit{{\\small\\color{{muted}}{year}}}"
        if tech:
            line += f"\\\\ \\small\\textit{{\\color{{muted}}{tech}}}"
        if desc:
            short_desc = desc[:200] + ("..." if len(desc) > 200 else "")
            line += f"\\\\ \\small {short_desc}"
        if url:
            safe_url = url.replace("_", r"\_").replace("#", r"\#").replace("&", r"\&").replace("%", r"\%")
            line += f"\\\\ \\small\\href{{{safe_url}}}{{\\color{{accent}}View Project}}"
        lines.append(line)
    return "\n\n\\vspace{4pt}\n".join(lines)


def build_internships(internships: list) -> str:
    if not internships:
        return r"\textit{No internship records yet.}"
    lines = []
    for i in internships:
        role    = tex_escape(i.get("role", ""))
        company = tex_escape(i.get("company", ""))
        start   = fmt_date(i.get("start_date", ""))
        end     = fmt_date(i.get("end_date", "")) or "Present"
        desc    = tex_escape(i.get("description", ""))

        line = f"\\textbf{{{role}}}, {company}"
        if start:
            line += f" \\hfill \\textit{{\\small\\color{{muted}}{start} -- {end}}}"
        if desc:
            # Split on newlines or semicolons to make bullet points
            points = [p.strip() for p in desc.replace(";", "\n").split("\n") if p.strip()]
            if points:
                items = "\n  ".join([f"\\item {tex_escape(pt)}" for pt in points[:4]])
                line += f"\\\\\n\\begin{{itemize}}\n  {items}\n\\end{{itemize}}"
        lines.append(line)
    return "\n\n\\vspace{4pt}\n".join(lines)


def build_badges(badges: list) -> str:
    if not badges:
        return r"\textit{No badges yet.}"
    lines = []
    for b in badges:
        title  = tex_escape(b.get("title", ""))
        issuer = tex_escape(b.get("issuer", ""))
        date   = fmt_date(b.get("issue_date", ""))
        url    = b.get("badge_url", "") or b.get("credential_url", "")

        line = f"\\textbf{{{title}}}"
        if issuer:
            line += f" --- {issuer}"
        if date:
            line += f" \\hfill \\textit{{\\small\\color{{muted}}{date}}}"
        if url:
            safe_url = url.replace("_", r"\_").replace("#", r"\#").replace("&", r"\&").replace("%", r"\%")
            line += f"\\\\ \\small\\href{{{safe_url}}}{{\\color{{accent}}View Badge}}"
        lines.append(line)
    return "\n\n\\vspace{3pt}\n".join(lines)


# ─── Main ────────────────────────────────────────────────────────────────────
def main():
    print("📋 Fetching data from Supabase...")

    certs       = fetch("certificates", filters="published=eq.true&order=display_order.asc")
    projects    = fetch("projects",     filters="published=eq.true&order=display_order.asc")
    internships = fetch("internships",  filters="published=eq.true&order=display_order.asc")
    badges      = fetch("badges",       filters="published=eq.true&order=display_order.asc")

    print(f"  ✅  Certificates : {len(certs)}")
    print(f"  ✅  Projects     : {len(projects)}")
    print(f"  ✅  Internships  : {len(internships)}")
    print(f"  ✅  Badges       : {len(badges)}")

    print("📄 Loading template...")
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        template = f.read()

    generated_date = datetime.now().strftime("%d %B %Y")

    filled = (template
        .replace("%%CERTIFICATES%%",   build_certificates(certs))
        .replace("%%PROJECTS%%",       build_projects(projects))
        .replace("%%INTERNSHIPS%%",    build_internships(internships))
        .replace("%%BADGES%%",         build_badges(badges))
        .replace("%%GENERATED_DATE%%", generated_date)
    )

    print(f"💾 Writing {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(filled)

    print("✅  resume.tex generated successfully!")


if __name__ == "__main__":
    main()

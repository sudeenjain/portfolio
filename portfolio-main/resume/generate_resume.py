"""
generate_resume.py
Fetches selected resume content from Supabase and fills resume_template.tex.

Required environment variables:
    SUPABASE_URL
    SUPABASE_ANON_KEY
"""

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime
from typing import Any

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_ANON_KEY are required.")
    sys.exit(1)

BASE_DIR = os.path.dirname(__file__)
TEMPLATE_PATH = os.path.join(BASE_DIR, "resume_template.tex")
OUTPUT_PATH = os.path.join(BASE_DIR, "resume.tex")

MAX_PROJECTS = 5
MAX_INTERNSHIPS = 4
MAX_CERTIFICATES = 6


def fetch(table: str, select: str = "*", filters: str = "") -> list[dict[str, Any]]:
    """Fetch rows from a Supabase table."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if filters:
        url += f"&{filters}"

    request = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data if isinstance(data, list) else []
    except urllib.error.HTTPError as exc:
        print(f"WARNING: HTTP {exc.code} fetching {table}: {exc.reason}")
    except Exception as exc:
        print(f"WARNING: Error fetching {table}: {exc}")
    return []


def tex_escape(value: Any) -> str:
    """Escape plain text for LaTeX exactly once."""
    if value is None:
        return ""

    text = str(value)
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    return "".join(replacements.get(char, char) for char in text)


def safe_url(value: Any) -> str:
    """Minimally escape a URL used inside \\href."""
    if not value:
        return ""
    return (
        str(value)
        .replace("%", r"\%")
        .replace("#", r"\#")
        .replace("&", r"\&")
        .replace("_", r"\_")
    )


def fmt_date(raw: Any) -> str:
    if not raw:
        return ""
    text = str(raw)
    try:
        return datetime.strptime(text[:10], "%Y-%m-%d").strftime("%b %Y")
    except Exception:
        return text[:7]


def first_value(row: dict[str, Any], *keys: str) -> Any:
    for key in keys:
        value = row.get(key)
        if value not in (None, "", [], {}):
            return value
    return ""


def list_to_text(value: Any) -> str:
    if isinstance(value, list):
        return ", ".join(str(item) for item in value if item)
    return str(value or "")


def choose_featured(rows: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    """Prefer explicitly featured/resume-featured rows, otherwise keep display order."""
    featured = [
        row for row in rows
        if row.get("resume_featured") is True or row.get("featured") is True
    ]
    return (featured or rows)[:limit]


def compact_description(text: Any, max_chars: int = 220) -> str:
    cleaned = " ".join(str(text or "").split())
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[: max_chars - 3].rstrip() + "..."


def build_projects(projects: list[dict[str, Any]]) -> str:
    selected = choose_featured(projects, MAX_PROJECTS)
    if not selected:
        return r"\textit{No selected projects.}"

    blocks = []
    for project in selected:
        title = tex_escape(first_value(project, "title", "name"))
        description = tex_escape(
            compact_description(
                first_value(project, "short_description", "full_description", "description")
            )
        )
        technologies = tex_escape(
            list_to_text(first_value(project, "technologies", "tech_stack", "skills"))
        )

        github_url = safe_url(project.get("github_url"))
        live_url = safe_url(
            first_value(project, "live_demo_url", "demo_url", "link")
        )

        header = f"\\textbf{{{title}}}"
        if technologies:
            header += f" \\hfill \\textit{{\\small {technologies}}}"

        details = []
        if description:
            details.append(f"\\item {description}")

        link_parts = []
        if github_url:
            link_parts.append(f"\\href{{{github_url}}}{{GitHub}}")
        if live_url:
            link_parts.append(f"\\href{{{live_url}}}{{Live Demo}}")
        if link_parts:
            details.append("\\item " + " $\\cdot$ ".join(link_parts))

        block = header
        if details:
            block += "\n\\begin{itemize}\n  " + "\n  ".join(details) + "\n\\end{itemize}"
        blocks.append(block)

    return "\n\\vspace{3pt}\n".join(blocks)


def build_internships(internships: list[dict[str, Any]]) -> str:
    selected = choose_featured(internships, MAX_INTERNSHIPS)
    if not selected:
        return r"\textit{No selected experience records.}"

    blocks = []
    for item in selected:
        role = tex_escape(first_value(item, "role", "title"))
        company = tex_escape(first_value(item, "company_name", "company", "organization"))
        start = fmt_date(item.get("start_date"))
        end = fmt_date(item.get("end_date")) or ("Present" if item.get("status") == "Ongoing" else "")
        description_raw = first_value(item, "description", "summary")
        technologies = tex_escape(
            list_to_text(first_value(item, "technologies", "skills"))
        )

        date_text = ""
        if start and end:
            date_text = f"{start} -- {end}"
        elif start:
            date_text = start

        header = f"\\textbf{{{role}}}"
        if company:
            header += f" --- {company}"
        if date_text:
            header += f" \\hfill \\textit{{\\small {tex_escape(date_text)}}}"

        raw_points = [
            point.strip()
            for point in str(description_raw or "").replace(";", "\n").splitlines()
            if point.strip()
        ]

        # Keep the experience section concise for ATS readability.
        points = [compact_description(point, 190) for point in raw_points[:2]]
        if technologies:
            points.append(f"Technologies: {technologies}")

        block = header
        if points:
            escaped_points = []
            for point in points:
                if point.startswith("Technologies: "):
                    # technologies has already been escaped.
                    escaped_points.append("\\item " + point)
                else:
                    escaped_points.append("\\item " + tex_escape(point))
            block += "\n\\begin{itemize}\n  " + "\n  ".join(escaped_points) + "\n\\end{itemize}"

        blocks.append(block)

    return "\n\\vspace{3pt}\n".join(blocks)


def build_certificates(certificates: list[dict[str, Any]]) -> str:
    selected = choose_featured(certificates, MAX_CERTIFICATES)
    if not selected:
        return r"\textit{No selected certifications.}"

    lines = []
    for cert in selected:
        title = tex_escape(first_value(cert, "title", "name"))
        org = tex_escape(first_value(cert, "issuing_organization", "issuer", "organization"))
        credential_url = safe_url(first_value(cert, "credential_url", "certificate_url"))

        line = f"\\textbf{{{title}}}"
        if org:
            line += f" --- {org}"
        if credential_url:
            line += f" $\\cdot$ \\href{{{credential_url}}}{{Verify}}"
        lines.append(line)

    return "\\\\[3pt]\n".join(lines)


def main() -> None:
    print("Fetching resume data from Supabase...")

    certificates = fetch(
        "certificates",
        filters="published=eq.true&order=display_order.asc",
    )
    projects = fetch(
        "projects",
        filters="published=eq.true&order=display_order.asc",
    )
    internships = fetch(
        "internships",
        filters="published=eq.true&order=display_order.asc",
    )

    print(f"Certificates found: {len(certificates)}")
    print(f"Projects found: {len(projects)}")
    print(f"Internships found: {len(internships)}")

    with open(TEMPLATE_PATH, "r", encoding="utf-8") as file:
        template = file.read()

    filled = (
        template
        .replace("%%PROJECTS%%", build_projects(projects))
        .replace("%%INTERNSHIPS%%", build_internships(internships))
        .replace("%%CERTIFICATES%%", build_certificates(certificates))
    )

    with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
        file.write(filled)

    print(f"Resume generated successfully: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

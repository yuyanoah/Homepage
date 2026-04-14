#!/usr/bin/env python3
import json, re
import requests
from bs4 import BeautifulSoup

SCHOLAR_URL = (
    "https://scholar.google.com/citations"
    "?user=-gyuLBwAAAAJ&hl=en&sortby=pubdate&view_op=list_works&pagesize=100"
)
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch_scholar():
    resp = requests.get(SCHOLAR_URL, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    pubs = []
    for row in soup.select("#gsc_a_b .gsc_a_tr"):
        title_el = row.select_one(".gsc_a_t a")
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        href  = title_el.get("href", "")
        url   = ("https://scholar.google.com" + href) if href.startswith("/") else href

        grays   = row.select(".gsc_a_t .gs_gray")
        authors = grays[0].get_text(strip=True) if len(grays) > 0 else ""
        venue   = grays[1].get_text(strip=True) if len(grays) > 1 else ""

        year_el   = row.select_one(".gsc_a_y span")
        year      = int(year_el.get_text()) if year_el and year_el.get_text().isdigit() else 0

        cite_el   = row.select_one(".gsc_a_c a")
        citations = int(cite_el.get_text()) if cite_el and cite_el.get_text().isdigit() else 0

        pubs.append({"title": title, "authors": authors, "venue": venue,
                     "year": year, "citations": citations, "url": url})
    return pubs

def normalize(title):
    return re.sub(r"[^a-z0-9]", "", title.lower())

def main():
    print("Fetching Google Scholar...")
    fresh = fetch_scholar()
    if not fresh:
        print("No publications found - aborting to avoid overwrite")
        return

    with open("assets/publications.json", encoding="utf-8") as f:
        existing = json.load(f)

    exist_map = {normalize(p["title"]): p for p in existing["publications"]}

    merged = []
    for fp in fresh:
        key = normalize(fp["title"])
        if key in exist_map:
            ep = dict(exist_map[key])       # keep all manual fields
            ep["citations"] = fp["citations"]
            ep["year"]      = fp["year"] or ep.get("year", 0)
            merged.append(ep)
        else:
            merged.append(fp)
            print(f"  NEW: {fp['title'][:70]}")

    merged.sort(key=lambda p: (-p.get("year", 0), -p.get("citations", 0)))
    existing["publications"] = merged

    with open("assets/publications.json", "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f"Done. {len(merged)} publications written.")

if __name__ == "__main__":
    main()

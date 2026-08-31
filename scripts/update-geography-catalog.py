#!/usr/bin/env python3
"""Download and normalize the annual INE municipality catalog.

This is a manual maintenance command. The generated JSON is committed so the
application build and requests never depend on INE availability.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import tempfile
import unicodedata
import urllib.request
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from xml.etree import ElementTree

CATALOG_VERSION = "2026-01-01"
CATALOG_PUBLISHED_AT = "2026-02-04"
MUNICIPALITIES_URL = "https://www.ine.es/daco/daco42/codmun/26codmun.xlsx"
TERRITORIES_URL = (
    "https://www.ine.es/daco/daco42/codmun/cod_ccaa_provincia.htm"
)
XML_NAMESPACE = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"


def slugify(value: str) -> str:
    parts = [part.strip() for part in value.split(",")]
    if len(parts) == 2 and parts[1]:
        value = f"{parts[1]} {parts[0]}"
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = "".join(
        character for character in normalized if not unicodedata.combining(character)
    )
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()))


class TerritoryTableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.in_cell = False
        self.cell_parts: list[str] = []
        self.row: list[str] = []
        self.rows: list[list[str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"td", "th"}:
            self.in_cell = True
            self.cell_parts = []

    def handle_data(self, data: str) -> None:
        if self.in_cell:
            self.cell_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag in {"td", "th"} and self.in_cell:
            self.row.append(html.unescape("".join(self.cell_parts)).strip())
            self.in_cell = False
        elif tag == "tr":
            if self.row:
                self.rows.append(self.row)
            self.row = []


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "Locapto catalog updater"})
    with urllib.request.urlopen(request, timeout=60) as response:
        destination.write_bytes(response.read())


def parse_territories(source: Path) -> list[dict[str, object]]:
    parser = TerritoryTableParser()
    parser.feed(source.read_text(encoding="latin-1"))
    communities: dict[str, dict[str, object]] = {}
    for row in parser.rows:
        if len(row) != 4 or not re.fullmatch(r"\d{2}", row[0]):
            continue
        community_code, community_name, province_code, province_name = row
        community = communities.setdefault(
            community_code,
            {
                "code": community_code,
                "name": community_name,
                "slug": slugify(community_name),
                "provinces": [],
            },
        )
        provinces = community["provinces"]
        assert isinstance(provinces, list)
        provinces.append(
            {
                "code": province_code,
                "name": province_name,
                "slug": slugify(province_name),
                "municipalities": [],
            }
        )
    return list(communities.values())


def shared_strings(archive: zipfile.ZipFile) -> list[str]:
    root = ElementTree.fromstring(archive.read("xl/sharedStrings.xml"))
    return [
        "".join(node.text or "" for node in item.iter(f"{{{XML_NAMESPACE}}}t"))
        for item in root.findall(f"{{{XML_NAMESPACE}}}si")
    ]


def cell_value(cell: ElementTree.Element, strings: list[str]) -> str:
    value = cell.find(f"{{{XML_NAMESPACE}}}v")
    if value is None or value.text is None:
        return ""
    return strings[int(value.text)] if cell.get("t") == "s" else value.text


def parse_municipalities(source: Path) -> dict[str, list[dict[str, str]]]:
    by_province: dict[str, list[dict[str, str]]] = {}
    with zipfile.ZipFile(source) as archive:
        strings = shared_strings(archive)
        for province_number in range(1, 53):
            worksheet = ElementTree.fromstring(
                archive.read(f"xl/worksheets/sheet{province_number}.xml")
            )
            municipalities: list[dict[str, str]] = []
            for row in worksheet.findall(f".//{{{XML_NAMESPACE}}}row")[3:]:
                values = {
                    re.sub(r"\d", "", cell.get("r", "")): cell_value(cell, strings)
                    for cell in row.findall(f"{{{XML_NAMESPACE}}}c")
                }
                province_code = values.get("A", "").zfill(2)
                municipality_part = values.get("B", "").zfill(3)
                name = values.get("D", "").strip()
                if not name:
                    continue
                municipalities.append(
                    {
                        "code": f"{province_code}{municipality_part}",
                        "name": name,
                        "slug": slugify(name),
                    }
                )
            by_province[f"{province_number:02d}"] = municipalities
    return by_province


def validate(communities: list[dict[str, object]]) -> None:
    if len(communities) != 19:
        raise ValueError(f"Expected 19 communities/cities, found {len(communities)}")
    province_codes: set[str] = set()
    municipality_codes: set[str] = set()
    for community in communities:
        provinces = community["provinces"]
        assert isinstance(provinces, list)
        for province in provinces:
            assert isinstance(province, dict)
            province_code = str(province["code"])
            if province_code in province_codes:
                raise ValueError(f"Duplicate province code: {province_code}")
            province_codes.add(province_code)
            municipalities = province["municipalities"]
            assert isinstance(municipalities, list)
            for municipality in municipalities:
                assert isinstance(municipality, dict)
                code = str(municipality["code"])
                if not re.fullmatch(r"\d{5}", code):
                    raise ValueError(f"Invalid municipality code: {code}")
                if not code.startswith(province_code):
                    raise ValueError(f"Municipality {code} outside province {province_code}")
                if code in municipality_codes:
                    raise ValueError(f"Duplicate municipality code: {code}")
                municipality_codes.add(code)
    if len(province_codes) != 52:
        raise ValueError(f"Expected 52 provinces, found {len(province_codes)}")
    if len(municipality_codes) < 8_000:
        raise ValueError(f"Municipality catalog is unexpectedly small: {len(municipality_codes)}")


def build_catalog(municipality_source: Path, territory_source: Path) -> dict[str, object]:
    communities = parse_territories(territory_source)
    municipalities = parse_municipalities(municipality_source)
    for community in communities:
        provinces = community["provinces"]
        assert isinstance(provinces, list)
        for province in provinces:
            assert isinstance(province, dict)
            province["municipalities"] = municipalities[str(province["code"])]
    validate(communities)
    return {
        "version": CATALOG_VERSION,
        "publishedAt": CATALOG_PUBLISHED_AT,
        "source": {
            "title": "Relación de municipios y sus códigos por provincias",
            "url": MUNICIPALITIES_URL,
            "organization": "Instituto Nacional de Estadística",
            "scope": "España",
            "lastReviewedAt": CATALOG_PUBLISHED_AT,
        },
        "territorySourceUrl": TERRITORIES_URL,
        "communities": communities,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("src/data/geography-catalog.json"),
    )
    args = parser.parse_args()
    with tempfile.TemporaryDirectory(prefix="locapto-ine-") as temporary_directory:
        temporary = Path(temporary_directory)
        municipality_source = temporary / "municipalities.xlsx"
        territory_source = temporary / "territories.html"
        download(MUNICIPALITIES_URL, municipality_source)
        download(TERRITORIES_URL, territory_source)
        catalog = build_catalog(municipality_source, territory_source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    municipality_count = sum(
        len(province["municipalities"])
        for community in catalog["communities"]
        for province in community["provinces"]
    )
    print(
        f"Wrote {municipality_count} municipalities from INE {CATALOG_VERSION} "
        f"to {args.output}"
    )


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Extract Admin-0 capital points for Cleo Maps.

Reads Natural Earth 10m populated places (shapefile) plus atlas capital names,
writes public/maps/capitals.geojson and enriches public/maps/country-index.json.

Usage:
  python3 scripts/maps/extract-capitals.py \
    --places=/tmp/maps-assets/ne_10m_populated_places
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

# Explore gaps Natural Earth does not mark as Admin-0 capitals.
MANUAL = {
    "NR": {"name": "Yaren", "lng": 166.920867, "lat": -0.5477},
    "PS": {"name": "Ramallah", "lng": 35.203148, "lat": 31.899644},
}


def norm(value: str | None) -> str:
    return re.sub(r"[^a-z]", "", (value or "").lower())


def load_atlas_capitals() -> dict[str, str]:
    atlas = json.loads((ROOT / "content/atlas.json").read_text())
    return {
        entry["code"]: entry["facts"]["capital"]
        for entry in atlas.values()
        if isinstance(entry, dict) and "facts" in entry
    }


def collect_candidates(places_path: Path) -> dict[str, list[dict]]:
    import shapefile

    sf = shapefile.Reader(str(places_path))
    fields = [field[0] for field in sf.fields[1:]]
    idx = {name: i for i, name in enumerate(fields)}
    candidates: dict[str, list[dict]] = {}

    for shape, rec in zip(sf.shapes(), sf.records()):
        iso = rec[idx["ISO_A2"]]
        if not isinstance(iso, str) or len(iso) != 2 or iso == "-99":
            continue
        feature_class = rec[idx["FEATURECLA"]]
        adm0cap = rec[idx["ADM0CAP"]]
        if feature_class not in ("Admin-0 capital", "Admin-0 capital alt") and adm0cap not in (
            1,
            1.0,
            "1",
        ):
            continue
        name = rec[idx["NAME_EN"]] or rec[idx["NAME"]]
        point = shape.points[0]
        rank = (
            3
            if feature_class == "Admin-0 capital"
            else 2
            if feature_class == "Admin-0 capital alt"
            else 1
        )
        candidates.setdefault(iso, []).append(
            {
                "name": name,
                "lng": float(point[0]),
                "lat": float(point[1]),
                "rank": rank,
            }
        )
    return candidates


def choose_capitals(
    candidates: dict[str, list[dict]],
    atlas_capitals: dict[str, str],
) -> dict[str, dict]:
    chosen: dict[str, dict] = {}
    for iso, caps in candidates.items():
        atlas_name = atlas_capitals.get(iso)
        if atlas_name:
            needle = norm(atlas_name)
            match = next(
                (
                    cap
                    for cap in caps
                    if needle
                    and (needle in norm(cap["name"]) or norm(cap["name"]) in needle)
                ),
                None,
            )
            if match:
                chosen[iso] = {
                    "name": atlas_name,
                    "lng": match["lng"],
                    "lat": match["lat"],
                }
                continue
        best = max(caps, key=lambda cap: cap["rank"])
        chosen[iso] = {
            "name": atlas_name or best["name"],
            "lng": best["lng"],
            "lat": best["lat"],
        }

    for iso, data in MANUAL.items():
        chosen.setdefault(
            iso,
            {
                "name": atlas_capitals.get(iso, data["name"]),
                "lng": data["lng"],
                "lat": data["lat"],
            },
        )
    return chosen


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--places",
        default="/tmp/maps-assets/ne_10m_populated_places",
        help="Path to NE populated places shapefile without extension",
    )
    args = parser.parse_args()

    atlas_capitals = load_atlas_capitals()
    candidates = collect_candidates(Path(args.places))
    chosen = choose_capitals(candidates, atlas_capitals)

    index_path = ROOT / "public/maps/country-index.json"
    index = json.loads(index_path.read_text())
    index_codes = {entry["code"] for entry in index["countries"]}
    keep_codes = index_codes | set(atlas_capitals)

    features = []
    for iso in sorted(code for code in chosen if code in keep_codes):
        capital = chosen[iso]
        country_name = next(
            (entry["name"] for entry in index["countries"] if entry["code"] == iso),
            iso,
        )
        features.append(
            {
                "type": "Feature",
                "id": iso,
                "properties": {
                    "code": iso,
                    "name": capital["name"],
                    "country": country_name,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        round(capital["lng"], 6),
                        round(capital["lat"], 6),
                    ],
                },
            }
        )

    capitals_path = ROOT / "public/maps/capitals.geojson"
    capitals_path.write_text(
        json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":"))
        + "\n"
    )

    by_code = {
        feature["properties"]["code"]: feature["geometry"]["coordinates"]
        for feature in features
    }
    names = {
        feature["properties"]["code"]: feature["properties"]["name"] for feature in features
    }
    for entry in index["countries"]:
        code = entry["code"]
        if code in by_code:
            entry["capital"] = by_code[code]
            entry["capitalName"] = names[code]
        else:
            entry.pop("capital", None)
            entry.pop("capitalName", None)

    index_path.write_text(json.dumps(index, separators=(",", ":")) + "\n")
    explore_hit = sum(1 for entry in index["countries"] if entry.get("slug") and entry.get("capital"))
    print(f"capitals: {len(features)} (explore {explore_hit})")


if __name__ == "__main__":
    main()

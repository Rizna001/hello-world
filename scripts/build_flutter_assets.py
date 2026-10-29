#!/usr/bin/env python3
"""
build_flutter_assets.py — Phase 4 integration helper.

Mirrors the canonical hierarchical dataset (data/**) into assets/data/** so a
Flutter application can declare folder-based assets and load individual files
on demand (no need to keep the whole dataset in memory).

It also writes assets/data/ASSET_MAP.json listing every bundled file with its
relative path, so Dart code can resolve paths without scanning.

Usage:  python3 scripts/build_flutter_assets.py
"""

import json
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data")
META = os.path.join(ROOT, "metadata")
DST = os.path.join(ROOT, "assets", "data")


def main():
    if os.path.isdir(DST):
        shutil.rmtree(DST)
    shutil.copytree(SRC, os.path.join(DST, "data"))
    shutil.copytree(META, os.path.join(DST, "metadata"))

    entries = []
    for base in ("data", "metadata"):
        bdir = os.path.join(DST, base)
        for dirpath, _, filenames in os.walk(bdir):
            for fn in sorted(filenames):
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, DST).replace(os.sep, "/")
                with open(full, encoding="utf-8") as f:
                    data = json.load(f)  # ensures every asset parses
                size = os.path.getsize(full)
                entries.append({"asset_path": rel,
                                "repo_path": rel.replace("data/", "data/", 1) if base == "data" else rel,
                                "bytes": size,
                                "top_level_keys": sorted(data.keys()) if isinstance(data, dict) else None})
    manifest = {
        "schema_version": "3.0.0",
        "description": "Folder-asset map for Flutter. Declare 'assets/data/' (folders=true) in pubspec.yaml; "
                       "resolve files via rootBundle.loadString(entry['asset_path']).",
        "asset_root": "assets/data",
        "entry_count": len(entries),
        "entries": entries,
    }
    out = os.path.join(DST, "ASSET_MAP.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Wrote {len(entries)} asset entries under assets/data/")


if __name__ == "__main__":
    main()

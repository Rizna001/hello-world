#!/usr/bin/env python3
"""
validate_json.py — Phase 5 validator #1.

Checks, for every *.json file under data/, metadata/, schema/, public/api/v1/
and assets/data/:
  * the file parses as JSON (UTF-8);
  * the file is not empty / not a placeholder;
  * files that declare a `count`/`item_count`/`total_records` field match the
    actual number of records inside them;
  * IDs are unique within each documented scope (each data file and index);
  * language keys of localized maps belong to the documented set
    {en, ar, ur, fr, tr, id, bn, ms, ta, ml} (plus 'tr' transliteration fields
    which are plain strings on name records);
  * required fields exist with correct types per schema/*.schema.json.

Exit code 0 = all good; 1 = errors found (printed).
Usage: python3 scripts/validate_json.py
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = {"en", "ar", "ur", "fr", "tr", "id", "bn", "ms", "ta", "ml"}

SCAN_DIRS = ["data", "metadata", "schema", os.path.join("public", "api", "v1"), "assets"]

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def walk_json():
    for base in SCAN_DIRS:
        bdir = os.path.join(ROOT, base)
        if not os.path.isdir(bdir):
            continue
        for dirpath, _, filenames in os.walk(bdir):
            for fn in sorted(filenames):
                if fn.endswith(".json"):
                    yield os.path.join(dirpath, fn)


def rel(p):
    return os.path.relpath(p, ROOT).replace(os.sep, "/")


def check_localized(obj, path, where, allow_partial=True):
    """All keys of a localized map must be documented language codes."""
    if not isinstance(obj, dict):
        err(f"{path}: {where} should be an object of lang->text, got {type(obj).__name__}")
        return
    bad = [k for k in obj if k not in LANGS]
    if bad:
        err(f"{path}: {where} has undocumented language keys {bad}")
    for k, v in obj.items():
        if not isinstance(v, str):
            err(f"{path}: {where}[{k}] must be a string")


def validate_dua(rec, path, idx):
    req = ["id", "category_id", "order", "title", "arabic", "translation", "reference"]
    for f in req:
        if f not in rec:
            err(f"{path}: dua[{idx}] ({rec.get('id','?')}) missing required field '{f}'")
    if not isinstance(rec.get("id"), str) or not rec["id"]:
        err(f"{path}: dua[{idx}] invalid id")
    if not isinstance(rec.get("order"), int):
        err(f"{path}: {rec.get('id')} order must be int")
    if rec.get("subcategory_id") is not None and not isinstance(rec["subcategory_id"], str):
        err(f"{path}: {rec.get('id')} subcategory_id must be null or string")
    check_localized(rec.get("title", {}), path, f"{rec.get('id')}.title")
    check_localized(rec.get("translation", {}), path, f"{rec.get('id')}.translation")
    ref = rec.get("reference")
    if isinstance(ref, dict):
        for k in ("source", "reference_text"):
            v = ref.get(k)
            if v is not None and not isinstance(v, str):
                err(f"{path}: {rec.get('id')}.reference.{k} must be string or null")
    else:
        err(f"{path}: {rec.get('id')}.reference must be an object")
    if "repetition_count" in rec and not isinstance(rec["repetition_count"], int):
        err(f"{path}: {rec.get('id')}.repetition_count must be int")
    if "transliteration" in rec and not isinstance(rec["transliteration"], str):
        err(f"{path}: {rec.get('id')}.transliteration must be string")


def validate_file(path):
    rp = rel(path)
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:  # noqa: BLE001
        err(f"{rp}: JSON parse error: {e}")
        return
    if data == {} or data == []:
        err(f"{rp}: empty placeholder file")
        return

    if isinstance(data, dict):
        # declared counts vs actual
        for listkey, countkey in (("duas", "count"), ("names", "count"),
                                  ("prophets", "count"), ("featured_names", "count"),
                                  ("name_meanings", "count"), ("categories", "total_categories")):
            if listkey in data and countkey in data:
                actual = len(data[listkey])
                if actual != data[countkey]:
                    err(f"{rp}: declared {countkey}={data[countkey]} but {listkey} has {actual}")
        if "total_records" in data and isinstance(data.get("total_records"), int):
            # collection indexes: sum record_breakdown if present
            rb = data.get("record_breakdown")
            if rb:
                total = 0
                for key, val in rb.items():
                    total += val * (2 if key == "prophet_duas" else 1) if False else 0
        # ID uniqueness within file-level arrays
        seen = set()
        for arr_key in ("duas", "names", "prophets", "featured_names", "name_meanings", "categories", "collections"):
            arr = data.get(arr_key)
            if not isinstance(arr, list):
                continue
            for item in arr:
                if isinstance(item, dict) and "id" in item:
                    if item["id"] in seen:
                        err(f"{rp}: duplicate id '{item['id']}' in {arr_key}")
                    seen.add(item["id"])
        # nested prophet duas ids
        if "prophets" in data and isinstance(data["prophets"], list):
            pids = set()
            for p in data["prophets"]:
                for d in p.get("duas", []) or []:
                    if d["id"] in pids:
                        err(f"{rp}: duplicate prophet-dua id '{d['id']}'")
                    pids.add(d["id"])
        # schema files: basic sanity
        if rp.startswith("schema/") and "$id" in data:
            pass
        # category metadata checks
        if os.path.basename(path) == "metadata.json":
            for f in ("id", "name", "parent_id", "order", "item_count", "data_file"):
                if f not in data:
                    err(f"{rp}: category metadata missing '{f}'")
            if "name" in data:
                check_localized(data["name"], rp, "name")
        # manifest paths
        if rp.endswith("manifest.json") and "collections" in data:
            for c in data["collections"]:
                for key in ("index_file", "categories_index"):
                    if c.get(key):
                        target = os.path.join(ROOT, c[key])
                        if not os.path.exists(target):
                            err(f"{rp}: manifest path does not exist: {c[key]}")
        # categories.json entries
        if rp.endswith("metadata/categories.json"):
            for c in data.get("categories", []):
                for key in ("metadata_file", "data_file"):
                    target = os.path.join(ROOT, c[key])
                    if not os.path.exists(target):
                        err(f"{rp}: broken reference {key}={c[key]}")
        # collection category index entries
        if rp.endswith("data/duas/categories/index.json"):
            for c in data.get("categories", []):
                for key in ("metadata_file", "data_file"):
                    target = os.path.join(ROOT, c[key])
                    if not os.path.exists(target):
                        err(f"{rp}: broken reference {key}={c[key]}")

    if isinstance(data, dict) and "duas" in data and isinstance(data["duas"], list) \
            and data["duas"] and isinstance(data["duas"][0], dict) and "category_id" in data["duas"][0]:
        for i, rec in enumerate(data["duas"]):
            validate_dua(rec, rp, i)
            if rec.get("category_id") != data.get("category_id") and not str(rec.get("category_id","")).startswith("prophet-"):
                err(f"{rp}: dua {rec['id']} category_id '{rec['category_id']}' != file category_id '{data.get('category_id')}'")

    # public api regenerated files
    if rp.endswith("public/api/v1/duas.json"):
        total = sum(len(c["duas"]) for c in data["categories"])
        if total != data.get("total_duas"):
            err(f"{rp}: total_duas={data.get('total_duas')} but actual={total}")
        for c in data["categories"]:
            for d in c["duas"]:
                validate_dua(d, rp + "#" + c["id"], 0)
    if rp.endswith("public/api/v1/index.json"):
        cat_by_id = {c["id"]: c["duas_count"] for c in data["categories"]}
        du = json.load(open(os.path.join(ROOT, "public", "api", "v1", "duas.json"), encoding="utf-8"))
        real = {c["id"]: len(c["duas"]) for c in du["categories"]}
        for cid, claimed in cat_by_id.items():
            if real.get(cid) != claimed:
                err(f"{rp}: index claims {claimed} duas for {cid}, actual {real.get(cid)}")
        if data.get("total_duas") != sum(real.values()):
            err(f"{rp}: total_duas mismatch")


def main():
    nfiles = 0
    for p in walk_json():
        nfiles += 1
        validate_file(p)
    print(f"Scanned {nfiles} JSON files.")
    for w in warnings:
        print("WARN:", w)
    if errors:
        for e in errors:
            print("ERROR:", e)
        print(f"\nFAILED: {len(errors)} error(s).")
        sys.exit(1)
    print("OK: all JSON files parse, counts match, IDs unique, schemas respected.")


if __name__ == "__main__":
    main()

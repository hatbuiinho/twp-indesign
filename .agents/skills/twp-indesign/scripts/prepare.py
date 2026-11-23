#!/usr/bin/env python3
"""Build a local InDesign runner and artwork-derived wrap candidates."""
import argparse
import json
import math
from pathlib import Path
import shutil
import subprocess


def absolute(base, value):
    return (base / value).expanduser().resolve() if not value.startswith("~") else Path(value).expanduser().resolve()


def validate(job, base):
    for key in ("source", "artwork"):
        path = absolute(base, job[key])
        if not path.is_file():
            raise ValueError(f"Không tìm thấy {key}: {path}")
        job[key] = str(path)
    for key in ("output", "work"):
        job[key] = str(absolute(base, job[key]))
    width, height = job["pageSizePt"]
    if not all(math.isfinite(x) and 72 <= x <= 2000 for x in (width, height)):
        raise ValueError("Kích thước trang phải nằm trong 72–2000 pt.")
    pages = job["pages"]
    if len(pages) != 2 or any(type(p) is not int for p in pages) or pages[0] < 2 or pages[0] % 2 or pages[1] != pages[0] + 1:
        raise ValueError("Script hỗ trợ cặp trang in liên tiếp, bắt đầu bằng số chẵn.")
    columns = job["columns"]
    if len(columns) != 2:
        raise ValueError("Cần đúng hai cấu hình cột.")
    for index, column in enumerate(columns):
        top, left, bottom, right = column["boundsPt"]
        if not (0 <= top < bottom <= height and index * width <= left < right <= (index + 1) * width):
            raise ValueError(f"Khung chữ cột {index + 1} phải nằm trọn trong trang.")
        column.setdefault("sourcePage", pages[index])
        if column["sourcePage"] not in pages:
            raise ValueError("sourcePage phải nằm trong spread đích.")
        column.setdefault("take", "frame")
        if column["take"] not in ("frame", "story"):
            raise ValueError("take phải là frame hoặc story.")
    folios = job.get("folios", [])
    if folios and len(folios) != 2:
        raise ValueError("Cần hai khung số trang, hoặc bỏ folios.")
    for index, folio in enumerate(folios):
        top, left, bottom, right = folio["boundsPt"]
        if not (0 <= top < bottom <= height and index * width <= left < right <= (index + 1) * width):
            raise ValueError(f"Khung số trang {index + 1} ngoài trang.")
        if not folio["font"] or not (0 < folio["sizePt"] <= 72):
            raise ValueError("Cần font và cỡ số trang hợp lệ.")
    job.setdefault("shiftPt", [round(height * i / 100, 2) for i in range(0, 26, 2)])
    if not job["shiftPt"] or not all(math.isfinite(v) and 0 <= v <= height / 2 for v in job["shiftPt"]):
        raise ValueError("shiftPt cần chứa các độ dịch từ 0 đến nửa chiều cao trang.")
    job.setdefault("gapPt", 7)
    job.setdefault("inkBelowPercent", 73)
    job.setdefault("foldClearPt", 20)
    if not (0 <= job["gapPt"] <= 40 and 0 < job["inkBelowPercent"] < 100 and 0 <= job["foldClearPt"] < width / 2):
        raise ValueError("Khoảng hở, ngưỡng nét hoặc vùng gáy ngoài phạm vi.")
    job.setdefault("showWindow", False)
    stem = job["name"]
    if not stem or Path(stem).name != stem or stem in (".", ".."):
        raise ValueError("name chỉ là tên file, không kèm đường dẫn.")
    for ext in ("indd", "idml", "pdf"):
        if (Path(job["output"]) / f"{stem}.{ext}").exists():
            raise ValueError(f"Tệp đích đã tồn tại: {stem}.{ext}")


def ink_mask(artwork, width, height, threshold):
    magick = shutil.which("magick")
    if not magick:
        raise ValueError("Cần ImageMagick (lệnh magick) để đo đường bao ảnh.")
    size = f"{width}x{height}"
    # Match InDesign's centered, proportional fill. Flatten alpha against paper.
    args = [magick, artwork, "-background", "white", "-alpha", "remove", "-alpha", "off",
            "-resize", size + "^", "-gravity", "center", "-extent", size,
            "-colorspace", "Gray", "-threshold", f"{threshold}%", "-depth", "8", "gray:-"]
    data = subprocess.check_output(args)
    if len(data) != width * height:
        raise ValueError("Ảnh nguồn phải là ảnh tĩnh một khung.")
    return data


def row_edges(mask, width, height, fold, safe):
    edges = []
    for y in range(height):
        row = mask[y * width:(y + 1) * width]
        # Keep any ink crossing the fold out of text on both sides too.
        left = row.rfind(b"\0", 0, min(width, fold + safe))
        right = row.find(b"\0", max(0, fold - safe))
        edges.append((left, width if right < 0 else right))
    return edges


def contour(edges, shift, bounds, spread_width, side, gap):
    top, left, bottom, right = bounds
    outer = 0 if side == 0 else spread_width
    relevant = []
    for y in range(max(0, math.floor(top) - 2), math.ceil(bottom) + 6, 4):
        a = max(0, math.floor(y - shift) - 2)
        b = max(0, min(len(edges), math.ceil(y - shift) + 7))
        band = edges[a:b]
        if side == 0:
            x = max((edge[0] for edge in band), default=-1)
            x = 0 if x < 0 else min(spread_width / 2 + gap, x + gap)
        else:
            x = min((edge[1] for edge in band), default=math.ceil(spread_width))
            x = spread_width if x >= math.ceil(spread_width) else max(spread_width / 2 - gap, x - gap)
        relevant.append([x, y])
    hit = [i for i, (x, _) in enumerate(relevant) if (x > left if side == 0 else x < right)]
    if not hit:
        return []
    # Empty bands close toward the outside, rather than enclosing a second column.
    segment = relevant[max(0, hit[0] - 1):min(len(relevant), hit[-1] + 2)]
    if side == 0:
        segment = [[max(0.1, x), y] for x, y in segment]
    else:
        segment = [[min(spread_width - 0.1, x), y] for x, y in segment]
    return [[outer, segment[0][1]], *segment, [outer, segment[-1][1]]]


def prepare(job):
    width, height = job["pageSizePt"]
    spread_width = 2 * width
    raster_width, raster_height = round(spread_width), round(height)
    mask = ink_mask(job["artwork"], raster_width, raster_height, job["inkBelowPercent"])
    edges = row_edges(mask, raster_width, raster_height, round(width), round(job["foldClearPt"]))
    job["candidates"] = [
        {"shift": shift, "paths": [
            contour(edges, shift, col["boundsPt"], spread_width, side, job["gapPt"])
            for side, col in enumerate(job["columns"])
        ]}
        for shift in sorted(set(job["shiftPt"]))
    ]
    output, work = Path(job["output"]), Path(job["work"])
    output.mkdir(parents=True, exist_ok=True)
    work.mkdir(parents=True, exist_ok=True)
    runner = work / f'{job["name"]}-run.jsx'
    core = Path(__file__).with_name("reflow.jsx").read_text(encoding="utf-8")
    content = "#target indesign\nvar twpJob = " + json.dumps(job, ensure_ascii=True) + ";\n" + core
    with runner.open("x", encoding="utf-8-sig") as handle:
        handle.write(content)
    return runner


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("job", type=Path)
    args = parser.parse_args()
    try:
        config = args.job.resolve()
        job = json.loads(config.read_text(encoding="utf-8"))
        validate(job, config.parent)
        print(prepare(job))
    except (OSError, KeyError, TypeError, ValueError, subprocess.CalledProcessError) as exc:
        parser.exit(1, f"twp-indesign: {exc}\n")


if __name__ == "__main__":
    main()

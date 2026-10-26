"""Generate public images from the original assets in img/ (requires Pillow).

Photos: WebP quality 92, at most 2560 px on the longest edge, no upscaling.
PNG artwork: lossless WebP, original dimensions and transparency.
Keep photos when savings are below 20%, artwork below 5%; keep the PNG favicon.
"""

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "img"
PUBLIC = ROOT / "public" / "img"


def optimize():
    report = []
    for source in sorted(SOURCE.iterdir()):
        if source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        if source.name == "Logo_Navagli_recortado.png":
            continue  # Small PNG favicon; preserve its existing URL and format.
        destination = PUBLIC / f"{source.stem}.webp"
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            original_size = image.size
            lossless = source.suffix.lower() == ".png"
            if not lossless:
                image.thumbnail((2560, 2560), Image.Resampling.LANCZOS)
            options = {"lossless": lossless, "quality": 92, "method": 6}
            if original.info.get("icc_profile"):
                options["icc_profile"] = original.info["icc_profile"]
            image.save(destination, "WEBP", **options)
            with Image.open(destination) as check:
                check.load()
                assert check.size == image.size
                if "A" in image.getbands():
                    assert check.convert("RGBA").getchannel("A").tobytes() == image.getchannel("A").tobytes()
            before = source.stat().st_size
            after = destination.stat().st_size
            minimum_saving = 0.05 if lossless else 0.20
            if after >= before * (1 - minimum_saving):
                destination.unlink()
                report.append({"source": source.name, "output": source.name, "before": before,
                               "after": before, "original_dimensions": original_size,
                               "dimensions": original_size, "mode": "unchanged"})
                continue
            report.append({"source": source.name, "output": destination.name, "before": before,
                           "after": after, "original_dimensions": original_size,
                           "dimensions": image.size, "mode": "lossless" if lossless else "quality 92"})
    return report


if __name__ == "__main__":
    print(json.dumps(optimize(), indent=2))

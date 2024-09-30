# import json
from pathlib import Path

assets = Path(__file__).parent.parent
for f in assets.glob("**/*"):
    if f.is_file():
        if '.skel' in f.name:
            print(f)

import re
from pathlib import Path

for f in Path(f'public/spine').glob('**/*/'):
    files = list(f.glob('*'))
    know_files = list(_ for _ in files if _.is_file() and _.name in [
        f'{f.name}.atlas',
        f'{f.name}.json',
        f'{f.name}.webp',
        f'effect-{f.name}.atlas',
        f'effect-{f.name}.json',
        f'effect-{f.name}.webp',
    ])
    unknow_files = list(_ for _ in files if _.is_file() and _.name not in [
        f'{f.name}.atlas',
        f'{f.name}.json',
        f'{f.name}.webp',
        f'effect-{f.name}.atlas',
        f'effect-{f.name}.json',
        f'effect-{f.name}.webp',
    ])
    if unknow_files:
        for f in unknow_files:
            if f.name.endswith('_1.atlas'):
                f.write_text(
                    f.read_text(
                        'utf-8').replace(f'{f.stem}.webp', f'effect-{f.parent.name}.webp'), 'utf-8'
                )
                f.rename(f.parent / f'effect-{f.parent.name}.atlas')
            elif f.name.endswith('_1.json'):
                f.rename(f.parent / f'effect-{f.parent.name}.json')
            elif f.name.endswith('_1.webp'):
                f.rename(f.parent / f'effect-{f.parent.name}.webp')

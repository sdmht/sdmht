import csv
from pathlib import Path

card_info = Path('src/assets/data/ron_cfg_card_infor.csv').read_text('utf-8')
reader = csv.DictReader(card_info.splitlines(), delimiter=';')

name_ids: dict[str, list[str]] = {}
for row in reader:
    i = row['编号']
    if i:
        name_ids.setdefault(row['名称'], []).append(int(i))

for name, ids in name_ids.items():
    fond = []
    not_fond = []
    for i in ids:
        c = f'public/card/CardL_{i}.png'
        if not Path(c).exists():
            if i == max(ids):
                not_fond.append(c)
        else:
            fond.append(c)
    if not_fond and fond:
        print(f'{name} {ids}')
        print(f'fond: {fond}')
        print(f'not fond: {not_fond}')
        print()

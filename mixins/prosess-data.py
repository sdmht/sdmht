import csv
from pathlib import Path


def 读取数据(path: str, idk: str = '编号') -> list[dict[str, str]]:
    text = Path(path).read_text('utf-8')
    reader = csv.DictReader(text.splitlines(), delimiter=';')
    return sorted([row for row in reader if row[idk]], key=lambda x: x[idk])


def 保存数据(path: str, data: list[dict[str, str]], idk: str = '编号') -> None:
    data = sorted(data, key=lambda x: x[idk])
    writer = csv.DictWriter(
        Path(path).open('w', encoding='utf-8'),
        data[0].keys(),
        delimiter=';',
        lineterminator='\n',
    )
    writer.writeheader()
    writer.writerows(data)


def 按某键去重(path: str, key: str, idk: str = '编号') -> list[dict[str, str]]:
    data = 读取数据(path, idk)
    row_count = len(data)
    data = list({row[key]+row.get('仅系统用', ''): row for row in data}.values())
    new_row_count = len(data)
    if row_count != new_row_count:
        print(f'按 {key} 去重 {path}，删除 {row_count - new_row_count} 行')
    保存数据(path, data, idk)


# 按某键去重('src/assets/data/ron_cfg_card_bullet.csv', '卡牌名称')
# 按某键去重('src/assets/data/ron_cfg_card_effect.csv', '卡牌名称')
# 按某键去重('src/assets/data/ron_cfg_card_infor.csv', '名称')
# 按某键去重('src/assets/data/ron_cfg_card_sub.csv', '卡牌名称')
for i in [
    'ron_cfg_card_bullet.csv',
    'ron_cfg_card_effect.csv',
    'ron_cfg_card_infor.csv',
    'ron_cfg_card_sub.csv',
]:
    p = f'src/assets/data/{i}'
    保存数据(p, 读取数据(p))
使用过的技能编号集合 = set()
主神数据 = 读取数据('src/assets/data/ron_cfg_card_main.csv')
for 主神 in 主神数据:
    for i in ['技能1', '技能2', '技能3']:
        使用过的技能编号集合.add(主神[i])

附属神数据 = 读取数据('src/assets/data/ron_cfg_card_sub.csv')
for 附属神 in 附属神数据:
    使用过的技能编号集合.add(附属神['技能'])

弹幕卡数据 = 读取数据('src/assets/data/ron_cfg_card_bullet.csv')
for 弹幕卡 in 弹幕卡数据:
    使用过的技能编号集合.add(弹幕卡['技能'])

神迹卡数据 = 读取数据('src/assets/data/ron_cfg_card_effect.csv')
for 神迹卡 in 神迹卡数据:
    使用过的技能编号集合.add(神迹卡['技能'])


技能数据路径 = 'src/assets/data/ron_cfg_skill.csv'
技能编号名 = '技能ID'
技能数据 = 读取数据(技能数据路径, 技能编号名)

l1 = 0
l2 = len(使用过的技能编号集合)
while l1 != l2:
    l1 = len(使用过的技能编号集合)
    for 技能 in 技能数据:
        if 技能[技能编号名] in 使用过的技能编号集合:
            使用过的技能编号集合.update(技能['附带技能'].split(','))
        if 技能['效果类型'] in ['29', '108', '113', '118']:
            使用过的技能编号集合.update(技能['效果值'].split(','))
        if 技能['效果类型'] == '80':
            子技能 = next((_['技能1'] for _ in 主神数据 if _['编号'] == 技能['效果值']), None)
            if not 子技能:
                子技能 = next(_['技能'] for _ in 附属神数据 if _['编号'] == 技能['效果值'])
            使用过的技能编号集合.add(子技能)

    l2 = len(使用过的技能编号集合)

for i in 使用过的技能编号集合.copy():
    if i == '' or int(i) <= 10000:
        使用过的技能编号集合.remove(i)

改动前技能个数 = len(技能数据)
技能数据 = [技能 for 技能 in 技能数据 if 技能[技能编号名] in 使用过的技能编号集合]
改动后技能个数 = len(技能数据)
if 改动前技能个数 != 改动后技能个数:
    print(f'删除 {改动前技能个数 - 改动后技能个数} 个未使用的技能')
保存数据(技能数据路径, 技能数据, 技能编号名)

from pathlib import Path

include = [chr(ord(str(_))+65248) for _ in range(10)]


def fullwidth_to_halfwidth(char):
    """将全角字符转换为半角字符"""
    code = ord(char)
    if code == 0x3000:
        return chr(0x0020)
    return chr(code - 0xFEE0)


def convert_fullwidth_to_halfwidth(text):
    """转换字符串中的全角字符为半角字符，保留中文标点符号"""
    result = []
    for char in text:
        if char in include:
            result.append(fullwidth_to_halfwidth(char))
        else:
            result.append(char)
    return ''.join(result)


for f in Path('src/assets/data/').glob('*.csv'):
    f.write_text(convert_fullwidth_to_halfwidth(
        f.read_text(encoding='utf-8')), encoding='utf-8')

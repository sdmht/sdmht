import json
from pathlib import Path

pub_dir = Path('public/')
Path(
    'src/assets/index.json'
).write_text(
    json.dumps(
        list(str(_.relative_to(pub_dir)).replace('\\', '/')
             for _ in pub_dir.glob('**/*') if _.is_file()),
        ensure_ascii=False,
        indent=2
    ), 'utf-8')

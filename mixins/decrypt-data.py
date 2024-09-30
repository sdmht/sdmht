import base64
from pathlib import Path

from Crypto.Cipher import AES

root = Path(__file__).parent.parent

save_dir = root/'src'/'assets'/'assetbundle'/'data'
if not save_dir.exists():
    save_dir.mkdir(parents=True)

crypto = AES.new(b'78945612374185296301470258036900', AES.MODE_ECB)
for f in (root/'src'/'assets'/'assetbundle'/'data_000').glob('*'):
    data = crypto.decrypt(base64.b64decode(f.read_text('utf-8')))
    data = data.rstrip(data[-1:])
    (save_dir/f.name).write_bytes(data)

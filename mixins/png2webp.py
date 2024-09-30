# 将指定目录下的所有png文件用ffmpeg转换为webp文件并删除png文件
import subprocess
from pathlib import Path

# 指定目录
directory = "./src/assets/"
# 遍历目录下的所有文件
for file in Path(directory).glob("**/*.png"):
    # 使用ffmpeg将png文件转换为webp文件
    subprocess.run(["ffmpeg", "-i", file, file.with_suffix(".webp")])
    # 删除png文件
    file.unlink()
# 输出转换完成
print("转换完成")

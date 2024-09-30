# 将指定目录下的所有wav文件用ffmpeg转换为mp3文件并删除wav文件
import subprocess
from pathlib import Path

# 指定目录
directory = "./public/"
# 遍历目录下的所有文件
for file in Path(directory).glob("**/*.wav"):
    # 使用ffmpeg将wav文件转换为mp3文件
    subprocess.run(["ffmpeg", "-i", file, file.with_suffix(".mp3")])
    # 删除wav文件
    file.unlink()
# 输出转换完成
print("转换完成")

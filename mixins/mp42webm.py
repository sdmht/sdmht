# 将指定目录下的所有mp4文件用ffmpeg转换为webm文件并删除mp4文件
import subprocess
from pathlib import Path

# 指定目录
directory = "./public/"
# 遍历目录下的所有文件
for file in Path(directory).glob("**/*.mp4"):
    # 使用ffmpeg将mp4文件转换为webm文件
    subprocess.run(["ffmpeg", "-i", file, file.with_suffix(".webm")])
    # 删除mp4文件
    file.unlink()
# 输出转换完成
print("转换完成")

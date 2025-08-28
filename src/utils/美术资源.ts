import 静态文件列表 from 'assets/文件列表.json'

function 获得资源(
  美术资源: unknown[],
  检索函数: (f: string, i: unknown) => unknown,
) {
  for (const i of 美术资源) {
    const 索引 = 静态文件列表.findIndex((f) => 检索函数(f, i))
    if (索引 != -1) {
      const 文件 = 静态文件列表[索引]
      静态文件列表.push(...静态文件列表.splice(索引, 1))
      return 文件
    }
  }
}

export { 获得资源 }

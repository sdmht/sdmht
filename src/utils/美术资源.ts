import 静态文件列表 from 'assets/index.json'

// 静态文件清单只读索引，供 卡图() 快速判断图片是否存在
const 静态文件集合 = new Set(静态文件列表)

function 获得资源(
  美术资源: unknown[],
  检索函数: (f: string, i: unknown) => unknown
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

/**
 * 组卡界面等直接引用静态资源的场景使用：返回实际存在的卡图路径。
 * 需要的图缺失时自动替补，替补优先 maincard 的 CardS 小图，其次另一种卡图。
 * 首选 = 'L' 用于列表缩略图，'M' 用于已选卡片。
 */
function 卡图(美术资源: unknown, 首选: 'L' | 'M' = 'L') {
  if (美术资源 === undefined || 美术资源 === '' || 美术资源 === '0') {
    return ''
  }
  const 顺序 =
    首选 == 'L'
      ? ['card/CardL_', 'maincard/CardS_', 'card/CardM_']
      : ['card/CardM_', 'maincard/CardS_', 'card/CardL_']
  for (const 前缀 of 顺序) {
    const 路径 = `${前缀}${美术资源}.webp`
    if (静态文件集合.has(路径)) return 路径
  }
  // 全部缺失时退回首选路径，交由浏览器按原有行为处理
  return `${顺序[0]}${美术资源}.webp`
}

export { 获得资源, 卡图 }

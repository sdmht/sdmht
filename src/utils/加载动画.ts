import type { Scene } from 'phaser'
import { 获得资源 } from './美术资源'

// 使用 Phaser 场景来加载资源
async function 加载子画面(场景: Scene, key: string, url: string) {
  场景.load.image(key, url)
  场景.load.start()
  await new Promise((resolve) => 场景.load.once('complete', resolve))
  return 场景.add.image(0, 0, key).setOrigin(0)
}

async function 加载动画(
  场景: Scene,
  key: string,
  spine路径: string,
  atlas路径: string,
) {
  场景.load.spine(key, spine路径, atlas路径)
  场景.load.start()
  await new Promise((resolve) => 场景.load.once('complete', resolve))
  return 场景.add.spine(0, 0, key)
}

function 加载神动画(场景: Scene, 美术资源: number[]) {
  const spine文件 = 获得资源(美术资源, (f, i) => f === `spine/${i}/${i}.json`)
  const atlas文件 = 获得资源(美术资源, (f, i) => f === `spine/${i}/${i}.atlas`)
  if (spine文件 && atlas文件) {
    return 加载动画(场景, 美术资源.toString(), spine文件, atlas文件)
  }
  throw new Error(`找不到${美术资源}的神动画`)
}

function 加载普攻动画(场景: Scene, 美术资源: number[]) {
  const spine文件 = 获得资源(
    美术资源,
    (f, i) => f === `spine/${i}/effect-${i}.json`,
  )
  const atlas文件 = 获得资源(
    美术资源,
    (f, i) => f === `spine/${i}/effect-${i}.atlas`,
  )
  if (spine文件 && atlas文件) {
    return 加载动画(场景, 美术资源.toString(), spine文件, atlas文件)
  }
}

export { 加载动画, 加载子画面, 加载普攻动画, 加载神动画 }

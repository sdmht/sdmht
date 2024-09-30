import { Spine } from 'pixi-spine'
import * as PIXI from 'pixi.js'
import { 获得资源 } from './美术资源'

async function 加载子画面(url: string) {
  return new PIXI.Sprite(await PIXI.Assets.load(url))
}

async function 加载动画(路径: string) {
  const 资源 = await PIXI.Assets.load(路径)
  const 动画 = new Spine(资源.spineData)
  return 动画
}

function 加载神动画(美术资源: number[]) {
  const 文件 = 获得资源(美术资源, (f, i) => f === `spine/${i}/${i}.json`)
  if (文件) {
    return 加载动画(文件)
  }
  throw new Error(`找不到${美术资源}的神动画`)
}

function 加载普攻动画(美术资源: number[]) {
  const 文件 = 获得资源(美术资源, (f, i) => f === `spine/${i}/effect-${i}.json`)
  if (文件) {
    return 加载动画(文件)
  }
}

export { 加载动画, 加载子画面, 加载普攻动画, 加载神动画 }

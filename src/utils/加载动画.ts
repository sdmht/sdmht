import { Spine } from 'pixi-spine'
import * as PIXI from 'pixi.js'
import { 获得资源 } from './美术资源'

// PIXI 的 Assets 管理器只能初始化一次：任何 load / addBundle 都会触发隐式初始化。
// 首页、单位构造等位置都可能先于战场页加载资源，此时再调用 Assets.init({ manifest })
// 会告警，并且清单不会被注册。因此改用 addBundle 注册资源包（不受初始化状态影响），
// 用模块级标记保证整个应用只注册一次，避免重复注册触发覆盖告警。
let 资源包已注册 = false
function 注册资源包(bundles: PIXI.AssetsBundle[]) {
  if (资源包已注册) return
  资源包已注册 = true
  bundles.forEach(({ name, assets }) => PIXI.Assets.addBundle(name, assets))
}

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

export { 加载动画, 加载子画面, 加载普攻动画, 加载神动画, 注册资源包 }

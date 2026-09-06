import EventEmitter from 'events'
import { Notify } from 'quasar'
import type { 行动数据类型, 行动类型 } from './数据通道'
import { 玩家类 } from './游戏'

type 渲染类型 = [boolean, ...行动类型]
class 行动队列类 extends EventEmitter {
  static _行动队列?: 行动队列类
  static 通知列表: { 消息: string; 说明?: string; 颜色: string }[] = []
  static get 行动队列() {
    if (行动队列类._行动队列 === undefined) {
      行动队列类._行动队列 = new 行动队列类()
    }
    return 行动队列类._行动队列
  }
  渲染中: 渲染类型 | undefined
  待渲染: 渲染类型[] = []
  已渲染: 渲染类型[] = []
  // 技能立绘面板是否正在播放（由战场页显示技能UI维护）。
  // 逻辑层触发技能效果时以此为闸门：非卡牌技能先播完立绘演出，再结算效果，
  // 实现“先演出后结算”，避免伤害/迷雾等先于动画出现在棋盘上。
  技能展示中 = false
  技能展示完成等待者: Array<() => void> = []
  // 立绘全部播完的那一刻调用：唤醒在此等待结算的技能效果。
  // 用事件而非轮询唤醒，保证效果结算先于渲染尾的“播放下一条行动”，
  // 避免下一条行动抢先读取尚未结算的上一条效果。
  通知技能展示完成() {
    const 等待者 = this.技能展示完成等待者.splice(0)
    等待者.forEach((r) => r())
  }
  // 单张技能立绘面板播完：放行队首那个正在等待结算的效果。
  // 触发挂起顺序与面板入队顺序一致，FIFO 放行即“这张面板→它的效果”。
  通知技能面板播完() {
    const 放行 = this.技能展示完成等待者.shift()
    if (放行) 放行()
  }
  // 远程行动按发送方序号排序，消除网络乱序（点对点与服务器中转混用时尤其明显）
  下一个远程序号: number | null = null
  远程行动缓存 = new Map<number, 行动类型>()
  缺口计时: ReturnType<typeof setTimeout> | undefined
  添加(行动: 行动类型) {
    if (!玩家类.游戏结束) {
      this.emit('结算', true, 行动)
      this.待渲染.push([true, ...行动])
      this.emit('添加', 行动)
    }
  }
  接收(数据: 行动数据类型) {
    if (this.下一个远程序号 === null) {
      // 首个远程行动作为基准序号，避免开局前丢失消息导致永久卡死
      this.下一个远程序号 = 数据.序号
    }
    if (数据.序号 < this.下一个远程序号) {
      return // 重复或已过期（超时被跳过）的行动，直接丢弃
    }
    this.远程行动缓存.set(数据.序号, 数据.行动)
    this.交付远程行动()
  }
  // 按序号连续交付缓存中的远程行动；存在缺口时限时等待，超时跳过缺失序号
  交付远程行动() {
    const 基准 = this.下一个远程序号
    if (基准 === null) return
    let 序号 = 基准
    while (this.远程行动缓存.has(序号)) {
      const 行动 = this.远程行动缓存.get(序号)!
      this.远程行动缓存.delete(序号)
      序号++
      this.emit('结算', false, 行动)
      this.待渲染.push([false, ...行动])
    }
    this.下一个远程序号 = 序号
    if (this.远程行动缓存.size > 0) {
      if (this.缺口计时 === undefined) {
        this.缺口计时 = setTimeout(() => {
          this.缺口计时 = undefined
          const 起点 = this.下一个远程序号
          if (起点 === null) return
          let 序号 = 起点
          while (
            this.远程行动缓存.size > 0 &&
            !this.远程行动缓存.has(序号)
          ) {
            序号++ // 超时未到的缺失序号直接跳过，避免一方永久卡死
          }
          this.下一个远程序号 = 序号
          this.交付远程行动()
        }, 3000)
      }
    } else if (this.缺口计时 !== undefined) {
      clearTimeout(this.缺口计时)
      this.缺口计时 = undefined
    }
  }
  // 新一局开始时清空排序状态（行动队列是跨局单例）
  重置远程排序() {
    this.下一个远程序号 = null
    this.远程行动缓存.clear()
    if (this.缺口计时 !== undefined) {
      clearTimeout(this.缺口计时)
      this.缺口计时 = undefined
    }
  }
  渲染() {
    if (this.渲染中 === undefined) {
      this.渲染中 = this.待渲染.shift()
      if (this.渲染中 !== undefined) {
        this.emit('渲染', ...this.渲染中)
      }
    }
  }
  完成渲染() {
    if (this.渲染中 !== undefined) {
      this.已渲染.push(this.渲染中)
      this.渲染中 = undefined
    }
  }
  static 发送通知({
    message,
    color,
    caption,
    显示气泡 = false,
  }: {
    message: string
    caption?: string
    color: string
    显示气泡?: boolean
  }) {
    行动队列类.通知列表.unshift({
      消息: message,
      说明: caption,
      颜色: color,
    })
    if (显示气泡) {
      Notify.create({
        message: message,
        caption: caption,
        color: color,
        timeout: 666,
      })
    }
  }
}
export { 行动队列类 }

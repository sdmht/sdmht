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
  // 对手卡死/掉线、其回合倒计时已过却始终没有行动时，由本机代为注入一条「对手发起」的行动。
  // 只在本机结算与渲染，不走「添加」的发送链路：对手已无响应，发给他没有意义；
  // 也不占用远程序号，对手恢复后发来的行动仍按原序号正常处理。
  注入对手行动(行动: 行动类型) {
    if (玩家类.游戏结束) return
    this.emit('结算', false, 行动)
    this.待渲染.push([false, ...行动])
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

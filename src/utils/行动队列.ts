import EventEmitter from 'events'
import { Notify } from 'quasar'
import type { 行动类型 } from './数据通道'

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
  添加(行动: 行动类型) {
    this.emit('结算', true, 行动)
    this.待渲染.push([true, ...行动])
    this.emit('添加', 行动)
  }
  接收(行动: 行动类型) {
    this.emit('结算', false, 行动)
    this.待渲染.push([false, ...行动])
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
  }: {
    message: string
    caption?: string
    color: string
  }) {
    行动队列类.通知列表.push({
      消息: message,
      说明: caption,
      颜色: color,
    })
    Notify.create({
      message: message,
      caption: caption,
      color: color,
    })
  }
}
export { 行动队列类 }

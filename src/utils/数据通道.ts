import { useSubscription } from '@vue/apollo-composable'
import packageInfo from 'app/package.json'
import { EventEmitter } from 'events'
import { Notify } from 'quasar'
import SimplePeer from 'simple-peer'
import { graphql } from 'src/gen'
import { watch } from 'vue'
import { 我方编号 } from './在线'
import { 等待 } from './等待'
import { 位置类型 } from './类型'

type 行动类型 =
  | ['攻击', number, number, number]
  | ['移动', number, number, number]
  | ['神威']
  | ['回合结束']
  | ['祈愿']
  | ['装填弹幕', number, number]
  | ['使用神迹', number]
  | ['选择', number, number]
  | ['投降']

type 初始数据类型 = {
  主神: {
    id: number
    编号: number
    技能: 1 | 2 | 3
    位置: 位置类型
  }
  附属神: {
    id: number
    编号: number
    位置: 位置类型
  }[]
  弹幕卡: {
    id: number
    编号: number
  }[]
  神迹卡: {
    id: number
    编号: number
  }[]
}
type 数据同步类型 =
  | { k: '初始数据'; v: 初始数据类型 }
  | { k: '行动'; v: 行动类型 }

class 数据通道类 extends EventEmitter {
  emit(name: string, ...args: unknown[]) {
    console.log(name, ...args)
    // if (!location.protocol.endsWith('s:')) {
    //   Notify.create({
    //     message: name,
    //     caption: JSON.stringify(args),
    //   })
    // }
    return super.emit(name, ...args)
  }

  连接成功 = false

  开始匹配(格: number) {
    const 服务端通道 = useSubscription(
      graphql(`
        subscription matchOpponent(
          $uid: String!
          $size: Int!
          $version: String!
        ) {
          matchOpponent(uid: $uid, size: $size, version: $version)
        }
      `),
      { uid: 我方编号, size: 格, version: packageInfo.version }
    )
    const 匹配通知 = Notify.create({
      group: false,
      message: '匹配中',
      spinner: true,
      timeout: 0,
      type: 'ongoing',
    })
    this.on('连接成功', () => {
      匹配通知({
        message: '匹配成功',
        spinner: false,
        timeout: 2000,
        type: 'positive',
      })
    })
    this.on('销毁', () => {
      匹配通知()
    })

    let 发起者 = false
    let 对方编号 = ''

    服务端通道.onResult((param) => {
      const d = param.data?.matchOpponent
      if (typeof d === 'string') {
        if (d === '') {
          发起者 = true
        } else if (!对方编号) {
          对方编号 = d
          this.on('发送信令', (data) => {
            useSubscription(
              graphql(`
                subscription sendData($to: String!, $data: JSON!) {
                  sendData(to: $to, data: $data)
                }
              `),
              { to: 对方编号, data: data }
            )
          })
          this.开始点对点连接(发起者)
          const 通知连接成功 = () => {
            if (!this.连接成功) {
              this.连接成功 = true
              this.emit('连接成功', 对方编号)
            }
          }
          this.on('点对点连接成功', 通知连接成功)
          等待(3).then(通知连接成功)
          const 掉线监听 = useSubscription(
            graphql(`
              subscription listenAlive($uid: String!) {
                listenAlive(uid: $uid)
              }
            `),
            { uid: 对方编号 }
          )
          this.on('销毁', () => {
            掉线监听.stop()
          })
          掉线监听.onResult(() => {
            this.连接成功 = false
            this.emit('对方掉线')
            this.emit('销毁')
          })
        }
      } else if (typeof d === 'object') {
        if ('k' in d && 'v' in d) {
          this.emit('收到数据', d)
        } else {
          this.emit('收到信令', d)
        }
      }
    })

    this.on('销毁', () => {
      服务端通道.stop()
    })
  }

  static 点对点连接配置 = {
    iceServers: [
      {
        urls: ['stun:sdmht.star2000.work:34078'],
      },
    ],
  }
  点对点已连接 = false
  开始点对点连接(发起者: boolean) {
    const 点对点通道 = new SimplePeer({
      initiator: 发起者,
      config: 数据通道类.点对点连接配置,
    })
    this.on('收到信令', (d) => 点对点通道.signal(d))
    点对点通道.on('signal', (d) => this.emit('发送信令', d))
    点对点通道.on('connect', () => this.emit('点对点连接成功'))
    点对点通道.on('data', (d) =>
      this.emit('收到数据', JSON.parse(d.toString()))
    )
    watch(
      () => 点对点通道.connected,
      (connected) => (this.点对点已连接 = connected)
    )
    this.on('发送数据', (d) => {
      点对点通道.send(JSON.stringify(d))
    })
    this.on('销毁', () => {
      点对点通道.destroy()
    })
  }

  发送数据(d: 数据同步类型) {
    if (this.点对点已连接) {
      this.emit('发送数据', d)
    } else {
      this.emit('发送信令', d)
    }
  }
}

export { 初始数据类型, 数据同步类型, 数据通道类, 行动类型 }

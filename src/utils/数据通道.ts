import { useSubscription } from '@vue/apollo-composable'
import packageInfo from 'app/package.json'
import { EventEmitter } from 'events'
import { Notify } from 'quasar'
import SimplePeer from 'simple-peer'
import { graphql } from 'src/gen'
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
  | ['使用神迹', number, number?, number?]
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
  // 开局时各自本地生成的随机数，随初始数据发给对端。
  // 两端比较它决定先后手，与谁发起匹配无关，保证每局先后手都是随机的。
  抢先值: number
}
type 行动数据类型 = { 序号: number; 行动: 行动类型 }
type 数据同步类型 =
  | { k: '初始数据'; v: 初始数据类型 }
  | { k: '行动'; v: 行动数据类型 }
  // 本局资源加载完成后互相通知的“就绪”信号，双端都就绪才开始第一回合。
  // v 固定为 null 仅作占位：保证经服务器中转的游戏数据一律同时具备 k、v 两个键，
  // 让仍按“k、v 双键判数据”的老客户端也能正确识别，而不会被误当成信令。
  | { k: '就绪'; v: null }

// 经服务器中转的消息里，能交给 simple-peer.signal() 的只有这三类形状。
// 提前校验，避免把无关对象喂进去触发 “signal() called with invalid signal data”。
function 是合法信令(d: unknown): boolean {
  if (!d || typeof d !== 'object') return false
  const o = d as { type?: unknown; sdp?: unknown; candidate?: unknown }
  return (
    ((o.type === 'offer' || o.type === 'answer' || o.type === 'pranswer') &&
      'sdp' in o) ||
    (o.type === 'candidate' && !!o.candidate)
  )
}

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
  // 本局发送行动的递增序号，供对端还原接收顺序
  行动序号 = 0
  // 匹配时由服务器指定，两端必有一端为true，可用于打破两端对称的判断
  发起者 = false
  // 匹配成功后赋值的服务器转发入口：信令与 P2P 降级数据都从这里经服务器发给对方
  转发给对方: ((消息: unknown) => void) | undefined

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

    let 对方编号 = ''

    服务端通道.onResult((param) => {
      const d = param.data?.matchOpponent
      if (typeof d === 'string') {
        if (d === '') {
          this.发起者 = true
        } else if (!对方编号) {
          对方编号 = d
          // 所有需要发给对方的“信令”或“P2P 降级数据”统一经这里转发。
          // 转发内容保持原始形状、不额外包一层信封——旧版客户端只认“k、v 双键=数据、
          // 无 k=信令”的裸对象，包信封会让它们无法识别。辨识责任由发送端字段完备性承担。
          this.转发给对方 = (消息) => {
            if (!对方编号) return
            useSubscription(
              graphql(`
                subscription sendData($to: String!, $data: JSON!) {
                  sendData(to: $to, data: $data)
                }
              `),
              { to: 对方编号, data: 消息 }
            )
          }
          this.开始点对点连接(this.发起者)
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
      } else if (typeof d === 'object' && d !== null) {
        this.处理服务器消息(d)
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
    // 浏览器/WebView 可能完全不支持 WebRTC（没有 RTCPeerConnection），
    // 此时 new SimplePeer() 会直接抛 “No WebRTC support: Not a supported browser”，
    // 必须捕获并让整局退化为全程服务器中转（走 发送数据() 里的降级路径），
    // 而不是让这个异常中断匹配成功的对局。
    let 点对点通道: SimplePeer.Instance | undefined
    try {
      点对点通道 = new SimplePeer({
        initiator: 发起者,
        config: 数据通道类.点对点连接配置,
      })
    } catch (原因) {
      console.warn('[数据通道] 当前环境不支持 WebRTC，本局全程使用服务器中转：', 原因)
      this.点对点已连接 = false
    }
    if (点对点通道) {
      点对点通道.on('signal', (d) => this.转发给对方?.(d))
      点对点通道.on('connect', () => {
        // 在事件回调里同步设置状态，避免 watch 异步触发造成的竞态窗口
        this.点对点已连接 = true
        this.emit('点对点连接成功')
      })
      点对点通道.on('close', () => {
        // 断开后自动降级为服务器中转
        this.点对点已连接 = false
      })
      点对点通道.on('data', (d) =>
        this.emit('收到数据', JSON.parse(d.toString()))
      )
    }
    this.on('收到信令', (d) => {
      if (!点对点通道) {
        // 本端没有 P2P 连接：对端尝试建立直连的信令无需处理，等待服务器中继数据即可
        return
      }
      if (是合法信令(d)) {
        点对点通道.signal(d)
      } else {
        // 防御：绝不让形状错误的对象进入 simple-peer（会抛异常打断对局）
        console.warn('[数据通道] 忽略非法信令：', d)
      }
    })
    this.on('发送数据', (d) => {
      if (!点对点通道) {
        // 没有 P2P 连接：直接服务器中转
        this.转发给对方?.(d)
        return
      }
      try {
        点对点通道.send(JSON.stringify(d))
      } catch {
        // 点对点通道已失效，降级为服务器中转，保证行动不丢失
        this.点对点已连接 = false
        this.转发给对方?.(d)
      }
    })
    this.on('销毁', () => {
      点对点通道?.destroy()
    })
  }

  // 服务器中转消息的显式分流：带 k 字段的是游戏数据；其余对象必须是合法信令
  // 才交给 simple-peer，识别不了的丢弃并告警，杜绝数据被误当信令后
  // signal() 抛异常中断整场对局。
  处理服务器消息(d: object) {
    if ('k' in d) {
      this.emit('收到数据', d)
    } else if (是合法信令(d)) {
      this.emit('收到信令', d)
    } else {
      console.warn('[数据通道] 忽略无法识别的服务器消息：', d)
    }
  }

  发送行动(行动: 行动类型) {
    this.发送数据({ k: '行动', v: { 序号: this.行动序号++, 行动 } })
  }
  发送数据(d: 数据同步类型) {
    if (this.点对点已连接) {
      this.emit('发送数据', d)
    } else if (this.转发给对方) {
      // 降级为服务器中转。所有数据成员都同时带 k、v 两键（含占位的“就绪”），
      // 对端（含旧客户端）据此能与信令区分开。
      this.转发给对方(d)
    }
  }
}

export { 初始数据类型, 数据同步类型, 行动数据类型, 数据通道类, 行动类型 }

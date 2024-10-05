import * as PXUI from '@pixi/ui'
import { useTimeoutFn } from '@vueuse/core'
import 静态文件列表 from 'assets/index.json'
import EventEmitter from 'events'
import _ from 'lodash'
import * as PXSP from 'pixi-spine'
import * as PIXI from 'pixi.js'
import { Dialog, Notify } from 'quasar'
import {
  主神皮肤,
  弹幕卡信息列表,
  神迹卡信息列表,
  获得主神信息,
  获得卡信息,
  获得弹幕卡信息,
  获得技能信息,
  获得神迹卡信息,
  获得附属神信息,
  附属神皮肤,
} from './信息'
import { 加载子画面, 加载神动画 } from './加载动画'
import { 编号卡组类型 } from './卡组'
import {
  播放技能语音,
  播放死亡语音,
  播放角色背景音乐,
  播放音频,
} from './播放音频'
import { 初始数据类型, 行动类型 } from './数据通道'
import { 等待 } from './等待'
import { 获得资源 } from './美术资源'
import { 行动队列类 } from './行动队列'

EventEmitter.defaultMaxListeners = 0

class 随机类 {
  static 随机数种子 = _.random(true)
  /**
   * @returns 0~1的随机数
   */
  static 随机数() {
    this.随机数种子 = (this.随机数种子 * 9301 + 49297) % 233280
    console.log('随机数种子', this.随机数种子)
    return this.随机数种子 / 233280.0
  }
  static 乱序<T>(列表: T[]): T[] {
    const 随机数 = Math.floor(this.随机数() * 100)
    const 乱序列表 = []
    for (let i = 0; i < 列表.length; i++) {
      乱序列表.push(列表[(i + 随机数) % 列表.length])
    }
    return 乱序列表
  }
  static 抽样<T>(列表: T[]): T | undefined {
    return this.乱序(列表).at(0)
  }
  static 抽样列表<T>(列表: T[], 数量: number): T[] {
    return this.乱序(列表).slice(0, 数量)
  }
}
class 基类 extends EventEmitter {
  id: number
  constructor() {
    super()
    this.id = 随机类.随机数()
  }
  emit(eventName: string | symbol, ...args: unknown[]): boolean {
    console.log(this.constructor.name, eventName, ...args, this)
    return super.emit(eventName, ...args)
  }
}
class 目标类 extends 基类 {
  static 目标列表: 目标类[] = []
  是否我方: boolean
  效果列表: 效果类[] = []
  constructor(是否我方: boolean) {
    super()
    this.是否我方 = 是否我方
    目标类.目标列表.push(this)
  }
  我方<T extends 目标类>(类: new (...args: never[]) => T) {
    return 目标类.目标列表.filter(
      (x) => x instanceof 类 && x.是否我方 == this.是否我方
    ) as T[]
  }
  敌方<T extends 目标类>(类: new (...args: never[]) => T) {
    return 目标类.目标列表.filter(
      (x) => x instanceof 类 && x.是否我方 != this.是否我方
    ) as T[]
  }
}

class 技能类 extends 基类 {
  static 技能何时触发: Record<string, string> = {
    '0': '发动时',
    '1': '移动时',
    '2': '护盾值增加时',
    '3': '攻击时',
    '6': '己方回合开始时',
    '8': '任意附属神离场时',
    '11': '攻击命中时',
    '15': '游戏开始时',
    '19': '己方抽卡时',
    '20': '被攻击时',
    '21': '离场时',
    '22': '生命值减少时',
    '24': '装填弹幕时',
    '25': '己方任意单位被命中的同时暴露时',
    '26': '生命值增加时',
    '27': '己方每获得一张卡时',
    '28': '己方迷雾被解除时',
    '29': '己方使用神迹卡时',
    '30': '主神生命值低于触发辅助时',
    '31': '敌方回合开始时',
    '32': '效果值中合体素材单位同时在场时',
    '35': '己方回合开始且不处于迷雾时',
    '36': '己方回合开始且自身伙伴卡ID的单位在场时',
    '37': '任意单位离场时',
    '38': '攻击解除敌方单位迷雾时',
    '40': '攻击前',
    '50': '敌方使用神迹卡时',
    '51': '己方回合开始且周围8格存在单位时',
    '52': '敌方使用弹幕卡时',
    '61': '己方手牌数量变化时',
    '64': '编号为选择范围的召唤物登场时',
    '65': '任意附属神完全离场时',
    '67': '任意单位获得雷印时',
    '68': '敌方每获得一张卡时',
    '69': '装填编号为选择范围的弹幕卡时',
    '70': '任意单位完全离场时',
    '73': '护盾值变化时',
    '74': '己方回合开始且自身护盾为0时',
    '75': '己方回合开始且己方场上存在触发辅助个编号为选择范围的单位时',
    '76': '被攻击离场时',
    '77': '完全离场时',
    '78': '敌方附属神离场时',
  }
  static 技能目标类型: Record<string, string> = {
    '0': '',
    '1': '无单位的位置',
    '2': '不处于迷雾的单位',
    '3': '处于迷雾的单位',
    '4': '单位',
    '5': '玩家',
    '6': '自身',
    '7': '单位',
    '8': '位置',
    '9': '另一附属神',
    '10': '主神',
    '11': '攻击自身的单位',
    '20': '攻击命中的单位',
    '21': '有迷雾的位置',
    '22': '无迷雾的位置',
    '25': '无单位的位置',
    '26': '手牌',
    '31': '牌堆中的弹幕卡',
    '32': '自身左上到右下位置内的单位',
    '33': '秘术卡',
    '34': '召唤物',
    '35': '附属神',
    '36': '附属神',
    '37': '编号为选择范围的单位',
    '38': '父技能的目标',
    '39': '阵营编号为选择范围的单位',
    '40': '手牌中的神迹卡',
    '41': '封足的单位',
    '42': '手牌中的弹幕卡',
  }
  static 技能选择规则: Record<string, string> = {
    '0': '所有',
    '1': '选择',
    '2': '随机',
    '3': '镜像',
  }
  static 技能效果描述: Record<string, string> = {
    '-1': '',
    '1': '生命值+效果值',
    '2': '生命上限+效果值',
    '3': '基础攻击力+效果值',
    '4': '基础移动力+效果值',
    '5': '护盾值+效果值',
    '6': '召唤编号为效果值的单位',
    '7': '覆盖范围类型为选择范围的迷雾，0单2圆5十6横7竖17全',
    '8': '解除范围类型为选择范围的迷雾，0单2圆5十6横7竖17全',
    '9': '解除迷雾',
    '12': '抽效果值张卡',
    '13': '弹幕卡吟唱时间+效果值',
    '14': '清除',
    '19': '坚壁',
    '20': '攻击力=效果值%的生命值（向下取整）',
    '21': '获得效果值编号列表里的每张卡',
    '22': '生命值+效果值（无视护盾与圣盾）',
    '23': '舍弃所有手牌',
    '25': '挂buff',
    '27': '随机移动至迷雾区域（无迷雾时原地不动）',
    '28': '迷雾反转',
    '29': '获得编号为效果值的技能',
    '30': '祈愿倒计时+效果值',
    '31': '祈愿倒计时上限+效果值',
    '33': '解除随机2格迷雾（优先无单位）',
    '34': '解除十字区域迷雾',
    '35': '替换此技能为完全离场的附属神技能',
    '37': '获得效果值编号列表的随机一张神迹卡',
    '39': '行动点消耗+效果值',
    '59': '替换为编号为效果值的弹幕卡',
    '60': '消耗素材单位，合体为最后一个编号的单位',
    '72': '反击',
    '73': '弃效果值张牌',
    '74': '随机获得效果值编号列表里的buff',
    '75': '攻击消耗选择范围点行动点',
    '77': '行动点+效果值',
    '78': '在随机格迷雾内以效果值点生命值复活（不超过生命上限）',
    '79': '获得一张品质为效果值的神迹卡，1传说2稀有3普通',
    '80': '变化为效果值编号的神',
    '82': '获得一张品质为效果值的弹幕卡，1传说2稀有3普通',
    '83': '使用的神迹卡行动点消耗+效果值',
    '84': '攻击力等于手牌数',
    '88': '弹幕卡攻击力+效果值',
    '92': '无效化对手的神迹卡',
    '93': '复制对方使用的神迹卡，复制的卡消耗为0',
    '96': '场地上每拥有一个单位，恢复1点行动点',
    '97': '获得效果值编号列表里的随机一张弹幕卡',
    '98': '生命值+效果值%的攻击力（向下取整）',
    '99': '所有手牌行动点消耗+效果值',
    '101': '获得本局内使用过的所有秘术，行动点消耗变为0',
    '102': '获得一张随机秘术卡',
    '103': '净化',
    '104': '按效果值列表中的概率随机获得一张对应概率的编号的卡',
    '105': '生命值+攻击命中数量乘以效果值',
    '107': '本局内的编号为选择范围的卡永久+1攻击力(无视获得状态)',
    '108': '按效果值里的概率随机触发一个对应编号的技能',
    '109': '生命值无法降低到1点以下',
    '110': '自身受到的伤害降低效果值点',
    '111': '目标失去等同于自身攻击力的生命值',
    '113': '按顺序获得效果值列表里的技能，全部获得完毕后无法继续获得',
    '114': '攻击力=效果值%的护盾值（向下取整）',
    '115': '护盾上限+效果值',
    '116': '生命值+效果值乘以敌方单位的数量',
    '117': '基础攻击力+效果值%的编号为选择范围的单位的攻击力（向下取整）',
    '118': '按顺序施放效果值列表里的技能，全部施放完毕后则无法施放',
    '119': '重置疯乱',
    '120': '编号为选择范围的卡行动点消耗+效果值',
    '122': '生命值+效果值%的编号为选择范围的单位的攻击力（向下取整）',
    '124': '完全离场',
    '125': '攻击不可解除迷雾',
    '126': '抽效果值张弹幕卡',
    '127': '基础攻击力+按效果值列表中的概率随机判定一个值',
    '128': '攻击自身的单位完全离场',
    '129': '获得本局使用弹幕卡数量的效果值编号的卡',
    '130': '生命值+效果值%的自身护盾值（向下取整）',
    '131': '基础攻击力+效果值%的选择范围编号的单位的攻击力（向下取整）',
    '132': '随机召唤效果值列表里的一个单位',
    '133': '获得消耗在效果值列表里的随机一张弹幕卡',
  }
  是否禁用 = false
  编号: number
  父技能?: 技能类
  子技能列表: 技能类[] = []
  携带者: 单位类
  目标类型: string
  选择规则: string
  何时触发: string
  效果描述: string
  随机数量 = 1
  技能名称: string
  技能描述: string
  触发辅助: number
  选择范围: number
  对敌我方: number
  消耗: number
  本回合使用次数 = 0
  使用次数 = 0
  回合最大使用次数: number
  单场最大使用次数: number
  效果值: number[] = []
  附带技能: number[] = []
  get 目标同父技能(): boolean {
    return (
      this.父技能 != undefined &&
      (this.目标类型 == '父技能的目标' ||
        (this.父技能.选择规则 == '选择' && this.选择规则 == '选择'))
    )
  }
  _目标列表?: 目标类[]
  _目标列表缓存?: 目标类[]
  get 目标列表(): 目标类[] {
    if (this.父技能 && this.目标同父技能) {
      return this.父技能.目标列表
    }
    if (this._目标列表缓存 !== undefined) return this._目标列表缓存
    let 目标列表 = (
      this._目标列表 !== undefined ? this._目标列表 : 目标类.目标列表
    ).filter((v) => {
      if (this.目标类型 === '自身') {
        return v.id === this.携带者.id
      }
      if (!this.是否对敌我方(v)) return false
      if (this.目标类型.endsWith('玩家') && !(v instanceof 玩家类)) return false
      if (this.目标类型.endsWith('位置')) {
        if (!(v instanceof 位置类)) return false
        if (this.目标类型.startsWith('无单位的') && v.单位) return false
        if (this.目标类型.startsWith('有迷雾的') && !v.迷雾) return false
        if (this.目标类型.startsWith('无迷雾的') && v.迷雾) return false
      }
      if (this.目标类型.endsWith('单位')) {
        if (!(v instanceof 单位类)) return false
        if (this.目标类型.startsWith('不处于迷雾的') && v.位置.迷雾)
          return false
        if (this.目标类型.startsWith('处于迷雾的') && !v.位置.迷雾) return false
        if (this.目标类型.startsWith('封足的') && !v.封足) return false
        if (
          this.目标类型.startsWith('自身左上到右下位置内的') &&
          !v.位置.是否在范围内(this.携带者.位置, '米')
        )
          return false
        if (
          this.目标类型.startsWith('编号为选择范围的') &&
          v.编号 != this.选择范围
        )
          return false
        if (
          this.目标类型.startsWith('阵营编号为选择范围的') &&
          v.阵营 != this.选择范围
        )
          return false
      }
      if (
        this.目标类型.endsWith('召唤物') &&
        !(v instanceof 附属神类 && v.类型 == '召唤物')
      )
        return false
      if (this.目标类型.endsWith('附属神')) {
        if (!(v instanceof 附属神类 && v.类型 == '附属神')) return false
        if (this.目标类型.startsWith('另一') && v.id === this.携带者.id)
          return false
      }
      if (this.目标类型.endsWith('主神') && !(v instanceof 主神类)) return false
      if (this.目标类型.endsWith('弹幕卡') && !(v instanceof 弹幕卡类))
        return false
      if (
        this.目标类型.endsWith('秘术卡') &&
        !(v instanceof 神迹卡类 && v.类型 == '秘术卡')
      )
        return false
      if (this.目标类型.endsWith('神迹卡') && !(v instanceof 神迹卡类))
        return false
      if (this.目标类型.match('手牌') && !(v instanceof 牌类 && v.已抽到))
        return false
      if (this.目标类型.match('牌堆') && !(v instanceof 牌类 && !v.已抽到))
        return false
      return true
    })
    if (this.选择规则 == '随机') {
      目标列表 = _.sortBy(
        _.sortBy(随机类.乱序(目标列表), (a) =>
          a instanceof 位置类 && a.单位 ? 1 : -1
        ),
        (a) =>
          (a instanceof 位置类 || a instanceof 单位类) && a.迷雾不可被解除
            ? 1
            : -1
      ).slice(0, this.随机数量)
    }
    this._目标列表缓存 = 目标列表
    return 目标列表
  }

  /**
   * 当 this.效果值 是个一维数组，按编号、概率、编号、概率...的顺序排列时
   * 按概率获得随机编号
   */
  get 随机效果值() {
    let 总概率 = 0
    for (let i = 0; i < this.效果值.length; i += 2) {
      if (this._已使用效果值索引.includes(i)) continue
      总概率 += this.效果值[i + 1]
    }
    const 随机数 = 随机类.随机数()
    let 概率 = 0
    for (let i = 0; i < this.效果值.length; i += 2) {
      概率 += this.效果值[i + 1] / 总概率
      if (概率 > 随机数) {
        return this.效果值[i]
      }
    }
    return this.效果值[0]
  }
  /**
   * 当 this.效果值 是个一维数组，按编号、概率、编号、概率...的顺序排列时
   * 按概率获得不重复的随机编号
   */
  _已使用效果值索引: number[] = []
  get 随机不重复效果值() {
    let 总概率 = 0
    for (let i = 0; i < this.效果值.length; i += 2) {
      if (this._已使用效果值索引.includes(i)) continue
      总概率 += this.效果值[i + 1]
    }
    if (总概率) {
      const 随机数 = 随机类.随机数()
      let 概率 = 0
      for (let i = 0; i < this.效果值.length; i += 2) {
        if (this._已使用效果值索引.includes(i)) continue
        概率 += this.效果值[i + 1] / 总概率
        if (概率 > 随机数) {
          this._已使用效果值索引.push(i)
          return this.效果值[i]
        }
      }
    }
  }
  get 监听选择id(): number {
    return this.父技能 && this.目标同父技能 ? this.父技能.监听选择id : this.id
  }
  constructor(编号: number, 携带者: 单位类, 父技能?: 技能类, 神威?: boolean) {
    super()
    this.编号 = 编号
    this.携带者 = 携带者
    this.父技能 = 父技能
    const 信息 = 获得技能信息(编号)
    this.消耗 = 信息.消耗
    this.目标类型 = 技能类.技能目标类型[信息.目标类型]
    this.选择规则 = 技能类.技能选择规则[信息.选择规则]
    this.何时触发 = 技能类.技能何时触发[信息.何时触发]
    this.效果描述 = 技能类.技能效果描述[信息.效果类型]
    const 随机数量 = this.效果描述.match(/随机[0-9]+/)?.at(1)
    if (随机数量) {
      this.随机数量 = parseInt(随机数量)
    }
    this.技能名称 = 信息.技能名称
    this.技能描述 = 信息.技能描述
    this.触发辅助 = 信息.触发辅助
    this.选择范围 = 信息.选择范围
    this.对敌我方 = 信息.对敌我方
    this.携带者.玩家.on('回合开始时', () => {
      this.本回合使用次数 = 0
    })
    this.回合最大使用次数 = 信息.回合最大使用次数
    this.单场最大使用次数 = 信息.单场最大使用次数
    if (信息.附带技能) {
      if (typeof 信息.附带技能 == 'string') {
        if (信息.附带技能 !== '0') {
          this.附带技能 = 信息.附带技能.split(',').map((v) => parseInt(v))
        }
      } else if (typeof 信息.附带技能 == 'number') {
        this.附带技能.push(信息.附带技能)
      }
    }
    if (typeof 信息.效果值 === 'string') {
      this.效果值 = 信息.效果值.split(',').map((v) => parseInt(v))
    } else {
      this.效果值.push(信息.效果值)
    }
    this.on('触发', async (参数: Record<string, unknown>) => {
      this._目标列表缓存 = undefined
      switch (this.目标类型) {
        case '攻击命中的单位':
          this._目标列表 = 参数.攻击命中的单位列表 as 单位类[]
          break
        case '攻击自身的单位':
          this._目标列表 = [参数.攻击自身的单位 as 单位类]
          break
      }
      if (this.选择规则 === '镜像') {
        const 位置 = 参数.位置 as 位置类
        this._目标列表 = this.携带者
          .敌方(位置类)
          .filter((v) => v.行 == 位置.行 && v.列 == 位置.列)
      }
      if (this.选择规则 === '选择') {
        const 待选择的目标列表 = this.目标列表
        let 选中的目标索引: number | null = null
        if (this.携带者.是否我方 && !this.目标同父技能) {
          选中的目标索引 = await new Promise<number>((resolve) => {
            Dialog.create({
              title: '选择',
              options: {
                model: '0',
                items: 待选择的目标列表.map((v, i) => ({
                  value: `${i}`,
                  label:
                    v instanceof 位置类
                      ? `第${v.行}行，第${v.列}列`
                      : v instanceof 单位类
                      ? `${v.卡牌名称}，第${v.位置.行}，第行${v.位置.列}列`
                      : `${Object.getPrototypeOf(v).constructor.name}${v.id}`,
                })),
              },
              cancel: false,
              persistent: true,
            }).onOk((v) => {
              resolve(v)
            })
          })
          行动队列类.行动队列.添加(['选择', this.id, 选中的目标索引])
        } else {
          选中的目标索引 = await new Promise<number>((resolve) => {
            const handler = (是否我方: boolean, 行动: 行动类型) => {
              if (行动[0] == '选择' && 行动[1] == this.监听选择id) {
                行动队列类.行动队列.removeListener('结算', handler)
                resolve(行动[2])
              }
            }
            行动队列类.行动队列.on('结算', handler)
          })
        }
        const 选中的目标 = 待选择的目标列表[选中的目标索引] as 目标类
        this._目标列表缓存 =
          this.选择范围 && 选中的目标 instanceof 位置类
            ? 选中的目标
                .我方(位置类)
                .filter((v) => v.是否在范围内(选中的目标, this.选择范围))
            : [选中的目标]
      }

      switch (this.效果描述) {
        case '生命值+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('生命值变化', {
                变化值: this.效果值[0],
                真伤: this.何时触发 == '发动时',
              })
            }
          })
          break
        case '生命上限+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('生命上限变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '基础攻击力+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('基础攻击力变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '基础移动力+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('基础移动力变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '护盾值+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('护盾值变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '召唤编号为效果值的单位':
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              new 附属神类(v.玩家, this.效果值[0], v)
            }
          })
          break
        case '覆盖范围类型为选择范围的迷雾，0单2圆5十6横7竖17全':
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              v.覆盖迷雾()
            }
          })
          break
        case '解除范围类型为选择范围的迷雾，0单2圆5十6横7竖17全':
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              v.解除迷雾()
            }
          })
          break
        case '解除迷雾':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.位置.解除迷雾()
            }
          })
          break
        case '抽效果值张卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('抽卡', { 数量: this.效果值[0] })
            }
          })
          break
        case '弹幕卡吟唱时间+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类 && v.弹幕) {
              v.emit('吟唱时间变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '清除':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('清除')
            }
          })
          break
        case '坚壁':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              if (!v.坚壁.includes(this.携带者)) {
                v.坚壁.push(this.携带者)
                this.携带者.on('离场时', () => {
                  _.remove(v.坚壁, (i) => i === this.携带者)
                })
              }
            }
          })
          break
        case '攻击力=效果值%的生命值（向下取整）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              new 效果类(
                `攻击力=${Math.floor(v.生命值 * (this.效果值[0] / 100))}`,
                this.携带者,
                v
              )
            }
          })
          break
        case '获得效果值编号列表里的每张卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              this.效果值.forEach((i) => {
                v.emit('获得卡', { 编号: i })
              })
            }
          })
          break
        case '生命值+效果值（无视护盾与圣盾）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('生命值变化', { 变化值: this.效果值[0], 真伤: true })
            }
          })
          break
        case '舍弃所有手牌':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('弃牌', { 数量: v.手牌.length })
            }
          })
          break
        case '挂buff':
          {
            const 效果描述 = 效果类.效果数据[this.效果值[0]]
            this.目标列表.forEach((v) => {
              new 效果类(效果描述, this.携带者, v)
            })
          }
          break
        case '随机移动至迷雾区域（无迷雾时原地不动）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              const 目标位置 = 随机类.抽样(
                v.我方(位置类).filter((i) => i.迷雾 && !i.单位)
              )
              if (目标位置) {
                v.传送(目标位置)
              }
            }
          })
          break
        case '迷雾反转':
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              if (v.迷雾) {
                v.解除迷雾()
              } else {
                v.覆盖迷雾()
              }
            }
          })
          break
        case '获得编号为效果值的技能':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              new 技能类(this.效果值[0], v)
            }
          })
          break
        case '祈愿倒计时+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('祈愿倒计时变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '祈愿倒计时上限+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('祈愿倒计时上限变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '解除随机2格迷雾（优先无单位）':
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              v.解除迷雾()
            }
          })
          break
        case '解除十字区域迷雾':
          this.目标列表.forEach((i) => {
            if (i instanceof 单位类) {
              i.我方(位置类).forEach((v) => {
                if (v.是否在范围内(i.位置, '十')) {
                  v.解除迷雾()
                }
              })
            }
          })
          break
        case '替换此技能为完全离场的附属神技能':
          new 技能类((参数['单位'] as 附属神类).主技能编号, this.携带者)
          break
        case '获得效果值编号列表的随机一张神迹卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', { 编号: 随机类.抽样(this.效果值) })
            }
          })
          break
        case '行动点消耗+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 牌类) {
              v.emit('消耗变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '替换为编号为效果值的弹幕卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('替换弹幕', { 弹幕卡编号: this.效果值[0] })
            }
          })
          break
        case '消耗素材单位，合体为最后一个编号的单位':
          ;(参数['召唤物列表'] as 附属神类[]).forEach((v) => {
            v.emit('离场')
          })
          this.目标列表.forEach((v) => {
            if (v instanceof 位置类) {
              new 附属神类(
                this.携带者.玩家,
                this.效果值[this.效果值.length - 1],
                v
              )
            }
          })
          break
        case '反击':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('生命值变化', { 变化值: -this.携带者.攻击力 })
            }
          })
          break
        case '弃效果值张牌':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('弃牌', { 数量: this.效果值[0] })
            }
          })
          break
        case '随机获得效果值编号列表里的buff':
          {
            const 效果描述 = 效果类.效果数据[随机类.乱序(this.效果值)[0]]
            this.目标列表.forEach((v) => {
              new 效果类(效果描述, this.携带者, v)
            })
          }
          break
        case '攻击消耗选择范围点行动点':
          break
        case '行动点+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('行动点变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '在随机格迷雾内以效果值点生命值复活（不超过生命上限）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类 && v.生命上限 > 0) {
              v.未完全离场 = true
              const 位置 = _.sortBy(
                随机类.乱序(v.我方(位置类).filter((l) => !l.单位)),
                (l) => (l.迷雾 ? -1 : 1)
              )[0]
              if (v instanceof 主神类) {
                v.玩家.主神 = new 主神类(
                  v.玩家,
                  v.编号,
                  v.神威序号,
                  位置,
                  this.效果值[0]
                )
              } else if (v instanceof 附属神类) {
                new 附属神类(v.玩家, v.编号, 位置, this.效果值[0])
              }
            }
          })
          break
        case '获得一张品质为效果值的神迹卡，1传说2稀有3普通':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', {
                编号: 随机类.抽样(
                  神迹卡信息列表
                    .filter((l) => l.品质 == this.效果值[0] && l.仅系统用 == 0)
                    .map((l) => l.编号)
                ),
              })
            }
          })
          break
        case '变化为效果值编号的神':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('变化', { 编号: this.效果值[0] })
            }
          })
          break
        case '获得一张品质为效果值的弹幕卡，1传说2稀有3普通':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', {
                编号: 随机类.抽样(
                  弹幕卡信息列表
                    .filter((l) => l.品质 == this.效果值[0] && l.仅系统用 == 0)
                    .map((l) => l.编号)
                ),
              })
            }
          })
          break
        case '使用的神迹卡行动点消耗+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.回合首次神迹卡消耗变化值 = this.效果值[0]
            }
          })
          break
        case '攻击力等于手牌数':
          {
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                new 效果类(`攻击力=${v.玩家.手牌.length}`, this.携带者, v)
              }
            })
          }
          break
        case '弹幕卡攻击力+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 弹幕卡类) {
              v.emit('攻击力变化', this.效果值[0])
            }
          })
          break
        case '无效化对手的神迹卡':
          break
        case '复制对方使用的神迹卡，复制的卡消耗为0':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', {
                编号: (参数['神迹卡'] as 神迹卡类).编号,
                消耗: 0,
              })
            }
          })
          break
        case '场地上每拥有一个单位，恢复1点行动点':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('行动点变化', { 变化值: v.我方(单位类).length })
            }
          })
          break
        case '获得效果值编号列表里的随机一张弹幕卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', { 编号: 随机类.抽样(this.效果值) })
            }
          })
          break
        case '生命值+效果值%的攻击力（向下取整）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('生命值变化', {
                变化值: Math.floor(v.攻击力 * (this.效果值[0] / 100)),
              })
            }
          })
          break
        case '所有手牌行动点消耗+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 牌类) {
              v.emit('消耗变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '获得本局内使用过的所有秘术，行动点消耗变为0':
          this.目标列表.forEach((p) => {
            if (p instanceof 玩家类) {
              p.我方(神迹卡类)
                .filter((v) => v.类型 == '秘术卡' && v.已使用)
                .forEach((v) => {
                  p.emit('获得卡', { 编号: v.编号, 消耗: 0 })
                })
            }
          })
          break
        case '获得一张随机秘术卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', {
                编号: 随机类.抽样(
                  神迹卡信息列表
                    .filter((l) => l.类型 == 2 && l.仅系统用 == 0)
                    .map((l) => l.编号)
                ),
              })
            }
          })
          break
        case '净化':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('净化')
            }
          })
          break
        case '按效果值列表中的概率随机获得一张对应概率的编号的卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('获得卡', { 编号: this.随机效果值 })
            }
          })
          break
        case '生命值+攻击命中数量乘以效果值':
          {
            const 生命值变化值 =
              (参数['攻击命中的单位列表'] as 单位类[]).length * this.效果值[0]
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('生命值变化', {
                  变化值: 生命值变化值,
                })
              }
            })
          }
          break
        case '本局内的编号为选择范围的卡永久+1攻击力(无视获得状态)':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.手牌.forEach((v) => {
                if (v.编号 == this.选择范围) {
                  v.emit('攻击力变化', { 变化值: 1 })
                }
              })
              v.on('每获得一张卡时', (参数: { 卡: 牌类 }) => {
                if (参数.卡.编号 == this.选择范围) {
                  参数.卡.emit('攻击力变化', { 变化值: 1 })
                }
              })
            }
          })
          break
        case '按效果值里的概率随机触发一个对应编号的技能':
          {
            const 随机技能编号 = this.随机不重复效果值
            if (随机技能编号 !== undefined)
              this.目标列表.forEach((v) => {
                if (v instanceof 单位类) {
                  new 技能类(随机技能编号, v)
                }
              })
          }
          break
        case '生命值无法降低到1点以下':
          break
        case '自身受到的伤害降低效果值点':
          break
        case '目标失去等同于自身攻击力的生命值':
          {
            const 生命值变化值 = -this.携带者.攻击力
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('生命值变化', { 变化值: 生命值变化值 })
              }
            })
          }
          break
        case '按顺序获得效果值列表里的技能，全部获得完毕后无法继续获得':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类 && v.常世异术 < this.效果值.length) {
              new 技能类(this.效果值[v.常世异术], v)
              v.常世异术++
            }
          })
          break
        case '攻击力=效果值%的护盾值（向下取整）':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              new 效果类(
                `攻击力=${Math.floor(v.护盾值 * (this.效果值[0] / 100))}`,
                this.携带者,
                v
              )
            }
          })
          break
        case '护盾上限+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('护盾上限变化', { 变化值: this.效果值[0] })
            }
          })
          break
        case '生命值+效果值乘以敌方单位的数量':
          {
            const 变化值 = this.效果值[0] * this.携带者.敌方(单位类).length
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('生命值变化', { 变化值 })
              }
            })
          }
          break
        case '基础攻击力+效果值%的编号为选择范围的单位的攻击力（向下取整）':
          {
            const 攻击力变化值 = Math.floor(
              (this.携带者
                .我方(单位类)
                .filter((v) => v.编号 === this.选择范围)
                .at(0)?.攻击力 ?? 0) *
                (this.效果值[0] / 100)
            )
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('基础攻击力变化', { 变化值: 攻击力变化值 })
              }
            })
          }
          break
        case '按顺序施放效果值列表里的技能，全部施放完毕后则无法施放':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类 && v.疯乱 < this.效果值.length) {
              new 技能类(this.效果值[v.疯乱], v)
              v.疯乱++
            }
          })
        case '重置疯乱':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.疯乱 = 0
            }
          })
          break
        case '编号为选择范围的卡行动点消耗+效果值':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.手牌.forEach((p) => {
                if (p.编号 === this.选择范围) {
                  p.emit('消耗变化', { 变化值: this.效果值[0] })
                }
              })
            }
          })
          break
        case '生命值+效果值%的编号为选择范围的单位的攻击力（向下取整）':
          {
            const 变化值 = Math.floor(
              (this.携带者
                .我方(单位类)
                .filter((v) => v.编号 === this.选择范围)
                .at(0)?.攻击力 ?? 0) *
                (this.效果值[0] / 100)
            )
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('生命值变化', { 变化值 })
              }
            })
          }
          break
        case '完全离场':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('完全离场')
            }
          })
          break
        case '攻击不可解除迷雾':
          break
        case '抽效果值张弹幕卡':
          this.目标列表.forEach((v) => {
            if (v instanceof 玩家类) {
              v.emit('抽卡', { 数量: this.效果值[0], 条件: { 类型: '弹幕卡' } })
            }
          })
          break
        case '基础攻击力+按效果值列表中的概率随机判定一个值':
          {
            const 攻击力变化值 = this.随机效果值
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('基础攻击力变化', { 变化值: 攻击力变化值 })
              }
            })
          }
          break
        case '攻击自身的单位完全离场':
          this.目标列表.forEach((v) => {
            if (v instanceof 单位类) {
              v.emit('完全离场')
            }
          })
          break
        case '获得本局使用弹幕卡数量的效果值编号的卡':
          {
            const 本局使用弹幕卡数量 = this.携带者
              .我方(弹幕卡类)
              .filter((v) => v.已使用).length
            this.目标列表.forEach((v) => {
              if (v instanceof 玩家类) {
                v.emit('获得卡', {
                  编号: this.效果值[0],
                  数量: 本局使用弹幕卡数量,
                })
              }
            })
          }
          break
        case '生命值+效果值%的自身护盾值（向下取整）':
          {
            const 变化值 = Math.floor(
              this.携带者.护盾值 * (this.效果值[0] / 100)
            )
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('生命值变化', { 变化值 })
              }
            })
          }
          break
        case '基础攻击力+效果值%的选择范围编号的单位的攻击力（向下取整）':
          {
            const 攻击力变化值 = Math.floor(
              (this.携带者
                .我方(单位类)
                .filter((v) => v.编号 === this.选择范围)
                .at(0)?.攻击力 ?? 0) *
                (this.效果值[0] / 100)
            )
            this.目标列表.forEach((v) => {
              if (v instanceof 单位类) {
                v.emit('基础攻击力变化', { 变化值: 攻击力变化值 })
              }
            })
          }
          break
        case '随机召唤效果值列表里的一个单位':
          {
            const 召唤物编号 = 随机类.乱序(this.效果值)[0]
            this.目标列表.forEach((v) => {
              if (v instanceof 位置类) {
                new 附属神类(this.携带者.玩家, 召唤物编号, v)
              }
            })
          }
          break
        case '获得消耗在效果值列表里的随机一张弹幕卡':
          {
            const 弹幕卡编号 = 随机类.乱序(
              弹幕卡信息列表
                .filter((v) => v.仅系统用 == 0 && this.效果值.includes(v.消耗))
                .map((v) => v.编号)
            )[0]
            this.目标列表.forEach((v) => {
              if (v instanceof 玩家类) {
                v.emit('获得卡', { 编号: 弹幕卡编号 })
              }
            })
          }
          break
      }
      this.emit('触发时')
    })
    switch (this.何时触发) {
      case '发动时':
        if (神威) {
          this.携带者.on('发动神威', () => {
            this.触发()
          })
        } else {
          this.触发()
        }
        break
      case '被攻击时':
      case '攻击解除敌方单位迷雾时':
      case '攻击命中时':
      case '攻击前':
      case '攻击时':
      case '护盾值增加时':
      case '护盾值变化时':
      case '生命值减少时':
      case '移动时':
      case '被攻击离场时':
      case '生命值增加时':
      case '离场时':
      case '完全离场时':
      case '装填弹幕时':
        this.携带者.on(this.何时触发, (参数) => this.触发(参数))
        break
      case '装填编号为选择范围的弹幕卡时':
        this.携带者.on('装填弹幕时', () => {
          if (this.携带者.弹幕?.编号 === this.选择范围) this.触发()
        })
        break
      case '敌方附属神离场时':
      case '敌方回合开始时':
      case '敌方每获得一张卡时':
      case '敌方使用弹幕卡时':
      case '敌方使用神迹卡时':
      case '己方抽卡时':
      case '己方回合开始时':
      case '己方每获得一张卡时':
      case '己方迷雾被解除时':
      case '己方任意单位被命中的同时暴露时':
      case '己方使用神迹卡时':
      case '己方手牌数量变化时':
      case '任意单位获得雷印时':
      case '任意单位离场时':
      case '任意单位完全离场时':
      case '任意附属神离场时':
      case '任意附属神完全离场时':
      case '游戏开始时':
        玩家类.事件.on(
          this.何时触发.replace(/^(敌方|己方|任意)/, ''),
          (参数: { 玩家: 玩家类 }) => {
            if (this.何时触发.startsWith('己方')) {
              if (参数.玩家.id == this.携带者.玩家.id) this.触发(参数)
            } else if (this.何时触发.startsWith('敌方')) {
              if (参数.玩家.id != this.携带者.玩家.id) this.触发(参数)
            } else {
              this.触发(参数)
            }
          }
        )
        break
      case '效果值中合体素材单位同时在场时':
        this.携带者.on('登场时', () => {
          const 召唤物列表: 附属神类[] = []
          for (let i = 0; i < this.效果值.length - 1; i++) {
            for (const v of this.携带者.我方(附属神类)) {
              if (
                v.类型 == '召唤物' &&
                !召唤物列表.includes(v) &&
                v.编号 == this.效果值[i]
              ) {
                召唤物列表.push(v)
                break
              }
            }
          }
          if (召唤物列表.length === this.效果值.length - 1)
            this.触发({ 召唤物列表 })
        })
        break
      case '编号为选择范围的召唤物登场时':
        this.携带者.玩家.on('召唤物登场时', (召唤物: 附属神类) => {
          if (召唤物.编号 === this.选择范围) this.触发()
        })
        break
      case '主神生命值低于触发辅助时':
        this.携带者.玩家.on('主神登场时', (v) => {
          if (v.生命值 < this.触发辅助) this.触发()
        })
        this.携带者.玩家.on('主神生命值减少时', (参数: { 单位: 主神类 }) => {
          if (参数.单位.生命值 < this.触发辅助) this.触发()
        })
        break
      case '己方回合开始且不处于迷雾时':
        this.携带者.玩家.on('回合开始时', () => {
          if (!this.携带者.位置.迷雾) this.触发()
        })
        break
      case '己方回合开始且己方场上存在触发辅助个编号为选择范围的单位时':
        this.携带者.玩家.on('回合开始时', () => {
          if (
            this.携带者.我方(单位类).filter((v) => v.编号 === this.选择范围)
              .length >= this.触发辅助
          )
            this.触发()
        })
        break
      case '己方回合开始且周围8格存在单位时':
        this.携带者.玩家.on('回合开始时', () => {
          if (
            this.携带者
              .我方(单位类)
              .some((v) => v.位置.是否在范围内(this.携带者.位置, '米', false))
          )
            this.触发()
        })
        break
      case '己方回合开始且自身护盾为0时':
        this.携带者.玩家.on('回合开始时', () => {
          if (this.携带者.护盾值 === 0) this.触发()
        })
        break
      case '己方回合开始且自身伙伴卡ID的单位在场时':
        this.携带者.玩家.on('回合开始时', () => {
          if (
            this.携带者
              .我方(附属神类)
              .some((v) => v.伙伴卡ID === this.携带者.编号)
          )
            this.触发()
        })
        break
    }
    switch (this.效果描述) {
      case '攻击消耗选择范围点行动点':
        this.携带者.回合首次攻击消耗 = this.选择范围
        break
      case '生命值无法降低到1点以下':
        this.目标列表.forEach((v) => {
          if (v instanceof 单位类) {
            v.永生 = true
          }
        })
        break
      case '自身受到的伤害降低效果值点':
        this.目标列表.forEach((v) => {
          if (v instanceof 单位类) {
            v.忍耐 = this.效果值[0]
          }
        })
        break
      case '攻击不可解除迷雾':
        this.目标列表.forEach((v) => {
          if (v instanceof 单位类) {
            v.攻击可解除迷雾 = false
          }
        })
        break
      case '无效化对手的神迹卡':
        this.目标列表.forEach((v) => {
          if (v instanceof 玩家类) {
            v.无效化下次使用的神迹卡 = true
          }
        })
        break
    }
    this.携带者.技能列表.push(this)
    this.父技能?.子技能列表.push(this)
    this.附带技能.forEach((v) => {
      new 技能类(v, this.携带者, this, 神威)
    })
  }
  是否禁止触发() {
    return (
      this.是否禁用 ||
      (this.回合最大使用次数 > 0 &&
        this.本回合使用次数 >= this.回合最大使用次数) ||
      (this.单场最大使用次数 > 0 && this.使用次数 >= this.单场最大使用次数)
    )
  }
  可触发() {
    return !(this.是否禁止触发() || 玩家类.行动点 < this.消耗)
  }
  消耗结算() {
    玩家类.事件.emit('行动点变化', { 变化值: -this.消耗 })
  }
  触发(参数: Record<string, unknown> = {}) {
    游戏开始前执行(
      () => {
        if (this.是否禁止触发()) return
        this.本回合使用次数++
        this.使用次数++
        this.emit('触发', 参数)
        行动队列类.发送通知({
          message: `触发技能：${this.技能名称}，携带者：${this.携带者.类型}${this.携带者.卡牌名称}`,
          caption: this.技能描述,
          color: this.携带者.是否我方 ? 'blue' : 'red',
        })
      },
      this.编号,
      this.携带者.是否我方
    )
  }
  是否对敌我方(目标: 目标类) {
    if (this.携带者.是否我方 == 目标.是否我方) {
      if (this.对敌我方 == 0) return false
    } else {
      if (this.对敌我方 == 1) return false
    }
    return true
  }
  级联禁用() {
    this.是否禁用 = true
    this.子技能列表.forEach((v) => v.级联禁用())
  }
}

class 效果类 extends 基类 {
  static 效果列表: 效果类[] = []
  static 效果数据: Record<string, string> = {
    '1': '迷雾不可被解除，持续1回合',
    '2': '迷雾不可被解除',
    '3': '圣盾',
    '4': '攻击力+2，持续1回合',
    '5': '攻击力-10，持续1回合',
    '6': '移动力+3，持续1回合',
    '7': '移动力+2，持续1回合',
    '8': '封刃，持续1回合',
    '9': '封足，持续1回合',
    '10': '生命值-2',
    '11': '生命值+10，持续2回合',
    '13': '攻击力+2，持续2回合',
    '15': '封足，持续2回合',
    '17': '攻击力+1，持续1回合',
    '18': '攻击力+2，持续1回合',
    '19': '移动力=0',
    '22': '攻击力+3，持续1回合',
    '24': '移动力+1，持续1回合',
    '28': '封刃，持续1回合',
    '31': '封足，持续1回合',
    '32': '封刃，持续1回合',
    '34': '迷雾不可被解除，持续1回合',
    '35': '封足，持续1回合',
    '36': '生命值+5，持续3回合',
    '37': '攻击力+1',
    '38': '攻击力+3，持续1回合',
    '39': '攻击力+4，持续1回合',
    '40': '攻击力+2，持续1回合',
    '41': '雷印',
    '43': '攻击力-2，持续1回合',
    '44': '攻击力-6，持续1回合',
    '45': '攻击力+1，持续1回合',
    '46': '攻击力-5，持续1回合',
    '47': '攻击力-3，持续2回合',
    '48': '攻击力-5，持续2回合',
    '50': '攻击力=3，持续1回合',
    '51': '无敌',
    '53': '生命值+8，持续3回合',
    '54': '攻击力+5，持续1回合',
    '55': '攻击力+1，持续2回合',
    '56': '攻击力+2，持续2回合',
    '57': '攻击力+2，持续2回合',
    '58': '攻击力+2，持续2回合',
    '59': '攻击力+2，持续2回合',
    '60': '攻击力+3，持续2回合',
    '61': '攻击力+3，持续2回合',
    '62': '攻击力+3，持续2回合',
    '63': '攻击力+10，持续1回合',
    '64': '攻击力-10，持续1回合',
    '65': '生命值+2，持续3回合',
    '67': '攻击力+6，持续1回合',
    '68': '生命值+10，持续2回合',
    '69': '攻击力+2，持续1回合',
    '70': '迷雾不可被解除，持续1回合',
    '71': '封足，持续2回合，不可被净化',
    '72': '封足，持续2回合',
    '75': '攻击力-2，持续1回合',
    '76': '生命值-3，持续3回合',
    '78': '封刃，持续1回合',
    '79': '攻击力-10，持续1回合，不可被净化',
    '80': '诅咒，持续1回合',
    '81': '攻击力-3，持续1回合',
    '82': '封刃，持续1回合，不可被净化',
    '83': '攻击力+3，持续1回合',
    '84': '攻击力-2，持续2回合',
    '85': '攻击力-2，持续1回合',
    '86': '攻击力+4，持续1回合',
  }
  持续回合?: number
  触发次数 = 0
  是否已结束 = false
  发动者: 单位类
  目标: 目标类
  描述: string
  效果: string
  效果值 = 1
  是否等于: boolean
  不可被净化 = false
  constructor(描述: string, 发动者: 单位类, 目标: 目标类) {
    super()
    this.发动者 = 发动者
    this.目标 = 目标
    this.描述 = 描述.replace(/\+-/g, '-')
    this.效果 = this.描述.match(/^[一-龟]+/)?.at(0) ?? ''
    this.是否等于 = this.描述.startsWith(`${this.效果}=`)
    if (this.描述.match(`${this.效果}[+-=]`)) {
      this.效果值 = parseInt(
        this.描述.match(`${this.效果}[+-=]([0-9]+)`)!.at(1)!
      )
      if (this.描述.startsWith(`${this.效果}-`)) {
        this.效果值 = -this.效果值
      }
    }
    const 回合 = this.描述.match(/持续(\d+)回合/)?.at(1)
    if (回合) {
      this.持续回合 = parseInt(回合)
    }
    if (
      !this.描述.match(/^(生命值|攻击力|移动力|封足|封刃|圣盾)/) ||
      this.描述.match(/不可被净化/)
    ) {
      this.不可被净化 = true
    }
    this.发动者.玩家.on('回合开始时', () => {
      if (
        !this.是否已结束 &&
        (this.持续回合 === undefined || this.持续回合 > this.触发次数)
      ) {
        this.emit('效果开始')
      } else if (this.持续回合 == this.触发次数) {
        this.emit('效果结束')
      }
    })

    this.on('效果开始', () => {
      this.触发次数++
      if (目标 instanceof 单位类) {
        行动队列类.发送通知({
          message: `${目标.卡牌名称}${this.描述}，发动者：${this.发动者.卡牌名称}`,
          color: 发动者.是否我方 == 目标.是否我方 ? 'blue' : 'red',
        })
      }
      目标.emit(`${this.效果}变化`, {
        变化值: this.效果值,
        是否等于: this.是否等于,
      })
    })
    this.on('效果结束', () => {
      this.是否已结束 = true
      _.remove(目标.效果列表, (x) => x.是否已结束)
      _.remove(效果类.效果列表, (x) => x.是否已结束)
      目标.emit(`${this.效果}变化时`)
    })
    if (
      this.持续回合 == undefined &&
      ['迷雾不可被解除', '无敌'].includes(this.效果)
    ) {
      发动者.on('离场', () => {
        this.emit('效果结束')
      })
    }
    目标.效果列表.push(this)
    效果类.效果列表.push(this)
    this.emit('效果开始')
  }
}
class 位置类 extends 目标类 {
  迷雾 = true
  盖雾倒计时 = 0
  玩家: 玩家类
  单位?: 单位类
  行 = 0
  列 = 0

  get 迷雾不可被解除() {
    return this.效果列表.findIndex((x) => x.效果 == '迷雾不可被解除') !== -1
  }

  constructor(玩家: 玩家类, 行: number, 列: number) {
    super(玩家.是否我方)
    this.玩家 = 玩家
    this.行 = 行
    this.列 = 列
    this.on('迷雾不可被解除变化', () => {
      this.覆盖迷雾()
    })
  }

  emit(事件名: string, 参数: Record<string, unknown> = {}): boolean {
    const 有监听器 = super.emit(事件名, 参数)
    this.单位?.emit(事件名, { ...参数, 位置: this })
    this.玩家.emit(事件名, { ...参数, 位置: this })
    return 有监听器
  }

  解除迷雾() {
    const 迷雾可被解除 =
      this.迷雾 && !this.迷雾不可被解除 && !this.单位?.迷雾不可被解除
    if (迷雾可被解除) {
      this.迷雾 = false
      this.盖雾倒计时 = 3
      this.emit('迷雾被解除时')
    }
    return 迷雾可被解除
  }

  覆盖迷雾() {
    const 迷雾可被覆盖 =
      !this.迷雾 &&
      (this.迷雾不可被解除 ||
        this.单位?.迷雾不可被解除 ||
        !this.单位?.弹幕?.是否暴露自身)
    if (迷雾可被覆盖) {
      this.迷雾 = true
      this.emit('迷雾被覆盖时')
    }
    return 迷雾可被覆盖
  }

  /**
   * 返回位置是否在范围内
   * @param 位置
   * @param 范围 0单 2圆 5十 6横 7竖 17全 米
   * @returns
   */
  是否在范围内(位置: 位置类, 范围: number | string, 是否包括自己 = true) {
    if (!是否包括自己 && this.行 == 位置.行 && this.列 == 位置.列) return false
    switch (范围) {
      case 2:
      case '圆':
        return (
          this.行 >= 位置.行 &&
          this.列 >= 位置.列 &&
          this.行 <= 位置.行 + 1 &&
          this.列 <= 位置.列 + 1
        )
      case '米':
        return (
          this.行 >= 位置.行 - 1 &&
          this.行 <= 位置.行 + 1 &&
          this.列 >= 位置.列 - 1 &&
          this.列 <= 位置.列 + 1
        )
      case 5:
      case '十':
        return (
          (this.列 == 位置.列 &&
            this.行 >= 位置.行 - 1 &&
            this.行 <= 位置.行 + 1) ||
          (this.行 == 位置.行 &&
            this.列 >= 位置.列 - 1 &&
            this.列 <= 位置.列 + 1)
        )
      case 6:
      case '横':
        return (
          this.行 == 位置.行 && this.列 >= 位置.列 && this.列 <= 位置.列 + 1
        )
      case 7:
      case '竖':
        return (
          this.列 == 位置.列 && this.行 >= 位置.行 && this.行 <= 位置.行 + 1
        )
      case 17:
      case '全':
        return true
      default:
        return this.行 == 位置.行 && this.列 == 位置.列
    }
  }
}
class 单位类 extends 目标类 {
  编号: number
  玩家: 玩家类
  位置: 位置类
  主技能编号!: number
  技能列表: 技能类[] = []
  卡牌名称!: string
  描述!: string
  美术资源: number[] = []
  阵营!: number
  类型!: string
  get 移动消耗() {
    return this.本回合移动次数 ? 0 : 1
  }
  本回合移动次数 = 0
  可否移动 = true
  可否攻击 = true
  可否装填 = true
  未完全离场 = false
  弹幕?: 弹幕卡类
  秘术?: 神迹卡类
  坚壁: 单位类[] = []
  本回合触发过坚壁 = false

  本回合攻击过 = false
  回合首次攻击消耗?: number
  get 攻击消耗() {
    return this.本回合攻击过 ? 3 : this.回合首次攻击消耗 ?? 3
  }

  攻击可解除迷雾 = true
  生命值 = 0
  生命上限 = 0
  护盾值 = 0
  护盾上限 = 15
  永生 = false
  忍耐 = 0
  雷印 = 0
  常世异术 = 0
  疯乱 = 0

  get 伤害值() {
    return this.攻击力 + (this.弹幕?.攻击力 || 0)
  }

  基础攻击力 = 0
  get 攻击力() {
    const 固定值 = this.效果列表.findLast(
      (x) => x.效果 === '攻击力' && x.是否等于
    )?.效果值
    if (固定值 !== undefined) return 固定值
    return Math.max(
      0,
      this.效果列表
        .filter((x) => x.效果 === '攻击力' && !x.是否等于)
        .reduce((a, b) => a + b.效果值, this.基础攻击力)
    )
  }
  基础移动力 = 0
  get 移动力() {
    const 固定值 = this.效果列表.findLast(
      (x) => x.效果 === '移动力' && x.是否等于
    )?.效果值
    if (固定值 !== undefined) return 固定值
    return Math.max(
      0,
      this.效果列表
        .filter((x) => x.效果 === '移动力' && !x.是否等于)
        .reduce((a, b) => a + b.效果值, this.基础移动力)
    )
  }
  get 迷雾不可被解除() {
    return this.效果列表.findIndex((x) => x.效果 === '迷雾不可被解除') !== -1
  }
  圣盾 = false
  get 无敌() {
    return this.效果列表.findIndex((x) => x.效果 === '无敌') !== -1
  }
  get 封刃() {
    return this.效果列表.findIndex((x) => x.效果 === '封刃') !== -1
  }
  get 封足() {
    return this.效果列表.findIndex((x) => x.效果 === '封足') !== -1
  }
  get 诅咒() {
    return this.效果列表.findIndex((x) => x.效果 === '诅咒') !== -1
  }

  动画!: PXSP.Spine
  角色!: PIXI.Container

  constructor(玩家: 玩家类, 编号: number, 位置: 位置类) {
    super(玩家.是否我方)
    this.玩家 = 玩家
    this.编号 = 编号
    this.位置 = 位置
    位置.单位 = this

    this.玩家.on('回合开始时', () => {
      this.本回合移动次数 = 0
      this.本回合触发过坚壁 = false
      this.本回合攻击过 = false
      if (this.弹幕 && this.弹幕.吟唱时间 > 0) {
        this.emit('吟唱时间变化', { 变化值: -1 })
      }
    })

    this.on('受到攻击', (参数: { 攻击自身的单位: 单位类; 伤害值: number }) => {
      let 是否离场 = false
      if (this.圣盾) {
        this.圣盾 = false
        this.emit('圣盾变化时')
      } else {
        if (!this.本回合触发过坚壁 && this.坚壁.length) {
          this.本回合触发过坚壁 = true
          this.坚壁[0].emit('生命值变化', { 变化值: -参数.伤害值 })
        } else {
          是否离场 = this.计算伤害(参数.伤害值).是否离场
          this.emit('生命值变化', { 变化值: -参数.伤害值 })
        }
      }
      if (!是否离场) {
        this.emit('被攻击时', { 攻击自身的单位: 参数.攻击自身的单位 })
      }
    })
    this.on(
      '生命值变化',
      (参数: { 变化值: number; 真伤?: boolean; 攻击自身的单位?: 单位类 }) => {
        if (参数.变化值 <= 0) {
          const { 生命值减少值, 护盾值减少值, 是否离场 } = this.计算伤害(
            -参数.变化值,
            参数.真伤
          )
          if (是否离场) {
            if (参数.攻击自身的单位) {
              this.emit('被攻击离场时', {
                攻击自身的单位: 参数.攻击自身的单位,
              })
            } else {
              this.emit('离场')
            }
          } else {
            if (护盾值减少值) {
              this.emit('护盾值变化', { 变化值: -护盾值减少值 })
            }
            this.生命值 -= 生命值减少值
          }
        } else {
          this.生命值 = Math.min(this.生命上限, this.生命值 + 参数.变化值)
        }
        if (参数.变化值 < 0) this.emit('生命值减少时')
        if (参数.变化值 > 0) this.emit('生命值增加时')
        this.emit('生命值变化时')
      }
    )
    this.on('生命上限变化', (参数: { 变化值: number }) => {
      this.生命上限 += 参数.变化值
      this.emit('生命上限变化时')
    })
    this.on('生命上限变化时', () => {
      if (this.生命值 > this.生命上限) {
        this.emit('生命值变化', {
          变化值: this.生命上限 - this.生命值,
          真伤: true,
        })
      }
    })
    this.on('被攻击离场时', () => this.emit('离场'))
    this.on('护盾值变化', (参数: { 变化值: number }) => {
      this.护盾值 = Math.min(
        this.护盾上限,
        Math.max(0, this.护盾值 + 参数.变化值)
      )
      if (参数.变化值 > 0) this.emit('护盾值增加时')
      this.emit('护盾值变化时')
    })
    this.on('护盾上限变化', (参数: { 变化值: number }) => {
      this.护盾上限 += 参数.变化值
      this.emit('护盾上限变化时')
    })
    this.on('护盾上限变化时', () => {
      if (this.护盾值 > this.护盾上限) {
        this.emit('护盾值变化', { 变化值: this.护盾上限 - this.护盾值 })
      }
    })
    this.on('基础攻击力变化', (参数: { 变化值: number }) => {
      this.基础攻击力 += 参数.变化值
      this.emit('攻击力变化时')
    })
    this.on('攻击力变化', () => {
      this.emit('攻击力变化时')
    })
    this.on('移动力变化', () => {
      this.emit('移动力变化时')
    })
    this.on('基础移动力变化', (参数: { 变化值: number }) => {
      this.基础移动力 += 参数.变化值
      this.emit('移动力变化时')
    })
    this.on('离场', () => {
      _.remove(目标类.目标列表, (v) => v.id === this.id)
      this.emit('离场时')
      this.技能列表.forEach((v) => (v.是否禁用 = true))
      if (!this.未完全离场) {
        this.emit('完全离场')
      }
    })
    this.on('完全离场', () => {
      this.emit('完全离场时')
      this.位置.单位 = undefined
      行动队列类.发送通知({
        message: `${this.是否我方 ? '我方' : '敌方'}${this.类型}${
          this.卡牌名称
        }完全离场`,
        color: 'negative',
      })
    })
    this.on('吟唱时间变化', (参数: { 变化值: number }) => {
      if (this.弹幕)
        this.弹幕.吟唱时间 = Math.max(0, this.弹幕.吟唱时间 + 参数.变化值)
      this.emit('吟唱时间变化时')
    })
    this.on('秘术变化', (参数: { 变化值: 神迹卡类 | undefined }) => {
      if (this.秘术) {
        this.秘术.技能.级联禁用()
      }
      this.秘术 = 参数.变化值
      if (this.秘术) {
        this.秘术.技能 = new 技能类(this.秘术.技能编号, this)
        this.秘术.技能.once('触发时', () => {
          this.emit('秘术变化', { 变化值: undefined })
        })
      }
      this.emit('秘术变化时')
      行动队列类.发送通知({
        message: '装填秘术',
        color: this.是否我方 ? 'blue' : 'red',
      })
    })
    this.on('清除', () => {
      if (this.弹幕) {
        this.弹幕 = undefined
        this.emit('吟唱时间变化时')
      }
      this.emit('秘术变化', { 变化值: undefined })
    })
    this.on('替换弹幕', (参数: { 弹幕卡编号: number }) => {
      const 弹幕卡 = new 弹幕卡类(this.玩家, 参数.弹幕卡编号)
      this.弹幕 = 弹幕卡
      if (弹幕卡.技能编号) new 技能类(弹幕卡.技能编号, this)
      弹幕卡.已使用 = true
    })
    this.on('净化', () => {
      this.效果列表.forEach((x) => {
        if (!x.不可被净化) {
          x.emit('效果结束')
        }
      })
    })
    this.on('圣盾变化', () => {
      this.圣盾 = true
      this.emit('圣盾变化时')
    })

    this.on('封刃变化', () => {
      this.emit('封刃变化时')
    })

    this.on('封足变化', () => {
      this.emit('封足变化时')
    })

    this.on('变化时', () => {
      播放角色背景音乐(this.美术资源)
      播放技能语音(this.美术资源)
    })
    this.on('雷印变化', () => {
      this.雷印++
      if (this.雷印 == 3) {
        new 效果类('封刃，持续1回合', this.玩家.敌方玩家.主神, this)
        this.雷印 = 0
      }
      this.emit('获得雷印时')
    })
    this.on('迷雾不可被解除变化', () => {
      this.位置.覆盖迷雾()
    })
  }
  emit(事件名: string, 参数: Record<string, unknown> = {}): boolean {
    const 有监听器 = super.emit(事件名, 参数)
    this.玩家.emit(`单位${事件名}`, { ...参数, 单位: this })
    this.玩家.emit(`${this.类型}${事件名}`, { ...参数, 单位: this })
    return 有监听器
  }
  计算伤害(生命值减少值: number, 真伤?: boolean) {
    if (生命值减少值 && this.忍耐) {
      生命值减少值 = Math.max(0, 生命值减少值 - this.忍耐)
    }
    let 护盾值减少值 = 0
    if (生命值减少值 && !真伤 && this.护盾值) {
      护盾值减少值 = Math.min(this.护盾值, 生命值减少值)
      生命值减少值 -= 护盾值减少值
    }
    if (生命值减少值 && this.无敌) {
      生命值减少值 = 0
    }
    if (生命值减少值 && this.永生) {
      生命值减少值 = Math.min(this.生命值 - 1, 生命值减少值)
    }
    return {
      生命值减少值,
      护盾值减少值,
      是否离场: 生命值减少值 >= this.生命值,
    }
  }

  可攻击() {
    return (
      this.可否攻击 &&
      !this.封刃 &&
      玩家类.行动点 >= this.攻击消耗 &&
      !this.弹幕?.吟唱时间
    )
  }
  攻击消耗结算() {
    this.玩家.emit('行动点变化', { 变化值: -this.攻击消耗 })
    this.本回合攻击过 = true
  }
  获得攻击范围(攻击目标: 位置类) {
    const 攻击范围 = this.弹幕?.范围 ?? '单'
    return 攻击目标
      .我方(位置类)
      .filter((位置) => 位置.是否在范围内(攻击目标, 攻击范围))
  }
  攻击前() {
    this.emit('攻击前')
  }
  攻击(攻击范围: 位置类[]) {
    const 伤害值 = this.伤害值
    const 攻击命中的单位列表: 单位类[] = []
    const 攻击命中并解除迷雾的单位列表: 单位类[] = []
    攻击范围.forEach((v) => {
      if (v.单位 != undefined) {
        攻击命中的单位列表.push(v.单位)
      }
      if (
        this.攻击可解除迷雾 &&
        (!this.弹幕 || this.弹幕.是否驱散迷雾) &&
        v.解除迷雾() &&
        v.单位 != undefined
      ) {
        攻击命中并解除迷雾的单位列表.push(v.单位)
      }
    })
    if (攻击命中并解除迷雾的单位列表.length) {
      this.emit('攻击解除敌方单位迷雾时', { 攻击命中的单位列表 })
    }
    if (攻击命中的单位列表.length) {
      this.emit('攻击命中时', { 攻击命中的单位列表 })
    }
    this.emit('攻击时')
    if (this.弹幕) {
      this.弹幕 = undefined
      this.emit('吟唱时间变化时')
    }
    攻击命中的单位列表.forEach((v) => {
      v.emit('受到攻击', { 攻击自身的单位: this, 伤害值 })
    })
    攻击命中并解除迷雾的单位列表.forEach((v) => {
      v.emit('被命中的同时暴露时')
    })
    return true
  }
  可移动(位置?: 位置类) {
    return (
      this.可否移动 &&
      !this.封足 &&
      this.移动力 > this.本回合移动次数 &&
      玩家类.行动点 >= this.移动消耗 &&
      !位置?.单位
    )
  }
  移动消耗结算() {
    this.玩家.emit('行动点变化', { 变化值: -this.移动消耗 })
    this.本回合移动次数++
  }
  传送(位置: 位置类) {
    this.位置.单位 = undefined
    位置.单位 = this
    this.位置 = 位置
    if (this.迷雾不可被解除 || this.位置.迷雾不可被解除) {
      this.位置.覆盖迷雾()
    } else if (this.弹幕?.是否暴露自身) {
      this.位置.解除迷雾()
    }
    this.emit('传送时')
  }
  移动(位置: 位置类) {
    this.传送(位置)
    this.emit('移动时')
    return true
  }

  可装填(弹幕卡: 弹幕卡类) {
    return !弹幕卡.已使用 && this.可否装填 && 玩家类.行动点 >= 弹幕卡.消耗
  }
  装填消耗结算(弹幕卡: 弹幕卡类) {
    玩家类.事件.emit('行动点变化', { 变化值: -弹幕卡.消耗 })
    弹幕卡.已使用 = true
  }
  装填弹幕(弹幕卡: 弹幕卡类) {
    this.emit('使用弹幕卡时')
    this.弹幕 = 弹幕卡
    if (弹幕卡.技能编号) new 技能类(弹幕卡.技能编号, this)
    if (弹幕卡.是否暴露自身) {
      this.位置.解除迷雾()
    }
    this.emit('装填弹幕时')
    this.emit('吟唱时间变化时')
    this.玩家.emit('手牌数量变化时')
    行动队列类.发送通知({
      message: `装填弹幕：${弹幕卡.卡牌名称}`,
      color: this.是否我方 ? 'blue' : 'red',
    })
    return true
  }
  async 获得动画(位宽: number) {
    // 攻击 attack
    // 受伤 hurt
    // 移动 move
    // 站立 idle
    // 站立到装填 idle_to_storing
    // 装填 storing
    // 装填到弹幕准备完成 storing_to_stored
    // 弹幕准备完成 stored
    // 暂停 pseudo_setup_pose

    const 动画 = await 加载神动画(this.美术资源)
    动画.zIndex = -1
    动画.x = 位宽 * 0.5
    动画.y = 位宽 * 0.9
    动画.scale.set(位宽 / 600)
    if (!this.是否我方) {
      动画.scale.x *= -1
    }
    动画.state.setAnimation(
      0,
      this.弹幕 ? (this.弹幕.吟唱时间 ? 'storing' : 'stored') : 'idle',
      true
    )
    if (this.动画) {
      this.动画.destroy()
    }
    this.动画 = 动画
    this.角色.addChild(动画)
  }
  更新坐标(位宽: number) {
    const x = (this.位置.列 - 1) * 位宽
    const y = (this.位置.行 - 1) * 位宽
    this.角色.position.set(x, y)
    this.角色.zIndex = this.角色.y
    this.角色.parent?.sortChildren()
  }
  async 获得角色(位宽: number) {
    if (this.角色 !== undefined) {
      return this.角色
    }
    const 角色 = new PIXI.Container()
    this.角色 = 角色
    this.更新坐标(位宽)
    await this.获得动画(位宽)
    this.on('变化', () => {
      this.获得动画(位宽)
    })
    this.on('生命值增加时', () => {
      播放音频('prefab/pvp/effect7.mp3')
    })
    this.on('生命值减少时', () => {
      播放音频('prefab/pvp/打击2.mp3')
      this.动画.state.setAnimation(0, 'hurt', false)
      this.动画.state.addAnimation(
        0,
        this.弹幕 ? (this.弹幕.吟唱时间 ? 'storing' : 'stored') : 'idle',
        true,
        0
      )
    })
    this.on('离场时', () => {
      播放音频('prefab/pvp/effect1.mp3')
      this.动画.state.setAnimation(0, 'hurt', false)
      播放死亡语音(this.美术资源)
      等待(this.动画.spineData.findAnimation('hurt')?.duration || 0).then(() =>
        this.角色.destroy()
      )
    })
    this.on('吟唱时间变化时', () => {
      this.动画.state.setAnimation(
        0,
        this.弹幕 ? (this.弹幕.吟唱时间 ? 'storing' : 'stored') : 'idle',
        true
      )
    })
    if (!this.是否我方) {
      角色.visible = !this.位置.迷雾
      this.on('移动时', () => {
        角色.visible = !this.位置.迷雾
      })
      this.on('传送时', () => {
        角色.visible = !this.位置.迷雾
      })
      this.on('迷雾被解除时', () => {
        角色.visible = true
      })
      this.on('迷雾被覆盖时', () => {
        角色.visible = false
      })
    }
    const 生命值显示 = new PIXI.Text(this.生命值, {
      fill: this instanceof 主神类 ? 0xf6b04f : 0x368f57,
      strokeThickness: 5,
      fontWeight: 'bold',
    })
    生命值显示.scale.set((位宽 * 0.3) / 生命值显示.height)
    this.on('生命值变化时', () => {
      生命值显示.text = this.生命值
    })

    角色.addChild(生命值显示)
    const 攻击力显示 = new PIXI.Text(this.攻击力, {
      fill: 0xf5513d,
      strokeThickness: 5,
      fontWeight: 'bold',
    })
    攻击力显示.scale.set((位宽 * 0.3) / 攻击力显示.height)
    攻击力显示.x = 位宽 - 攻击力显示.width
    this.on('攻击力变化时', () => {
      攻击力显示.text = this.攻击力
      攻击力显示.x = 位宽 - 攻击力显示.width
    })
    角色.addChild(攻击力显示)
    const 圣盾显示 = await 加载子画面('pvp/field/shengdun.webp')
    圣盾显示.scale.set((位宽 * 0.25) / 圣盾显示.height)
    圣盾显示.x = 位宽 - 圣盾显示.width
    圣盾显示.y = 攻击力显示.y + 攻击力显示.height
    圣盾显示.visible = false
    this.on('圣盾变化时', () => {
      if (this.圣盾) {
        播放音频('prefab/pvp/effect5.mp3')
        圣盾显示.visible = true
      } else {
        圣盾显示.visible = false
      }
    })
    角色.addChild(圣盾显示)

    const 秘术显示 = await 加载子画面('pvp/field/aomi.webp')
    秘术显示.scale.set((位宽 * 0.25) / 秘术显示.height)
    秘术显示.y = 位宽 - 秘术显示.height
    秘术显示.visible = false
    this.on('秘术变化时', () => {
      if (this.秘术) {
        秘术显示.visible = true
      } else {
        秘术显示.visible = false
      }
    })
    角色.addChild(秘术显示)

    const 封足显示 = await 加载子画面('pvp/field/fengzu.png')
    封足显示.zIndex = -2
    封足显示.scale.set(
      (位宽 * 1.75) / 封足显示.width,
      (位宽 * 1) / 封足显示.height
    )
    封足显示.x = (位宽 - 封足显示.width) / 2
    封足显示.y = (位宽 - 封足显示.height) / 2 + 位宽 / 3

    let 封足透明调整方向 = 1
    setInterval(() => {
      if (this.封足) {
        封足显示.alpha += 0.02 * 封足透明调整方向

        if (封足显示.alpha >= 1) {
          封足显示.alpha = 1
          封足透明调整方向 = -1
        } else if (封足显示.alpha <= 0.1) {
          封足显示.alpha = 0.1
          封足透明调整方向 = 1
        }
      }
    }, 25)

    封足显示.visible = this.封足
    this.on('封足变化时', () => {
      封足显示.visible = this.封足
      封足显示.alpha = 1
    })
    this.角色.addChild(封足显示)

    const 封刃显示 = await 加载子画面('pvp/field/fengren.png')
    封刃显示.scale.set(位宽 / 封刃显示.height)
    let 封刃透明调整方向 = 1
    setInterval(() => {
      if (this.封刃) {
        封刃显示.alpha += 0.02 * 封刃透明调整方向

        if (封刃显示.alpha >= 1) {
          封刃显示.alpha = 1
          封刃透明调整方向 = -1
        } else if (封刃显示.alpha <= 0.1) {
          封刃显示.alpha = 0.1
          封刃透明调整方向 = 1
        }
      }
    }, 25)

    封刃显示.visible = this.封刃
    this.on('封刃变化时', () => {
      封刃显示.visible = this.封刃
      封刃显示.alpha = 1
    })
    角色.addChild(封刃显示)

    const 雷印显示: PIXI.Sprite[] = []
    for (let i = 1; i <= 3; i++) {
      雷印显示[i] = await 加载子画面('pvp/field/leiyin.webp')
      雷印显示[i].zIndex = -3
      雷印显示[i].scale.set(
        (位宽 * (1 - i * 0.2) * 1.5) / 雷印显示[i].height,
        (位宽 * (1 - i * 0.2) * 0.75) / 雷印显示[i].height
      )

      雷印显示[i].x = (位宽 - 雷印显示[i].width) / 2
      雷印显示[i].y = (位宽 - 雷印显示[i].height) / 2 + 位宽 / 3

      雷印显示[i].visible = false

      this.角色.addChild(雷印显示[i])
    }
    this.on('获得雷印时', () => {
      if (this.雷印 == 0) {
        雷印显示[1].visible = false
        雷印显示[2].visible = false
        雷印显示[3].visible = false
      } else {
        雷印显示[this.雷印].visible = true
      }
    })

    const 护盾值显示 = new PIXI.Text(this.护盾值, {
      fill: 0x818fa9,
      strokeThickness: 5,
      fontWeight: 'bold',
    })
    护盾值显示.scale.set((位宽 * 0.3) / 护盾值显示.height)
    护盾值显示.y = 生命值显示.height
    护盾值显示.visible = false
    this.on('护盾值增加时', () => {
      播放音频('prefab/pvp/effect6.mp3')
    })
    this.on('护盾值变化时', () => {
      护盾值显示.text = this.护盾值
      护盾值显示.visible = this.护盾值 > 0
    })
    角色.addChild(护盾值显示)
    const 吟唱时间显示 = new PIXI.Text('0', {
      fill: 0xffffff,
      strokeThickness: 5,
      fontWeight: 'bold',
    })
    吟唱时间显示.scale.set((位宽 * 0.3) / 吟唱时间显示.height)
    吟唱时间显示.x = 位宽 - 吟唱时间显示.width
    吟唱时间显示.y = 位宽 - 吟唱时间显示.height
    吟唱时间显示.visible = false
    this.on('吟唱时间变化时', () => {
      if (typeof this.弹幕?.吟唱时间 === 'number') {
        吟唱时间显示.text = this.弹幕.吟唱时间
        吟唱时间显示.visible = true
      } else {
        吟唱时间显示.visible = false
      }
    })
    角色.addChild(吟唱时间显示)
    角色.on('added', (p) => {
      p.sortChildren()
    })
    角色.sortChildren()
    游戏开始前执行(() => this.emit('登场时'), this.编号, this.是否我方)
    return 角色
  }

  获得移动范围() {
    return this.我方(位置类).filter(
      (位置) => this.可移动(位置) && 位置.是否在范围内(this.位置, '十', false)
    )
  }
}
class 主神类 extends 单位类 {
  类型 = '主神'
  神威序号: 1 | 2 | 3
  神威!: 技能类
  constructor(
    玩家: 玩家类,
    编号: number,
    神威序号: 1 | 2 | 3,
    位置: 位置类,
    初始生命值上限?: number
  ) {
    super(玩家, 编号, 位置)
    const 信息 = 获得主神信息(编号)
    this.阵营 = 信息.阵营
    this.基础攻击力 = 信息.攻击力
    this.生命上限 = 信息.生命值
    if (初始生命值上限 != undefined) {
      this.生命值 = Math.min(this.生命上限, 初始生命值上限)
    } else {
      this.生命值 = this.生命上限
    }
    this.基础移动力 = 信息.移动力
    this.神威序号 = 神威序号
    const 技能编号 = 信息[`技能${神威序号}`]
    this.主技能编号 = 技能编号
    游戏开始前执行(
      () => {
        this.神威 = new 技能类(this.主技能编号, this, undefined, true)
      },
      this.主技能编号,
      this.是否我方
    )
    this.卡牌名称 = 信息.卡牌名称
    this.描述 = 信息.描述
    this.美术资源.push(信息.美术资源)
    const 皮肤 = 主神皮肤.find((v) => v.适用主神ID === 编号)
    if (皮肤) {
      this.美术资源.unshift(皮肤.服装编号)
    }
    const ab = this.获得主神资源清单()
    PIXI.Assets.addBundle(ab.name, ab.assets)
    PIXI.Assets.loadBundle(ab.name)

    this.on('变化', (参数: { 编号: number }) => {
      const 信息 = 获得主神信息(参数.编号)
      _.remove(this.美术资源, (v) => v == 信息.美术资源)
      this.美术资源.unshift(信息.美术资源)
      this.主技能编号 = 信息.技能1
      this.技能列表.forEach((v) => (v.是否禁用 = true))
      this.技能列表 = []
      new 技能类(this.主技能编号, this)
      this.emit('变化时')
    })
    this.on('完全离场时', () => {
      if (this.是否我方) {
        Notify.create({
          message: '我方主神死亡，战斗失败，5秒后刷新页面',
          type: 'negative',
        })
        播放音频('prefab/pvp/失败_01.mp3')
      } else {
        Notify.create({
          message: '对方主神死亡，战斗胜利，5秒后刷新页面',
          type: 'positive',
        })
        播放音频('prefab/pvp/胜利_01.mp3')
      }
      useTimeoutFn(() => {
        location.reload()
      }, 5000)
    })
    this.emit('创建时')
  }

  获得主神资源清单(): PIXI.AssetsBundle {
    const 编号 = this.美术资源[0]
    const assets = [
      {
        alias: `${编号}动画`,
        src: [
          `spine/${编号}/${编号}.json`,
          `spine/${编号}/${编号}.webp`,
          `spine/${编号}/${编号}.atlas`,
        ],
      },
      {
        alias: `${编号}普攻`,
        src: [
          `spine/${编号}/effect-${编号}.json`,
          `spine/${编号}/effect-${编号}.webp`,
          `spine/${编号}/effect-${编号}.atlas`,
        ],
      },
      {
        alias: `${编号}神威`,
        src: [
          `flash/FlashBG_${编号}.webp`,
          `spine/flash/${编号}/${编号}.json`,
          `spine/flash/${编号}/${编号}.webp`,
          `spine/flash/${编号}/${编号}.atlas`,
          `flash/FlashVoice_${编号}.mp3`,
        ],
      },
    ]
    const bgm = 静态文件列表.filter(
      (f) => f === `bgm/BGM_character_${编号}.mp3`
    )
    if (bgm.length) {
      assets.push({
        alias: `${编号}音乐`,
        src: bgm,
      })
    }
    const v = 静态文件列表.filter((f) =>
      f.match(`^character/.*_${编号}(_[0-9]{2})?.mp3$`)
    )
    if (v.length) {
      assets.push({
        alias: `${编号}音效`,
        src: v,
      })
    }
    return {
      name: 编号.toString(),
      assets,
    }
  }
}
class 附属神类 extends 单位类 {
  伙伴卡ID?: number
  constructor(
    玩家: 玩家类,
    编号: number,
    位置: 位置类,
    初始生命值上限?: number
  ) {
    super(玩家, 编号, 位置)
    const 信息 = 获得附属神信息(编号)
    this.阵营 = 信息.阵营
    switch (信息.类型) {
      case 1:
        this.类型 = '附属神'
        break
      case 2:
        this.类型 = '召唤物'
        break
      case 3:
        this.类型 = '祭坛'
        break
    }
    this.基础攻击力 = 信息.攻击力
    this.生命上限 = 信息.生命值
    if (初始生命值上限 != undefined) {
      this.生命值 = Math.min(this.生命上限, 初始生命值上限)
    } else {
      this.生命值 = this.生命上限
    }
    this.基础移动力 = 信息.移动力
    this.可否攻击 = Boolean(信息.可否攻击)
    this.可否装填 = Boolean(信息.可否装填)
    this.可否移动 = Boolean(信息.可否移动)
    if (信息.技能) {
      this.主技能编号 = 信息.技能
      游戏开始前执行(
        () => {
          new 技能类(this.主技能编号, this)
        },
        this.主技能编号,
        this.是否我方
      )
    }
    if (信息.伙伴卡ID) this.伙伴卡ID = 信息.伙伴卡ID
    this.卡牌名称 = 信息.卡牌名称
    this.描述 = 信息.描述
    this.美术资源.push(信息.美术资源)
    const 皮肤 = 附属神皮肤.find((v) => v.附属神名称 === this.卡牌名称)
    if (皮肤) {
      this.美术资源.unshift(皮肤.编号)
    }
    const ab = this.获得附属神资源清单()
    PIXI.Assets.addBundle(ab.name, ab.assets)
    PIXI.Assets.loadBundle(ab.name)

    this.on('变化', (参数: { 编号: number }) => {
      const 信息 = 获得附属神信息(参数.编号)
      _.remove(this.美术资源, (v) => v == 信息.美术资源)
      this.美术资源.unshift(信息.美术资源)
      this.主技能编号 = 信息.技能
      this.技能列表.forEach((v) => (v.是否禁用 = true))
      this.技能列表 = []
      new 技能类(this.主技能编号, this)
      this.emit('变化时')
    })
    this.emit('创建时')
  }

  获得附属神资源清单(): PIXI.AssetsBundle {
    const 编号 = this.美术资源[0]
    const assets = [
      {
        alias: `${编号}动画`,
        src: [
          `spine/${编号}/${编号}.json`,
          `spine/${编号}/${编号}.webp`,
          `spine/${编号}/${编号}.atlas`,
        ],
      },
    ]
    const bgm = 静态文件列表.filter(
      (f) => f === `bgm/BGM_character_${编号}.mp3`
    )
    if (bgm.length) {
      assets.push({
        alias: `${编号}音乐`,
        src: bgm,
      })
    }
    const v = 静态文件列表.filter((f) =>
      f.match(`^character/.*_${编号}(_[0-9]{2})?.mp3$`)
    )
    if (v.length) {
      assets.push({
        alias: `${编号}音效`,
        src: v,
      })
    }
    const a = [
      `spine/${编号}/effect-${编号}.json`,
      `spine/${编号}/effect-${编号}.webp`,
      `spine/${编号}/effect-${编号}.atlas`,
    ].filter((f) => 静态文件列表.includes(f))
    if (a.length) {
      assets.push({
        alias: `${编号}普攻`,
        src: a,
      })
    }
    return {
      name: 编号.toString(),
      assets,
    }
  }
}
class 牌类 extends 目标类 {
  玩家: 玩家类
  已抽到 = false
  已使用 = false
  已弃置 = false
  编号!: number
  卡牌名称!: string
  类型!: string
  品质!: '传说' | '稀有' | '普通'
  _消耗 = 0
  get 消耗() {
    return this._消耗
  }
  技能编号?: number
  描述!: string
  美术资源!: number
  排序编号!: number
  故事?: string
  卡面?: PXUI.ButtonContainer
  constructor(玩家: 玩家类, 编号: number, 消耗?: number) {
    super(玩家.是否我方)
    this.玩家 = 玩家
    this.编号 = 编号
    if (消耗 != undefined) {
      this._消耗 = 消耗
    }
    this.on('消耗变化', (参数: { 变化值: number }) => {
      this._消耗 = Math.max(0, this.消耗 + 参数.变化值)
      this.emit('消耗变化时')
    })
  }
  async 获得卡面() {
    if (this.卡面) {
      return this.卡面
    }
    const 图路径 = 获得资源(
      ['L', 'M', 'S'],
      (f, i) => f === `card/Card${i}_${this.美术资源}.webp`
    )
    if (!图路径) {
      throw new Error('找不到卡面')
    }
    const 卡图 = await 加载子画面(图路径)
    this.卡面 = new PXUI.ButtonContainer(卡图)
    const 消耗 = new PIXI.Text(this.消耗, {
      fill: this.消耗 < this._消耗 ? 0x00ff00 : 0xffffff,
      fontSize: 卡图.height * 0.1,
      strokeThickness: 卡图.height * 0.01,
    })
    this.on('消耗变化时', () => {
      消耗.text = this.消耗
      消耗.style.fill = this.消耗 < this._消耗 ? 0x00ff00 : 0xffffff
    })
    this.卡面.addChild(消耗)
    const 名称 = new PIXI.Text(this.卡牌名称, {
      fill: 0xffef8c,
      fontSize: 卡图.height * 0.08,
      strokeThickness: 卡图.height * 0.008,
    })
    名称.x = (卡图.width - 名称.width) / 2
    this.卡面.addChild(名称)
    const 描述 = new PIXI.Text(this.描述, {
      fill: 0xffe4ab,
      fontSize: 卡图.height * 0.03,
      strokeThickness: 卡图.height * 0.003,
      wordWrap: true,
      wordWrapWidth: 卡图.width,
      breakWords: true,
    })
    描述.x = (卡图.width - 描述.width) / 2
    描述.y = 卡图.height * 0.75 - 描述.height
    this.卡面.addChild(描述)
    if (this.故事) {
      const 故事 = new PIXI.Text(`——${this.故事}`, {
        fill: 0xffe4ab,
        fontSize: 卡图.height * 0.025,
        strokeThickness: 卡图.height * 0.0025,
        wordWrap: true,
        wordWrapWidth: 卡图.width,
        breakWords: true,
      })
      故事.x = 卡图.width - 故事.width
      故事.y = 描述.y + 描述.height
      this.卡面.addChild(故事)
    }
    if (this instanceof 弹幕卡类) {
      const 攻击力 = new PIXI.Text(this.攻击力, {
        fill: 0xfff2ce,
        stroke: 0xcc7612,
        fontSize: 卡图.height * 0.1,
        strokeThickness: 卡图.height * 0.01,
      })
      攻击力.y = 卡图.height - 攻击力.height
      this.on('攻击力变化时', () => {
        攻击力.text = this.攻击力
      })
      this.卡面.addChild(攻击力)

      const 吟唱时间 = new PIXI.Text(this.吟唱时间, {
        fill: 0xc7e0fe,
        stroke: 0x16b3d6,
        fontSize: 卡图.height * 0.1,
        strokeThickness: 卡图.height * 0.01,
      })
      吟唱时间.x = 卡图.width - 吟唱时间.width
      吟唱时间.y = 卡图.height - 吟唱时间.height
      this.on('吟唱时间变化时', () => {
        吟唱时间.text = this.吟唱时间
      })
      this.卡面.addChild(吟唱时间)

      const 范围 = new PIXI.Text(this.范围, {
        fill: 0xffffff,
        stroke: 0x000000,
        fontSize: 卡图.height * 0.08,
        strokeThickness: 卡图.height * 0.008,
      })
      范围.x = 卡图.width - 范围.width
      范围.y = (消耗.y + 消耗.height - 范围.height) / 2
      this.卡面.addChild(范围)
    }
    return this.卡面
  }
}
class 弹幕卡类 extends 牌类 {
  类型 = '弹幕卡'
  吟唱时间 = 0
  攻击力 = 0
  范围: string
  是否暴露自身 = false
  是否驱散迷雾 = true
  弹幕特效: number
  constructor(玩家: 玩家类, 编号: number, 消耗?: number) {
    super(玩家, 编号, 消耗)
    const 信息 = 获得弹幕卡信息(编号)
    switch (信息.品质) {
      case 1:
        this.品质 = '传说'
        break
      case 2:
        this.品质 = '稀有'
        break
      case 3:
        this.品质 = '普通'
        break
    }
    this.攻击力 = 信息.攻击力
    this.on('攻击力变化', (参数: { 变化值: number }) => {
      this.攻击力 = Math.max(0, this.攻击力 + 参数.变化值)
      this.emit('攻击力变化时')
    })
    this.吟唱时间 = 信息.吟唱时间
    switch (信息.弹幕攻击范围) {
      case 0:
        this.范围 = '单'
        break
      case 2:
        this.范围 = '圆'
        break
      case 5:
        this.范围 = '十'
        break
      case 6:
        this.范围 = '横'
        break
      case 7:
        this.范围 = '竖'
        break
      case 17:
        this.范围 = '全'
        break
      default:
        throw new Error(`未知的弹幕攻击范围：${信息.弹幕攻击范围}`)
    }
    this.是否暴露自身 = Boolean(信息.是否暴露自身)
    this.是否驱散迷雾 = Boolean(信息.是否驱散迷雾)
    if (消耗 == undefined) {
      this._消耗 = 信息.消耗
    }
    if (信息.技能) {
      if (typeof 信息.技能 == 'string') {
        if (信息.技能 != '0') {
          this.技能编号 = parseInt(信息.技能)
        }
      } else if (typeof 信息.技能 == 'number') {
        this.技能编号 = 信息.技能
      }
    }
    this.卡牌名称 = 信息.卡牌名称
    this.描述 = 信息.描述
    this.美术资源 = 信息.美术资源
    this.弹幕特效 = 信息.弹幕特效
    this.排序编号 = 信息.排序编号
    const 卡信息 = 获得卡信息(编号)
    if (卡信息) {
      this.故事 = 卡信息.基本信息
    }
  }
}
class 神迹卡类 extends 牌类 {
  技能编号: number
  技能!: 技能类
  get 消耗() {
    return Math.max(0, this._消耗 + this.玩家.回合首次神迹卡消耗变化值)
  }
  constructor(玩家: 玩家类, 编号: number, 消耗?: number) {
    super(玩家, 编号, 消耗)
    const 信息 = 获得神迹卡信息(编号)
    switch (信息.品质) {
      case 1:
        this.品质 = '传说'
        break
      case 2:
        this.品质 = '稀有'
        break
      case 3:
        this.品质 = '普通'
        break
    }
    switch (信息.类型) {
      case 1:
        this.类型 = '神迹卡'
        break
      case 2:
        this.类型 = '秘术卡'
        break
    }
    this.技能编号 = 信息.技能
    if (消耗 == undefined) {
      const 技能信息 = 获得技能信息(this.技能编号)
      this._消耗 = 技能信息.消耗
    }
    this.卡牌名称 = 信息.卡牌名称
    this.描述 = 信息.描述
    this.美术资源 = 信息.美术资源
    this.排序编号 = 信息.排序编号
    const 卡信息 = 获得卡信息(编号)
    if (卡信息) {
      this.故事 = 卡信息.基本信息
    }
  }
  可使用() {
    return !this.已使用 && 玩家类.行动点 >= this.消耗
  }
  消耗结算() {
    玩家类.事件.emit('行动点变化', { 变化值: -this.消耗 })
    this.玩家.回合首次神迹卡消耗变化值 = 0
    this.已使用 = true
  }
  async 使用() {
    let 秘术装填单位: 单位类 | undefined
    if (this.玩家.无效化下次使用的神迹卡) {
      this.玩家.无效化下次使用的神迹卡 = false
      行动队列类.发送通知({
        message: '争议',
        color: 'negative',
      })
    } else if (this.类型 == '秘术卡') {
      const 我方单位列表 = this.我方(单位类).filter((v) => v.可否装填)
      let 选中的单位索引: number | null = null
      if (this.是否我方) {
        选中的单位索引 = await new Promise<number>((resolve) => {
          Dialog.create({
            title: '选择',
            options: {
              model: '0',
              items: 我方单位列表.map((v, i) => ({
                value: `${i}`,
                label: `${v.卡牌名称}，第${v.位置.行}，第行${v.位置.列}列`,
              })),
            },
            cancel: false,
            persistent: true,
          }).onOk((v) => {
            resolve(v)
          })
        })
        行动队列类.行动队列.添加(['选择', this.id, 选中的单位索引])
      } else {
        选中的单位索引 = await new Promise<number>((resolve) => {
          const handler = (是否我方: boolean, 行动: 行动类型) => {
            if (行动[0] == '选择' && 行动[1] == this.id) {
              行动队列类.行动队列.removeListener('结算', handler)
              resolve(行动[2])
            }
          }
          行动队列类.行动队列.on('结算', handler)
        })
      }
      秘术装填单位 = 我方单位列表[选中的单位索引]
    }
    if (秘术装填单位) {
      秘术装填单位.emit('秘术变化', { 变化值: this })
    } else if (this.类型 === '神迹卡') {
      this.技能 = new 技能类(this.技能编号, this.玩家.主神)
      行动队列类.发送通知({
        message: `使用神迹：${this.卡牌名称}`,
        color: this.是否我方 ? 'blue' : 'red',
      })
    }
    this.玩家.emit('使用神迹卡时', { 神迹卡: this })
    this.玩家.emit('手牌数量变化时')
  }
}
let 游戏开始前执行的函数: [(...args: unknown[]) => void, number, boolean][] = []
function 游戏开始前执行(
  函数: (...args: unknown[]) => void,
  优先级: number,
  是否我方: boolean
) {
  if (玩家类.游戏已开始) {
    函数()
  } else {
    游戏开始前执行的函数.push([函数, 优先级, 是否我方])
  }
}
function 游戏开始前(先手是否我方: boolean) {
  游戏开始前执行的函数.sort((x, y) => x[1] - y[1])
  游戏开始前执行的函数 = _.sortBy(游戏开始前执行的函数, (x) =>
    x[2] === 先手是否我方 ? -1 : 1
  )
  游戏开始前执行的函数.forEach((x) => x[0]())
  游戏开始前执行的函数 = []
}
class 玩家类 extends 目标类 {
  static 事件 = new EventEmitter()
  static 游戏已开始 = false
  static 我方回合?: boolean
  static 行动点 = 10
  static 倒计时 = Date.now() + 1000 * 60
  static 重置倒计时() {
    this.倒计时 = Date.now() + 1000 * 60
  }
  敌方玩家!: 玩家类
  主神: 主神类
  格 = 4
  我方先手?: boolean
  回合数 = 0
  枯竭回合数 = 0
  祈愿倒计时 = 0
  祈愿倒计时上限 = 3
  _回合首次神迹卡消耗变化值 = 0
  get 回合首次神迹卡消耗变化值() {
    return this._回合首次神迹卡消耗变化值
  }
  set 回合首次神迹卡消耗变化值(value: number) {
    this._回合首次神迹卡消耗变化值 = value
    this.手牌.forEach((l) => {
      if (l instanceof 神迹卡类) {
        l.emit('消耗变化时')
      }
    })
  }
  无效化下次使用的神迹卡?: boolean
  get 手牌() {
    return this.我方(牌类)
      .filter((x) => x.已抽到 && !x.已使用 && !x.已弃置)
      .sort((x, y) => x.排序编号 - y.排序编号)
  }
  get 牌堆() {
    return this.我方(牌类)
      .filter((x) => !x.已抽到 && !x.已使用 && !x.已弃置)
      .sort((x, y) => x.id - y.id)
  }
  constructor(是否我方: boolean, 卡组: 编号卡组类型 | 初始数据类型) {
    super(是否我方)
    this.on(
      '抽卡',
      (参数: { 数量: number; 条件?: Record<string, unknown> }) => {
        this.牌堆
          .filter((x) => {
            if (参数.条件 !== undefined) {
              for (const k in 参数.条件) {
                if (x[k as keyof typeof x] != 参数.条件[k]) {
                  return false
                }
              }
            }
            return true
          })
          .slice(0, 参数.数量)
          .forEach((卡) => {
            if (this.手牌.length >= 10) {
              卡.已弃置 = true
            } else {
              卡.已抽到 = true
            }
            this.emit('每获得一张卡时', { 卡 })
          })
        this.emit('抽卡时')
        this.emit('手牌数量变化时')
      }
    )
    this.on(
      '获得卡',
      (参数: { 编号: number; 消耗?: number; 数量?: number }) => {
        const 数量 = 参数.数量 ?? 1
        for (let i = 0; i < 数量; i++) {
          let 卡: 牌类
          if (参数.编号 > 40000 && 参数.编号 < 50000) {
            卡 = new 弹幕卡类(this, 参数.编号, 参数.消耗)
          } else {
            卡 = new 神迹卡类(this, 参数.编号, 参数.消耗)
          }
          if (this.手牌.length >= 10) {
            卡.已弃置 = true
          } else {
            卡.已抽到 = true
          }
          this.emit('每获得一张卡时', { 卡 })
        }
        this.emit('手牌数量变化时')
      }
    )
    this.on('弃牌', (参数: { 数量: number }) => {
      随机类.抽样列表(this.手牌, 参数.数量).forEach((x) => (x.已弃置 = true))
      this.emit('手牌数量变化时')
    })
    this.on('祈愿倒计时变化', (参数: { 变化值: number }) => {
      this.祈愿倒计时 = Math.min(
        this.祈愿倒计时上限,
        Math.max(0, this.祈愿倒计时 + 参数.变化值)
      )
      if (this.祈愿倒计时 == 0) {
        this.祈愿倒计时 = this.祈愿倒计时上限
        this.emit('抽卡', { 数量: 3 })
      }
      this.emit('祈愿倒计时变化时')
    })
    this.on('祈愿倒计时上限变化', (参数: { 变化值: number }) => {
      this.祈愿倒计时上限 += 参数.变化值
      this.emit('祈愿倒计时上限变化时')
    })
    this.on('祈愿倒计时上限变化时', () => {
      if (this.祈愿倒计时 > this.祈愿倒计时上限) {
        this.emit('祈愿倒计时变化', {
          变化值: this.祈愿倒计时上限 - this.祈愿倒计时,
        })
      }
    })
    this.格 = Math.max(Math.ceil(Math.sqrt(卡组.附属神.length + 1)), 4)
    _.range(this.格).forEach((行) => {
      _.range(this.格).forEach((列) => {
        new 位置类(this, 行 + 1, 列 + 1)
      })
    })
    if ('主神技能' in 卡组) {
      let 随机无单位位置: 位置类 | undefined
      随机无单位位置 = 随机类.抽样(this.我方(位置类).filter((x) => !x.单位))!
      this.主神 = new 主神类(this, 卡组.主神, 卡组.主神技能, 随机无单位位置)

      卡组.附属神.forEach((编号) => {
        随机无单位位置 = 随机类.抽样(this.我方(位置类).filter((x) => !x.单位))
        if (随机无单位位置) new 附属神类(this, 编号, 随机无单位位置)
      })
      卡组.弹幕卡.forEach((编号) => {
        new 弹幕卡类(this, 编号)
      })
      卡组.神迹卡.forEach((编号) => {
        new 神迹卡类(this, 编号)
      })
    } else {
      const 位置 = this.我方(位置类).find(
        (x) => x.行 == 卡组.主神.位置.行 && x.列 == 卡组.主神.位置.列
      )!
      this.主神 = new 主神类(this, 卡组.主神.编号, 卡组.主神.技能, 位置)
      this.主神.id = 卡组.主神.id

      卡组.附属神.forEach((v) => {
        const 位置 = this.我方(位置类).find(
          (x) => x.行 == v.位置.行 && x.列 == v.位置.列
        )!
        const 附属神 = new 附属神类(this, v.编号, 位置)
        附属神.id = v.id
      })

      卡组.弹幕卡.forEach((v) => {
        const 弹幕卡 = new 弹幕卡类(this, v.编号)
        弹幕卡.id = v.id
      })

      卡组.神迹卡.forEach((v) => {
        const 神迹卡 = new 神迹卡类(this, v.编号)
        神迹卡.id = v.id
      })
    }
  }
  emit(事件名: string, 参数: Record<string, unknown> = {}): boolean {
    const 有监听器 = super.emit(事件名, 参数)
    玩家类.事件.emit(事件名, {
      ...参数,
      玩家: this,
    })
    return 有监听器
  }
  回合开始() {
    玩家类.我方回合 = this.是否我方
    let 行动点 = 10
    if (!玩家类.游戏已开始) {
      this.我方先手 = true
      目标类.目标列表 = _.sortBy(目标类.目标列表, (x) =>
        x.是否我方 == this.是否我方 ? -1 : 1
      )
      玩家类.游戏已开始 = true
      玩家类.事件.on('行动点变化', (参数: { 变化值: number }) => {
        玩家类.行动点 = Math.min(10, Math.max(0, 玩家类.行动点 + 参数.变化值))
        玩家类.事件.emit('行动点变化时')
      })
      行动点 -= 3
      this.emit('祈愿倒计时变化', { 变化值: -1 })
      this.敌方玩家.emit('祈愿倒计时变化', { 变化值: -1 })
      this.敌方玩家.emit('获得卡', { 编号: 30099 })
      游戏开始前(this.是否我方)
      玩家类.事件.emit('游戏开始时')
    }
    this.emit('祈愿倒计时变化', { 变化值: -1 })
    this.emit('行动点变化', { 变化值: 行动点 - 玩家类.行动点 })
    this.回合首次神迹卡消耗变化值 = 0
    this.回合数++
    if (this.是否我方) {
      播放音频('prefab/pvp/我方回合，行动开始.mp3')
    }
    if (this.我方(附属神类).filter((x) => x.类型 == '附属神').length) {
      this.我方(位置类).forEach((x) => {
        if (x.盖雾倒计时 > 0) {
          x.盖雾倒计时--
          if (x.盖雾倒计时 == 0) {
            x.覆盖迷雾()
          }
        }
      })
    } else {
      行动队列类.发送通知({
        message:
          (this.是否我方 ? '我方' : '敌方') +
          '没有附属神，场地迷雾不会自动恢复',
        color: this.是否我方 ? 'blue' : 'red',
      })
    }
    this.emit('回合开始时')
    玩家类.重置倒计时()
    if (this.牌堆.length == 0) {
      this.枯竭回合数++
      this.我方(单位类).forEach((v) =>
        v.emit('受到攻击', {
          伤害值: 2 * this.枯竭回合数,
        })
      )
      行动队列类.发送通知({
        message: '信仰枯竭啦~',
        color: this.是否我方 ? 'blue' : 'red',
      })
    }
  }
  可祈愿() {
    return 玩家类.游戏已开始 && 玩家类.行动点 >= 2
  }
  祈愿消耗结算() {
    玩家类.事件.emit('行动点变化', { 变化值: -2 })
  }
  祈愿() {
    this.emit('祈愿倒计时变化', { 变化值: -1 })
    行动队列类.发送通知({
      message: '祈愿',
      color: this.是否我方 ? 'blue' : 'red',
    })
  }
}
export {
  主神类,
  位置类,
  单位类,
  弹幕卡类,
  技能类,
  效果类,
  牌类,
  玩家类,
  目标类,
  神迹卡类,
  附属神类,
  随机类,
}

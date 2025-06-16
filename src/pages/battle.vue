<template>
  <q-btn-group class="absolute q-dark">
    <q-btn to="/">回首页</q-btn>
    <q-btn to="/card_deck">回卡组</q-btn>
    <q-btn @click="投降并刷新()">投降并刷新</q-btn>
    <q-btn @click="历史弹窗 = true">历史</q-btn>
  </q-btn-group>
  <div ref="战斗框" class="overflow-hidden full-height full-width"></div>
  <q-dialog v-model="历史弹窗">
    <q-card class="text-white" style="min-width: 500px">
      <q-card-section
        v-for="(通知, i) in 通知列表"
        :key="i"
        :class="`bg-${通知.颜色}`"
        style="white-space: pre-wrap"
      >
        {{ 通知.消息 }}
        {{ 通知.说明 ? '\n' + 通知.说明 : '' }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { GlowFilter } from '@pixi/filter-glow'
import * as PXUI from '@pixi/ui'
import { useTimeoutFn } from '@vueuse/core'
import 静态文件列表 from 'assets/index.json'
import _ from 'lodash'
import * as PIXI from 'pixi.js'
import { Dialog, useQuasar } from 'quasar'
import { 创建画框 } from 'src/utils/创建画框'
import { 加载动画, 加载子画面, 加载普攻动画 } from 'src/utils/加载动画'
import { 字符串转编号卡组 } from 'src/utils/卡组'
import { 获得按钮 } from 'src/utils/按钮'
import {
  播放场景背景音乐,
  播放待机语音,
  播放攻击语音,
  播放攻击音效,
  播放神威语音,
  播放角色背景音乐,
  播放音频,
} from 'src/utils/播放音频'
import { 数据同步类型, 数据通道类, 行动类型 } from 'src/utils/数据通道'
import {
  位置类,
  单位类,
  弹幕卡类,
  玩家类,
  目标类,
  神迹卡类,
  附属神类,
  随机类,
} from 'src/utils/游戏'
import { 等待 } from 'src/utils/等待'
import { 获得资源 } from 'src/utils/美术资源'
import { 行动队列类 } from 'src/utils/行动队列'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const 历史弹窗 = ref(false)
const 通知列表 = ref(行动队列类.通知列表)

const 是否移动端 = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)

function 投降并刷新() {
  if (玩家类.游戏已开始) {
    行动队列类.行动队列.添加(['投降'])
  }
  location.reload()
}

const q = useQuasar()

let 强制结束回合: ReturnType<typeof setInterval> | undefined
onUnmounted(() => {
  if (玩家类.游戏已开始) {
    行动队列类.行动队列.添加(['投降'])
  }
  clearInterval(强制结束回合)
  location.reload()
})

const 背景选项 = [
  {
    label: '神道-高天原',
    value: '10001',
  },
  {
    label: '英灵所向之处-阿斯嘉德',
    value: '10002',
  },
  {
    label: '大雪原-尼夫尔海姆',
    value: '10003',
  },
  {
    label: '人造仙境-太清殿',
    value: '10004',
  },
  {
    label: '为世界献上咖喱~印度古城',
    value: '10005',
  },
  {
    label: '黄金之路-埃及地图',
    value: '10006',
  },
  {
    label: '神选之地-希腊地图',
    value: '10007',
  },
  {
    label: '玉清殿|南华庄',
    value: '10008',
  },
  {
    label: '文明开化-南华庄',
    value: '20001',
  },
  {
    label: 'signal-月面战争',
    value: '20002',
  },
  {
    label: 'signal-月阴',
    value: '20003',
  },
]

const 当前背景 = 背景选项[_.random(背景选项.length - 1)]

const 路由 = useRoute()
const 人数 = 2
const 我方卡组 = 字符串转编号卡组(路由.query['卡组'] as string)
const 玩家 = new 玩家类(true, 我方卡组)
let 敌方玩家: 玩家类
const 格 = 玩家.格

function 获得位置(
  坐标: { screenX: number; screenY: number },
  区: PIXI.Container
) {
  const 列 = Math.ceil(((坐标.screenX - 区.x) / 区.width) * 格)
  const 行 = Math.ceil(((坐标.screenY - 区.y) / 区.height) * 格)
  return {
    行,
    列,
  }
}
function 是否在区域中(
  坐标: { screenX: number; screenY: number },
  区: PIXI.Container,
  偏移: { x: number; y: number } = { x: 0, y: 0 }
) {
  return (
    坐标.screenX + 偏移.x > 区.x &&
    坐标.screenY + 偏移.y > 区.y &&
    坐标.screenX + 偏移.x < 区.x + 区.width &&
    坐标.screenY + 偏移.y < 区.y + 区.height
  )
}

const 战斗框 = ref<HTMLDivElement>()
let 战斗画框: ReturnType<typeof 创建画框>
let 状态 = ref<'布阵' | '战斗'>('布阵')
let 选择攻击目标模式 = false
const 待装填的弹幕卡 = ref<弹幕卡类>()
const 选中的单位 = ref<单位类>()

let bundles: PIXI.AssetsBundle[] = [
  {
    name: '布阵',
    assets: [
      {
        alias: '背景',
        src: [
          `background/BackgroundBattle_${当前背景.value}.webp`,
          'prebattle/布阵_01.mp3',
        ],
      },
      {
        alias: '拖放神明',
        src: ['prebattle/抓起神明.mp3', 'prebattle/放下神明.mp3'],
      },
    ],
  },
  {
    name: '匹配',
    assets: [
      {
        alias: '背景音乐',
        src: `background/BackgroundBattle_${当前背景.value}.mp3`,
      },
    ],
  },
  {
    name: '战斗',
    assets: [
      {
        alias: '攻击目标图',
        src: 'pvp/attack 1.webp',
      },
      {
        alias: '打击音效',
        src: [
          'prefab/pvp/打击1.mp3',
          'prefab/pvp/打击2.mp3',
          'prefab/pvp/打击3.mp3',
          'prefab/pvp/打击4.mp3',
          'prefab/pvp/storing.mp3',
        ],
      },
      {
        alias: '效果音效',
        src: 静态文件列表.filter((f) =>
          f.match(/^prefab\/pvp\/effect\d+\.mp3$/)
        ),
      },
      {
        alias: '角色相关',
        src: [
          'prefab/pvp/角色移动.mp3',
          'prefab/pvp/我方回合，行动开始.mp3',
          'prefab/pvp/我方回复，点选人物.mp3',
          'pvp/field/shengdun.webp',
        ],
      },
      {
        alias: '攻击按钮组',
        src: ['pvp/di.webp', 'pvp/shenwei.webp', 'pvp/gongji.webp'],
      },
      {
        alias: '神威黑边',
        src: 'pvp/field/FlashLine.webp',
      },
      {
        alias: '底边栏',
        src: [
          'pvp/icon xiaohao.webp',
          'pvp/icon xiaohao red.webp',
          'pvp/xia.webp',
          'pvp/jieshu.webp',
          'pvp/qiyuan.webp',
          'pvp/kazu.webp',
          'pvp/shoupai.webp',
          'pvp/倒计时--潜行.webp',
          'pvp/倒计时--结束.webp',
          'prefab/pvp/祈愿发动.mp3',
        ],
      },
      {
        alias: '胜利和失败',
        src: ['prefab/pvp/胜利_01.mp3', 'prefab/pvp/失败_01.mp3'],
      },
    ],
  },
]

onMounted(async () => {
  await PIXI.Assets.init({ manifest: { bundles } })
  await PIXI.Assets.loadBundle('布阵')
  if (!战斗框.value) return
  播放场景背景音乐('prebattle/布阵_01.mp3')
  战斗画框 = 创建画框()
  const 战斗画布 = 战斗画框.view
  const [宽, 高] = [战斗画布.width, 战斗画布.height]
  战斗框.value.appendChild(战斗画布)

  const 背景 = await 加载子画面(
    `background/BackgroundBattle_${当前背景.value}.webp`
  )
  背景.width = 宽
  背景.height = 高
  战斗画框.stage.addChild(背景)

  const 边 = Math.min(高, 宽) * 0.5

  const 场地横轴间隔 = 宽 / 人数
  const 横轴起点偏移 = (场地横轴间隔 - 边) / 2
  const 纵 = (高 - 边) / 2

  const 迷雾层 = new PIXI.Container<
    PIXI.Container<PIXI.Container<PIXI.Graphics>>
  >()
  迷雾层.alpha = 0.5
  const 边框层 = new PIXI.Container()
  const 位宽 = 边 / 格
  const 缩放比例 = 位宽 / 600

  function 获取触摸y轴偏移(攻击范围: string | undefined) {
    if (!是否移动端) return 0

    switch (攻击范围) {
      case '单':
      case '横':
        return -位宽 * 0.75
      case '圆':
      case '竖':
      case '十':
        return -位宽 * 1.75
      default:
        return -位宽 * 0.75
    }
  }

  const 线宽 = 位宽 / 25
  边框层.filters = [
    new GlowFilter({
      distance: 30,
      outerStrength: 2,
      innerStrength: 1,
      color: 0xffffff,
      quality: 0.5,
    }),
  ]
  边框层.cacheAsBitmap = true

  const 角色层 = new PIXI.Container<PIXI.Container<PIXI.Container>>()

  for (let i = 0; i < 人数; i++) {
    const 横 = 横轴起点偏移 + 场地横轴间隔 * i
    const 迷雾区 = new PIXI.Container<PIXI.Container<PIXI.Graphics>>()
    迷雾区.x = 横
    迷雾区.y = 纵
    迷雾层.addChild(迷雾区)
    const 边框区 = new PIXI.Graphics()
    边框区.x = 横
    边框区.y = 纵
    边框层.addChild(边框区)
    const 角色区 = new PIXI.Container<PIXI.Container>()
    角色区.x = 横
    角色区.y = 纵
    角色层.addChild(角色区)
    for (let r = 0; r < 格; r++) {
      const 迷雾行 = new PIXI.Container<PIXI.Graphics>()
      迷雾区.addChild(迷雾行)
      for (let c = 0; c < 格; c++) {
        const 迷雾格 = new PIXI.Graphics()
        迷雾格.position.set(c * 位宽, r * 位宽)
        迷雾格.beginFill(0x000000).drawRect(0, 0, 位宽, 位宽).endFill()
        迷雾行.addChild(迷雾格)

        边框区.lineStyle(线宽, 0xffffff, 1)
        边框区.moveTo((c + 2 / 5) * 位宽, r * 位宽)
        边框区.lineTo(c * 位宽, r * 位宽)
        边框区.lineTo(c * 位宽, (r + 2 / 5) * 位宽)
        边框区.moveTo((c + 3 / 5) * 位宽, r * 位宽)
        边框区.lineTo((c + 1) * 位宽, r * 位宽)
        边框区.lineTo((c + 1) * 位宽, (r + 2 / 5) * 位宽)
        边框区.moveTo(c * 位宽, (r + 3 / 5) * 位宽)
        边框区.lineTo(c * 位宽, (r + 1) * 位宽)
        边框区.lineTo((c + 2 / 5) * 位宽, (r + 1) * 位宽)
        if (r == 格 - 1 || c == 格 - 1) {
          边框区.moveTo((c + 1) * 位宽, (r + 3 / 5) * 位宽)
          边框区.lineTo((c + 1) * 位宽, (r + 1) * 位宽)
          边框区.lineTo((c + 3 / 5) * 位宽, (r + 1) * 位宽)
        }
      }
    }
  }

  玩家类.事件.on('迷雾被覆盖时', (参数: { 玩家: 玩家类; 位置: 位置类 }) => {
    迷雾层.children[参数.玩家.是否我方 ? 0 : 1].children[
      参数.位置.行 - 1
    ].children[参数.位置.列 - 1].alpha = 1
  })
  玩家类.事件.on('迷雾被解除时', (参数: { 玩家: 玩家类; 位置: 位置类 }) => {
    迷雾层.children[参数.玩家.是否我方 ? 0 : 1].children[
      参数.位置.行 - 1
    ].children[参数.位置.列 - 1].alpha = 0
  })

  战斗画框.stage.addChild(迷雾层)
  战斗画框.stage.addChild(边框层)
  const 选择移动层 = new PIXI.Graphics()
  选择移动层.x = 横轴起点偏移
  选择移动层.y = 纵
  战斗画框.stage.addChild(选择移动层)
  战斗画框.stage.addChild(角色层)
  const 攻击目标层 = new PIXI.Container()
  战斗画框.stage.addChild(攻击目标层)
  const 神威动画层 = new PIXI.Container()

  战斗画框.stage.addChild(神威动画层)
  const 攻击动画层 = new PIXI.Container()
  战斗画框.stage.addChild(攻击动画层)

  const 我方主神 = 玩家.主神
  玩家.主神.获得角色(位宽).then((角色) => 角色层.children[0].addChild(角色))
  玩家.我方(附属神类).forEach((附属神) => {
    附属神.获得角色(位宽).then((角色) => 角色层.children[0].addChild(角色))
  })
  角色层.children[0].sortChildren()
  玩家类.事件.on('单位创建时', async (参数: { 单位: 单位类; 玩家: 玩家类 }) => {
    角色层.children[参数.单位.是否我方 ? 0 : 1]
      .addChild(await 参数.单位.获得角色(位宽))
      .sortChildren()
  })

  战斗画框.ticker.add(() => {
    行动队列类.行动队列.渲染()
  })

  const 事件层 = new PIXI.Sprite()
  事件层.width = 宽
  事件层.height = 高
  事件层.eventMode = 'static'
  战斗画框.stage.addChild(事件层)

  watch(选中的单位, (v) => {
    if (v && 状态.value == '战斗') {
      播放音频('prefab/pvp/我方回复，点选人物.mp3')
    }
  })

  function 渲染移动范围() {
    选择移动层.clear()
    if (
      玩家类.我方回合 !== false &&
      选中的单位.value !== undefined &&
      选中的单位.value.可移动()
    ) {
      for (const _位置 of 选中的单位.value.获得移动范围()) {
        选择移动层.lineStyle(线宽, 0x00ff00, 1)
        选择移动层.drawRect(
          位宽 * (_位置.列 - 1),
          位宽 * (_位置.行 - 1),
          位宽,
          位宽
        )
        选择移动层.moveTo(位宽 * (_位置.列 - 0.5), 位宽 * (_位置.行 - 0.75))
        选择移动层.lineTo(位宽 * (_位置.列 - 0.5), 位宽 * (_位置.行 - 0.25))
        选择移动层.moveTo(位宽 * (_位置.列 - 0.75), 位宽 * (_位置.行 - 0.5))
        选择移动层.lineTo(位宽 * (_位置.列 - 0.25), 位宽 * (_位置.行 - 0.5))
      }
    }
  }
  玩家.on('回合开始时', 渲染移动范围)
  玩家类.事件.on('行动点变化时', 渲染移动范围)

  let 触摸开始时间: number

  事件层.on('pointerdown', (e) => {
    触摸开始时间 = Date.now()
    if (状态.value == '布阵') {
      if (
        是否在区域中(e, 迷雾层.children[0]) &&
        选中的单位.value === undefined
      ) {
        const { 行, 列 } = 获得位置(e, 迷雾层.children[0])
        const 神 = 玩家
          .我方(单位类)
          .find((_神) => _神.位置.行 == 行 && _神.位置.列 == 列)
        if (神 !== undefined) {
          选中的单位.value = 神
          播放音频('prebattle/抓起神明.mp3')
        }
      }
    } else if (状态.value == '战斗') {
      if (是否在区域中(e, 迷雾层.children[0])) {
        const { 行, 列 } = 获得位置(e, 迷雾层.children[0])
        const 神 = 玩家
          .我方(单位类)
          .find((_神) => _神.位置.行 == 行 && _神.位置.列 == 列)
        if (神 !== undefined) {
          选中的单位.value = 神
          if (
            待装填的弹幕卡.value &&
            神.可装填(待装填的弹幕卡.value) &&
            待装填的弹幕卡.value.已弃置 === false
          ) {
            行动队列类.行动队列.添加([
              '装填弹幕',
              神.id,
              待装填的弹幕卡.value.id,
            ])
          }
        } else if (
          玩家类.我方回合 !== false &&
          选中的单位.value !== undefined &&
          选中的单位.value.可移动()
        ) {
          const 神 = 选中的单位.value
          for (const 位置 of 神.获得移动范围()) {
            if (位置.行 == 行 && 位置.列 == 列) {
              行动队列类.行动队列.添加(['移动', 神.id, 行, 列])
              return
            }
          }
        }
      } else if (!是否在区域中(e, 迷雾层.children[1])) {
        选中的单位.value = undefined
        选择攻击目标模式 = false
      }
      待装填的弹幕卡.value = undefined
    }
  })
  事件层.on('pointermove', async (e) => {
    const 坐标 = {
      screenX: e.screenX,
      screenY: e.screenY + 获取触摸y轴偏移(选中的单位.value?.弹幕?.范围),
    }

    if (选中的单位.value !== undefined) {
      const 神 = 选中的单位.value
      if (状态.value == '布阵') {
        神.角色.x = 坐标.screenX - 迷雾层.children[0].x - 位宽 / 2
        神.角色.y = 坐标.screenY - 迷雾层.children[0].y - 位宽 / 2
        神.角色.zIndex = 神.角色.y
        神.角色.parent.sortChildren()
      }
      攻击目标层.removeChild(...攻击目标层.children)
      if (
        状态.value == '战斗' &&
        选择攻击目标模式 &&
        是否在区域中(坐标, 迷雾层.children[1])
      ) {
        const { 行, 列 } = 获得位置(坐标, 迷雾层.children[1])
        const 位置 = 玩家.敌方(位置类).find((x) => x.行 == 行 && x.列 == 列)!
        for (let _位置 of 神.获得攻击范围(位置)) {
          let 选择攻击目标图 = await 加载子画面('pvp/attack 1.webp')
          选择攻击目标图.x = 迷雾层.children[1].x + 位宽 * (_位置.列 - 1)
          选择攻击目标图.y = 迷雾层.children[1].y + 位宽 * (_位置.行 - 1)
          选择攻击目标图.width = 位宽
          选择攻击目标图.height = 位宽
          攻击目标层.addChild(选择攻击目标图)
        }
      }
    }
  })
  事件层.on('pointerup', (e) => {
    const 坐标 = {
      screenX: e.screenX,
      screenY: e.screenY,
    }

    if (Date.now() - 触摸开始时间 > 150) {
      坐标.screenY += 获取触摸y轴偏移(选中的单位.value?.弹幕?.范围)
    }

    if (
      状态.value == '布阵' &&
      选中的单位.value !== undefined &&
      是否在区域中(坐标, 迷雾层.children[0])
    ) {
      const 位置 = 获得位置(坐标, 迷雾层.children[0])
      const 神 = 选中的单位.value
      if (神.位置.行 == 位置.行 && 神.位置.列 == 位置.列) {
        选中的单位.value = undefined
        播放音频('prebattle/放下神明.mp3')
      } else if (
        !玩家
          .我方(单位类)
          .find((_神) => _神.位置.行 == 位置.行 && _神.位置.列 == 位置.列)
      ) {
        神.传送(
          神.我方(位置类).find((x) => x.行 == 位置.行 && x.列 == 位置.列)!
        )
        选中的单位.value = undefined
        播放音频('prebattle/放下神明.mp3')
      }
      神.更新坐标(位宽)
    } else if (状态.value == '战斗') {
      if (是否在区域中(坐标, 迷雾层.children[1])) {
        if (选中的单位.value !== undefined && 选择攻击目标模式) {
          攻击目标层.removeChild(...攻击目标层.children)
          选择攻击目标模式 = false
          const 神 = 选中的单位.value
          const 位置 = 获得位置(坐标, 迷雾层.children[1])
          行动队列类.行动队列.添加(['攻击', 神.id, 位置.行, 位置.列])
        }
      } else {
        选择攻击目标模式 = false
      }
    }
  })

  await PIXI.Assets.loadBundle('战斗')
  let 攻击按钮组 = new PIXI.Container()
  const 主神技能按钮 = new PXUI.Button(await 加载子画面('pvp/shenwei.webp'))
  let 攻击按钮组背景 = await 加载子画面('pvp/di.webp')
  let 攻击按钮 = new PXUI.Button(await 加载子画面('pvp/gongji.webp'))
  攻击按钮组背景.x = 攻击按钮.view.width * 0.6
  攻击按钮组背景.y = 主神技能按钮.view.height * 0.35
  主神技能按钮.view.x =
    攻击按钮组背景.x + 攻击按钮组背景.width - 主神技能按钮.view.width
  主神技能按钮.onPress.connect(() => {
    if (玩家.主神.神威.可触发() && 行动队列类.行动队列.待渲染.length === 0) {
      行动队列类.行动队列.添加(['神威'])
    }
  })
  行动队列类.行动队列.on('结算', (是否我方: boolean, 行动: 行动类型) => {
    玩家类.重置倒计时()
    if (行动[0] == '攻击') {
      const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
      单位.攻击消耗结算()
    } else if (行动[0] == '移动') {
      const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
      单位.移动消耗结算()
    } else if (行动[0] == '祈愿') {
      玩家.祈愿消耗结算()
    } else if (行动[0] == '装填弹幕') {
      const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
      const 弹幕卡 = 目标类.目标列表.find((x) => x.id == 行动[2]) as 弹幕卡类
      单位.装填消耗结算(弹幕卡)
    } else if (行动[0] == '神威') {
      if (是否我方) {
        玩家.主神.神威.消耗结算()
      } else {
        玩家.敌方玩家.主神.神威.消耗结算()
      }
    } else if (行动[0] == '使用神迹') {
      const 神迹卡 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 神迹卡类
      神迹卡.消耗结算()
    } else if (行动[0] == '投降' && !是否我方) {
      q.notify({ message: '对方投降，5秒后将刷新页面', type: 'positive' })
      useTimeoutFn(() => {
        location.reload()
      }, 5000)
    }
  })
  行动队列类.行动队列.on(
    '渲染',
    async (是否我方: boolean, ...行动: 行动类型) => {
      try {
        if (行动[0] == '使用神迹') {
          const 神迹卡 = 目标类.目标列表.find(
            (x) => x.id == 行动[1]
          ) as 神迹卡类
          神迹卡.使用()
        }
        if (行动[0] == '回合结束') {
          if (是否我方) {
            玩家.敌方玩家.回合开始()
          } else {
            玩家.回合开始()
          }
        }
        if (行动[0] == '神威') {
          const re = 是否我方 ? 1 : -1
          const 主神 = 是否我方 ? 玩家.主神 : 玩家.敌方玩家.主神
          主神.emit('发动神威')
          const 神威背光 = await PIXI.Texture.fromURL(
            获得资源(主神.美术资源, (f, i) => f === `flash/FlashBG_${i}.webp`)!
          )
          const 背光动画 = new PIXI.TilingSprite(神威背光, 宽, 神威背光.height)
          背光动画.y = 高 * 0.1
          背光动画.scale.y = (高 * 0.5) / 背光动画.height
          const 神威黑边 = await PIXI.Texture.fromURL(
            'pvp/field/FlashLine.webp'
          )
          const 上黑边动画 = new PIXI.TilingSprite(
            神威黑边,
            宽,
            神威黑边.height
          )
          上黑边动画.y = 高 * 0.075
          上黑边动画.scale.x = (宽 * 2) / 神威黑边.width
          上黑边动画.scale.y = (高 * 0.05) / 神威黑边.height
          const 神威动画 = await 加载动画(
            获得资源(
              主神.美术资源,
              (f, i) => f === `spine/flash/${i}/${i}.json`
            )!
          )
          神威动画.state.setAnimation(0, 'newAnimation', false)
          神威动画.x = 宽 * 0.5
          神威动画.y = 高 * 0.6
          神威动画.scale.x = ((高 * 0.6) / 神威动画.height) * re
          神威动画.scale.y = (高 * 0.6) / 神威动画.height
          const 下黑边动画 = new PIXI.TilingSprite(
            神威黑边,
            宽,
            神威黑边.height
          )
          下黑边动画.y = 高 * (0.6 - 0.2 / 2)
          下黑边动画.scale.x = (宽 * 2) / 神威黑边.width
          下黑边动画.scale.y = (高 * 0.2) / 神威黑边.height
          战斗画框.ticker.add(() => {
            背光动画.tilePosition.x += (背光动画.width / 宽) * 25 * re
            上黑边动画.tilePosition.x += (上黑边动画.width / 宽) * 2 * re
            下黑边动画.tilePosition.x += (下黑边动画.width / 宽) * 2 * re
          })
          const 神威描述 = new PIXI.Text(
            `${主神.神威.技能名称}\n${主神.神威.技能描述}`,
            {
              fill: 0xffffff,
              fontSize: 32,
            }
          )
          神威描述.x = (宽 - 神威描述.width) / 2
          神威描述.y = 高 * 0.6
          神威动画层.addChild(背光动画)
          神威动画层.addChild(上黑边动画)
          神威动画层.addChild(神威动画)
          神威动画层.addChild(下黑边动画)
          神威动画层.addChild(神威描述)
          播放神威语音(主神.美术资源)
          await 等待(
            神威动画.spineData.findAnimation('newAnimation')?.duration || 3
          )
          神威动画层.removeChild(...神威动画层.children)
          行动队列类.行动队列.完成渲染()
          return
        }
        let _d
        if (是否我方) {
          _d = 1
        } else {
          _d = 0
        }
        if (行动[0] == '装填弹幕') {
          播放音频('prefab/pvp/storing.mp3')
          const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
          const 弹幕卡 = 目标类.目标列表.find(
            (x) => x.id == 行动[2]
          ) as 弹幕卡类
          单位.装填弹幕(弹幕卡)
        } else if (行动[0] == '攻击') {
          const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
          const 位置 = 单位
            .敌方(位置类)
            .find((x) => x.行 == 行动[2] && x.列 == 行动[3])!
          const 攻击范围 = 单位.获得攻击范围(位置)
          单位.攻击前()
          单位.动画.state.setAnimation(0, 'attack', false)
          单位.动画.state.addAnimation(0, 'idle', true, 0)
          播放攻击语音(单位.美术资源)
          播放攻击音效(单位.美术资源)
          await 等待(
            (单位.动画.spineData.findAnimation('attack')?.duration || 0) - 0.3
          )
          for (let _位置 of 攻击范围) {
            let 攻击动画 = await 加载普攻动画(单位.美术资源)
            if (攻击动画) {
              攻击动画.x = 迷雾层.children[_d].x + 位宽 * (_位置.列 - 0.5)
              攻击动画.y = 迷雾层.children[_d].y + 位宽 * (_位置.行 - 0.5)
              攻击动画.scale.set(缩放比例)
              攻击动画.state.setAnimation(0, 'idle', false)
              攻击动画层.addChild(攻击动画)
              等待(
                攻击动画.spineData.findAnimation('idle')?.duration || 0
              ).then(() => {
                攻击动画层.removeChild(攻击动画)
              })
            }
          }
          // 待做
          // 打击1.mp3 打甲
          // 打击2.mp3 空地
          // 打击3.mp3 圣盾
          // 打击4.mp3 无护甲
          播放音频(`prefab/pvp/打击${_.random(1, 4)}.mp3`)
          单位.攻击(攻击范围)
        } else if (行动[0] == '移动') {
          if (是否我方) 播放音频('prefab/pvp/角色移动.mp3')
          const 单位 = 目标类.目标列表.find((x) => x.id == 行动[1]) as 单位类
          const 位置 = 单位
            .我方(位置类)
            .find((x) => x.行 == 行动[2] && x.列 == 行动[3])!
          单位.移动(位置)
          渲染移动范围()
          单位.动画.state.setAnimation(0, 'move', false)
          单位.动画.state.addAnimation(
            0,
            单位.弹幕 ? (单位.弹幕.吟唱时间 ? 'storing' : 'stored') : 'idle',
            true,
            0
          )
          单位.更新坐标(位宽)
        } else if (行动[0] == '祈愿') {
          播放音频('prefab/pvp/祈愿发动.mp3')
          玩家.祈愿()
        }
        行动队列类.行动队列.完成渲染()
      } catch (e) {
        q.notify({ message: `渲染报错：${e}`, type: 'negative' })
        行动队列类.行动队列.完成渲染()
      }
    }
  )
  玩家类.事件.on('单位传送时', (参数: { 单位: 单位类; 玩家: 玩家类 }) => {
    参数.单位.更新坐标(位宽)
  })
  攻击按钮.view.y =
    攻击按钮组背景.y + 攻击按钮组背景.height - 攻击按钮.view.height
  攻击按钮.onPress.connect(() => {
    if (选中的单位.value !== undefined && 选中的单位.value.可攻击()) {
      选择攻击目标模式 = true
    }
  })
  攻击按钮组.addChild(攻击按钮组背景)
  攻击按钮组.addChild(主神技能按钮.view)
  攻击按钮组.addChild(攻击按钮.view)
  攻击按钮组.scale.set((高 * 0.3) / 攻击按钮组.height)
  攻击按钮组.x = 宽 - 攻击按钮组.width
  攻击按钮组.y = 高 - 攻击按钮组.height

  攻击按钮组.visible = false

  const 更新按钮组 = () => {
    if (状态.value == '战斗' && 玩家类.我方回合 !== false) {
      if (选中的单位.value !== undefined) {
        const 神 = 选中的单位.value
        播放角色背景音乐(神.美术资源)
        播放待机语音(神.美术资源)
        if (神.id == 玩家.主神.id) {
          主神技能按钮.view.visible = true
        } else {
          主神技能按钮.view.visible = false
        }
        if (神.可攻击()) {
          攻击按钮.enabled = true
        } else {
          攻击按钮.enabled = false
          选择攻击目标模式 = false
        }
        攻击按钮组.visible = true
        渲染移动范围()
      } else {
        攻击按钮组.visible = false
        选择移动层.clear()
      }
    }
  }
  watch(选中的单位, 更新按钮组)
  玩家类.事件.on('回合开始时', 更新按钮组)

  await PIXI.Assets.loadBundle('匹配')
  const 数据通道 = new 数据通道类()

  数据通道.on('连接成功', () => {
    数据通道.发送数据({
      k: '初始数据',
      v: {
        主神: {
          id: 我方主神.id,
          编号: 我方主神.编号,
          技能: 我方卡组.主神技能,
          位置: { 行: 我方主神.位置.行, 列: 我方主神.位置.列 },
        },
        附属神: 玩家.我方(附属神类).map((v) => ({
          id: v.id,
          编号: v.编号,
          位置: { 行: v.位置.行, 列: v.位置.列 },
        })),
        弹幕卡: 玩家.我方(弹幕卡类).map((v) => ({
          id: v.id,
          编号: v.编号,
        })),
        神迹卡: 玩家.我方(神迹卡类).map((v) => ({
          id: v.id,
          编号: v.编号,
        })),
      },
    })
    行动队列类.行动队列.on('添加', (行动) => {
      数据通道.发送数据({ k: '行动', v: 行动 })
    })
    状态.value = '战斗'
  })
  数据通道.on('收到数据', (d: 数据同步类型) => {
    if (d.k == '行动') {
      行动队列类.行动队列.接收(d.v)
    } else if (d.k == '初始数据') {
      随机类.随机数种子 = 玩家.主神.id + d.v.主神.id
      敌方玩家 = new 玩家类(false, d.v)
      玩家.敌方玩家 = 敌方玩家
      敌方玩家.敌方玩家 = 玩家

      if (玩家.主神.id > 敌方玩家.主神.id) {
        玩家.回合开始()
      } else {
        敌方玩家.回合开始()
      }
    }
  })
  数据通道.on('对方掉线', () => {
    q.notify({ message: '对方掉线了，5秒后将刷新页面', type: 'warning' })
    useTimeoutFn(() => {
      location.reload()
    }, 5000)
  })

  const 回合栏 = new PIXI.Container()
  const 消耗栏底框 = await 加载子画面('pvp/xia.webp')
  消耗栏底框.scale.set(
    Math.min((纵 * 0.4) / 消耗栏底框.height, 宽 / 消耗栏底框.width)
  )
  消耗栏底框.x = (宽 - 消耗栏底框.width) / 2
  消耗栏底框.y = 高 - 消耗栏底框.height
  回合栏.addChild(消耗栏底框)
  for (let i = 0; i < 10; i++) {
    const 蓝祈愿点 = await 加载子画面('pvp/icon xiaohao.webp')
    const 红祈愿点 = await 加载子画面('pvp/icon xiaohao red.webp')
    const 更新祈愿点 = (参数: { 玩家: 玩家类 }) => {
      红祈愿点.visible = 蓝祈愿点.visible = 参数.玩家.行动点 > i
      if (玩家类.我方回合 !== false) {
        红祈愿点.visible = false
      } else {
        蓝祈愿点.visible = false
      }
    }
    玩家类.事件.on('行动点变化时', 更新祈愿点)
    玩家类.事件.on('回合开始时', 更新祈愿点)
    const scale = (消耗栏底框.width * 0.05) / 蓝祈愿点.width
    蓝祈愿点.scale.set(scale)
    红祈愿点.scale.set(scale)
    红祈愿点.x = 蓝祈愿点.x =
      消耗栏底框.x + 消耗栏底框.width * 0.195 + i * 蓝祈愿点.width * 0.777
    红祈愿点.y = 蓝祈愿点.y = 消耗栏底框.y + 消耗栏底框.height * 0.37
    回合栏.addChild(蓝祈愿点)
    回合栏.addChild(红祈愿点)
  }
  const 祈愿按钮 = new PXUI.Button(await 加载子画面('pvp/qiyuan.webp'))
  祈愿按钮.onPress.connect(() => {
    if (玩家类.我方回合 !== false && 玩家.可祈愿()) {
      行动队列类.行动队列.添加(['祈愿'])
    }
  })
  祈愿按钮.view.x = 消耗栏底框.x + 消耗栏底框.width * 0.794
  祈愿按钮.view.y = 消耗栏底框.y + 消耗栏底框.height * 0.19
  祈愿按钮.view.scale.set((消耗栏底框.width * 0.195) / 祈愿按钮.view.width)
  回合栏.addChild(祈愿按钮.view)

  const 祈愿消耗 = new PIXI.Text('2', {
    fill: 0xffffff,
    strokeThickness: 2,
  })
  祈愿消耗.scale.set((消耗栏底框.height * 0.28) / 祈愿消耗.height)
  祈愿消耗.x = 消耗栏底框.x + 消耗栏底框.width * 0.96
  祈愿消耗.y = 消耗栏底框.y + 消耗栏底框.height * 0.62
  回合栏.addChild(祈愿消耗)

  const 结束回合按钮 = new PXUI.Button(await 加载子画面('pvp/jieshu.webp'))
  结束回合按钮.view.x = 消耗栏底框.x + 消耗栏底框.width * 0.011
  结束回合按钮.view.y = 消耗栏底框.y + 消耗栏底框.height * 0.19
  结束回合按钮.view.scale.set(
    (消耗栏底框.width * 0.195) / 结束回合按钮.view.width
  )
  function 结束回合() {
    if (玩家类.我方回合 && 行动队列类.行动队列.待渲染.length === 0) {
      选中的单位.value = undefined
      行动队列类.行动队列.添加(['回合结束'])
    }
  }
  结束回合按钮.onPress.connect(结束回合)
  回合栏.addChild(结束回合按钮.view)

  const 抽卡倒计时 = new PIXI.Text(玩家.祈愿倒计时, {
    fill: 0xffffff,
    strokeThickness: 2,
  })
  玩家类.事件.on('祈愿倒计时变化时', (参数: { 玩家: 玩家类 }) => {
    抽卡倒计时.text = 参数.玩家.祈愿倒计时
  })
  抽卡倒计时.scale.set((消耗栏底框.height * 0.28) / 抽卡倒计时.height)
  抽卡倒计时.x = 消耗栏底框.x + 消耗栏底框.width * 0.622
  抽卡倒计时.y = 消耗栏底框.y + 消耗栏底框.height * 0.41
  回合栏.addChild(抽卡倒计时)

  const 牌堆图片 = await 加载子画面('pvp/kazu.webp')
  牌堆图片.scale.set((消耗栏底框.height * 0.28) / 牌堆图片.height)
  牌堆图片.x = 消耗栏底框.x + 消耗栏底框.width * 0.22
  牌堆图片.y = 消耗栏底框.y + 消耗栏底框.height * 0.08
  回合栏.addChild(牌堆图片)

  const 牌堆数量 = new PIXI.Text(`x${玩家.牌堆.length}`, {
    fill: 0xffffff,
    strokeThickness: 2,
  })
  玩家.on('抽卡时', () => {
    牌堆数量.text = `x${玩家.牌堆.length}`
  })
  牌堆数量.scale.set((消耗栏底框.height * 0.28) / 牌堆数量.height)
  牌堆数量.x = 消耗栏底框.x + 消耗栏底框.width * 0.28
  牌堆数量.y = 消耗栏底框.y + 消耗栏底框.height * 0.06
  回合栏.addChild(牌堆数量)

  const 手牌图片 = await 加载子画面('pvp/shoupai.webp')
  手牌图片.scale.set((消耗栏底框.height * 0.28) / 手牌图片.height)
  手牌图片.x = 消耗栏底框.x + 消耗栏底框.width * 0.35
  手牌图片.y = 消耗栏底框.y + 消耗栏底框.height * 0.08
  回合栏.addChild(手牌图片)

  const 手牌数量 = new PIXI.Text(`x${玩家.手牌.length}`, {
    fill: 0xffffff,
    strokeThickness: 2,
  })
  玩家.on('手牌数量变化时', () => {
    手牌数量.text = `x${玩家.手牌.length}`
  })
  手牌数量.scale.set((消耗栏底框.height * 0.28) / 手牌数量.height)
  手牌数量.x = 消耗栏底框.x + 消耗栏底框.width * 0.41
  手牌数量.y = 消耗栏底框.y + 消耗栏底框.height * 0.06
  回合栏.addChild(手牌数量)

  const 倒计时结束 = await 加载子画面('pvp/倒计时--结束.webp')
  倒计时结束.visible = false
  倒计时结束.x = 消耗栏底框.x + 倒计时结束.width * 0.5
  倒计时结束.y = 消耗栏底框.y
  const 倒计时潜行 = await 加载子画面('pvp/倒计时--潜行.webp')
  倒计时潜行.visible = false
  倒计时潜行.x = 消耗栏底框.x + 消耗栏底框.width - 倒计时潜行.width
  倒计时潜行.y = 消耗栏底框.y + 消耗栏底框.height - 倒计时潜行.height
  强制结束回合 = setInterval(() => {
    if (玩家类.我方回合 === undefined) {
      return
    }
    const 倒计时 = (玩家类.倒计时 - Date.now()) / 1000
    if (倒计时 > 0) {
      if (倒计时 < 3) {
        倒计时潜行.visible = false
        倒计时结束.visible = true
        倒计时结束.y =
          消耗栏底框.y +
          消耗栏底框.height -
          倒计时潜行.height * (Math.cos(倒计时) / Math.PI + 0.5)
      } else if (倒计时 < 30) {
        倒计时潜行.visible = true
        倒计时结束.visible = false
        倒计时潜行.x =
          消耗栏底框.x + (消耗栏底框.width - 倒计时潜行.width) * (倒计时 / 30)
        倒计时潜行.y =
          消耗栏底框.y +
          消耗栏底框.height -
          倒计时潜行.height * (Math.cos(倒计时) / Math.PI + 0.5)
      } else {
        倒计时潜行.visible = false
        倒计时结束.visible = false
      }
    } else {
      结束回合()
      玩家类.重置倒计时()
    }
  }, 20)
  回合栏.addChild(倒计时结束)
  回合栏.addChild(倒计时潜行)

  战斗画框.stage.addChild(回合栏)

  const 选中的手牌 = ref<PXUI.ButtonContainer>()
  const 手牌栏 = new PIXI.Container<PXUI.ButtonContainer>()

  事件层.on('pointermove', (e) => {
    if (选中的手牌.value !== undefined) {
      const 卡面 = 选中的手牌.value
      卡面.scale.set(1)
      const 卡面缩放 = Math.min((纵 * 0.6) / 卡面.height, 宽 / 10 / 卡面.width)
      卡面.scale.set(卡面缩放 * 2)
      卡面.x = e.screenX - 卡面.width / 2
      卡面.y = e.screenY - 卡面.height / 2
    }
  })

  玩家.on(
    '手牌数量变化时',
    _.throttle(async () => {
      await Promise.all(
        玩家.手牌.map(async (v, i) => {
          const 已创建 = !!v.卡面
          const 卡面 = await v.获得卡面()
          _.set(卡面, 'id', v.id)
          卡面.scale.set(1)
          const 卡面焦点缩放 = 消耗栏底框.y / 卡面.height
          const 卡面缩放 = Math.min(
            (纵 * 0.6) / 卡面.height,
            宽 / 10 / 卡面.width
          )
          卡面.scale.set(卡面缩放)
          const 原横坐标 =
            (宽 - 卡面.width * 玩家.手牌.length) / 2 + 卡面.width * i
          const 原纵坐标 = 消耗栏底框.y - 卡面.height
          卡面.x = 原横坐标
          卡面.y = 原纵坐标
          _.set(卡面, '原横坐标', 原横坐标)
          if (已创建) return

          卡面.onDown.connect(() => {
            卡面.scale.set(卡面焦点缩放)
            卡面.x = (宽 - 卡面.width) / 2
            卡面.y = 0
            卡面.zIndex = 1
            手牌栏.sortChildren()
            选中的手牌.value = 卡面
          })

          卡面.on('pointermove', (e) => {
            if (选中的手牌.value !== undefined) {
              卡面.scale.set(卡面缩放 * 2)
              卡面.x = e.screenX - 卡面.width / 2
              卡面.y = e.screenY - 卡面.height / 2
            }
          })

          卡面.onUp.connect(async (b, e) => {
            选中的手牌.value = undefined
            卡面.scale.set(卡面缩放)
            卡面.x = _.get(卡面, '原横坐标', 原横坐标)
            卡面.y = 原纵坐标
            卡面.zIndex = 0
            if (
              e &&
              e.screenY < 原纵坐标 &&
              玩家类.我方回合 !== false &&
              玩家.行动点 >= v.消耗
            ) {
              if (v instanceof 弹幕卡类) {
                //待装填的弹幕卡.value = v
                const 我方单位列表 = v.我方(单位类).filter((v) => v.可否装填)
                let 选中的单位索引: number | null = null

                选中的单位索引 = await new Promise<number>((resolve) => {
                  Dialog.create({
                    title: '选择',
                    options: {
                      model: '0',
                      items: 我方单位列表.map((v, i) => ({
                        value: `${i}`,
                        label: `${v.类型}${v.卡牌名称}，第${v.位置.行}，第行${v.位置.列}列`,
                      })),
                    },
                    cancel: true,
                    persistent: true,
                  }).onOk((v) => {
                    resolve(v)
                  })
                })
                行动队列类.行动队列.添加(['选择', v.id, 选中的单位索引])
                const 弹幕装填单位 = 我方单位列表[选中的单位索引]
                if (弹幕装填单位) {
                  行动队列类.行动队列.添加(['装填弹幕', 弹幕装填单位.id, v.id])
                }
              } else if (v instanceof 神迹卡类 && v.可使用()) {
                行动队列类.行动队列.添加(['使用神迹', v.id])
              }
            }
          })
          卡面.onOut.connect(() => {
            卡面.scale.set(卡面缩放)
            卡面.x = _.get(卡面, '原横坐标', 原横坐标)
            卡面.y = 原纵坐标
            卡面.zIndex = 0
          })
          手牌栏.addChild(卡面)
        })
      )
      const 手牌键列表 = 玩家.手牌.map((v) => v.id)
      手牌栏.removeChild(
        ...手牌栏.children.filter(
          (v) => !手牌键列表.includes(_.get(v, 'id', 0))
        )
      )
    }, 1000)
  )
  回合栏.addChild(手牌栏)

  const 开始匹配按钮 = 获得按钮(
    '开始匹配',
    位宽,
    消耗栏底框.x,
    纵 + 边,
    消耗栏底框.width,
    高 - 纵 - 边,
    () => {
      战斗画框.stage.removeChild(开始匹配按钮.view)
      try {
        数据通道.开始匹配(格)
      } catch (e) {
        q.notify({
          type: 'negative',
          message: `匹配报错：${e}`,
        })
      }
    }
  )

  战斗画框.stage.addChild(开始匹配按钮.view)
  战斗画框.stage.addChild(攻击按钮组)

  watch(状态, (v) => {
    if (v == '战斗') {
      播放音频('prebattle/vs.mp3')
      玩家.我方(单位类).forEach((v) => {
        v.更新坐标(位宽)
      })
      播放场景背景音乐(`background/BackgroundBattle_${当前背景.value}.mp3`)
    }
  })

  watch(待装填的弹幕卡, (v) => {
    if (v) {
      玩家.我方(单位类).forEach((v) => {
        if (!v.可否装填) {
          v.角色.alpha = 0.1
        }
      })
    } else {
      玩家.我方(单位类).forEach((v) => {
        if (v.角色.alpha == 0.1) {
          v.角色.alpha = 1
        }
      })
    }
  })
})
</script>

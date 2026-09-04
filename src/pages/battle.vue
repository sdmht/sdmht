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
  播放技能语音,
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
  弹窗选择目标,
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
  const 技能展示层 = new PIXI.Container()
  技能展示层.sortableChildren = true
  技能展示层.zIndex = 999
  战斗画框.stage.addChild(技能展示层)

  // 技能展示队列
  let 技能展示队列: Array<{
    技能名称: string
    技能描述: string
    携带者编号: number
    美术资源: number[]
    是否我方: boolean
    卡牌名称: string
    携带者类型: string
    生命值: number
    攻击力: number
    移动力: number
  }> = []
  let 正在展示技能 = false
  // 用于 UI 层：同一个角色在队列中的连续动画只保留一个（最后一个）
  // 不拦截不同携带者之间的交错，也不拦截同一角色不同技能交替显示（只要队列中不是连续即可）
  function 入队并折叠同角色连续(信息: {
    携带者编号: number
    [k: string]: unknown
  }) {
    // 若队尾条目来自同一角色（"连续"），则直接用新条目替换旧条目，达到只显示一个的效果
    if (
      技能展示队列.length > 0 &&
      技能展示队列[技能展示队列.length - 1].携带者编号 === 信息.携带者编号
    ) {
      技能展示队列[技能展示队列.length - 1] =
        信息 as (typeof 技能展示队列)[number]
    } else {
      技能展示队列.push(信息 as (typeof 技能展示队列)[number])
    }
  }
  // 神威动画播放中标记
  let 神威播放中 = false
  let 神威完成等待者: Array<() => void> = []

  function 等待神威完成() {
    if (!神威播放中) return Promise.resolve()
    return new Promise<void>((resolve) => {
      神威完成等待者.push(resolve)
    })
  }

  function 神威完成() {
    神威播放中 = false
    const 等待者 = 神威完成等待者.splice(0)
    等待者.forEach((r) => r())
  }

  // 简易补间：按时长（秒）与缓动函数逐帧更新
  function 补间(
    时长: number,
    缓动: (t: number) => number,
    更新: (p: number) => void
  ) {
    return new Promise<void>((resolve) => {
      const 开始 = Date.now()
      function 帧() {
        const 进度 = Math.min((Date.now() - 开始) / (时长 * 1000), 1)
        更新(缓动(进度))
        if (进度 >= 1) resolve()
        else requestAnimationFrame(帧)
      }
      帧()
    })
  }

  async function 显示技能UI(技能信息: {
    技能名称: string
    技能描述: string
    携带者编号: number
    美术资源: number[]
    是否我方: boolean
    卡牌名称: string
    携带者类型: string
    生命值: number
    攻击力: number
    移动力: number
  }) {
    // 入队并折叠同角色的连续动画：若队尾已是同一角色则替换，否则追加
    入队并折叠同角色连续(技能信息)
    if (正在展示技能) return
    正在展示技能 = true

    // 加载Action_bg背景（仅首次）
    let 动作背景纹理: PIXI.Texture | null = null
    try {
      动作背景纹理 = await PIXI.Assets.load('pvp/shader/Action_bg.webp')
    } catch {
      // 忽略
    }

    while (技能展示队列.length > 0) {
      const 当前技能 = 技能展示队列.shift()!
      try {
        // 等待神威动画播放完毕
        await 等待神威完成()

        // 等待一小段时间，确保动画不重叠
        await 等待(0.3)

        // 移动端适配：以1040×803设计比例（≈1.295:1）等比缩放整个技能展示UI，
        // 窄屏（竖屏）时设计区域按宽度收缩并在屏幕上居中，PC端与原值完全一致
        const 设计宽 = Math.min(宽, 高 * 1.295)
        const 设计高 = 设计宽 / 1.295
        const 设计X = (宽 - 设计宽) / 2

        // 1. 暗色遮罩（变暗效果，全屏）
        const 变暗遮罩 = new PIXI.Graphics()
        变暗遮罩.beginFill(0x000000, 0.7)
        变暗遮罩.drawRect(0, 0, 宽, 高)
        变暗遮罩.endFill()
        变暗遮罩.zIndex = 0
        技能展示层.addChild(变暗遮罩)

        // 1b. 统一动画容器（背景+立绘+文字作为一个整体移动）
        const 技能动画容器 = new PIXI.Container()
        技能动画容器.sortableChildren = true
        技能动画容器.zIndex = 1
        技能展示层.addChild(技能动画容器)

        // 2. Action_bg 背景图（缩小并下移），记录渲染区域供立绘相对定位
        // 宽度优先：竖屏铺满120%屏宽（左右各溢出屏幕10%，等比缩放）；
        // 横屏/PC保持原设计大小（0.522倍满屏，不超过设计宽度）
        let 背景X = 设计X
        let 背景显示宽 = 设计宽 * 0.522
        let 背景显示高 = 设计高 * 0.522
        const 背景Y = 高 * 0.25
        // 底部留白20%：入场时容器还会下移4%屏高，故背景底端不得超过 0.76高
        const 底部界限 = 高 * 0.76
        const 允许背景高 = 底部界限 - 背景Y
        if (动作背景纹理) {
          const 动作背景 = new PIXI.Sprite(动作背景纹理)
          const 纹理宽 = 动作背景.texture.width
          const 纹理高 = 动作背景.texture.height
          // 高度约束：背景显示高不得超过允许背景高
          const 高度缩放上限 = 允许背景高 / 纹理高
          const 缩放X =
            宽 < 高
              ? Math.min((宽 * 1.5) / 纹理宽, 高度缩放上限)
              : Math.min((宽 / 纹理宽) * 0.522, 高度缩放上限)
          const 缩放Y =
            宽 < 高 ? 缩放X : Math.min((高 / 纹理高) * 0.522, 高度缩放上限)
          // 敌方水平翻转
          动作背景.scale.set(当前技能.是否我方 ? 缩放X : -缩放X, 缩放Y)
          // 向下偏移
          动作背景.y = 背景Y
          背景显示宽 = 动作背景.texture.width * 缩放X
          背景显示高 = 动作背景.texture.height * 缩放Y
          // 向屏幕中心收拢（水平方向移动剩余边距的50%）
          const 背景边距 = 宽 - 背景显示宽
          背景X = 当前技能.是否我方
            ? 背景边距 * 0.5
            : 宽 - 背景显示宽 - 背景边距 * 0.5
          if (当前技能.是否我方) {
            // 我方：左对齐+向中心收拢
            动作背景.x = 背景X
          } else {
            // 敌方：右对齐+向中心收拢（翻转后 x 为图像右边缘）
            动作背景.x = 背景X + 背景显示宽
          }
          动作背景.zIndex = 1
          技能动画容器.addChild(动作背景)
        }

        // 3. 角色半身立绘（相对立绘背景定位：原目标宽为背景宽的65%，居中于背景，随背景宽度缩放）
        // 下端高度约束：入场时（容器y=纵轴偏移=4%屏高）立绘底部必须<=屏高的80%（底部留白20%），
        // 以立绘与背景整体作为单位反推最大缩放
        let 角色立绘: PIXI.Sprite | null = null
        let 立绘宽度 = 0
        let 立绘高度 = 0
        // 有专属站立立绘则用之；没有专属立绘（或加载失败）时回退到默认立绘
        const 专属立绘路径 = 获得资源(
          当前技能.美术资源,
          (f, i) => f === `character/CharacterStand_${i}.webp`
        )
        for (const 候选立绘路径 of [
          专属立绘路径,
          'pvp/field/CharacterStand.webp',
        ]) {
          if (!候选立绘路径) continue
          try {
            角色立绘 = await 加载子画面(候选立绘路径)
            break
          } catch {
            角色立绘 = null
          }
        }
        if (角色立绘) {
          try {
            // 基础目标尺寸：按背景宽×0.65推导
            const 目标宽度 = 背景显示宽 * 0.65
            let 缩放比 = 目标宽度 / 角色立绘.width
            立绘宽度 = 角色立绘.width * 缩放比
            立绘高度 = 角色立绘.height * 缩放比
            // 入场时动画容器起始y=纵轴偏移（4%屏高），立绘底部=容器y + 立绘在容器内的底部
            // 立绘在容器坐标中的底部 = 背景Y + (背景显示高+立绘高)/2
            const 入场纵轴偏移 = 高 * 0.04
            // 底部留白20%：立绘底部（含入场下移）不得超过屏高的80%
            const 最大允许立绘底部 = 高 * 0.8
            // 反推绝对最大立绘高：入场纵轴偏移 + 背景Y + (背景显示高+立绘高)/2 <= 屏高
            const 绝对最大立绘高 = Math.max(
              (最大允许立绘底部 - 入场纵轴偏移 - 背景Y) * 2 - 背景显示高,
              0
            )
            if (立绘高度 > 绝对最大立绘高) {
              缩放比 = (绝对最大立绘高 * 0.98) / 角色立绘.height
              立绘宽度 = 角色立绘.width * 缩放比
              立绘高度 = 角色立绘.height * 缩放比
            }
            const 立绘Y = 背景Y + (背景显示高 - 立绘高度) / 2
            角色立绘.scale.set(缩放比)
            角色立绘.x = 背景X + (背景显示宽 - 立绘宽度) / 2
            角色立绘.y = 立绘Y
            if (!当前技能.是否我方) {
              角色立绘.scale.x = -缩放比
              角色立绘.x = 背景X + (背景显示宽 + 立绘宽度) / 2
            }
            角色立绘.zIndex = 2
            技能动画容器.addChild(角色立绘)
          } catch {
            角色立绘 = null
          }
        }

        // 3b. 立绘上的技能名称 + 描述
        if (角色立绘) {
          const 文字最大宽度 = 立绘宽度 * 0.75
          const 立绘中心X = 当前技能.是否我方
            ? 角色立绘.x + 立绘宽度 / 2
            : 角色立绘.x - 立绘宽度 / 2
          const 立绘中心Y = 角色立绘.y + 立绘高度 / 2
          const 文字左边X = 立绘中心X - 文字最大宽度 / 2
          const 技能名称Y = 立绘中心Y - 立绘高度 * 0.05

          const 技能名称文字 = new PIXI.Text(当前技能.技能名称, {
            fill: 0xffeecc,
            fontSize: 背景显示高 * 0.048, // 随背景缩放（PC端803高≈20px）
            fontWeight: 'bold',
            stroke: 0x332200,
            strokeThickness: 背景显示高 * 0.0077,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: 文字最大宽度,
            align: 'left',
          })
          技能名称文字.anchor.set(0, 0.5)
          技能名称文字.x = 文字左边X
          技能名称文字.y = 技能名称Y
          技能名称文字.zIndex = 3
          技能动画容器.addChild(技能名称文字)

          const 技能描述文字 = new PIXI.Text(当前技能.技能描述, {
            fill: 0xffeecc,
            fontSize: 背景显示高 * 0.042, // 随背景缩放（PC端803高≈18px）
            stroke: 0x332200,
            strokeThickness: 背景显示高 * 0.0057,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: 文字最大宽度,
            align: 'left',
          })
          技能描述文字.anchor.set(0, 0)
          技能描述文字.x = 文字左边X
          技能描述文字.y =
            技能名称Y + 技能名称文字.height / 2 + 背景显示高 * 0.0077
          技能描述文字.zIndex = 3
          技能动画容器.addChild(技能描述文字)
        }

        // 动画轨迹参数：我方从最左端入场、向右离场，敌方相反；纵轴中线偏下→偏上小幅漂移
        const 动画边距 = 60
        const 入场起点X = 当前技能.是否我方
          ? -(背景X + 背景显示宽) - 动画边距
          : 宽 - 背景X + 动画边距
        const 出场终点X = 当前技能.是否我方
          ? 宽 - 背景X + 动画边距
          : -(背景X + 背景显示宽) - 动画边距
        const 纵轴幅度 = 高 * 0.04
        // 信息栏纹理加载期间先置于入场起点，避免在布局位置闪现
        技能动画容器.x = 入场起点X
        技能动画容器.y = 纵轴幅度

        // 4. 顶部信息栏（我方/敌方底图 + 头像 + 名称 + 属性图标）
        // 竖屏：底图铺满95%屏宽；横屏/PC：保持原设计大小（未拉伸高=基准*0.4，基准=0.8*设计宽/4.14）
        // 信息栏边界=底图实际渲染边界，内部元素基于信息栏基准（未拉伸高/0.4）缩放
        const 信息栏Y = 高 * 0.05

        // 4a. 信息栏底图（1/2到2/3处拉伸，其余正常）
        const 底图资源名 = 当前技能.是否我方
          ? 'pvp/jifang juese.webp'
          : 'pvp/difang juese.webp'
        const 底图纹理 = await PIXI.Assets.load(底图资源名)
        const 原始宽 = 底图纹理.width
        const 原始高 = 底图纹理.height
        const 顶部区域高 = (原始高 * 6) / 10
        const 拉伸起始Y = (原始高 * 6) / 10
        const 拉伸结束Y = (原始高 * 7) / 10
        const 拉伸区域高 = 拉伸结束Y - 拉伸起始Y
        const 底部区域高 = 原始高 - 拉伸结束Y
        const 拉伸倍数 = 11

        // 竖屏：底图铺满95%屏宽；横屏/PC：保持原设计大小（底图宽≈0.5*设计宽）
        const 缩放比 =
          宽 < 高
            ? (宽 * 0.95) / 原始宽
            : ((设计宽 * 0.8) / 4.14 / 原始高) * 0.4
        // 信息栏边界 = 底图实际渲染边界（信息栏高度 = 底图拉伸后总高）
        const 信息栏宽度 = 原始宽 * 缩放比
        // 元素基准：底图未拉伸高 = 基准*0.4，故 基准 = 未拉伸高/0.4
        const 信息栏基准 = (原始高 * 缩放比) / 0.4
        const 信息栏X = (宽 - 信息栏宽度) / 2

        const 顶部显示高 = 顶部区域高 * 缩放比
        const 拉伸显示高 = 拉伸区域高 * 拉伸倍数 * 缩放比

        const 总X = 信息栏X
        const 总Y = 信息栏Y

        // 上1/2 正常
        const 顶纹理 = new PIXI.Texture(
          底图纹理,
          new PIXI.Rectangle(0, 0, 原始宽, 顶部区域高)
        )
        const 顶部精灵 = new PIXI.Sprite(顶纹理)
        顶部精灵.scale.set(缩放比)
        顶部精灵.x = 总X
        顶部精灵.y = 总Y
        顶部精灵.zIndex = 3
        技能展示层.addChild(顶部精灵)

        // 1/2 到 2/3 区域拉伸
        const 中纹理 = new PIXI.Texture(
          底图纹理,
          new PIXI.Rectangle(0, 拉伸起始Y, 原始宽, 拉伸区域高)
        )
        const 中部精灵 = new PIXI.Sprite(中纹理)
        中部精灵.scale.set(缩放比, 缩放比 * 拉伸倍数)
        中部精灵.x = 总X
        中部精灵.y = 总Y + 顶部显示高
        中部精灵.zIndex = 3
        技能展示层.addChild(中部精灵)

        // 2/3 到底部 正常
        const 底纹理 = new PIXI.Texture(
          底图纹理,
          new PIXI.Rectangle(0, 拉伸结束Y, 原始宽, 底部区域高)
        )
        const 底部精灵 = new PIXI.Sprite(底纹理)
        底部精灵.scale.set(缩放比)
        底部精灵.x = 总X
        底部精灵.y = 总Y + 顶部显示高 + 拉伸显示高
        底部精灵.zIndex = 3
        技能展示层.addChild(底部精灵)

        // 4b. 头像（对准底图左侧头像框区域：横向约3.5%~24%底图宽）
        const 头像左X = 信息栏X + 信息栏基准 * 0.055
        const 头像纹理路径 = 获得资源(
          当前技能.美术资源,
          (f, i) => f === `character/CharacterHeadL_${i}.webp`
        )
        // 头像铺满头像框内部宽度（框约0.205底图宽）
        const 头像区域宽 = 信息栏基准 * 0.8
        if (头像纹理路径) {
          try {
            const 头像纹理 = await PIXI.Assets.load(头像纹理路径)
            const 头像精灵 = new PIXI.Sprite(头像纹理)
            const 原头像缩放 =
              (头像区域宽 * 0.78) / Math.max(头像纹理.width, 头像纹理.height)
            // 头像框相对于中心缩小到95%（中心位置保持不变）
            const 头像缩放 = 原头像缩放 * 0.95
            const 原显示宽 = 头像纹理.width * 原头像缩放
            const 原显示高 = 头像纹理.height * 原头像缩放
            const 新显示宽 = 头像纹理.width * 头像缩放
            const 新显示高 = 头像纹理.height * 头像缩放
            const 头像中心X = 头像左X + 原显示宽 / 2
            // 头像顶部与底图显示区顶部对齐，略微下移
            const 头像中心Y = 信息栏Y + 原显示高 / 2 + 信息栏基准 * 0.04
            头像精灵.scale.set(头像缩放)
            头像精灵.x = 头像中心X - 新显示宽 / 2
            头像精灵.y = 头像中心Y - 新显示高 / 2
            if (!当前技能.是否我方) {
              头像精灵.scale.x = -头像缩放
              头像精灵.x = 头像中心X + 新显示宽 / 2
            }
            头像精灵.zIndex = 2 // 放在信息栏底图（zIndex=3）下层
            技能展示层.addChild(头像精灵)
          } catch {
            // 忽略
          }
        }

        // 4c. 角色名（头像底部叠加，缩小到85%并向上移动）
        const 名字底图纹理 = await PIXI.Assets.load('pvp/juese mingcheng.webp')
        const 名字底图 = new PIXI.Sprite(名字底图纹理)
        const 名字缩放 = ((头像区域宽 * 0.95) / 名字底图纹理.width) * 0.85
        名字底图.scale.set(名字缩放)
        const 名字显示宽 = 名字底图纹理.width * 名字缩放
        // 名字底图与头像水平居中对齐（多出部分均分），贴头像框底部
        const 名字X = 头像左X + (头像区域宽 * 0.78 - 名字显示宽) / 2
        const 名字Y = 信息栏Y + 信息栏基准 * 0.57
        名字底图.x = 名字X
        名字底图.y = 名字Y
        if (!当前技能.是否我方) {
          名字底图.scale.x = -名字缩放
          名字底图.x = 名字X + 名字显示宽
        }
        名字底图.zIndex = 5
        技能展示层.addChild(名字底图)

        const 名字文字 = new PIXI.Text(当前技能.卡牌名称, {
          fill: 0xffffff,
          fontSize: 信息栏基准 * 0.07,
          stroke: 0x000000,
          strokeThickness: 设计高 * 0.0025,
        })
        名字文字.anchor.set(0.5, 0.5)
        名字文字.x = 名字X + 名字显示宽 / 2
        名字文字.y = 名字Y + 名字底图.height * 0.45
        名字文字.zIndex = 6
        技能展示层.addChild(名字文字)

        // 4d. 属性图标 + 数值（生命/攻击/移动）
        const 属性区域X = 信息栏X + 信息栏基准 * 1.421
        const 属性Y = 信息栏Y + 信息栏基准 * 0.03
        const 图标大小 = 信息栏基准 * 0.28 * 0.7 // 图标缩小80%
        const 属性间距 = 信息栏基准 * 0.298

        // 生命图标 + 数值
        const 生命图标纹理 = await PIXI.Assets.load(
          'pvp/juese icon shengming.webp'
        )
        const 生命图标 = new PIXI.Sprite(生命图标纹理)
        const 生命缩放 =
          图标大小 / Math.max(生命图标纹理.width, 生命图标纹理.height)
        生命图标.scale.set(生命缩放)
        生命图标.x = 属性区域X
        生命图标.y = 属性Y
        生命图标.zIndex = 4
        技能展示层.addChild(生命图标)

        const 命数值 = new PIXI.Text(`${当前技能.生命值}`, {
          fill: 0x90ee90, // 浅绿
          fontSize: 信息栏基准 * 0.1,
          stroke: 0x332200,
          strokeThickness: 设计高 * 0.004,
        })
        命数值.x = 属性区域X + 图标大小 - 信息栏基准 * 0.0157
        命数值.y = 属性Y + 图标大小 * 0.35
        命数值.zIndex = 4
        技能展示层.addChild(命数值)

        // 攻击图标 + 数值
        const 攻击图标纹理 = await PIXI.Assets.load(
          'pvp/juese icon gongji.webp'
        )
        const 攻击图标 = new PIXI.Sprite(攻击图标纹理)
        攻击图标.scale.set(生命缩放)
        攻击图标.x = 属性区域X + 属性间距
        攻击图标.y = 属性Y
        攻击图标.zIndex = 4
        技能展示层.addChild(攻击图标)

        const 攻数值 = new PIXI.Text(`${当前技能.攻击力}`, {
          fill: 0xff9999, // 浅红
          fontSize: 信息栏基准 * 0.1,
          stroke: 0x332200,
          strokeThickness: 设计高 * 0.004,
        })
        攻数值.x = 属性区域X + 属性间距 + 图标大小 - 信息栏基准 * 0.0157
        攻数值.y = 属性Y + 图标大小 * 0.35
        攻数值.zIndex = 4
        技能展示层.addChild(攻数值)

        // 移动图标 + 数值
        const 移动图标纹理 = await PIXI.Assets.load(
          'pvp/juese icon yidong.webp'
        )
        const 移动图标 = new PIXI.Sprite(移动图标纹理)
        移动图标.scale.set(生命缩放)
        移动图标.x = 属性区域X + 属性间距 * 2
        移动图标.y = 属性Y
        移动图标.zIndex = 4
        技能展示层.addChild(移动图标)

        const 移数值 = new PIXI.Text(`${当前技能.移动力}`, {
          fill: 0xadd8e6, // 浅蓝
          fontSize: 信息栏基准 * 0.1,
          stroke: 0x332200,
          strokeThickness: 设计高 * 0.004,
        })
        移数值.x = 属性区域X + 属性间距 * 2 + 图标大小 - 信息栏基准 * 0.0157
        移数值.y = 属性Y + 图标大小 * 0.35
        移数值.zIndex = 4
        技能展示层.addChild(移数值)

        // 4e. 信息栏内的技能描述（与立绘上同格式）
        // 文字区域铺满信息栏剩余宽度；若换行后高度超出信息栏则自动缩小字号
        const 信息栏文字X = 属性区域X - 信息栏基准 * 0.6955
        const 信息栏文字宽 =
          信息栏X + 信息栏宽度 - 信息栏文字X - 信息栏基准 * 0.0994
        const 信息栏描述Y = 信息栏Y + 信息栏基准 * 0.25
        // 垂直可用空间：描述顶部到信息栏底部（信息栏总高=0.8基准）留 0.05基准 边距
        const 信息栏可用高 = 信息栏Y + 信息栏基准 * 0.75 - 信息栏描述Y

        const 信息栏样式 = {
          fill: 0xffeecc,
          fontSize: 信息栏基准 * 0.08,
          stroke: 0x332200,
          strokeThickness: 设计高 * 0.004,
          wordWrap: true,
          breakWords: true,
          wordWrapWidth: 信息栏文字宽,
          align: 'left' as const,
        }
        const 信息栏技能描述 = new PIXI.Text(当前技能.技能描述, 信息栏样式)
        // 超出信息栏高度则缩小字号（最低缩到0.03基准），换行宽度保持铺满
        let 当前字号 = 信息栏基准 * 0.08
        while (
          信息栏技能描述.height > 信息栏可用高 &&
          当前字号 > 信息栏基准 * 0.03
        ) {
          当前字号 *= 0.9
          信息栏技能描述.style.fontSize = 当前字号
        }
        信息栏技能描述.anchor.set(0, 0)
        信息栏技能描述.x = 信息栏文字X
        信息栏技能描述.y = 信息栏描述Y
        信息栏技能描述.zIndex = 6
        技能展示层.addChild(信息栏技能描述)

        // 播放技能语音
        try {
          播放技能语音(当前技能.美术资源)
        } catch {
          // 忽略语音错误
        }

        // 统一运动动画（背景+立绘+文字整体）：
        // 入场快到慢减速停在屏幕中心，停留后向另一侧慢到快加速离场（轨迹参数见信息栏前声明）
        const 缓出 = (t: number) => 1 - Math.pow(1 - t, 3) // 快到慢
        const 缓入 = (t: number) => t * t * t // 慢到快

        // 入场：快到慢滑入屏幕中心
        await 补间(0.5, 缓出, (p) => {
          技能动画容器.x = 入场起点X * (1 - p)
          技能动画容器.y = 纵轴幅度 * (1 - p)
        })

        // 在屏幕中心停留
        await 等待(1.2)

        // 出场：慢到快滑向另一侧边缘（纵轴略偏上）
        await 补间(0.45, 缓入, (p) => {
          技能动画容器.x = 出场终点X * p
          技能动画容器.y = -纵轴幅度 * p
        })

        // 淡出剩余元素（遮罩与信息栏）
        const 淡出时间 = 0.3
        const 开始时间 = Date.now()
        await new Promise<void>((resolve) => {
          function 淡出动画() {
            const 进度 = (Date.now() - 开始时间) / (淡出时间 * 1000)
            if (进度 >= 1) {
              resolve()
            } else {
              技能展示层.alpha = 1 - 进度
              requestAnimationFrame(淡出动画)
            }
          }
          淡出动画()
        })

        // 清除展示层并重置透明度
        技能展示层.removeChild(...技能展示层.children)
        技能展示层.alpha = 1
      } catch (e) {
        // 出错时清空展示层并重置透明度
        技能展示层.removeChild(...技能展示层.children)
        技能展示层.alpha = 1
      }
    }
    正在展示技能 = false
  }

  玩家类.事件.on(
    '技能触发时',
    (参数: {
      技能名称: string
      技能描述: string
      携带者编号: number
      美术资源: number[]
      是否我方: boolean
      卡牌名称: string
      携带者类型: string
      生命值: number
      攻击力: number
      移动力: number
    }) => {
      显示技能UI(参数)
    }
  )

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
  const 上一次选择位置 = { 行: 0, 列: 0 }

  // 抽取公共函数：处理选择单位逻辑
  function 处理选择单位(
    坐标: { screenX: number; screenY: number },
    迷雾层子项: PIXI.Container<PIXI.DisplayObject>
  ) {
    if (!是否在区域中(坐标, 迷雾层子项)) return undefined

    const { 行, 列 } = 获得位置(坐标, 迷雾层子项)
    return 玩家
      .我方(单位类)
      .find((_神) => _神.位置.行 == 行 && _神.位置.列 == 列)
  }

  // 抽取公共函数：渲染攻击目标范围
  async function 渲染攻击目标范围(神: 单位类, 位置: 位置类) {
    攻击目标层.removeChild(...攻击目标层.children)

    for (let _位置 of 神.获得攻击范围(位置)) {
      let 选择攻击目标图 = await 加载子画面('pvp/attack 1.webp')
      选择攻击目标图.x = 迷雾层.children[1].x + 位宽 * (_位置.列 - 1)
      选择攻击目标图.y = 迷雾层.children[1].y + 位宽 * (_位置.行 - 1)
      选择攻击目标图.width = 位宽
      选择攻击目标图.height = 位宽
      攻击目标层.addChild(选择攻击目标图)
    }

    if (是否移动端) {
      let 攻击目标确认图 = await 加载子画面('pvp/queding 1.webp')
      攻击目标确认图.x = 迷雾层.children[1].x + 位宽 * (位置.列 - 1)
      攻击目标确认图.y = 迷雾层.children[1].y + 位宽 * (位置.行 - 1 + 0.25)
      const 原始宽高比 = 攻击目标确认图.width / 攻击目标确认图.height
      攻击目标确认图.width = 位宽
      攻击目标确认图.height = 位宽 / 原始宽高比
      攻击目标层.addChild(攻击目标确认图)
    }
  }

  事件层.on('pointerdown', (e) => {
    触摸开始时间 = Date.now()
    const 坐标 = { screenX: e.screenX, screenY: e.screenY }

    if (状态.value == '布阵') {
      if (选中的单位.value !== undefined) return

      const 神 = 处理选择单位(坐标, 迷雾层.children[0])
      if (神 !== undefined) {
        选中的单位.value = 神
        播放音频('prebattle/抓起神明.mp3')
      }
    } else if (状态.value == '战斗') {
      // 检查是否点击我方单位
      if (是否在区域中(坐标, 迷雾层.children[0])) {
        const 神 = 处理选择单位(坐标, 迷雾层.children[0])

        if (神 !== undefined) {
          选中的单位.value = 神

          // 检查是否可以装填弹幕
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
          // 尝试移动单位
          const 神 = 选中的单位.value
          const { 行, 列 } = 获得位置(坐标, 迷雾层.children[0])

          for (const 位置 of 神.获得移动范围()) {
            if (位置.行 == 行 && 位置.列 == 列) {
              行动队列类.行动队列.添加(['移动', 神.id, 行, 列])
              return
            }
          }
        }
      } else if (!是否在区域中(坐标, 迷雾层.children[1])) {
        // 点击到其他区域，取消选择
        选中的单位.value = undefined
        选择攻击目标模式 = false
      }

      待装填的弹幕卡.value = undefined
    }
  })

  事件层.on('pointermove', async (e) => {
    const 坐标 = { screenX: e.screenX, screenY: e.screenY }

    if (选中的单位.value !== undefined) {
      const 神 = 选中的单位.value

      if (状态.value == '布阵') {
        // 布阵阶段移动单位
        神.角色.x = 坐标.screenX - 迷雾层.children[0].x - 位宽 / 2
        神.角色.y = 坐标.screenY - 迷雾层.children[0].y - 位宽 / 2
        神.角色.zIndex = 神.角色.y
        神.角色.parent.sortChildren()
      }

      // 战斗阶段显示攻击范围
      if (
        状态.value == '战斗' &&
        选择攻击目标模式 &&
        是否在区域中(坐标, 迷雾层.children[1])
      ) {
        const { 行, 列 } = 获得位置(坐标, 迷雾层.children[1])
        const 位置 = 玩家.敌方(位置类).find((x) => x.行 == 行 && x.列 == 列)!
        await 渲染攻击目标范围(神, 位置)
      } else {
        攻击目标层.removeChild(...攻击目标层.children)
      }
    }
  })

  事件层.on('pointerup', async (e) => {
    const 坐标 = { screenX: e.screenX, screenY: e.screenY }
    if (0) console.log(Date.now() - 触摸开始时间, 获取触摸y轴偏移)

    if (状态.value == '布阵') {
      if (
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
      }
    } else if (状态.value == '战斗') {
      if (是否在区域中(坐标, 迷雾层.children[1])) {
        if (选中的单位.value !== undefined && 选择攻击目标模式) {
          const 神 = 选中的单位.value
          const { 行, 列 } = 获得位置(坐标, 迷雾层.children[1])
          const 位置 = 玩家.敌方(位置类).find((x) => x.行 == 行 && x.列 == 列)!

          if (
            !是否移动端 ||
            (位置.行 == 上一次选择位置.行 && 位置.列 == 上一次选择位置.列)
          ) {
            // 执行攻击
            攻击目标层.removeChild(...攻击目标层.children)
            选择攻击目标模式 = false
            上一次选择位置.行 = 0
            上一次选择位置.列 = 0
            行动队列类.行动队列.添加(['攻击', 神.id, 位置.行, 位置.列])
          } else {
            // 更新选择位置
            上一次选择位置.行 = 位置.行
            上一次选择位置.列 = 位置.列
            await 渲染攻击目标范围(神, 位置)
          }
        }
      } else {
        // 点击到区域外，取消攻击模式
        选择攻击目标模式 = false
        上一次选择位置.行 = 0
        上一次选择位置.列 = 0
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
      if (是否我方) {
        玩家.祈愿消耗结算()
      } else {
        玩家.敌方玩家.祈愿消耗结算()
      }
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
      // 出卡前已选定的目标/装填单位随行动同步，双端在渲染技能时直接采用
      神迹卡.本次使用选择 = 行动[2]
      神迹卡.本次装填选择 = 行动[3]
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
          // 标记神威播放中，暂停技能UI显示
          神威播放中 = true
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
          // 神威动画完成，恢复技能UI显示
          神威完成()
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
          if (是否我方) {
            玩家.祈愿()
          } else {
            玩家.敌方玩家.祈愿()
          }
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
      数据通道.发送行动(行动)
    })
    状态.value = '战斗'
  })
  数据通道.on('收到数据', (d: 数据同步类型) => {
    if (d.k == '行动') {
      行动队列类.行动队列.接收(d.v)
    } else if (d.k == '初始数据') {
      行动队列类.行动队列.重置远程排序() // 新一局开始，清空上一局的排序状态
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
    // 点阵固定显示当前回合玩家的行动点：任何一方的行动点事件都只触发重算，
    // 避免事件来源玩家与当前回合玩家不一致时显示被污染（如技能效果恢复/扣减对方费用）
    const 更新祈愿点 = () => {
      if (玩家类.我方回合 !== false) {
        红祈愿点.visible = false
        蓝祈愿点.visible = 玩家.行动点 > i
      } else {
        蓝祈愿点.visible = false
        红祈愿点.visible = 玩家.敌方玩家.行动点 > i
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
  // 固定显示当前回合玩家的祈愿倒计时，避免双方倒计时事件互相污染
  玩家类.事件.on('祈愿倒计时变化时', () => {
    抽卡倒计时.text =
      玩家类.我方回合 !== false ? 玩家.祈愿倒计时 : 玩家.敌方玩家.祈愿倒计时
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
                // 出卡前先选择目标/装填单位；取消则什么都不发生（本地取消，卡牌不打出）
                let 需选择 = false
                let 目标列表: 目标类[] = []
                if (!玩家.无效化下次使用的神迹卡) {
                  if (v.类型 == '秘术卡') {
                    需选择 = true
                    目标列表 = v.使用前装填候选()
                  } else {
                    const 候选 = v.使用前目标候选()
                    if (候选 !== undefined) {
                      需选择 = true
                      目标列表 = 候选
                    }
                  }
                }
                if (需选择 && 行动队列类.行动队列.待渲染.length !== 0) {
                  // 待队列渲染完成后再出卡，保证预选目标列表与渲染时一致
                  return
                }
                if (!需选择) {
                  // 无需选目标（或为“争议”等无效化场景），直接使用
                  行动队列类.行动队列.添加(['使用神迹', v.id])
                } else if (目标列表.length === 0) {
                  // 没有可用的目标，等同于本地取消，卡牌不打出
                  return
                } else {
                  const 选中的索引 = await 弹窗选择目标(目标列表, true)
                  if (选中的索引 === null) {
                    // 点了取消，什么都没发生
                    return
                  }
                  if (v.类型 == '秘术卡') {
                    行动队列类.行动队列.添加([
                      '使用神迹',
                      v.id,
                      undefined,
                      选中的索引,
                    ])
                  } else {
                    行动队列类.行动队列.添加(['使用神迹', v.id, 选中的索引])
                  }
                }
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
